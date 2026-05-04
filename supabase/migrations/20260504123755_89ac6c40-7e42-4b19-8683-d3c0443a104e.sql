-- Notifications table for in-app messages
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "notif_select_own" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "notif_update_own" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "notif_admin_all" ON public.notifications
  FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- System inserts via SECURITY DEFINER triggers; allow service role implicitly.
-- Trigger: notify sitter on application status changes
CREATE OR REPLACE FUNCTION public.notify_sitter_application_status()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Submitted (draft -> submitted, or first insert as submitted)
  IF (TG_OP = 'INSERT' AND NEW.status = 'submitted')
     OR (TG_OP = 'UPDATE' AND NEW.status = 'submitted' AND COALESCE(OLD.status,'') <> 'submitted') THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.sitter_user_id, 'sitter_application_submitted',
      'Application received',
      'Thanks! We''ll review your application within 2-3 business days.',
      '/sitter/apply/pending');
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status = 'approved' AND COALESCE(OLD.status,'') <> 'approved' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.sitter_user_id, 'sitter_application_approved',
      'You''re approved! 🎉',
      'Welcome aboard. Set your rate and availability to start getting jobs.',
      '/sitter/dashboard');
  END IF;

  IF TG_OP = 'UPDATE' AND NEW.status = 'rejected' AND COALESCE(OLD.status,'') <> 'rejected' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.sitter_user_id, 'sitter_application_rejected',
      'Application not approved',
      'Unfortunately we can''t approve your application at this time. Check your email for details.',
      '/sitter/apply/pending');
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_sitter_application_status
AFTER INSERT OR UPDATE OF status ON public.sitter_applications
FOR EACH ROW EXECUTE FUNCTION public.notify_sitter_application_status();

-- Realtime
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sitter_applications;