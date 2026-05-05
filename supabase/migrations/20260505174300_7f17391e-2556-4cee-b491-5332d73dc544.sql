-- R-C: recurring bookings, saved searches, referrals
-- 1. Recurring bookings template
CREATE TABLE IF NOT EXISTS public.recurring_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  sitter_id uuid NOT NULL,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  hours numeric NOT NULL CHECK (hours > 0 AND hours <= 24),
  address text,
  notes text,
  children_ids uuid[] NOT NULL DEFAULT '{}',
  active boolean NOT NULL DEFAULT true,
  next_occurrence date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.recurring_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rb_parent_all" ON public.recurring_bookings FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "rb_sitter_read" ON public.recurring_bookings FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = recurring_bookings.sitter_id AND s.user_id = auth.uid()));
CREATE TRIGGER trg_rb_touch BEFORE UPDATE ON public.recurring_bookings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. Saved searches
CREATE TABLE IF NOT EXISTS public.saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  filters jsonb NOT NULL DEFAULT '{}'::jsonb,
  alerts_enabled boolean NOT NULL DEFAULT true,
  last_alerted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ss_owner_all" ON public.saved_searches FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_ss_touch BEFORE UPDATE ON public.saved_searches
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 3. Referrals
CREATE TABLE IF NOT EXISTS public.referral_codes (
  user_id uuid PRIMARY KEY,
  code text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rc_owner_read" ON public.referral_codes FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "rc_public_lookup" ON public.referral_codes FOR SELECT TO anon, authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL,
  referred_user_id uuid NOT NULL UNIQUE,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'signed_up',
  reward_aed numeric NOT NULL DEFAULT 50,
  rewarded_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ref_referrer_read" ON public.referrals FOR SELECT TO authenticated
  USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

-- Generate code function
CREATE OR REPLACE FUNCTION public.ensure_referral_code(_user uuid)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _code text;
BEGIN
  SELECT code INTO _code FROM public.referral_codes WHERE user_id = _user;
  IF _code IS NOT NULL THEN RETURN _code; END IF;
  LOOP
    _code := upper(substr(md5(random()::text || _user::text || clock_timestamp()::text), 1, 6));
    EXIT WHEN NOT EXISTS (SELECT 1 FROM public.referral_codes WHERE code = _code);
  END LOOP;
  INSERT INTO public.referral_codes(user_id, code) VALUES (_user, _code);
  RETURN _code;
END $$;

-- Apply referral on booking completion
CREATE OR REPLACE FUNCTION public.reward_referral_on_booking()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _ref record;
BEGIN
  IF NEW.status = 'completed' AND COALESCE(OLD.status::text,'') <> 'completed' THEN
    SELECT * INTO _ref FROM public.referrals
      WHERE referred_user_id = NEW.parent_id AND status = 'signed_up' LIMIT 1;
    IF _ref.id IS NOT NULL THEN
      PERFORM public.wallet_credit(_ref.referrer_id, (_ref.reward_aed*100)::bigint,
        'referral_credit'::wallet_tx_type, 'Referral reward', NEW.id);
      PERFORM public.wallet_credit(NEW.parent_id, (_ref.reward_aed*100)::bigint,
        'referral_credit'::wallet_tx_type, 'Welcome credit', NEW.id);
      UPDATE public.referrals SET status = 'rewarded', rewarded_at = now() WHERE id = _ref.id;
    END IF;
  END IF;
  RETURN NEW;
END $$;

-- Add wallet_tx_type if missing
DO $$ BEGIN
  ALTER TYPE wallet_tx_type ADD VALUE IF NOT EXISTS 'referral_credit';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TRIGGER trg_reward_referral
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.reward_referral_on_booking();