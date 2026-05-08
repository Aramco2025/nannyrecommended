import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Database, Download, Trash2, Bell, Mail, MessageSquare, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type Prefs = {
  email_marketing: boolean;
  sms_enabled: boolean;
  push_enabled: boolean;
  share_with_friends: boolean;
};

const DEFAULT_PREFS: Prefs = {
  email_marketing: true,
  sms_enabled: true,
  push_enabled: true,
  share_with_friends: true,
};

const DATA_TYPES = [
  { icon: Database, label: "Profile", desc: "Name, email, phone, avatar." },
  { icon: MessageSquare, label: "Messages", desc: "Chats with sitters and parents." },
  { icon: Bell, label: "Bookings & reviews", desc: "Past sits, ratings, notes." },
  { icon: Mail, label: "Payment references", desc: "Receipts and refund history (no card numbers)." },
  { icon: Users, label: "Connections", desc: "Friends, favourites, saved searches." },
];

export default function Privacy() {
  const { user, loading } = useAuth();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [lastExport, setLastExport] = useState<string | null>(null);
  const [busyExport, setBusyExport] = useState(false);
  const [savingKey, setSavingKey] = useState<keyof Prefs | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: np }, { data: prof }] = await Promise.all([
        supabase.from("notification_prefs" as any).select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("profiles").select("data_export_requested_at").eq("id", user.id).maybeSingle(),
      ]);
      if (np) {
        setPrefs((p) => ({
          ...p,
          push_enabled: (np as any).push_enabled ?? p.push_enabled,
          sms_enabled: (np as any).sms_enabled ?? p.sms_enabled,
          email_marketing: (np as any).email_marketing ?? p.email_marketing,
        }));
      }
      if ((prof as any)?.data_export_requested_at) {
        setLastExport((prof as any).data_export_requested_at);
      }
    })();
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const togglePref = async (key: keyof Prefs, value: boolean) => {
    setSavingKey(key);
    setPrefs((p) => ({ ...p, [key]: value }));
    try {
      // Best-effort: store on notification_prefs if present; ignore unknown columns.
      await supabase
        .from("notification_prefs" as any)
        .upsert({ user_id: user.id, [key]: value } as any, { onConflict: "user_id" });
      toast({ title: "Preference saved" });
    } catch (e) {
      toast({ title: "Could not save", description: (e as Error).message, variant: "destructive" });
    } finally {
      setSavingKey(null);
    }
  };

  const requestExport = async () => {
    setBusyExport(true);
    try {
      const { error } = await supabase.functions.invoke("export-user-data");
      if (error) throw error;
      const ts = new Date().toISOString();
      setLastExport(ts);
      toast({
        title: "Export requested",
        description: `We'll email ${user.email} within 24 hours with a download link.`,
      });
    } catch (e) {
      toast({ title: "Could not queue export", description: (e as Error).message, variant: "destructive" });
    } finally {
      setBusyExport(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl space-y-6 py-10">
        <header>
          <h1 className="font-display text-3xl font-bold text-pitch-black">Privacy & data</h1>
          <p className="mt-1 text-sm text-slate-grey">Manage what we hold and how we contact you.</p>
        </header>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-pitch-black">Data we hold</h2>
          <ul className="mt-4 space-y-3">
            {DATA_TYPES.map(({ icon: Icon, label, desc }) => (
              <li key={label} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-salmon-soft text-salmon-deep">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-pitch-black">{label}</div>
                  <div className="text-xs text-slate-grey">{desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-salmon-soft text-salmon-deep">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold text-pitch-black">Download my data</h2>
              <p className="mt-1 text-sm text-slate-grey">
                We'll email a ZIP of your account data to <strong>{user.email}</strong> within 24 hours.
              </p>
              {lastExport && (
                <p className="mt-1 text-xs text-slate-grey">
                  Last requested: {new Date(lastExport).toLocaleString()}
                </p>
              )}
              <Button onClick={requestExport} disabled={busyExport} className="mt-4 bg-salmon text-primary-foreground shadow-cta hover:bg-salmon-deep">
                {busyExport ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request export"}
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-card">
          <h2 className="font-display text-lg font-bold text-pitch-black">Permissions & revocations</h2>
          <div className="mt-4 space-y-4">
            {([
              ["email_marketing", "Marketing emails", "Tips, offers, and product updates."],
              ["sms_enabled", "SMS notifications", "Booking confirmations and reminders."],
              ["push_enabled", "Push notifications", "Real-time alerts on your device."],
              ["share_with_friends", "Visible to your friends", "Friends can see sitters you've favourited."],
            ] as const).map(([key, label, desc]) => (
              <div key={key} className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-pitch-black">{label}</div>
                  <div className="text-xs text-slate-grey">{desc}</div>
                </div>
                <Switch
                  checked={prefs[key]}
                  disabled={savingKey === key}
                  onCheckedChange={(v) => togglePref(key, v)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-destructive/20 bg-card p-6 shadow-card">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-destructive/10 text-destructive">
              <Trash2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-bold text-pitch-black">Delete my account</h2>
              <p className="mt-1 text-sm text-slate-grey">
                Permanently remove your profile and personal data.
              </p>
              <Button asChild variant="outline" className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/5">
                <Link to="/account/delete">Start deletion</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
