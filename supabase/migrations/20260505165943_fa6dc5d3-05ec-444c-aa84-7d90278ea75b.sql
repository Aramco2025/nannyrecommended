ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_family_plus boolean NOT NULL DEFAULT false;

CREATE OR REPLACE FUNCTION public.has_active_subscription(user_uuid uuid, check_env text DEFAULT 'sandbox')
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid
      AND environment = check_env
      AND status IN ('active','trialing','past_due')
      AND cancel_at_period_end = false
  );
$$;