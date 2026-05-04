import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SlotFilter = { date: Date; startTime: string; endTime: string } | null;

/**
 * Returns a Set of sitter IDs that are available in the given slot.
 * Cross-references the `availability` table (specific_date or weekly day_of_week).
 */
export function useAvailableSitters(slot: SlotFilter) {
  return useQuery({
    queryKey: ["available-sitters", slot?.date?.toISOString(), slot?.startTime, slot?.endTime],
    enabled: !!slot,
    queryFn: async (): Promise<Set<string>> => {
      if (!slot) return new Set();
      const dow = slot.date.getDay();
      const dateStr = slot.date.toISOString().slice(0, 10);
      // Match windows where start_time <= slot.startTime AND end_time >= slot.endTime
      const { data, error } = await supabase
        .from("availability")
        .select("sitter_id, specific_date, day_of_week, start_time, end_time")
        .lte("start_time", slot.startTime)
        .gte("end_time", slot.endTime);
      if (error) throw error;
      const ids = new Set<string>();
      for (const a of data ?? []) {
        if (a.specific_date && a.specific_date === dateStr) ids.add(a.sitter_id);
        else if (!a.specific_date && a.day_of_week === dow) ids.add(a.sitter_id);
      }
      return ids;
    },
  });
}
