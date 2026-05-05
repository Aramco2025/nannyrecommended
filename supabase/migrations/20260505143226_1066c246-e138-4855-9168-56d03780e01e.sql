
-- Wave A: Auth resilience + notification dedup

CREATE TABLE IF NOT EXISTS public.auth_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_or_phone text,
  method text NOT NULL,
  success boolean NOT NULL DEFAULT false,
  error_code text,
  error_message text,
  user_agent text,
  ip_hint text,
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_attempts_lookup ON public.auth_attempts (email_or_phone, created_at DESC);

ALTER TABLE public.auth_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_attempts_admin_read" ON public.auth_attempts FOR SELECT TO authenticated USING (has_role(auth.uid(),'admin'::app_role));
CREATE POLICY "auth_attempts_anon_insert" ON public.auth_attempts FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "auth_attempts_self_read" ON public.auth_attempts FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.sms_otp_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone text NOT NULL,
  code_hash text NOT NULL,
  attempts smallint NOT NULL DEFAULT 0,
  used boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_sms_otp_phone ON public.sms_otp_codes (phone, created_at DESC);
ALTER TABLE public.sms_otp_codes ENABLE ROW LEVEL SECURITY;
-- service-role only; no anon/authenticated policies → effectively locked. Edge function uses service role.
CREATE POLICY "sms_otp_admin_all" ON public.sms_otp_codes FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  contact_email text,
  contact_phone text,
  category text NOT NULL,
  priority text NOT NULL DEFAULT 'p2',
  subject text NOT NULL,
  body text NOT NULL,
  debug_info jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open',
  assigned_to uuid,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_support_status ON public.support_tickets (status, priority, created_at DESC);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tickets_anon_insert" ON public.support_tickets FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "tickets_self_read" ON public.support_tickets FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "tickets_admin_all" ON public.support_tickets FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER trg_support_tickets_touch BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE IF NOT EXISTS public.sms_unsubscribes (
  phone text PRIMARY KEY,
  unsubscribed_at timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'sms_keyword'
);
ALTER TABLE public.sms_unsubscribes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sms_unsub_admin_all" ON public.sms_unsubscribes FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- Notification preferences
CREATE TABLE IF NOT EXISTS public.notification_prefs (
  user_id uuid PRIMARY KEY,
  push_enabled boolean NOT NULL DEFAULT true,
  email_enabled boolean NOT NULL DEFAULT true,
  sms_enabled boolean NOT NULL DEFAULT true,
  marketing_enabled boolean NOT NULL DEFAULT true,
  quiet_hours_start smallint,
  quiet_hours_end smallint,
  paused_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "np_owner_all" ON public.notification_prefs FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Notification dedup: dedup_key + 30-minute window
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS dedup_key text;
CREATE INDEX IF NOT EXISTS idx_notif_dedup ON public.notifications (user_id, dedup_key, created_at DESC) WHERE dedup_key IS NOT NULL;

CREATE OR REPLACE FUNCTION public.notif_dedup_guard()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.dedup_key IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.notifications
      WHERE user_id = NEW.user_id
        AND dedup_key = NEW.dedup_key
        AND created_at > now() - interval '30 minutes'
    ) THEN
      RETURN NULL; -- silently drop duplicate
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notif_dedup ON public.notifications;
CREATE TRIGGER trg_notif_dedup BEFORE INSERT ON public.notifications FOR EACH ROW EXECUTE FUNCTION public.notif_dedup_guard();
