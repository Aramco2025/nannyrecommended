import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function DeleteAccountSection() {
  return (
    <div className="mt-6 rounded-3xl border border-destructive/20 bg-card p-6 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-destructive">
        Danger zone
      </div>
      <h3 className="mt-2 font-display text-lg font-bold text-pitch-black">Delete my account</h3>
      <p className="mt-1 text-sm text-slate-grey">
        Permanently remove your profile. Booking history is anonymised so the people you've booked
        with keep their records intact.
      </p>
      <Button
        asChild
        variant="outline"
        className="mt-4 rounded-full border-destructive/40 text-destructive hover:bg-destructive/5"
      >
        <Link to="/account/delete">Delete account</Link>
      </Button>
    </div>
  );
}
