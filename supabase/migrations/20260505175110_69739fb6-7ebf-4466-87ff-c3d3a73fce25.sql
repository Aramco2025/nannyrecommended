ALTER TABLE public.charges ADD COLUMN IF NOT EXISTS receipt_url text;

CREATE TABLE IF NOT EXISTS public.disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  parent_id uuid NOT NULL,
  sitter_id uuid NOT NULL,
  reason text NOT NULL,
  description text NOT NULL,
  evidence_urls text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'open',
  resolution_note text,
  refund_amount_aed numeric(10,2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_disputes_booking ON public.disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_parent ON public.disputes(parent_id);
CREATE INDEX IF NOT EXISTS idx_disputes_sitter ON public.disputes(sitter_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "disputes_parent_insert" ON public.disputes;
CREATE POLICY "disputes_parent_insert" ON public.disputes
  FOR INSERT TO authenticated
  WITH CHECK (
    parent_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.bookings b
      WHERE b.id = booking_id AND b.parent_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "disputes_select_party" ON public.disputes;
CREATE POLICY "disputes_select_party" ON public.disputes
  FOR SELECT TO authenticated
  USING (
    parent_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = sitter_id AND s.user_id = auth.uid())
    OR public.has_role(auth.uid(), 'admin'::app_role)
  );

DROP POLICY IF EXISTS "disputes_admin_all" ON public.disputes;
CREATE POLICY "disputes_admin_all" ON public.disputes
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE OR REPLACE FUNCTION public.set_disputes_updated_at()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

DROP TRIGGER IF EXISTS trg_disputes_updated_at ON public.disputes;
CREATE TRIGGER trg_disputes_updated_at
  BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION public.set_disputes_updated_at();