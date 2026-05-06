import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useMyApplications } from "@/hooks/useJobPosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, MapPin, Wallet, Inbox } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { EmptyState } from "@/components/EmptyState";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-cream-deep text-slate-grey",
  accepted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
  withdrawn: "bg-cream-deep text-slate-grey",
};

const SitterApplications = () => {
  const { user, loading } = useAuth();
  const { data: apps, isLoading } = useMyApplications();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const grouped = {
    active: (apps ?? []).filter((a: any) => a.status === "pending" || a.status === "accepted"),
    past: (apps ?? []).filter((a: any) => a.status === "rejected" || a.status === "withdrawn"),
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">My applications</h1>
            <p className="mt-1 text-sm text-slate-grey">Track jobs you've applied to.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/sitter/jobs">Find more jobs</Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="mt-10 grid min-h-[200px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (apps ?? []).length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={<Inbox className="h-5 w-5" />}
              title="No applications yet"
              description="Browse open jobs and apply to start picking up sits."
              ctaLabel="Browse jobs"
              ctaTo="/sitter/jobs"
            />
          </div>
        ) : (
          <div className="mt-8 space-y-8">
            {grouped.active.length > 0 && <Section title="Active" apps={grouped.active} />}
            {grouped.past.length > 0 && <Section title="Past" apps={grouped.past} />}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

const Section = ({ title, apps }: { title: string; apps: any[] }) => (
  <section>
    <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-grey">{title}</h2>
    <div className="space-y-3">
      {apps.map((a) => {
        const job = a.job_posts;
        if (!job) return null;
        const start = new Date(job.start_at);
        const end = new Date(job.end_at);
        return (
          <Link
            key={a.id}
            to={`/sitter/jobs/${job.id}`}
            className="block rounded-3xl bg-pure-white p-5 shadow-card transition hover:shadow-lg"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-display text-base font-bold text-pitch-black">{format(start, "EEE do MMM")}</div>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-grey">
                  <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-salmon" /> {format(start, "h:mma")}–{format(end, "h:mma")}</span>
                  {job.area && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-salmon" /> {job.area}</span>}
                  <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-salmon" /> AED {job.hourly_rate_aed}/hr</span>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`rounded-full text-[10px] font-semibold uppercase ${STATUS_STYLES[a.status] ?? "bg-cream-deep text-slate-grey"}`}>
                  {a.status}
                </Badge>
                <p className="mt-1 text-[11px] text-slate-grey">Applied {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

export default SitterApplications;
