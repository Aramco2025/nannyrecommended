ALTER TABLE public.sitters
  ADD COLUMN IF NOT EXISTS dog_walker boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pet_sitter boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS pet_boarding boolean NOT NULL DEFAULT false;