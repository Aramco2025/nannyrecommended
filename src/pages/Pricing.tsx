import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoyaltyProgress } from "@/components/LoyaltyProgress";
import { Button } from "@/components/ui/button";
import { Check, Minus } from "lucide-react";

const rows = [
  ["Browse all sitters", "✓", "✓"],
  ["Messages per month", "5", "Unlimited"],
  ["Booking fee", "8% (drops with loyalty)", "8% (drops with loyalty)"],
  ["Free cancellation window", "24 hours", "6 hours"],
  ["Concierge sourcing", "—", "✓"],
  ["Network connections", "—", "✓"],
  ["Booking insurance", "Standard", "Up to £500 / AED 2,500"],
];

const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="bg-gradient-warm">
          <div className="container py-16 text-center md:py-24">
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-pitch-black md:text-5xl">
              Pricing that <span className="text-salmon">rewards loyalty</span>, not platform stickiness.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Browse for free. Pay only when you book. The longer you book the same sitter, the less we charge.
            </p>
          </div>
        </section>

        {/* Comparison */}
        <section className="container -mt-8 md:-mt-12">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            <div className="grid grid-cols-3 border-b border-border bg-off-white">
              <div className="p-5 text-sm font-medium text-slate-grey">What you get</div>
              <div className="p-5 text-center">
                <div className="text-sm font-semibold text-pitch-black">Free</div>
                <div className="text-xs text-slate-grey">£0 forever</div>
              </div>
              <div className="relative p-5 text-center">
                <div className="absolute right-3 top-3 rounded-full bg-salmon px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-pure-white">Popular</div>
                <div className="text-sm font-semibold text-pitch-black">Family Plus</div>
                <div className="text-xs text-slate-grey">£9.99 / AED 39 per month</div>
              </div>
            </div>
            {rows.map(([label, free, plus], i) => (
              <div key={label} className={`grid grid-cols-3 border-b border-border last:border-b-0 ${i % 2 ? "bg-off-white/40" : ""}`}>
                <div className="p-4 text-sm text-pitch-black">{label}</div>
                <Cell value={free} />
                <Cell value={plus} highlight />
              </div>
            ))}
            <div className="grid grid-cols-3 bg-off-white">
              <div className="p-4" />
              <div className="p-4 text-center">
                <Button variant="outline" size="sm" asChild><Link to="/sitters">Get started free</Link></Button>
              </div>
              <div className="p-4 text-center">
                <Button size="sm" className="bg-salmon text-primary-foreground hover:bg-salmon-deep shadow-cta">Upgrade to Plus</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Loyalty stepper */}
        <section className="container py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-pitch-black md:text-4xl">Our loyalty promise</h2>
            <p className="mt-3 text-base text-slate-grey">
              The longer you book the same sitter, the less we charge. Most platforms penalise loyalty. We reward it.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-card">
            <LoyaltyProgress completedBookings={3} />
          </div>
        </section>

        {/* Sitter promise */}
        <section className="container pb-20">
          <div className="overflow-hidden rounded-3xl bg-pitch-black p-10 text-pure-white md:p-14">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">For sitters: you keep 96%. Always.</h2>
                <p className="mt-4 max-w-lg text-base text-pure-white/70">
                  No subscription to find work. No fees to apply. Just a small 4% on bookings you complete — dropping to 2% and 1% as you build loyal families.
                </p>
              </div>
              <div className="md:text-right">
                <Button asChild size="lg" className="bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                  <Link to="/sitter/signup">Sign up as a sitter</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

function Cell({ value, highlight }: { value: string; highlight?: boolean }) {
  const content =
    value === "✓" ? <Check className="mx-auto h-5 w-5 text-success-green" /> :
    value === "—" ? <Minus className="mx-auto h-5 w-5 text-dust-grey" /> :
    <span className="text-sm text-pitch-black">{value}</span>;
  return <div className={`p-4 text-center ${highlight ? "bg-salmon/[0.04]" : ""}`}>{content}</div>;
}

export default Pricing;
