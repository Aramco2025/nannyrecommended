type Props = { completedBookings?: number; className?: string };

const tiers = [
  { range: "1–4", label: "8% fee", min: 0 },
  { range: "5–19", label: "4% fee", min: 5 },
  { range: "20+", label: "2% fee", min: 20 },
];

export function LoyaltyProgress({ completedBookings = 0, className = "" }: Props) {
  const activeIdx = completedBookings >= 20 ? 2 : completedBookings >= 5 ? 1 : 0;

  return (
    <div className={className}>
      <div className="flex items-center">
        {tiers.map((t, i) => {
          const isActive = i <= activeIdx;
          return (
            <div key={t.range} className="flex flex-1 items-center">
              <div className="flex flex-col items-center text-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                    isActive ? "bg-salmon text-primary-foreground shadow-cta" : "bg-muted text-slate-grey"
                  }`}
                >
                  {i + 1}
                </div>
                <div className="mt-2 text-xs font-medium text-pitch-black">{t.label}</div>
                <div className="text-[11px] text-slate-grey">Bookings {t.range}</div>
              </div>
              {i < tiers.length - 1 && (
                <div className={`mx-2 h-0.5 flex-1 ${i < activeIdx ? "bg-salmon" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
