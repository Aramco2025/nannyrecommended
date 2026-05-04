import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export type FriendConnection = {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: "pending" | "accepted";
  other_id: string;
  other_name: string | null;
  other_avatar: string | null;
  iAmRequester: boolean;
};

export function useFriends() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["friends", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<FriendConnection[]> => {
      const { data, error } = await supabase
        .from("friend_connections")
        .select("*")
        .or(`requester_id.eq.${user!.id},recipient_id.eq.${user!.id}`)
        .order("created_at", { ascending: false });
      if (error) throw error;

      const others = (data ?? []).map(r => r.requester_id === user!.id ? r.recipient_id : r.requester_id);
      const profiles = others.length
        ? (await supabase.from("profiles").select("id, full_name, avatar_url").in("id", others)).data ?? []
        : [];
      const pmap = new Map(profiles.map(p => [p.id, p]));
      return (data ?? []).map(r => {
        const other = r.requester_id === user!.id ? r.recipient_id : r.requester_id;
        const p = pmap.get(other);
        return {
          id: r.id,
          requester_id: r.requester_id,
          recipient_id: r.recipient_id,
          status: r.status as "pending" | "accepted",
          other_id: other,
          other_name: p?.full_name ?? null,
          other_avatar: p?.avatar_url ?? null,
          iAmRequester: r.requester_id === user!.id,
        };
      });
    },
  });
}

export function useSendFriendRequest() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipientEmail: string) => {
      if (!user) throw new Error("Sign in first");
      // Find recipient by exact email match via profiles join — fallback: cannot read other emails, so search by name.
      // Simpler: ask user for the friend's user id via a shareable code. For MVP we look up by full_name.
      const { data: matches, error: e1 } = await supabase
        .from("profiles")
        .select("id, full_name")
        .ilike("full_name", recipientEmail.trim());
      if (e1) throw e1;
      if (!matches?.length) throw new Error("No parent found with that name");
      const recipient = matches[0];
      if (recipient.id === user.id) throw new Error("That's you!");
      const { error } = await supabase
        .from("friend_connections")
        .insert({ requester_id: user.id, recipient_id: recipient.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Friend request sent" });
      qc.invalidateQueries({ queryKey: ["friends"] });
    },
    onError: (e: any) => toast({ title: "Couldn't send request", description: e.message, variant: "destructive" }),
  });
}

export function useRespondFriendRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, accept }: { id: string; accept: boolean }) => {
      if (accept) {
        const { error } = await supabase.from("friend_connections").update({ status: "accepted" }).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("friend_connections").delete().eq("id", id);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["friends"] }),
  });
}

export function useTrustCount(sitterId: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["trust-count", sitterId, user?.id],
    enabled: !!user && !!sitterId,
    queryFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc("sitter_friend_trust_count", {
        _sitter: sitterId, _viewer: user!.id,
      });
      if (error) throw error;
      return data ?? 0;
    },
  });
}
