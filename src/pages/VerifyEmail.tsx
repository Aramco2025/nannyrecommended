import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(params.get("email") ?? "");
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);

  // Resolve email from session if not provided
  useEffect(() => {
    if (email) return;
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setEmail(data.user.email);
    });
  }, [email]);

  // Cooldown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  // Poll for verification
  useEffect(() => {
    const interval = setInterval(async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user?.email_confirmed_at) {
        clearInterval(interval);
        toast({ title: "Email verified" });
        navigate("/onboarding/role", { replace: true });
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [navigate]);

  const resend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      if (error) throw error;
      toast({ title: "Verification email sent", description: `Check ${email}.` });
      setCooldown(60);
    } catch (e) {
      toast({ title: "Could not resend", description: (e as Error).message, variant: "destructive" });
    } finally {
      setResending(false);
    }
  };

  const checkNow = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user?.email_confirmed_at) {
      toast({ title: "Not verified yet", description: "Click the link in your email, then try again." });
      return;
    }
    navigate("/onboarding/role", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md py-12">
        <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-salmon-soft text-salmon-deep">
            <Mail className="h-7 w-7" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-pitch-black">Check your inbox</h1>
          <p className="mt-2 text-sm text-slate-grey">
            We sent a verification link to{" "}
            <strong className="text-pitch-black">{email || "your email"}</strong>.
            Click it to finish setting up your account.
          </p>

          <div className="mt-6 space-y-2">
            <Button onClick={checkNow} className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              I've verified, continue
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={resend}
              disabled={resending || cooldown > 0 || !email}
            >
              {resending ? <Loader2 className="h-4 w-4 animate-spin" /> :
                cooldown > 0 ? `Resend in ${cooldown}s` : "Resend email"}
            </Button>
          </div>

          <div className="mt-6 text-xs text-slate-grey">
            Don't have access to email?{" "}
            <Link to="/onboarding/phone" className="font-medium text-pitch-black underline">
              Use phone instead
            </Link>
          </div>

          <div className="mt-2 text-xs text-slate-grey">
            <Link to="/auth/help" className="underline">Need help?</Link>
            {" · "}
            <Link to="/auth" className="underline">Back to sign in</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
