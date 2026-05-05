import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TierBadge } from "@/components/pricing/TierBadge";
import {
  ABSOLUTE_MAX_HOURLY,
  ABSOLUTE_MIN_HOURLY,
  BABYSITTING_PREMIUM_MULTIPLIER,
  FULL_TIME_HOURS_PER_MONTH_LIVE_IN,
  FULL_TIME_HOURS_PER_MONTH_LIVE_OUT,
  getRateGuidance,
  hourlyFromMonthly,
  monthlyFromHourly,
  tierFromHourlyRate,
} from "@/lib/pricing/tiers";
import { toast } from "@/hooks/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";

type Mode = "babysitting" | "fulltime" | "both";

export default function SitterSetRate() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [sitterId, setSitterId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("babysitting");
  const [hourly, setHourly] = useState<number>(60);
  const [monthly, setMonthly] = useState<number>(4000);
  const [openLiveIn, setOpenLiveIn] = useState(false);
  const [surcharges, setSurcharges] = useState({
    evening: 0, lateNight: 0, weekend: 0, holiday: 0, multiChild: 0, lastMinute: 0,
  });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("sitters").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setSitterId(data.id);
        setHourly(Number(data.hourly_rate_aed) || 60);
        setMonthly(Number(data.monthly_full_time_aed) || 4000);
        const ft = !!data.open_to_full_time;
        const bs = data.open_to_babysitting !== false;
        setMode(ft && bs ? "both" : ft ? "fulltime" : "babysitting");
      }
    })();
  }, [user]);

  const guidance = useMemo(() => getRateGuidance(hourly), [hourly]);
  const monthlyEquiv = useMemo(() => monthlyFromHourly(hourly, 80), [hourly]);
  const hourlyFromFt = useMemo(() => hourlyFromMonthly(monthly, FULL_TIME_HOURS_PER_MONTH_LIVE_OUT), [monthly]);
  const hourlyFromFtLiveIn = useMemo(() => hourlyFromMonthly(monthly, FULL_TIME_HOURS_PER_MONTH_LIVE_IN), [monthly]);

  // Smart-link both: bump hourly to 2x ft equivalent if user just enabled "both"
  useEffect(() => {
    if (mode === "both") {
      setHourly((h) => (h <= 0 ? Math.round(hourlyFromFt * BABYSITTING_PREMIUM_MULTIPLIER) : h));
    }
  }, [mode, hourlyFromFt]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const save = async () => {
    if (hourly < ABSOLUTE_MIN_HOURLY || hourly > ABSOLUTE_MAX_HOURLY) {
      return toast({ title: "Rate out of range", description: `Set between AED ${ABSOLUTE_MIN_HOURLY} and AED ${ABSOLUTE_MAX_HOURLY}/hr.`, variant: "destructive" });
    }
    setBusy(true);
    try {
      const open_to_babysitting = mode === "babysitting" || mode === "both";
      const open_to_full_time = mode === "fulltime" || mode === "both";
      const payload: any = {
        hourly_rate_aed: hourly,
        monthly_full_time_aed: open_to_full_time ? monthly : null,
        open_to_babysitting,
        open_to_full_time,
      };
      if (sitterId) {
        const { error } = await supabase.from("sitters").update(payload).eq("id", sitterId);
        if (error) throw error;
      } else {
        const profileData = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
        const { error } = await supabase.from("sitters").insert({
          user_id: user.id,
          full_name: profileData.data?.full_name ?? user.email?.split("@")[0] ?? "Sitter",
          ...payload,
        });
        if (error) throw error;
      }
      toast({ title: "Rate saved" });
      navigate("/sitter/dashboard");
    } catch (e: any) {
      toast({ title: "Could not save", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const ModeBtn = ({ id, label }: { id: Mode; label: string }) => (
    <button
      onClick={() => setMode(id)}
      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition ${mode === id ? "bg-pitch-black text-pure-white shadow-cta" : "bg-off-white text-slate-grey hover:text-pitch-black"}`}
    >{label}</button>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-10">
        <h1 className="text-3xl font-semibold text-pitch-black">Set your rate</h1>
        <p className="mt-2 text-sm text-slate-grey">This is what parents will see. You can change it anytime.</p>

        <div className="mt-6 flex gap-2 rounded-xl border border-border bg-card p-1 shadow-card">
          <ModeBtn id="babysitting" label="I want babysitting work" />
          <ModeBtn id="fulltime" label="I want full-time too" />
          <ModeBtn id="both" label="Both" />
        </div>

        {(mode === "babysitting" || mode === "both") && (
          <section className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-card">
            <Label className="text-xs uppercase tracking-wide text-slate-grey">Babysitting rate</Label>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-pitch-black">AED</span>
              <Input
                type="number"
                inputMode="numeric"
                min={ABSOLUTE_MIN_HOURLY}
                max={ABSOLUTE_MAX_HOURLY}
                value={hourly}
                onChange={(e) => setHourly(Math.max(0, Number(e.target.value) || 0))}
                className="w-28 text-2xl font-semibold"
              />
              <span className="text-sm text-slate-grey">/ hour</span>
            </div>
            <div className="mt-2 text-sm text-slate-grey">≈ AED {monthlyEquiv.toLocaleString()} per month at 80 hours</div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TierBadge tier={tierFromHourlyRate(Math.max(ABSOLUTE_MIN_HOURLY, hourly))} />
              <span className="text-xs text-slate-grey">— what parents will see</span>
            </div>
            {guidance.warning && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-warning-amber/10 p-3 text-xs text-pitch-black">
                <AlertTriangle className="h-4 w-4 shrink-0 text-warning-amber" />
                <span>{guidance.warning}</span>
              </div>
            )}
            {guidance.message && (
              <p className="mt-3 text-xs leading-relaxed text-slate-grey">{guidance.message}</p>
            )}
          </section>
        )}

        {(mode === "fulltime" || mode === "both") && (
          <section className="mt-4 rounded-2xl border border-border bg-card p-6 shadow-card">
            <Label className="text-xs uppercase tracking-wide text-slate-grey">Full-time rate</Label>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-pitch-black">AED</span>
              <Input
                type="number"
                inputMode="numeric"
                min={1500}
                max={15000}
                value={monthly}
                onChange={(e) => setMonthly(Math.max(0, Number(e.target.value) || 0))}
                className="w-32 text-2xl font-semibold"
              />
              <span className="text-sm text-slate-grey">/ month</span>
            </div>
            <div className="mt-2 text-sm text-slate-grey">
              ≈ AED {hourlyFromFt}/hr equivalent (live-out)
              {openLiveIn && <> · AED {hourlyFromFtLiveIn}/hr (live-in)</>}
            </div>
            <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-grey">
              <input type="checkbox" checked={openLiveIn} onChange={(e) => setOpenLiveIn(e.target.checked)} /> Also open to live-in arrangements
            </label>
            {mode === "both" && (
              <p className="mt-3 rounded-lg bg-off-white p-3 text-xs leading-relaxed text-slate-grey">
                Many sitters offer babysitting at one rate and full-time at another. Babysitting typically pays 1.8–2.5× the full-time hourly equivalent because it's less consistent work.
              </p>
            )}
          </section>
        )}

        <Button onClick={save} disabled={busy} className="mt-6 w-full bg-salmon hover:bg-salmon-deep text-primary-foreground">
          {busy ? "Saving…" : "Save rate"}
        </Button>
      </main>
      <Footer />
    </div>
  );
}
