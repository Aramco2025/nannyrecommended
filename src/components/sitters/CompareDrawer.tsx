import { useState, createContext, useContext, ReactNode } from "react";
import { UISitter } from "@/lib/sitterMapper";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Scale, Check, Minus } from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/fees";

type Ctx = {
  ids: string[];
  sitters: UISitter[];
  toggle: (s: UISitter) => void;
  clear: () => void;
  has: (id: string) => boolean;
};
const CompareCtx = createContext<Ctx | null>(null);
export const useCompare = () => {
  const c = useContext(CompareCtx);
  if (!c) throw new Error("useCompare must be used inside CompareProvider");
  return c;
};

export function CompareProvider({ children }: { children: ReactNode }) {
  const [sitters, setSitters] = useState<UISitter[]>([]);
  const has = (id: string) => sitters.some(s => s.id === id);
  const toggle = (s: UISitter) =>
    setSitters(curr => has(s.id) ? curr.filter(x => x.id !== s.id) : curr.length >= 3 ? curr : [...curr, s]);
  const clear = () => setSitters([]);
  return (
    <CompareCtx.Provider value={{ ids: sitters.map(s => s.id), sitters, toggle, clear, has }}>
      {children}
    </CompareCtx.Provider>
  );
}

export function CompareBar() {
  const { sitters, clear } = useCompare();
  const [open, setOpen] = useState(false);
  if (sitters.length === 0) return null;
  return (
    <>
      <div className="fixed inset-x-0 bottom-16 z-30 px-4 md:bottom-6">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 rounded-full bg-pitch-black px-4 py-3 text-pure-white shadow-card-hover">
          <div className="flex items-center gap-2 text-sm">
            <Scale className="h-4 w-4 text-salmon" />
            <span className="font-semibold">{sitters.length}/3 to compare</span>
            <div className="hidden sm:flex items-center gap-1">
              {sitters.map(s => (
                <img key={s.id} src={s.photo} alt={s.name} className="h-7 w-7 rounded-full border border-pure-white object-cover" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="rounded-full text-pure-white hover:bg-pure-white/10" onClick={clear}>Clear</Button>
            <Button size="sm" className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep" onClick={() => setOpen(true)}>Compare</Button>
          </div>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto bg-pure-white">
          <SheetHeader><SheetTitle className="font-display">Compare sitters</SheetTitle></SheetHeader>
          <div className="mt-6 grid gap-4" style={{ gridTemplateColumns: `repeat(${sitters.length}, minmax(0, 1fr))` }}>
            {sitters.map(s => (
              <div key={s.id} className="rounded-2xl bg-cream p-4">
                <img src={s.photo} alt={s.name} className="aspect-square w-full rounded-xl object-cover" />
                <h3 className="mt-3 font-display text-base font-bold text-pitch-black">{s.name}</h3>
                <p className="text-xs text-slate-grey">{s.area}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-cream-deep">
                <Row label="Hourly rate" values={sitters.map(s => formatCurrency(s.hourlyRate, s.currency))} />
                <Row label="Rating" values={sitters.map(s => s.rating ? `${s.rating.toFixed(1)}★` : "New")} />
                <Row label="Bookings" values={sitters.map(s => `${s.bookingsCompleted}`)} />
                <Row label="Years experience" values={sitters.map(s => `${(s as any).yearsExperience ?? "—"}`)} />
                <Row label="Verified" values={sitters.map(s => s.verified ? "yes" : "no")} />
                <Row label="Tier" values={sitters.map(s => s.tier ?? "—")} />
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${sitters.length}, minmax(0, 1fr))` }}>
            {sitters.map(s => (
              <Button asChild key={s.id} size="sm" className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                <Link to={`/book/${s.id}`} onClick={() => setOpen(false)}>Book {s.name.split(" ")[0]}</Link>
              </Button>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

const Row = ({ label, values }: { label: string; values: string[] }) => (
  <tr>
    <th className="py-2 pr-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-grey">{label}</th>
    {values.map((v, i) => (
      <td key={i} className="py-2 text-sm font-medium text-pitch-black">
        {v === "yes" ? <Check className="h-4 w-4 text-success-green" /> : v === "no" ? <Minus className="h-4 w-4 text-slate-grey" /> : v}
      </td>
    ))}
  </tr>
);

export function CompareToggle({ sitter }: { sitter: UISitter }) {
  const { has, toggle, sitters } = useCompare();
  const checked = has(sitter.id);
  const disabled = !checked && sitters.length >= 3;
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (!disabled) toggle(sitter); }}
      disabled={disabled}
      className={`absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-card backdrop-blur transition ${
        checked ? "bg-pitch-black text-pure-white" : "bg-pure-white/90 text-slate-grey hover:text-pitch-black"
      } ${disabled ? "opacity-40" : ""}`}
      title={disabled ? "Compare up to 3" : "Add to compare"}
    >
      <Scale className="h-3 w-3" /> {checked ? "Comparing" : "Compare"}
    </button>
  );
}

export { X };
