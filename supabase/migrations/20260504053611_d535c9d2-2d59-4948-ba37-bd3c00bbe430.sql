
-- ===== Enums =====
CREATE TYPE public.wallet_tx_type AS ENUM (
  'top_up','booking_payment_in','booking_payment_out','platform_fee',
  'cash_out_request','cash_out_completed','cash_out_cancelled','refund','bonus'
);
CREATE TYPE public.wallet_tx_status AS ENUM ('pending','completed','failed','cancelled');
CREATE TYPE public.cash_out_method AS ENUM ('exchange_house_pickup','bank_transfer','voucher','airtime');
CREATE TYPE public.cash_out_status AS ENUM ('requested','processing','ready_for_pickup','completed','cancelled','failed');

-- ===== Wallets =====
CREATE TABLE public.wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  balance_minor_units bigint NOT NULL DEFAULT 0,
  pending_minor_units bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'AED',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY wallets_select_own ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY wallets_admin_all ON public.wallets FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));
CREATE TRIGGER wallets_touch BEFORE UPDATE ON public.wallets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===== Wallet Transactions (immutable ledger) =====
CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES public.wallets(id) ON DELETE CASCADE,
  type public.wallet_tx_type NOT NULL,
  amount_minor_units bigint NOT NULL,
  currency text NOT NULL DEFAULT 'AED',
  related_booking_id uuid,
  related_cash_out_id uuid,
  status public.wallet_tx_status NOT NULL DEFAULT 'completed',
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_wallet_tx_wallet ON public.wallet_transactions(wallet_id, created_at DESC);
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY wt_select_own ON public.wallet_transactions FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.wallets w WHERE w.id = wallet_id AND w.user_id = auth.uid()));
CREATE POLICY wt_admin_all ON public.wallet_transactions FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- ===== Cash-out Requests =====
CREATE TABLE public.cash_out_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id uuid NOT NULL,
  amount_minor_units bigint NOT NULL CHECK (amount_minor_units > 0),
  currency text NOT NULL DEFAULT 'AED',
  method public.cash_out_method NOT NULL,
  exchange_house text,
  pickup_location_id uuid,
  pickup_reference text,
  bank_iban text,
  bank_account_holder text,
  voucher_provider text,
  airtime_operator text,
  airtime_phone text,
  status public.cash_out_status NOT NULL DEFAULT 'requested',
  requested_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz,
  completed_at timestamptz,
  admin_notes text
);
ALTER TABLE public.cash_out_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY cor_select_own ON public.cash_out_requests FOR SELECT TO authenticated USING (auth.uid() = sitter_id);
CREATE POLICY cor_insert_own ON public.cash_out_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = sitter_id);
CREATE POLICY cor_admin_all ON public.cash_out_requests FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- ===== Pickup Locations =====
CREATE TABLE public.pickup_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  branch_name text NOT NULL,
  address text NOT NULL,
  latitude numeric,
  longitude numeric,
  emirate text,
  hours text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.pickup_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY pl_public_read ON public.pickup_locations FOR SELECT TO anon, authenticated USING (active = true);
CREATE POLICY pl_admin_write ON public.pickup_locations FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

-- ===== Bookings: escrow columns =====
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS escrow_held boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS released_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_method_ref text;

-- ===== Add sitter payment preferences to sitters table =====
ALTER TABLE public.sitters
  ADD COLUMN IF NOT EXISTS preferred_payout_method public.cash_out_method;

-- ===== Add admin role to enum if not present =====
-- (admin already exists in app_role per existing has_role usage)

-- ===== Helper: ensure wallet exists =====
CREATE OR REPLACE FUNCTION public.ensure_wallet(_user uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _id uuid;
BEGIN
  SELECT id INTO _id FROM public.wallets WHERE user_id = _user;
  IF _id IS NULL THEN
    INSERT INTO public.wallets(user_id) VALUES (_user) RETURNING id INTO _id;
  END IF;
  RETURN _id;
END; $$;

-- ===== RPC: credit wallet (used by escrow release, top-ups, refunds) =====
CREATE OR REPLACE FUNCTION public.wallet_credit(
  _user uuid, _amount bigint, _type public.wallet_tx_type,
  _description text, _booking uuid DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _wid uuid; _txid uuid;
BEGIN
  IF _amount <= 0 THEN RAISE EXCEPTION 'amount must be positive'; END IF;
  _wid := public.ensure_wallet(_user);
  UPDATE public.wallets SET balance_minor_units = balance_minor_units + _amount WHERE id = _wid;
  INSERT INTO public.wallet_transactions(wallet_id,type,amount_minor_units,description,related_booking_id,status)
    VALUES (_wid,_type,_amount,_description,_booking,'completed') RETURNING id INTO _txid;
  RETURN _txid;
END; $$;

-- ===== RPC: debit wallet (used by cash-out request) =====
CREATE OR REPLACE FUNCTION public.wallet_debit(
  _user uuid, _amount bigint, _type public.wallet_tx_type,
  _description text, _cash_out uuid DEFAULT NULL
) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _wid uuid; _bal bigint; _txid uuid;
BEGIN
  IF _amount <= 0 THEN RAISE EXCEPTION 'amount must be positive'; END IF;
  _wid := public.ensure_wallet(_user);
  SELECT balance_minor_units INTO _bal FROM public.wallets WHERE id = _wid FOR UPDATE;
  IF _bal < _amount THEN RAISE EXCEPTION 'insufficient balance'; END IF;
  UPDATE public.wallets SET balance_minor_units = balance_minor_units - _amount WHERE id = _wid;
  INSERT INTO public.wallet_transactions(wallet_id,type,amount_minor_units,description,related_cash_out_id,status)
    VALUES (_wid,_type,-_amount,_description,_cash_out,'completed') RETURNING id INTO _txid;
  RETURN _txid;
END; $$;

-- ===== RPC: release booking escrow to sitter =====
CREATE OR REPLACE FUNCTION public.release_booking_escrow(_booking uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _b record; _sitter_user uuid;
BEGIN
  SELECT * INTO _b FROM public.bookings WHERE id = _booking;
  IF _b IS NULL THEN RAISE EXCEPTION 'booking not found'; END IF;
  IF _b.released_at IS NOT NULL THEN RETURN; END IF;
  IF _b.parent_id <> auth.uid() AND NOT has_role(auth.uid(),'admin'::app_role) THEN
    RAISE EXCEPTION 'not authorised';
  END IF;
  SELECT user_id INTO _sitter_user FROM public.sitters WHERE id = _b.sitter_id;
  PERFORM public.wallet_credit(_sitter_user, (_b.sitter_payout_aed * 100)::bigint,
    'booking_payment_in', 'Booking payment released', _booking);
  UPDATE public.bookings SET released_at = now(), status = 'completed', escrow_held = false WHERE id = _booking;
END; $$;

-- ===== Seed pickup locations =====
INSERT INTO public.pickup_locations(provider,branch_name,address,emirate,hours,latitude,longitude) VALUES
('al_ansari','Al Ansari Exchange — Marina Walk','Dubai Marina Walk, Dubai','dubai','Sun-Thu 9am-9pm, Fri 2pm-9pm',25.0795,55.1403),
('al_ansari','Al Ansari Exchange — Mall of the Emirates','Mall of the Emirates, Dubai','dubai','Daily 10am-10pm',25.1181,55.2003),
('al_ansari','Al Ansari Exchange — Deira City Centre','Deira City Centre, Dubai','dubai','Daily 10am-10pm',25.2522,55.3320),
('lulu','Lulu Exchange — Karama','Karama Centre, Dubai','dubai','Daily 9am-10pm',25.2406,55.3047),
('lulu','Lulu Exchange — Al Wahda','Al Wahda Mall, Abu Dhabi','abu_dhabi','Daily 10am-10pm',24.4708,54.3742),
('uae_exchange','UAE Exchange — Sharjah City Centre','City Centre Sharjah','sharjah','Daily 10am-10pm',25.3260,55.4730);
