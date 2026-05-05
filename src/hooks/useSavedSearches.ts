import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function useSavedSearches() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["saved-searches", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_searches").select("*")
        .eq("user_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useSaveSearch() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ name, filters, alerts_enabled = true }: { name: string; filters: any; alerts_enabled?: boolean }) => {
      if (!user) throw new Error("Sign in to save searches");
      const { error } = await supabase.from("saved_searches")
        .insert({ user_id: user.id, name, filters, alerts_enabled });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Search saved", description: "We'll alert you when new sitters match." });
      qc.invalidateQueries({ queryKey: ["saved-searches"] });
    },
    onError: (e: any) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });
}

export function useDeleteSavedSearch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("saved_searches").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["saved-searches"] }),
  });
}
