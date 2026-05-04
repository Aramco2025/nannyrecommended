import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight, CheckCircle2, Star, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export type CareTypeProps = {
  eyebrow: string;
  title: string;
  italic: string;
  trailing?: string;
  intro: string;
  searchHref: string;
  icon: LucideIcon;
  bullets: string[];
  steps: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
  rate?: string;
};

export const CareTypePage = ({
  eyebrow, title, italic, trailing, intro, searchHref, icon: Icon, bullets, steps, faqs, rate,
}: CareTypeProps) => (
  <div className="min-h-screen bg-cream">
    <Header />
    <main>
      {/* HERO */}
      <section className="bg-cream">
        <div className="container grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-salmon-deep shadow-card">
              {eyebrow}
            </span>
            <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-pitch-black md:text-6xl">
              {title} <span className="italic text-salmon">{italic}</span>{trailing ? ` ${trailing}` : ""}.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-slate-grey">{intro}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90">
                <Link to={searchHref}>Browse now <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-cream-deep">
                <Link to="/how-it-works">How it works</Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-grey">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-success-green" /> Reference-checked</div>
              <div className="flex items-center gap-1.5"><Star className="h-4 w-4 fill-salmon text-salmon" /> 4.9 from UAE parents</div>
              {rate && <div className="font-medium text-pitch-black">From {rate}</div>}
            </div>
          </div>

          <div className="rounded-3xl bg-pure-white p-8 shadow-card">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
              <Icon className="h-6 w-6" />
            </div>
            <h2 className="font-display text-xl font-bold text-pitch-black">What's included</h2>
            <ul className="mt-4 space-y-2.5">
              {bullets.map(b => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-pitch-black">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-green" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-pure-white py-20 md:py-24">
        <div className="container">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">How it works</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              Booking in three steps.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="relative overflow-hidden rounded-3xl bg-cream p-7 shadow-card">
                <div className="absolute right-5 top-5 font-display text-5xl font-black text-cream-deep">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="font-display text-xl font-bold text-pitch-black">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-grey">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">FAQs</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              Common questions.
            </h2>
          </div>
          <Accordion type="single" collapsible>
            {faqs.map((item, i) => (
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
            Find your <span className="italic text-salmon">{italic}</span> today.
          </h2>
          <Button asChild size="lg" className="mt-8 rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
            <Link to={searchHref}>Browse now <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);
