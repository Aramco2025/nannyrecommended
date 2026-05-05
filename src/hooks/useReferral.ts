import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useReferralCode() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["referral-code", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data: existing } = await supabase
        .from("referral_codes").select("code").eq("user_id", user!.id).maybeSingle();
      if (existing?.code) return existing.code as string;
      const { data, error } = await supabase.rpc("ensure_referral_code", { _user: user!.id });
      if (error) throw error;
      return data as string;
    },
  });
}

export function useReferralStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["referral-stats", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("referrals").select("status, reward_aed")
        .eq("referrer_id", user!.id);
      if (error) throw error;
      const rows = data ?? [];
      return {
        total: rows.length,
        rewarded: rows.filter(r => r.status === "rewarded").length,
        earnedAed: rows.filter(r => r.status === "rewarded").reduce((a, r) => a + Number(r.reward_aed || 0), 0),
      };
    },
  });
}
