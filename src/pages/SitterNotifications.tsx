import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TYPES = [
  { key: "one_off", label: "One-off" },
  { key: "repeat", label: "Repeat" },
  { key: "permanent", label: "Permanent" },
] as const;

const SitterNotifications = () => {
  const { user, loading } = useAuth();
  const [prefs, setPrefs] = useState<Record<string, { radius_km: number; muted: boolean }>>({
    one_off: { radius_km: 5, muted: false },
    repeat: { radius_km: 10, muted: false },
    permanent: { radius_km: 20, muted: true },
  });
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("sitter_notification_prefs").select("*").eq("sitter_user_id", user.id)
      .then(({ data }) => {
        if (!data) return;
        const next = { ...prefs };
        data.forEach((p: any) => { next[p.job_type] = { radius_km: p.radius_km, muted: p.muted }; });
        setPrefs(next);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const save = async () => {
    setBusy(true);
    try {
      const rows = TYPES.map(t => ({
        sitter_user_id: user.id,
        job_type: t.key,
        radius_km: prefs[t.key].radius_km,
        muted: prefs[t.key].muted,
      }));
      const { error } = await supabase.from("sitter_notification_prefs")
        .upsert(rows, { onConflict: "sitter_user_id,job_type" });
      if (error) throw error;
      toast({ title: "Saved" });
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-xl py-8">
        <h1 className="font-display text-3xl font-bold text-pitch-black">Notification settings</h1>
        <p className="mt-2 text-sm text-slate-grey">Set how far you'll travel and which jobs you want to hear about.</p>

        <div className="mt-6 space-y-5 rounded-3xl bg-pure-white p-6 shadow-card">
          {TYPES.map(t => (
            <div key={t.key} className="border-b border-cream-deep pb-5 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-pitch-black">{t.label}</div>
                  <div className="text-xs text-slate-grey">0–{prefs[t.key].radius_km} km</div>
                </div>
                <Switch checked={!prefs[t.key].muted}
                  onCheckedChange={v => setPrefs(p => ({ ...p, [t.key]: { ...p[t.key], muted: !v } }))} />
              </div>
              <Slider
                className="mt-4"
                value={[prefs[t.key].radius_km]} min={1} max={50} step={1}
                disabled={prefs[t.key].muted}
                onValueChange={v => setPrefs(p => ({ ...p, [t.key]: { ...p[t.key], radius_km: v[0] } }))}
              />
            </div>
          ))}
        </div>

        <Button onClick={save} disabled={busy} size="lg" className="mt-6 w-full rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
          {busy ? "Saving…" : "Save"}
        </Button>
      </main>
      <Footer />
    </div>
  );
};

export default SitterNotifications;
