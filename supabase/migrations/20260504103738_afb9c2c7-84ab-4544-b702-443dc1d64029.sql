
-- Enums
CREATE TYPE public.job_type AS ENUM ('one_off', 'repeat', 'permanent');
CREATE TYPE public.job_status AS ENUM ('open', 'filled', 'cancelled');
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'declined', 'withdrawn');

-- job_posts
CREATE TABLE public.job_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  type public.job_type NOT NULL,
  start_at timestamptz NOT NULL,
  end_at timestamptz NOT NULL,
  area text,
  hourly_rate_aed numeric NOT NULL,
  notes text,
  status public.job_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.job_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_posts_read_open" ON public.job_posts
  FOR SELECT TO authenticated USING (status = 'open' OR parent_id = auth.uid());
CREATE POLICY "job_posts_parent_insert" ON public.job_posts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "job_posts_parent_update" ON public.job_posts
  FOR UPDATE TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "job_posts_parent_delete" ON public.job_posts
  FOR DELETE TO authenticated USING (auth.uid() = parent_id);

CREATE TRIGGER job_posts_touch BEFORE UPDATE ON public.job_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- job_applications
CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_post_id uuid NOT NULL REFERENCES public.job_posts(id) ON DELETE CASCADE,
  sitter_user_id uuid NOT NULL,
  message text,
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_post_id, sitter_user_id)
);
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "job_apps_read_participants" ON public.job_applications
  FOR SELECT TO authenticated USING (
    sitter_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.job_posts jp WHERE jp.id = job_post_id AND jp.parent_id = auth.uid())
  );
CREATE POLICY "job_apps_sitter_insert" ON public.job_applications
  FOR INSERT TO authenticated WITH CHECK (sitter_user_id = auth.uid());
CREATE POLICY "job_apps_sitter_update" ON public.job_applications
  FOR UPDATE TO authenticated USING (
    sitter_user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.job_posts jp WHERE jp.id = job_post_id AND jp.parent_id = auth.uid())
  );

CREATE TRIGGER job_apps_touch BEFORE UPDATE ON public.job_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- sitter_notification_prefs
CREATE TABLE public.sitter_notification_prefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_user_id uuid NOT NULL,
  job_type public.job_type NOT NULL,
  radius_km integer NOT NULL DEFAULT 5,
  muted boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (sitter_user_id, job_type)
);
ALTER TABLE public.sitter_notification_prefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "snp_owner_all" ON public.sitter_notification_prefs
  FOR ALL TO authenticated
  USING (sitter_user_id = auth.uid())
  WITH CHECK (sitter_user_id = auth.uid());

CREATE TRIGGER snp_touch BEFORE UPDATE ON public.sitter_notification_prefs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- availability override
ALTER TABLE public.availability ADD COLUMN specific_date date NULL;

-- Instant booking RPC
CREATE OR REPLACE FUNCTION public.create_instant_booking(
  _sitter_id uuid,
  _start_at timestamptz,
  _hours numeric,
  _address text DEFAULT NULL,
  _notes text DEFAULT NULL
) RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _parent uuid := auth.uid();
  _end timestamptz;
  _rate numeric;
  _subtotal numeric;
  _fee numeric;
  _payout numeric;
  _total numeric;
  _booking uuid;
  _has_window boolean;
  _has_clash boolean;
  _dow smallint;
  _start_t time;
  _end_t time;
BEGIN
  IF _parent IS NULL THEN RAISE EXCEPTION 'must be signed in'; END IF;
  IF _hours <= 0 OR _hours > 24 THEN RAISE EXCEPTION 'invalid hours'; END IF;

  SELECT hourly_rate_aed INTO _rate FROM public.sitters WHERE id = _sitter_id AND is_active = true;
  IF _rate IS NULL THEN RAISE EXCEPTION 'sitter not available'; END IF;

  _end := _start_at + (_hours || ' hours')::interval;
  _dow := EXTRACT(DOW FROM _start_at)::smallint;
  _start_t := _start_at::time;
  _end_t := _end::time;

  -- Must fall inside an availability window (specific date OR weekly)
  SELECT EXISTS (
    SELECT 1 FROM public.availability a
    WHERE a.sitter_id = _sitter_id
      AND (
        (a.specific_date IS NOT NULL AND a.specific_date = _start_at::date)
        OR (a.specific_date IS NULL AND a.day_of_week = _dow)
      )
      AND a.start_time <= _start_t
      AND a.end_time >= _end_t
  ) INTO _has_window;
  IF NOT _has_window THEN RAISE EXCEPTION 'sitter not available at that time'; END IF;

  -- No clash with existing bookings
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.sitter_id = _sitter_id
      AND b.status IN ('pending','confirmed')
      AND tstzrange(b.start_at, b.end_at, '[)') && tstzrange(_start_at, _end, '[)')
  ) INTO _has_clash;
  IF _has_clash THEN RAISE EXCEPTION 'time slot already booked'; END IF;

  _subtotal := _rate * _hours;
  _fee := round(_subtotal * 0.08, 2);
  _payout := round(_subtotal * 0.96, 2);
  _total := _subtotal + _fee;

  INSERT INTO public.bookings (
    parent_id, sitter_id, start_at, end_at, hours, hourly_rate_aed,
    subtotal_aed, platform_fee_aed, sitter_payout_aed, total_aed,
    address, notes, status, escrow_held, paid_at
  ) VALUES (
    _parent, _sitter_id, _start_at, _end, _hours, _rate,
    _subtotal, _fee, _payout, _total,
    _address, _notes, 'confirmed', true, now()
  ) RETURNING id INTO _booking;

  RETURN _booking;
END $$;

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.job_applications;
