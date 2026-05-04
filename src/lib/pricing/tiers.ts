export type SitterTier = "helper" | "sitter" | "nanny" | "senior_nanny" | "specialist";

export interface PricingTier {
  id: SitterTier;
  name: string;
  shortDescription: string;
  monthlyFullTimeRange: [number, number];
  hourlyBabysittingRange: [number, number];
  typicalProfile: string;
  badgeClass: string; // tailwind classes for badge bg/text
  examples: string[];
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "helper",
    name: "Helper",
    shortDescription: "Daytime babysitting, basic care",
    monthlyFullTimeRange: [2000, 2750],
    hourlyBabysittingRange: [35, 50],
    typicalProfile: "Less than 2 years experience, no formal qualifications",
    badgeClass: "bg-slate-grey/10 text-slate-grey border-slate-grey/20",
    examples: [
      "Watching kids during the day while parents work from home",
      "Light supervision, snack prep, school pickup",
    ],
  },
  {
    id: "sitter",
    name: "Sitter",
    shortDescription: "Evening and weekend babysitting",
    monthlyFullTimeRange: [2750, 3500],
    hourlyBabysittingRange: [50, 70],
    typicalProfile: "2-5 years experience, references, basic first aid",
    badgeClass: "bg-success-green/10 text-success-green border-success-green/20",
    examples: [
      "Date night sits with bedtime routine",
      "Weekend sits with engaged play and meals",
    ],
  },
  {
    id: "nanny",
    name: "Nanny",
    shortDescription: "Experienced, with qualifications",
    monthlyFullTimeRange: [3500, 5000],
    hourlyBabysittingRange: [70, 100],
    typicalProfile: "5+ years experience, certified first aid, English-speaking",
    badgeClass: "bg-salmon/15 text-salmon-deep border-salmon/30",
    examples: [
      "Full childcare days with structured activities",
      "Multi-child care, school runs, homework help",
    ],
  },
  {
    id: "senior_nanny",
    name: "Senior Nanny",
    shortDescription: "Highly qualified, multilingual",
    monthlyFullTimeRange: [5000, 6500],
    hourlyBabysittingRange: [100, 140],
    typicalProfile: "Norland/Montessori trained, special needs experience, multilingual",
    badgeClass: "bg-salmon-deep/15 text-salmon-deep border-salmon-deep/30",
    examples: [
      "Newborn care with sleep training",
      "Educational childcare for early-years development",
    ],
  },
  {
    id: "specialist",
    name: "Specialist",
    shortDescription: "Maternity, special needs, elite",
    monthlyFullTimeRange: [6500, 10000],
    hourlyBabysittingRange: [140, 200],
    typicalProfile: "Maternity nurse, sleep consultant, special needs specialist",
    badgeClass: "bg-pitch-black text-pure-white border-pitch-black",
    examples: [
      "Postpartum night nursing for newborns",
      "Autism-specific or medical-need care",
    ],
  },
];

export const ABSOLUTE_MIN_HOURLY = 30;
export const ABSOLUTE_MAX_HOURLY = 350;

export function tierFromHourlyRate(rate: number): SitterTier {
  if (rate < 50) return "helper";
  if (rate < 70) return "sitter";
  if (rate < 100) return "nanny";
  if (rate < 140) return "senior_nanny";
  return "specialist";
}

export function getTier(id: SitterTier): PricingTier {
  return PRICING_TIERS.find((t) => t.id === id)!;
}

export function getRateGuidance(hourlyAed: number): {
  tier: SitterTier;
  message: string;
  warning: string | null;
} {
  if (hourlyAed < 30) {
    return {
      tier: "helper",
      message: "",
      warning: "We don't list rates below AED 30/hr — this protects sitters from being undervalued.",
    };
  }
  if (hourlyAed < 35) {
    return { tier: "helper", message: "Below our recommended floor. Consider AED 35-50 to attract first bookings.", warning: null };
  }
  if (hourlyAed < 50) {
    return { tier: "helper", message: "Starter rate — most new sitters begin here. Strong reviews can move you up quickly.", warning: null };
  }
  if (hourlyAed < 70) {
    return { tier: "sitter", message: "Solid evening sitter rate. Typical for 2-5 years experience with references and basic first aid.", warning: null };
  }
  if (hourlyAed < 100) {
    return { tier: "nanny", message: "Nanny tier — make sure your profile shows qualifications, references, and English fluency.", warning: null };
  }
  if (hourlyAed < 140) {
    return { tier: "senior_nanny", message: "Senior tier — multiple references, formal training (Norland, Montessori), or special-needs experience expected.", warning: null };
  }
  if (hourlyAed <= 200) {
    return { tier: "specialist", message: "Specialist tier — newborn care, sleep consulting, special needs, or maternity nursing.", warning: null };
  }
  if (hourlyAed <= 350) {
    return { tier: "specialist", message: "Premium pricing. Expect fewer bookings but higher quality matches. Consider AED 150-200 for steadier work.", warning: null };
  }
  return { tier: "specialist", message: "", warning: "Maximum rate is AED 350/hr." };
}

// Babysitting hourly ≈ 2x full-time hourly equivalent (live-out 200 hrs/mo)
export const FULL_TIME_HOURS_PER_MONTH_LIVE_OUT = 200;
export const FULL_TIME_HOURS_PER_MONTH_LIVE_IN = 240;
export const BABYSITTING_PREMIUM_MULTIPLIER = 2;

export function monthlyFromHourly(hourly: number, hoursPerMonth = 80): number {
  return Math.round(hourly * hoursPerMonth);
}
export function hourlyFromMonthly(monthly: number, hoursPerMonth = FULL_TIME_HOURS_PER_MONTH_LIVE_OUT): number {
  return Math.round(monthly / hoursPerMonth);
}
