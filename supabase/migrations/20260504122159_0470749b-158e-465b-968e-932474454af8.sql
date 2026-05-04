-- Batch A: onboarding spine
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS region text,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS active_role public.app_role,
  ADD COLUMN IF NOT EXISTS address_line text,
  ADD COLUMN IF NOT EXISTS care_needs text[] NOT NULL DEFAULT '{}'::text[];

-- Children table for "My Family"
CREATE TABLE IF NOT EXISTS public.children (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  name text NOT NULL,
  dob date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS children_owner_all ON public.children;
CREATE POLICY children_owner_all ON public.children
  FOR ALL TO authenticated
  USING (auth.uid() = parent_id)
  WITH CHECK (auth.uid() = parent_id);

DROP TRIGGER IF EXISTS children_touch_updated_at ON public.children;
CREATE TRIGGER children_touch_updated_at
  BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Sitter applications (Batch B will use it; create now so types are ready)
CREATE TABLE IF NOT EXISTS public.sitter_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_user_id uuid NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'draft',
  eligibility jsonb NOT NULL DEFAULT '{}'::jsonb,
  experience jsonb NOT NULL DEFAULT '{}'::jsonb,
  qualifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  references_data jsonb NOT NULL DEFAULT '[]'::jsonb,
  id_doc_url text,
  video_url text,
  bio text,
  submitted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.sitter_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS sa_owner_all ON public.sitter_applications;
CREATE POLICY sa_owner_all ON public.sitter_applications
  FOR ALL TO authenticated
  USING (auth.uid() = sitter_user_id)
  WITH CHECK (auth.uid() = sitter_user_id);

DROP POLICY IF EXISTS sa_admin_all ON public.sitter_applications;
CREATE POLICY sa_admin_all ON public.sitter_applications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(),'admin'::public.app_role));

DROP TRIGGER IF EXISTS sa_touch_updated_at ON public.sitter_applications;
CREATE TRIGGER sa_touch_updated_at
  BEFORE UPDATE ON public.sitter_applications
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();