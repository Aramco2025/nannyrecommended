import { ShieldAlert, Flag } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Persistent reminder at the top of every conversation:
 * keep it in the app so insurance, payments, and dispute evidence apply.
 */
export function ThreadSafetyBanner({ bookingId }: { bookingId?: string }) {
  return (
    <div className="rounded-xl border border-salmon/30 bg-salmon-soft/40 p-3">
      <div className="flex items-start gap-2.5">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-salmon-deep" />
        <div className="flex-1 text-xs leading-relaxed text-pitch-black/85">
          Keep chats, payments and bookings in the app — that's how booking
          insurance, support and refunds apply.{" "}
          <Link
            to={`/contact${bookingId ? `?subject=Report%20user&booking=${bookingId}` : ""}`}
            className="inline-flex items-center gap-1 font-semibold text-salmon-deep hover:text-salmon"
          >
            <Flag className="h-3 w-3" /> Report
          </Link>
        </div>
      </div>
    </div>
  );
}
