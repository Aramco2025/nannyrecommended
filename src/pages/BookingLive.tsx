import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, MapPin, MessageSquare, Phone, ShieldAlert, Plus, Square, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type B = {
  id: string; parent_id: string; sitter_id: string;
  start_at: string; end_at: string; status: string;
  address: string | null; started_at: string | null; ended_at: string | null;
  sitters?: { full_name: string | null; user_id: string | null } | null;
  profiles?: { full_name: string | null; phone: string | null } | null;
};

function fmtElapsed(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function BookingLive() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [b, setB] = useState<B | null>(null);
  const [now, setNow] = useState(Date.now());
  const [extOpen, setExtOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [worried, setWorried] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("bookings")
      .select("id, parent_id, sitter_id, start_at, end_at, status, address, started_at, ended_at, sitters:sitter_id(full_name, user_id), profiles:parent_id(full_name, phone)")
      .eq("id", id).maybeSingle().then(({ data }) => setB(data as any));
  }, [id]);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;
  if (!b) return <div className="min-h-screen bg-background"><Header /><main className="container py-12 text-center text-sm text-slate-grey">Loading…</main></div>;

  const isParent = b.parent_id === user.id;
  const isSitter = b.sitters?.user_id === user.id;
  if (!isParent && !isSitter) return <Navigate to="/account" replace />;

  const startedAt = b.started_at ? new Date(b.started_at).getTime() : new Date(b.start_at).getTime();
  const elapsedMs = now - startedAt;
  const counterpart = isParent ? (b.sitters?.full_name ?? "Sitter") : (b.profiles?.full_name ?? "Parent");

  const extend = async (mins: number) => {
    setBusy(true);
    const newEnd = new Date(new Date(b.end_at).getTime() + mins * 60_000).toISOString();
    const { error } = await supabase.from("bookings").update({ end_at: newEnd }).eq("id", b.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    setB({ ...b, end_at: newEnd });
    setExtOpen(false);
    toast.success(`Extended by ${mins} minutes`);
  };

  const endSit = async () => {
    setBusy(true);
    const { error } = await supabase.from("bookings")
      .update({ status: "in_progress", ended_at: new Date().toISOString() })
      .eq("id", b.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    setEndOpen(false);
    toast.success("Sit ended — head back to the booking to confirm completion.");
    navigate(`/bookings/${b.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-8">
        <Link to={`/bookings/${b.id}`} className="inline-flex items-center gap-2 text-sm text-slate-grey hover:text-pitch-black">
          <ArrowLeft className="h-4 w-4" /> Back to booking
        </Link>

        <section className="mt-4 rounded-3xl bg-gradient-to-br from-salmon-soft via-cream to-pure-white p-8 text-center shadow-card">
          <div className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Sit in progress</div>
          <h1 className="mt-2 font-display text-2xl font-bold text-pitch-black">With {counterpart}</h1>
          <div className="mt-6 font-mono text-5xl font-bold tabular-nums text-pitch-black">
            {fmtElapsed(elapsedMs)}
          </div>
          <div className="mt-2 text-xs text-slate-grey">
            Scheduled until {format(new Date(b.end_at), "h:mma")}
          </div>
        </section>

        {b.address && (
          <section className="mt-4 rounded-3xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-salmon-soft text-salmon-deep">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-grey">Address</div>
                <div className="mt-1 text-sm text-pitch-black">{b.address}</div>
              </div>
              <Button asChild size="sm" variant="outline">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(b.address)}`} target="_blank" rel="noreferrer">Open map</a>
              </Button>
            </div>
          </section>
        )}

        <section className="mt-4 grid gap-3 sm:grid-cols-2">
          <Button asChild variant="outline" className="h-12 justify-start gap-2">
            <Link to={`/messages/${b.id}`}><MessageSquare className="h-4 w-4" /> Message {counterpart}</Link>
          </Button>
          {b.profiles?.phone && isSitter ? (
            <Button asChild variant="outline" className="h-12 justify-start gap-2">
              <a href={`tel:${b.profiles.phone}`}><Phone className="h-4 w-4" /> Call parent</a>
            </Button>
          ) : (
            <Button asChild variant="outline" className="h-12 justify-start gap-2" disabled>
              <span><Phone className="h-4 w-4" /> Call (in chat)</span>
            </Button>
          )}
          <Button variant="outline" className="h-12 justify-start gap-2" onClick={() => setExtOpen(true)}>
            <Plus className="h-4 w-4" /> Extend the sit
          </Button>
          <Button variant="outline" className="h-12 justify-start gap-2 border-destructive/40 text-destructive hover:bg-destructive/5" onClick={() => setWorried(true)}>
            <ShieldAlert className="h-4 w-4" /> I'm worried
          </Button>
        </section>

        {isSitter && (
          <Button onClick={() => setEndOpen(true)} size="lg" className="mt-6 w-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
            <Square className="h-4 w-4" /> End sit
          </Button>
        )}

        <AlertDialog open={extOpen} onOpenChange={setExtOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Extend the sit?</AlertDialogTitle>
              <AlertDialogDescription>
                Extra time is billed at the same hourly rate. Pick how much longer you need.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-3 gap-2">
              {[30, 60, 120].map((m) => (
                <Button key={m} variant="outline" disabled={busy} onClick={() => extend(m)}>
                  +{m < 60 ? `${m}m` : `${m / 60}h`}
                </Button>
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={endOpen} onOpenChange={setEndOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>End the sit now?</AlertDialogTitle>
              <AlertDialogDescription>
                The parent will confirm completion to release payment. You can still send messages after.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={busy}>Stay on</AlertDialogCancel>
              <AlertDialogAction onClick={(e) => { e.preventDefault(); endSit(); }} disabled={busy}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "End sit"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={worried} onOpenChange={setWorried}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                <ShieldAlert className="h-5 w-5" /> Are you safe right now?
              </AlertDialogTitle>
              <AlertDialogDescription>
                If this is an emergency, call <strong>999</strong> (Police / Ambulance) or <strong>998</strong> (Ambulance UAE) immediately.
                Otherwise, file a report and our trust team will respond within minutes.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <AlertDialogCancel>Close</AlertDialogCancel>
              <Button asChild variant="outline">
                <a href="tel:999">Call 999</a>
              </Button>
              <AlertDialogAction onClick={(e) => { e.preventDefault(); setWorried(false); navigate(`/bookings/${b.id}/dispute`); }}>
                Report a problem
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
}
