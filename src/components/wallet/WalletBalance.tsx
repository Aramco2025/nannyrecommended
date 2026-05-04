import { formatMoney } from "@/lib/money";

type Props = { balanceMinor: number; pendingMinor: number; currency?: "AED" | "GBP"; onCashOut?: () => void };

export function WalletBalance({ balanceMinor, pendingMinor, currency = "AED", onCashOut }: Props) {
  return (
    <div className="rounded-3xl bg-salmon p-7 text-primary-foreground shadow-cta">
      <div className="text-xs font-medium uppercase tracking-wider opacity-90">Your money</div>
      <div className="mt-2 font-display text-5xl font-semibold tracking-tight">
        {formatMoney(balanceMinor, currency)}
      </div>
      <div className="mt-2 text-sm opacity-90">Available to cash out, anytime, your way.</div>

      {pendingMinor > 0 && (
        <div className="mt-4 rounded-xl bg-white/15 px-3 py-2 text-xs">
          Pending from upcoming bookings: <span className="font-semibold">{formatMoney(pendingMinor, currency)}</span>
        </div>
      )}

      <button
        onClick={onCashOut}
        disabled={balanceMinor <= 0}
        className="mt-5 w-full rounded-xl bg-pitch-black py-3 text-sm font-semibold text-primary-foreground transition hover:bg-pitch-black/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Cash out
      </button>
    </div>
  );
}
