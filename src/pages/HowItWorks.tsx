import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Search, MessageCircle, Calendar, ArrowRight,
  BadgeCheck, Phone, FileCheck, ShieldCheck, Star, Heart,
} from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">How it works</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Trusted childcare, <span className="italic text-salmon">simply booked</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Three steps to find a sitter you'll love — backed by real reference checks and parent reviews.
            </p>
          </div>
        </section>

        {/* 3 STEPS */}
        <section className="container pb-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, step: "01", title: "Find caregivers", desc: "Browse reference-checked sitters and nannies in your area. See verified reviews and who friends already trust." },
              { icon: MessageCircle, step: "02", title: "Shortlist & chat", desc: "Message sitters, ask questions, and arrange a free meet-and-greet to make sure they're the right fit." },
              { icon: Calendar, step: "03", title: "Book & pay securely", desc: "Confirm dates and pay safely in-app. Loyalty drops your booking fee — the more you book, the less we charge." },
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
        </section>

        {/* SAFETY */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Safety first</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Every sitter, properly checked.
              </h2>
              <p className="mt-4 text-base text-slate-grey">
                We take safety seriously. Every sitter passes a multi-step verification before they appear on the platform.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: BadgeCheck, title: "ID verification", desc: "Every sitter's identity confirmed via Emirates ID or passport." },
                { icon: Phone, title: "Reference calls", desc: "Two prior families personally called by our team — no online forms." },
                { icon: FileCheck, title: "Police clearance", desc: "Enhanced background checks against UAE records before approval." },
                { icon: ShieldCheck, title: "Insured bookings", desc: "Every confirmed sit is covered for your protection up to AED 2,500." },
              ].map(s => (
                <div key={s.title} className="rounded-3xl bg-cream p-6 shadow-card">
                  <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-success-green/15 text-success-green">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-base font-bold text-pitch-black">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-grey">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY PARENTS LOVE US */}
        <section className="container py-20 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Why parents love us</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              Built for the <span className="italic text-salmon">actual people</span> who use it.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Star, title: "Real reviews", desc: "Honest, verified reviews on every sitter profile. No anonymous ratings." },
              { icon: Heart, title: "You're in control", desc: "Choose when, where and who looks after your children. Meet first if you want." },
              { icon: ShieldCheck, title: "Booking protection", desc: "Pay securely in-app. Our team is on hand 7 days a week to help." },
            ].map(b => (
              <div key={b.title} className="rounded-3xl bg-pure-white p-7 shadow-card">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-pitch-black">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-grey">{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-2xl">
              <div className="mb-10 text-center">
                <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">FAQs</span>
                <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                  Common questions.
                </h2>
              </div>
              <Accordion type="single" collapsible className="w-full">
                {[
                  { q: "How does NannyRecommended work?", a: "Browse reference-checked sitters in your area, message them for free, and book securely in-app. We handle payment and provide booking protection." },
                  { q: "Do I need to sign up to browse?", a: "No. You can browse all profiles freely. You only need an account to message a sitter or confirm a booking." },
                  { q: "How are sitters verified?", a: "Every sitter undergoes ID verification, two reference calls, and a UAE police clearance check before being approved on the platform." },
                  { q: "What does it cost parents?", a: "There's no subscription. We charge an 8% booking fee on each completed sit. This drops to 4% after 5 bookings with the same sitter, and 2% after 20." },
                  { q: "Can I meet a sitter before I book?", a: "Yes — and we strongly encourage it. Message any sitter to set up a free meet-and-greet first." },
                  { q: "What happens if I need to cancel?", a: "Free cancellation up to 24 hours before the booking (6 hours on Family Plus). After that, sitters receive partial compensation for their reserved time." },
                  { q: "Is every booking insured?", a: "Yes. Every confirmed booking is covered up to AED 2,500 on Family Plus, with standard coverage on the free plan." },
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
          </div>
        </section>

        {/* CTA */}
        <section className="container py-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-salmon p-12 text-center md:p-16">
            <h2 className="font-display text-4xl font-black tracking-tight text-pure-white md:text-5xl">
              Ready to get started?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pure-white/90">
              Find your village. Browse sitters in your area, no sign-up required.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90">
              <Link to="/sitters">Find a sitter <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
