import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ShieldAlert } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const QUESTIONS = [
  { id: "age18", label: "I am 18 years or older" },
  { id: "right_to_work", label: "I have the right to work in the UAE" },
  { id: "experience", label: "I have at least 6 months of childcare experience" },
  { id: "references", label: "I can provide 2 professional references" },
  { id: "id", label: "I can provide a valid government ID" },
];

export default function SitterEligibility() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [saving, setSaving] = useState(false);

  const allYes = QUESTIONS.every((q) => answers[q.id]);

  const next = async () => {
    if (!user) return;
    if (!allYes) {
      toast({ title: "Sorry, you're not eligible yet", description: "All five must be true to continue. You can come back when ready.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await supabase.from("sitter_applications").upsert({
        sitter_user_id: user.id,
        eligibility: answers,
        status: "draft",
      } as any, { onConflict: "sitter_user_id" });
      navigate("/sitter/apply/experience");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    } finally { setSaving(false); }
  };

  return (
    <OnboardingShell
      step={1} total={7}
      title="Quick eligibility check"
      subtitle="We're a selective platform. Five quick questions before you start."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={saving}>Continue</Button>}
    >
      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-salmon/30 bg-salmon/5 p-4 text-sm text-pitch-black">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-salmon" />
        <p>Answer honestly. We verify each item before approving your profile.</p>
      </div>
      <ul className="grid gap-2">
        {QUESTIONS.map((q) => (
          <li key={q.id} className="flex items-center justify-between gap-4 rounded-2xl border border-cream-deep bg-pure-white p-4">
            <span className="text-sm font-medium text-pitch-black">{q.label}</span>
            <Switch checked={!!answers[q.id]} onCheckedChange={(v) => setAnswers((p) => ({ ...p, [q.id]: v }))} />
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
