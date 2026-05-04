CREATE TABLE public.favourites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid NOT NULL,
  sitter_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (parent_id, sitter_id)
);
CREATE INDEX idx_favourites_parent ON public.favourites(parent_id);
CREATE INDEX idx_favourites_sitter ON public.favourites(sitter_id);
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
CREATE POLICY favourites_owner_all ON public.favourites
  FOR ALL TO authenticated
  USING (auth.uid() = parent_id) WITH CHECK (auth.uid() = parent_id);

CREATE TYPE public.friend_status AS ENUM ('pending','accepted');
CREATE TABLE public.friend_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid NOT NULL,
  recipient_id uuid NOT NULL,
  status public.friend_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (requester_id, recipient_id),
  CHECK (requester_id <> recipient_id)
);
CREATE INDEX idx_friend_requester ON public.friend_connections(requester_id);
CREATE INDEX idx_friend_recipient ON public.friend_connections(recipient_id);
ALTER TABLE public.friend_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY friend_select_participant ON public.friend_connections
  FOR SELECT TO authenticated USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY friend_insert_self ON public.friend_connections
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = requester_id);
CREATE POLICY friend_update_participant ON public.friend_connections
  FOR UPDATE TO authenticated USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY friend_delete_participant ON public.friend_connections
  FOR DELETE TO authenticated USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE TRIGGER trg_friend_touch BEFORE UPDATE ON public.friend_connections
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.sitter_friend_trust_count(_sitter uuid, _viewer uuid)
RETURNS integer LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COUNT(DISTINCT f.parent_id)::int
  FROM public.favourites f
  WHERE f.sitter_id = _sitter
    AND f.parent_id IN (
      SELECT CASE WHEN fc.requester_id = _viewer THEN fc.recipient_id ELSE fc.requester_id END
      FROM public.friend_connections fc
      WHERE fc.status = 'accepted' AND (fc.requester_id = _viewer OR fc.recipient_id = _viewer)
    );
$$;

ALTER TABLE public.sitters
  ADD COLUMN IF NOT EXISTS latitude numeric,
  ADD COLUMN IF NOT EXISTS longitude numeric;