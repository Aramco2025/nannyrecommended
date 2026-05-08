import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Clock, MessageSquare, MapPin } from "lucide-react";

type Props = {
  bookingId: string;
  startAt: string;
  address?: string | null;
  status: string;
};

const STORAGE_KEY = "nr_presit_reminder_dismissed";

export function PreSitReminder({ bookingId, startAt, address, status }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!["pending", "confirmed"].includes(status)) return;
    const dismissed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]") as string[];
    if (dismissed.includes(bookingId)) return;
    const start = new Date(startAt).getTime();
    const now = Date.now();
    const diffMins = (start - now) / 60_000;
    // Fire if within 2 hours and not yet started
    if (diffMins > 0 && diffMins <= 120) setOpen(true);
  }, [bookingId, startAt, status]);

  const dismiss = () => {
    const dismissed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]") as string[];
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...dismissed, bookingId]));
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && dismiss()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-salmon-deep" /> Your sit starts soon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Quick checklist: confirm timing in chat, share the door code if any, and make sure the address is right.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="grid gap-2">
          <Link
            to={`/messages/${bookingId}`}
            onClick={dismiss}
            className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-pitch-black hover:bg-cream"
          >
            <MessageSquare className="h-4 w-4 text-salmon-deep" /> Open chat
          </Link>
          {address && (
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noreferrer"
              onClick={dismiss}
              className="flex items-center gap-3 rounded-xl border border-border p-3 text-sm font-medium text-pitch-black hover:bg-cream"
            >
              <MapPin className="h-4 w-4 text-salmon-deep" /> Get directions
            </a>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Got it</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Link to={`/bookings/${bookingId}`}>View booking</Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
