import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type SitterReview = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  parent_id: string;
  parent_name: string;
  booking_id: string;
  verified: boolean;
};

/**
 * Fetches reviews for a sitter, joined with the reviewing parent's name.
 * Every review is tied to a real booking — that's the "verified" signal.
 */
export function useSitterReviews(sitterId?: string) {
  return useQuery({
    queryKey: ["sitter-reviews", sitterId],
    enabled: !!sitterId,
    queryFn: async (): Promise<SitterReview[]> => {
      const { data, error } = await supabase
        .from("reviews")
        .select("id,rating,comment,created_at,parent_id,booking_id")
        .eq("sitter_id", sitterId!)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      const rows = data ?? [];
      if (rows.length === 0) return [];

      const parentIds = Array.from(new Set(rows.map((r) => r.parent_id)));
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id,full_name")
        .in("id", parentIds);

      const nameById = new Map((profiles ?? []).map((p) => [p.id, p.full_name ?? ""]));

      return rows.map((r) => {
        const full = nameById.get(r.parent_id) ?? "Parent";
        const first = full.trim().split(" ")[0] || "Parent";
        const lastInitial = full.trim().split(" ").slice(1, 2).join("").charAt(0);
        return {
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          created_at: r.created_at,
          parent_id: r.parent_id,
          booking_id: r.booking_id,
          parent_name: lastInitial ? `${first} ${lastInitial}.` : first,
          verified: true,
        };
      });
    },
  });
}
