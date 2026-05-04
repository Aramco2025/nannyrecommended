import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SitterCard } from "@/components/SitterCard";
import { useSitters } from "@/hooks/useSitters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Search, MapPin, List, X } from "lucide-react";
import { PRICING_TIERS, SitterTier } from "@/lib/pricing/tiers";
import {
  applyFilters, emptyFilters, FilterKey, LANGUAGES, LangKey, SitterFilters,
} from "@/lib/sitterFilters";

type Section = {
  title: string;
  items: { key: FilterKey; label: string }[];
};

const SECTIONS: Section[] = [
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
    title: "Experience & specialisms",
    items: [
      { key: "newborn", label: "Newborn experience" },
      { key: "multiples", label: "Twins / multiples" },
      { key: "sen", label: "Special educational needs (SEN)" },
      { key: "maternity", label: "Maternity nurse" },
      { key: "night", label: "Night nanny" },
    ],
  },
  {
    title: "Qualifications & checks",
    items: [
      { key: "earlyYears", label: "Early years qualified (NNEB / CACHE)" },
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
      { key: "housework", label: "Light housework" },
      { key: "homework", label: "Homework help / tutoring" },
      { key: "nonSmoker", label: "Non-smoker" },
      { key: "pets", label: "Comfortable with pets" },
    ],
  },
  {
    title: "Age groups",
    items: [
      { key: "ageNewborn", label: "Newborn (0–1)" },
      { key: "ageToddler", label: "Toddler (2–4)" },
      { key: "ageSchool", label: "School age (5–10)" },
      { key: "ageTween", label: "Tween+ (11+)" },
    ],
  },
  {
    title: "Trust signals",
    items: [
      { key: "verified", label: "Verified+ only" },
      { key: "recommended", label: "Recommended by friends" },
      { key: "videoIntro", label: "Has video intro" },
    ],
  },
];

const Sitters = () => {
  const [view, setView] = useState<"list" | "map">("list");
  const [tierFilter, setTierFilter] = useState<SitterTier | "any">("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([35, 200]);
  const [filters, setFilters] = useState<SitterFilters>(emptyFilters());
  const { data: sitters = [], isLoading } = useSitters();

  const toggleFlag = (k: FilterKey) => setFilters(f => {
    const next = new Set(f.flags);
    next.has(k) ? next.delete(k) : next.add(k);
    return { ...f, flags: next };
  });
  const toggleLang = (l: LangKey) => setFilters(f => {
    const next = new Set(f.languages);
    next.has(l) ? next.delete(l) : next.add(l);
    return { ...f, languages: next };
  });

  const visible = useMemo(() => {
    let v = applyFilters(sitters, filters, priceRange);
    if (tierFilter !== "any") v = v.filter(s => s.tier === tierFilter);
    return v;
  }, [sitters, filters, priceRange, tierFilter]);

  const activeCount =
    filters.flags.size +
    filters.languages.size +
    (filters.minExperience > 0 ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minBookings > 0 ? 1 : 0);

  const reset = () => {
    setFilters(emptyFilters());
    setTierFilter("any");
    setPriceRange([35, 200]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border/60 bg-card">
        <div className="container py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-pitch-black md:text-3xl">Sitters near you</h1>
              <p className="mt-1 text-sm text-slate-grey">
                <span className="font-medium text-success-green">●</span> {visible.length} sitter{visible.length === 1 ? "" : "s"} match your filters
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border border-border bg-off-white p-1">
                <button
                  onClick={() => setView("list")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${view === "list" ? "bg-card text-pitch-black shadow-sm" : "text-slate-grey"}`}
                >
                  <List className="h-4 w-4" /> List
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${view === "map" ? "bg-card text-pitch-black shadow-sm" : "text-slate-grey"}`}
                >
                  <MapPin className="h-4 w-4" /> Map
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-off-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-grey" />
            <Input
              placeholder="Area or community (e.g. Dubai Marina)"
              defaultValue="Dubai Marina"
              className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
            />
          </div>

          {/* Tier chips */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setTierFilter("any")}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tierFilter === "any" ? "border-pitch-black bg-pitch-black text-pure-white" : "border-border bg-card text-slate-grey hover:text-pitch-black"}`}
            >Any tier</button>
            {PRICING_TIERS.map(t => (
              <button
                key={t.id}
                onClick={() => setTierFilter(t.id)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tierFilter === t.id ? "border-pitch-black bg-pitch-black text-pure-white" : "border-border bg-card text-slate-grey hover:text-pitch-black"}`}
              >{t.name}</button>
            ))}
          </div>

          {/* Price */}
          <div className="mt-5 max-w-md">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-grey">
              <span>Hourly rate</span>
              <span className="font-medium text-pitch-black">AED {priceRange[0]} – AED {priceRange[1]}</span>
            </div>
            <Slider
              min={30} max={300} step={5}
              value={priceRange}
              onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
            />
          </div>

          {/* Header row for advanced filters */}
          <div className="mt-6 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-pitch-black">
              More filters {activeCount > 0 && <span className="ml-1 rounded-full bg-salmon px-2 py-0.5 text-[10px] font-bold text-pure-white">{activeCount}</span>}
            </h2>
            {activeCount > 0 && (
              <Button variant="ghost" size="sm" onClick={reset} className="h-8 gap-1 text-xs">
                <X className="h-3.5 w-3.5" /> Clear all
              </Button>
            )}
          </div>

          {/* Inline expandable sections */}
          <Accordion type="multiple" className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map(section => {
              const sectionActive = section.items.filter(i => filters.flags.has(i.key)).length;
              return (
                <AccordionItem key={section.title} value={section.title} className="rounded-xl border border-border bg-off-white px-3">
                  <AccordionTrigger className="py-3 text-sm font-medium text-pitch-black hover:no-underline">
                    <span className="flex items-center gap-2">
                      {section.title}
                      {sectionActive > 0 && (
                        <span className="rounded-full bg-pitch-black px-1.5 py-0.5 text-[10px] font-bold text-pure-white">{sectionActive}</span>
                      )}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-3">
                    <div className="grid gap-2">
                      {section.items.map(item => (
                        <label key={item.key} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-grey hover:text-pitch-black">
                          <Checkbox
                            checked={filters.flags.has(item.key)}
                            onCheckedChange={() => toggleFlag(item.key)}
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}

            {/* Languages */}
            <AccordionItem value="lang" className="rounded-xl border border-border bg-off-white px-3">
              <AccordionTrigger className="py-3 text-sm font-medium text-pitch-black hover:no-underline">
                <span className="flex items-center gap-2">
                  Languages
                  {filters.languages.size > 0 && (
                    <span className="rounded-full bg-pitch-black px-1.5 py-0.5 text-[10px] font-bold text-pure-white">{filters.languages.size}</span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="grid gap-2">
                  {LANGUAGES.map(l => (
                    <label key={l} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-grey hover:text-pitch-black">
                      <Checkbox checked={filters.languages.has(l)} onCheckedChange={() => toggleLang(l)} />
                      <span>{l}</span>
                    </label>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Minimums */}
            <AccordionItem value="minimums" className="rounded-xl border border-border bg-off-white px-3">
              <AccordionTrigger className="py-3 text-sm font-medium text-pitch-black hover:no-underline">
                <span className="flex items-center gap-2">
                  Experience & rating
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <Label className="text-slate-grey">Minimum years experience</Label>
                      <span className="font-medium text-pitch-black">{filters.minExperience}+ yrs</span>
                    </div>
                    <Slider
                      min={0} max={15} step={1}
                      value={[filters.minExperience]}
                      onValueChange={(v) => setFilters(f => ({ ...f, minExperience: v[0] }))}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <Label className="text-slate-grey">Minimum rating</Label>
                      <span className="font-medium text-pitch-black">{filters.minRating.toFixed(1)}★</span>
                    </div>
                    <Slider
                      min={0} max={5} step={0.5}
                      value={[filters.minRating]}
                      onValueChange={(v) => setFilters(f => ({ ...f, minRating: v[0] }))}
                    />
                  </div>
                  <div>
                    <div className="mb-1.5 flex items-center justify-between text-xs">
                      <Label className="text-slate-grey">Minimum bookings completed</Label>
                      <span className="font-medium text-pitch-black">{filters.minBookings}+</span>
                    </div>
                    <Slider
                      min={0} max={100} step={5}
                      value={[filters.minBookings]}
                      onValueChange={(v) => setFilters(f => ({ ...f, minBookings: v[0] }))}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <main className="container py-8">
        {isLoading ? (
          <div className="py-20 text-center text-sm text-slate-grey">Loading sitters…</div>
        ) : view === "map" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-card lg:aspect-auto lg:min-h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=1000&fit=crop"
                alt="Map of nearby sitters"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-pitch-black/5" />
            </div>
            <div className="flex flex-col gap-4 lg:max-h-[600px] lg:overflow-y-auto lg:pr-1">
              {visible.map(s => <SitterCard key={s.id} sitter={s} />)}
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map(s => <SitterCard key={s.id} sitter={s} />)}
          </div>
        )}

        {!isLoading && visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h3 className="text-lg font-semibold text-pitch-black">No sitters match those filters</h3>
            <p className="mt-2 text-sm text-slate-grey">
              Try clearing a few filters, or widen your hourly rate range. We're constantly onboarding new sitters across the UAE.
            </p>
            {activeCount > 0 && (
              <Button variant="outline" size="sm" onClick={reset} className="mt-4">Clear all filters</Button>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Sitters;
