import type { UISitter } from "@/lib/sitterMapper";

export type SortKey = "best" | "rating" | "priceLow" | "priceHigh" | "experience" | "active";

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "best", label: "Best match" },
  { key: "rating", label: "Top rated" },
  { key: "priceLow", label: "Lowest price" },
  { key: "priceHigh", label: "Highest price" },
  { key: "experience", label: "Most experienced" },
  { key: "active", label: "Most active" },
];

// Composite "best match" score — higher is better.
// Blends rating, completed bookings, recency of activity, response speed,
// trust signals (verified, network badge, video intro), and a slight
// affordability bias.
export function bestMatchScore(s: UISitter): number {
  let score = 0;
  score += (s.rating ?? 0) * 18;                      // 0–90
  score += Math.min(s.bookingsCompleted ?? 0, 50) * 0.6; // 0–30
  score += Math.min(s.yearsExperience ?? 0, 15) * 1.2;   // 0–18

  if (s.lastActiveAt) {
    const hours = (Date.now() - new Date(s.lastActiveAt).getTime()) / 3_600_000;
    if (hours < 1) score += 15;
    else if (hours < 24) score += 10;
    else if (hours < 48) score += 5;
  }

  if (s.avgResponseMinutes != null && s.avgResponseMinutes > 0) {
    if (s.avgResponseMinutes < 15) score += 12;
    else if (s.avgResponseMinutes < 60) score += 8;
    else if (s.avgResponseMinutes < 240) score += 4;
  }

  if (s.verified) score += 8;
  if (s.hasVideoIntro) score += 4;
  if (s.firstAidCertified) score += 3;
  if (s.policeCleared) score += 3;

  switch (s.networkBadge) {
    case "elite": score += 10; break;
    case "premium": score += 6; break;
    case "trusted": score += 3; break;
  }

  // Mild affordability nudge — cheaper sitters get a small boost
  score += Math.max(0, (200 - s.hourlyRate) / 40); // up to ~4

  return score;
}

export function sortSitters(sitters: UISitter[], sort: SortKey): UISitter[] {
  const arr = [...sitters];
  switch (sort) {
    case "rating":
      return arr.sort((a, b) =>
        (b.rating - a.rating) || (b.bookingsCompleted - a.bookingsCompleted)
      );
    case "priceLow":
      return arr.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "priceHigh":
      return arr.sort((a, b) => b.hourlyRate - a.hourlyRate);
    case "experience":
      return arr.sort((a, b) => b.yearsExperience - a.yearsExperience);
    case "active":
      return arr.sort((a, b) => {
        const at = a.lastActiveAt ? new Date(a.lastActiveAt).getTime() : 0;
        const bt = b.lastActiveAt ? new Date(b.lastActiveAt).getTime() : 0;
        return bt - at;
      });
    case "best":
    default:
      return arr.sort((a, b) => bestMatchScore(b) - bestMatchScore(a));
  }
}
