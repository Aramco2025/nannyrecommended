import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSitterApplication, useUpdateSitterApplication } from "@/hooks/useSitterApplication";
import { toast } from "@/hooks/use-toast";

type Ref = { name: string; relationship: string; phone: string; email?: string };

const blank = (): Ref => ({ name: "", relationship: "", phone: "", email: "" });

export default function SitterReferences() {
  const { data: app } = useSitterApplication();
  const update = useUpdateSitterApplication();
  const navigate = useNavigate();
  const [refs, setRefs] = useState<Ref[]>([blank(), blank()]);

  useEffect(() => {
    if (app?.references_data?.length) {
      const filled = [...app.references_data];
      while (filled.length < 2) filled.push(blank());
      setRefs(filled);
    }
  }, [app]);

  const updateRef = (i: number, key: keyof Ref, val: string) =>
    setRefs((p) => p.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)));

  const next = async () => {
    const valid = refs.slice(0, 2).every((r) => r.name.trim() && r.relationship.trim() && r.phone.trim().length >= 7);
    if (!valid) {
      toast({ title: "Please complete both references", description: "Name, relationship and phone are required.", variant: "destructive" });
      return;
    }
    try {
      await update.mutateAsync({ references_data: refs.slice(0, 2) });
      navigate("/sitter/apply/bio");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={5} total={7}
      title="Two professional references"
      subtitle="Previous employers, agency contacts, or families you've worked with."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>}
    >
      <div className="space-y-6">
        {refs.slice(0, 2).map((r, i) => (
          <div key={i} className="rounded-2xl border border-cream-deep bg-pure-white p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-grey">Reference {i + 1}</p>
            <div className="grid gap-3">
              <div>
                <Label htmlFor={`name-${i}`}>Full name</Label>
                <Input id={`name-${i}`} value={r.name} onChange={(e) => updateRef(i, "name", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor={`rel-${i}`}>Relationship</Label>
                <Input id={`rel-${i}`} placeholder="e.g. Former employer" value={r.relationship} onChange={(e) => updateRef(i, "relationship", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor={`phone-${i}`}>Phone</Label>
                <Input id={`phone-${i}`} type="tel" value={r.phone} onChange={(e) => updateRef(i, "phone", e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor={`email-${i}`}>Email (optional)</Label>
                <Input id={`email-${i}`} type="email" value={r.email ?? ""} onChange={(e) => updateRef(i, "email", e.target.value)} className="mt-1.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </OnboardingShell>
  );
}
