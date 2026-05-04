// MOCK Stripe integration — swap for real Stripe Checkout post-MVP.
export async function chargeCard(opts: {
  amountMinor: number;
  currency: "AED" | "GBP";
  paymentMethodId?: string;
  customerId?: string;
}) {
  await new Promise((r) => setTimeout(r, 1200));
  return {
    success: true,
    transactionId: `mock_stripe_${Date.now()}`,
    amountMinor: opts.amountMinor,
    currency: opts.currency,
    last4: "4242",
    brand: "visa",
  };
}
