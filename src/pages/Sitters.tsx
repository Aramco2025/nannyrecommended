import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SitterCard } from "@/components/SitterCard";
import { useSitters } from "@/hooks/useSitters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, MapPin, List, SlidersHorizontal } from "lucide-react";
import { PRICING_TIERS, SitterTier } from "@/lib/pricing/tiers";

const filterChips = [
  "Available now",
  "Available this week",
  "Verified+",
  "Police-cleared",
  "First-aid certified",
  "Drives",
  "Live-in available",
  "Recommended by friends",
  "Speaks Arabic",
];

const Sitters = () => {
  const [view, setView] = useState<"list" | "map">("list");
  const [active, setActive] = useState<string[]>([]);
  const { data: sitters = [], isLoading } = useSitters();

  const toggle = (chip: string) =>
    setActive(a => (a.includes(chip) ? a.filter(c => c !== chip) : [...a, chip]));

  let visible = sitters;
  if (active.includes("Verified+")) visible = visible.filter(s => s.verified);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="border-b border-border/60 bg-card">
        <div className="container py-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-pitch-black md:text-3xl">Sitters near you</h1>
              <p className="mt-1 text-sm text-slate-grey">
                <span className="font-medium text-success-green">●</span> 12 sitters available within 3km tonight
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
              <Button variant="outline" size="icon" className="md:hidden">
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
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

          <div className="mt-4 flex flex-wrap gap-2">
            {filterChips.map(chip => {
              const isActive = active.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => toggle(chip)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? "border-pitch-black bg-pitch-black text-pure-white"
                      : "border-border bg-card text-slate-grey hover:border-pitch-black hover:text-pitch-black"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <main className="container py-8">
        {view === "map" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted shadow-card lg:aspect-auto lg:min-h-[600px]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1200&h=1000&fit=crop"
                alt="Map of nearby sitters"
                className="h-full w-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-pitch-black/5" />
              {[
                { top: "30%", left: "40%" },
                { top: "55%", left: "55%" },
                { top: "45%", left: "30%" },
                { top: "65%", left: "45%" },
              ].map((p, i) => (
                <div
                  key={i}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={p}
                >
                  <div className="rounded-full bg-salmon px-2.5 py-1 text-xs font-semibold text-pure-white shadow-cta">
                    AED {[75, 90, 65, 80][i]}
                  </div>
                </div>
              ))}
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

        {visible.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
            <h3 className="text-lg font-semibold text-pitch-black">No sitters match those filters</h3>
            <p className="mt-2 text-sm text-slate-grey">
              We're new in some areas — be one of the first families to help us build the network. We'll personally call sitters near you to invite them.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Sitters;
