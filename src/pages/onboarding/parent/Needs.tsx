import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const NEEDS = [
  { id: "babysitting", label: "Occasional babysitting", emoji: "👶" },
  { id: "after_school", label: "After-school care", emoji: "🎒" },
  { id: "full_time", label: "Full-time nanny", emoji: "🏠" },
  { id: "night", label: "Night nanny / newborn", emoji: "🌙" },
  { id: "emergency", label: "Last-minute / emergency", emoji: "⚡" },
  { id: "tutoring", label: "Homework help / tutoring", emoji: "📚" },
];

export default function ParentNeeds() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const navigate = useNavigate();
  const [picked, setPicked] = useState<string[]>(profile?.care_needs ?? []);

  const toggle = (id: string) =>
    setPicked((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const next = async () => {
    if (picked.length === 0) { toast({ title: "Pick at least one", variant: "destructive" }); return; }
    try {
      await update.mutateAsync({ care_needs: picked });
      navigate("/onboarding/parent/family");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={5} total={5}
      title="What kind of help do you need?"
      subtitle="Pick all that apply — you can change this any time."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>}
    >
      <ul className="grid grid-cols-2 gap-2">
        {NEEDS.map((n) => {
          const on = picked.includes(n.id);
          return (
            <li key={n.id}>
              <button
                type="button"
                onClick={() => toggle(n.id)}
                className={`flex h-full w-full flex-col items-start gap-2 rounded-2xl border bg-pure-white p-4 text-left transition ${on ? "border-pitch-black ring-2 ring-pitch-black/10" : "border-cream-deep hover:border-pitch-black/30"}`}
              >
                <span className="text-2xl">{n.emoji}</span>
                <span className="font-medium text-pitch-black">{n.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </OnboardingShell>
  );
}
