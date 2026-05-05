import { Star, BadgeCheck } from "lucide-react";
import type { SitterReview } from "@/hooks/useSitterReviews";

type Props = {
  reviews: SitterReview[];
  fallbackRating?: number;
  fallbackBookings?: number;
};

/**
 * Aggregate trust panel built from REAL reviews.
 * Falls back gracefully for new sitters with no reviews yet, instead
 * of showing fake stars.
 */
export function ReviewsSummary({ reviews, fallbackRating = 0, fallbackBookings = 0 }: Props) {
  const count = reviews.length;
  const avg =
    count > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / count
      : fallbackRating;

  // Histogram 5 → 1
  const buckets = [5, 4, 3, 2, 1].map((n) => ({
    n,
    pct: count === 0 ? 0 : (reviews.filter((r) => r.rating === n).length / count) * 100,
  }));

  if (count === 0) {
    return (
      <div className="rounded-3xl bg-pure-white p-6 shadow-card">
        <h2 className="font-display text-lg font-bold text-pitch-black">Reviews</h2>
        <p className="mt-2 text-sm text-slate-grey">
          No reviews yet — be the first family to book and share feedback.
        </p>
        {fallbackBookings > 0 && (
          <p className="mt-1 text-xs text-slate-grey">
            {fallbackBookings} completed booking{fallbackBookings === 1 ? "" : "s"} so far.
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-3xl bg-pure-white p-6 shadow-card">
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="text-center">
          <div className="font-display text-5xl font-black text-pitch-black">{avg.toFixed(1)}</div>
          <div className="mt-1 flex justify-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`h-4 w-4 ${
                  n <= Math.round(avg) ? "fill-salmon text-salmon" : "text-cream-deep"
                }`}
              />
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-grey">
            {count} verified review{count === 1 ? "" : "s"}
          </p>
        </div>

        <ul className="space-y-1.5">
          {buckets.map((b) => (
            <li key={b.n} className="flex items-center gap-2 text-xs text-slate-grey">
              <span className="w-3 tabular-nums">{b.n}</span>
              <Star className="h-3 w-3 fill-salmon text-salmon" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-deep">
                <div
                  className="h-full rounded-full bg-salmon"
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <span className="w-8 text-right tabular-nums">{Math.round(b.pct)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-medium text-success-green">
        <BadgeCheck className="h-3.5 w-3.5" /> Every review is from a confirmed booking
      </p>
    </div>
  );
}
