import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useDirectRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sitter_direct_requests", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Find sitter row for current user
      const { data: sitterRow } = await supabase
        .from("sitters").select("id").eq("user_id", user!.id).maybeSingle();
      if (!sitterRow) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("id, parent_id, start_at, end_at, hours, hourly_rate_aed, total_aed, status, address, notes, created_at")
        .eq("sitter_id", sitterRow.id)
        .eq("status", "pending")
        .order("start_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useRespondToRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ bookingId, accept }: { bookingId: string; accept: boolean }) => {
      const update: any = accept
        ? { status: "confirmed" }
        : { status: "cancelled", cancelled_at: new Date().toISOString(), cancelled_by_role: "sitter", cancel_reason: "Sitter declined" };
      const { error } = await supabase.from("bookings").update(update).eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sitter_direct_requests"] }),
  });
}
