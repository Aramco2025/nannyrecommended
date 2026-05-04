
-- Set search_path on remaining functions
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE OR REPLACE FUNCTION public.validate_review_rating()
RETURNS TRIGGER LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END; $$;

-- handle_new_user is only called by the auth trigger; revoke direct execute
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- has_role is used inside RLS policies which run as the invoking role; keep
-- execute for authenticated only (policies need it), revoke from anon/public.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;

REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_review_rating() FROM PUBLIC, anon, authenticated;
