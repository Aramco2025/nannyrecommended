import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";

type Tab = "upcoming" | "past" | "cancelled";

const ParentBookings = () => {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("upcoming");
  const [bookings, setBookings] = useState<any[] | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("bookings")
        .select("id, start_at, end_at, hours, total_aed, status, sitter_id, sitters:sitter_id(full_name, photos)")
        .eq("parent_id", user.id)
        .order("start_at", { ascending: false });
      setBookings(data ?? []);
    })();
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const now = Date.now();
  const filtered = (bookings ?? []).filter(b => {
    if (b.status === "cancelled") return tab === "cancelled";
    const isPast = new Date(b.end_at).getTime() < now || b.status === "completed";
    return tab === "past" ? isPast : !isPast;
  });

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-3xl py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black md:text-4xl">My bookings</h1>
            <p className="mt-1 text-sm text-slate-grey">Track upcoming sits and review past ones.</p>
          </div>
          <Button asChild size="sm" className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
            <Link to="/sitters"><Search className="h-3.5 w-3.5" /> Find a sitter</Link>
          </Button>
        </div>

        <div role="tablist" className="mt-6 flex gap-2 border-b border-cream-deep">
          {(["upcoming", "past", "cancelled"] as Tab[]).map(t => (
            <button
              key={t} role="tab" aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-sm font-semibold capitalize transition-colors ${
                tab === t ? "text-pitch-black" : "text-slate-grey hover:text-pitch-black"
              }`}
            >
              {t}
              {tab === t && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-salmon" />}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {bookings === null ? (
            <div className="grid min-h-[200px] place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-cream-deep bg-pure-white p-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-slate-grey" />
              <h2 className="mt-3 font-display text-lg font-bold text-pitch-black">No {tab} bookings</h2>
              <p className="mt-1 text-sm text-slate-grey">When you book a sitter, it'll appear here.</p>
            </div>
          ) : (
            filtered.map(b => (
              <Link key={b.id} to={`/bookings/${b.id}`} className="block rounded-3xl bg-pure-white p-4 shadow-card transition hover:shadow-card-hover">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={b.sitters?.photos?.[0] ?? ""} alt="" className="h-12 w-12 shrink-0 rounded-full bg-cream object-cover" />
                    <div className="min-w-0">
                      <div className="font-medium text-pitch-black truncate">{b.sitters?.full_name ?? "Sitter"}</div>
                      <div className="text-xs text-slate-grey">{new Date(b.start_at).toLocaleString()} · {b.hours}h</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-pitch-black">{formatCurrency(Number(b.total_aed))}</div>
                    <div className="mt-0.5 inline-flex rounded-full bg-cream px-2 py-0.5 text-[11px] font-medium capitalize text-slate-grey">{b.status.replace("_", " ")}</div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ParentBookings;
