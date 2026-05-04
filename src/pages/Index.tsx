import { Link } from "react-router-dom";
import { Search, ShieldCheck, Users, Wallet, ArrowRight } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustPillar } from "@/components/TrustPillar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSitters } from "@/hooks/useSitters";
import { SitterCard } from "@/components/SitterCard";

const Index = () => {
  const { data: featured } = useSitters();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-warm" aria-hidden />
          <div className="container relative grid gap-12 py-16 md:grid-cols-2 md:py-24 lg:py-32">
            <div className="flex flex-col justify-center animate-fade-up">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-slate-grey">
                <span className="h-1.5 w-1.5 rounded-full bg-success-green" />
                Now in Dubai, Abu Dhabi & Sharjah
              </span>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-pitch-black md:text-5xl lg:text-6xl">
                Babysitters and nannies,<br />
                <span className="text-salmon">recommended</span> by people you trust.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-slate-grey">
                Browse verified sitters near you — no sign-up wall, no hidden fees, and the longer you book the same sitter, the less we charge.
              </p>

              <form className="mt-8 flex flex-col gap-2 rounded-2xl border border-border bg-card p-2 shadow-card sm:flex-row" onSubmit={e => e.preventDefault()}>
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Search className="h-5 w-5 text-slate-grey" />
                  <Input
                    placeholder="Area or community (e.g. Dubai Marina, Arabian Ranches)"
                    className="border-0 px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button asChild size="lg" className="bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                  <Link to="/sitters">Find a sitter near you</Link>
                </Button>
              </form>

              <div className="mt-5 text-xs text-slate-grey">
                Browse freely — no account needed.{" "}
                <Link to="/sitter/signup" className="font-medium text-pitch-black underline-offset-4 hover:underline">
                  I'm a sitter, not a parent →
                </Link>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute -right-8 top-8 h-72 w-72 rounded-full bg-salmon/15 blur-3xl" />
              <div className="relative grid grid-cols-2 gap-4 animate-fade-up">
                <img
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=600&h=800&fit=crop"
                  alt="Parent and child reading together"
                  className="aspect-[3/4] w-full rounded-2xl object-cover shadow-card-hover"
                />
                <div className="flex flex-col gap-4 pt-10">
                  <img
                    src="https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=600&h=600&fit=crop"
                    alt="Sitter playing with children"
                    className="aspect-square w-full rounded-2xl object-cover shadow-card-hover"
                  />
                  <div className="rounded-2xl bg-card p-4 shadow-card">
                    <div className="text-xs font-medium text-success-green">Verified+</div>
                    <div className="mt-1 text-sm font-semibold text-pitch-black">Sara M. · 4.9 ★</div>
                    <div className="text-xs text-slate-grey">142 bookings · 0.8 km away</div>
                    <div className="mt-3 text-sm font-semibold text-pitch-black">AED 75<span className="text-xs font-normal text-slate-grey">/hr</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust pillars */}
        <section className="container py-16 md:py-20">
          <div className="grid gap-5 md:grid-cols-3">
            <TrustPillar
              icon={Users}
              title="Recommended by your network"
              description="See sitters trusted by parents at your nursery, school or workplace — not anonymous strangers."
            />
            <TrustPillar
              icon={ShieldCheck}
              title="Verified by real people"
              description="Our team personally calls references, verifies first-aid, and checks UAE police clearances and visa status."
            />
            <TrustPillar
              icon={Wallet}
              title="You only pay for what you book"
              description="No subscription wall. 8% fee that drops to 2% with loyalty. Sitters keep 96% of their rate."
            />
          </div>
        </section>

        {/* Featured sitters */}
        <section className="container py-12 md:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-pitch-black md:text-3xl">Sitters near you</h2>
              <p className="mt-1 text-sm text-slate-grey">12 sitters available within 3km tonight.</p>
            </div>
            <Button asChild variant="ghost" className="gap-1 text-pitch-black">
              <Link to="/sitters">See all <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {(featured ?? []).slice(0, 3).map(s => <SitterCard key={s.id} sitter={s} />)}
          </div>
        </section>

        {/* Loyalty CTA */}
        <section className="container py-16">
          <div className="overflow-hidden rounded-3xl bg-pitch-black p-10 text-pure-white md:p-14">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                  The longer you book the same sitter, the less we charge.
                </h2>
                <p className="mt-4 max-w-lg text-base text-pure-white/70">
                  Most platforms penalise loyalty. We reward it. Bookings 1–4: 8%. 5–19: 4%. 20+: 2%.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Button asChild size="lg" className="bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                  <Link to="/pricing">See transparent pricing</Link>
                </Button>
                <Button asChild variant="ghost" className="text-pure-white hover:bg-pure-white/10 hover:text-pure-white">
                  <Link to="/how-it-works">How it works →</Link>
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

export default Index;
