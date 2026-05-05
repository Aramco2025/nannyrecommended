import { isTestMode } from "@/lib/stripe";

export function PaymentTestModeBanner() {
  if (!isTestMode()) return null;
  return (
    <div className="w-full bg-orange-100 border-b border-orange-300 px-4 py-2 text-center text-xs text-orange-900">
      Test mode payments — no real money is moved. Use card{" "}
      <code className="rounded bg-orange-200 px-1">4242 4242 4242 4242</code>, any future expiry, any CVC.
    </div>
  );
}
