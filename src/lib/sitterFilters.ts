import type { UISitter } from "@/lib/sitterMapper";

export type FilterKey =
  | "oneOff" | "regular" | "liveIn" | "overnight" | "schoolPickup"
  | "newborn" | "multiples" | "sen" | "earlyYears" | "teaching" | "maternity" | "night"
  | "dogWalker" | "petSitter" | "petBoarding"
  | "firstAid" | "policeCleared"
  | "drives" | "ownCar" | "swims" | "cooks" | "housework" | "homework" | "nonSmoker" | "pets"
  | "verified" | "videoIntro" | "recommended"
  | "ageNewborn" | "ageToddler" | "ageSchool" | "ageTween";

export type LangKey = "English" | "Arabic" | "French" | "Tagalog" | "Hindi" | "Urdu" | "Russian" | "Spanish" | "Mandarin";

export const LANGUAGES: LangKey[] = ["English", "Arabic", "French", "Tagalog", "Hindi", "Urdu", "Russian", "Spanish", "Mandarin"];

export type SitterFilters = {
  flags: Set<FilterKey>;
  languages: Set<LangKey>;
  minExperience: number; // years
  minRating: number; // 0..5
  minBookings: number;
};

export const emptyFilters = (): SitterFilters => ({
  flags: new Set(),
  languages: new Set(),
  minExperience: 0,
  minRating: 0,
  minBookings: 0,
});

export function applyFilters(sitters: UISitter[], f: SitterFilters, priceRange: [number, number]): UISitter[] {
  return sitters.filter(s => {
    if (s.hourlyRate < priceRange[0] || s.hourlyRate > priceRange[1]) return false;
    if (s.yearsExperience < f.minExperience) return false;
    if (s.rating < f.minRating) return false;
    if (s.bookingsCompleted < f.minBookings) return false;

    // Languages: sitter must speak ALL selected
    for (const l of f.languages) if (!s.languages.includes(l)) return false;

    const has = (k: FilterKey) => f.flags.has(k);

    if (has("oneOff") && !s.oneOffAvailable) return false;
    if (has("regular") && !s.regularAvailable) return false;
    if (has("liveIn") && !s.liveInAvailable) return false;
    if (has("overnight") && !s.overnightAvailable) return false;
    if (has("schoolPickup") && !s.schoolPickup) return false;

    if (has("newborn") && !s.newbornExperience) return false;
    if (has("multiples") && !s.multiplesExperience) return false;
    if (has("sen") && !s.senExperience) return false;
    if (has("earlyYears") && !s.earlyYearsQualified) return false;
    if (has("teaching") && !s.teachingQualified) return false;
    if (has("maternity") && !s.maternityNurse) return false;
    if (has("night") && !s.nightNanny) return false;
    if (has("dogWalker") && !s.dogWalker) return false;
    if (has("petSitter") && !s.petSitter) return false;
    if (has("petBoarding") && !s.petBoarding) return false;

    if (has("firstAid") && !s.firstAidCertified) return false;
    if (has("policeCleared") && !s.policeCleared) return false;

    if (has("drives") && !s.drives) return false;
    if (has("ownCar") && !s.hasOwnCar) return false;
    if (has("swims") && !s.swims) return false;
    if (has("cooks") && !s.cooks) return false;
    if (has("housework") && !s.lightHousework) return false;
    if (has("homework") && !s.homeworkHelp) return false;
    if (has("nonSmoker") && !s.nonSmoker) return false;
    if (has("pets") && !s.comfortableWithPets) return false;

    if (has("verified") && !s.verified) return false;
    if (has("videoIntro") && !s.hasVideoIntro) return false;
    if (has("recommended") && s.networkBadge === "none") return false;

    const ageChecks: [FilterKey, string][] = [
      ["ageNewborn", "0-1"], ["ageToddler", "2-4"], ["ageSchool", "5-10"], ["ageTween", "11+"],
    ];
    for (const [k, group] of ageChecks) {
      if (has(k) && !s.ageGroups.includes(group)) return false;
    }

    return true;
  });
}
