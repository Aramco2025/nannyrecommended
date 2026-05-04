import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock, CalendarDays } from "lucide-react";

export type SlotFilter = { date: Date; startTime: string; endTime: string } | null;

export function AvailabilityFilter({ value, onChange }: { value: SlotFilter; onChange: (v: SlotFilter) => void }) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(value?.date ?? new Date());
  const [start, setStart] = useState(value?.startTime ?? "12:30");
  const [end, setEnd] = useState(value?.endTime ?? "15:30");

  const apply = () => {
    if (!date) return;
    onChange({ date, startTime: start, endTime: end });
    setOpen(false);
  };
  const clear = () => {
    onChange(null);
    setOpen(false);
  };

  const label = value
    ? `${value.date.toLocaleDateString([], { day: "numeric", month: "short" })} · ${value.startTime}–${value.endTime}`
    : "Any time";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <CalendarDays className="h-4 w-4" /> {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-pure-white">
        <DialogHeader>
          <DialogTitle className="font-display">Filter available sitters</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
            className="mx-auto rounded-xl"
          />
          <div className="flex items-center gap-3 rounded-xl border border-cream-deep bg-cream p-3">
            <Clock className="h-4 w-4 text-slate-grey" />
            <div className="grid flex-1 grid-cols-2 gap-3">
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-slate-grey">From</Label>
                <Input type="time" value={start} onChange={e => setStart(e.target.value)} className="mt-1 h-9 border-0 bg-transparent text-sm font-semibold" />
              </div>
              <div>
                <Label className="text-[10px] uppercase tracking-wider text-slate-grey">To</Label>
                <Input type="time" value={end} onChange={e => setEnd(e.target.value)} className="mt-1 h-9 border-0 bg-transparent text-sm font-semibold" />
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={clear}>Clear</Button>
            <Button onClick={apply} className="flex-1 bg-pitch-black text-pure-white hover:bg-pitch-black/90">Apply filter</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
