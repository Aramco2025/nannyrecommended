
REVOKE EXECUTE ON FUNCTION public.wallet_credit(uuid,bigint,public.wallet_tx_type,text,uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.wallet_debit(uuid,bigint,public.wallet_tx_type,text,uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.ensure_wallet(uuid) FROM PUBLIC, anon, authenticated;

-- Atomic cash-out request: debits wallet + inserts request in one call.
CREATE OR REPLACE FUNCTION public.request_cash_out(
  _amount bigint,
  _method public.cash_out_method,
  _exchange_house text DEFAULT NULL,
  _pickup_location_id uuid DEFAULT NULL,
  _bank_iban text DEFAULT NULL,
  _bank_account_holder text DEFAULT NULL,
  _voucher_provider text DEFAULT NULL,
  _airtime_operator text DEFAULT NULL,
  _airtime_phone text DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _cor uuid; _pickup_ref text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'must be signed in'; END IF;
  IF _amount <= 0 THEN RAISE EXCEPTION 'amount must be positive'; END IF;
  IF _amount > 500000 THEN RAISE EXCEPTION 'amount exceeds AED 5,000 per-request limit'; END IF;

  IF _method = 'exchange_house_pickup' THEN
    _pickup_ref := lpad(floor(random()*1000000)::text, 6, '0');
  END IF;

  INSERT INTO public.cash_out_requests(
    sitter_id, amount_minor_units, method, exchange_house, pickup_location_id,
    pickup_reference, bank_iban, bank_account_holder, voucher_provider,
    airtime_operator, airtime_phone, status
  ) VALUES (
    _uid, _amount, _method, _exchange_house, _pickup_location_id,
    _pickup_ref, _bank_iban, _bank_account_holder, _voucher_provider,
    _airtime_operator, _airtime_phone, 'requested'
  ) RETURNING id INTO _cor;

  PERFORM public.wallet_debit(_uid, _amount, 'cash_out_request',
    'Cash-out via ' || _method::text, _cor);

  RETURN _cor;
END; $$;

-- Booking escrow on creation: parent commits funds to platform
CREATE OR REPLACE FUNCTION public.create_booking_escrow(_booking uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _b record;
BEGIN
  SELECT * INTO _b FROM public.bookings WHERE id = _booking;
  IF _b IS NULL THEN RAISE EXCEPTION 'booking not found'; END IF;
  IF _b.parent_id <> auth.uid() THEN RAISE EXCEPTION 'not authorised'; END IF;
  UPDATE public.bookings SET escrow_held = true, paid_at = now() WHERE id = _booking;
END; $$;
