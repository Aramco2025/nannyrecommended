import { Circle, Zap } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";

export function isRecentlyActive(lastActiveAt: string | null): boolean {
  if (!lastActiveAt) return false;
  return Date.now() - new Date(lastActiveAt).getTime() < 1000 * 60 * 60 * 48; // 48h
}

export function lastActiveLabel(lastActiveAt: string | null): string | null {
  if (!lastActiveAt) return null;
  const ms = Date.now() - new Date(lastActiveAt).getTime();
  if (ms < 1000 * 60 * 15) return "Active now";
  if (ms < 1000 * 60 * 60) return "Active in last hour";
  return `Active ${formatDistanceToNowStrict(new Date(lastActiveAt), { addSuffix: true })}`;
}

export function responseLabel(avgResponseMinutes: number | null): string | null {
  if (avgResponseMinutes == null || avgResponseMinutes <= 0) return null;
  if (avgResponseMinutes < 15) return "Replies in <15m";
  if (avgResponseMinutes < 60) return `Replies in ~${Math.round(avgResponseMinutes / 5) * 5}m`;
  const hours = Math.round(avgResponseMinutes / 60);
  if (hours <= 4) return `Replies in ~${hours}h`;
  return "Replies same day";
}

export function ActivitySignal({
  lastActiveAt,
  avgResponseMinutes,
  compact = false,
}: {
  lastActiveAt: string | null;
  avgResponseMinutes: number | null;
  compact?: boolean;
}) {
  const active = isRecentlyActive(lastActiveAt);
  const activeLbl = lastActiveLabel(lastActiveAt);
  const replyLbl = responseLabel(avgResponseMinutes);
  if (!activeLbl && !replyLbl) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${compact ? "text-[11px]" : "text-xs"} text-slate-grey`}>
      {activeLbl && (
        <span className="inline-flex items-center gap-1">
          <Circle
            className={`h-2 w-2 ${active ? "fill-success-green text-success-green" : "fill-slate-grey/40 text-slate-grey/40"}`}
          />
          <span className={active ? "font-semibold text-success-green" : ""}>{activeLbl}</span>
        </span>
      )}
      {replyLbl && (
        <span className="inline-flex items-center gap-1">
          <Zap className="h-3 w-3 text-salmon" />
          <span className="font-medium text-pitch-black">{replyLbl}</span>
        </span>
      )}
    </div>
  );
}
