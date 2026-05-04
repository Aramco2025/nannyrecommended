import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Search, MessageCircle, Calendar, Star, IdCard, Wallet, ShieldCheck, Phone, FileCheck, HeartHandshake } from "lucide-react";

const columns = [
  {
    title: "For parents",
    accent: "salmon",
    steps: [
      { icon: Search, title: "Browse freely", body: "See real sitters in your area without signing up." },
      { icon: MessageCircle, title: "Message before booking", body: "Get a feel for fit. Five free messages per month, unlimited on Plus." },
      { icon: Calendar, title: "Book transparently", body: "See the full fee breakdown before you confirm." },
      { icon: Star, title: "Build loyalty", body: "Re-book the same sitter and your fee drops to 4%, then 2%." },
    ],
  },
  {
    title: "For sitters",
    accent: "pitch-black",
    steps: [
      { icon: IdCard, title: "Create your profile", body: "Photo, video intro, qualifications, availability." },
      { icon: ShieldCheck, title: "Get verified", body: "Free Basic check, or upgrade to Verified+ to get booked 2–3× more." },
      { icon: HeartHandshake, title: "Find families", body: "No subscription. Apply to jobs and message families for free." },
      { icon: Wallet, title: "Keep 96%", body: "We only take 4% on completed bookings — and less as you build loyalty." },
    ],
  },
  {
    title: "Safety & trust",
    accent: "success-green",
    steps: [
      { icon: Phone, title: "Real reference calls", body: "Our team personally calls referees for Verified+ sitters." },
      { icon: FileCheck, title: "UAE police clearance", body: "Verified through enhanced background checks and visa status." },
      { icon: ShieldCheck, title: "Booking insurance", body: "Up to AED 2,500 cover on every Plus booking." },
      { icon: HeartHandshake, title: "Recommendations", body: "See sitters trusted by parents at your school, nursery or workplace." },
    ],
  },
];

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <section className="bg-gradient-warm">
          <div className="container py-16 text-center md:py-20">
            <h1 className="mx-auto max-w-3xl text-4xl font-semibold tracking-tight text-pitch-black md:text-5xl">
              How NannyRecommended works
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-grey">
              Calm, transparent, and built for the actual people who use it — parents and sitters alike.
            </p>
          </div>
        </section>

        <section className="container py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            {columns.map(col => (
              <div key={col.title} className="rounded-2xl border border-border bg-card p-7 shadow-card">
                <h2 className="text-xl font-semibold text-pitch-black">{col.title}</h2>
                <ol className="mt-6 space-y-5">
                  {col.steps.map((s, i) => (
                    <li key={s.title} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-salmon/10 text-salmon-deep">
                          <s.icon className="h-4.5 w-4.5" strokeWidth={1.75} />
                        </span>
                        {i < col.steps.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-border" />}
                      </div>
                      <div className="pb-4">
                        <div className="text-sm font-semibold text-pitch-black">{s.title}</div>
                        <div className="mt-1 text-sm text-slate-grey">{s.body}</div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HowItWorks;
