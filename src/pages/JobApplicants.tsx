import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useJobApplicants } from "@/hooks/useJobApplicants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ThumbsUp, MapPin, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/fees";

const JobApplicants = () => {
  const { jobId } = useParams();
  const { user, loading } = useAuth();
  const { data: applicants = [], isLoading } = useJobApplicants(jobId);
  const [job, setJob] = useState<any>(null);
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    if (!jobId) return;
    supabase.from("job_posts").select("*").eq("id", jobId).maybeSingle()
      .then(({ data }) => setJob(data));
  }, [jobId]);

  // Animate "Finding applicants" progress bar
  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(95, p + 5)), 1500);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const isOwner = job && job.parent_id === user.id;
  const dateLabel = job ? new Date(job.start_at).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />

      {/* Top status bar — mirrors the "LIVE" header */}
      <div className="border-b border-cream-deep bg-cream-deep/40">
        <div className="container flex items-center justify-between gap-3 py-3">
          <Link to="/account" className="inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-pure-white px-3 py-1 text-xs font-bold text-success-green shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-green opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success-green" />
            </span>
            LIVE
          </div>
          <Link to={`/parent/post-job`} className="text-sm font-semibold text-pitch-black hover:text-salmon-deep">Edit</Link>
        </div>
      </div>

      <main className="container max-w-2xl py-6">
        {job && (
          <div className="mb-5 rounded-2xl bg-pure-white p-4 shadow-card">
            <div className="text-sm font-semibold text-pitch-black">
              Request: {jobTypeLabel(job.type)} – {dateLabel}
            </div>
            <div className="mt-1 text-xs text-slate-grey">
              {job.area ?? "Your area"} · {formatCurrency(Number(job.hourly_rate_aed))}/hr
            </div>
          </div>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-pitch-black">
            {applicants.length === 0 ? "Finding applicants" : `${applicants.length} ${applicants.length === 1 ? "applicant" : "applicants"}`}
          </h2>
        </div>

        {applicants.length === 0 && (
          <div className="mb-6">
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-cream-deep">
              <div
                className="h-full rounded-full bg-success-green transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-grey">We're notifying nearby vetted sitters. New applicants will appear here in real time.</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-10 text-center text-sm text-slate-grey">Loading…</div>
        ) : (
          <ul className="space-y-3">
            {applicants.map(a => (
              <li key={a.application_id} className="flex items-center gap-3 rounded-2xl bg-pure-white p-3 shadow-card">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={a.avatar_url ?? undefined} />
                  <AvatarFallback>{(a.full_name ?? "S")[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="font-semibold text-pitch-black">{a.full_name}</div>
                    <span className="rounded-full bg-success-green/15 px-2 py-0.5 text-[11px] font-bold text-success-green">Available</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-grey">
                    {a.hourly_rate_aed != null && <span className="font-medium text-pitch-black">{formatCurrency(Number(a.hourly_rate_aed))}/hr</span>}
                    <span className="inline-flex items-center gap-0.5"><ThumbsUp className="h-3 w-3 text-success-green" />{a.rating ? `${Math.round(a.rating * 20)}%` : "New"}</span>
                    <span>{a.bookings_completed} bookings</span>
                    {a.area && <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{a.area}</span>}
                  </div>
                </div>
                {a.sitter_id && isOwner && (
                  <Button asChild size="icon" variant="outline" className="rounded-full">
                    <Link to={`/sitters/${a.sitter_id}`} aria-label="View sitter profile">
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
      <Footer />
      <MobileTabBar />
    </div>
  );
};

function jobTypeLabel(t: string) {
  switch (t) {
    case "one_off": return "One-off Childcare";
    case "repeat": return "Repeat Childcare";
    case "permanent": return "Permanent Role";
    default: return "Childcare";
  }
}

export default JobApplicants;
