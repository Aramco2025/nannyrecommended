import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { addDays, format, startOfWeek } from "date-fns";

const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];
// Postgres EXTRACT(DOW) gives 0=Sun..6=Sat. Our UI starts Monday.
const UI_TO_DOW = [1, 2, 3, 4, 5, 6, 0];

// 30-min slots from 06:00 to 23:30
const SLOTS = Array.from({ length: 36 }, (_, i) => {
  const h = 6 + Math.floor(i / 2);
  const m = i % 2 === 0 ? "00" : "30";
  return `${String(h).padStart(2, "0")}:${m}`;
});

const SitterAvailability = () => {
  const { user, loading } = useAuth();
  const [sitterId, setSitterId] = useState<string | null>(null);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [activeDay, setActiveDay] = useState(0);
  const [available, setAvailable] = useState<Record<string, boolean>>({});
  const [bookings, setBookings] = useState<{ start: Date; end: Date; parent: string }[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: s } = await supabase.from("sitters").select("id").eq("user_id", user.id).maybeSingle();
      if (!s) return;
      setSitterId(s.id);
      const { data: a } = await supabase.from("availability").select("*").eq("sitter_id", s.id);
      const map: Record<string, boolean> = {};
      (a ?? []).forEach((row: any) => {
        for (let i = 0; i < SLOTS.length; i++) {
          const slot = SLOTS[i];
          if (slot >= row.start_time.slice(0, 5) && slot < row.end_time.slice(0, 5)) {
            map[`${row.day_of_week}_${slot}`] = true;
          }
        }
      });
      setAvailable(map);

      const wkEnd = addDays(weekStart, 7);
      const { data: bks } = await supabase
        .from("bookings").select("start_at,end_at,parent_id")
        .eq("sitter_id", s.id)
        .in("status", ["pending", "confirmed"])
        .gte("start_at", weekStart.toISOString())
        .lt("start_at", wkEnd.toISOString());
      setBookings((bks ?? []).map((b: any) => ({
        start: new Date(b.start_at), end: new Date(b.end_at), parent: "Booked",
      })));
    })();
  }, [user, weekStart]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const toggle = (slot: string) => {
    const dow = UI_TO_DOW[activeDay];
    const key = `${dow}_${slot}`;
    setAvailable(a => ({ ...a, [key]: !a[key] }));
  };

  const save = async () => {
    if (!sitterId) return;
    setBusy(true);
    try {
      const dow = UI_TO_DOW[activeDay];
      // Replace this day's slots: delete all weekly rows for this dow then re-insert merged ranges
      await supabase.from("availability").delete().eq("sitter_id", sitterId).eq("day_of_week", dow).is("specific_date", null);

      const enabled = SLOTS.filter(s => available[`${dow}_${s}`]);
      // Merge consecutive 30-min slots into ranges
      const ranges: { start: string; end: string }[] = [];
      for (const s of enabled) {
        const last = ranges[ranges.length - 1];
        const endTime = addMinutes(s, 30);
        if (last && last.end === s) last.end = endTime;
        else ranges.push({ start: s, end: endTime });
      }
      if (ranges.length) {
        const { error } = await supabase.from("availability").insert(
          ranges.map(r => ({ sitter_id: sitterId, day_of_week: dow, start_time: r.start + ":00", end_time: r.end + ":00" }))
        );
        if (error) throw error;
      }
      toast({ title: "Availability saved" });
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  const dayDate = addDays(weekStart, activeDay);
  const slotIsBooked = (slot: string) => {
    const [h, m] = slot.split(":").map(Number);
    const slotStart = new Date(dayDate); slotStart.setHours(h, m, 0, 0);
    return bookings.find(b => slotStart >= b.start && slotStart < b.end);
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-2xl py-8">
        <h1 className="font-display text-3xl font-bold text-pitch-black">Availability</h1>

        <div className="mt-6 flex items-center justify-between">
          <button onClick={() => setWeekStart(addDays(weekStart, -7))} className="rounded-full bg-pure-white px-3 py-1 text-sm shadow-card">‹</button>
          <div className="text-sm font-semibold text-pitch-black">
            {format(weekStart, "do MMM")} – {format(addDays(weekStart, 6), "do MMM")}
          </div>
          <button onClick={() => setWeekStart(addDays(weekStart, 7))} className="rounded-full bg-pure-white px-3 py-1 text-sm shadow-card">›</button>
        </div>

        <div className="mt-5 flex justify-between gap-2">
          {DAY_LABELS.map((d, i) => (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              className={`grid h-11 w-11 place-items-center rounded-full text-sm font-bold transition ${
                activeDay === i ? "bg-salmon text-pure-white" : "bg-pure-white text-pitch-black hover:bg-cream-deep"
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm font-semibold text-pitch-black">{format(dayDate, "EEE do MMM")}</div>
          <button onClick={save} disabled={busy} className="text-sm font-semibold text-salmon-deep hover:text-salmon">
            {busy ? "Saving…" : "Save"}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          {SLOTS.map(slot => {
            const dow = UI_TO_DOW[activeDay];
            const isAvail = available[`${dow}_${slot}`];
            const booked = slotIsBooked(slot);
            return (
              <button
                key={slot}
                disabled={!!booked}
                onClick={() => toggle(slot)}
                className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                  booked
                    ? "bg-salmon-soft text-salmon-deep cursor-not-allowed"
                    : isAvail
                      ? "bg-success-green/15 text-success-green"
                      : "bg-pure-white text-slate-grey hover:bg-cream-deep"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-xs text-slate-grey">Tap to toggle. Salmon slots are already booked. Save applies these times to every {format(dayDate, "EEEE")}.</p>
      </main>
      <Footer />
    </div>
  );
};

function addMinutes(time: string, mins: number) {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + mins;
  const hh = Math.floor(total / 60);
  const mm = total % 60;
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}

export default SitterAvailability;
