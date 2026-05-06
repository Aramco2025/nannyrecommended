import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoyaltyProgress } from "@/components/LoyaltyProgress";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Minus, ArrowRight } from "lucide-react";
import { FamilyPlusUpgradeDialog } from "@/components/payments/FamilyPlusUpgradeDialog";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { isNativeApp, WEB_ORIGIN } from "@/lib/platform";
import { openExternal } from "@/lib/native/openExternal";

const rows: [string, string, string][] = [
  ["Browse all sitters", "✓", "✓"],
  ["Messages per month", "5", "Unlimited"],
  ["Booking fee", "8% (drops with loyalty)", "8% (drops with loyalty)"],
  ["Free cancellation window", "24 hours", "6 hours"],
  ["Concierge sourcing", "—", "✓"],
  ["See friends in common", "—", "✓"],
  ["Booking insurance", "Standard", "Up to AED 2,500"],
  ["Priority support", "—", "✓"],
];

const Pricing = () => {
  const { user } = useAuth();
  const { isFamilyPlus } = useSubscription();
  const navigate = useNavigate();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const handleUpgrade = () => {
    if (isNativeApp()) {
      openExternal(`${WEB_ORIGIN}/pricing`);
      return;
    }
    if (!user) { navigate("/auth?redirect=/pricing"); return; }
    if (isFamilyPlus) { navigate("/account"); return; }
    setUpgradeOpen(true);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* HERO */}
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Pricing</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Pricing that <span className="italic text-salmon">rewards loyalty</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Browse for free. Pay only when you book. The longer you book the same sitter, the less we charge.
            </p>
          </div>
        </section>

        {/* PLANS */}
        <section className="container -mt-4 pb-12">
          <div className="overflow-hidden rounded-3xl bg-pure-white shadow-card">
            <div className="grid grid-cols-3 border-b border-cream-deep bg-cream">
              <div className="p-5 text-sm font-semibold uppercase tracking-wider text-slate-grey">What you get</div>
              <div className="p-5 text-center">
                <div className="font-display text-base font-bold text-pitch-black">Free</div>
                <div className="text-xs text-slate-grey">AED 0 forever</div>
              </div>
              <div className="relative p-5 text-center">
                <div className="absolute right-3 top-3 rounded-full bg-salmon px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-pure-white">Popular</div>
                <div className="font-display text-base font-bold text-pitch-black">Family Plus</div>
                <div className="text-xs text-slate-grey">AED 39 / month</div>
              </div>
            </div>
            {rows.map(([label, free, plus], i) => (
              <div key={label} className={`grid grid-cols-3 border-b border-cream-deep last:border-b-0 ${i % 2 ? "bg-cream/40" : ""}`}>
                <div className="p-4 text-sm font-medium text-pitch-black">{label}</div>
                <Cell value={free} />
                <Cell value={plus} highlight />
              </div>
            ))}
            <div className="grid grid-cols-3 bg-cream">
              <div className="p-5" />
              <div className="p-5 text-center">
                <Button variant="outline" size="sm" asChild className="rounded-full border-cream-deep">
                  <Link to="/sitters">Get started free</Link>
                </Button>
              </div>
              <div className="p-5 text-center">
                <Button
                  size="sm"
                  onClick={handleUpgrade}
                  className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep shadow-cta"
                >
                  {isFamilyPlus ? "Manage Plus" : "Upgrade to Plus"}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* LOYALTY */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-10 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Loyalty promise</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                The longer you stay, the <span className="italic text-salmon">less you pay</span>.
              </h2>
              <p className="mt-4 text-base text-slate-grey">
                Most platforms penalise loyalty. We reward it. Re-book the same sitter and your fee drops automatically.
              </p>
            </div>
            <div className="mx-auto max-w-3xl rounded-3xl bg-cream p-8 shadow-card md:p-10">
              <LoyaltyProgress completedBookings={3} />
            </div>
          </div>
        </section>

        {/* FOR SITTERS */}
        <section className="container py-20">
          <div className="overflow-hidden rounded-[2rem] bg-pitch-black p-10 text-pure-white md:p-14">
            <div className="grid gap-6 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-salmon">For sitters</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  You keep <span className="italic text-salmon">96%</span>. Always.
                </h2>
                <p className="mt-4 max-w-lg text-base text-pure-white/70">
                  No subscription. No application fees. Just a small fee on completed bookings — dropping further as you build loyal families. We never touch your tips.
                </p>
              </div>
              <div className="md:text-right">
                <Button asChild size="lg" className="rounded-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                  <Link to="/sitter/signup">Become a sitter <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container pb-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">FAQs</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Pricing questions.
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "Do parents pay anything to browse?", a: "No. Browsing is completely free with no account required. You only pay when you confirm a booking." },
                { q: "How does the loyalty discount work?", a: "Your booking fee starts at 8%, drops to 4% after 5 completed bookings with the same sitter, then to 2% after 20." },
                { q: "What's included in Family Plus?", a: "Unlimited messages, concierge sitter sourcing, friends-in-common visibility, higher booking insurance and priority support." },
                { q: "Can I cancel Family Plus anytime?", a: "Yes — cancel any time from your account. You'll keep Plus benefits until the end of your billing period." },
                { q: "Are there hidden fees?", a: "No. The 8% booking fee is the only platform charge. The hourly rate you see on a sitter's profile is what you pay them." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-cream-deep">
                  <AccordionTrigger className="text-left font-display text-base font-semibold text-pitch-black hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-grey">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />
      <FamilyPlusUpgradeDialog open={upgradeOpen} onOpenChange={setUpgradeOpen} />
    </div>
  );
};

function Cell({ value, highlight }: { value: string; highlight?: boolean }) {
  const content =
    value === "✓" ? <Check className="mx-auto h-5 w-5 text-success-green" /> :
    value === "—" ? <Minus className="mx-auto h-5 w-5 text-dust-grey" /> :
    <span className="text-sm font-medium text-pitch-black">{value}</span>;
  return <div className={`p-4 text-center ${highlight ? "bg-salmon-soft/40" : ""}`}>{content}</div>;
}

export default Pricing;
