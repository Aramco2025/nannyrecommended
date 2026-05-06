
-- Sitter → parent reviews
CREATE TABLE public.parent_reviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL,
  sitter_id uuid NOT NULL,
  parent_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (booking_id)
);

ALTER TABLE public.parent_reviews ENABLE ROW LEVEL SECURITY;

-- Public read so parents can see their own rating history; participants only could leak data.
-- Restrict reads to the parent themselves and the sitter that wrote it + admins.
CREATE POLICY "pr_select_party" ON public.parent_reviews
  FOR SELECT TO authenticated
  USING (
    auth.uid() = parent_id
    OR EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = parent_reviews.sitter_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin'::public.app_role)
  );

CREATE POLICY "pr_sitter_insert" ON public.parent_reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.sitters s
       JOIN public.bookings b ON b.sitter_id = s.id
       WHERE s.id = parent_reviews.sitter_id
         AND s.user_id = auth.uid()
         AND b.id = parent_reviews.booking_id
         AND b.parent_id = parent_reviews.parent_id
    )
  );

CREATE POLICY "pr_sitter_update" ON public.parent_reviews
  FOR UPDATE TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = parent_reviews.sitter_id AND s.user_id = auth.uid())
  );

CREATE INDEX idx_parent_reviews_parent ON public.parent_reviews(parent_id);
CREATE INDEX idx_parent_reviews_sitter ON public.parent_reviews(sitter_id);

-- Referral leaderboard view (anonymized, current month)
CREATE OR REPLACE VIEW public.referral_leaderboard_monthly
WITH (security_invoker = true) AS
SELECT
  r.referrer_id,
  COALESCE(NULLIF(LEFT(p.full_name, 1), ''), '?') AS initial,
  COUNT(*)::int AS referrals_count,
  COALESCE(SUM(r.reward_aed), 0)::numeric AS total_reward_aed
FROM public.referrals r
LEFT JOIN public.profiles p ON p.id = r.referrer_id
WHERE r.created_at >= date_trunc('month', now())
GROUP BY r.referrer_id, p.full_name
ORDER BY referrals_count DESC, total_reward_aed DESC
LIMIT 20;

GRANT SELECT ON public.referral_leaderboard_monthly TO anon, authenticated;
