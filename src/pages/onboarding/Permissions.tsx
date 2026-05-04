import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/hooks/useProfile";
import { Bell, MapPin, Camera } from "lucide-react";

const items = [
  { icon: Bell, title: "Notifications", body: "Booking confirmations, sitter messages, and reminders." },
  { icon: MapPin, title: "Location", body: "See sitters near you and let sitters check in to bookings." },
  { icon: Camera, title: "Camera & photos", body: "For your profile photo and ID verification (sitters only)." },
];

export default function OnboardingPermissions() {
  const { data: profile } = useProfile();
  const navigate = useNavigate();

  const next = () => {
    if (profile?.active_role === "sitter") navigate("/sitter/apply/eligibility");
    else navigate("/onboarding/parent/needs");
  };

  return (
    <OnboardingShell
      step={4} total={5}
      title="A few permissions"
      subtitle="We'll ask for these as you go. Nothing is required to continue."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next}>Continue</Button>}
    >
      <ul className="grid gap-3">
        {items.map((i) => (
          <li key={i.title} className="flex gap-4 rounded-2xl border border-cream-deep bg-pure-white p-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-salmon/15 text-salmon">
              <i.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-pitch-black">{i.title}</p>
              <p className="text-sm text-slate-grey">{i.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
