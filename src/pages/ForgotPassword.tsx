import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-md py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <h1 className="text-2xl font-semibold text-pitch-black">Reset your password</h1>
          {sent ? (
            <p className="mt-3 text-sm text-slate-grey">
              If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <>
              <p className="mt-1 text-sm text-slate-grey">Enter your email and we'll send a reset link.</p>
              <form onSubmit={submit} className="mt-5 space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-grey">Email</Label>
                  <Input type="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <Button type="submit" disabled={busy} size="lg" className="w-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                  {busy ? "Sending…" : "Send reset link"}
                </Button>
              </form>
            </>
          )}
          <div className="mt-5 text-center text-sm text-slate-grey">
            <Link to="/auth" className="underline">Back to sign in</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
