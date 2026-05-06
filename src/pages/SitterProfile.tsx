import { Link, useParams, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useSitter } from "@/hooks/useSitters";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import {
  Star, Clock, MapPin, MessageCircle, Languages, ShieldCheck, Loader2,
  BadgeCheck, CheckCircle2, Calendar, Award, Heart,
} from "lucide-react";
import { VerificationPanel } from "@/components/trust/VerificationPanel";
import { VerificationSheet } from "@/components/trust/VerificationSheet";
import { InsuranceBadge } from "@/components/trust/InsuranceBadge";
import { ReviewsSummary } from "@/components/trust/ReviewsSummary";
import { useSitterReviews } from "@/hooks/useSitterReviews";

const SitterProfile = () => {
  const { id } = useParams();
  const { data: sitter, isLoading } = useSitter(id);
  const { data: reviewsData } = useSitterReviews(sitter?.id);

  if (isLoading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!sitter) return <Navigate to="/sitters" replace />;

  const firstName = sitter.name.split(" ")[0];

  // Mock weekly availability snapshot
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const availability = [true, true, false, true, true, true, false];

  // Mock specialities derived from sitter flags
  const specialities = [
    sitter.newbornExperience && "Newborn",
    sitter.multiplesExperience && "Twins / multiples",
    sitter.senExperience && "SEN",
    sitter.maternityNurse && "Maternity nurse",
    sitter.nightNanny && "Night nanny",
    sitter.earlyYearsQualified && "Early years qualified",
    sitter.firstAidCertified && "First aid",
  ].filter(Boolean) as string[];

  const practical = [
    sitter.drives && "Drives",
    sitter.hasOwnCar && "Own car",
    sitter.swims && "Swims",
    sitter.cooks && "Cooks",
    sitter.lightHousework && "Light housework",
    sitter.homeworkHelp && "Homework help",
    sitter.nonSmoker && "Non-smoker",
    sitter.comfortableWithPets && "Pet-friendly",
  ].filter(Boolean) as string[];

  const reviews = reviewsData ?? [];
  const dateFmt = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-cream pb-28 lg:pb-0">
      <Header />

      <main className="container py-6 md:py-10">
        <Link to="/sitters" className="text-sm text-slate-grey hover:text-pitch-black">← Back to sitters</Link>

        <div className="mt-4 grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* LEFT — content */}
          <div className="space-y-8">
            {/* HEADER CARD */}
            <div className="overflow-hidden rounded-3xl bg-pure-white shadow-card">
              <div className="grid gap-6 p-6 sm:grid-cols-[180px_1fr] sm:p-8">
                <div className="relative">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-salmon-soft">
                    <img src={sitter.photo} alt={sitter.name} className="h-full w-full object-cover" />
                  </div>
                  {sitter.verified && (
                    <VerificationSheet
                      sitter={{
                        verified: sitter.verified,
                        police_cleared: sitter.policeCleared,
                        first_aid_certified: sitter.firstAidCertified,
                        early_years_qualified: sitter.earlyYearsQualified,
                      }}
                      trigger={
                        <button className="absolute -bottom-2 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-success-green px-2.5 py-1 text-[10px] font-bold uppercase text-pure-white shadow-card transition hover:scale-105">
                          <BadgeCheck className="h-3 w-3" /> Verified
                        </button>
                      }
                    />
                  )}
                </div>

                <div>
                  <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">{sitter.name}</h1>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-grey">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 fill-salmon text-salmon" />
                      <strong className="text-pitch-black">{sitter.rating || "New"}</strong>
                      {sitter.bookingsCompleted > 0 && <span className="text-slate-grey">({sitter.bookingsCompleted} bookings)</span>}
                    </span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {sitter.area}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {sitter.yearsExperience} yrs</span>
                  </div>

                  {sitter.headline && (
                    <p className="mt-4 text-base font-medium text-pitch-black">{sitter.headline}</p>
                  )}

                  <div className="mt-3"><ActivitySignal lastActiveAt={sitter.lastActiveAt} avgResponseMinutes={sitter.avgResponseMinutes} /></div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {sitter.policeCleared && <Pill icon={ShieldCheck} label="Police cleared" />}
                    {sitter.firstAidCertified && <Pill icon={Heart} label="First aid" />}
                    {sitter.earlyYearsQualified && <Pill icon={Award} label="Early years" />}
                    <Pill icon={Languages} label={sitter.languages.slice(0, 3).join(" · ")} />
                  </div>
                </div>
              </div>
            </div>

            {/* ABOUT */}
            <Section title="About me">
              <p className="text-base leading-relaxed text-pitch-black/85">
                {sitter.bio || `Hi, I'm ${firstName}. I love working with children and helping families feel supported. Get in touch if you'd like to chat.`}
              </p>
            </Section>

            {/* SPECIALITIES */}
            {specialities.length > 0 && (
              <Section title="Specialities">
                <div className="grid gap-2 sm:grid-cols-2">
                  {specialities.map(s => (
                    <div key={s} className="flex items-center gap-2 rounded-xl bg-pure-white p-3 shadow-card">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-success-green" />
                      <span className="text-sm font-medium text-pitch-black">{s}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* PRACTICAL */}
            {practical.length > 0 && (
              <Section title="Practical skills">
                <div className="flex flex-wrap gap-2">
                  {practical.map(p => (
                    <span key={p} className="rounded-full bg-pure-white px-3 py-1.5 text-xs font-medium text-pitch-black shadow-card">
                      {p}
                    </span>
                  ))}
                </div>
              </Section>
            )}

            {/* AVAILABILITY */}
            <Section title="This week's availability">
              <div className="grid grid-cols-7 gap-2">
                {days.map((d, i) => (
                  <div
                    key={d}
                    className={`flex flex-col items-center rounded-xl p-3 text-center text-xs font-semibold shadow-card ${
                      availability[i]
                        ? "bg-success-green/10 text-success-green"
                        : "bg-pure-white text-dust-grey"
                    }`}
                  >
                    <span>{d}</span>
                    <span className="mt-1.5">{availability[i] ? "●" : "—"}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-slate-grey">Message {firstName} to confirm specific times.</p>
            </Section>

            {/* CHECKS */}
            <VerificationPanel
              verified={sitter.verified}
              policeCleared={sitter.policeCleared}
              firstAidCertified={sitter.firstAidCertified}
              earlyYearsQualified={sitter.earlyYearsQualified}
              bookingsCompleted={sitter.bookingsCompleted}
            />

            {/* REVIEWS */}
            <ReviewsSummary
              reviews={reviews}
              fallbackRating={sitter.rating}
              fallbackBookings={sitter.bookingsCompleted}
            />
            {reviews.length > 0 && (
              <Section title={`What families said (${reviews.length})`}>
                <div className="space-y-4">
                  {reviews.slice(0, 6).map((r) => (
                    <div key={r.id} className="rounded-2xl bg-pure-white p-5 shadow-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-salmon-soft font-display font-bold text-salmon-deep">
                            {r.parent_name[0]}
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-pitch-black">{r.parent_name}</div>
                            <div className="text-xs text-slate-grey">
                              {dateFmt.format(new Date(r.created_at))} · Verified booking
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {Array.from({ length: r.rating }).map((_, j) => (
                            <Star key={j} className="h-3.5 w-3.5 fill-salmon text-salmon" />
                          ))}
                        </div>
                      </div>
                      {r.comment && (
                        <p className="mt-3 text-sm leading-relaxed text-pitch-black/85">"{r.comment}"</p>
                      )}
                    </div>
                  ))}
                </div>
                {reviews.length > 6 && (
                  <div className="mt-4 text-center">
                    <Link to={`/sitters/${sitter.id}/reviews`} className="text-sm font-semibold text-salmon-deep hover:text-salmon">
                      See all {reviews.length} reviews →
                    </Link>
                  </div>
                )}
              </Section>
            )}
          </div>

          {/* RIGHT — sticky booking */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="rounded-3xl bg-pure-white p-6 shadow-card-hover">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-display text-3xl font-bold text-pitch-black">
                      {formatCurrency(sitter.hourlyRate, sitter.currency)}
                    </span>
                    <span className="ml-1 text-sm text-slate-grey">/hr</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-grey">
                    <Star className="h-3.5 w-3.5 fill-salmon text-salmon" /> {sitter.rating || "New"}
                  </span>
                </div>

                <div className="mt-5 space-y-2">
                  <Button asChild size="lg" className="w-full rounded-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                    <Link to={`/book/${sitter.id}`}>
                      <Calendar className="h-4 w-4" /> Book {firstName}
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" className="w-full gap-2 rounded-full border-cream-deep">
                    <MessageCircle className="h-4 w-4" /> Message
                  </Button>
                </div>

                <ul className="mt-6 space-y-2.5 border-t border-cream-deep pt-5 text-sm">
                  <li className="flex items-center gap-2 text-slate-grey">
                    <CheckCircle2 className="h-4 w-4 text-success-green" /> Free to message
                  </li>
                  <li className="flex items-center gap-2 text-slate-grey">
                    <CheckCircle2 className="h-4 w-4 text-success-green" /> No charge until confirmed
                  </li>
                </ul>
                <div className="mt-4">
                  <InsuranceBadge variant="card" />
                </div>
              </div>

              <div className="rounded-2xl bg-cream p-5 text-center text-xs text-slate-grey">
                Concerned about a profile?{" "}
                <Link to="/" className="font-semibold text-salmon-deep hover:text-salmon">Report sitter</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-cream-deep bg-pure-white p-3 shadow-[0_-4px_20px_-8px_rgba(0,0,0,0.08)] lg:hidden">
        <div className="container flex items-center justify-between gap-3 px-4">
          <div>
            <div className="text-xs text-slate-grey">Book {firstName}</div>
            <div className="font-display text-base font-bold text-pitch-black">{formatCurrency(sitter.hourlyRate, sitter.currency)}/hr</div>
          </div>
          <Button asChild className="rounded-full bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
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
    <section>
      <h2 className="font-display text-xl font-bold text-pitch-black">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Pill({ icon: Icon, label }: { icon: typeof Star; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-pitch-black">
      <Icon className="h-3.5 w-3.5 text-salmon-deep" /> {label}
    </span>
  );
}

function CheckRow({ label, passed }: { label: string; passed: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-pure-white p-3.5 shadow-card">
      <span className="text-sm font-medium text-pitch-black">{label}</span>
      {passed ? (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-success-green">
          <CheckCircle2 className="h-4 w-4" /> Passed
        </span>
      ) : (
        <span className="text-xs font-medium text-dust-grey">Not on file</span>
      )}
    </div>
  );
}

export default SitterProfile;
