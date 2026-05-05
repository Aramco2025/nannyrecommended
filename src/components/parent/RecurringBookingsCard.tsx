import { useRecurringBookings, useToggleRecurring, useDeleteRecurring } from "@/hooks/useRecurringBookings";
import { Calendar, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function RecurringBookingsCard() {
  const { data = [], isLoading } = useRecurringBookings();
  const toggle = useToggleRecurring();
  const del = useDeleteRecurring();

  return (
    <section className="rounded-2xl bg-pure-white p-6 shadow-card">
      <div className="flex items-center gap-2">
        <Calendar className="h-5 w-5 text-salmon-deep" />
        <h2 className="font-display text-lg font-bold text-pitch-black">Repeat bookings</h2>
      </div>
      <p className="mt-1 text-sm text-slate-grey">Save a weekly slot — we'll suggest it each week with one tap to confirm.</p>

      {isLoading ? null : data.length === 0 ? (
        <p className="mt-4 rounded-xl bg-off-white p-3 text-xs text-slate-grey">No repeat bookings yet. Add one from any sitter's profile.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {data.map(r => (
            <li key={r.id} className="flex items-center justify-between rounded-xl border border-cream-deep p-3">
              <div className="text-sm">
                <div className="font-semibold text-pitch-black">Every {DAYS[r.day_of_week]} · {r.start_time.slice(0,5)} · {r.hours}h</div>
                <div className="text-xs text-slate-grey">{r.address || "Address tbd"}</div>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={r.active} onCheckedChange={(v) => toggle.mutate({ id: r.id, active: v })} />
                <Button variant="ghost" size="icon" onClick={() => del.mutate(r.id)} aria-label="Delete"><Trash2 className="h-4 w-4 text-slate-grey" /></Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
