import { useEffect, useState } from "react";
import { Link, useParams, Navigate, useNavigate, useSearchParams } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN as string;
const stripePromise = loadStripe(clientToken);
const stripeEnv: "sandbox" | "live" = clientToken?.startsWith("pk_test_") ? "sandbox" : "live";

type Child = { id: string; name: string; dob: string | null };
type Pet = { type: string; name: string; notes: string };

const Booking = () => {
  const { sitterId } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: sitter, isLoading } = useSitter(sitterId);

  const qDate = search.get("date");
  const qStart = search.get("start");
  const qHours = search.get("hours");
  const qApp = search.get("application_id");
  const qJob = search.get("job_id");

  const [step, setStep] = useState<"details" | "confirm">("details");
  const [date, setDate] = useState(qDate ?? new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(qStart ?? "19:00");
  const [hours, setHours] = useState(qHours ? Number(qHours) : 4);
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // Family info (confirm step)
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [parking, setParking] = useState("");

  useEffect(() => {
    if (!user) return;
    supabase.from("children").select("id,name,dob").eq("parent_id", user.id).then(({ data }) => {
      const list = (data ?? []) as Child[];
      setChildren(list);
      setSelectedChildren(list.map(c => c.id));
    });
  }, [user]);

  if (isLoading || authLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!sitter) return <Navigate to="/sitters" replace />;

  const goConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Sign in to book", description: "Create an account to confirm your booking." });
      navigate(`/auth?mode=signup&role=parent`);
      return;
    }
    setStep("confirm");
  };

  const handleSubmit = async () => {
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
          children_ids: selectedChildren,
          pets,
          parking: parking || null,
          return_url: `${window.location.origin}/account`,
          environment: stripeEnv,
        },
      });
      if (error) throw error;
      if (!data?.client_secret) throw new Error("No checkout session returned");
      if (qApp && qJob) {
        await supabase.from("job_applications").update({ status: "accepted" }).eq("id", qApp);
        await supabase.from("job_applications").update({ status: "declined" }).eq("job_post_id", qJob).neq("id", qApp).eq("status", "pending");
        await supabase.from("job_posts").update({ status: "filled" }).eq("id", qJob);
      }
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

  if (step === "confirm") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container max-w-2xl py-8">
          <button onClick={() => setStep("details")} className="text-sm text-slate-grey hover:text-pitch-black">← Back to booking details</button>
          <h1 className="mt-4 font-display text-2xl font-bold text-pitch-black">Family information</h1>
          <p className="mt-1 text-sm text-slate-grey">Help {sitter.name.split(" ")[0]} prepare for the visit.</p>

          <div className="mt-6 space-y-5">
            <Card>
              <h2 className="text-sm font-semibold text-pitch-black">Children for this booking</h2>
              {children.length === 0 ? (
                <div className="mt-3 rounded-xl bg-cream p-3 text-sm text-slate-grey">
                  No children on file. <Link to="/onboarding/parent/family" className="underline">Add them</Link> to include in this booking.
                </div>
              ) : (
                <ul className="mt-3 space-y-2">
                  {children.map(c => {
                    const checked = selectedChildren.includes(c.id);
                    return (
                      <li key={c.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(v) =>
                            setSelectedChildren(prev => v ? [...prev, c.id] : prev.filter(x => x !== c.id))
                          }
                        />
                        <div className="text-sm">
                          <div className="font-medium text-pitch-black">{c.name}</div>
                          {c.dob && <div className="text-xs text-slate-grey">DOB {c.dob}</div>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-pitch-black">Pets</h2>
                <button type="button" onClick={() => setPets([...pets, { type: "Dog", name: "", notes: "" }])}
                  className="inline-flex items-center gap-1 text-xs font-medium text-salmon hover:text-salmon-deep">
                  <Plus className="h-3.5 w-3.5" /> Add pet
                </button>
              </div>
              {pets.length === 0 ? (
                <p className="mt-2 text-xs text-slate-grey">No pets to mention.</p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {pets.map((p, i) => (
                    <li key={i} className="rounded-xl border border-border p-3">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <select value={p.type} onChange={e => setPets(pets.map((x, idx) => idx === i ? { ...x, type: e.target.value } : x))}
                          className="h-10 rounded-md border border-input bg-card px-3 text-sm">
                          {["Dog", "Cat", "Bird", "Fish", "Other"].map(t => <option key={t}>{t}</option>)}
                        </select>
                        <Input placeholder="Name" value={p.name} maxLength={60}
                          onChange={e => setPets(pets.map((x, idx) => idx === i ? { ...x, name: e.target.value } : x))} />
                        <Input placeholder="Notes (e.g. friendly)" value={p.notes} maxLength={200}
                          onChange={e => setPets(pets.map((x, idx) => idx === i ? { ...x, notes: e.target.value } : x))} />
                      </div>
                      <button type="button" onClick={() => setPets(pets.filter((_, idx) => idx !== i))}
                        className="mt-2 inline-flex items-center gap-1 text-xs text-slate-grey hover:text-pitch-black">
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card>
              <Field label="Parking instructions (optional)">
                <Textarea rows={3} value={parking} maxLength={500}
                  placeholder="Visitor parking on level B2, gate code 1234"
                  onChange={e => setParking(e.target.value)} />
              </Field>
            </Card>

            <div className="rounded-2xl border border-border bg-off-white p-4 text-xs text-slate-grey">
              🔒 Your payment is held safely until the booking is complete.
            </div>

            <Button onClick={handleSubmit} disabled={busy} size="lg"
              className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              {busy ? "Starting checkout…" : "Confirm & pay"}
            </Button>
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
          <form className="space-y-6" onSubmit={goConfirm}>
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

            <Button type="submit" size="lg" className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              {!user ? "Sign in to book" : "Continue — review family info"}
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
