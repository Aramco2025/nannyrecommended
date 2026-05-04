import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type JobType = "one_off" | "repeat" | "permanent";

export function useJobPosts(type?: JobType) {
  return useQuery({
    queryKey: ["job_posts", type ?? "all"],
    queryFn: async () => {
      let q = supabase.from("job_posts").select("*").eq("status", "open").order("start_at", { ascending: true });
      if (type) q = q.eq("type", type);
      const { data, error } = await q;
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useApplyToJob() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, message }: { jobId: string; message?: string }) => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) throw new Error("Sign in to apply");
      const { error } = await supabase.from("job_applications").insert({
        job_post_id: jobId,
        sitter_user_id: u.user.id,
        message: message ?? null,
      });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["my_applications"] }),
  });
}

export function useMyApplications() {
  return useQuery({
    queryKey: ["my_applications"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data, error } = await supabase
        .from("job_applications")
        .select("*, job_posts(*)")
        .eq("sitter_user_id", u.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}
