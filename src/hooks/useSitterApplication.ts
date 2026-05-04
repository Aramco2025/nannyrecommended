import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type SitterApplication = {
  id: string;
  sitter_user_id: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  eligibility: Record<string, boolean>;
  experience: {
    years?: number;
    age_groups?: string[];
    settings?: string[];
    summary?: string;
  };
  qualifications: {
    first_aid?: boolean;
    cpr?: boolean;
    early_years?: boolean;
    teaching?: boolean;
    other?: string;
  };
  references_data: Array<{ name: string; relationship: string; phone: string; email?: string }>;
  id_doc_url: string | null;
  video_url: string | null;
  bio: string | null;
  submitted_at: string | null;
};

export function useSitterApplication() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sitter-application", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sitter_applications")
        .select("*")
        .eq("sitter_user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return (data as unknown as SitterApplication) ?? null;
    },
  });
}

export function useUpdateSitterApplication() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<SitterApplication>) => {
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase
        .from("sitter_applications")
        .upsert(
          { sitter_user_id: user.id, status: "draft", ...patch } as any,
          { onConflict: "sitter_user_id" },
        )
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sitter-application", user?.id] }),
  });
}
