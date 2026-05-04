import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import { Loader2 } from "lucide-react";

type Booking = {
  id: string;
  start_at: string;
  end_at: string;
  hours: number;
  total_aed: number;
  status: string;
  sitter_id: string;
  sitters?: { full_name: string | null; photos: string[] | null } | null;
};

const Account = () => {
  const { user, loading } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [loyalty, setLoyalty] = useState<{ completed_bookings: number; tier: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: bks }, { data: loy }] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, start_at, end_at, hours, total_aed, status, sitter_id, sitters:sitter_id(full_name, photos)")
          .eq("parent_id", user.id)
          .order("start_at", { ascending: false }),
        supabase.from("loyalty").select("completed_bookings, tier").eq("parent_id", user.id).maybeSingle(),
      ]);
      setBookings((bks ?? []) as any);
      setLoyalty(loy);
    })();
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <h1 className="text-3xl font-semibold text-pitch-black">Your account</h1>
        <p className="mt-1 text-sm text-slate-grey">{user.email}</p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-slate-grey">Loyalty tier</div>
            <div className="mt-1 text-2xl font-semibold capitalize text-pitch-black">{loyalty?.tier ?? "bronze"}</div>
            <div className="mt-1 text-xs text-slate-grey">{loyalty?.completed_bookings ?? 0} bookings completed</div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-slate-grey">Active bookings</div>
            <div className="mt-1 text-2xl font-semibold text-pitch-black">
              {bookings?.filter(b => ["pending", "confirmed", "in_progress"].includes(b.status)).length ?? 0}
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="text-xs uppercase tracking-wide text-slate-grey">Need a sitter?</div>
            <Button asChild className="mt-3 w-full bg-salmon hover:bg-salmon-deep text-primary-foreground">
              <Link to="/sitters">Find a sitter</Link>
            </Button>
          </div>
        </div>

        <h2 className="mt-12 text-xl font-semibold text-pitch-black">Your bookings</h2>
        <div className="mt-4 space-y-3">
          {(bookings ?? []).length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-slate-grey">
              No bookings yet. <Link to="/sitters" className="text-pitch-black underline">Browse sitters</Link>.
            </div>
          )}
          {(bookings ?? []).map(b => {
            const canRelease = b.status === "confirmed" || b.status === "in_progress";
            return (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={b.sitters?.photos?.[0] ?? ""} alt="" className="h-12 w-12 rounded-full bg-muted object-cover" />
                    <div>
                      <div className="font-medium text-pitch-black">{b.sitters?.full_name ?? "Sitter"}</div>
                      <div className="text-xs text-slate-grey">{new Date(b.start_at).toLocaleString()} · {b.hours}h</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-pitch-black">{formatCurrency(Number(b.total_aed))}</div>
                    <div className="mt-0.5 inline-flex rounded-full bg-off-white px-2 py-0.5 text-[11px] font-medium capitalize text-slate-grey">
                      {b.status.replace("_", " ")}
                    </div>
                  </div>
                </div>
                {canRelease && (
                  <Button size="sm" className="mt-3 bg-success-green hover:bg-success-green/90 text-primary-foreground"
                    onClick={async () => {
                      const { error } = await supabase.rpc("release_booking_escrow", { _booking: b.id });
                      if (error) return alert(error.message);
                      setBookings(bs => (bs ?? []).map(x => x.id === b.id ? { ...x, status: "completed" } : x));
                    }}>
                    Confirm completion · release payment
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Account;
