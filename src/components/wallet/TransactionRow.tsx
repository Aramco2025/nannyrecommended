import { formatMoney } from "@/lib/money";
import { ArrowDownLeft, ArrowUpRight, Banknote, Gift, RefreshCw } from "lucide-react";
import type { WalletTx } from "@/hooks/useWallet";

const ICON_MAP: Record<string, typeof Banknote> = {
  booking_payment_in: ArrowDownLeft,
  bonus: Gift,
  top_up: ArrowDownLeft,
  refund: RefreshCw,
  cash_out_request: ArrowUpRight,
  cash_out_completed: Banknote,
  platform_fee: ArrowUpRight,
};

const LABEL_MAP: Record<string, string> = {
  booking_payment_in: "Booking payment",
  cash_out_request: "Cash-out requested",
  cash_out_completed: "Cash-out completed",
  cash_out_cancelled: "Cash-out cancelled",
  platform_fee: "Platform fee",
  top_up: "Top-up",
  bonus: "Bonus",
  refund: "Refund",
};

export function TransactionRow({ tx }: { tx: WalletTx }) {
  const Icon = ICON_MAP[tx.type] ?? Banknote;
  const isCredit = tx.amount_minor_units > 0;
  const date = new Date(tx.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`grid h-10 w-10 place-items-center rounded-full ${isCredit ? "bg-success-green/10 text-success-green" : "bg-slate-grey/10 text-slate-grey"}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-pitch-black">{LABEL_MAP[tx.type] ?? tx.type}</div>
        <div className="truncate text-xs text-slate-grey">{tx.description ?? date}</div>
      </div>
      <div className={`tabular-nums text-sm font-semibold ${isCredit ? "text-success-green" : "text-pitch-black"}`}>
        {isCredit ? "+" : ""}{formatMoney(tx.amount_minor_units)}
      </div>
    </div>
  );
}
