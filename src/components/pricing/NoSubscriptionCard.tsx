import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * NannyRecommended is pay-per-booking — there are no subscriptions,
 * recurring charges, or surprise renewals. This card makes that
 * commitment visible everywhere a user might expect to see "your plan".
 */
export function NoSubscriptionCard() {
  return (
    <section
      aria-label="No subscription guarantee"
      className="rounded-2xl border border-border bg-card p-5 shadow-card"
    >
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-success-green/10 text-success-green">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-pitch-black">
            No subscription · no recurring charges
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-grey">
            You only pay when you book a sit. We will never auto-renew, never
            charge a "membership" and never store a card without a confirmed
            booking. Cancel anytime from this page — no calls, no emails.
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            <Link to="/pricing" className="font-medium text-pitch-black underline">
              How fees work
            </Link>
            <Link to="/commitments" className="font-medium text-pitch-black underline">
              Our commitments
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
