import { useState } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSitter } from "@/data/sitters";
import { FeeBreakdown } from "@/components/FeeBreakdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

const Booking = () => {
  const { sitterId } = useParams();
  const sitter = sitterId ? getSitter(sitterId) : null;
  const [hours, setHours] = useState(4);
  const [confirmed, setConfirmed] = useState(false);
  // Mock: this parent has booked this sitter twice before
  const completedBookingsTogether = 2;

  if (!sitter) return <Navigate to="/sitters" replace />;

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex items-center justify-center py-20">
          <div className="w-full max-w-md rounded-2xl bg-card p-8 text-center shadow-card">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-success-green/15 text-success-green">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-pitch-black">Your booking is confirmed</h1>
            <p className="mt-2 text-sm text-slate-grey">{sitter.name} has the address and will message you shortly.</p>
            <div className="mt-6 flex flex-col gap-2">
              <Button className="bg-pitch-black text-pure-white hover:bg-pitch-black/90">Add to calendar</Button>
              <Button variant="outline">Message {sitter.name.split(" ")[0]}</Button>
              <Button variant="ghost" asChild><Link to="/sitters">Back to sitters</Link></Button>
            </div>
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
        <p className="mt-1 text-sm text-slate-grey">All fees shown upfront. Cancel free up to 24 hours before.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <form
            className="space-y-6"
            onSubmit={e => {
              e.preventDefault();
              setConfirmed(true);
            }}
          >
            <Card>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Date">
                  <Input type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
                </Field>
                <Field label="Start time">
                  <Input type="time" defaultValue="19:00" />
                </Field>
                <Field label="Duration">
                  <select
                    value={hours}
                    onChange={e => setHours(Number(e.target.value))}
                    className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
                  >
                    {[2, 3, 4, 5, 6, 8].map(h => (
                      <option key={h} value={h}>{h} hours{h === 4 ? " · most popular for evenings" : ""}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Children">
                  <Input defaultValue="2 children · ages 4 & 7" />
                </Field>
              </div>
            </Card>

            <Card>
              <Field label="Address">
                <Input defaultValue="Home · 12 Battersea Park Rd, London SW11" />
              </Field>
              <div className="mt-4">
                <Field label="Special instructions (optional)">
                  <Textarea
                    rows={4}
                    placeholder="Bedtime is 8pm. Snacks in the fridge. Rosie has a peanut allergy — EpiPen on the kitchen counter."
                  />
                </Field>
              </div>
            </Card>

            {completedBookingsTogether > 0 && (
              <div className="rounded-2xl border border-salmon/30 bg-salmon/5 p-4 text-sm text-salmon-deep">
                This is your <strong>{completedBookingsTogether + 1}rd</strong> booking with {sitter.name.split(" ")[0]} — {5 - completedBookingsTogether} more and your fee drops to <strong>4%</strong>.
              </div>
            )}

            <div className="lg:hidden">
              <FeeBreakdown
                hourlyRate={sitter.hourlyRate}
                hours={hours}
                completedBookingsTogether={completedBookingsTogether}
                currency={sitter.currency}
              />
            </div>

            <Button type="submit" size="lg" className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              Confirm booking
            </Button>
            <p className="text-center text-xs text-slate-grey">You won't be charged until {sitter.name.split(" ")[0]} accepts.</p>
          </form>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FeeBreakdown
                hourlyRate={sitter.hourlyRate}
                hours={hours}
                completedBookingsTogether={completedBookingsTogether}
                currency={sitter.currency}
              />
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
