import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitParentReview } from "@/hooks/useParentReviews";

export function ParentRatingForm({
  bookingId, parentId, sitterId, parentName, onSubmitted,
}: {
  bookingId: string; parentId: string; sitterId: string;
  parentName: string; onSubmitted?: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!rating) return toast.error("Please pick a star rating");
    setBusy(true);
    try {
      await submitParentReview({ bookingId, parentId, sitterId, rating, comment });
      toast.success("Thanks for rating the family — it stays private to you and our team.");
      onSubmitted?.();
    } catch (e: any) { toast.error(e.message); }
    finally { setBusy(false); }
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-card">
      <div className="text-xs uppercase tracking-wider text-slate-grey">Rate this family</div>
      <h3 className="mt-1 font-display text-lg font-bold text-pitch-black">How was your experience with {parentName}?</h3>
      <p className="mt-1 text-xs text-slate-grey">Helps us match you with great families and improves quality across the platform. Only visible to you and our team.</p>

      <div className="mt-4 flex items-center gap-1">
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button"
            onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            className="p-1">
            <Star className={`h-7 w-7 ${(hover || rating) >= n ? "fill-salmon text-salmon" : "text-cream-deep"}`} />
          </button>
        ))}
      </div>

      <Textarea
        className="mt-3"
        placeholder="Optional notes (clear instructions, on-time payment, friendly children…)"
        maxLength={1000}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <Button onClick={submit} disabled={busy || !rating}
        className="mt-4 w-full rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90">
        Submit rating
      </Button>
    </div>
  );
}
