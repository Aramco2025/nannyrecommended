-- Surcharges on sitters (all default 0; AED minor not used here — just AED whole numbers like base rate)
ALTER TABLE public.sitters
  ADD COLUMN IF NOT EXISTS evening_surcharge_aed numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS late_night_surcharge_aed numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS weekend_surcharge_aed numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS holiday_surcharge_aed numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS multi_child_surcharge_aed numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_minute_surcharge_aed numeric NOT NULL DEFAULT 0;

-- Taxi-home cover on bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS taxi_requested boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS taxi_cover_aed numeric NOT NULL DEFAULT 0;

-- Job-post deadline: parent must decide by this time; auto-cancel after
ALTER TABLE public.job_posts
  ADD COLUMN IF NOT EXISTS decision_deadline_at timestamptz;

-- Backfill: default 48h from creation for any open posts that lack a deadline
UPDATE public.job_posts
   SET decision_deadline_at = created_at + interval '48 hours'
 WHERE decision_deadline_at IS NULL AND status = 'open';

-- Trigger: cap job applications at 8 per post
CREATE OR REPLACE FUNCTION public.enforce_application_cap()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _count int;
BEGIN
  SELECT COUNT(*) INTO _count
    FROM public.job_applications
   WHERE job_post_id = NEW.job_post_id
     AND status IN ('pending','submitted');
  IF _count >= 8 THEN
    RAISE EXCEPTION 'Applications closed — this job already has 8 sitters waiting.';
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_enforce_application_cap ON public.job_applications;
CREATE TRIGGER trg_enforce_application_cap
BEFORE INSERT ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.enforce_application_cap();

-- Function to expire stale open job posts (run by cron)
CREATE OR REPLACE FUNCTION public.expire_stale_job_posts()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE _n int;
BEGIN
  WITH expired AS (
    UPDATE public.job_posts
       SET status = 'cancelled', updated_at = now()
     WHERE status = 'open'
       AND decision_deadline_at IS NOT NULL
       AND decision_deadline_at < now()
    RETURNING id
  ),
  rejected_apps AS (
    UPDATE public.job_applications ja
       SET status = 'declined', updated_at = now()
      FROM expired e
     WHERE ja.job_post_id = e.id
       AND ja.status IN ('pending','submitted')
    RETURNING ja.id
  )
  SELECT count(*) INTO _n FROM expired;
  RETURN _n;
END $$;

-- Rewrite new-job notification trigger to respect prefs
CREATE OR REPLACE FUNCTION public.notify_sitters_on_new_job()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _sitter record;
  _title text;
  _body  text;
  _link  text := '/sitter/jobs';
BEGIN
  IF NEW.status <> 'open' THEN RETURN NEW; END IF;
  _title := 'New ' || replace(NEW.type::text, '_', '-') || ' job in ' || COALESCE(NEW.area, 'your area');
  _body  := to_char(NEW.start_at, 'Dy DD Mon HH24:MI') || ' · AED ' || NEW.hourly_rate_aed::text || '/hr';

  FOR _sitter IN
    SELECT s.user_id
      FROM public.sitters s
     WHERE s.is_active
       AND s.user_id IS NOT NULL
       AND s.user_id <> NEW.parent_id
       -- Respect mute on this job type, if a row exists
       AND NOT EXISTS (
         SELECT 1 FROM public.sitter_notification_prefs snp
          WHERE snp.sitter_user_id = s.user_id
            AND snp.job_type = NEW.type
            AND snp.muted = true
       )
       -- Respect overnight / school-pickup capability when relevant
       AND (NEW.type::text <> 'overnight' OR s.overnight_available)
       AND (NEW.type::text <> 'school_pickup' OR s.school_pickup)
       -- Respect global notification prefs (paused / push off)
       AND NOT EXISTS (
         SELECT 1 FROM public.notification_prefs np
          WHERE np.user_id = s.user_id
            AND (
              (np.paused_until IS NOT NULL AND np.paused_until > now())
              OR np.push_enabled = false
            )
       )
  LOOP
    INSERT INTO public.notifications(user_id, type, title, body, link, dedup_key)
    VALUES (_sitter.user_id, 'job_posted', _title, _body, _link, 'job:' || NEW.id);
  END LOOP;

  RETURN NEW;
END $$;

-- Make sure trigger is attached
DROP TRIGGER IF EXISTS trg_notify_sitters_on_new_job ON public.job_posts;
CREATE TRIGGER trg_notify_sitters_on_new_job
AFTER INSERT ON public.job_posts
FOR EACH ROW EXECUTE FUNCTION public.notify_sitters_on_new_job();