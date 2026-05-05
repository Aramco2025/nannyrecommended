CREATE TABLE public.area_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  area text NOT NULL,
  full_name text,
  email text,
  phone text,
  user_id uuid,
  notes text,
  requested_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX area_waitlist_area_idx ON public.area_waitlist (area);

ALTER TABLE public.area_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can add to waitlist"
  ON public.area_waitlist FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view waitlist"
  ON public.area_waitlist FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own waitlist entry"
  ON public.area_waitlist FOR SELECT
  USING (auth.uid() IS NOT NULL AND user_id = auth.uid());