import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LeaderRow = {
  referrer_id: string;
  initial: string;
  referrals_count: number;
  total_reward_aed: number;
};

export function useReferralLeaderboard() {
  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (supabase as any).from("referral_leaderboard_monthly").select("*").limit(20)
      .then(({ data }: any) => { setRows((data ?? []) as LeaderRow[]); setLoading(false); });
  }, []);
  return { rows, loading };
}
