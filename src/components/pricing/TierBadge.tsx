import { getTier, SitterTier } from "@/lib/pricing/tiers";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function TierBadge({ tier, className, withTooltip = true }: { tier: SitterTier | string | null | undefined; className?: string; withTooltip?: boolean }) {
  if (!tier) return null;
  const t = getTier(tier as SitterTier);
  if (!t) return null;
  const badge = (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide", t.badgeClass, className)}>
      {t.name}
    </span>
  );
  if (!withTooltip) return badge;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild><span>{badge}</span></TooltipTrigger>
        <TooltipContent className="max-w-[240px]">
          <div className="text-xs font-semibold">{t.name} — {t.shortDescription}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">{t.typicalProfile}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
