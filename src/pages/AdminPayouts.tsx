import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const STATUSES = ["requested", "processing", "ready_for_pickup", "completed", "cancelled"] as const;

const AdminPayouts = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>("requested");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      setIsAdmin((data ?? []).some(r => r.role === "admin"));
    })();
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;
    let q = supabase.from("cash_out_requests").select("*").order("requested_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter as any);
    q.then(({ data }) => setRows(data ?? []));
  }, [isAdmin, filter]);

  const setStatus = async (id: string, status: string) => {
    const patch: any = { status };
    if (status === "processing") patch.processed_at = new Date().toISOString();
    if (status === "completed") patch.completed_at = new Date().toISOString();
    const { error } = await supabase.from("cash_out_requests").update(patch).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setRows(rs => rs.map(r => r.id === id ? { ...r, ...patch } : r));
    toast({ title: `Marked ${status.replace("_", " ")}` });
  };

  if (loading || isAdmin === null) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <div className="grid min-h-screen place-items-center text-sm text-slate-grey">Admin access required.</div>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="font-display text-3xl font-semibold text-pitch-black">Cash-out queue</h1>
        <p className="mt-1 text-sm text-slate-grey">Manually process sitter payouts. Wallet has already been debited.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {(["requested", "processing", "ready_for_pickup", "completed", "all"] as const).map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1 text-xs font-medium capitalize transition ${filter === s ? "bg-pitch-black text-primary-foreground" : "border border-border bg-card text-slate-grey"}`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {rows.length === 0 && <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-slate-grey">No requests in this status.</div>}
          {rows.map(r => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-mono text-xs text-slate-grey">{r.id.slice(0, 8)}</div>
                  <div className="mt-1 font-semibold text-pitch-black">{formatMoney(Number(r.amount_minor_units))} · {r.method.replace(/_/g, " ")}</div>
                  <div className="mt-1 text-xs text-slate-grey">
                    Sitter {r.sitter_id.slice(0, 8)} · requested {new Date(r.requested_at).toLocaleString()}
                  </div>
                  {r.pickup_reference && <div className="mt-2 inline-block rounded bg-salmon/10 px-2 py-1 font-mono text-sm text-salmon-deep">code {r.pickup_reference}</div>}
                  {r.bank_iban && <div className="mt-1 text-xs text-slate-grey">IBAN {r.bank_iban} · {r.bank_account_holder}</div>}
                  {r.voucher_provider && <div className="mt-1 text-xs text-slate-grey">Voucher: {r.voucher_provider}</div>}
                  {r.airtime_phone && <div className="mt-1 text-xs text-slate-grey">{r.airtime_operator} · {r.airtime_phone}</div>}
                </div>
                <span className="rounded-full bg-off-white px-2 py-0.5 text-[11px] font-medium capitalize text-slate-grey">{r.status.replace(/_/g, " ")}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {STATUSES.filter(s => s !== r.status).map(s => (
                  <Button key={s} variant="outline" size="sm" onClick={() => setStatus(r.id, s)} className="text-xs capitalize">{s.replace(/_/g, " ")}</Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminPayouts;
