import { Info, ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency } from "@/lib/fees";

type Props = {
  total: number;
  sitterPayout: number;
  hours: number;
  isSitter: boolean;
  released: boolean;
};

/**
 * Displays the actual settled values stored on the booking.
 * No re-calculation — what the parent paid and what the sitter receives
 * are read directly from the database, so this stays accurate even if
 * fee tiers change later.
 */
export function PaymentSummary({ total, sitterPayout, hours, isSitter, released }: Props) {
  const platformFee = Math.max(0, total - sitterPayout);
  const effectiveRate = hours > 0 ? sitterPayout / hours : 0;

  return (
    <TooltipProvider delayDuration={150}>
      <section
        aria-label="Payment summary"
        className="mt-5 rounded-2xl border border-border bg-off-white p-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-grey">
            Payment summary
          </h2>
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-success-green">
            <ShieldCheck className="h-3.5 w-3.5" />
            {released ? "Released" : "Held in escrow"}
          </span>
        </div>

        <dl className="mt-3 space-y-2 text-sm">
          <Row
            label={
              <Labelled
                text="Parent paid"
                tip="Full amount charged at booking confirmation. Held in escrow until completion is confirmed."
              />
            }
            value={formatCurrency(total)}
            bold
          />
          {isSitter && (
            <>
              <Row
                label={
                  <Labelled
                    text="Sitter payout"
                    tip={`Your take-home for ${hours} hour${hours === 1 ? "" : "s"} (≈ ${formatCurrency(effectiveRate)}/hr after fee).`}
                  />
                }
                value={formatCurrency(sitterPayout)}
                accent
              />
              <Row
                label={
                  <Labelled
                    text="Platform fee"
                    tip="Covers payments, ID checks, support and insurance. Tips (if any) go 100% to you on top of this payout."
                  />
                }
                value={`− ${formatCurrency(platformFee)}`}
                muted
              />
            </>
          )}
          {!isSitter && (
            <Row
              label={
                <Labelled
                  text="Sitter receives"
                  tip="What the sitter takes home after our fee. We never touch tips — those go 100% to the sitter."
                />
              }
              value={formatCurrency(sitterPayout)}
              accent
            />
          )}
        </dl>
      </section>
    </TooltipProvider>
  );
}

function Labelled({ text, tip }: { text: string; tip: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span>{text}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`More info about ${text}`}
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
