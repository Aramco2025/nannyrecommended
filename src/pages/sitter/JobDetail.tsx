import { Navigate, useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useApplyToJob, useMyApplications } from "@/hooks/useJobPosts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, MapPin, Clock, Wallet, ArrowLeft, Car, PawPrint, Users, CalendarDays } from "lucide-react";
import { format, formatDistanceToNow, differenceInMinutes } from "date-fns";
import { toast } from "@/hooks/use-toast";

const SitterJobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const apply = useApplyToJob();
  const { data: myApps } = useMyApplications();

  const { data: job, isLoading } = useQuery({
    queryKey: ["job_post", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase.from("job_posts").select("*").eq("id", id!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const applied = (myApps ?? []).some((a: any) => a.job_post_id === id);

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <button onClick={() => navigate(-1)} className="mb-4 inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </button>

        {isLoading || !job ? (
          <div className="grid min-h-[300px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (() => {
          const start = new Date(job.start_at);
          const end = new Date(job.end_at);
          const hours = Math.max(0, differenceInMinutes(end, start) / 60);
          const total = hours * Number(job.hourly_rate_aed);
          const pets = Array.isArray(job.pets) ? job.pets : [];
          return (
            <article className="rounded-3xl bg-pure-white p-6 shadow-card md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <Badge variant="secondary" className="rounded-full bg-salmon-soft/60 text-[10px] font-semibold uppercase text-salmon-deep hover:bg-salmon-soft/60">
                    {job.type.replace("_", " ")}
                  </Badge>
                  <h1 className="mt-2 font-display text-2xl font-bold text-pitch-black md:text-3xl">
                    {format(start, "EEEE do MMMM")}
                  </h1>
                  <p className="mt-1 text-sm text-slate-grey">Posted {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl font-bold text-pitch-black">AED {total.toFixed(0)}</div>
                  <div className="text-xs text-slate-grey">est. for {hours.toFixed(1)}h</div>
                </div>
              </div>

              <dl className="mt-6 grid gap-3 text-sm md:grid-cols-2">
                <Row icon={<Clock className="h-4 w-4 text-salmon" />} label="When" value={`${format(start, "h:mma")} – ${format(end, "h:mma")}`} />
                <Row icon={<Wallet className="h-4 w-4 text-salmon" />} label="Rate" value={`AED ${job.hourly_rate_aed}/hr`} />
                {job.area && <Row icon={<MapPin className="h-4 w-4 text-salmon" />} label="Area" value={job.area} />}
                <Row icon={<Users className="h-4 w-4 text-salmon" />} label="Children" value={`${(job.children_ids ?? []).length || "—"}`} />
                {pets.length > 0 && <Row icon={<PawPrint className="h-4 w-4 text-salmon" />} label="Pets" value={pets.map((p: any) => p.type ?? p).join(", ")} />}
                {job.parking && <Row icon={<Car className="h-4 w-4 text-salmon" />} label="Parking" value={job.parking} />}
                <Row icon={<CalendarDays className="h-4 w-4 text-salmon" />} label="Type" value={job.type.replace("_", " ")} />
              </dl>

              {job.notes && (
                <div className="mt-6 rounded-2xl bg-cream p-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-grey">Notes from family</h2>
                  <p className="mt-2 whitespace-pre-line text-sm text-pitch-black">{job.notes}</p>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-cream-deep pt-6">
                <p className="text-xs text-slate-grey">Address shared after the family accepts your application.</p>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="rounded-full">
                    <Link to="/sitter/applications">My applications</Link>
                  </Button>
                  <Button
                    size="sm"
                    disabled={applied || apply.isPending}
                    onClick={async () => {
                      try {
                        await apply.mutateAsync({ jobId: job.id });
                        toast({ title: "Application sent", description: "The family will review your profile." });
                      } catch (e: any) {
                        toast({ title: "Couldn't apply", description: e.message, variant: "destructive" });
                      }
                    }}
                    className="rounded-full bg-salmon px-6 text-primary-foreground hover:bg-salmon-deep"
                  >
                    {applied ? "Applied" : apply.isPending ? "Applying…" : "Apply now"}
                  </Button>
                </div>
              </div>
            </article>
          );
        })()}
      </main>
      <Footer />
    </div>
  );
};

const Row = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-start gap-3 rounded-2xl bg-cream/60 p-3">
    <div className="mt-0.5">{icon}</div>
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-grey">{label}</dt>
      <dd className="text-sm font-medium text-pitch-black">{value}</dd>
    </div>
  </div>
);

export default SitterJobDetail;
