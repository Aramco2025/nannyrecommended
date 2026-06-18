import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StripeSubscriptionCheckout } from "./StripeSubscriptionCheckout";
import { isTestMode } from "@/lib/stripe";
import { isNativeApp, WEB_ORIGIN } from "@/lib/platform";
import { openExternal } from "@/lib/native/openExternal";
import { ExternalLink } from "lucide-react";

type Plan = "monthly" | "yearly";

const PRICE_IDS: Record<Plan, string> = {
  monthly: "family_plus_monthly",
  yearly: "family_plus_yearly",
};

export function FamilyPlusUpgradeDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [plan, setPlan] = useState<Plan>("monthly");
  const [started, setStarted] = useState(false);

  const native = isNativeApp();

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setStarted(false); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">
            {native ? "Family Plus" : "Upgrade to Family Plus"}
          </DialogTitle>
        </DialogHeader>

        {native ? (
          <div className="space-y-4">
            <p className="text-sm text-slate-grey">
              Family Plus is managed on our website. Open it in your browser, sign in with the same
              account, and your benefits will appear here automatically.
            </p>
            <Button
              size="lg"
              className="w-full rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90"
              onClick={() => { openExternal(`${WEB_ORIGIN}/account`); onOpenChange(false); }}
            >
              <ExternalLink className="mr-2 h-4 w-4" /> Manage on web
            </Button>
          </div>
        ) : (
          <>
        {isTestMode() && (
          <div className="rounded-md bg-orange-100 px-3 py-2 text-xs text-orange-900">
            Test mode — use card 4242 4242 4242 4242, any future expiry, any CVC.
          </div>
        )}

        {!started ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPlan("monthly")}
                className={`rounded-2xl border p-4 text-left transition ${plan === "monthly" ? "border-salmon bg-salmon-soft/30" : "border-cream-deep"}`}
              >
                <div className="text-xs uppercase tracking-wider text-slate-grey">Monthly</div>
                <div className="mt-1 font-display text-2xl font-bold">AED 29</div>
                <div className="text-xs text-slate-grey">per month, cancel any time</div>
              </button>
              <button
                type="button"
                onClick={() => setPlan("yearly")}
                className={`relative rounded-2xl border p-4 text-left transition ${plan === "yearly" ? "border-salmon bg-salmon-soft/30" : "border-cream-deep"}`}
              >
                <span className="absolute right-2 top-2 rounded-full bg-success-green px-2 py-0.5 text-[10px] font-bold uppercase text-pure-white">Save 17%</span>
                <div className="text-xs uppercase tracking-wider text-slate-grey">Yearly</div>
                <div className="mt-1 font-display text-2xl font-bold">AED 290</div>
                <div className="text-xs text-slate-grey">AED 24/mo billed annually</div>
              </button>
            </div>
            <Button
              size="lg"
              className="w-full rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep shadow-cta"
              onClick={() => setStarted(true)}
            >
              Continue to payment
            </Button>
            <p className="text-center text-xs text-slate-grey">
              Secure checkout by Stripe. Cancel any time from your account.
            </p>
          </div>
        ) : (
          <StripeSubscriptionCheckout
            priceId={PRICE_IDS[plan]}
            returnUrl={`${window.location.origin}/checkout/subscription-return`}
          />
        )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
