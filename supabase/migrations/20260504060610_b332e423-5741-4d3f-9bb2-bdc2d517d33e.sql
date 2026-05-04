-- Add tier and work-preference columns to sitters
ALTER TABLE public.sitters
  ADD COLUMN IF NOT EXISTS tier text,
  ADD COLUMN IF NOT EXISTS monthly_full_time_aed integer,
  ADD COLUMN IF NOT EXISTS open_to_full_time boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS open_to_babysitting boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS rate_last_updated timestamptz NOT NULL DEFAULT now();

-- Bound the existing numeric hourly_rate_aed within platform floor/cap
ALTER TABLE public.sitters DROP CONSTRAINT IF EXISTS sitters_hourly_rate_check;
ALTER TABLE public.sitters
  ADD CONSTRAINT sitters_hourly_rate_check
  CHECK (hourly_rate_aed IS NULL OR (hourly_rate_aed >= 30 AND hourly_rate_aed <= 350));

-- Helper: derive tier from hourly rate
CREATE OR REPLACE FUNCTION public.tier_from_hourly_rate(rate numeric)
RETURNS text LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE
    WHEN rate IS NULL THEN NULL
    WHEN rate < 50 THEN 'helper'
    WHEN rate < 70 THEN 'sitter'
    WHEN rate < 100 THEN 'nanny'
    WHEN rate < 140 THEN 'senior_nanny'
    ELSE 'specialist'
  END
$$;

-- Auto-update tier + rate_last_updated when rate changes
CREATE OR REPLACE FUNCTION public.set_tier_on_rate_change()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.hourly_rate_aed IS NOT NULL THEN
    NEW.tier := public.tier_from_hourly_rate(NEW.hourly_rate_aed);
    NEW.rate_last_updated := now();
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS sitters_tier_sync ON public.sitters;
CREATE TRIGGER sitters_tier_sync
  BEFORE INSERT OR UPDATE OF hourly_rate_aed ON public.sitters
  FOR EACH ROW EXECUTE FUNCTION public.set_tier_on_rate_change();

-- Backfill tier for existing sitters
UPDATE public.sitters SET tier = public.tier_from_hourly_rate(hourly_rate_aed) WHERE tier IS NULL;
