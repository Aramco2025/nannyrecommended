import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Users, Sparkles } from "lucide-react";

export default function ParentConnect() {
  const navigate = useNavigate();
  return (
    <OnboardingShell
      step={5} total={5}
      title="Connect with friends"
      subtitle="See which sitters parents you trust have already booked."
      footer={
        <div className="grid grid-cols-2 gap-2">
          <Button size="lg" variant="ghost" onClick={() => navigate("/onboarding/parent/done")}>Skip for now</Button>
          <Button size="lg" className="bg-pitch-black text-pure-white" onClick={() => navigate("/friends")}>Find friends</Button>
        </div>
      }
    >
      <div className="rounded-3xl border border-cream-deep bg-pure-white p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-salmon/15 text-salmon">
          <Users className="h-7 w-7" />
        </div>
        <p className="mt-4 font-semibold text-pitch-black">Trust badges from friends</p>
        <p className="mt-1 text-sm text-slate-grey">When you connect with another parent, you'll see "Trusted by 3 friends" on sitters they've favourited.</p>
        <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-cream px-3 py-1 text-xs font-medium text-pitch-black">
          <Sparkles className="h-3 w-3 text-salmon" /> Most parents add 5+ friends
        </div>
      </div>
    </OnboardingShell>
  );
}
