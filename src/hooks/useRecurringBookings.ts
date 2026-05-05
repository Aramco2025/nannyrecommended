import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export type RecurringBooking = {
  id: string;
  parent_id: string;
  sitter_id: string;
  day_of_week: number;
  start_time: string;
  hours: number;
  address: string | null;
  notes: string | null;
  children_ids: string[];
  active: boolean;
  next_occurrence: string | null;
  created_at: string;
};

export function useRecurringBookings() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["recurring-bookings", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<RecurringBooking[]> => {
      const { data, error } = await supabase
        .from("recurring_bookings").select("*")
        .eq("parent_id", user!.id).order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RecurringBooking[];
    },
  });
}

export function useCreateRecurring() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: Omit<RecurringBooking, "id" | "parent_id" | "created_at" | "active" | "next_occurrence">) => {
      if (!user) throw new Error("Sign in first");
      const { error } = await supabase.from("recurring_bookings")
        .insert({ ...input, parent_id: user.id, active: true });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Repeat booking saved", description: "We'll suggest it each week." });
      qc.invalidateQueries({ queryKey: ["recurring-bookings"] });
    },
    onError: (e: any) => toast({ title: "Couldn't save", description: e.message, variant: "destructive" }),
  });
}

export function useToggleRecurring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("recurring_bookings").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring-bookings"] }),
  });
}

export function useDeleteRecurring() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("recurring_bookings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recurring-bookings"] }),
  });
}
