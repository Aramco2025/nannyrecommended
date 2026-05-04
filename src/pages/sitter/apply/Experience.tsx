import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useSitterApplication, useUpdateSitterApplication } from "@/hooks/useSitterApplication";
import { toast } from "@/hooks/use-toast";

const AGE_GROUPS = ["Newborn (0-12mo)", "Toddler (1-3y)", "Preschool (3-5y)", "School age (6-11y)", "Teen (12+)"];
const SETTINGS = ["Family home", "Nursery / daycare", "School", "Special needs", "Maternity nurse"];

export default function SitterExperience() {
  const { data: app } = useSitterApplication();
  const update = useUpdateSitterApplication();
  const navigate = useNavigate();
  const [years, setYears] = useState<string>("");
  const [ageGroups, setAgeGroups] = useState<string[]>([]);
  const [settings, setSettings] = useState<string[]>([]);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (!app?.experience) return;
    setYears(app.experience.years?.toString() ?? "");
    setAgeGroups(app.experience.age_groups ?? []);
    setSettings(app.experience.settings ?? []);
    setSummary(app.experience.summary ?? "");
  }, [app]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string) =>
    setArr(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const next = async () => {
    const y = parseFloat(years);
    if (!y || y < 0.5) {
      toast({ title: "Add your years of experience", variant: "destructive" });
      return;
    }
    if (ageGroups.length === 0) {
      toast({ title: "Pick at least one age group", variant: "destructive" });
      return;
    }
    try {
      await update.mutateAsync({
        experience: { years: y, age_groups: ageGroups, settings, summary },
      });
      navigate("/sitter/apply/qualifications");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={2} total={7}
      title="Your experience"
      subtitle="Tell us where and with whom you've worked."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>}
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="years">Years of childcare experience</Label>
          <Input id="years" type="number" min="0.5" step="0.5" value={years} onChange={(e) => setYears(e.target.value)} className="mt-1.5" placeholder="e.g. 3" />
        </div>

        <div>
          <Label>Age groups you've cared for</Label>
          <div className="mt-2 grid gap-2">
            {AGE_GROUPS.map((g) => (
              <label key={g} className="flex items-center gap-3 rounded-2xl border border-cream-deep bg-pure-white p-3">
                <Checkbox checked={ageGroups.includes(g)} onCheckedChange={() => toggle(ageGroups, setAgeGroups, g)} />
                <span className="text-sm text-pitch-black">{g}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Settings you've worked in</Label>
          <div className="mt-2 grid gap-2">
            {SETTINGS.map((s) => (
              <label key={s} className="flex items-center gap-3 rounded-2xl border border-cream-deep bg-pure-white p-3">
                <Checkbox checked={settings.includes(s)} onCheckedChange={() => toggle(settings, setSettings, s)} />
                <span className="text-sm text-pitch-black">{s}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="summary">Brief summary (optional)</Label>
          <Textarea id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} maxLength={500} className="mt-1.5" placeholder="A sentence or two about your most recent role." />
        </div>
      </div>
    </OnboardingShell>
  );
}
