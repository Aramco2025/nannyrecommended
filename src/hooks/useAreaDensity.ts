import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type DensityLevel = "cold" | "warm" | "hot";

export type AreaDensity = {
  area: string | null;
  totalActive: number;
  level: DensityLevel;
  growingFast: boolean;
};

/**
 * Live count of active sitters for a given area (case-insensitive).
 * If `area` is null/empty we count globally.
 */
export function useAreaDensity(area: string | null | undefined): AreaDensity & { loading: boolean } {
  const [state, setState] = useState<AreaDensity & { loading: boolean }>({
    area: area ?? null,
    totalActive: 0,
    level: "warm",
    growingFast: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      let q = supabase
        .from("sitters")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true);
      if (area && area.trim()) q = q.ilike("area", `%${area.trim()}%`);
      const { count } = await q;

      // Recent joiners in last 30 days for "growing fast"
      const since = new Date(Date.now() - 30 * 86400_000).toISOString();
      let recentQ = supabase
        .from("sitters")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .gte("created_at", since);
      if (area && area.trim()) recentQ = recentQ.ilike("area", `%${area.trim()}%`);
      const { count: recent } = await recentQ;

      if (cancelled) return;
      const total = count ?? 0;
      const level: DensityLevel = total < 5 ? "cold" : total < 20 ? "warm" : "hot";
      setState({
        area: area ?? null,
        totalActive: total,
        level,
        growingFast: (recent ?? 0) >= Math.max(2, Math.floor(total * 0.2)),
        loading: false,
      });
    })();
    return () => { cancelled = true; };
  }, [area]);

  return state;
}
