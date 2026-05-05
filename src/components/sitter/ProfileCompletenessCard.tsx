import { Link } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

type Sitter = {
  headline?: string | null;
  bio?: string | null;
  area?: string | null;
  photos?: string[] | null;
  hourly_rate_aed?: number | null;
  years_experience?: number | null;
  first_aid_certified?: boolean | null;
  police_cleared?: boolean | null;
  video_intro_url?: string | null;
};

type Item = {
  key: string;
  label: string;
  done: boolean;
  weight: number;
  href: string;
  cta: string;
  hint: string;
};

type Props = { sitter: Sitter | null; hasAvailability?: boolean; hasPayout?: boolean };

/**
 * Profile completeness scorer. Higher-impact items (photo, bio, availability,
 * payout method) are weighted more heavily because they correlate with bookings.
 */
export function ProfileCompletenessCard({ sitter, hasAvailability, hasPayout }: Props) {
  const items: Item[] = [
    {
      key: "photo",
      label: "Add a clear profile photo",
      done: !!sitter?.photos && sitter.photos.length > 0,
      weight: 20,
      href: "/sitter/dashboard",
      cta: "Upload photo",
      hint: "Profiles with photos get 8× more bookings.",
    },
    {
      key: "headline",
      label: "Write a short headline",
      done: !!sitter?.headline && sitter.headline.length > 8,
      weight: 10,
      href: "/sitter/dashboard",
      cta: "Add headline",
      hint: "One line that sums up what you offer.",
    },
    {
      key: "bio",
      label: "Add a bio (80+ characters)",
      done: !!sitter?.bio && sitter.bio.length >= 80,
      weight: 15,
      href: "/sitter/dashboard",
      cta: "Edit bio",
      hint: "Parents skip profiles without one.",
    },
    {
      key: "area",
      label: "Set your area",
      done: !!sitter?.area,
      weight: 5,
      href: "/sitter/dashboard",
      cta: "Set area",
      hint: "Helps families nearby find you.",
    },
    {
      key: "rate",
      label: "Set your hourly rate",
      done: !!sitter?.hourly_rate_aed && sitter.hourly_rate_aed > 0,
      weight: 10,
      href: "/sitter/set-rate",
      cta: "Set rate",
      hint: "You can change it any time.",
    },
    {
      key: "availability",
      label: "Add weekly availability",
      done: !!hasAvailability,
      weight: 15,
      href: "/sitter/availability",
      cta: "Add hours",
      hint: "We only show you for slots you're free.",
    },
    {
      key: "payout",
      label: "Set up a payout method",
      done: !!hasPayout,
      weight: 10,
      href: "/sitter/payment-setup",
      cta: "Set up",
      hint: "So we can pay you after each sit.",
    },
    {
      key: "first_aid",
      label: "Add a paediatric first-aid certificate",
      done: !!sitter?.first_aid_certified,
      weight: 8,
      href: "/sitter/apply/qualifications",
      cta: "Upload",
      hint: "Unlocks the first-aid filter for parents.",
    },
    {
      key: "police",
      label: "Submit police clearance",
      done: !!sitter?.police_cleared,
      weight: 7,
      href: "/sitter/apply/id",
      cta: "Submit",
      hint: "Required for the Verified badge.",
    },
  ];

  const total = items.reduce((s, i) => s + i.weight, 0);
  const earned = items.filter((i) => i.done).reduce((s, i) => s + i.weight, 0);
  const pct = Math.round((earned / total) * 100);

  // Surface the next 3 highest-impact undone items.
  const next = items
    .filter((i) => !i.done)
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  const ringColor =
    pct >= 80 ? "text-success-green" : pct >= 50 ? "text-salmon" : "text-salmon-deep";

  return (
    <section
      aria-label="Profile completeness"
      className="rounded-3xl bg-pure-white p-6 shadow-card"
    >
      <header className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-grey">
            Profile strength
          </span>
          <h2 className="mt-1 font-display text-xl font-bold text-pitch-black">
            {pct}% complete
          </h2>
          <p className="text-xs text-slate-grey">
            {pct >= 100
              ? "Your profile is ready to win bookings."
              : "Stronger profiles get more booking requests."}
          </p>
        </div>
        <Ring pct={pct} className={ringColor} />
      </header>

      {next.length > 0 && (
        <ul className="mt-5 space-y-2">
          {next.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 rounded-2xl border border-cream-deep p-3"
            >
              <div className="flex items-center gap-2.5">
                <Circle className="h-4 w-4 shrink-0 text-dust-grey" />
                <div>
                  <div className="text-sm font-medium text-pitch-black">{item.label}</div>
                  <div className="text-xs text-slate-grey">{item.hint}</div>
                </div>
              </div>
              <Link
                to={item.href}
                className="inline-flex shrink-0 items-center gap-1 rounded-full bg-pitch-black px-3 py-1.5 text-xs font-semibold text-pure-white hover:bg-pitch-black/90"
              >
                {item.cta} <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {next.length === 0 && (
        <div className="mt-5 flex items-center gap-2 rounded-2xl bg-success-green/10 p-3 text-sm text-success-green">
          <CheckCircle2 className="h-4 w-4" />
          Everything is in order — well done.
        </div>
      )}
    </section>
  );
}

function Ring({ pct, className = "" }: { pct: number; className?: string }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} stroke="currentColor" strokeWidth="6" className="text-cream-deep" fill="none" />
        <circle
          cx="32"
          cy="32"
          r={r}
          stroke="currentColor"
          strokeWidth="6"
          className={className}
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center text-xs font-bold tabular-nums text-pitch-black">
        {pct}%
      </span>
    </div>
  );
}
