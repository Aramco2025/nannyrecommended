
CREATE OR REPLACE FUNCTION public.notify_sitters_on_new_job()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _sitter record; _title text; _body text; _link text;
BEGIN
  IF NEW.status <> 'open' THEN RETURN NEW; END IF;
  _title := 'New ' || replace(NEW.type::text, '_', '-') || ' job in ' || COALESCE(NEW.area, 'your area');
  _body := to_char(NEW.start_at, 'Dy DD Mon HH24:MI') || ' · AED ' || NEW.hourly_rate_aed::text || '/hr';
  _link := '/sitter/jobs';
  FOR _sitter IN SELECT user_id FROM public.sitters WHERE is_active = true AND user_id IS NOT NULL AND user_id <> NEW.parent_id LOOP
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (_sitter.user_id, 'job_posted', _title, _body, _link);
  END LOOP;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_sitters_on_new_job ON public.job_posts;
CREATE TRIGGER trg_notify_sitters_on_new_job
AFTER INSERT ON public.job_posts
FOR EACH ROW EXECUTE FUNCTION public.notify_sitters_on_new_job();

CREATE OR REPLACE FUNCTION public.notify_on_job_cancelled()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _app record;
BEGIN
  IF NEW.status = 'cancelled' AND COALESCE(OLD.status::text,'') <> 'cancelled' THEN
    FOR _app IN SELECT sitter_user_id FROM public.job_applications WHERE job_post_id = NEW.id LOOP
      INSERT INTO public.notifications(user_id, type, title, body, link)
      VALUES (_app.sitter_user_id, 'job_cancelled', 'Job cancelled',
        'A parent cancelled a job you applied to.', '/sitter/jobs');
    END LOOP;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_on_job_cancelled ON public.job_posts;
CREATE TRIGGER trg_notify_on_job_cancelled
AFTER UPDATE ON public.job_posts
FOR EACH ROW EXECUTE FUNCTION public.notify_on_job_cancelled();

CREATE OR REPLACE FUNCTION public.notify_on_application_status()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status = 'accepted' AND COALESCE(OLD.status::text,'') <> 'accepted' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.sitter_user_id, 'application_accepted',
      'You''ve been hired! 🎉',
      'The parent selected you. Check your bookings for details.',
      '/account');
  ELSIF NEW.status = 'declined' AND COALESCE(OLD.status::text,'') <> 'declined' THEN
    INSERT INTO public.notifications(user_id, type, title, body, link)
    VALUES (NEW.sitter_user_id, 'application_declined',
      'Application not selected',
      'The parent chose another sitter for this job.',
      '/sitter/jobs');
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_on_application_status ON public.job_applications;
CREATE TRIGGER trg_notify_on_application_status
AFTER UPDATE ON public.job_applications
FOR EACH ROW EXECUTE FUNCTION public.notify_on_application_status();
