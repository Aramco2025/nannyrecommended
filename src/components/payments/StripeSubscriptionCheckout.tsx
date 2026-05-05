import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

export function StripeSubscriptionCheckout({
  priceId,
  returnUrl,
}: {
  priceId: string;
  returnUrl: string;
}) {
  const fetchClientSecret = async (): Promise<string> => {
    const { data, error } = await supabase.functions.invoke("create-subscription-checkout", {
      body: { priceId, return_url: returnUrl, environment: getStripeEnvironment() },
    });
    if (error || !data?.client_secret) {
      throw new Error(error?.message || "Could not start checkout");
    }
    return data.client_secret;
  };

  return (
    <div id="checkout" className="min-h-[480px]">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
