import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { FamilyPlusUpgradeDialog } from "./FamilyPlusUpgradeDialog";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { Sparkles, Loader2, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { isNativeApp, WEB_ORIGIN } from "@/lib/platform";
import { openExternal } from "@/lib/native/openExternal";

export function FamilyPlusCard() {
  const { subscription, isFamilyPlus, loading, refetch } = useSubscription() as any;
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const { toast } = useToast();
  const native = isNativeApp();

  const openPortal = async () => {
    if (native) {
      // Apple: don't open Stripe portal in-app for billing changes; route to web account.
      await openExternal(`${WEB_ORIGIN}/account`);
      return;
    }
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
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-full" onClick={openPortal} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : (
              <>{native && <ExternalLink className="mr-1 h-3.5 w-3.5" />}Manage on web</>
            )}
          </Button>
          {native && refetch && (
            <Button variant="ghost" className="rounded-full" onClick={() => refetch()}>
              Refresh status
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Native (iOS/Android): no in-app purchase, no prices, no "Upgrade" CTA.
  // Per Apple guideline 3.1.3(a) "Reader" exception — link out to web with neutral copy.
  if (native) {
    return (
      <div className="rounded-3xl bg-gradient-to-br from-salmon-soft via-cream to-pure-white p-6 text-pitch-black shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Family Plus</div>
        <h3 className="mt-2 font-display text-lg font-bold">More features for families</h3>
        <p className="mt-2 text-sm text-slate-grey">
          Family Plus is a website feature. Visit nannyrecommended.com on the same account to learn more — any features you add there will appear here automatically.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() => openExternal(`${WEB_ORIGIN}/account`)}
            className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep"
          >
            <ExternalLink className="mr-1 h-3.5 w-3.5" /> Manage on web
          </Button>
          {refetch && (
            <Button variant="ghost" className="rounded-full text-pitch-black hover:bg-pitch-black/5" onClick={() => refetch()}>
              Refresh status
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-3xl bg-gradient-to-br from-salmon-soft via-cream to-pure-white p-6 text-pitch-black shadow-card">
        <div className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Family Plus</div>
        <h3 className="mt-2 font-display text-lg font-bold">Unlock unlimited messages & concierge</h3>
        <p className="mt-2 text-sm text-slate-grey">From AED 39/month. Cancel any time.</p>
        <div className="mt-4 flex gap-2">
          <Button onClick={() => setOpen(true)} className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep shadow-cta">
            Upgrade
          </Button>
          <Button asChild variant="outline" className="rounded-full border-pitch-black/15 bg-transparent text-pitch-black hover:bg-pitch-black/5">
            <Link to="/pricing">Compare plans</Link>
          </Button>
        </div>
      </div>
      <FamilyPlusUpgradeDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
