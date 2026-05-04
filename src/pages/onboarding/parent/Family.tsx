import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Child = { id?: string; name: string; dob: string };

export default function ParentFamily() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [kids, setKids] = useState<Child[]>([{ name: "", dob: "" }]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("children").select("*").eq("parent_id", user.id).then(({ data }) => {
      if (data && data.length) setKids(data.map((d: any) => ({ id: d.id, name: d.name, dob: d.dob ?? "" })));
    });
  }, [user]);

  const update = (i: number, patch: Partial<Child>) =>
    setKids((prev) => prev.map((k, idx) => (idx === i ? { ...k, ...patch } : k)));
  const add = () => setKids((p) => [...p, { name: "", dob: "" }]);
  const remove = (i: number) => setKids((p) => p.filter((_, idx) => idx !== i));

  const next = async () => {
    if (!user) return;
    const valid = kids.filter((k) => k.name.trim());
    if (valid.length === 0) { toast({ title: "Add at least one child", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const rows = valid.map((k) => ({
        parent_id: user.id,
        name: k.name.trim(),
        dob: k.dob || null,
      }));
      // simple replace: delete + insert
      await supabase.from("children").delete().eq("parent_id", user.id);
      const { error } = await supabase.from("children").insert(rows);
      if (error) throw error;
      navigate("/onboarding/parent/address");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <OnboardingShell
      step={5} total={5}
      title="Tell us about your children"
      subtitle="Sitters use ages to know if they're the right fit."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={saving}>Continue</Button>}
    >
      <ul className="grid gap-3">
        {kids.map((k, i) => (
          <li key={i} className="rounded-2xl border border-cream-deep bg-pure-white p-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-slate-grey">First name</Label>
                <Input value={k.name} onChange={(e) => update(i, { name: e.target.value })} maxLength={60} />
              </div>
              <div>
                <Label className="text-xs text-slate-grey">Date of birth</Label>
                <Input type="date" value={k.dob} onChange={(e) => update(i, { dob: e.target.value })} />
              </div>
            </div>
            {kids.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="mt-2 inline-flex items-center gap-1 text-xs text-slate-grey hover:text-pitch-black">
                <Trash2 className="h-3 w-3" /> Remove
              </button>
            )}
          </li>
        ))}
      </ul>
      <button type="button" onClick={add} className="mt-3 inline-flex items-center gap-2 rounded-full border border-cream-deep bg-pure-white px-4 py-2 text-sm font-medium text-pitch-black hover:border-pitch-black/30">
        <Plus className="h-4 w-4" /> Add another child
      </button>
    </OnboardingShell>
  );
}
