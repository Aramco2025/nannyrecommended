import { Link } from "react-router-dom";
import { Search, ShieldCheck, Users, Sparkles, ArrowRight, Star, MapPin, Heart, MessageCircle, Calendar } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useSitters } from "@/hooks/useSitters";
import { SitterCard } from "@/components/SitterCard";
import heroFamily from "@/assets/hero-family.jpg";

const Index = () => {
  const { data: featured } = useSitters();

  return (
    <div className="min-h-screen bg-cream">
      <Header />

      <main>
        {/* HERO — warm, soft, friendly */}
        <section className="relative overflow-hidden bg-cream">
          <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-salmon/20 blur-[100px]" aria-hidden />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-[26rem] w-[26rem] rounded-full bg-salmon-soft blur-[120px]" aria-hidden />

          <div className="container relative grid items-center gap-12 py-14 md:grid-cols-12 md:py-20 lg:py-24">
            {/* Copy */}
            <div className="md:col-span-6 lg:col-span-7 animate-fade-up">
              <span className="inline-flex items-center gap-2 rounded-full bg-pure-white px-3 py-1.5 text-xs font-medium text-pitch-black shadow-card">
                <Heart className="h-3.5 w-3.5 fill-salmon text-salmon" />
                Loved by 1,200+ UAE families
              </span>

              <h1 className="mt-6 font-display text-5xl font-black leading-[0.95] tracking-tight text-pitch-black sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
                The babysitter
                <br />
                <span className="italic font-bold text-salmon">your friends</span>
                <br />
                already trust.
              </h1>

              <p className="mt-6 max-w-lg text-lg text-slate-grey md:text-xl">
                Find reference-checked sitters and nannies near you — recommended by parents from your school, nursery and neighbourhood.
              </p>

              {/* Search */}
              <form
                onSubmit={e => e.preventDefault()}
                className="mt-8 flex flex-col gap-2 rounded-full bg-pure-white p-2 shadow-card-hover sm:flex-row sm:items-center sm:rounded-full"
              >
                <div className="flex flex-1 items-center gap-2 px-4">
                  <MapPin className="h-5 w-5 shrink-0 text-salmon" />
                  <Input
                    placeholder="Enter your area — e.g. Dubai Marina"
                    className="border-0 px-0 text-base shadow-none focus-visible:ring-0"
                  />
                </div>
                <Button asChild size="lg" className="rounded-full bg-pitch-black px-7 text-pure-white hover:bg-pitch-black/90">
                  <Link to="/sitters">Find a sitter <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </form>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-grey">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-success-green" /> Reference-checked
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-salmon text-salmon" /> 4.9 from 8,400+ bookings
                </div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-salmon" /> No subscription
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="md:col-span-6 lg:col-span-5 relative">
              <div className="relative animate-fade-up">
                <div className="relative overflow-hidden rounded-[2.5rem] bg-salmon-soft shadow-card-hover ring-8 ring-pure-white">
                  <img
                    src={heroFamily}
                    alt="A family with their trusted nanny"
                    className="aspect-[4/5] w-full object-cover"
                  />
                </div>

                {/* Floating verified badge */}
                <div className="absolute -left-4 top-10 rotate-[-6deg] rounded-2xl bg-pure-white px-4 py-3 shadow-card-hover sm:-left-8">
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-success-green/15">
                      <ShieldCheck className="h-4 w-4 text-success-green" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-pitch-black">Reference-checked</div>
                      <div className="text-[10px] text-slate-grey">Verified by our team</div>
                    </div>
                  </div>
                </div>

                {/* Floating sitter card */}
                <div className="absolute -right-2 bottom-8 w-56 rotate-[3deg] rounded-2xl bg-pure-white p-4 shadow-card-hover sm:-right-6">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs font-medium text-pitch-black">
                      <Star className="h-3 w-3 fill-salmon text-salmon" /> 4.9
                    </span>
                    <span className="text-[10px] text-slate-grey">· 142 bookings</span>
                  </div>
                  <div className="mt-1.5 text-sm font-semibold text-pitch-black">Sara M.</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-grey">
                    <MapPin className="h-3 w-3" /> 0.8 km away
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-salmon-soft px-2 py-0.5 text-[10px] font-semibold text-salmon-deep">
                    Available tonight
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-pure-white py-8">
          <div className="container">
            <p className="mb-5 text-center text-xs font-semibold uppercase tracking-wider text-slate-grey">
              Trusted by parents at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-base font-display font-semibold text-slate-grey/70 sm:text-lg">
              <span>GEMS Wellington</span>
              <span>·</span>
              <span>Kings' School Dubai</span>
              <span>·</span>
              <span>Nord Anglia</span>
              <span>·</span>
              <span>Repton</span>
              <span>·</span>
              <span>Brighton College</span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — 3 steps */}
        <section className="container py-20 md:py-28">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">How it works</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              Book a sitter in <span className="italic text-salmon">three</span> simple steps.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: Search, step: "01", title: "Browse near you", desc: "Discover sitters recommended by parents at your school, nursery and community — no sign-up wall." },
              { icon: MessageCircle, step: "02", title: "Message & meet", desc: "Chat freely, ask questions, and arrange a meet-and-greet before you book. Zero pressure." },
              { icon: Calendar, step: "03", title: "Book with confidence", desc: "Pay securely in-app. Sitters keep 96%. Loyalty drops your fee from 8% down to 2%." },
            ].map(s => (
              <div key={s.step} className="group relative overflow-hidden rounded-3xl bg-pure-white p-7 shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover">
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

        {/* FEATURED SITTERS */}
        <section className="bg-pure-white py-20 md:py-24">
          <div className="container">
            <div className="mb-10 flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Sitters near you</span>
                <h2 className="mt-2 font-display text-3xl font-bold text-pitch-black md:text-4xl">Available tonight</h2>
              </div>
              <Button asChild variant="ghost" className="gap-1 text-pitch-black">
                <Link to="/sitters">See all <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(featured ?? []).slice(0, 3).map(s => <SitterCard key={s.id} sitter={s} />)}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="container py-20 md:py-24">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Parents love us</span>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
              The village, <span className="italic text-salmon">rebuilt</span>.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { name: "Layla H.", area: "Dubai Marina", quote: "Found Sara through a mum at my daughter's nursery. Three months in and she's part of the family." },
              { name: "Aisha K.", area: "Arabian Ranches", quote: "Finally a platform that doesn't make me sign up just to see who's nearby. Booked in five minutes." },
              { name: "Marc D.", area: "Yas Island", quote: "Loyalty fee dropping to 2% means I actually save money sticking with the same sitter. Brilliant idea." },
            ].map(t => (
              <figure key={t.name} className="rounded-3xl bg-pure-white p-7 shadow-card">
                <div className="mb-4 flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-salmon text-salmon" />)}
                </div>
                <blockquote className="text-base leading-relaxed text-pitch-black">"{t.quote}"</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 border-t border-cream-deep pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-salmon-soft font-display font-bold text-salmon-deep">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-pitch-black">{t.name}</div>
                    <div className="text-xs text-slate-grey">{t.area}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* SITTERS CTA */}
        <section className="container py-12">
          <div className="overflow-hidden rounded-[2rem] bg-pitch-black p-10 text-pure-white md:p-14">
            <div className="grid gap-8 md:grid-cols-2 md:items-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-salmon">For sitters</span>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Earn more. Keep <span className="italic text-salmon">96%</span> of your rate.
                </h2>
                <p className="mt-4 max-w-lg text-base text-pure-white/70">
                  Set your own hours, your own rate, and build a loyal client base. We take a small fee — never your tips.
                </p>
              </div>
              <div className="flex flex-col gap-3 md:items-end">
                <Button asChild size="lg" className="rounded-full bg-salmon px-8 text-primary-foreground shadow-cta hover:bg-salmon-deep">
                  <Link to="/sitter/signup">Join as a sitter</Link>
                </Button>
                <Button asChild variant="ghost" className="text-pure-white hover:bg-pure-white/10 hover:text-pure-white">
                  <Link to="/how-it-works">How it works →</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container py-20 md:py-24">
          <div className="mx-auto max-w-2xl">
            <div className="mb-10 text-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">FAQ</span>
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-pitch-black md:text-5xl">
                Questions, answered.
              </h2>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "Do I need an account to browse sitters?", a: "No. Browse freely without signing up. You only create an account when you're ready to message or book." },
                { q: "How are sitters verified?", a: "Our team personally calls references, checks first-aid certifications, and verifies UAE police clearances and visa status." },
                { q: "What does it cost?", a: "There's no subscription. We charge an 8% booking fee that drops to 4% after 5 bookings with the same sitter, and 2% after 20." },
                { q: "Can I meet a sitter before booking?", a: "Yes — we strongly encourage it. Message any sitter to arrange a free meet-and-greet first." },
                { q: "What if something goes wrong?", a: "Every booking is covered by our trust guarantee. Our support team is available 24/7 to help." },
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
        </section>

        {/* FINAL CTA */}
        <section className="container pb-20">
          <div className="relative overflow-hidden rounded-[2rem] bg-salmon p-12 text-center md:p-20">
            <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-pure-white/20 blur-2xl" aria-hidden />
            <div className="pointer-events-none absolute -right-10 -bottom-10 h-48 w-48 rounded-full bg-pitch-black/10 blur-2xl" aria-hidden />
            <h2 className="relative font-display text-4xl font-black tracking-tight text-pure-white md:text-6xl">
              Find your village.
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-pure-white/90">
              Join thousands of UAE parents who book sitters through people they trust.
            </p>
            <Button asChild size="lg" className="relative mt-8 rounded-full bg-pitch-black px-8 text-pure-white hover:bg-pitch-black/90">
              <Link to="/sitters">Find a sitter near you <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
