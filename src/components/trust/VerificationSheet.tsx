import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShieldCheck, Check, Minus } from "lucide-react";
import { ReactNode } from "react";

type Sitter = {
  verified?: boolean;
  police_cleared?: boolean;
  first_aid_certified?: boolean;
  early_years_qualified?: boolean;
  teaching_qualified?: boolean;
  created_at?: string;
};

export function VerificationSheet({ sitter, trigger }: { sitter: Sitter; trigger: ReactNode }) {
  const items = [
    { label: "Government ID verified", on: !!sitter.verified, note: "Cross-checked against UAE Emirates ID." },
    { label: "Police clearance", on: !!sitter.police_cleared, note: "UAE Good Conduct Certificate on file." },
    { label: "Paediatric first aid", on: !!sitter.first_aid_certified, note: "Valid certificate verified by our team." },
    { label: "Early years qualified", on: !!sitter.early_years_qualified, note: "Recognised early-years qualification." },
    { label: "Teaching qualification", on: !!sitter.teaching_qualified, note: "Verified teaching credential." },
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" className="max-h-[80vh] overflow-y-auto bg-pure-white">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-display">
            <ShieldCheck className="h-5 w-5 text-success-green" /> Trust & verification
          </SheetTitle>
        </SheetHeader>
        <p className="mt-3 text-sm text-slate-grey">
          We verify every sitter before they can take bookings. Here's exactly what's been checked.
        </p>
        <ul className="mt-5 divide-y divide-cream-deep">
          {items.map(it => (
            <li key={it.label} className="flex items-start gap-3 py-3">
              <span className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${it.on ? "bg-success-green/10 text-success-green" : "bg-cream text-slate-grey"}`}>
                {it.on ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
              </span>
              <div>
                <p className={`text-sm font-semibold ${it.on ? "text-pitch-black" : "text-slate-grey"}`}>{it.label}</p>
                <p className="text-xs text-slate-grey">{it.note}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6 rounded-2xl bg-cream p-4 text-xs text-slate-grey">
          Every booking made on Nanny Recommended is protected by our insurance and 24/7 support — as long as you stay on-platform.
        </p>
      </SheetContent>
    </Sheet>
  );
}
