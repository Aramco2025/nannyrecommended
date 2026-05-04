import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

export default function ParentAddress() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const navigate = useNavigate();
  const [address, setAddress] = useState(profile?.address_line ?? "");

  const next = async () => {
    await update.mutateAsync({ address_line: address || null });
    navigate("/onboarding/parent/connect");
  };

  return (
    <OnboardingShell
      step={5} total={5}
      title="Where will sitters come?"
      subtitle="Optional. We only show this to confirmed sitters."
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button size="lg" variant="ghost" onClick={() => navigate("/onboarding/parent/connect")}>Skip</Button>
          <Button size="lg" className="bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>
        </div>
      }
    >
      <div className="rounded-2xl border border-cream-deep bg-pure-white p-4">
        <Label className="text-xs text-slate-grey">Building & area</Label>
        <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="e.g. Marina Heights, Dubai Marina" maxLength={200} />
      </div>
    </OnboardingShell>
  );
}
