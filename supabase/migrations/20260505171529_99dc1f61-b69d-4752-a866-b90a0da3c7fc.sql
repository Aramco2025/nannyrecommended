CREATE OR REPLACE FUNCTION public.expire_pending_payment_bookings()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _count integer;
BEGIN
  WITH expired AS (
    UPDATE public.bookings
       SET status = 'cancelled',
           cancelled_at = now(),
           cancelled_by_role = 'system',
           cancel_reason = 'Checkout abandoned'
     WHERE status = 'pending_payment'
       AND created_at < now() - interval '30 minutes'
    RETURNING id
  )
  SELECT count(*) INTO _count FROM expired;
  RETURN _count;
END;
$$;

CREATE EXTENSION IF NOT EXISTS pg_cron;