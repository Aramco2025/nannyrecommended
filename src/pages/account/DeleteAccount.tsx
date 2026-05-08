import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";

type Step = "consequences" | "confirm" | "done";

export default function DeleteAccount() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("consequences");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  if (!user && step !== "done") {
    navigate("/auth", { replace: true });
    return null;
  }

  const handleDelete = async () => {
    if (confirm !== "DELETE") return;
    setBusy(true);
    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;
      setStep("done");
      // Sign out after the success screen renders.
      setTimeout(async () => {
        await signOut();
        navigate("/", { replace: true });
      }, 5000);
    } catch (e) {
      toast({
        title: "Could not delete account",
        description: (e as Error).message,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-10">
        {step === "consequences" && (
          <section className="rounded-3xl border border-destructive/20 bg-card p-8 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-pitch-black">Delete your account</h1>
                <p className="mt-1 text-sm text-slate-grey">This is permanent. Please read what happens next.</p>
              </div>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-pitch-black">
              <li className="rounded-xl bg-muted p-3">
                <strong>Active bookings will be cancelled</strong> per our standard policy. Refunds (if any) follow the timing rules.
              </li>
              <li className="rounded-xl bg-muted p-3">
                <strong>Your profile, messages, and preferences are removed.</strong> Booking history is anonymised so the people you've booked with keep their records.
              </li>
              <li className="rounded-xl bg-muted p-3">
                <strong>Full data deletion within 30 days.</strong> Backups age out on a 30-day cycle.
              </li>
              <li className="rounded-xl bg-muted p-3">
                <strong>You can't undo this.</strong> If you change your mind, you'll need to create a new account.
              </li>
            </ul>

            <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
              <Button
                onClick={() => setStep("confirm")}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                I understand, continue
              </Button>
            </div>
          </section>
        )}

        {step === "confirm" && (
          <section className="rounded-3xl border border-destructive/20 bg-card p-8 shadow-card">
            <h1 className="font-display text-2xl font-bold text-pitch-black">Final confirmation</h1>
            <p className="mt-2 text-sm text-slate-grey">
              Type <span className="font-mono font-semibold text-pitch-black">DELETE</span> below to permanently delete your account.
            </p>

            <div className="mt-6 space-y-2">
              <Label className="text-xs text-slate-grey">Confirm</Label>
              <Input
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="DELETE"
                autoFocus
              />
            </div>

            <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={() => setStep("consequences")} disabled={busy}>
                Back
              </Button>
              <Button
                onClick={handleDelete}
                disabled={confirm !== "DELETE" || busy}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete my account forever"}
              </Button>
            </div>
          </section>
        )}

        {step === "done" && (
          <section className="rounded-3xl border border-border bg-card p-8 text-center shadow-card">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-salmon-soft text-salmon-deep">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h1 className="mt-4 font-display text-2xl font-bold text-pitch-black">Your account is deleted</h1>
            <p className="mt-2 text-sm text-slate-grey">
              We've sent a confirmation to <strong>{user?.email}</strong>. You'll be signed out and returned home shortly.
            </p>
            <p className="mt-4 text-xs text-slate-grey">
              Sorry to see you go. If this was a mistake, contact support within 24 hours.
            </p>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
