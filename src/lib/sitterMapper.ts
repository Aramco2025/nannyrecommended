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
  // Filterable attributes
  drives: boolean;
  hasOwnCar: boolean;
  swims: boolean;
  cooks: boolean;
  lightHousework: boolean;
  homeworkHelp: boolean;
  nonSmoker: boolean;
  comfortableWithPets: boolean;
  firstAidCertified: boolean;
  policeCleared: boolean;
  newbornExperience: boolean;
  multiplesExperience: boolean;
  senExperience: boolean;
  earlyYearsQualified: boolean;
  teachingQualified: boolean;
  maternityNurse: boolean;
  nightNanny: boolean;
  liveInAvailable: boolean;
  overnightAvailable: boolean;
  schoolPickup: boolean;
  oneOffAvailable: boolean;
  regularAvailable: boolean;
  hasVideoIntro: boolean;
  ageGroups: string[];
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
    tier: (s as any).tier ?? null,
    drives: !!(s as any).drives,
    hasOwnCar: !!(s as any).has_own_car,
    swims: !!(s as any).swims,
    cooks: !!(s as any).cooks,
    lightHousework: !!(s as any).light_housework,
    homeworkHelp: !!(s as any).homework_help,
    nonSmoker: (s as any).non_smoker !== false,
    comfortableWithPets: !!(s as any).comfortable_with_pets,
    firstAidCertified: !!(s as any).first_aid_certified,
    policeCleared: !!(s as any).police_cleared,
    newbornExperience: !!(s as any).newborn_experience,
    multiplesExperience: !!(s as any).multiples_experience,
    senExperience: !!(s as any).sen_experience,
    earlyYearsQualified: !!(s as any).early_years_qualified,
    teachingQualified: !!(s as any).teaching_qualified,
    maternityNurse: !!(s as any).maternity_nurse,
    nightNanny: !!(s as any).night_nanny,
    liveInAvailable: !!(s as any).live_in_available,
    overnightAvailable: !!(s as any).overnight_available,
    schoolPickup: !!(s as any).school_pickup,
    oneOffAvailable: (s as any).one_off_available !== false,
    regularAvailable: (s as any).regular_available !== false,
    hasVideoIntro: !!(s as any).video_intro_url,
    ageGroups: (s as any).age_groups ?? [],
  };
}
