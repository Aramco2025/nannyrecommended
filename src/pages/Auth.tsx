import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
        if (error) throw error;
        toast({ title: "Welcome!", description: "Account created." });
        navigate(role === "sitter" ? "/sitter/dashboard" : "/account");
      } else {
        const parsed = signInSchema.safeParse({ email, password });
        if (!parsed.success) {
          toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
          return;
        }
        const { error } = await supabase.auth.signInWithPassword({
          email: parsed.data.email, password: parsed.data.password,
        });
        if (error) throw error;
        toast({ title: "Signed in" });
        navigate("/account");
      }
    } catch (err: any) {
      toast({ title: "Auth error", description: err.message ?? "Try again", variant: "destructive" });
    } finally {
      setLoading(false);
    }
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
          <div className="mt-2 text-center text-xs text-slate-grey">
            <Link to="/" className="underline">Back to home</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
