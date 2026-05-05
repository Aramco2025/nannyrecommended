import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateFee, formatCurrency } from "@/lib/fees";

type Props = {
  hourlyRate: number;
  hours: number;
  completedBookingsTogether: number;
  currency?: "AED" | "GBP";
  /** When true, render compact variant (no padding/border) for embedding inside other cards. */
  compact?: boolean;
};

export function FeeBreakdown({
  hourlyRate,
  hours,
  completedBookingsTogether,
  currency = "AED",
  compact = false,
}: Props) {
  const baseValue = hourlyRate * hours;
  const fee = calculateFee(completedBookingsTogether, baseValue);
  const parentFeeAmount = fee.parentPays - fee.baseValue;
  const sitterFeeAmount = fee.baseValue - fee.sitterReceives;

  const wrapperCls = compact
    ? ""
    : "rounded-2xl border border-border bg-card p-5 shadow-card";

  return (
    <TooltipProvider delayDuration={150}>
      <div className={wrapperCls}>
        {!compact && (
          <>
            <h3 className="text-sm font-semibold text-pitch-black">Transparent fees</h3>
            <p className="mt-1 text-xs text-slate-grey">
              No hidden charges. Sitter sees this same breakdown.
            </p>
          </>
        )}

        <dl className={`${compact ? "" : "mt-4"} space-y-2.5 text-sm`}>
          <Row
            label={
              <InfoLabel
                text={`Sitter rate · ${formatCurrency(hourlyRate, currency)} × ${hours}h`}
                tip="The sitter's hourly rate, set by them. We never mark this up."
              />
            }
            value={formatCurrency(baseValue, currency)}
          />
          <Row
            label={
              <InfoLabel
                text={`NannyRecommended fee (${(fee.parentFeePercent * 100).toFixed(0)}%)`}
                tip={
                  <>
                    Covers payment processing, ID checks, in-app messaging, 24/7 support and
                    insurance contributions. Drops as you build loyalty: 8% → 4% → 2%.
                  </>
                }
              />
            }
            value={`+ ${formatCurrency(parentFeeAmount, currency)}`}
            muted
          />
          <div className="my-2 h-px bg-border" />
          <Row
            label={
              <InfoLabel
                text="Total you pay"
                tip="Charged once, when your sit is confirmed. Held in escrow until you confirm completion. No surprise add-ons."
              />
            }
            value={formatCurrency(fee.parentPays, currency)}
            bold
          />
          <Row
            label={
              <InfoLabel
                text={`Sitter receives (${((1 - fee.sitterFeePercent) * 100).toFixed(0)}% of rate)`}
                tip={`We deduct a ${(fee.sitterFeePercent * 100).toFixed(0)}% sitter fee. Tips go 100% to the sitter — we never take a cut.`}
              />
            }
            value={formatCurrency(fee.sitterReceives, currency)}
            accent
          />
          <Row
            label={<span className="text-xs text-slate-grey">Sitter fee deducted</span>}
            value={<span className="text-xs text-slate-grey">− {formatCurrency(sitterFeeAmount, currency)}</span>}
            muted
          />
        </dl>

        {completedBookingsTogether > 0 && completedBookingsTogether < 20 && (
          <div className="mt-4 rounded-xl bg-salmon/10 p-3 text-xs text-salmon-deep">
            {completedBookingsTogether < 5 ? (
              <>
                This is booking #{completedBookingsTogether + 1}.{" "}
                {5 - completedBookingsTogether} more and your fee drops to <strong>4%</strong>.
              </>
            ) : (
              <>
                Loyalty rate active: 4%. {20 - completedBookingsTogether} more and you drop to{" "}
                <strong>2%</strong>.
              </>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function InfoLabel({ text, tip }: { text: React.ReactNode; tip: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{text}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="More info"
            className="text-slate-grey hover:text-pitch-black focus:outline-none focus:ring-2 focus:ring-salmon rounded-full"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-xs leading-relaxed">{tip}</TooltipContent>
      </Tooltip>
    </span>
  );
}

function Row({
  label,
  value,
  bold,
  muted,
  accent,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
  bold?: boolean;
  muted?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={muted ? "text-slate-grey" : "text-pitch-black"}>{label}</dt>
      <dd
        className={`tabular-nums ${
          bold
            ? "text-base font-semibold text-pitch-black"
            : accent
            ? "text-success-green font-medium"
            : "text-pitch-black"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
