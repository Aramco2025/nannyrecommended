import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight } from "lucide-react";

const groups = [
  {
    title: "Joining the platform",
    items: [
      { q: "How do I become a sitter?", a: "Create your free profile, upload a friendly photo, and submit ID and references. Most applications are reviewed within 3–5 working days." },
      { q: "What checks do I need to pass?", a: "ID (Emirates ID or passport), two reference calls, and a UAE police clearance. We guide you through every step." },
      { q: "Is there a fee to apply?", a: "No. There's no subscription, no application fee, and no charge to message families." },
    ],
  },
  {
    title: "Earnings & payments",
    items: [
      { q: "How much do I earn?", a: "You set your own hourly rate. Sitters in the UAE typically charge AED 40–80/hour depending on experience and qualifications." },
      { q: "When do I get paid?", a: "Funds land in your bank account within 3 working days of completing a sit." },
      { q: "What's the platform fee?", a: "We take just 4% — you keep 96% of every booking. Tips are 100% yours." },
    ],
  },
  {
    title: "Bookings & messaging",
    items: [
      { q: "How do I find jobs?", a: "Families message you directly, and you can browse open job posts on the Nanny Jobs board. Reply quickly to win more bookings." },
      { q: "Can I decline a booking?", a: "Yes — always. You're never obliged to accept. Just be polite and prompt with your reply." },
      { q: "Can I message families off-platform?", a: "We strongly advise keeping conversations in-app. Off-platform sits aren't insured and we can't help if anything goes wrong." },
    ],
  },
  {
    title: "Profile & reviews",
    items: [
      { q: "How do I make my profile stand out?", a: "Use a clear, friendly headshot. Write a warm bio. List qualifications, languages and any specialities like newborn or SEN experience." },
      { q: "Can I respond to reviews?", a: "Yes — you can leave a public reply on every review you receive." },
    ],
  },
];

const SitterFaqs = () => (
  <div className="min-h-screen bg-cream">
    <Header />
    <main>
      <section className="bg-cream">
        <div className="container py-16 text-center md:py-24">
          <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Sitter FAQs</span>
          <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
            Sitter questions, <span className="italic text-salmon">answered</span>.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
            Everything you need to know about joining, getting booked and getting paid.
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
            Ready to start earning?
          </h2>
          <Button asChild size="lg" className="mt-6 rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
            <Link to="/sitter/signup">Become a sitter <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default SitterFaqs;
