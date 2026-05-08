import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, Users, Pencil, XCircle, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

type Job = {
  id: string; type: string; status: string;
  start_at: string; end_at: string;
  area: string | null; hourly_rate_aed: number;
  decision_deadline_at: string | null;
};

export default function JobPosted() {
  const { jobId } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [count, setCount] = useState(0);
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    if (!jobId) return;
    const [{ data: j }, { count: c }] = await Promise.all([
      supabase.from("job_posts").select("*").eq("id", jobId).maybeSingle(),
      supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("job_post_id", jobId).eq("status", "pending"),
    ]);
    setJob(j as any);
    setCount(c ?? 0);
  };

  useEffect(() => { reload(); /* eslint-disable-line */ }, [jobId]);

  // Live applicant counter — poll + subscribe.
  useEffect(() => {
    if (!jobId) return;
    const t = setInterval(reload, 15_000);
    const ch = supabase
      .channel(`job-applicants-${jobId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "job_applications", filter: `job_post_id=eq.${jobId}` }, reload)
      .subscribe();
    return () => { clearInterval(t); supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;
  if (!job) return <div className="min-h-screen bg-background"><Header /><main className="container py-12 text-center text-sm text-slate-grey">Loading…</main></div>;

  const cancel = async () => {
    setBusy(true);
    const { error } = await supabase.from("job_posts").update({ status: "cancelled" }).eq("id", job.id);
    setBusy(false);
    if (error) return toast({ title: "Couldn't cancel", description: error.message, variant: "destructive" });
    toast({ title: "Request cancelled" });
    navigate("/parent/home");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-10">
        <section className="rounded-3xl bg-gradient-to-br from-salmon-soft via-cream to-pure-white p-8 text-center shadow-card">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-pure-white text-success-green shadow-sm">
            <CheckCircle2 className="h-7 w-7" />
          </div>
          <h1 className="mt-3 font-display text-2xl font-bold text-pitch-black">Your request is live!</h1>
          <p className="mt-1 text-sm text-slate-grey">
            Verified sitters in {job.area ?? "your area"} are getting notified now.
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-pure-white px-4 py-2 shadow-sm">
            <Users className="h-4 w-4 text-salmon-deep" />
            <span className="text-sm font-semibold text-pitch-black">
              {count} {count === 1 ? "sitter applied" : "sitters applied"}
            </span>
            <Sparkles className="h-3 w-3 text-salmon-deep" />
          </div>
        </section>

        <section className="mt-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-grey">Request details</div>
          <div className="mt-2 text-sm text-pitch-black">
            {format(new Date(job.start_at), "EEE do MMM, h:mma")} – {format(new Date(job.end_at), "h:mma")}
          </div>
          <div className="mt-1 text-sm text-slate-grey">
            {job.area ?? "—"} · AED {job.hourly_rate_aed}/hr · {job.type.replace("_", "-")}
          </div>
          {job.decision_deadline_at && (
            <div className="mt-2 text-xs text-slate-grey">
              Pick a sitter by {format(new Date(job.decision_deadline_at), "EEE do MMM, h:mma")}.
            </div>
          )}
        </section>

        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <Button asChild size="lg" className="bg-pitch-black text-pure-white hover:bg-pitch-black/90">
            <Link to={`/parent/jobs/${job.id}/applicants`}>
              View applicants {count > 0 && `(${count})`}
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to={`/parent/post-job?edit=${job.id}`}>
              <Pencil className="h-4 w-4" /> Edit request
            </Link>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-3 w-full text-salmon-deep hover:text-salmon-deep"
          onClick={cancel}
          disabled={busy}
        >
          <XCircle className="h-4 w-4" /> Cancel this request
        </Button>
      </main>
    </div>
  );
}
