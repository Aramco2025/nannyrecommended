import { WifiOff } from "lucide-react";
import { useOnline } from "@/hooks/useOnline";

/**
 * Friendly, non-scary "you're offline" banner pinned to the top of the app.
 * Apple specifically tests apps in airplane mode — generic "Network error"
 * toasts get apps rejected; a calm banner that auto-clears on reconnect
 * passes review.
 */
export function OfflineBanner() {
  const online = useOnline();
  if (online) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="sticky top-0 z-50 flex items-center justify-center gap-2 bg-pitch-black/90 px-4 py-2 text-xs font-medium text-pure-white"
    >
      <WifiOff className="h-3.5 w-3.5" aria-hidden />
      You're offline — we'll retry as soon as you reconnect.
    </div>
  );
}
