import { Link } from "react-router-dom";
import { Sparkles, Headphones, Lock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

export function ConciergeCTA() {
  const { isFamilyPlus, loading } = useSubscription();
  if (loading) return null;

  if (isFamilyPlus) {
    return (
      <Link
        to="/contact?category=concierge"
        className="inline-flex items-center gap-2 rounded-full bg-pitch-black px-4 py-2 text-sm font-medium text-pure-white hover:bg-pitch-black/90"
      >
        <Sparkles className="h-4 w-4 text-salmon" />
        Request concierge match
      </Link>
    );
  }
  return (
    <Link
      to="/pricing"
      className="inline-flex items-center gap-2 rounded-full border border-cream-deep bg-cream px-4 py-2 text-sm text-slate-grey hover:bg-cream-deep"
    >
      <Lock className="h-3.5 w-3.5" />
      Concierge match — Family Plus
    </Link>
  );
}

export function PrioritySupportBadge() {
  const { isFamilyPlus } = useSubscription();
  if (!isFamilyPlus) return null;
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-salmon-soft/40 px-3 py-1 text-xs font-semibold text-salmon-deep">
      <Headphones className="h-3 w-3" />
      Priority support — replies within 2 hours
    </div>
  );
}
