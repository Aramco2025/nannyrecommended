import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

type Props = {
  variant?: "inline" | "card";
  coverageAed?: number;
};

/**
 * Surfaces the booking insurance promise close to the moment of payment / booking,
 * so parents see protection isn't an afterthought.
 */
export function InsuranceBadge({ variant = "inline", coverageAed = 2500 }: Props) {
  if (variant === "card") {
    return (
      <div className="rounded-2xl border border-success-green/20 bg-success-green/5 p-4">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-success-green/10 text-success-green">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div className="text-sm">
            <p className="font-semibold text-pitch-black">
              Covered by booking insurance
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-grey">
              Every confirmed in-app booking includes liability cover up to{" "}
              <strong className="text-pitch-black">AED {coverageAed.toLocaleString()}</strong>.{" "}
              <Link to="/trust-safety" className="font-semibold text-salmon-deep hover:text-salmon">
                See what's covered
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-slate-grey">
      <ShieldCheck className="h-3.5 w-3.5 text-success-green" />
      Insured up to AED {coverageAed.toLocaleString()}.{" "}
      <Link to="/trust-safety" className="font-semibold text-salmon-deep hover:text-salmon">
        Details
      </Link>
    </span>
  );
}
