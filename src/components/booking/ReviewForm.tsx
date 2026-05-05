import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function ReviewForm({
  bookingId,
  parentId,
  sitterId,
  onSubmitted,
}: {
  bookingId: string;
  parentId: string;
  sitterId: string;
  onSubmitted: () => void;
}) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (rating < 1) return;
    setBusy(true);
    const { error } = await supabase.from("reviews").insert({
      booking_id: bookingId,
      parent_id: parentId,
      sitter_id: sitterId,
      rating,
      comment: comment.trim() || null,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Thanks for your review!");
    onSubmitted();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <h3 className="text-base font-semibold text-pitch-black">How was your sit?</h3>
      <p className="mt-1 text-xs text-slate-grey">Your feedback helps other parents.</p>
      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            <Star
              className={`h-7 w-7 transition-colors ${
                (hover || rating) >= n ? "fill-salmon text-salmon" : "text-slate-grey"
              }`}
            />
          </button>
        ))}
      </div>
      <Textarea
        className="mt-4"
        rows={3}
        maxLength={1000}
        placeholder="Anything you'd like to share?"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <Button
        disabled={busy}
        onClick={submit}
        className="mt-4 w-full bg-salmon text-primary-foreground hover:bg-salmon-deep"
      >
        {busy ? "Sending…" : "Submit review"}
      </Button>
    </div>
  );
}
