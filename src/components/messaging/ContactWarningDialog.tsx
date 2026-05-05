import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  reasons: string[];
  onCancel: () => void;
  onConfirm: () => void;
};

/**
 * Soft, non-blocking warning shown when a user is about to send contact info.
 * Lets them proceed but explains the trade-off in plain language.
 */
export function ContactWarningDialog({ open, reasons, onCancel, onConfirm }: Props) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-salmon-soft text-salmon-deep">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-center font-display">
            Looks like you're sharing contact info
          </DialogTitle>
          <DialogDescription className="text-center">
            We spotted {reasons.join(", ")} in your message. Moving conversations
            off-platform means losing booking insurance, payment protection and
            our support team's help if anything goes wrong.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-1.5 rounded-xl bg-cream p-3 text-xs text-slate-grey">
          <li>• Payments are only protected when made in-app.</li>
          <li>• Insurance only covers confirmed in-app bookings.</li>
          <li>• Disputes need an in-app message trail to resolve.</li>
        </ul>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onCancel} className="rounded-full">
            Edit message
          </Button>
          <Button
            onClick={onConfirm}
            className="rounded-full bg-pitch-black text-pure-white hover:bg-pitch-black/90"
          >
            Send anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
