import { useMemo, useState } from "react";
import { UISitter } from "@/lib/sitterMapper";
import { SitterCard } from "@/components/SitterCard";
import { MapPin, X } from "lucide-react";

export function SittersMapView({ sitters }: { sitters: UISitter[] }) {
  const [activeArea, setActiveArea] = useState<string | null>(null);

  const groups = useMemo(() => {
    const m = new Map<string, UISitter[]>();
    for (const s of sitters) {
      const k = s.area || "Unknown";
      if (!m.has(k)) m.set(k, []);
      m.get(k)!.push(s);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [sitters]);

  const activeSitters = activeArea ? sitters.filter(s => (s.area || "Unknown") === activeArea) : [];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="relative min-h-[480px] overflow-hidden rounded-2xl border border-cream-deep bg-gradient-to-br from-cream via-pure-white to-cream-deep p-6 shadow-card lg:min-h-[640px]">
        {/* Decorative grid pattern */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative h-full">
          <h3 className="font-display text-lg font-bold text-pitch-black">UAE coverage map</h3>
          <p className="text-xs text-slate-grey">Tap an area to see sitters</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {groups.map(([area, list]) => {
              const active = activeArea === area;
              const size = Math.min(40 + list.length * 6, 96);
              return (
                <button
                  key={area}
                  onClick={() => setActiveArea(active ? null : area)}
                  className={`group flex flex-col items-center gap-1 rounded-2xl p-3 transition ${
                    active ? "bg-pitch-black text-pure-white" : "bg-pure-white/80 text-pitch-black hover:bg-pure-white"
                  }`}
                  style={{ minWidth: 110 }}
                >
                  <span
                    className={`grid place-items-center rounded-full font-display font-bold transition ${
                      active ? "bg-salmon text-pure-white" : "bg-salmon-soft/60 text-salmon-deep group-hover:bg-salmon-soft"
                    }`}
                    style={{ width: size, height: size, fontSize: size * 0.4 }}
                  >
                    {list.length}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold">
                    <MapPin className="h-3 w-3" /> {area}
                  </span>
                </button>
              );
            })}
            {groups.length === 0 && (
              <p className="text-sm text-slate-grey">No sitters match your filters.</p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 lg:max-h-[640px] lg:overflow-y-auto lg:pr-1">
        {activeArea && (
          <div className="flex items-center justify-between rounded-full bg-pitch-black px-4 py-2 text-sm text-pure-white">
            <span>{activeSitters.length} in {activeArea}</span>
            <button onClick={() => setActiveArea(null)} className="inline-flex items-center gap-1 text-xs">
              <X className="h-3 w-3" /> Clear
            </button>
          </div>
        )}
        {(activeArea ? activeSitters : sitters).map(s => <SitterCard key={s.id} sitter={s} />)}
      </div>
    </div>
  );
}
