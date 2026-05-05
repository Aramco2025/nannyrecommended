import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Dispute = {
  id: string;
  booking_id: string;
  parent_id: string;
  sitter_id: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: string;
  resolution_note: string | null;
  refund_amount_aed: number | null;
  created_at: string;
  resolved_at: string | null;
};

export function useBookingDispute(bookingId?: string | null) {
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!bookingId) { setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("disputes")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    setDispute((data ?? null) as Dispute | null);
    setLoading(false);
  }, [bookingId]);

  useEffect(() => { reload(); }, [reload]);

  return { dispute, loading, reload };
}

export async function createDispute(input: {
  booking_id: string;
  parent_id: string;
  sitter_id: string;
  reason: string;
  description: string;
  evidence_urls?: string[];
}) {
  const { data, error } = await supabase
    .from("disputes")
    .insert({
      booking_id: input.booking_id,
      parent_id: input.parent_id,
      sitter_id: input.sitter_id,
      reason: input.reason,
      description: input.description,
      evidence_urls: input.evidence_urls ?? [],
    })
    .select("*")
    .single();
  if (error) throw error;
  return data as Dispute;
}
