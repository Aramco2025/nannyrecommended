import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "@/hooks/use-toast";
import { SmsOtpForm } from "@/components/auth/SmsOtpForm";
import { logAuthAttempt } from "@/lib/auth/methods";
import { isNativeApp, nativePlatform } from "@/lib/platform";

const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "At least 6 characters").max(72),
});

const signUpSchema = signInSchema.extend({
  fullName: z.string().trim().min(1, "Required").max(120),
  role: z.enum(["parent", "sitter"]),
});

const Auth = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialMode = (params.get("mode") as "signin" | "signup") || "signin";
  const initialRole = (params.get("role") as "parent" | "sitter") || "parent";
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [role, setRole] = useState<"parent" | "sitter">(initialRole);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedTries, setFailedTries] = useState(0);
  const [showSms, setShowSms] = useState(false);

  const recordError = (where: string, message: string) => {
    sessionStorage.setItem("nr_last_auth_error", JSON.stringify({ at: where, message, ts: Date.now() }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const parsed = signUpSchema.safeParse({ fullName, email, password, role });
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: parsed.data.fullName, role: parsed.data.role },
          },
        });
        if (error) {
          // Dual-account / role-merge nudge
          if (/already.*registered|user already/i.test(error.message)) {
            recordError("signup_dup", error.message);
            await logAuthAttempt({ email_or_phone: parsed.data.email, method: "email_password", success: false, error_code: "duplicate_account", error_message: error.message });
            toast({
              title: "You already have an account",
              description: "Sign in instead — we'll add the new role to your existing account.",
            });
            setMode("signin");
            return;
          }
          throw error;
        }
        await logAuthAttempt({ email_or_phone: parsed.data.email, method: "email_password", success: true });

        // Capture referral code if present in URL
        const refCode = params.get("ref");
        if (refCode) {
          try {
            const { data: refRow } = await supabase
              .from("referral_codes").select("user_id").eq("code", refCode.toUpperCase()).maybeSingle();
            const { data: { user: newUser } } = await supabase.auth.getUser();
            if (refRow?.user_id && newUser && refRow.user_id !== newUser.id) {
              await supabase.from("referrals").insert({
                referrer_id: refRow.user_id,
                referred_user_id: newUser.id,
                code: refCode.toUpperCase(),
              });
            }
          } catch (e) { /* non-fatal */ }
        }

        toast({ title: "Welcome!", description: refCode ? "Account created. Your AED 50 credit unlocks after your first booking." : "Account created. Check your email to verify." });
        navigate(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email, password: parsed.data.password,
        });
        if (error) {
          await logAuthAttempt({ email_or_phone: parsed.data.email, method: "email_password", success: false, error_code: "signin_failed", error_message: error.message });
          recordError("signin", error.message);
          setFailedTries((n) => n + 1);
          throw error;
        }
        await logAuthAttempt({ email_or_phone: parsed.data.email, method: "email_password", success: true });
        toast({ title: "Signed in" });
        navigate("/account");
      }
    } catch (err: any) {
      toast({ title: "Auth error", description: err.message ?? "Try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      const result = await lovable.auth.signInWithOAuth(provider, {
        redirect_uri: `${window.location.origin}/account`,
      });
      if (result.error) throw result.error;
      if (!result.redirected) navigate("/account");
    } catch (err: any) {
      toast({ title: "Sign-in error", description: err.message ?? "Try again", variant: "destructive" });
    }
  };

  const handleFacebookNotice = () => {
    toast({
      title: "Facebook sign-in coming soon",
      description: "We're adding Facebook login shortly. Please use Google, Apple, or email for now.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h1 className="text-2xl font-semibold text-pitch-black">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-slate-grey">
            {mode === "signup" ? "Free to join. Test cards available for payments." : "Sign in to manage bookings."}
          </p>

          <div className="mt-5 space-y-2">
            {isNativeApp() && nativePlatform() === "ios" && (
              <Button type="button" variant="outline" size="lg" onClick={() => handleOAuth("apple")}
                className="w-full justify-center gap-3 border-border bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M16.365 1.43c0 1.14-.49 2.27-1.27 3.05-.83.84-2.21 1.49-3.32 1.4-.13-1.13.43-2.31 1.21-3.07.86-.85 2.32-1.48 3.38-1.38zM21 17.21c-.53 1.18-.79 1.71-1.47 2.76-.95 1.45-2.29 3.27-3.95 3.28-1.48.02-1.86-.96-3.86-.95-2 .01-2.42.97-3.9.95-1.66-.02-2.93-1.66-3.88-3.11C1.49 16.2 1.21 11.4 2.85 8.91c1.16-1.77 3-2.81 4.72-2.81 1.76 0 2.86.97 4.31.97 1.4 0 2.26-.97 4.29-.97 1.54 0 3.18.84 4.34 2.29-3.81 2.09-3.19 7.55.49 8.82z"/>
                </svg>
                Continue with Apple
              </Button>
            )}
            <Button type="button" variant="outline" size="lg" onClick={() => handleOAuth("google")}
              className="w-full justify-center gap-3 border-border bg-pure-white text-pitch-black hover:bg-muted">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continue with Google
            </Button>
            {!(isNativeApp() && nativePlatform() === "ios") && (
              <Button type="button" variant="outline" size="lg" onClick={() => handleOAuth("apple")}
                className="w-full justify-center gap-3 border-border bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M16.365 1.43c0 1.14-.49 2.27-1.27 3.05-.83.84-2.21 1.49-3.32 1.4-.13-1.13.43-2.31 1.21-3.07.86-.85 2.32-1.48 3.38-1.38zM21 17.21c-.53 1.18-.79 1.71-1.47 2.76-.95 1.45-2.29 3.27-3.95 3.28-1.48.02-1.86-.96-3.86-.95-2 .01-2.42.97-3.9.95-1.66-.02-2.93-1.66-3.88-3.11C1.49 16.2 1.21 11.4 2.85 8.91c1.16-1.77 3-2.81 4.72-2.81 1.76 0 2.86.97 4.31.97 1.4 0 2.26-.97 4.29-.97 1.54 0 3.18.84 4.34 2.29-3.81 2.09-3.19 7.55.49 8.82z"/>
                </svg>
                Continue with Apple
              </Button>
            )}
            {!isNativeApp() && (
              <Button type="button" variant="outline" size="lg" onClick={handleFacebookNotice}
                className="w-full justify-center gap-3 border-transparent bg-[#1877F2] text-pure-white hover:bg-[#166fe0]">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.49 0-1.95.93-1.95 1.89v2.26h3.32l-.53 3.49h-2.79V24C19.61 23.1 24 18.1 24 12.07z"/>
                </svg>
                Continue with Facebook
              </Button>
            )}
          </div>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider text-slate-grey">or with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {mode === "signup" && (
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setRole("parent")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${role === "parent" ? "border-pitch-black bg-pitch-black text-pure-white" : "border-border bg-card text-slate-grey"}`}>
                I'm a parent
              </button>
              <button type="button" onClick={() => setRole("sitter")}
                className={`rounded-lg border px-3 py-2 text-sm font-medium ${role === "sitter" ? "border-pitch-black bg-pitch-black text-pure-white" : "border-border bg-card text-slate-grey"}`}>
                I'm a sitter
              </button>
            </div>
          )}

          <form className="mt-5 space-y-4" onSubmit={submit}>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label className="text-xs text-slate-grey">Full name</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} required maxLength={120} />
              </div>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-grey">Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-grey">Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} maxLength={72} />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              {loading ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <button type="button" onClick={() => setShowSms((v) => !v)} className="text-xs uppercase tracking-wider text-slate-grey underline">
              {showSms ? "Hide SMS option" : "Or use SMS code instead"}
            </button>
            <div className="h-px flex-1 bg-border" />
          </div>

          {showSms && (
            <SmsOtpForm onVerified={() => { toast({ title: "Phone verified" }); navigate("/account"); }} />
          )}

          <div className="mt-5 text-center text-sm text-slate-grey">
            {mode === "signup" ? (
              <>Already have an account?{" "}
                <button onClick={() => setMode("signin")} className="font-medium text-pitch-black underline">Sign in</button>
              </>
            ) : (
              <>New here?{" "}
                <button onClick={() => setMode("signup")} className="font-medium text-pitch-black underline">Create an account</button>
              </>
            )}
          </div>
          {mode === "signin" && (
            <div className="mt-2 text-center text-sm">
              <Link to="/forgot-password" className="text-slate-grey underline hover:text-pitch-black">Forgot password?</Link>
            </div>
          )}
          {failedTries >= 3 && (
            <div className="mt-3 rounded-lg bg-salmon/10 p-3 text-center text-xs text-salmon-deep">
              Stuck? <Link to="/auth/help" className="font-medium underline">Talk to support</Link> — we'll get you in within 30 minutes.
            </div>
          )}
          <div className="mt-2 text-center text-xs text-slate-grey">
            <Link to="/auth/help" className="underline">I can't sign in / I never got my code</Link>
            {" · "}
            <Link to="/" className="underline">Back to home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
