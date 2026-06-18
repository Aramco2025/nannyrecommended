import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment, isTestMode } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

export function OneTimeCheckoutDialog({
  open,
  onOpenChange,
  priceId,
  title,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  priceId: "priority_booking_once" | "background_check_once";
  title: string;
}) {
  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-one-time-checkout", {
      body: {
        priceId,
        return_url: `${window.location.origin}/checkout/subscription-return`,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.client_secret) throw new Error(error?.message || "Could not start checkout");
    return data.client_secret;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{title}</DialogTitle>
        </DialogHeader>
        {isTestMode() && (
          <div className="rounded-md bg-orange-100 px-3 py-2 text-xs text-orange-900">
            Test mode — use card 4242 4242 4242 4242, any future expiry, any CVC.
          </div>
        )}
        {open && (
          <div id="checkout" className="min-h-[480px]">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
