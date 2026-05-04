import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useMyThreads() {
  return useQuery({
    queryKey: ["my_threads"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("id, start_at, status, parent_id, sitter_id, sitters(full_name, photos)")
        .order("start_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useThreadMessages(bookingId: string | undefined) {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("messages").select("*").eq("booking_id", bookingId).order("created_at", { ascending: true });
      if (!cancelled) {
        setMessages(data ?? []);
        setLoading(false);
      }
    })();
    const ch = supabase
      .channel(`messages_${bookingId}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `booking_id=eq.${bookingId}` },
        (payload) => setMessages(m => [...m, payload.new]))
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [bookingId]);

  return { messages, loading };
}

export async function sendMessage(bookingId: string, body: string) {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) throw new Error("Sign in");
  const { error } = await supabase.from("messages").insert({
    booking_id: bookingId, sender_id: u.user.id, body,
  });
  if (error) throw error;
}
