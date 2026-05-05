ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS children_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pets jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS parking text;

ALTER TABLE public.job_posts
  ADD COLUMN IF NOT EXISTS children_ids uuid[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS pets jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS parking text;