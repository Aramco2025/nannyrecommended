import { ShieldCheck, BadgeCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

type Props = { tier: "basic" | "plus"; className?: string };

export function VerifiedBadge({ tier, className = "" }: Props) {
  const isPlus = tier === "plus";
  const Icon = isPlus ? BadgeCheck : ShieldCheck;
  const label = isPlus ? "Verified+" : "Verified";
  const colour = isPlus
    ? "bg-success-green/10 text-success-green border-success-green/30"
    : "bg-slate-grey/10 text-slate-grey border-slate-grey/30";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${colour} ${className}`}
        >
          <Icon className="h-3.5 w-3.5" /> {label}
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        {isPlus ? (
          <p className="text-xs leading-relaxed">
            <strong>Verified+:</strong> Enhanced DBS / police clearance, two reference calls done by our team, first-aid certificate verified, and right-to-work checked.
          </p>
        ) : (
          <p className="text-xs leading-relaxed">
            <strong>Verified:</strong> ID and selfie match, phone, email, and one reference checked.
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
}
