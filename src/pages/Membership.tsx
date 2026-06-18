import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Check, Crown, Rocket, ShieldCheck, Gift } from "lucide-react";
import { FamilyPlusUpgradeDialog } from "@/components/payments/FamilyPlusUpgradeDialog";
import { OneTimeCheckoutDialog } from "@/components/payments/OneTimeCheckoutDialog";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export default function Membership() {
  const { user } = useAuth();
  const { isFamilyPlus: isActive } = useSubscription();
  const [plusOpen, setPlusOpen] = useState(false);
  const [boostOpen, setBoostOpen] = useState(false);
  const [vettingOpen, setVettingOpen] = useState(false);

  const requireAuth = (open: () => void) => () => {
    if (!user) {
      window.location.href = "/auth?mode=signin&redirect=/membership";
      return;
    }
    open();
  };

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />
      <main className="container max-w-6xl py-10 md:py-16">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-display text-3xl font-bold text-pitch-black md:text-5xl">
            Choose how you book
          </h1>
          <p className="mt-3 text-base text-slate-grey md:text-lg">
            One-off boost when you need it fast. Membership when childcare is a weekly part of life.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {/* Priority Boost */}
          <Card
            icon={<Rocket className="h-6 w-6" />}
            tag="Try us"
            title="Priority Booking"
            price="AED 19"
            sub="one-off · per booking"
            bullets={[
              "Pushed to top of every qualified sitter's inbox",
              "Average reply in under 6 minutes",
              "Use when you need a sitter today",
            ]}
            cta="Boost a booking"
            onClick={requireAuth(() => setBoostOpen(true))}
            tone="light"
          />

          {/* Family Plus */}
          <Card
            icon={<Crown className="h-6 w-6" />}
            tag="Most popular"
            title="Family Plus"
            price="AED 29"
            sub="per month · cancel anytime"
            bullets={[
              "Zero service fee on every booking",
              "Priority Boost on every job, free",
              "24/7 concierge over WhatsApp",
              "Share with co-parent / nanny",
              "Locked-in rates on your favourite sitters",
            ]}
            cta={isActive ? "You're a member 🎉" : "Start Family Plus"}
            onClick={requireAuth(() => setPlusOpen(true))}
            tone="dark"
            highlight
            disabled={isActive}
          />

          {/* Background Check */}
          <Card
            icon={<ShieldCheck className="h-6 w-6" />}
            tag="Trust"
            title="Verified Background Check"
            price="AED 49"
            sub="one-off · lifetime badge"
            bullets={[
              "Police-record + reference verification",
              '"Verified Family" badge on your profile',
              "Sitters reply 2.3× more often",
              "Required to hire long-term nannies",
            ]}
            cta="Get verified"
            onClick={requireAuth(() => setVettingOpen(true))}
            tone="light"
          />
        </div>

        {/* Referral nudge */}
        <Link
          to="/referrals"
          className="mt-8 flex flex-col items-center justify-between gap-3 rounded-3xl bg-salmon-soft p-6 text-center md:flex-row md:text-left"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-salmon text-pure-white">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-lg font-bold text-pitch-black">
                Get AED 50 off — free
              </div>
              <div className="text-sm text-slate-grey">
                Invite a friend. They get AED 50 off, you get AED 50 credit.
              </div>
            </div>
          </div>
          <Button className="rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
            Share your code
          </Button>
        </Link>

        <p className="mt-8 text-center text-xs text-slate-grey">
          All prices in AED. Secure checkout by Stripe. VAT included where applicable.
        </p>
      </main>
      <Footer />

      <FamilyPlusUpgradeDialog open={plusOpen} onOpenChange={setPlusOpen} />
      <OneTimeCheckoutDialog
        open={boostOpen}
        onOpenChange={setBoostOpen}
        priceId="priority_booking_once"
        title="Boost this booking — AED 19"
      />
      <OneTimeCheckoutDialog
        open={vettingOpen}
        onOpenChange={setVettingOpen}
        priceId="background_check_once"
        title="Verified Background Check — AED 49"
      />
    </div>
  );
}

function Card({
  icon, tag, title, price, sub, bullets, cta, onClick, tone, highlight, disabled,
}: {
  icon: React.ReactNode; tag: string; title: string; price: string; sub: string;
  bullets: string[]; cta: string; onClick: () => void;
  tone: "light" | "dark"; highlight?: boolean; disabled?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <div
      className={`relative flex flex-col rounded-3xl p-6 shadow-card md:p-8 ${
        dark ? "bg-pitch-black text-pure-white" : "bg-pure-white text-pitch-black"
      } ${highlight ? "md:-translate-y-3 ring-2 ring-salmon" : ""}`}
    >
      <div
        className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
          dark ? "bg-salmon text-pure-white" : "bg-cream-deep text-pitch-black"
        }`}
      >
        {icon}
        {tag}
      </div>
      <h2 className={`mt-4 font-display text-2xl font-bold ${dark ? "" : "text-pitch-black"}`}>{title}</h2>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-display text-4xl font-bold">{price}</span>
      </div>
      <p className={`text-sm ${dark ? "text-pure-white/70" : "text-slate-grey"}`}>{sub}</p>

      <ul className="mt-5 space-y-2.5">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2 text-sm">
            <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${dark ? "text-salmon" : "text-success-green"}`} />
            <span className={dark ? "text-pure-white/90" : "text-pitch-black/80"}>{b}</span>
          </li>
        ))}
      </ul>

      <Button
        disabled={disabled}
        onClick={onClick}
        size="lg"
        className={`mt-6 w-full rounded-full ${
          dark
            ? "bg-salmon text-pure-white hover:bg-salmon-deep shadow-cta"
            : "bg-pitch-black text-pure-white hover:bg-pitch-black/90"
        } ${disabled ? "opacity-60" : ""}`}
      >
        {cta}
      </Button>
    </div>
  );
}
