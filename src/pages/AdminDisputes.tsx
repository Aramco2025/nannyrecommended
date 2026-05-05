import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ShieldAlert, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/fees";

const STATUSES = ["all", "open", "reviewing", "resolved_refund", "resolved_partial", "dismissed"] as const;

type Dispute = {
  id: string;
  booking_id: string;
  parent_id: string;
  sitter_id: string;
  reason: string;
  description: string;
  status: string;
  resolution_note: string | null;
  refund_amount_aed: number | null;
  created_at: string;
  resolved_at: string | null;
  bookings?: { start_at: string; hours: number; total_aed: number; status: string } | null;
  parent?: { full_name: string | null } | null;
  sitter?: { full_name: string | null } | null;
};

export default function AdminDisputes() {
  const { user, roles, loading } = useAuth();
  const [filter, setFilter] = useState<(typeof STATUSES)[number]>("open");
  const [rows, setRows] = useState<Dispute[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const reload = async () => {
    let q = supabase
      .from("disputes")
      .select("*, bookings:booking_id(start_at, hours, total_aed, status), parent:parent_id(full_name), sitter:sitter_id(full_name)")
      .order("created_at", { ascending: false })
      .limit(200);
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    setRows((data ?? []) as any);
  };

  useEffect(() => {
    if (!user || !roles.includes("admin")) return;
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, roles, filter]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!roles.includes("admin")) return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container py-16 text-center"><p className="text-slate-grey">Admins only.</p></main>
    </div>
  );

  const resolve = async (d: Dispute, status: string, note: string, refund?: number) => {
    setBusy(d.id);
    const { error } = await supabase
      .from("disputes")
      .update({
        status,
        resolution_note: note || null,
        refund_amount_aed: refund ?? null,
        resolved_at: new Date().toISOString(),
      } as any)
      .eq("id", d.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    toast.success("Dispute updated");
    reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <div className="flex items-center gap-3">
          <ShieldAlert className="h-6 w-6 text-salmon-deep" />
          <h1 className="font-display text-3xl font-bold text-pitch-black">Disputes</h1>
        </div>
        <p className="mt-1 text-sm text-slate-grey">Trust queue — review, refund, or dismiss.</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium capitalize transition ${
                filter === s ? "bg-pitch-black text-pure-white" : "bg-cream text-slate-grey hover:bg-cream-deep"
              }`}
            >
              {s.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {!rows ? (
            <div className="grid place-items-center py-16"><Loader2 className="h-5 w-5 animate-spin text-slate-grey" /></div>
          ) : rows.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center text-sm text-slate-grey">No disputes here.</div>
          ) : rows.map(d => (
            <DisputeRow key={d.id} d={d} busy={busy === d.id} onResolve={resolve} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function DisputeRow({ d, busy, onResolve }: { d: Dispute; busy: boolean; onResolve: (d: Dispute, status: string, note: string, refund?: number) => void }) {
  const [note, setNote] = useState(d.resolution_note ?? "");
  const [refund, setRefund] = useState(d.refund_amount_aed?.toString() ?? "");
  const isOpen = d.status === "open" || d.status === "reviewing";
  const totalAed = Number(d.bookings?.total_aed ?? 0);

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="rounded-full capitalize bg-cream text-pitch-black">{d.reason.replace(/_/g, " ")}</Badge>
            <Badge className={`rounded-full capitalize ${
              d.status === "open" ? "bg-salmon-soft text-salmon-deep" :
              d.status.startsWith("resolved") ? "bg-success-green/15 text-success-green" :
              d.status === "dismissed" ? "bg-slate-100 text-slate-700" : "bg-yellow-100 text-yellow-900"
            }`}>{d.status.replace(/_/g, " ")}</Badge>
          </div>
          <div className="mt-2 text-sm text-pitch-black">
            <strong>{d.parent?.full_name ?? "Parent"}</strong> vs <strong>{d.sitter?.full_name ?? "Sitter"}</strong>
          </div>
          {d.bookings && (
            <div className="text-xs text-slate-grey">
              {format(new Date(d.bookings.start_at), "EEE do MMM, h:mma")} · {d.bookings.hours}h · {formatCurrency(totalAed)}
            </div>
          )}
          <div className="mt-1 text-[11px] text-slate-grey">Filed {format(new Date(d.created_at), "do MMM, h:mma")}</div>
        </div>
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to={`/bookings/${d.booking_id}`}>Open booking <ExternalLink className="ml-1 h-3 w-3" /></Link>
        </Button>
      </div>

      <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-cream p-3 text-sm text-pitch-black">{d.description}</p>

      {isOpen ? (
        <div className="mt-4 space-y-3">
          <Textarea value={note} onChange={e => setNote(e.target.value)} rows={2} placeholder="Resolution note shown to parent + sitter…" maxLength={1000} />
          <div className="flex flex-wrap items-center gap-2">
            <Input
              type="number" min={0} max={totalAed} step="0.01"
              value={refund} onChange={e => setRefund(e.target.value)}
              placeholder="Refund AED (optional)"
              className="w-44"
            />
            <Button disabled={busy} onClick={() => onResolve(d, "resolved_refund", note, totalAed)}
              className="rounded-full bg-success-green text-primary-foreground hover:bg-success-green/90">Refund full</Button>
            <Button disabled={busy || !refund} onClick={() => onResolve(d, "resolved_partial", note, Number(refund))}
              className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">Partial refund</Button>
            <Button disabled={busy} variant="outline" onClick={() => onResolve(d, "dismissed", note)} className="rounded-full">Dismiss</Button>
            {d.status === "open" && (
              <Button disabled={busy} variant="ghost" onClick={() => onResolve(d, "reviewing", note)}>Mark reviewing</Button>
            )}
          </div>
          <p className="text-[11px] text-slate-grey">
            Note: refund amounts are recorded for reporting. Trigger the actual Stripe refund via the booking's refund flow when needed.
          </p>
        </div>
      ) : d.resolution_note && (
        <p className="mt-3 rounded-2xl border border-border p-3 text-xs text-slate-grey">
          <span className="font-semibold text-pitch-black">Resolution: </span>{d.resolution_note}
          {d.refund_amount_aed != null && <span> · refunded {formatCurrency(Number(d.refund_amount_aed))}</span>}
        </p>
      )}
    </div>
  );
}
