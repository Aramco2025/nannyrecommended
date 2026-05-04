import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
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
              Set your rate. Pick your hours. Keep 96% of every booking. Built for sitters who take their work seriously.
            </p>
            <ul className="mt-6 space-y-3">
              {benefits.map(b => (
                <li key={b} className="flex items-center gap-2 text-sm text-pitch-black">
                  <CheckCircle2 className="h-4 w-4 text-success-green" /> {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-pitch-black">Get started</h2>
            <p className="mt-1 text-sm text-slate-grey">Create your sitter account in under a minute, then build your profile from your dashboard.</p>
            <Button asChild className="mt-5 w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
              <Link to="/auth?mode=signup&role=sitter">Create sitter account</Link>
            </Button>
            <Button asChild variant="ghost" className="mt-2 w-full">
              <Link to="/auth?mode=signin">I already have an account</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-slate-grey">Free forever. By continuing you agree to our terms.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitterSignup;
