import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Check, Pencil } from "lucide-react";
import { useSitterApplication, useUpdateSitterApplication } from "@/hooks/useSitterApplication";
import { toast } from "@/hooks/use-toast";

function Row({ label, value, edit }: { label: string; value: string; edit: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-cream-deep bg-pure-white p-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-grey">{label}</p>
        <p className="mt-1 text-sm text-pitch-black">{value || "—"}</p>
      </div>
      <button onClick={() => navigate(edit)} className="flex items-center gap-1 text-xs font-medium text-pitch-black hover:underline">
        <Pencil className="h-3 w-3" /> Edit
      </button>
    </div>
  );
}

export default function SitterReview() {
  const { data: app, isLoading } = useSitterApplication();
  const update = useUpdateSitterApplication();
  const navigate = useNavigate();

  const submit = async () => {
    if (!app) return;
    if (!app.id_doc_url) {
      toast({ title: "ID required", description: "Please upload your ID before submitting.", variant: "destructive" });
      navigate("/sitter/apply/id");
      return;
    }
    if (!app.references_data || app.references_data.length < 2) {
      toast({ title: "References missing", variant: "destructive" });
      navigate("/sitter/apply/references");
      return;
    }
    try {
      await update.mutateAsync({ status: "submitted", submitted_at: new Date().toISOString() } as any);
      navigate("/sitter/apply/pending");
    } catch (e: any) {
      toast({ title: "Couldn't submit", description: e.message, variant: "destructive" });
    }
  };

  if (isLoading || !app) {
    return <OnboardingShell step={7} total={7} title="Review & submit"><p className="text-slate-grey">Loading…</p></OnboardingShell>;
  }

  const exp = app.experience ?? {};
  const qual = app.qualifications ?? {};
  const qualList = [
    qual.first_aid && "First aid",
    qual.cpr && "CPR",
    qual.early_years && "Early years",
    qual.teaching && "Teaching",
    qual.other,
  ].filter(Boolean).join(", ");

  return (
    <OnboardingShell
      step={7} total={7}
      title="Review & submit"
      subtitle="Take one last look. We'll review within 2-3 business days."
      footer={
        <Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={submit} disabled={update.isPending}>
          <Check className="mr-2 h-4 w-4" /> Submit application
        </Button>
      }
    >
      <div className="space-y-3">
        <Row
          label="Experience"
          value={exp.years ? `${exp.years} years · ${(exp.age_groups ?? []).join(", ")}` : ""}
          edit="/sitter/apply/experience"
        />
        <Row label="Qualifications" value={qualList} edit="/sitter/apply/qualifications" />
        <Row label="ID document" value={app.id_doc_url ? "Uploaded" : "Missing"} edit="/sitter/apply/id" />
        <Row
          label="References"
          value={app.references_data?.length ? `${app.references_data.length} on file` : "None"}
          edit="/sitter/apply/references"
        />
        <Row
          label="Bio"
          value={app.bio ? `${app.bio.slice(0, 80)}${app.bio.length > 80 ? "…" : ""}` : ""}
          edit="/sitter/apply/bio"
        />
        <Row label="Intro video" value={app.video_url ? "Uploaded" : "Skipped"} edit="/sitter/apply/bio" />
      </div>
    </OnboardingShell>
  );
}
