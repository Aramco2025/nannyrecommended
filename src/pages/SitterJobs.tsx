import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useJobPosts, useApplyToJob, useMyApplications, JobType } from "@/hooks/useJobPosts";
import { JobCard } from "@/components/sitter/JobCard";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const TABS: { key: JobType; label: string }[] = [
  { key: "one_off", label: "One-off" },
  { key: "repeat", label: "Repeat" },
  { key: "permanent", label: "Permanent" },
];

const SitterJobs = () => {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<JobType>("one_off");
  const { data: jobs, isLoading } = useJobPosts(tab);
  const { data: myApps } = useMyApplications();
  const apply = useApplyToJob();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const appliedIds = new Set((myApps ?? []).map((a: any) => a.job_post_id));

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container py-8 md:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">Jobs to apply for</h1>
            <p className="mt-1 text-sm text-slate-grey">Real UAE families looking for childcare right now.</p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/sitter/notifications">Notification settings</Link>
          </Button>
        </div>

        <div role="tablist" className="mt-6 flex gap-2 border-b border-cream-deep">
          {TABS.map(t => (
            <button
              key={t.key}
              role="tab"
              aria-selected={tab === t.key}
              onClick={() => setTab(t.key)}
              className={`relative px-4 py-3 text-sm font-semibold transition-colors ${
                tab === t.key ? "text-pitch-black" : "text-slate-grey hover:text-pitch-black"
              }`}
            >
              {t.label}
              {tab === t.key && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-salmon" />}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="grid min-h-[200px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (jobs ?? []).length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cream-deep bg-pure-white p-10 text-center">
              <p className="text-sm text-slate-grey">No {TABS.find(t=>t.key===tab)?.label.toLowerCase()} jobs near you right now.</p>
              <Button asChild variant="outline" size="sm" className="mt-4 rounded-full">
                <Link to="/sitter/notifications">Widen your radius</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(jobs ?? []).map((j: any) => (
                <JobCard
                  key={j.id}
                  job={j}
                  applied={appliedIds.has(j.id)}
                  busy={apply.isPending}
                  onApply={async () => {
                    try {
                      await apply.mutateAsync({ jobId: j.id });
                      toast({ title: "Application sent", description: "The parent will see your profile." });
                    } catch (e: any) {
                      toast({ title: "Couldn't apply", description: e.message, variant: "destructive" });
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitterJobs;
