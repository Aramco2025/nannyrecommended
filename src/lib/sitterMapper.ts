import type { Tables } from "@/integrations/supabase/types";

type DbSitter = Tables<"sitters"> & { profiles?: { full_name: string | null; avatar_url: string | null } | null };

export type UISitter = {
  id: string;
  name: string;
  photo: string;
  hourlyRate: number;
  currency: "AED";
  area: string;
  rating: number;
  bookingsCompleted: number;
  verified: boolean;
  networkBadge: "none" | "trusted" | "premium" | "elite";
  bio: string;
  yearsExperience: number;
  languages: string[];
  headline: string;
  tier: string | null;
};

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=600&fit=crop";

export function mapSitter(s: DbSitter): UISitter {
  return {
    id: s.id,
    name: s.full_name ?? s.profiles?.full_name ?? "Sitter",
    photo: (s.photos?.[0]) || s.profiles?.avatar_url || FALLBACK_PHOTO,
    hourlyRate: Number(s.hourly_rate_aed),
    currency: "AED",
    area: s.area ?? "Dubai",
    rating: Number(s.rating ?? 0),
    bookingsCompleted: s.bookings_completed ?? 0,
    verified: !!s.verified,
    networkBadge: (s.network_badge as UISitter["networkBadge"]) ?? "none",
    bio: s.bio ?? "",
    yearsExperience: s.years_experience ?? 0,
    languages: s.languages ?? ["English"],
    headline: s.headline ?? "",
  };
}
