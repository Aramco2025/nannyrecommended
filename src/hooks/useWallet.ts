import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Wallet = {
  id: string;
  balance_minor_units: number;
  pending_minor_units: number;
  currency: "AED" | "GBP";
};

export type WalletTx = {
  id: string;
  type: string;
  amount_minor_units: number;
  description: string | null;
  status: string;
  created_at: string;
  related_booking_id: string | null;
  related_cash_out_id: string | null;
};

export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!user) { setWallet(null); setTransactions([]); setLoading(false); return; }
    setLoading(true);
    const { data: w } = await supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle();
    if (w) {
      setWallet({
        id: w.id,
        balance_minor_units: Number(w.balance_minor_units),
        pending_minor_units: Number(w.pending_minor_units),
        currency: w.currency as "AED" | "GBP",
      });
      const { data: tx } = await supabase
        .from("wallet_transactions")
        .select("*")
        .eq("wallet_id", w.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setTransactions((tx ?? []) as any);
    } else {
      setWallet({ id: "", balance_minor_units: 0, pending_minor_units: 0, currency: "AED" });
      setTransactions([]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  // Realtime updates
  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`wallet:${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "wallets", filter: `user_id=eq.${user.id}` },
        () => refresh())
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "wallet_transactions" },
        () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, refresh]);

  return { wallet, transactions, loading, refresh };
}
