import { useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShieldAlert, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createDispute } from "@/hooks/useDisputes";

const REASONS = [
  { id: "no_show", label: "Sitter didn't show up" },
  { id: "left_early", label: "Sitter left early / cut sit short" },
  { id: "safety", label: "Safety or care concern" },
  { id: "overcharge", label: "Charged the wrong amount" },
  { id: "other", label: "Something else" },
];

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  bookingId: string;
  parentId: string;
  sitterId: string;
  onCreated?: () => void;
};

export function DisputeDialog({ open, onOpenChange, bookingId, parentId, sitterId, onCreated }: Props) {
  const [reason, setReason] = useState("no_show");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (description.trim().length < 20) {
      toast.error("Please add a few sentences so our team can investigate (min 20 chars).");
      return;
    }
    setBusy(true);
    try {
      await createDispute({ booking_id: bookingId, parent_id: parentId, sitter_id: sitterId, reason, description: description.trim() });
      toast.success("Dispute filed — our team will review within 24 hours.");
      onCreated?.();
      onOpenChange(false);
      setDescription("");
    } catch (e: any) {
      toast.error(e.message ?? "Could not file dispute");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-salmon-deep" /> Report a problem
          </DialogTitle>
          <DialogDescription>
            We hold your payment in escrow. Filing a dispute pauses release and routes this to our trust team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Reason</Label>
            <RadioGroup value={reason} onValueChange={setReason} className="space-y-1.5">
              {REASONS.map(r => (
                <label key={r.id} className="flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm cursor-pointer hover:bg-cream">
                  <RadioGroupItem value={r.id} id={r.id} />
                  <span>{r.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="dispute-desc" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">
              What happened?
            </Label>
            <Textarea
              id="dispute-desc"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell us what happened, when, and any details that help us investigate."
              rows={5}
              maxLength={2000}
            />
            <div className="mt-1 text-right text-[11px] text-slate-grey">{description.length}/2000</div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy} className="bg-salmon hover:bg-salmon-deep text-primary-foreground">
            {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Filing…</> : "File dispute"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
