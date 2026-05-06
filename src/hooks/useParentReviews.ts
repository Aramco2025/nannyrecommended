import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useParentReview(bookingId: string | undefined) {
  const [review, setReview] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    if (!bookingId) { setReview(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await (supabase as any)
      .from("parent_reviews").select("*").eq("booking_id", bookingId).maybeSingle();
    setReview(data ?? null);
    setLoading(false);
  };

  useEffect(() => { reload(); /* eslint-disable-line */ }, [bookingId]);

  return { review, loading, reload };
}

export async function submitParentReview(input: {
  bookingId: string; sitterId: string; parentId: string; rating: number; comment: string;
}) {
  const { error } = await (supabase as any).from("parent_reviews").insert({
    booking_id: input.bookingId,
    sitter_id: input.sitterId,
    parent_id: input.parentId,
    rating: input.rating,
    comment: input.comment || null,
  });
  if (error) throw error;
}

export function useParentReviewsForParent(parentId: string | undefined) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!parentId) { setReviews([]); setLoading(false); return; }
    setLoading(true);
    (supabase as any).from("parent_reviews")
      .select("*").eq("parent_id", parentId).order("created_at", { ascending: false })
      .then(({ data }: any) => { setReviews(data ?? []); setLoading(false); });
  }, [parentId]);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  return { reviews, loading, avg, count: reviews.length };
}
