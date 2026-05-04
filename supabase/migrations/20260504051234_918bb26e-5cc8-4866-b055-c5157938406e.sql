
-- =========================
-- ENUMS
-- =========================
CREATE TYPE public.app_role AS ENUM ('parent', 'sitter', 'admin');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'declined');
CREATE TYPE public.loyalty_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE public.network_badge AS ENUM ('none', 'trusted', 'premium', 'elite');

-- =========================
-- PROFILES
-- =========================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =========================
-- USER ROLES
-- =========================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =========================
-- SITTERS
-- =========================
CREATE TABLE public.sitters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  headline TEXT,
  bio TEXT,
  area TEXT,
  hourly_rate_aed NUMERIC(8,2) NOT NULL DEFAULT 60,
  years_experience INTEGER NOT NULL DEFAULT 0,
  languages TEXT[] NOT NULL DEFAULT ARRAY['English']::TEXT[],
  network_badge public.network_badge NOT NULL DEFAULT 'none',
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  photos TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.sitters ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_sitters_area ON public.sitters(area);
CREATE INDEX idx_sitters_active_verified ON public.sitters(is_active, verified);

-- =========================
-- AVAILABILITY
-- =========================
CREATE TABLE public.availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sitter_id UUID NOT NULL REFERENCES public.sitters(id) ON DELETE CASCADE,
  day_of_week SMALLINT NOT NULL, -- 0=Sun..6=Sat
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;

-- =========================
-- BOOKINGS
-- =========================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sitter_id UUID NOT NULL REFERENCES public.sitters(id) ON DELETE RESTRICT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  hours NUMERIC(5,2) NOT NULL,
  hourly_rate_aed NUMERIC(8,2) NOT NULL,
  subtotal_aed NUMERIC(10,2) NOT NULL,
  platform_fee_aed NUMERIC(10,2) NOT NULL,
  sitter_payout_aed NUMERIC(10,2) NOT NULL,
  total_aed NUMERIC(10,2) NOT NULL,
  status public.booking_status NOT NULL DEFAULT 'pending',
  address TEXT,
  notes TEXT,
  stripe_session_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_bookings_parent ON public.bookings(parent_id);
CREATE INDEX idx_bookings_sitter ON public.bookings(sitter_id);

-- =========================
-- REVIEWS
-- =========================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  parent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sitter_id UUID NOT NULL REFERENCES public.sitters(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Validation trigger for rating range (1..5)
CREATE OR REPLACE FUNCTION public.validate_review_rating()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.rating < 1 OR NEW.rating > 5 THEN
    RAISE EXCEPTION 'rating must be between 1 and 5';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER trg_validate_review_rating
BEFORE INSERT OR UPDATE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.validate_review_rating();

-- =========================
-- LOYALTY
-- =========================
CREATE TABLE public.loyalty (
  parent_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  completed_bookings INTEGER NOT NULL DEFAULT 0,
  tier public.loyalty_tier NOT NULL DEFAULT 'bronze',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.loyalty ENABLE ROW LEVEL SECURITY;

-- =========================
-- MESSAGES
-- =========================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE INDEX idx_messages_booking ON public.messages(booking_id);

-- =========================
-- AUTO-CREATE PROFILE + DEFAULT ROLE ON SIGNUP
-- =========================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role public.app_role;
BEGIN
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );

  -- Role from signup metadata; default to 'parent'
  _role := COALESCE((NEW.raw_user_meta_data->>'role')::public.app_role, 'parent');
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, _role);

  -- Initialize loyalty for parents
  IF _role = 'parent' THEN
    INSERT INTO public.loyalty (parent_id) VALUES (NEW.id)
    ON CONFLICT (parent_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================
-- updated_at helpers
-- =========================
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_sitters_updated BEFORE UPDATE ON public.sitters
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- =========================
-- RLS POLICIES
-- =========================

-- profiles: user can see/update own; everyone can read basic profile of verified sitters via join is fine, but keep restricted here
CREATE POLICY "profiles_select_own" ON public.profiles
FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles
FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles
FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
-- Public can read profile name/avatar of sitters (needed to show name on sitter cards)
CREATE POLICY "profiles_public_read_sitters" ON public.profiles
FOR SELECT TO anon, authenticated
USING (EXISTS (SELECT 1 FROM public.sitters s WHERE s.user_id = profiles.id AND s.is_active));

-- user_roles: user can read own roles; only admins can modify
CREATE POLICY "user_roles_select_own" ON public.user_roles
FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_roles_admin_all" ON public.user_roles
FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- sitters: anyone can view active+verified; owner can manage own
CREATE POLICY "sitters_public_read" ON public.sitters
FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "sitters_insert_own" ON public.sitters
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "sitters_update_own" ON public.sitters
FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "sitters_delete_own" ON public.sitters
FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- availability: public read, owner write
CREATE POLICY "availability_public_read" ON public.availability
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "availability_owner_all" ON public.availability
FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = availability.sitter_id AND s.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = availability.sitter_id AND s.user_id = auth.uid()));

-- bookings: parent sees own; sitter sees bookings on their listing
CREATE POLICY "bookings_parent_select" ON public.bookings
FOR SELECT TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "bookings_sitter_select" ON public.bookings
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = bookings.sitter_id AND s.user_id = auth.uid()));
CREATE POLICY "bookings_parent_insert" ON public.bookings
FOR INSERT TO authenticated WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "bookings_parent_update" ON public.bookings
FOR UPDATE TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "bookings_sitter_update" ON public.bookings
FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM public.sitters s WHERE s.id = bookings.sitter_id AND s.user_id = auth.uid()));

-- reviews: public read; parent writes for their own completed bookings
CREATE POLICY "reviews_public_read" ON public.reviews
FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "reviews_parent_insert" ON public.reviews
FOR INSERT TO authenticated WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "reviews_parent_update" ON public.reviews
FOR UPDATE TO authenticated USING (auth.uid() = parent_id);

-- loyalty: parent reads/updates own
CREATE POLICY "loyalty_select_own" ON public.loyalty
FOR SELECT TO authenticated USING (auth.uid() = parent_id);
CREATE POLICY "loyalty_insert_own" ON public.loyalty
FOR INSERT TO authenticated WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "loyalty_update_own" ON public.loyalty
FOR UPDATE TO authenticated USING (auth.uid() = parent_id);

-- messages: only participants of the booking
CREATE POLICY "messages_participants_select" ON public.messages
FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.bookings b
    LEFT JOIN public.sitters s ON s.id = b.sitter_id
    WHERE b.id = messages.booking_id
      AND (b.parent_id = auth.uid() OR s.user_id = auth.uid())
  )
);
CREATE POLICY "messages_participants_insert" ON public.messages
FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM public.bookings b
    LEFT JOIN public.sitters s ON s.id = b.sitter_id
    WHERE b.id = messages.booking_id
      AND (b.parent_id = auth.uid() OR s.user_id = auth.uid())
  )
);
