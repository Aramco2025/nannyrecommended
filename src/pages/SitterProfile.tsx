import { Link, useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSitter } from "@/hooks/useSitters";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import { Star, Clock, MapPin, MessageCircle, Languages, Heart, ShieldCheck, Loader2 } from "lucide-react";

const SitterProfile = () => {
  const { id } = useParams();
  const { data: sitter, isLoading } = useSitter(id);

  if (isLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!sitter) return <Navigate to="/sitters" replace />;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      <Header />

      <main className="container py-8 md:py-12">
        <Link to="/sitters" className="text-sm text-slate-grey hover:text-pitch-black">← Back to sitters</Link>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <div className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="relative aspect-[16/9] bg-muted">
                <img src={sitter.photo} alt={sitter.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-semibold text-pitch-black md:text-3xl">{sitter.name}</h1>
                      {sitter.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success-green/15 px-2.5 py-1 text-xs font-semibold text-success-green">
                          <ShieldCheck className="h-3.5 w-3.5" /> Verified
                        </span>
                      )}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-grey">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning-amber text-warning-amber" />
                        <strong className="text-pitch-black">{sitter.rating || "New"}</strong>
                        {sitter.bookingsCompleted > 0 && <>({sitter.bookingsCompleted} bookings)</>}
                      </span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {sitter.area}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-pitch-black">{formatCurrency(sitter.hourlyRate, sitter.currency)}<span className="text-sm font-normal text-slate-grey">/hr</span></div>
                  </div>
                </div>
                {sitter.headline && <p className="mt-3 text-sm text-slate-grey">{sitter.headline}</p>}
              </div>
            </div>

            <Section title="About me">
              <p className="text-base leading-relaxed text-pitch-black/85">{sitter.bio || "No bio yet."}</p>
            </Section>

            <Section title="Details">
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <Detail icon={<Languages className="h-4 w-4" />} label="Languages" value={sitter.languages.join(", ")} />
                <Detail icon={<Clock className="h-4 w-4" />} label="Experience" value={`${sitter.yearsExperience} years`} />
                <Detail icon={<Heart className="h-4 w-4" />} label="Network badge" value={sitter.networkBadge} />
                <Detail icon={<MapPin className="h-4 w-4" />} label="Area" value={sitter.area} />
              </div>
            </Section>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold text-pitch-black">{formatCurrency(sitter.hourlyRate, sitter.currency)}</div>
                  <div className="text-sm text-slate-grey">per hour</div>
                </div>
                <div className="mt-5 space-y-2">
                  <Button asChild size="lg" className="w-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                    <Link to={`/book/${sitter.id}`}>Book {sitter.name.split(" ")[0]}</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full gap-2">
                    <MessageCircle className="h-4 w-4" /> Message
                  </Button>
                </div>
                <p className="mt-4 text-center text-xs text-slate-grey">Free to message · No charge until booking confirmed</p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card p-3 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="container flex items-center justify-between gap-3 px-4">
          <div>
            <div className="text-xs text-slate-grey">Book {sitter.name.split(" ")[0]}</div>
            <div className="text-base font-semibold text-pitch-black">{formatCurrency(sitter.hourlyRate, sitter.currency)}/hr</div>
          </div>
          <Button asChild className="bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
            <Link to={`/book/${sitter.id}`}>Book now</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-pitch-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-3">
      <span className="mt-0.5 text-slate-grey">{icon}</span>
      <div>
        <div className="text-xs text-slate-grey">{label}</div>
        <div className="text-sm font-medium capitalize text-pitch-black">{value}</div>
      </div>
    </div>
  );
}

export default SitterProfile;
