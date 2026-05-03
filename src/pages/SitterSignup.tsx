import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2 } from "lucide-react";

const benefits = [
  "Keep 96% of your hourly rate",
  "Free to apply, message, and find work",
  "No subscription required",
  "Get booked 2–3× more with Verified+",
];

const SitterSignup = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-slate-grey">For sitters</span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-pitch-black md:text-4xl">
              Build a career with families who actually <span className="text-salmon">recommend you</span>.
            </h1>
            <p className="mt-4 max-w-lg text-base text-slate-grey">
              Set your rate. Pick your hours. Keep 96% of every booking. We're built for sitters who take their work seriously.
            </p>
            <ul className="mt-6 space-y-3">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-pitch-black">
                  <CheckCircle2 className="h-4 w-4 text-success-green" /> {b}
                </li>
              ))}
            </ul>
          </div>

          <form className="rounded-2xl border border-border bg-card p-6 shadow-card" onSubmit={e => e.preventDefault()}>
            <h2 className="text-lg font-semibold text-pitch-black">Create your sitter profile</h2>
            <p className="mt-1 text-xs text-slate-grey">Takes about 5 minutes. Free forever.</p>

            <div className="mt-5 space-y-4">
              <Field label="Full name"><Input placeholder="Sara Mitchell" /></Field>
              <Field label="Email"><Input type="email" placeholder="sara@example.com" /></Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Hourly rate (£)"><Input type="number" defaultValue={15} min={12} /></Field>
                <Field label="Years of experience"><Input type="number" defaultValue={3} min={0} /></Field>
              </div>
              <Field label="Short bio">
                <Textarea rows={3} placeholder="A sentence or two about you and how you work with kids." />
              </Field>
            </div>

            <Button className="mt-6 w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              Continue
            </Button>
            <p className="mt-3 text-center text-xs text-slate-grey">By continuing you agree to our terms and trust standards.</p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-slate-grey">{label}</Label>
      {children}
    </div>
  );
}

export default SitterSignup;
