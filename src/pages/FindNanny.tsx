import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, CheckCircle2, Sun, GraduationCap, Moon, Baby } from "lucide-react";

const types = [
  { icon: Sun, title: "Full-time nanny", desc: "Weekday daytime care, typically 40–50 hours per week.", to: "/sitters?type=nanny" },
  { icon: GraduationCap, title: "After-school nanny", desc: "School pick-up, snacks, homework and activities until parents are home.", to: "/sitters?type=after-school" },
  { icon: Moon, title: "Night nanny", desc: "Overnight newborn support so you can sleep — perfect for the first weeks.", to: "/sitters?type=night-nanny" },
  { icon: Baby, title: "Maternity nurse", desc: "Specialist newborn support, sleep training and feeding routines.", to: "/sitters?type=newborn" },
];

const FindNanny = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        {/* HERO */}
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Find a nanny</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Find your family's <span className="italic text-salmon">perfect nanny</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Permanent, part-time or live-in — every nanny on NannyRecommended is reference-checked and parent-recommended.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90">
                <Link to="/sitters?type=nanny">Browse nannies <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full border-cream-deep">
                <Link to="/how-it-works">How it works</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* TYPES */}
        <section className="container py-16">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              Which type of nanny do you need?
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {types.map(t => (
              <Link
                key={t.title}
                to={t.to}
                className="group flex flex-col items-start rounded-3xl bg-pure-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep group-hover:bg-salmon group-hover:text-pure-white">
                  <t.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-bold text-pitch-black">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-grey">{t.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-salmon-deep">
                  Browse <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">What's included</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Every nanny on the platform.
              </h2>
            </div>
            <div className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2">
              {[
                "Reference-checked by our team",
                "UAE police clearance verified",
                "ID and right-to-work confirmed",
                "Detailed profile with bio and skills",
                "Verified parent reviews",
                "Languages and qualifications listed",
                "Free meet-and-greet recommended",
                "Booking insurance on every contract",
              ].map(b => (
                <div key={b} className="flex items-start gap-3 rounded-2xl bg-cream p-4 shadow-card">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-green" />
                  <span className="text-sm font-medium text-pitch-black">{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-20">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Nanny FAQs</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Common questions.
              </h2>
            </div>
            <Accordion type="single" collapsible>
              {[
                { q: "What's the difference between a nanny and a babysitter?", a: "A nanny is typically a regular, longer-term arrangement (daily or weekly). A babysitter is more occasional — evenings, weekends, or one-off sits." },
                { q: "How much does a nanny cost in the UAE?", a: "Hourly rates typically range from AED 35–80 depending on experience, qualifications and the type of role. Live-in arrangements are usually a monthly salary plus accommodation." },
                { q: "Do you handle visa or sponsorship?", a: "We connect you with the nanny — you arrange employment terms directly. Many families use a UAE-based nanny agency partner for sponsorship paperwork; we can recommend trusted ones." },
                { q: "Can I trial a nanny before committing?", a: "Yes. We strongly recommend a paid trial day or week before any long-term agreement." },
              ].map((item, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="border-b border-cream-deep">
                  <AccordionTrigger className="text-left font-display text-base font-semibold text-pitch-black hover:no-underline">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-slate-grey">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FindNanny;
