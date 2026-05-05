import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { FamilyPlusUpgradeDialog } from "./FamilyPlusUpgradeDialog";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function FamilyPlusCard() {
  const { subscription, isFamilyPlus, loading } = useSubscription();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();

  const openPortal = async () => {
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {
        body: { return_url: window.location.href, environment: getStripeEnvironment() },
      });
      if (error || !data?.url) throw new Error(error?.message || "Could not open portal");
      window.open(data.url, "_blank");
    } catch (e) {
      toast({ title: "Error", description: (e as Error).message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  if (loading) {
    return <div className="rounded-3xl bg-card p-6 shadow-card"><Loader2 className="h-5 w-5 animate-spin text-slate-grey" /></div>;
  }

  if (isFamilyPlus) {
    const renews = subscription?.current_period_end
      ? new Date(subscription.current_period_end).toLocaleDateString()
      : null;
    return (
      <div className="rounded-3xl bg-gradient-to-br from-salmon-soft/40 to-cream p-6 shadow-card">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-salmon-deep" />
          <span className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Family Plus active</span>
        </div>
        <h3 className="mt-2 font-display text-lg font-bold text-pitch-black">You're on Family Plus</h3>
        {renews && (
          <p className="mt-1 text-sm text-slate-grey">
            {subscription?.cancel_at_period_end ? `Ends ${renews}` : `Renews ${renews}`}
          </p>
        )}
        <Button variant="outline" className="mt-4 rounded-full" onClick={openPortal} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Manage subscription"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl bg-pitch-black p-6 text-pure-white shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-salmon">Family Plus</div>
        <h3 className="mt-2 font-display text-lg font-bold">Unlock unlimited messages & concierge</h3>
        <p className="mt-2 text-sm text-pure-white/70">From AED 39/month. Cancel any time.</p>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => setOpen(true)} className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep shadow-cta">
            Upgrade
          </Button>
          <Button asChild variant="outline" className="rounded-full border-pure-white/30 bg-transparent text-pure-white hover:bg-pure-white/10">
            <Link to="/pricing">Compare plans</Link>
          </Button>
        </div>
      </div>
      <FamilyPlusUpgradeDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
