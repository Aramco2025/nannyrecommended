import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/fees";

const STATUSES = ["all", "pending_payment", "pending", "confirmed", "in_progress", "completed", "cancelled", "declined"] as const;

export default function AdminBookings() {
  const { user, roles, loading } = useAuth();
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("all");
  const [rows, setRows] = useState<any[] | null>(null);

  useEffect(() => {
    if (!user || !roles.includes("admin")) return;
    let q = supabase
      .from("bookings")
      .select("id, start_at, hours, status, total_aed, sitter_payout_aed, parent_id, sitter_id, sitters:sitter_id(full_name), profiles:parent_id(full_name)")
      .order("start_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter as any);
    q.then(({ data }) => setRows(data ?? []));
  }, [user, roles, filter]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!roles.includes("admin")) return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container py-16 text-center"><p className="text-slate-grey">Admins only.</p></main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <h1 className="font-display text-3xl font-bold text-pitch-black">All bookings</h1>
        <p className="mt-1 text-sm text-slate-grey">Admin view — newest first.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === s ? "bg-pitch-black text-pure-white" : "bg-cream text-slate-grey hover:bg-cream-deep"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {!rows ? (
            <div className="grid h-40 place-items-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : rows.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-grey">No bookings.</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-cream text-left text-xs uppercase tracking-wider text-slate-grey">
                <tr>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Parent</th>
                  <th className="px-4 py-3">Sitter</th>
                  <th className="px-4 py-3">Hours</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-4 py-3">{format(new Date(r.start_at), "do MMM, h:mma")}</td>
                    <td className="px-4 py-3">{r.profiles?.full_name ?? "—"}</td>
                    <td className="px-4 py-3">{r.sitters?.full_name ?? "—"}</td>
                    <td className="px-4 py-3">{r.hours}</td>
                    <td className="px-4 py-3">{formatCurrency(Number(r.total_aed))}</td>
                    <td className="px-4 py-3"><Badge className="rounded-full capitalize">{r.status.replace("_", " ")}</Badge></td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/bookings/${r.id}`} className="text-xs font-medium text-pitch-black underline">Open</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
