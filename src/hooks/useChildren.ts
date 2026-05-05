import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Child = { id: string; parent_id: string; name: string; dob: string | null; notes: string | null };

export function useChildren() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["children", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("children").select("*").eq("parent_id", user!.id).order("created_at");
      if (error) throw error;
      return (data ?? []) as Child[];
    },
  });
}

export function useUpsertChild() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (child: Partial<Child> & { name: string }) => {
      const payload = { ...child, parent_id: user!.id };
      if (child.id) {
        const { error } = await supabase.from("children").update(payload).eq("id", child.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("children").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
  });
}

export function useDeleteChild() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("children").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["children"] }),
  });
}
