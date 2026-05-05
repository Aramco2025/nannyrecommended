import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

function fmt(ms: number) {
  if (ms < 0) ms = 0;
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
}

export function BookingTimer({
  startedAt,
  endedAt,
}: {
  startedAt: string | null;
  endedAt: string | null;
}) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (!startedAt || endedAt) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt, endedAt]);

  if (!startedAt) {
    return (
      <div className="flex items-center gap-2 rounded-2xl bg-cream px-4 py-3 text-sm text-slate-grey">
        <Clock className="h-4 w-4" /> Sit hasn't started yet.
      </div>
    );
  }

  const start = new Date(startedAt).getTime();
  const end = endedAt ? new Date(endedAt).getTime() : now;
  const elapsed = end - start;
  const live = !endedAt;

  return (
    <div className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${live ? "bg-success-green/10" : "bg-cream"}`}>
      <div className="flex items-center gap-2 text-sm text-pitch-black">
        <Clock className={`h-4 w-4 ${live ? "text-success-green" : "text-slate-grey"}`} />
        <span className="font-medium">{live ? "In progress" : "Sit complete"}</span>
      </div>
      <div className="font-display text-2xl font-bold tabular-nums text-pitch-black">
        {fmt(elapsed)}
      </div>
    </div>
  );
}
