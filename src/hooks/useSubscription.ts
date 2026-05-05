import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";

export type Subscription = {
  id: string;
  plan: string;
  price_id: string | null;
  status: string;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const env = getStripeEnvironment();

  const refetch = useCallback(async () => {
    if (!user) { setSubscription(null); setLoading(false); return; }
    const { data } = await supabase
      .from("subscriptions")
      .select("id, plan, price_id, status, current_period_end, cancel_at_period_end")
      .eq("user_id", user.id)
      .eq("environment", env)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setSubscription(data as any);
    setLoading(false);
  }, [user, env]);

  useEffect(() => { refetch(); }, [refetch]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase
      .channel(`subs-${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "subscriptions", filter: `user_id=eq.${user.id}` }, () => refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user, refetch]);

  const isFamilyPlus = !!subscription
    && ["active", "trialing"].includes(subscription.status)
    && !subscription.cancel_at_period_end;

  return { subscription, isFamilyPlus, loading, refetch };
}
