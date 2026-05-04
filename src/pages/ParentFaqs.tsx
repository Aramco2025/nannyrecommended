import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const groups = [
  {
    title: "Getting started",
    items: [
      { q: "Is it free to browse sitters?", a: "Yes — browsing is completely free with no account required. You only pay when you confirm a booking." },
      { q: "How do I create an account?", a: "Tap Sign up at the top right and register with email or Google. You'll be ready to message sitters in under a minute." },
      { q: "Which areas of the UAE do you cover?", a: "All seven emirates — Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Fujairah and Ras Al Khaimah. Most sitters are based in Dubai and Abu Dhabi." },
    ],
  },
  {
    title: "Booking & payments",
    items: [
      { q: "How do I book a sitter?", a: "Find a sitter you like, message them to check availability, then confirm dates and pay in-app. Funds are released to the sitter after the sit." },
      { q: "What's the booking fee?", a: "8% of the booking total. It drops to 4% after 5 sits with the same sitter, and 2% after 20 — our loyalty discount." },
      { q: "Can I cancel a booking?", a: "Yes. Free cancellation up to 24 hours before the sit (6 hours on Family Plus). Cancellations after that may incur a fee." },
      { q: "Are tips included?", a: "No — tips are optional and 100% go to your sitter. We never take a cut." },
    ],
  },
  {
    title: "Safety & trust",
    items: [
      { q: "Are sitters background-checked?", a: "Yes. Every sitter passes ID verification, UAE police clearance, and two reference calls before being approved." },
      { q: "What if I have a safety concern?", a: "Email safety@nannyrecommended.com or use the in-app report button. Our team responds within hours." },
      { q: "Is my booking insured?", a: "Yes — every confirmed in-app booking is covered by liability insurance up to AED 2,500 (higher on Family Plus)." },
    ],
  },
  {
    title: "Account & privacy",
    items: [
      { q: "How do I delete my account?", a: "Account settings → Delete account. Your personal data is removed within 30 days, in line with UAE data protection law." },
      { q: "Who sees my profile?", a: "Only sitters you message can see your details. Your full address is shared only after a booking is confirmed." },
    ],
  },
];

const ParentFaqs = () => (
  <div className="min-h-screen bg-cream">
    <Header />
    <main>
      <section className="bg-cream">
        <div className="container py-16 text-center md:py-24">
          <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Parent FAQs</span>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
            Your questions, <span className="italic text-salmon">answered</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
            Everything UAE parents ask us — about booking, safety, payments and more.
          </p>
        </div>
      </section>

      <section className="container pb-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {groups.map(g => (
            <div key={g.title}>
              <h2 className="mb-4 font-display text-2xl font-bold text-pitch-black">{g.title}</h2>
              <Accordion type="single" collapsible className="rounded-2xl bg-pure-white px-5 shadow-card">
                {g.items.map((item, i) => (
                  <AccordionItem key={i} value={`${g.title}-${i}`} className="border-b border-cream-deep last:border-0">
                    <AccordionTrigger className="text-left font-display text-base font-semibold text-pitch-black hover:no-underline">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm leading-relaxed text-slate-grey">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-20">
        <div className="overflow-hidden rounded-[2rem] bg-pitch-black p-10 text-center md:p-14">
          <h2 className="font-display text-3xl font-black tracking-tight text-pure-white md:text-4xl">
            Still have questions?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-pure-white/80">Our UAE-based team is here 7 days a week.</p>
          <Button asChild size="lg" className="mt-6 rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
            <Link to="/contact">Contact us <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default ParentFaqs;
