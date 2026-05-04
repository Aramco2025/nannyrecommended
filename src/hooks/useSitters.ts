import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mapSitter, UISitter } from "@/lib/sitterMapper";

export function useSitters() {
  return useQuery({
    queryKey: ["sitters"],
    queryFn: async (): Promise<UISitter[]> => {
      const { data, error } = await supabase
        .from("sitters")
        .select("*, profiles:user_id(full_name, avatar_url)")
        .eq("is_active", true)
        .order("rating", { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapSitter as any);
    },
  });
}

export function useSitter(id: string | undefined) {
  return useQuery({
    queryKey: ["sitter", id],
    enabled: !!id,
    queryFn: async (): Promise<UISitter | null> => {
      const { data, error } = await supabase
        .from("sitters")
        .select("*, profiles:user_id(full_name, avatar_url)")
        .eq("id", id!)
        .maybeSingle();
      if (error) throw error;
      return data ? mapSitter(data as any) : null;
    },
  });
}
