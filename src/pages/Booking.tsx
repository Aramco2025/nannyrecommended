import { useState } from "react";
import { Link, useParams, Navigate, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSitter } from "@/hooks/useSitters";
import { useAuth } from "@/hooks/useAuth";
import { FeeBreakdown } from "@/components/FeeBreakdown";
import { calculateFee } from "@/lib/fees";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

  // simplified: assume 0 prior bookings together for this MVP
  const completedBookingsTogether = 0;

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
      const end = new Date(start.getTime() + hours * 3600 * 1000);
      const subtotal = sitter.hourlyRate * hours;
      const fee = calculateFee(completedBookingsTogether, subtotal);

      // 1. Mock card charge (replace with Stripe Checkout post-MVP)
      const { chargeCard } = await import("@/lib/payments/stripe");
      const charge = await chargeCard({
        amountMinor: Math.round(fee.parentPays * 100),
        currency: sitter.currency,
      });
      if (!charge.success) throw new Error("Card was declined");

      // 2. Create the booking
      const { data, error } = await supabase.from("bookings").insert({
        parent_id: user.id,
        sitter_id: sitter.id,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        hours,
        hourly_rate_aed: sitter.hourlyRate,
        subtotal_aed: subtotal,
        platform_fee_aed: fee.platformRevenue,
        sitter_payout_aed: fee.sitterReceives,
        total_aed: fee.parentPays,
        status: "pending",
        address,
        notes,
        payment_method_ref: charge.transactionId,
      }).select("id").single();
      if (error) throw error;

      // 3. Mark funds held in escrow
      await supabase.rpc("create_booking_escrow", { _booking: data.id });

      toast({ title: "Booking confirmed", description: `Payment held safely until ${sitter.name.split(" ")[0]} completes the job.` });
      navigate("/account");
    } catch (err: any) {
      toast({ title: "Could not create booking", description: err.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

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
                completedBookingsTogether={completedBookingsTogether} currency={sitter.currency} />
            </div>

            <div className="rounded-2xl border border-border bg-off-white p-4 text-xs text-slate-grey">
              🔒 Your payment is held safely until the booking is complete. {sitter.name.split(" ")[0]} only gets paid when you confirm she showed up and did the job.
            </div>

            <Button type="submit" disabled={busy} size="lg" className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              {busy ? "Processing payment…" : user ? "Confirm and pay" : "Sign in to book"}
            </Button>
            <p className="text-center text-xs text-slate-grey">Test mode — no real card is charged.</p>
          </form>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FeeBreakdown hourlyRate={sitter.hourlyRate} hours={hours}
                completedBookingsTogether={completedBookingsTogether} currency={sitter.currency} />
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
