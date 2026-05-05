import { useEffect, useRef, useState } from "react";
import { Navigate, useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useThreadMessages, sendMessage } from "@/hooks/useMessages";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, MapPin, Send, CheckCircle2, Play, Square } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/fees";
import { BookingTimer } from "@/components/booking/BookingTimer";
import { ReviewForm } from "@/components/booking/ReviewForm";

type Booking = {
  id: string;
  parent_id: string;
  sitter_id: string;
  start_at: string;
  end_at: string;
  hours: number;
  status: string;
  total_aed: number;
  sitter_payout_aed: number;
  address: string | null;
  notes: string | null;
  started_at: string | null;
  ended_at: string | null;
  released_at: string | null;
  sitters?: { full_name: string | null; photos: string[] | null; user_id: string | null } | null;
  profiles?: { full_name: string | null; phone: string | null } | null;
};

const statusVariant: Record<string, string> = {
  pending_payment: "bg-cream text-slate-grey",
  pending: "bg-yellow-100 text-yellow-900",
  confirmed: "bg-blue-100 text-blue-900",
  in_progress: "bg-success-green/15 text-success-green",
  completed: "bg-success-green/15 text-success-green",
  cancelled: "bg-red-100 text-red-900",
  declined: "bg-red-100 text-red-900",
};

export default function BookingDetail() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const [b, setB] = useState<Booking | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [hasReview, setHasReview] = useState<boolean | null>(null);
  const { messages } = useThreadMessages(id);
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const reload = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("bookings")
      .select("*, sitters:sitter_id(full_name, photos, user_id), profiles:parent_id(full_name, phone)")
      .eq("id", id)
      .maybeSingle();
    setB((data ?? null) as any);
  };

  useEffect(() => { reload(); /* eslint-disable-line */ }, [id]);

  useEffect(() => {
    if (!id || !user) return;
    supabase.from("reviews").select("id").eq("booking_id", id).maybeSingle()
      .then(({ data }) => setHasReview(!!data));
  }, [id, user, b?.status]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;
  if (!b) return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container py-12 text-center text-sm text-slate-grey">Loading booking…</main>
    </div>
  );

  const isParent = b.parent_id === user.id;
  const isSitter = b.sitters?.user_id === user.id;
  if (!isParent && !isSitter) return <Navigate to="/account" replace />;

  const setStatus = async (status: string, extra: Record<string, any> = {}) => {
    setBusy(status);
    const { error } = await supabase.from("bookings").update({ status, ...extra } as any).eq("id", b.id);
    setBusy(null);
    if (error) return toast.error(error.message);
    await reload();
    toast.success(`Booking ${status.replace("_", " ")}`);
  };

  const releaseEscrow = async () => {
    setBusy("release");
    const { error } = await supabase.rpc("release_booking_escrow", { _booking: b.id });
    setBusy(null);
    if (error) return toast.error(error.message);
    await reload();
    toast.success("Payment released to sitter wallet");
  };

  const send = async () => {
    if (!text.trim()) return;
    try { await sendMessage(b.id, text.trim()); setText(""); }
    catch (e: any) { toast.error(e.message); }
  };

  const counterpartName = isParent
    ? (b.sitters?.full_name ?? "Sitter")
    : (b.profiles?.full_name ?? "Parent");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-3xl py-8">
        <Link to={isSitter ? "/sitter/dashboard" : "/account"} className="inline-flex items-center gap-2 text-sm text-slate-grey hover:text-pitch-black">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="mt-4 rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-slate-grey">Booking</div>
              <h1 className="mt-1 font-display text-2xl font-bold text-pitch-black">{counterpartName}</h1>
              <div className="mt-1 text-sm text-slate-grey">
                {format(new Date(b.start_at), "EEE do MMM, h:mma")} – {format(new Date(b.end_at), "h:mma")} · {b.hours}h
              </div>
            </div>
            <Badge className={`rounded-full capitalize ${statusVariant[b.status] ?? "bg-cream"}`}>
              {b.status.replace("_", " ")}
            </Badge>
          </div>

          {b.address && (
            <div className="mt-4 inline-flex items-center gap-2 text-sm text-slate-grey">
              <MapPin className="h-4 w-4" /> {b.address}
            </div>
          )}
          {b.notes && (
            <p className="mt-3 rounded-2xl bg-cream p-3 text-sm text-pitch-black">{b.notes}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <div><span className="text-slate-grey">Total: </span><span className="font-medium text-pitch-black">{formatCurrency(Number(b.total_aed))}</span></div>
            {isSitter && <div><span className="text-slate-grey">Your payout: </span><span className="font-medium text-pitch-black">{formatCurrency(Number(b.sitter_payout_aed))}</span></div>}
          </div>

          {(b.status === "confirmed" || b.status === "in_progress" || b.status === "completed") && (
            <div className="mt-5">
              <BookingTimer startedAt={b.started_at} endedAt={b.ended_at} />
            </div>
          )}

          {/* Sitter actions */}
          {isSitter && (
            <div className="mt-5 flex flex-wrap gap-2">
              {b.status === "pending" && (
                <>
                  <Button disabled={busy !== null} onClick={() => setStatus("confirmed")} className="bg-salmon hover:bg-salmon-deep text-primary-foreground">Accept booking</Button>
                  <Button disabled={busy !== null} variant="outline" onClick={() => {
                    if (!confirm("Decline this booking? The parent will be refunded manually.")) return;
                    setStatus("cancelled");
                  }}>Decline</Button>
                </>
              )}
              {b.status === "confirmed" && (
                <Button disabled={busy !== null} onClick={() => setStatus("in_progress", { started_at: new Date().toISOString() })}
                  className="bg-success-green hover:bg-success-green/90 text-primary-foreground">
                  <Play className="h-4 w-4" /> Start sit
                </Button>
              )}
              {b.status === "in_progress" && (
                <Button disabled={busy !== null} onClick={() => setStatus("in_progress", { ended_at: new Date().toISOString() })}
                  variant="outline">
                  <Square className="h-4 w-4" /> End sit
                </Button>
              )}
            </div>
          )}

          {/* Parent actions */}
          {isParent && (
            <div className="mt-5 flex flex-wrap gap-2">
              {(b.status === "confirmed" || b.status === "in_progress") && !b.released_at && (
                <Button disabled={busy !== null} onClick={releaseEscrow}
                  className="bg-success-green hover:bg-success-green/90 text-primary-foreground">
                  <CheckCircle2 className="h-4 w-4" /> Confirm completion · release payment
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Review (parent, after completion) */}
        {isParent && b.status === "completed" && hasReview === false && (
          <div className="mt-6">
            <ReviewForm
              bookingId={b.id}
              parentId={b.parent_id}
              sitterId={b.sitter_id}
              onSubmitted={() => setHasReview(true)}
            />
          </div>
        )}

        {/* Chat */}
        <div className="mt-6 rounded-3xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-3 text-sm font-semibold text-pitch-black">Messages</div>
          <div className="max-h-96 space-y-2 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-grey">No messages yet — say hi 👋</div>
            )}
            {messages.map((m: any) => {
              const mine = m.sender_id === user.id;
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    mine ? "bg-salmon-soft text-pitch-black" : "bg-cream text-pitch-black"
                  }`}>
                    {m.body}
                  </div>
                </div>
              );
            })}
            <div ref={endRef} />
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Write a message" maxLength={2000} />
            <Button onClick={send} disabled={!text.trim()} size="icon" className="bg-salmon hover:bg-salmon-deep">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
