import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export function useFavourites() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["favourites", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<Set<string>> => {
      const { data, error } = await supabase
        .from("favourites")
        .select("sitter_id")
        .eq("parent_id", user!.id);
      if (error) throw error;
      return new Set((data ?? []).map(r => r.sitter_id));
    },
  });
}

export function useToggleFavourite() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ sitterId, isFav }: { sitterId: string; isFav: boolean }) => {
      if (!user) throw new Error("Sign in to save favourites");
      if (isFav) {
        const { error } = await supabase
          .from("favourites")
          .delete()
          .eq("parent_id", user.id)
          .eq("sitter_id", sitterId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("favourites")
          .insert({ parent_id: user.id, sitter_id: sitterId });
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favourites"] }),
    onError: (e: any) => toast({ title: "Couldn't update favourite", description: e.message, variant: "destructive" }),
  });
}
