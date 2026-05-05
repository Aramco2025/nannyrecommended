import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpsertChild, type Child } from "@/hooks/useChildren";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil } from "lucide-react";

export function ChildEditor({ child, trigger }: { child?: Child; trigger?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: child?.name ?? "",
    dob: child?.dob ?? "",
    notes: child?.notes ?? "",
  });
  const upsert = useUpsertChild();

  const submit = async () => {
    if (!form.name.trim()) {
      toast({ title: "Name required", variant: "destructive" });
      return;
    }
    try {
      await upsert.mutateAsync({
        id: child?.id,
        name: form.name.trim(),
        dob: form.dob || null,
        notes: form.notes.trim() || null,
      });
      toast({ title: child ? "Updated" : "Child added" });
      setOpen(false);
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button size="sm" className="rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
            {child ? <><Pencil className="h-3.5 w-3.5" /> Edit</> : <><Plus className="h-3.5 w-3.5" /> Add child</>}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle className="font-display">{child ? "Edit child" : "Add a child"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-grey">Name</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} maxLength={60} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-grey">Date of birth</Label>
            <Input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-grey">Notes (allergies, routines, anything sitters should know)</Label>
            <Textarea rows={4} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={1000} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={upsert.isPending} className="bg-salmon text-primary-foreground hover:bg-salmon-deep">
            {upsert.isPending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
