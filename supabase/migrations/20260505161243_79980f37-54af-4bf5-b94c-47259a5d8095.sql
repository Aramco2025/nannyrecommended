
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS stripe_customer_id text,
  ADD COLUMN IF NOT EXISTS stripe_connect_account_id text,
  ADD COLUMN IF NOT EXISTS stripe_connect_onboarded boolean NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS public.charges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  booking_id uuid,
  stripe_charge_id text,
  stripe_payment_intent_id text,
  stripe_session_id text,
  amount_minor_units bigint NOT NULL,
  currency text NOT NULL DEFAULT 'AED',
  status text NOT NULL,
  payment_method_brand text,
  payment_method_last4 text,
  description text,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_charges_user ON public.charges(user_id);
CREATE INDEX IF NOT EXISTS idx_charges_booking ON public.charges(booking_id);
CREATE UNIQUE INDEX IF NOT EXISTS uq_charges_pi ON public.charges(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
ALTER TABLE public.charges ENABLE ROW LEVEL SECURITY;
CREATE POLICY charges_select_own ON public.charges FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY charges_admin_all ON public.charges FOR ALL TO authenticated USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.refunds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  charge_id uuid NOT NULL REFERENCES public.charges(id) ON DELETE CASCADE,
  stripe_refund_id text NOT NULL UNIQUE,
  amount_minor_units bigint NOT NULL,
  currency text NOT NULL DEFAULT 'AED',
  reason text,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.refunds ENABLE ROW LEVEL SECURITY;
CREATE POLICY refunds_select_own ON public.refunds FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.charges c WHERE c.id = refunds.charge_id AND c.user_id = auth.uid()));
CREATE POLICY refunds_admin_all ON public.refunds FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stripe_subscription_id text NOT NULL UNIQUE,
  stripe_customer_id text NOT NULL,
  plan text NOT NULL,
  price_id text,
  product_id text,
  status text NOT NULL,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean NOT NULL DEFAULT false,
  pause_until timestamptz,
  trial_end timestamptz,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subs_select_own ON public.subscriptions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY subs_admin_all ON public.subscriptions FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  stripe_payment_method_id text NOT NULL UNIQUE,
  brand text,
  last4 text,
  exp_month smallint,
  exp_year smallint,
  is_default boolean NOT NULL DEFAULT false,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_pm_user ON public.payment_methods(user_id);
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
CREATE POLICY pm_select_own ON public.payment_methods FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY pm_delete_own ON public.payment_methods FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY pm_admin_all ON public.payment_methods FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TABLE IF NOT EXISTS public.sitter_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id uuid NOT NULL,
  cash_out_request_id uuid REFERENCES public.cash_out_requests(id) ON DELETE SET NULL,
  stripe_transfer_id text,
  stripe_destination_account text,
  amount_minor_units bigint NOT NULL,
  currency text NOT NULL DEFAULT 'AED',
  status text NOT NULL,
  failure_reason text,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_payouts_sitter ON public.sitter_payouts(sitter_id);
ALTER TABLE public.sitter_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY payouts_select_own ON public.sitter_payouts FOR SELECT TO authenticated USING (auth.uid() = sitter_id);
CREATE POLICY payouts_admin_all ON public.sitter_payouts FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin'::app_role)) WITH CHECK (has_role(auth.uid(),'admin'::app_role));

CREATE TRIGGER trg_charges_updated BEFORE UPDATE ON public.charges
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_subs_updated BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_payouts_updated BEFORE UPDATE ON public.sitter_payouts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;
