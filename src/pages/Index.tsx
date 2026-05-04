import { Link } from "react-router-dom";
import { Search, ShieldCheck, Users, Wallet, ArrowRight, Star, MapPin } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustPillar } from "@/components/TrustPillar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSitters } from "@/hooks/useSitters";
import { SitterCard } from "@/components/SitterCard";
import heroFamily from "@/assets/hero-family.jpg";

const Index = () => {
  const { data: featured } = useSitters();
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-pitch-black">
          {/* Decorative blurs */}
          <div className="pointer-events-none absolute -left-24 top-1/3 h-96 w-96 rounded-full bg-salmon/30 blur-[120px]" aria-hidden />
          <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-salmon/20 blur-[140px]" aria-hidden />

          <div className="container relative grid gap-12 py-16 md:grid-cols-12 md:py-24 lg:py-32">
            {/* Copy column */}
            <div className="md:col-span-7 flex flex-col justify-center animate-fade-up">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-pure-white/15 bg-pure-white/5 px-3 py-1 text-xs font-medium text-pure-white/80 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-success-green" />
                Live across the UAE · 1,200+ verified sitters
              </span>

              <h1 className="mt-6 font-display text-6xl font-black leading-[0.9] tracking-tighter text-pure-white sm:text-7xl md:text-8xl lg:text-[7.5rem]">
                Sitters
                <br />
                <span className="italic font-bold text-salmon">recommended</span>.
              </h1>

              <p className="mt-7 max-w-xl text-lg text-pure-white/70 md:text-xl">
                Browse verified babysitters and nannies trusted by parents at your school, nursery and community. No sign-up wall. No hidden fees.
              </p>

              <form
                className="mt-9 flex flex-col gap-2 rounded-2xl border border-pure-white/10 bg-pure-white/95 p-2 shadow-cta sm:flex-row"
                onSubmit={e => e.preventDefault()}
              >
                <div className="flex flex-1 items-center gap-2 px-3">
                  <Search className="h-5 w-5 text-slate-grey" />
                  <Input
                    placeholder="Dubai Marina, Arabian Ranches, Yas Island…"
                    className="border-0 px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button asChild size="lg" className="bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                  <Link to="/sitters">Find a sitter</Link>
                </Button>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-pure-white/60">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-success-green" />
                  Reference-checked
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-salmon text-salmon" />
                  4.9 average from 8,400+ bookings
                </div>
              </div>

              <div className="mt-6 text-xs text-pure-white/50">
                Browse freely — no account needed.{" "}
                <Link to="/sitter/signup" className="font-medium text-pure-white underline-offset-4 hover:underline">
                  I'm a sitter, not a parent →
                </Link>
              </div>
            </div>

            {/* Image column */}
            <div className="md:col-span-5 relative hidden md:block">
              <div className="relative animate-fade-up">
                {/* Main hero image */}
                <div className="relative overflow-hidden rounded-[2rem] shadow-card-hover ring-1 ring-pure-white/10">
                  <img
                    src={heroFamily}
                    alt="A family at home with their trusted nanny"
                    className="aspect-[4/5] w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-pitch-black/40 via-transparent to-transparent" />
                </div>

                {/* Floating sitter card */}
                <div className="absolute -left-6 bottom-8 w-60 rounded-2xl bg-pure-white p-4 shadow-card-hover">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-green/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-success-green">
                      <ShieldCheck className="h-3 w-3" /> Verified+
                    </span>
                    <span className="flex items-center gap-1 text-xs font-medium text-pitch-black">
                      <Star className="h-3 w-3 fill-salmon text-salmon" /> 4.9
                    </span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-pitch-black">Sara M.</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-grey">
                    <MapPin className="h-3 w-3" /> 0.8 km · 142 bookings
                  </div>
                  <div className="mt-3 flex items-end justify-between">
                    <div className="text-base font-bold text-pitch-black">
                      AED 75<span className="text-xs font-normal text-slate-grey">/hr</span>
                    </div>
                    <span className="text-[10px] font-medium text-salmon">Available tonight</span>
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
