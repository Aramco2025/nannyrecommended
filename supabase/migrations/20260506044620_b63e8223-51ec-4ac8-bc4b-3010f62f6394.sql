-- Activity & responsiveness signals on sitters
ALTER TABLE public.sitters
  ADD COLUMN IF NOT EXISTS last_active_at timestamptz,
  ADD COLUMN IF NOT EXISTS avg_response_minutes integer;

-- Helper: recompute avg response time from messages where the sitter replied to a parent
CREATE OR REPLACE FUNCTION public.recompute_sitter_response_time(_sitter_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _sitter_id uuid;
  _avg_min integer;
BEGIN
  SELECT id INTO _sitter_id FROM public.sitters WHERE user_id = _sitter_user_id LIMIT 1;
  IF _sitter_id IS NULL THEN RETURN; END IF;

  WITH ordered AS (
    SELECT m.booking_id, m.sender_id, m.created_at,
           LAG(m.sender_id) OVER (PARTITION BY m.booking_id ORDER BY m.created_at) AS prev_sender,
           LAG(m.created_at) OVER (PARTITION BY m.booking_id ORDER BY m.created_at) AS prev_at
    FROM public.messages m
    WHERE m.booking_id IN (
      SELECT b.id FROM public.bookings b WHERE b.sitter_id = _sitter_id
    )
  ),
  replies AS (
    SELECT EXTRACT(EPOCH FROM (created_at - prev_at)) / 60.0 AS minutes
    FROM ordered
    WHERE sender_id = _sitter_user_id
      AND prev_sender IS NOT NULL
      AND prev_sender <> _sitter_user_id
      AND created_at - prev_at < interval '48 hours'
  )
  SELECT ROUND(AVG(minutes))::int INTO _avg_min FROM replies;

  UPDATE public.sitters
  SET avg_response_minutes = _avg_min,
      last_active_at = COALESCE(last_active_at, now())
  WHERE id = _sitter_id;
END;
$$;

-- Trigger: bump sitter activity + recompute response when they send a message
CREATE OR REPLACE FUNCTION public.on_message_inserted_bump_sitter()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Mark sitter active if the sender is a sitter
  UPDATE public.sitters
  SET last_active_at = NEW.created_at
  WHERE user_id = NEW.sender_id;

  -- Async recompute (cheap; small datasets per sitter)
  PERFORM public.recompute_sitter_response_time(NEW.sender_id);
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_messages_bump_sitter ON public.messages;
CREATE TRIGGER trg_messages_bump_sitter
AFTER INSERT ON public.messages
FOR EACH ROW EXECUTE FUNCTION public.on_message_inserted_bump_sitter();

-- Self-callable RPC so the client can ping presence on app load
CREATE OR REPLACE FUNCTION public.touch_sitter_activity()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.sitters SET last_active_at = now() WHERE user_id = auth.uid();
$$;