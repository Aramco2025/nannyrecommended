
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum
    WHERE enumlabel = 'pending_payment'
      AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'booking_status')
  ) THEN
    ALTER TYPE public.booking_status ADD VALUE 'pending_payment' BEFORE 'pending';
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session
  ON public.bookings(stripe_session_id)
  WHERE stripe_session_id IS NOT NULL;
