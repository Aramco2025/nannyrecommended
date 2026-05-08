import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronLeft, X } from "lucide-react";
import {
  emptyFilters,
  FilterKey,
  LANGUAGES,
  LangKey,
  SitterFilters,
} from "@/lib/sitterFilters";
import { PRICING_TIERS, SitterTier } from "@/lib/pricing/tiers";

const SECTIONS: { title: string; items: { key: FilterKey; label: string }[] }[] = [
  {
    title: "Availability",
    items: [
      { key: "oneOff", label: "One-off bookings" },
      { key: "regular", label: "Regular bookings" },
      { key: "liveIn", label: "Live-in available" },
      { key: "overnight", label: "Overnight available" },
      { key: "schoolPickup", label: "School pickup" },
    ],
  },
  {
    title: "Specialities",
    items: [
      { key: "newborn", label: "Newborn experience" },
      { key: "multiples", label: "Twins / multiples" },
      { key: "sen", label: "Special educational needs" },
      { key: "maternity", label: "Maternity nurse" },
      { key: "night", label: "Night nanny" },
    ],
  },
  {
    title: "Qualifications & checks",
    items: [
      { key: "earlyYears", label: "Early years qualified" },
      { key: "teaching", label: "Teaching qualification" },
      { key: "firstAid", label: "Paediatric first aid" },
      { key: "policeCleared", label: "Police / DBS / UAE clearance" },
    ],
  },
  {
    title: "Practical",
    items: [
      { key: "drives", label: "Drives" },
      { key: "ownCar", label: "Has own car" },
      { key: "swims", label: "Swims" },
      { key: "cooks", label: "Cooks / meal prep" },
      { key: "homework", label: "Homework help" },
      { key: "nonSmoker", label: "Non-smoker" },
    ],
  },
  {
    title: "Trust signals",
    items: [
      { key: "verified", label: "Verified+ only" },
      { key: "recommended", label: "Recommended by friends" },
      { key: "videoIntro", label: "Has video intro" },
      { key: "recentlyActive", label: "Active in last 48h" },
    ],
  },
];

const FiltersPage = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<SitterFilters>(emptyFilters());
  const [tierFilter, setTierFilter] = useState<SitterTier | "any">("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([35, 200]);

  const toggleFlag = (k: FilterKey) =>
    setFilters((f) => {
      const next = new Set(f.flags);
      next.has(k) ? next.delete(k) : next.add(k);
      return { ...f, flags: next };
    });
  const toggleLang = (l: LangKey) =>
    setFilters((f) => {
      const next = new Set(f.languages);
      next.has(l) ? next.delete(l) : next.add(l);
      return { ...f, languages: next };
    });

  const reset = () => {
    setFilters(emptyFilters());
    setTierFilter("any");
    setPriceRange([35, 200]);
  };

  const apply = () => navigate("/sitters");

  const activeCount =
    filters.flags.size +
    filters.languages.size +
    (filters.minExperience > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minBookings > 0 ? 1 : 0) +
    (tierFilter !== "any" ? 1 : 0);

  return (
    <div className="min-h-screen bg-cream pb-32">
      <Header />
      <main className="container max-w-3xl py-6">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/sitters" className="inline-flex items-center gap-1 text-sm text-slate-grey hover:text-pitch-black">
            <ChevronLeft className="h-4 w-4" /> Back to sitters
          </Link>
          {activeCount > 0 && (
            <button onClick={reset} className="inline-flex items-center gap-1 text-xs font-semibold text-salmon-deep hover:text-salmon">
              <X className="h-3 w-3" /> Reset all
            </button>
          )}
        </div>

        <h1 className="font-display text-3xl font-bold text-pitch-black">Filters</h1>
        <p className="mt-1 text-sm text-slate-grey">
          {activeCount === 0 ? "Pick what matters most for your family." : `${activeCount} filter${activeCount === 1 ? "" : "s"} selected`}
        </p>

        <section className="mt-6 space-y-6 rounded-2xl bg-pure-white p-6 shadow-card">
          {/* Price */}
          <div>
            <div className="mb-2 flex items-center justify-between text-xs">
              <Label className="font-semibold uppercase tracking-wider text-slate-grey">Hourly rate</Label>
              <span className="font-medium text-pitch-black">AED {priceRange[0]}–{priceRange[1]}</span>
            </div>
            <Slider min={30} max={300} step={5} value={priceRange} onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])} />
          </div>

          {/* Tier */}
          <div>
            <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Sitter tier</Label>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setTierFilter("any")}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tierFilter === "any" ? "border-pitch-black bg-pitch-black text-pure-white" : "border-cream-deep bg-cream text-slate-grey hover:text-pitch-black"}`}
              >Any</button>
              {PRICING_TIERS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTierFilter(t.id)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tierFilter === t.id ? "border-pitch-black bg-pitch-black text-pure-white" : "border-cream-deep bg-cream text-slate-grey hover:text-pitch-black"}`}
                >{t.name}</button>
              ))}
            </div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-grey">{section.title}</Label>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {section.items.map((item) => (
                  <label key={item.key} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-grey hover:text-pitch-black">
                    <Checkbox checked={filters.flags.has(item.key)} onCheckedChange={() => toggleFlag(item.key)} />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div>
            <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Languages</Label>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {LANGUAGES.map((l) => (
                <label key={l} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-grey hover:text-pitch-black">
                  <Checkbox checked={filters.languages.has(l)} onCheckedChange={() => toggleLang(l)} />
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <Label className="text-slate-grey">Min. years experience</Label>
                <span className="font-medium text-pitch-black">{filters.minExperience}+ yrs</span>
              </div>
              <Slider min={0} max={15} step={1} value={[filters.minExperience]} onValueChange={(v) => setFilters((f) => ({ ...f, minExperience: v[0] }))} />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <Label className="text-slate-grey">Min. rating</Label>
                <span className="font-medium text-pitch-black">{filters.minRating.toFixed(1)}★</span>
              </div>
              <Slider min={0} max={5} step={0.5} value={[filters.minRating]} onValueChange={(v) => setFilters((f) => ({ ...f, minRating: v[0] }))} />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <Label className="text-slate-grey">Min. bookings completed</Label>
                <span className="font-medium text-pitch-black">{filters.minBookings}+</span>
              </div>
              <Slider min={0} max={100} step={5} value={[filters.minBookings]} onValueChange={(v) => setFilters((f) => ({ ...f, minBookings: v[0] }))} />
            </div>
          </div>
        </section>
      </main>

      {/* Sticky apply bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream-deep bg-pure-white/95 backdrop-blur">
        <div className="container flex max-w-3xl items-center justify-between gap-3 py-3">
          <Button variant="ghost" onClick={reset} className="text-sm">Reset</Button>
          <Button onClick={apply} className="rounded-full bg-pitch-black px-6 text-pure-white hover:bg-pitch-black/90">
            Show sitters
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FiltersPage;
