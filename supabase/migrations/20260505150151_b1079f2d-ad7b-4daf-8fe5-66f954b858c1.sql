ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS cancelled_at timestamptz,
  ADD COLUMN IF NOT EXISTS cancelled_by_role text,
  ADD COLUMN IF NOT EXISTS cancel_reason text,
  ADD COLUMN IF NOT EXISTS cancel_fee_aed numeric(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS refund_aed numeric(10,2) DEFAULT 0;

CREATE OR REPLACE FUNCTION public.cancel_booking(_booking uuid, _reason text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _b record;
  _uid uuid := auth.uid();
  _is_parent boolean;
  _is_sitter boolean;
  _hours_to_start numeric;
  _fee numeric := 0;
  _refund numeric := 0;
  _other_user uuid;
  _role text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'must be signed in'; END IF;
  SELECT * INTO _b FROM public.bookings WHERE id = _booking FOR UPDATE;
  IF _b IS NULL THEN RAISE EXCEPTION 'booking not found'; END IF;
  IF _b.status IN ('cancelled','completed','declined') THEN
    RAISE EXCEPTION 'booking already %', _b.status;
  END IF;

  _is_parent := (_b.parent_id = _uid);
  SELECT (s.user_id = _uid) INTO _is_sitter FROM public.sitters s WHERE s.id = _b.sitter_id;
  IF NOT (_is_parent OR COALESCE(_is_sitter,false)) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;

  _hours_to_start := EXTRACT(EPOCH FROM (_b.start_at - now())) / 3600;
  _role := CASE WHEN _is_parent THEN 'parent' ELSE 'sitter' END;

  IF _is_parent THEN
    -- Asymmetric, transparent parent policy:
    -- > 24h: free cancel, full refund
    -- 6–24h: 25% fee
    -- < 6h: 50% fee
    -- in-progress: no refund
    IF _b.status = 'in_progress' THEN
      _fee := _b.total_aed; _refund := 0;
    ELSIF _hours_to_start >= 24 THEN
      _fee := 0; _refund := _b.total_aed;
    ELSIF _hours_to_start >= 6 THEN
      _fee := round(_b.total_aed * 0.25, 2);
      _refund := _b.total_aed - _fee;
    ELSE
      _fee := round(_b.total_aed * 0.50, 2);
      _refund := _b.total_aed - _fee;
    END IF;
  ELSE
    -- Sitter cancels: parent always gets full refund. Reliability penalty handled separately.
    _fee := 0;
    _refund := _b.total_aed;
  END IF;

  UPDATE public.bookings
  SET status = 'cancelled',
      cancelled_at = now(),
      cancelled_by_role = _role,
      cancel_reason = left(coalesce(_reason,''), 500),
      cancel_fee_aed = _fee,
      refund_aed = _refund,
      escrow_held = false
  WHERE id = _booking;

  -- Refund placeholder: credit parent wallet for the refundable portion.
  -- (Real Stripe refund is wired in the edge function path.)
  IF _refund > 0 AND _b.escrow_held THEN
    PERFORM public.wallet_credit(_b.parent_id, (_refund * 100)::bigint,
      'refund'::wallet_tx_type, 'Booking cancellation refund', _booking);
  END IF;

  -- Notify the other party
  IF _is_parent THEN
    SELECT user_id INTO _other_user FROM public.sitters WHERE id = _b.sitter_id;
    IF _other_user IS NOT NULL THEN
      INSERT INTO public.notifications(user_id, type, title, body, link, dedup_key)
      VALUES (_other_user, 'booking_cancelled', 'Booking cancelled by parent',
        'A parent cancelled their booking with you.', '/bookings/' || _booking,
        'cancel:' || _booking);
    END IF;
  ELSE
    INSERT INTO public.notifications(user_id, type, title, body, link, dedup_key)
    VALUES (_b.parent_id, 'booking_cancelled_by_sitter', 'Sitter cancelled — full refund',
      'Your sitter cancelled. We''re refunding in full and have suggestions ready.',
      '/bookings/' || _booking, 'cancel:' || _booking);
  END IF;

  RETURN jsonb_build_object('cancel_fee', _fee, 'refund', _refund, 'role', _role);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.cancel_booking(uuid, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.cancel_booking(uuid, text) TO authenticated;