import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useSitterApplication, useUpdateSitterApplication } from "@/hooks/useSitterApplication";
import { toast } from "@/hooks/use-toast";

const ITEMS: { key: "first_aid" | "cpr" | "early_years" | "teaching"; label: string; hint: string }[] = [
  { key: "first_aid", label: "Paediatric first aid", hint: "Valid certificate" },
  { key: "cpr", label: "CPR trained", hint: "Within last 2 years" },
  { key: "early_years", label: "Early years qualification", hint: "CACHE, NVQ, equivalent" },
  { key: "teaching", label: "Teaching qualification", hint: "PGCE, B.Ed, equivalent" },
];

export default function SitterQualifications() {
  const { data: app } = useSitterApplication();
  const update = useUpdateSitterApplication();
  const navigate = useNavigate();
  const [vals, setVals] = useState<Record<string, boolean>>({});
  const [other, setOther] = useState("");

  useEffect(() => {
    if (!app?.qualifications) return;
    setVals({
      first_aid: !!app.qualifications.first_aid,
      cpr: !!app.qualifications.cpr,
      early_years: !!app.qualifications.early_years,
      teaching: !!app.qualifications.teaching,
    });
    setOther(app.qualifications.other ?? "");
  }, [app]);

  const next = async () => {
    try {
      await update.mutateAsync({ qualifications: { ...vals, other } as any });
      navigate("/sitter/apply/id");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={3} total={7}
      title="Qualifications"
      subtitle="Tick what you hold. We'll ask for proof later."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>}
    >
      <ul className="grid gap-2">
        {ITEMS.map((q) => (
          <li key={q.key} className="flex items-center justify-between gap-4 rounded-2xl border border-cream-deep bg-pure-white p-4">
            <div>
              <p className="text-sm font-medium text-pitch-black">{q.label}</p>
              <p className="text-xs text-slate-grey">{q.hint}</p>
            </div>
            <Switch checked={!!vals[q.key]} onCheckedChange={(v) => setVals((p) => ({ ...p, [q.key]: v }))} />
          </li>
        ))}
      </ul>
      <div className="mt-6">
        <Label htmlFor="other">Other certifications (optional)</Label>
        <Input id="other" value={other} onChange={(e) => setOther(e.target.value)} maxLength={200} className="mt-1.5" placeholder="e.g. Montessori diploma" />
      </div>
    </OnboardingShell>
  );
}
