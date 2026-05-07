import { useEffect, useMemo, useState } from "react";
import { Loader2, Calendar, Users, ShieldCheck, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/fees";

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bookingId: string;
  startAt: string;
  total: number;
  status: string;
  role: "parent" | "sitter";
  /** When known, used to find similar sitters as alternatives. */
  area?: string | null;
  excludeSitterId?: string;
  onCancelled?: () => void;
};

type Alt = {
  id: string;
  full_name: string | null;
  photos: string[] | null;
  hourly_rate_aed: number;
  area: string | null;
  rating: number;
};

/**
 * Asymmetric cancellation policy with an alternatives flow:
 *  - Parent: graduated fee, full breakdown shown BEFORE confirming
 *  - Sitter: free, but reliability impact warned
 * Always offers "find a replacement" to keep the user in the funnel.
 */
export function CancelBookingDialog({
  open, onOpenChange, bookingId, startAt, total, status, role,
  area, excludeSitterId, onCancelled,
}: Props) {
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [alts, setAlts] = useState<Alt[] | null>(null);
  const [step, setStep] = useState<"review" | "confirm" | "alternatives">("review");

  const policy = useMemo(() => computePolicy({ startAt, total, status, role }), [startAt, total, status, role]);

  useEffect(() => {
    if (!open || role !== "parent") return;
    let q = supabase
      .from("sitters")
      .select("id, full_name, photos, hourly_rate_aed, area, rating")
      .eq("is_active", true)
      .order("rating", { ascending: false })
      .limit(4);
    if (excludeSitterId) q = q.neq("id", excludeSitterId);
    if (area) q = q.ilike("area", `%${area}%`);
    q.then(({ data }) => setAlts((data ?? []) as Alt[]));
  }, [open, area, excludeSitterId, role]);

  const submit = async () => {
    setBusy(true);
    const { error } = await supabase.rpc("cancel_booking", {
      _booking: bookingId,
      _reason: reason.trim(),
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success(role === "parent" ? "Booking cancelled — refund processed" : "Booking cancelled");
    onCancelled?.();
    if (role === "parent") setStep("alternatives");
    else onOpenChange(false);
  };

  const isParent = role === "parent";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        {step !== "alternatives" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-salmon-deep" />
                Cancel this booking?
              </DialogTitle>
              <DialogDescription>
                {isParent
                  ? "We show the fee before you confirm — no surprises."
                  : "Cancellations affect your reliability score. Please only cancel if you must."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-off-white p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-grey">Booking total</span>
                  <span className="font-medium text-pitch-black">{formatCurrency(total)}</span>
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-slate-grey">{policy.feeLabel}</span>
                  <span className={`font-medium ${policy.fee > 0 ? "text-salmon-deep" : "text-success-green"}`}>
                    {policy.fee > 0 ? `− ${formatCurrency(policy.fee)}` : "AED 0"}
                  </span>
                </div>
                <div className="my-2 h-px bg-border" />
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-pitch-black">
                    {isParent ? "You'll be refunded" : "Parent will be refunded"}
                  </span>
                  <span className="font-semibold text-pitch-black tabular-nums">
                    {formatCurrency(policy.refund)}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-grey">{policy.explainer}</p>
              </div>

              <div>
                <Label htmlFor="cancel-reason" className="text-sm">
                  Reason {isParent ? "(optional)" : "(required)"}
                </Label>
                <Textarea
                  id="cancel-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder={isParent ? "Plans changed, child unwell…" : "Why can't you make it?"}
                  className="mt-1.5"
                />
              </div>

              {!isParent && (
                <div className="rounded-xl border border-salmon/30 bg-salmon/5 p-3 text-xs text-salmon-deep">
                  <strong>Reliability impact:</strong> sitter cancellations are recorded.
                  Frequent cancellations reduce your job-match priority.
                </div>
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
                Keep booking
              </Button>
              <Button
                onClick={submit}
                disabled={busy || (!isParent && reason.trim().length < 5)}
                className="bg-salmon hover:bg-salmon-deep text-primary-foreground"
              >
                {busy && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                Confirm cancellation
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-success-green" />
                Cancelled — let's find a replacement
              </DialogTitle>
              <DialogDescription>
                Your refund is on the way. Here are sitters available right now in your area.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              {alts === null ? (
                <div className="py-6 text-center text-sm text-slate-grey">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                </div>
              ) : alts.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border p-4 text-sm text-slate-grey">
                  No similar sitters available. Try posting a job — sitters apply within hours.
                </div>
              ) : (
                alts.map((a) => (
                  <Link
                    key={a.id}
                    to={`/sitters/${a.id}`}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 hover:border-salmon"
                  >
                    <img
                      src={a.photos?.[0] ?? ""}
                      alt=""
                      className="h-12 w-12 rounded-full bg-muted object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-pitch-black">{a.full_name ?? "Sitter"}</div>
                      <div className="text-xs text-slate-grey">
                        {a.area ?? ""} · {formatCurrency(Number(a.hourly_rate_aed))}/hr · ★ {Number(a.rating).toFixed(1)}
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <DialogFooter className="gap-2">
              <Button asChild variant="outline">
                <Link to="/parent/post-job/start" onClick={() => onOpenChange(false)}>
                  <Users className="mr-1 h-4 w-4" /> Book a sit
                </Link>
              </Button>
              <Button
                asChild
                className="bg-salmon hover:bg-salmon-deep text-primary-foreground"
              >
                <Link to="/sitters" onClick={() => onOpenChange(false)}>
                  <Calendar className="mr-1 h-4 w-4" /> Browse sitters
                </Link>
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function computePolicy({
  startAt, total, status, role,
}: { startAt: string; total: number; status: string; role: "parent" | "sitter" }) {
  if (role === "sitter") {
    return {
      fee: 0,
      refund: total,
      feeLabel: "Cancellation fee",
      explainer:
        "When sitters cancel, the parent is always fully refunded. We log it against your reliability score.",
    };
  }
  const hours = (new Date(startAt).getTime() - Date.now()) / 3_600_000;
  if (status === "in_progress") {
    return {
      fee: total, refund: 0,
      feeLabel: "In-progress cancel fee",
      explainer: "The sit has started, so the full booking is non-refundable.",
    };
  }
  if (hours >= 24) return { fee: 0, refund: total, feeLabel: "Cancellation fee", explainer: "Free cancellation — more than 24h before the start time." };
  if (hours >= 6) {
    const fee = Math.round(total * 0.25 * 100) / 100;
    return { fee, refund: total - fee, feeLabel: "Cancellation fee (25%, 6–24h notice)", explainer: "Inside 24 hours, sitters often turn down other work to hold your slot." };
  }
  const fee = Math.round(total * 0.5 * 100) / 100;
  return { fee, refund: total - fee, feeLabel: "Cancellation fee (50%, under 6h notice)", explainer: "Last-minute cancels make it hard for sitters to rebook the slot." };
}
