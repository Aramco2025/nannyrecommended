import { Link, useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSitter } from "@/data/sitters";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { NetworkBadge } from "@/components/NetworkBadge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import { Star, Clock, MapPin, Play, MessageCircle, Languages, Car, Heart } from "lucide-react";

const SitterProfile = () => {
  const { id } = useParams();
  const sitter = id ? getSitter(id) : null;
  if (!sitter) return <Navigate to="/sitters" replace />;

  return (
    <div className="min-h-screen bg-background pb-28 md:pb-0">
      <Header />

      <main className="container py-8 md:py-12">
        <Link to="/sitters" className="text-sm text-slate-grey hover:text-pitch-black">← Back to sitters</Link>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            {/* Hero */}
            <div className="overflow-hidden rounded-2xl bg-card shadow-card">
              <div className="relative aspect-[16/9] bg-muted">
                <img src={sitter.photo} alt={sitter.name} className="h-full w-full object-cover" />
                {sitter.videoIntro && (
                  <button className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-pure-white px-4 py-2 text-sm font-medium text-pitch-black shadow-card-hover">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-salmon text-pure-white">
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </span>
                    Watch 60s intro
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-semibold text-pitch-black md:text-3xl">{sitter.name}</h1>
                      <VerifiedBadge tier={sitter.verificationTier} />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-grey">
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning-amber text-warning-amber" />
                        <strong className="text-pitch-black">{sitter.rating}</strong> ({sitter.bookingsCompleted} bookings)
                      </span>
                      <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {sitter.distanceKm} km away</span>
                      <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {sitter.responseTime}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-pitch-black">{formatCurrency(sitter.hourlyRate, sitter.currency)}<span className="text-sm font-normal text-slate-grey">/hr</span></div>
                  </div>
                </div>

                {sitter.recommendedBy && (
                  <div className="mt-4">
                    <NetworkBadge text={`Recommended by ${sitter.recommendedBy}`} />
                  </div>
                )}
              </div>
            </div>

            {/* About */}
            <Section title="About me">
              <p className="text-base leading-relaxed text-pitch-black/85">{sitter.bio}</p>
            </Section>

            {/* Skills */}
            <Section title="Skills & qualifications">
              <div className="flex flex-wrap gap-2">
                {sitter.qualifications.map(q => (
                  <span key={q} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm text-pitch-black">{q}</span>
                ))}
              </div>
              <div className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
                <Detail icon={<Heart className="h-4 w-4" />} label="Age groups" value={sitter.ageGroups.join(", ")} />
                <Detail icon={<Languages className="h-4 w-4" />} label="Languages" value={sitter.languages.join(", ")} />
                <Detail icon={<Car className="h-4 w-4" />} label="Drives" value={sitter.drives ? "Yes" : "No"} />
                <Detail icon={<Clock className="h-4 w-4" />} label="Experience" value={`${sitter.yearsExperience} years`} />
              </div>
            </Section>

            {/* Reviews */}
            <Section title={`Reviews (${sitter.reviews.length})`}>
              {sitter.reviews.length === 0 ? (
                <p className="text-sm text-slate-grey">No reviews yet — be the first.</p>
              ) : (
                <div className="space-y-4">
                  {sitter.reviews.map(r => (
                    <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-pitch-black">{r.author}</div>
                        <div className="inline-flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-warning-amber text-warning-amber" />
                          <span className="font-medium">{r.rating}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-sm text-pitch-black/80">"{r.comment}"</p>
                      <div className="mt-2 text-xs text-slate-grey">{r.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Sticky booking card on desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold text-pitch-black">{formatCurrency(sitter.hourlyRate, sitter.currency)}</div>
                  <div className="text-sm text-slate-grey">per hour</div>
                </div>
                <div className="mt-2 text-xs text-slate-grey">Sitter receives {formatCurrency(sitter.hourlyRate * 0.96, sitter.currency)} (96%).</div>
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

      {/* Sticky mobile bottom bar */}
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
        <div className="text-sm font-medium text-pitch-black">{value}</div>
      </div>
    </div>
  );
}

export default SitterProfile;
