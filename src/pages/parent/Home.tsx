import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { NextBookingCard } from "@/components/account/NextBookingCard";
import { Loader2, Search, FileText, MessageCircle, Heart, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useChildren } from "@/hooks/useChildren";

const ParentHome = () => {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [favCount, setFavCount] = useState(0);
  const [openJobs, setOpenJobs] = useState<any[]>([]);
  const { data: children } = useChildren();

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: bks }, { count: fc }, { data: jobs }] = await Promise.all([
        supabase.from("bookings").select("id, start_at, end_at, hours, status, sitter_id, address, sitters:sitter_id(full_name, photos)").eq("parent_id", user.id).order("start_at"),
        supabase.from("favourites").select("id", { count: "exact", head: true }).eq("parent_id", user.id),
        supabase.from("job_posts").select("*").eq("parent_id", user.id).eq("status", "open").order("start_at"),
      ]);
      setBookings((bks ?? []) as any);
      setFavCount(fc ?? 0);
      setOpenJobs(jobs ?? []);
    })();
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const now = Date.now();
  const upcoming = bookings.filter(b => ["pending","confirmed","in_progress"].includes(b.status) && new Date(b.end_at).getTime() >= now)
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  const next = upcoming[0] ?? null;

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />
      <main className="container max-w-5xl py-8">
        <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-grey">Here's what's happening with your childcare.</p>

        <div className="mt-8">
          <NextBookingCard booking={next as any} />
        </div>

        <section className="mt-8">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-grey">Quick actions</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionTile to="/sitters" icon={<Search className="h-5 w-5" />} title="Find a sitter" subtitle="Browse vetted profiles" />
            <ActionTile to="/parent/post-job" icon={<FileText className="h-5 w-5" />} title="Post a job" subtitle="Sitters apply to you" />
            <ActionTile to="/messages" icon={<MessageCircle className="h-5 w-5" />} title="Messages" subtitle="Inbox & threads" />
            <ActionTile to="/favourites" icon={<Heart className="h-5 w-5" />} title={`Favourites (${favCount})`} subtitle="Saved sitters" />
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl bg-pure-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-pitch-black">My family</h2>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-slate-grey"><Link to="/parent/family">Manage <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            </div>
            {(children ?? []).length === 0 ? (
              <div className="mt-3 rounded-2xl bg-cream p-4 text-center text-sm text-slate-grey">
                <Users className="mx-auto h-6 w-6" />
                <p className="mt-2">Add your children so sitters arrive prepared.</p>
                <Button asChild size="sm" className="mt-3 rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                  <Link to="/parent/family">Add a child</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {(children ?? []).map(c => (
                  <span key={c.id} className="inline-flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-sm font-medium text-pitch-black">
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-salmon-soft text-[10px] font-bold text-salmon-deep">
                      {c.name[0]?.toUpperCase()}
                    </span>
                    {c.name}
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-pure-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-pitch-black">Open job posts</h2>
              <Button asChild variant="ghost" size="sm" className="rounded-full text-slate-grey"><Link to="/parent/post-job">New <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
            </div>
            {openJobs.length === 0 ? (
              <p className="mt-3 rounded-2xl bg-cream p-4 text-center text-sm text-slate-grey">No open posts. Post a job to receive applications from sitters.</p>
            ) : (
              <div className="mt-3 space-y-2">
                {openJobs.slice(0, 3).map(j => (
                  <Link key={j.id} to={`/parent/jobs/${j.id}/applicants`} className="flex items-center justify-between rounded-2xl bg-cream p-3 text-sm hover:bg-cream-deep">
                    <div>
                      <div className="font-medium text-pitch-black">{new Date(j.start_at).toLocaleString()}</div>
                      <div className="text-xs text-slate-grey">{j.area ?? "—"} · AED {j.hourly_rate_aed}/hr · {j.type.replace("_", " ")}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-grey" />
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-bold text-pitch-black">All bookings</h2>
            <Button asChild variant="ghost" size="sm" className="rounded-full text-slate-grey"><Link to="/parent/bookings">See all <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

const ActionTile = ({ to, icon, title, subtitle }: { to: string; icon: React.ReactNode; title: string; subtitle: string }) => (
  <Link to={to} className="group flex items-start gap-3 rounded-3xl bg-pure-white p-4 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-salmon-soft text-salmon-deep transition group-hover:bg-salmon group-hover:text-pure-white">
      {icon}
    </span>
    <div className="min-w-0">
      <div className="font-display text-sm font-bold text-pitch-black">{title}</div>
      <div className="text-xs text-slate-grey">{subtitle}</div>
    </div>
  </Link>
);

export default ParentHome;
