import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

export default function OnboardingPhone() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const navigate = useNavigate();
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);

  const send = () => {
    if (phone.replace(/\D/g, "").length < 7) {
      toast({ title: "Enter a valid phone number", variant: "destructive" }); return;
    }
    setSent(true);
    toast({ title: "Code sent", description: "Use 0000 in this preview." });
  };

  const verify = async () => {
    if (code !== "0000") {
      toast({ title: "Wrong code", description: "Use 0000 in this preview.", variant: "destructive" });
      return;
    }
    try {
      await update.mutateAsync({ phone, phone_verified: true });
      navigate("/onboarding/permissions");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={3} total={5}
      title="Verify your phone"
      subtitle="We use it for booking confirmations and emergencies — never for marketing."
      footer={
        <Button
          size="lg"
          className="w-full bg-pitch-black text-pure-white"
          onClick={sent ? verify : send}
          disabled={update.isPending}
        >
          {sent ? "Verify" : "Send code"}
        </Button>
      }
    >
      <div className="space-y-4 rounded-2xl border border-cream-deep bg-pure-white p-4">
        <div>
          <Label className="text-xs text-slate-grey">Mobile number</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+971 50 123 4567" disabled={sent} maxLength={32} />
        </div>
        {sent && (
          <div>
            <Label className="text-xs text-slate-grey">6-digit code</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="0000" maxLength={6} inputMode="numeric" />
            <button type="button" className="mt-2 text-xs text-slate-grey underline" onClick={() => { setSent(false); setCode(""); }}>
              Use a different number
            </button>
          </div>
        )}
      </div>
    </OnboardingShell>
  );
}
