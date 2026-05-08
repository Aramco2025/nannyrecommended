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
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "@/components/ui/accordion";
import { Search, MapPin, List, X, SlidersHorizontal, Megaphone } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { PRICING_TIERS, SitterTier } from "@/lib/pricing/tiers";
import {
  applyFilters, emptyFilters, FilterKey, LANGUAGES, LangKey, SitterFilters,
} from "@/lib/sitterFilters";
import { AvailabilityFilter, type SlotFilter } from "@/components/AvailabilityFilter";
import { useAvailableSitters } from "@/hooks/useAvailableSitters";
import { MobileTabBar } from "@/components/MobileTabBar";
import { AreaDensityIndicator } from "@/components/AreaDensityIndicator";
import { CompareProvider, CompareBar } from "@/components/sitters/CompareDrawer";
import { SittersMapView } from "@/components/sitters/SittersMapView";
import { ConciergeCTA } from "@/components/payments/FamilyPlusGates";
import { SavedSearchesSheet } from "@/components/sitters/SavedSearchesSheet";
import { sortSitters, SORT_OPTIONS, type SortKey } from "@/lib/sitterRanking";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Section = { title: string; items: { key: FilterKey; label: string }[] };

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
    title: "Specialities",
    items: [
      { key: "newborn", label: "Newborn experience" },
      { key: "multiples", label: "Twins / multiples" },
      { key: "sen", label: "Special educational needs" },
      { key: "maternity", label: "Maternity nurse" },
      { key: "night", label: "Night nanny" },
      { key: "dogWalker", label: "Dog walker" },
      { key: "petSitter", label: "Pet sitter" },
      { key: "petBoarding", label: "Pet boarding" },
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
      { key: "housework", label: "Light housework" },
      { key: "homework", label: "Homework help" },
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
      { key: "recentlyActive", label: "Active in last 48h" },
    ],
  },
];

const Sitters = () => {
  const [params] = useSearchParams();
  const initialView = params.get("view") === "map" ? "map" : "list";
  const [view, setView] = useState<"list" | "map">(initialView);
  const [sort, setSort] = useState<SortKey>("best");
  const [tierFilter, setTierFilter] = useState<SitterTier | "any">("any");
  const [priceRange, setPriceRange] = useState<[number, number]>([35, 200]);
  const [filters, setFilters] = useState<SitterFilters>(emptyFilters());
  const [slot, setSlot] = useState<SlotFilter>(null);
  const { data: sitters = [], isLoading } = useSitters();
  const { data: availableIds } = useAvailableSitters(slot);

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
    if (slot && availableIds) v = v.filter(s => availableIds.has(s.id));
    return sortSitters(v, sort);
  }, [sitters, filters, priceRange, tierFilter, slot, availableIds, sort]);

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

  const FiltersPanel = (
    <div className="space-y-6">
      {/* Price */}
      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <Label className="text-slate-grey font-semibold uppercase tracking-wider">Hourly rate</Label>
          <span className="font-medium text-pitch-black">AED {priceRange[0]}–{priceRange[1]}</span>
        </div>
        <Slider
          min={30} max={300} step={5}
          value={priceRange}
          onValueChange={(v) => setPriceRange([v[0], v[1]] as [number, number])}
        />
      </div>

      {/* Tier */}
      <div>
        <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Sitter tier</Label>
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setTierFilter("any")}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tierFilter === "any" ? "border-pitch-black bg-pitch-black text-pure-white" : "border-cream-deep bg-cream text-slate-grey hover:text-pitch-black"}`}
          >Any</button>
          {PRICING_TIERS.map(t => (
            <button
              key={t.id}
              onClick={() => setTierFilter(t.id)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition ${tierFilter === t.id ? "border-pitch-black bg-pitch-black text-pure-white" : "border-cream-deep bg-cream text-slate-grey hover:text-pitch-black"}`}
            >{t.name}</button>
          ))}
        </div>
      </div>

      {/* Grouped checkbox sections */}
      <Accordion type="multiple" defaultValue={["Availability"]} className="space-y-1">
        {SECTIONS.map(section => {
          const sectionActive = section.items.filter(i => filters.flags.has(i.key)).length;
          return (
            <AccordionItem key={section.title} value={section.title} className="border-b border-cream-deep">
              <AccordionTrigger className="py-3 text-sm font-semibold text-pitch-black hover:no-underline">
                <span className="flex items-center gap-2">
                  {section.title}
                  {sectionActive > 0 && (
                    <span className="rounded-full bg-salmon px-1.5 py-0.5 text-[10px] font-bold text-pure-white">{sectionActive}</span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-3">
                <div className="grid gap-2.5">
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

        <AccordionItem value="lang" className="border-b border-cream-deep">
          <AccordionTrigger className="py-3 text-sm font-semibold text-pitch-black hover:no-underline">
            <span className="flex items-center gap-2">
              Languages
              {filters.languages.size > 0 && (
                <span className="rounded-full bg-salmon px-1.5 py-0.5 text-[10px] font-bold text-pure-white">{filters.languages.size}</span>
              )}
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-3">
            <div className="grid gap-2.5">
              {LANGUAGES.map(l => (
                <label key={l} className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-grey hover:text-pitch-black">
                  <Checkbox checked={filters.languages.has(l)} onCheckedChange={() => toggleLang(l)} />
                  <span>{l}</span>
                </label>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="minimums" className="border-b border-cream-deep">
          <AccordionTrigger className="py-3 text-sm font-semibold text-pitch-black hover:no-underline">
            Experience & rating
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="space-y-4">
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <Label className="text-slate-grey">Min. years experience</Label>
                  <span className="font-medium text-pitch-black">{filters.minExperience}+ yrs</span>
                </div>
                <Slider min={0} max={15} step={1} value={[filters.minExperience]}
                  onValueChange={(v) => setFilters(f => ({ ...f, minExperience: v[0] }))} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <Label className="text-slate-grey">Min. rating</Label>
                  <span className="font-medium text-pitch-black">{filters.minRating.toFixed(1)}★</span>
                </div>
                <Slider min={0} max={5} step={0.5} value={[filters.minRating]}
                  onValueChange={(v) => setFilters(f => ({ ...f, minRating: v[0] }))} />
              </div>
              <div>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <Label className="text-slate-grey">Min. bookings completed</Label>
                  <span className="font-medium text-pitch-black">{filters.minBookings}+</span>
                </div>
                <Slider min={0} max={100} step={5} value={[filters.minBookings]}
                  onValueChange={(v) => setFilters(f => ({ ...f, minBookings: v[0] }))} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <CompareProvider>
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <Header />

      {/* Post-a-job CTA strip */}
      <section className="border-b border-cream-deep bg-gradient-to-r from-salmon-soft via-cream to-pure-white">
        <div className="container flex flex-col items-start gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pure-white text-salmon-deep shadow-card">
              <Megaphone className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-base font-bold text-pitch-black">Don't see the perfect fit?</div>
              <div className="text-xs text-slate-grey">Book a sit and let verified sitters apply to you.</div>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
            <Link to="/parent/post-job/start">Book a sit</Link>
          </Button>
        </div>
      </section>

      {/* Search bar */}
      <section className="border-b border-cream-deep bg-pure-white">
        <div className="container py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2 rounded-full border border-cream-deep bg-cream px-4 py-2.5 md:max-w-md">
              <Search className="h-4 w-4 text-slate-grey" />
              <Input
                placeholder="Area or community (e.g. Dubai Marina)"
                defaultValue="Dubai Marina"
                className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0"
              />
              <MapPin className="h-4 w-4 text-salmon" />
            </div>
            <div className="flex items-center gap-2">
              <AvailabilityFilter value={slot} onChange={setSlot} />
              <div className="flex items-center rounded-full border border-cream-deep bg-cream p-1">
                <button
                  onClick={() => setView("list")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${view === "list" ? "bg-pure-white text-pitch-black shadow-sm" : "text-slate-grey"}`}
                >
                  <List className="h-4 w-4" /> List
                </button>
                <button
                  onClick={() => setView("map")}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition ${view === "map" ? "bg-pure-white text-pitch-black shadow-sm" : "text-slate-grey"}`}
                >
                  <MapPin className="h-4 w-4" /> Map
                </button>
              </div>

              {/* Mobile filters trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5 lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" /> Filters
                    {activeCount > 0 && (
                      <span className="ml-1 rounded-full bg-salmon px-1.5 py-0.5 text-[10px] font-bold text-pure-white">{activeCount}</span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[320px] overflow-y-auto bg-pure-white sm:w-[380px]">
                  <SheetHeader>
                    <SheetTitle className="font-display">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">{FiltersPanel}</div>
                  {activeCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={reset} className="mt-4 w-full gap-1">
                      <X className="h-3.5 w-3.5" /> Clear all filters
                    </Button>
                  )}
                </SheetContent>
              </Sheet>

              <SavedSearchesSheet
                currentFilters={{
                  flags: Array.from(filters.flags),
                  languages: Array.from(filters.languages),
                  minExperience: filters.minExperience,
                  minRating: filters.minRating,
                  minBookings: filters.minBookings,
                  priceRange,
                  tierFilter,
                }}
                onLoad={(f) => {
                  setFilters({
                    flags: new Set(f.flags ?? []),
                    languages: new Set(f.languages ?? []),
                    minExperience: f.minExperience ?? 0,
                    minRating: f.minRating ?? 0,
                    minBookings: f.minBookings ?? 0,
                  });
                  if (f.priceRange) setPriceRange(f.priceRange);
                  if (f.tierFilter) setTierFilter(f.tierFilter);
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main: sidebar + results */}
      <main className="container py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* LEFT FILTER RAIL — desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-2xl bg-pure-white p-5 shadow-card">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-base font-bold text-pitch-black">
                  Filters {activeCount > 0 && (
                    <span className="ml-1 rounded-full bg-salmon px-2 py-0.5 text-[10px] font-bold text-pure-white">{activeCount}</span>
                  )}
                </h2>
                {activeCount > 0 && (
                  <button onClick={reset} className="text-xs font-medium text-salmon-deep hover:text-salmon">
                    Clear all
                  </button>
                )}
              </div>
              {FiltersPanel}
            </div>
          </aside>

          {/* RESULTS */}
          <div>
            <div className="mb-5 flex items-baseline justify-between gap-3">
              <h1 className="font-display text-2xl font-bold text-pitch-black md:text-3xl">
                Sitters near you
              </h1>
              <div className="flex items-center gap-3">
                <ConciergeCTA />
                <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                  <SelectTrigger className="h-9 w-[160px] rounded-full border-cream-deep bg-pure-white text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map(o => (
                      <SelectItem key={o.key} value={o.key} className="text-xs">{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="hidden text-sm text-slate-grey sm:block">
                  <span className="font-semibold text-success-green">●</span> {visible.length} match{visible.length === 1 ? "" : "es"}
                </p>
              </div>
            </div>

            <AreaDensityIndicator area={null} visibleCount={visible.length} />

            {isLoading ? (
              <div className="py-20 text-center text-sm text-slate-grey">Loading sitters…</div>
            ) : view === "map" ? (
              <SittersMapView sitters={visible} />
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map(s => <SitterCard key={s.id} sitter={s} />)}
              </div>
            )}

            {!isLoading && visible.length === 0 && (
              <div className="rounded-2xl border border-dashed border-cream-deep bg-pure-white p-10 text-center">
                <h3 className="font-display text-lg font-bold text-pitch-black">No sitters match those filters</h3>
                <p className="mt-2 text-sm text-slate-grey">
                  Try clearing a few filters or widening your hourly rate range. We're constantly onboarding new sitters across the UAE.
                </p>
                {activeCount > 0 && (
                  <Button variant="outline" size="sm" onClick={reset} className="mt-4">Clear all filters</Button>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileTabBar />
      <CompareBar />
    </div>
    </CompareProvider>
  );
};

export default Sitters;
