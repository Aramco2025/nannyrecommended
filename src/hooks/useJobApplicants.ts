import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type JobApplicant = {
  application_id: string;
  status: "pending" | "accepted" | "declined";
  message: string | null;
  created_at: string;
  sitter_user_id: string;
  sitter_id: string | null;
  full_name: string | null;
  avatar_url: string | null;
  hourly_rate_aed: number | null;
  rating: number;
  bookings_completed: number;
  area: string | null;
};

export function useJobApplicants(jobPostId: string | undefined) {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["job-applicants", jobPostId],
    enabled: !!jobPostId,
    queryFn: async (): Promise<JobApplicant[]> => {
      const { data: apps, error } = await supabase
        .from("job_applications")
        .select("id, status, message, created_at, sitter_user_id")
        .eq("job_post_id", jobPostId!)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const userIds = (apps ?? []).map(a => a.sitter_user_id);
      if (!userIds.length) return [];

      const { data: sitters } = await supabase
        .from("sitters")
        .select("id, user_id, full_name, photos, hourly_rate_aed, rating, bookings_completed, area")
        .in("user_id", userIds);
      const smap = new Map((sitters ?? []).map(s => [s.user_id, s]));

      return (apps ?? []).map(a => {
        const s = smap.get(a.sitter_user_id);
        return {
          application_id: a.id,
          status: a.status as JobApplicant["status"],
          message: a.message,
          created_at: a.created_at,
          sitter_user_id: a.sitter_user_id,
          sitter_id: s?.id ?? null,
          full_name: s?.full_name ?? "Sitter",
          avatar_url: s?.photos?.[0] ?? null,
          hourly_rate_aed: s?.hourly_rate_aed ?? null,
          rating: Number(s?.rating ?? 0),
          bookings_completed: s?.bookings_completed ?? 0,
          area: s?.area ?? null,
        };
      });
    },
  });

  // Realtime subscription
  useEffect(() => {
    if (!jobPostId) return;
    const channel = supabase
      .channel(`job-apps-${jobPostId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "job_applications", filter: `job_post_id=eq.${jobPostId}` },
        () => qc.invalidateQueries({ queryKey: ["job-applicants", jobPostId] }),
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [jobPostId, qc]);

  return query;
}
