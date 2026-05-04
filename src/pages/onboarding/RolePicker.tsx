import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Baby, Briefcase } from "lucide-react";

type Choice = "parent" | "sitter" | "both";

export default function OnboardingRole() {
  const { data: profile } = useProfile();
  const { user, refreshRoles } = useAuth();
  const update = useUpdateProfile();
  const navigate = useNavigate();
  const [choice, setChoice] = useState<Choice | "">("");

  const next = async () => {
    if (!choice || !user) return;
    try {
      const desired: ("parent" | "sitter")[] = choice === "both" ? ["parent", "sitter"] : [choice];
      const rows = desired.map((role) => ({ user_id: user.id, role }));
      // upsert ignoring duplicates
      for (const r of rows) {
        await supabase.from("user_roles").insert(r as any);
      }
      const active = choice === "both" ? "parent" : (choice as "parent" | "sitter");
      await update.mutateAsync({ active_role: active });
      await refreshRoles();
      navigate("/onboarding/phone");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  const options: { id: Choice; icon: any; title: string; body: string }[] = [
    { id: "parent", icon: Baby, title: "I need childcare", body: "Find and book trusted sitters." },
    { id: "sitter", icon: Briefcase, title: "I want to work as a sitter", body: "Apply to families and earn." },
    { id: "both", icon: Baby, title: "Both", body: "Switch roles anytime from your account." },
  ];

  return (
    <OnboardingShell
      step={2} total={5}
      title="What brings you here?"
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={!choice || update.isPending}>Continue</Button>}
    >
      <ul className="grid gap-3">
        {options.map((o) => (
          <li key={o.id}>
            <button
              type="button"
              onClick={() => setChoice(o.id)}
              className={`flex w-full items-start gap-4 rounded-2xl border bg-pure-white p-4 text-left transition ${choice === o.id ? "border-pitch-black ring-2 ring-pitch-black/10" : "border-cream-deep hover:border-pitch-black/30"}`}
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-salmon/15 text-salmon">
                <o.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-pitch-black">{o.title}</p>
                <p className="text-sm text-slate-grey">{o.body}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </OnboardingShell>
  );
}
