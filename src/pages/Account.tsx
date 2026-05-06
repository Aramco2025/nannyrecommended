import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/fees";
import { Loader2 } from "lucide-react";
import { FamilyPlusCard } from "@/components/payments/FamilyPlusCard";
import { NextBookingCard } from "@/components/account/NextBookingCard";
import { LoyaltyProgress } from "@/components/LoyaltyProgress";
import { RecurringBookingsCard } from "@/components/parent/RecurringBookingsCard";
import { DeleteAccountSection } from "@/components/account/DeleteAccountSection";

type Booking = {
  id: string;
  start_at: string;
  end_at: string;
  hours: number;
  total_aed: number;
  status: string;
  sitter_id: string;
  address?: string | null;
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
          .select("id, start_at, end_at, hours, total_aed, status, sitter_id, address, sitters:sitter_id(full_name, photos)")
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

  const now = Date.now();
  const upcoming = (bookings ?? [])
    .filter((b) => ["pending", "confirmed", "in_progress"].includes(b.status))
    .filter((b) => new Date(b.end_at).getTime() >= now)
    .sort((a, b) => new Date(a.start_at).getTime() - new Date(b.start_at).getTime());
  const nextBooking = upcoming[0] ?? null;
  const completedCount = loyalty?.completed_bookings ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <h1 className="font-display text-3xl font-semibold text-pitch-black">Your account</h1>
        <p className="mt-1 text-sm text-slate-grey">{user.email}</p>

        <div className="mt-8">
          <NextBookingCard booking={nextBooking as any} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl bg-card p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-grey">
                  Loyalty · <span className="capitalize text-pitch-black">{loyalty?.tier ?? "bronze"}</span>
                </div>
                <h2 className="mt-1 font-display text-lg font-bold text-pitch-black">
                  {completedCount} booking{completedCount === 1 ? "" : "s"} completed
                </h2>
              </div>
              <span className="text-xs text-slate-grey">Lower fees as you go</span>
            </div>
            <LoyaltyProgress completedBookings={completedCount} className="mt-5" />
          </div>
          <FamilyPlusCard />
        </div>

        <div className="mt-6 rounded-3xl bg-card p-6 shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-grey">
            Settings & support
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            <Button asChild variant="outline" className="justify-start rounded-full"><Link to="/parent/family">My family</Link></Button>
            <Button asChild variant="outline" className="justify-start rounded-full"><Link to="/parent/bookings">All bookings</Link></Button>
            <Button asChild variant="outline" className="justify-start rounded-full"><Link to="/account/notifications">Notifications</Link></Button>
            <Button asChild variant="outline" className="justify-start rounded-full"><Link to="/referrals">Refer & earn AED 50</Link></Button>
            <Button asChild variant="outline" className="justify-start rounded-full"><Link to="/contact">Contact support</Link></Button>
          </div>
        </div>

        <div className="mt-6"><RecurringBookingsCard /></div>

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
                <Link to={`/bookings/${b.id}`} className="flex items-center justify-between gap-4">
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
                </Link>
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

        <DeleteAccountSection />
      </main>
      <Footer />
    </div>
  );
};

export default Account;
