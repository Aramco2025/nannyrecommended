import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  ShieldCheck, IdCard, FileCheck, Phone, Lock, Heart,
  BadgeCheck, Users, MessageCircle, ArrowRight, AlertCircle,
} from "lucide-react";

const TrustSafety = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* HERO */}
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Trust & Safety</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Safety is our <span className="italic text-salmon">first promise</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Every day, UAE families trust us with what matters most. We accept just 1 in 4 sitter applications — and verify every one of them before they ever reach your home.
            </p>
          </div>
        </section>

        {/* THE FOUR PILLARS */}
        <section className="container pb-16">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: IdCard, title: "ID verification", desc: "We confirm every sitter's identity with their Emirates ID or passport before approval." },
              { icon: FileCheck, title: "Background checks", desc: "All sitters must pass a UAE police clearance and online background screening." },
              { icon: Phone, title: "Reference checks", desc: "Two reference calls with previous families or employers — done by our team." },
              { icon: BadgeCheck, title: "Profile review", desc: "Our team manually reviews every photo, qualification and bio before going live." },
            ].map(p => (
              <div key={p.title} className="rounded-3xl bg-pure-white p-7 shadow-card">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-pitch-black">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-grey">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* AFTER YOU BOOK */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">After you book</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Protected from start to finish.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                { icon: Lock, title: "Secure in-app payments", desc: "Pay through the app — never carry cash. Funds are released after the sit is complete." },
                { icon: ShieldCheck, title: "Booking insurance", desc: "Every confirmed booking is covered by liability insurance up to AED 2,500 (Family Plus: higher cover)." },
                { icon: MessageCircle, title: "Real human support", desc: "Our UAE-based safety team is on hand 9am–9pm, 7 days a week — no chatbots." },
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

        {/* PARENT TIPS */}
        <section className="container py-20 md:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Parent guidance</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Your role in <span className="italic text-salmon">a safe sit</span>.
              </h2>
              <p className="mt-5 text-base text-slate-grey">
                We do the heavy lifting on checks, but the best sits start with a great match. Here's how to set yours up for success.
              </p>
            </div>
            <div className="space-y-4">
              {[
                { title: "Always meet first", desc: "Free meet-and-greets are encouraged. Use it to chat, ask questions and let the kids meet your sitter." },
                { title: "Read the reviews", desc: "Every review on a profile is written by a family who actually booked. No anonymous ratings." },
                { title: "Keep it on the platform", desc: "Stay in-app for messages, bookings and payments — that's how insurance and protection apply." },
                { title: "Trust your instincts", desc: "If something feels off, don't book. Tell us — we'll help you find someone else." },
              ].map(t => (
                <div key={t.title} className="flex gap-4 rounded-2xl bg-pure-white p-5 shadow-card">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-salmon-soft text-salmon-deep">
                    <Heart className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-pitch-black">{t.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate-grey">{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REPORT */}
        <section className="bg-pure-white py-16">
          <div className="container">
            <div className="mx-auto flex max-w-3xl flex-col items-start gap-4 rounded-3xl bg-salmon-soft/40 p-8 shadow-card md:flex-row md:items-center md:p-10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-pure-white text-salmon-deep">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-pitch-black">Need to report a concern?</h3>
                <p className="mt-1 text-sm text-slate-grey">
                  Our safety team responds within hours. Email safety@nannyrecommended.com or use the in-app report button on any profile.
                </p>
              </div>
              <Button asChild className="rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <Link to="/contact">Contact safety team</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Safety FAQs</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Common questions.
              </h2>
            </div>
            <Accordion type="single" collapsible>
              {[
                { q: "What checks do sitters go through before joining?", a: "Every sitter completes ID verification (Emirates ID or passport), a UAE police clearance, two reference calls with previous families or employers, and a manual profile review by our team." },
                { q: "How often are background checks renewed?", a: "Police clearance must be renewed every 12 months. ID is re-verified if a sitter's documents change. We re-review profiles flagged by parents within 24 hours." },
                { q: "What does booking insurance cover?", a: "Standard cover is up to AED 2,500 for accidental damage during a confirmed in-app booking. Family Plus members are covered for higher amounts. Off-platform bookings are not insured." },
                { q: "What happens if I have a bad experience?", a: "Report it through the app or email safety@nannyrecommended.com. Our team investigates within hours and may suspend or remove sitters who breach our standards." },
                { q: "Are sitters trained in first aid?", a: "Many are — first aid and paediatric certifications are clearly displayed on profiles. Filter by ‘Paediatric first aid’ when browsing." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="border-b border-cream-deep">
                  <AccordionTrigger className="text-left font-display text-base font-semibold text-pitch-black hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-grey">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-20">
          <div className="overflow-hidden rounded-[2rem] bg-pitch-black p-12 text-center md:p-16">
            <h2 className="font-display text-4xl font-black tracking-tight text-pure-white md:text-5xl">
              Childcare you can <span className="italic text-salmon">truly trust</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pure-white/80">
              Browse verified sitters in your area — free to look, only pay when you book.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
              <Link to="/sitters">Find a sitter <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default TrustSafety;
