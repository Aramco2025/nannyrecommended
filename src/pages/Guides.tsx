import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowRight, BookOpen } from "lucide-react";

const sections = [
  {
    title: "Parent guides",
    items: [
      "How to interview a nanny (10 questions to ask)",
      "Setting fair UAE nanny pay rates in 2026",
      "Your first week with a new sitter",
      "Travelling abroad with a nanny — what to know",
      "How to write a great sitter brief",
    ],
  },
  {
    title: "Sitter guides",
    items: [
      "Building a profile parents actually book",
      "Pricing your time fairly in the UAE",
      "What to bring on your first sit",
      "Handling tricky bedtime routines",
      "Growing into a long-term nanny role",
    ],
  },
  {
    title: "Nanny career guides",
    items: [
      "Becoming a qualified nanny in the UAE",
      "Paediatric first aid courses worth taking",
      "Specialising in newborn or SEN care",
      "Live-in vs live-out: pros and cons",
      "Negotiating your nanny contract",
    ],
  },
];

const Guides = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Guides</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Real advice for <span className="italic text-salmon">parents & sitters</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Practical, UAE-specific guides written by our community — from interviewing a nanny to acing your first sit.
            </p>
          </div>
        </section>

        <section className="container pb-20">
          <div className="grid gap-8 md:grid-cols-3">
            {sections.map(s => (
              <div key={s.title} className="rounded-3xl bg-pure-white p-7 shadow-card">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-pitch-black">{s.title}</h2>
                <ul className="mt-5 space-y-3">
                  {s.items.map(i => (
                    <li key={i}>
                      <Link
                        to="/guides"
                        className="group flex items-start justify-between gap-3 text-sm font-medium text-pitch-black hover:text-salmon-deep"
                      >
                        <span>{i}</span>
                        <ArrowRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-salmon transition-transform group-hover:translate-x-1" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Guides;
