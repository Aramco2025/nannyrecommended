import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const REGIONS = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Umm Al Quwain", "Fujairah"];

export default function OnboardingRegion() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const navigate = useNavigate();
  const [region, setRegion] = useState<string>(profile?.region ?? "");

  const next = async () => {
    if (!region) { toast({ title: "Pick an emirate", variant: "destructive" }); return; }
    try {
      await update.mutateAsync({ region });
      navigate("/onboarding/role");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={1} total={5}
      title="Where are you based?"
      subtitle="We'll show sitters near you."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>}
    >
      <ul className="grid gap-2">
        {REGIONS.map((r) => (
          <li key={r}>
            <button
              type="button"
              onClick={() => setRegion(r)}
              className={`flex w-full items-center justify-between rounded-2xl border bg-pure-white px-4 py-4 text-left transition ${region === r ? "border-pitch-black ring-2 ring-pitch-black/10" : "border-cream-deep hover:border-pitch-black/30"}`}
            >
              <span className="font-medium text-pitch-black">{r}</span>
              <span className={`h-4 w-4 rounded-full border-2 ${region === r ? "border-pitch-black bg-pitch-black" : "border-cream-deep"}`} />
            </button>
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
