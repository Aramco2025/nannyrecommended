import { useState } from "react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Ban, Loader2 } from "lucide-react";

/**
 * Apple guideline 1.2 requires a way to block other users in apps with UGC.
 * Inserts into `blocked_users`. Messaging UI can hide threads where the
 * other party is in this list.
 */
export function BlockUserButton({ blockedUserId, displayName }: { blockedUserId: string; displayName?: string }) {
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);

  const handleBlock = async () => {
    if (!user || user.id === blockedUserId) return;
    setBusy(true);
    const { error } = await supabase.from("blocked_users").insert({
      blocker_id: user.id,
      blocked_id: blockedUserId,
    });
    setBusy(false);
    setOpen(false);
    if (error && !error.message.includes("duplicate")) {
      toast({ title: "Couldn't block", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `${displayName ?? "User"} blocked`, description: "You won't see messages or content from them again." });
  };

  if (!user || user.id === blockedUserId) return null;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-slate-grey">
          <Ban className="mr-1.5 h-3.5 w-3.5" /> Block
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Block {displayName ?? "this person"}?</AlertDialogTitle>
          <AlertDialogDescription>
            They won't be able to message you and you won't see their profile or activity. You can unblock from your account settings later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => { e.preventDefault(); handleBlock(); }}
            disabled={busy}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yes, block"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
