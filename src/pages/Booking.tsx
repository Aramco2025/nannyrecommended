import { useEffect, useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSitter } from "@/hooks/useSitters";
import { useAuth } from "@/hooks/useAuth";
import { FeeBreakdown } from "@/components/FeeBreakdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const stripePromise = loadStripe(import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string);

const Booking = () => {
  const { sitterId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: sitter, isLoading } = useSitter(sitterId);

  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState("19:00");
  const [hours, setHours] = useState(4);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  if (isLoading || authLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!sitter) return <Navigate to="/sitters" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign in to book", description: "Create an account to confirm your booking." });
      navigate(`/auth?mode=signup&role=parent`);
      return;
    }
    setBusy(true);
    try {
      const start = new Date(`${date}T${startTime}:00`);
      const { data, error } = await supabase.functions.invoke("create-booking-checkout", {
        body: {
          sitter_id: sitter.id,
          start_at: start.toISOString(),
          hours,
          address: address || null,
          notes: notes || null,
          return_url: `${window.location.origin}/account`,
        },
      });
      if (error) throw error;
      if (!data?.client_secret) throw new Error("No checkout session returned");
      setClientSecret(data.client_secret);
    } catch (err: any) {
      toast({ title: "Could not start checkout", description: err.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  if (clientSecret) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-2xl py-8">
          <button onClick={() => setClientSecret(null)} className="text-sm text-slate-grey hover:text-pitch-black">← Back to booking details</button>
          <h1 className="mt-4 font-display text-2xl font-semibold text-pitch-black">Complete payment</h1>
          <p className="mt-1 text-sm text-slate-grey">Test mode — use card <code className="rounded bg-muted px-1">4242 4242 4242 4242</code>, any future date, any CVC.</p>
          <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8 md:py-12">
        <Link to={`/sitters/${sitter.id}`} className="text-sm text-slate-grey hover:text-pitch-black">← Back to {sitter.name}'s profile</Link>
        <h1 className="mt-4 text-2xl font-semibold text-pitch-black md:text-3xl">Book {sitter.name}</h1>
        <p className="mt-1 text-sm text-slate-grey">All fees shown upfront. Payment is held until job is complete.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                </Field>
                <Field label="Start time">
                  <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                </Field>
                <Field label="Duration">
                  <select value={hours} onChange={e => setHours(Number(e.target.value))}
                    className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm">
                    {[2, 3, 4, 5, 6, 8].map(h => <option key={h} value={h}>{h} hours</option>)}
                  </select>
                </Field>
                <Field label="Address">
                  <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Marina Promenade, Dubai" maxLength={200} />
                </Field>
              </div>
            </Card>

            <Card>
              <Field label="Special instructions (optional)">
                <Textarea rows={4} value={notes} maxLength={1000}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Bedtime is 8pm. Snacks in the fridge." />
              </Field>
            </Card>

            <div className="lg:hidden">
              <FeeBreakdown hourlyRate={sitter.hourlyRate} hours={hours}
                completedBookingsTogether={0} currency={sitter.currency} />
            </div>

            <div className="rounded-2xl border border-border bg-off-white p-4 text-xs text-slate-grey">
              🔒 Your payment is held safely until the booking is complete. {sitter.name.split(" ")[0]} only gets paid when you confirm she showed up and did the job.
            </div>

            <Button type="submit" disabled={busy} size="lg" className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              {busy ? "Starting checkout…" : !user ? "Sign in to book" : "Continue to payment"}
            </Button>
            <p className="text-center text-xs text-slate-grey">Secure payment powered by Stripe.</p>
          </form>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FeeBreakdown hourlyRate={sitter.hourlyRate} hours={hours}
                completedBookingsTogether={0} currency={sitter.currency} />
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-border bg-card p-5 shadow-card">{children}</div>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-grey">{label}</Label>
      {children}
    </div>
  );
}

export default Booking;
