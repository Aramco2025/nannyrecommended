import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileTabBar } from "@/components/MobileTabBar";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useJobApplicants } from "@/hooks/useJobApplicants";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, ThumbsUp, MapPin, Check, X } from "lucide-react";
import { formatCurrency } from "@/lib/fees";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";

const JobApplicants = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { data: applicants = [], isLoading, refetch } = useJobApplicants(jobId);
  const [job, setJob] = useState<any>(null);
  const [progress, setProgress] = useState(20);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    supabase.from("job_posts").select("*").eq("id", jobId).maybeSingle()
      .then(({ data }) => setJob(data));
  }, [jobId]);

  useEffect(() => {
    const t = setInterval(() => setProgress(p => Math.min(95, p + 5)), 1500);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const isOwner = job && job.parent_id === user.id;
  const dateLabel = job ? new Date(job.start_at).toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "";
  const isCancelled = job?.status === "cancelled";
  const isFilled = job?.status === "filled";

  const decline = async (appId: string) => {
    setBusyId(appId);
    try {
      const { error } = await supabase.from("job_applications").update({ status: "declined" }).eq("id", appId);
      if (error) throw error;
      toast({ title: "Applicant declined" });
      refetch();
    } catch (e: any) {
      toast({ title: "Couldn't decline", description: e.message, variant: "destructive" });
    } finally { setBusyId(null); }
  };

  const hire = (sitterId: string | null, appId: string) => {
    if (!sitterId || !job) return;
    const start = new Date(job.start_at);
    const end = new Date(job.end_at);
    const hours = Math.max(1, Math.round((end.getTime() - start.getTime()) / 3600000));
    const date = start.toISOString().slice(0, 10);
    const startTime = start.toTimeString().slice(0, 5);
    navigate(`/book/${sitterId}?date=${date}&start=${startTime}&hours=${hours}&application_id=${appId}&job_id=${job.id}`);
  };

  const cancelJob = async () => {
    if (!job) return;
    try {
      const { error } = await supabase.from("job_posts").update({ status: "cancelled" }).eq("id", job.id);
      if (error) throw error;
      toast({ title: "Request cancelled" });
      navigate("/account");
    } catch (e: any) {
      toast({ title: "Couldn't cancel", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />

      <div className="border-b border-cream-deep bg-cream-deep/40">
        <div className="container flex items-center justify-between gap-3 py-3">
          <Link to="/account" className="inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          {isCancelled ? (
            <div className="rounded-full bg-pure-white px-3 py-1 text-xs font-bold text-slate-grey shadow-sm">CANCELLED</div>
          ) : isFilled ? (
            <div className="rounded-full bg-pure-white px-3 py-1 text-xs font-bold text-success-green shadow-sm">FILLED</div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-pure-white px-3 py-1 text-xs font-bold text-success-green shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success-green opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success-green" />
              </span>
              LIVE
            </div>
          )}
          {isOwner && !isCancelled && !isFilled ? (
            <Link to={`/parent/post-job?edit=${job.id}`} className="text-sm font-semibold text-pitch-black hover:text-salmon-deep">Edit</Link>
          ) : <span className="w-10" />}
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
          {isOwner && !isCancelled && !isFilled && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-grey hover:text-destructive">Cancel request</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancel this request?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All applicants will be notified. You can post a new request anytime.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Don't cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={cancelJob}>Yes, cancel</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {applicants.length === 0 && !isCancelled && (
          <div className="mb-6">
            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-cream-deep">
              <div className="h-full rounded-full bg-success-green transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-slate-grey">We're notifying nearby vetted sitters. New applicants will appear here in real time.</p>
          </div>
        )}

        {isLoading ? (
          <div className="py-10 text-center text-sm text-slate-grey">Loading…</div>
        ) : (
          <ul className="space-y-3">
            {applicants.map(a => {
              const declined = a.status === "declined";
              const accepted = a.status === "accepted";
              return (
                <li key={a.application_id} className={`rounded-2xl bg-pure-white p-3 shadow-card ${declined ? "opacity-60" : ""}`}>
                  <div className="flex items-center gap-3">
                    <Link to={a.sitter_id ? `/sitters/${a.sitter_id}` : "#"}>
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={a.avatar_url ?? undefined} />
                        <AvatarFallback>{(a.full_name ?? "S")[0]}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <Link to={a.sitter_id ? `/sitters/${a.sitter_id}` : "#"} className="font-semibold text-pitch-black hover:underline">
                          {a.full_name}
                        </Link>
                        {accepted ? (
                          <span className="rounded-full bg-success-green/15 px-2 py-0.5 text-[11px] font-bold text-success-green">Hired</span>
                        ) : declined ? (
                          <span className="rounded-full bg-cream-deep px-2 py-0.5 text-[11px] font-bold text-slate-grey">Declined</span>
                        ) : (
                          <span className="rounded-full bg-success-green/15 px-2 py-0.5 text-[11px] font-bold text-success-green">Available</span>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-grey">
                        {a.hourly_rate_aed != null && <span className="font-medium text-pitch-black">{formatCurrency(Number(a.hourly_rate_aed))}/hr</span>}
                        <span className="inline-flex items-center gap-0.5"><ThumbsUp className="h-3 w-3 text-success-green" />{a.rating ? `${Math.round(a.rating * 20)}%` : "New"}</span>
                        <span>{a.bookings_completed} bookings</span>
                        {a.area && <span className="inline-flex items-center gap-0.5"><MapPin className="h-3 w-3" />{a.area}</span>}
                      </div>
                    </div>
                  </div>
                  {isOwner && !declined && !accepted && !isCancelled && !isFilled && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm" variant="outline" className="flex-1 rounded-full"
                        disabled={busyId === a.application_id}
                        onClick={() => decline(a.application_id)}
                      >
                        <X className="mr-1 h-4 w-4" /> Decline
                      </Button>
                      <Button
                        size="sm" className="flex-1 rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep"
                        disabled={!a.sitter_id}
                        onClick={() => hire(a.sitter_id, a.application_id)}
                      >
                        <Check className="mr-1 h-4 w-4" /> Hire & pay
                      </Button>
                    </div>
                  )}
                </li>
              );
            })}
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
