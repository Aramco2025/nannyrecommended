import { calculateFee, formatCurrency } from "@/lib/fees";

type Props = {
  hourlyRate: number;
  hours: number;
  completedBookingsTogether: number;
  currency?: "AED" | "GBP";
};

export function FeeBreakdown({ hourlyRate, hours, completedBookingsTogether, currency = "AED" }: Props) {
  const baseValue = hourlyRate * hours;
  const fee = calculateFee(completedBookingsTogether, baseValue);
  const parentFeeAmount = fee.parentPays - fee.baseValue;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-sm font-semibold text-pitch-black">Transparent fees</h3>
      <p className="mt-1 text-xs text-slate-grey">No hidden charges. Sitter sees this same breakdown.</p>

      <dl className="mt-4 space-y-2.5 text-sm">
        <Row
          label={`Sitter rate · ${formatCurrency(hourlyRate, currency)} × ${hours}h`}
          value={formatCurrency(baseValue, currency)}
        />
        <Row
          label={`NannyRecommended fee (${(fee.parentFeePercent * 100).toFixed(0)}%)`}
          value={`+ ${formatCurrency(parentFeeAmount, currency)}`}
          muted
        />
        <div className="my-2 h-px bg-border" />
        <Row
          label="Total you pay"
          value={formatCurrency(fee.parentPays, currency)}
          bold
        />
        <Row
          label={`Sitter receives (${((1 - fee.sitterFeePercent) * 100).toFixed(0)}% of rate)`}
          value={formatCurrency(fee.sitterReceives, currency)}
          accent
        />
      </dl>

      {completedBookingsTogether > 0 && completedBookingsTogether < 20 && (
        <div className="mt-4 rounded-xl bg-salmon/10 p-3 text-xs text-salmon-deep">
          {completedBookingsTogether < 5 ? (
            <>This is booking #{completedBookingsTogether + 1}. {5 - completedBookingsTogether} more and your fee drops to <strong>4%</strong>.</>
          ) : (
            <>Loyalty rate active: 4%. {20 - completedBookingsTogether} more and you drop to <strong>2%</strong>.</>
          )}
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold, muted, accent }: { label: string; value: string; bold?: boolean; muted?: boolean; accent?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className={muted ? "text-slate-grey" : "text-pitch-black"}>{label}</dt>
      <dd className={`tabular-nums ${bold ? "text-base font-semibold text-pitch-black" : accent ? "text-success-green font-medium" : "text-pitch-black"}`}>
        {value}
      </dd>
    </div>
  );
}
