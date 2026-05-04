import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Wallet, ArrowRight } from "lucide-react";
import { format } from "date-fns";

type Job = {
  id: string;
  type: "one_off" | "repeat" | "permanent";
  start_at: string;
  end_at: string;
  area: string | null;
  hourly_rate_aed: number;
  notes: string | null;
};

export function JobCard({
  job,
  applied,
  onApply,
  busy,
}: {
  job: Job;
  applied: boolean;
  onApply: () => void;
  busy: boolean;
}) {
  const start = new Date(job.start_at);
  const end = new Date(job.end_at);
  return (
    <article className="flex flex-col rounded-3xl bg-pure-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-display text-base font-bold text-pitch-black">
            {format(start, "EEE do MMM")}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-grey">
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-salmon" /> {format(start, "h:mma")}–{format(end, "h:mma")}</span>
            {job.area && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-salmon" /> {job.area}</span>}
            <span className="inline-flex items-center gap-1"><Wallet className="h-3.5 w-3.5 text-salmon" /> AED {job.hourly_rate_aed}/hr</span>
          </div>
        </div>
        <Badge variant="secondary" className="rounded-full bg-salmon-soft/60 text-[10px] font-semibold uppercase text-salmon-deep hover:bg-salmon-soft/60">
          {job.type.replace("_", " ")}
        </Badge>
      </div>

      {job.notes && <p className="mt-3 line-clamp-2 text-xs text-slate-grey">{job.notes}</p>}

      <Button
        size="sm"
        disabled={applied || busy}
        onClick={onApply}
        className="mt-4 self-end rounded-full bg-salmon px-5 text-primary-foreground hover:bg-salmon-deep"
      >
        {applied ? "Applied" : busy ? "Applying…" : <>Apply <ArrowRight className="h-3.5 w-3.5" /></>}
      </Button>
    </article>
  );
}
