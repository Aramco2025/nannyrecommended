import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useUpdateProfile } from "@/hooks/useProfile";

export default function ParentDone() {
  const update = useUpdateProfile();
  const navigate = useNavigate();

  useEffect(() => {
    update.mutate({ onboarding_completed: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OnboardingShell
      step={5} total={5}
      title="You're all set"
      subtitle="Let's find you a sitter."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={() => navigate("/sitters")}>Browse sitters</Button>}
    >
      <div className="rounded-3xl border border-cream-deep bg-pure-white p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-salmon/15 text-salmon">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <p className="mt-4 text-lg font-semibold text-pitch-black">Welcome to NannyRecommended</p>
        <p className="mt-1 text-sm text-slate-grey">You can always update your family, address, and preferences from your account.</p>
      </div>
    </OnboardingShell>
  );
}
