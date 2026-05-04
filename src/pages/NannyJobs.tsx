import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, MapPin, Clock, Wallet } from "lucide-react";

const jobs = [
  { title: "Full-time nanny", area: "Dubai Marina", hours: "Mon–Fri, 8am–6pm", pay: "AED 7,500/mo", tags: ["Live-out", "2 children"] },
  { title: "After-school nanny", area: "Arabian Ranches", hours: "Mon–Thu, 2pm–7pm", pay: "AED 55/hr", tags: ["School run", "Homework help"] },
  { title: "Night nanny — newborn", area: "Palm Jumeirah", hours: "Sun–Wed nights", pay: "AED 80/hr", tags: ["Newborn", "Sleep training"] },
  { title: "Weekend babysitter", area: "Yas Island, Abu Dhabi", hours: "Fri & Sat evenings", pay: "AED 45/hr", tags: ["Flexible", "1 child"] },
  { title: "Live-in nanny", area: "Emirates Hills", hours: "Mon–Sat", pay: "AED 9,000/mo + room", tags: ["Live-in", "3 children"] },
  { title: "Holiday nanny", area: "Saadiyat Island", hours: "School holidays", pay: "AED 60/hr", tags: ["Temporary", "2 children"] },
];

const NannyJobs = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main>
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Nanny jobs</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Nanny jobs <span className="italic text-salmon">across the UAE</span>.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-grey">
              Browse hundreds of nanny and babysitter roles posted by real UAE families. Free to apply, keep 96% of what you earn.
            </p>
            <Button asChild size="lg" className="mt-8 rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90">
              <Link to="/auth?mode=signup&role=sitter">Create your sitter profile <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>

        <section className="container pb-20">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map(j => (
              <article key={j.title + j.area} className="flex flex-col rounded-3xl bg-pure-white p-6 shadow-card">
                <h3 className="font-display text-lg font-bold text-pitch-black">{j.title}</h3>
                <div className="mt-3 space-y-1.5 text-sm text-slate-grey">
                  <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5 text-salmon" /> {j.area}</div>
                  <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-salmon" /> {j.hours}</div>
                  <div className="flex items-center gap-2"><Wallet className="h-3.5 w-3.5 text-salmon" /> {j.pay}</div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {j.tags.map(t => (
                    <Badge key={t} variant="secondary" className="rounded-full bg-salmon-soft/60 text-xs font-medium text-salmon-deep hover:bg-salmon-soft/60">
                      {t}
                    </Badge>
                  ))}
                </div>
                <Button asChild size="sm" className="mt-5 w-full rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                  <Link to="/auth?mode=signup&role=sitter">Apply now</Link>
                </Button>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-[2rem] bg-pitch-black p-10 text-center md:p-14">
            <h2 className="font-display text-3xl font-black tracking-tight text-pure-white md:text-4xl">
              See more jobs near you.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base text-pure-white/80">
              Create a free sitter profile to unlock the full job board and message families directly.
            </p>
            <Button asChild size="lg" className="mt-6 rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
              <Link to="/sitter/signup">Become a sitter</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default NannyJobs;
