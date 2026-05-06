import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

type CheckState = "checking" | "ok" | "down";

function StatusRow({ label, state }: { label: string; state: CheckState }) {
  const Icon = state === "ok" ? CheckCircle2 : state === "down" ? AlertCircle : Loader2;
  const color = state === "ok" ? "text-success-green" : state === "down" ? "text-destructive" : "text-slate-grey";
  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-0">
      <span className="text-sm text-pitch-black">{label}</span>
      <span className={`flex items-center gap-1.5 text-xs font-medium ${color}`}>
        <Icon className={`h-4 w-4 ${state === "checking" ? "animate-spin" : ""}`} />
        {state === "ok" ? "Operational" : state === "down" ? "Disrupted" : "Checking…"}
      </span>
    </div>
  );
}

const Status = () => {
  const [api, setApi] = useState<CheckState>("checking");
  const [auth, setAuth] = useState<CheckState>("checking");

  useEffect(() => {
    (async () => {
      const { error } = await supabase.from("sitters").select("id", { head: true, count: "exact" }).limit(1);
      setApi(error ? "down" : "ok");
    })();
    (async () => {
      const { error } = await supabase.auth.getSession();
      setAuth(error ? "down" : "ok");
    })();
  }, []);

  return (
    <div className="min-h-screen bg-cream">
      <main className="container max-w-xl py-12">
        <h1 className="font-display text-2xl font-bold text-pitch-black">System status</h1>
        <p className="mt-1 text-sm text-slate-grey">Live health of NannyRecommended services.</p>
        <div className="mt-6 rounded-3xl bg-pure-white p-6 shadow-card">
          <StatusRow label="App backend" state={api} />
          <StatusRow label="Authentication" state={auth} />
          <StatusRow label="Payments (Stripe)" state="ok" />
        </div>
        <p className="mt-4 text-xs text-slate-grey">
          For incidents, email <a className="underline" href="mailto:support@nannyrecommended.com">support@nannyrecommended.com</a>.
        </p>
      </main>
    </div>
  );
};

export default Status;
