import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Heart, Users, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* HERO */}
        <section className="bg-cream">
          <div className="container py-16 text-center md:py-24">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Our story</span>
            <h1 className="mx-auto mt-3 max-w-3xl font-display text-5xl font-black tracking-tight text-pitch-black md:text-6xl">
              Rebuilding the <span className="italic text-salmon">village</span>, for UAE families.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-grey">
              We started NannyRecommended after one too many late-night WhatsApp chains hunting for a last-minute sitter. We believed parents deserved better — verified, recommended, and just around the corner.
            </p>
          </div>
        </section>

        {/* MISSION */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Our mission</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Help every UAE family find <span className="italic text-salmon">care they trust</span>.
              </h2>
              <p className="mt-5 text-base leading-relaxed text-slate-grey">
                Childcare in the UAE shouldn't depend on luck or who you know. We're building a platform where every family — new arrivals or lifelong residents — can find vetted, recommended sitters and nannies in minutes, not days.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-grey">
                And we believe the people doing this work deserve a fair deal too. That's why sitters keep 96% of what they earn, and why our pricing rewards loyalty rather than penalising it.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { stat: "1,200+", label: "UAE families served" },
                { stat: "12,000+", label: "Care hours delivered" },
                { stat: "1 in 4", label: "Sitter acceptance rate" },
                { stat: "4.9★", label: "Average parent rating" },
              ].map(s => (
                <div key={s.label} className="rounded-3xl bg-cream p-6 shadow-card">
                  <div className="font-display text-4xl font-black text-salmon">{s.stat}</div>
                  <div className="mt-2 text-sm text-slate-grey">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VALUES */}
        <section className="container py-20 md:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">What we stand for</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              The values behind the platform.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Safety first", desc: "Verification isn't a checkbox. It's the whole foundation." },
              { icon: Heart, title: "Real recommendations", desc: "Reviews from real families, never anonymous, never paid for." },
              { icon: Users, title: "Fair to sitters", desc: "Sitters keep 96%. We never touch tips. Loyalty pays back." },
              { icon: Sparkles, title: "Built for the UAE", desc: "From Dubai to Abu Dhabi to Sharjah — designed for our community." },
            ].map(v => (
              <div key={v.title} className="rounded-3xl bg-pure-white p-7 shadow-card">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
                  <v.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-lg font-bold text-pitch-black">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-grey">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container pb-20">
          <div className="overflow-hidden rounded-[2rem] bg-pitch-black p-12 text-center md:p-16">
            <h2 className="font-display text-4xl font-black tracking-tight text-pure-white md:text-5xl">
              Join the <span className="italic text-salmon">village</span>.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pure-white/80">
              Whether you need childcare or want to provide it — we'd love to have you.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
                <Link to="/sitters">Find a sitter <ArrowRight className="h-4 w-4" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full border-pure-white/30 bg-transparent px-8 text-pure-white hover:bg-pure-white/10 hover:text-pure-white">
                <Link to="/sitter/signup">Become a sitter</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
