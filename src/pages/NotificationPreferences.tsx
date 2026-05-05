import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BellOff, Mail, Smartphone, MessageSquare, Megaphone, Moon, PauseCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Prefs = {
  email_enabled: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  marketing_enabled: boolean;
  quiet_hours_start: number | null;
  quiet_hours_end: number | null;
  paused_until: string | null;
};

const DEFAULTS: Prefs = {
  email_enabled: true,
  sms_enabled: true,
  push_enabled: true,
  marketing_enabled: true,
  quiet_hours_start: null,
  quiet_hours_end: null,
  paused_until: null,
};

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function NotificationPreferences() {
  const { user, loading } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("notification_prefs").select("*").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => {
        if (data) setPrefs({ ...DEFAULTS, ...data });
        setLoaded(true);
      });
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const save = async (next: Partial<Prefs>) => {
    const merged = { ...prefs, ...next };
    setPrefs(merged);
    setBusy(true);
    const { error } = await supabase.from("notification_prefs")
      .upsert({ user_id: user.id, ...merged }, { onConflict: "user_id" });
    setBusy(false);
    if (error) toast({ title: "Couldn't save", description: error.message, variant: "destructive" });
  };

  const pauseFor = (hours: number | null) => {
    save({ paused_until: hours == null ? null : new Date(Date.now() + hours * 3600_000).toISOString() });
    toast({ title: hours == null ? "Notifications resumed" : `Paused for ${hours}h` });
  };

  const isPaused = prefs.paused_until && new Date(prefs.paused_until) > new Date();

  const Row = ({ icon: Icon, title, desc, k }: any) => (
    <div className="flex items-start justify-between gap-4 border-b border-cream-deep py-4 last:border-0">
      <div className="flex gap-3">
        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-salmon-soft text-salmon-deep">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <div className="font-semibold text-pitch-black">{title}</div>
          <div className="text-xs text-slate-grey">{desc}</div>
        </div>
      </div>
      <Switch checked={(prefs as any)[k]} onCheckedChange={v => save({ [k]: v } as any)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-2xl py-10">
        <div className="mb-6">
          <Link to="/account" className="text-xs text-slate-grey hover:text-pitch-black">← Back to account</Link>
          <h1 className="mt-2 font-display text-3xl font-bold text-pitch-black">Notifications</h1>
          <p className="mt-1 text-sm text-slate-grey">Choose how we reach you. We never sell your contact details.</p>
        </div>

        {!loaded ? (
          <div className="grid place-items-center py-16"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : (
          <>
            <section className="rounded-3xl bg-pure-white p-6 shadow-card">
              <h2 className="font-display text-lg font-bold text-pitch-black">Channels</h2>
              <Row icon={Mail} title="Email" desc="Booking confirmations, receipts, account alerts" k="email_enabled" />
              <Row icon={MessageSquare} title="SMS" desc="Time-sensitive booking updates. Reply STOP anytime." k="sms_enabled" />
              <Row icon={Smartphone} title="Push" desc="In-app alerts on your device" k="push_enabled" />
              <Row icon={Megaphone} title="Tips & promotions" desc="Occasional product updates. Off doesn't affect bookings." k="marketing_enabled" />
            </section>

            <section className="mt-6 rounded-3xl bg-pure-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-salmon-soft text-salmon-deep"><Moon className="h-4 w-4" /></div>
                <div>
                  <h2 className="font-display text-lg font-bold text-pitch-black">Quiet hours</h2>
                  <p className="text-xs text-slate-grey">Non-urgent SMS and push are silenced during this window.</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs">From</Label>
                  <Select
                    value={prefs.quiet_hours_start?.toString() ?? "none"}
                    onValueChange={v => save({ quiet_hours_start: v === "none" ? null : Number(v) })}
                  >
                    <SelectTrigger><SelectValue placeholder="Off" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Off</SelectItem>
                      {HOURS.map(h => <SelectItem key={h} value={h.toString()}>{h.toString().padStart(2, "0")}:00</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">To</Label>
                  <Select
                    value={prefs.quiet_hours_end?.toString() ?? "none"}
                    onValueChange={v => save({ quiet_hours_end: v === "none" ? null : Number(v) })}
                  >
                    <SelectTrigger><SelectValue placeholder="Off" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Off</SelectItem>
                      {HOURS.map(h => <SelectItem key={h} value={h.toString()}>{h.toString().padStart(2, "0")}:00</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <section className="mt-6 rounded-3xl bg-pure-white p-6 shadow-card">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-salmon-soft text-salmon-deep"><PauseCircle className="h-4 w-4" /></div>
                <div>
                  <h2 className="font-display text-lg font-bold text-pitch-black">Pause everything</h2>
                  <p className="text-xs text-slate-grey">
                    {isPaused
                      ? `Paused until ${new Date(prefs.paused_until!).toLocaleString()}`
                      : "Stop all non-critical notifications temporarily."}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {[24, 72, 168].map(h => (
                  <Button key={h} variant="outline" size="sm" onClick={() => pauseFor(h)}>
                    Pause {h === 168 ? "1 week" : `${h}h`}
                  </Button>
                ))}
                {isPaused && (
                  <Button size="sm" className="bg-pitch-black text-pure-white hover:bg-pitch-black/90" onClick={() => pauseFor(null)}>
                    Resume now
                  </Button>
                )}
              </div>
            </section>

            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cream-deep bg-cream p-4 text-xs text-slate-grey">
              <BellOff className="mt-0.5 h-4 w-4 shrink-0" />
              <p>You'll always receive critical safety and booking-status messages even when channels are off — these are required for the service to work. Reply <span className="font-mono font-semibold">STOP</span> to any SMS to opt out of that channel instantly.</p>
            </div>

            {busy && <p className="mt-4 text-center text-xs text-slate-grey">Saving…</p>}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
