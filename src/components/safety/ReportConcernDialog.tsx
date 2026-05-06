import { useState } from "react";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Flag, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "safety", label: "Safety concern" },
  { value: "inappropriate", label: "Inappropriate behaviour or content" },
  { value: "fake_profile", label: "Suspected fake profile" },
  { value: "harassment", label: "Harassment or unwanted contact" },
  { value: "other", label: "Other" },
];

type Props = {
  reportedSitterId?: string;
  reportedUserId?: string;
  triggerLabel?: string;
};

export function ReportConcernDialog({ reportedSitterId, reportedUserId, triggerLabel = "Report a concern" }: Props) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<string>("safety");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!user) {
      toast({ title: "Please sign in to report", variant: "destructive" });
      return;
    }
    if (description.trim().length < 10) {
      toast({ title: "Add a few more details", description: "Tell us what happened (10+ characters).", variant: "destructive" });
      return;
    }
    setBusy(true);
    const { error } = await supabase.from("safety_reports").insert({
      reporter_id: user.id,
      reported_sitter_id: reportedSitterId ?? null,
      reported_user_id: reportedUserId ?? null,
      category,
      description: description.trim().slice(0, 2000),
    });
    setBusy(false);
    if (error) {
      toast({ title: "Couldn't submit report", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Thank you — we're on it",
      description: "Our trust team reviews every report within 4 hours during operating hours.",
    });
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-full text-slate-grey">
          <Flag className="mr-1.5 h-3.5 w-3.5" /> {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report a concern</DialogTitle>
          <DialogDescription>
            Help us keep families safe. We review every report personally and never share your name with the person you're reporting.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-grey">What's the concern?</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-grey">Tell us what happened</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Be as specific as you can. Include dates and any messages or behaviours."
              rows={5}
              maxLength={2000}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancel</Button>
          <Button onClick={submit} disabled={busy}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
