ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS data_export_requested_at timestamptz;

CREATE TABLE IF NOT EXISTS public.data_export_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  requested_at timestamptz NOT NULL DEFAULT now(),
  fulfilled_at timestamptz,
  status text NOT NULL DEFAULT 'queued'
);

ALTER TABLE public.data_export_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users insert their own export requests"
  ON public.data_export_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view their own export requests"
  ON public.data_export_requests FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update export requests"
  ON public.data_export_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX IF NOT EXISTS idx_data_export_requests_user ON public.data_export_requests(user_id, requested_at DESC);