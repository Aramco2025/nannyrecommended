import { Link, Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/useWallet";
import { WalletBalance } from "@/components/wallet/WalletBalance";
import { TransactionRow } from "@/components/wallet/TransactionRow";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SitterWallet = () => {
  const { user, loading } = useAuth();
  const { wallet, transactions, loading: wLoading } = useWallet();
  const navigate = useNavigate();

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-8">
        <h1 className="font-display text-3xl font-semibold text-pitch-black">Wallet</h1>
        <p className="mt-1 text-sm text-slate-grey">Your earnings are yours. Cash out anytime, your way — no bank account needed.</p>

        <div className="mt-6">
          {wLoading || !wallet ? (
            <div className="h-48 animate-pulse rounded-3xl bg-muted" />
          ) : (
            <WalletBalance
              balanceMinor={wallet.balance_minor_units}
              pendingMinor={wallet.pending_minor_units}
              currency={wallet.currency}
              onCashOut={() => navigate("/sitter/wallet/cashout")}
            />
          )}
        </div>

        <section className="mt-8">
          <h2 className="text-lg font-semibold text-pitch-black">Recent activity</h2>
          <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card px-4 shadow-card">
            {transactions.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-grey">No activity yet. Money from completed bookings will show here.</div>
            ) : (
              transactions.map((tx) => <TransactionRow key={tx.id} tx={tx} />)
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-slate-grey">
          Funds held by NannyRecommended in partnership with our licensed payments provider. Cash-out fulfilment by Al Ansari Exchange and partner network.
          {" · "}<Link to="/how-it-works" className="underline">How it works</Link>
        </p>
      </main>
      <Footer />
    </div>
  );
};

export default SitterWallet;
