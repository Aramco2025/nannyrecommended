import { CheckCircle2, XCircle, ShieldCheck, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type Check = {
  label: string;
  passed: boolean;
  detail: string;
};

type Props = {
  verified: boolean;
  policeCleared: boolean;
  firstAidCertified: boolean;
  earlyYearsQualified?: boolean;
  bookingsCompleted: number;
};

/**
 * Transparent verification breakdown.
 * Shows exactly what we've checked, what we haven't, and what each check means —
 * so trust is earned, not assumed.
 */
export function VerificationPanel({
  verified,
  policeCleared,
  firstAidCertified,
  earlyYearsQualified,
  bookingsCompleted,
}: Props) {
  const checks: Check[] = [
    {
      label: "Government ID verified",
      passed: verified,
      detail: "Emirates ID or passport matched against a live selfie by our review team.",
    },
    {
      label: "UAE police clearance",
      passed: policeCleared,
      detail: "A clean police certificate issued in the last 12 months has been reviewed.",
    },
    {
      label: "Reference checks",
      passed: verified,
      detail: "At least two previous families or employers contacted by our team.",
    },
    {
      label: "Paediatric first aid",
      passed: firstAidCertified,
      detail: "Certificate from a recognised provider verified within the last 24 months.",
    },
    {
      label: "Early years qualified",
      passed: !!earlyYearsQualified,
      detail: "Formal early childhood / nursery qualification on file.",
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const tierLabel = passedCount >= 4 ? "Verified+" : passedCount >= 2 ? "Verified" : "In review";

  return (
    <TooltipProvider delayDuration={150}>
      <section
        aria-label="Verification details"
        className="rounded-3xl bg-pure-white p-6 shadow-card"
      >
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-success-green/10 text-success-green">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-pitch-black">
                Trust & verification
              </h2>
              <p className="text-xs text-slate-grey">
                {passedCount} of {checks.length} checks complete · {bookingsCompleted} bookings
              </p>
            </div>
          </div>
          <span className="rounded-full border border-success-green/30 bg-success-green/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-success-green">
            {tierLabel}
          </span>
        </header>

        <ul className="mt-5 divide-y divide-cream-deep">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2.5">
                {c.passed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success-green" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-dust-grey" />
                )}
                <span
                  className={`text-sm font-medium ${
                    c.passed ? "text-pitch-black" : "text-slate-grey"
                  }`}
                >
                  {c.label}
                </span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      aria-label={`What "${c.label}" means`}
                      className="text-slate-grey hover:text-pitch-black focus:outline-none"
                    >
                      <Info className="h-3.5 w-3.5" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs text-xs leading-relaxed">
                    {c.detail}
                  </TooltipContent>
                </Tooltip>
              </div>
              <span
                className={`text-xs font-semibold ${
                  c.passed ? "text-success-green" : "text-dust-grey"
                }`}
              >
                {c.passed ? "Passed" : "Not on file"}
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-xs leading-relaxed text-slate-grey">
          Checks are re-validated yearly. Spotted something off?{" "}
          <a href="/contact" className="font-semibold text-salmon-deep hover:text-salmon">
            Report this profile
          </a>
          .
        </p>
      </section>
    </TooltipProvider>
  );
}
