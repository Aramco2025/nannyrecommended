import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  CheckCircle2, ArrowRight, Sparkles, Wallet, Calendar, Heart,
  IdCard, ShieldCheck, Star, BadgeCheck,
} from "lucide-react";

const SitterSignup = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-cream">
          <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-salmon/20 blur-[100px]" aria-hidden />

          <div className="container relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-salmon-deep shadow-card">
                For sitters
              </span>
              <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-pitch-black md:text-6xl">
                Earn doing
                <br />
                <span className="italic text-salmon">what you love</span>.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-slate-grey">
                Meet wonderful UAE families in your area. Set your own hours and rate. Keep 96% of what you earn.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90">
                  <Link to="/auth?mode=signup&role=sitter">Create your profile <ArrowRight className="h-4 w-4" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full border-cream-deep">
                  <Link to="/auth?mode=signin">I already have an account</Link>
                </Button>
              </div>

              <p className="mt-4 text-xs text-slate-grey">Free forever. No subscription, no joining fee.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wallet, stat: "96%", label: "of every booking — yours" },
                { icon: Calendar, stat: "Flexible", label: "set your own hours" },
                { icon: Heart, stat: "1,200+", label: "UAE families on the platform" },
                { icon: Star, stat: "4.9★", label: "average sitter rating" },
              ].map(c => (
                <div key={c.label} className="rounded-3xl bg-pure-white p-6 shadow-card">
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-salmon-soft text-salmon-deep">
                    <c.icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-2xl font-black text-pitch-black">{c.stat}</div>
                  <div className="mt-1 text-xs text-slate-grey">{c.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY JOIN */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Why join</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Sitters love it here.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Sparkles, title: "Flexible", desc: "Set your own rate and availability. Choose only the jobs that fit your schedule." },
                { icon: Wallet, title: "Fair pay", desc: "Keep 96% of every booking. We never take your tips. Get paid straight to your bank within 3 working days." },
                { icon: ShieldCheck, title: "Protected", desc: "Every sit is insured. Real humans on our support team are here when you need help." },
              ].map(b => (
                <div key={b.title} className="rounded-3xl bg-cream p-7 shadow-card">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-pitch-black">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-grey">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS FOR SITTERS */}
        <section className="container py-20 md:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">How it works</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              Up and running in <span className="italic text-salmon">three</span> steps.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: IdCard, step: "01", title: "Create your profile", desc: "Add your photo, qualifications, languages and a short intro. Free to set up." },
              { icon: BadgeCheck, step: "02", title: "Get verified", desc: "Submit ID, pass our reference checks and police clearance. We'll guide you through every step." },
              { icon: Heart, step: "03", title: "Find families", desc: "Receive booking requests from local families. Message freely, agree dates, get paid." },
            ].map(s => (
              <div key={s.step} className="relative overflow-hidden rounded-3xl bg-pure-white p-7 shadow-card">
                <div className="absolute right-5 top-5 font-display text-5xl font-black text-cream-deep">{s.step}</div>
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-pitch-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-grey">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" className="rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
              <Link to="/auth?mode=signup&role=sitter">Become a sitter</Link>
            </Button>
          </div>
        </section>

        {/* EVERYTHING YOU NEED */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">What's included</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Everything you need to succeed.
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Free verified profile that helps you stand out",
                "Direct messaging with families — never blocked",
                "Build a verified review reputation over time",
                "Set your own hourly rate (we suggest a fair range)",
                "Liability insurance on every confirmed booking",
                "In-app payments — no chasing cash, no missed wages",
                "Loyalty pricing rewards repeat bookings",
                "UAE-based support team, 7 days a week",
              ].map(b => (
                <div key={b} className="flex items-start gap-3 rounded-2xl bg-cream p-4 shadow-card">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-green" />
                  <span className="text-sm font-medium text-pitch-black">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SITTER FAQ */}
        <section className="container py-20 md:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Sitter FAQs</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Your questions, answered.
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How do I become a sitter?", a: "Create your free account, build your profile, and submit ID and references for verification. Most applications are reviewed within 3–5 working days." },
                { q: "What checks do I need to pass?", a: "ID verification (Emirates ID or passport), two reference calls with people you've worked for, and a UAE police clearance. We guide you through everything." },
                { q: "How and when do I get paid?", a: "Parents pay through the app at the end of each sit. Funds land in your bank account within 3 working days. You keep 96% — we never take your tips." },
                { q: "Are there any fees to apply for jobs?", a: "No. There's no subscription and no fees to apply, message families or build your profile. We only take a small fee on completed bookings." },
                { q: "What types of jobs can I find?", a: "One-off babysitting, regular weekly bookings, after-school nanny work, night nanny shifts, and full-time nanny positions. You choose what suits you." },
                { q: "How do I make my profile stand out?", a: "Use a clear, friendly headshot. Write a bio that shows your personality and experience. List qualifications, languages, and any specialities like newborn or SEN experience." },
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

        {/* CTA */}
        <section className="container pb-20">
          <div className="overflow-hidden rounded-[2rem] bg-pitch-black p-12 text-center md:p-16">
            <h2 className="font-display text-4xl font-black tracking-tight text-pure-white md:text-5xl">
              Ready to start <span className="italic text-salmon">earning?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pure-white/80">
              Join hundreds of UAE sitters building flexible, well-paid careers.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
              <Link to="/auth?mode=signup&role=sitter">Create my sitter profile <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SitterSignup;
