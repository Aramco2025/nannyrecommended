import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, ArrowLeft, ShieldAlert, CheckCircle2, Upload, X } from "lucide-react";
import { createDispute } from "@/hooks/useDisputes";
import { toast } from "sonner";

const REASONS = [
  { id: "no_show", label: "Sitter didn't show up" },
  { id: "left_early", label: "Sitter left early / cut sit short" },
  { id: "safety", label: "Safety or care concern" },
  { id: "overcharge", label: "Charged the wrong amount" },
  { id: "other", label: "Something else" },
];

const OUTCOMES = [
  { id: "full_refund", label: "Full refund" },
  { id: "partial_refund", label: "Partial refund" },
  { id: "warning", label: "Investigation only — no refund needed" },
  { id: "other", label: "Something else (we'll discuss)" },
];

type B = {
  id: string; parent_id: string; sitter_id: string;
  sitters?: { user_id: string | null } | null;
};

type Step = "what" | "when" | "evidence" | "outcome" | "done";

export default function BookingDispute() {
  const { id } = useParams();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [b, setB] = useState<B | null>(null);
  const [step, setStep] = useState<Step>("what");
  const [reason, setReason] = useState("no_show");
  const [description, setDescription] = useState("");
  const [whenAt, setWhenAt] = useState<string>("");
  const [evidence, setEvidence] = useState<string[]>([]);
  const [outcome, setOutcome] = useState("partial_refund");
  const [outcomeNote, setOutcomeNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!id) return;
    supabase.from("bookings")
      .select("id, parent_id, sitter_id, sitters:sitter_id(user_id)")
      .eq("id", id).maybeSingle().then(({ data }) => setB(data as any));
  }, [id]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;
  if (!b) return <div className="min-h-screen bg-background"><Header /><main className="container py-12 text-center text-sm text-slate-grey">Loading…</main></div>;
  if (b.parent_id !== user.id) return <Navigate to={`/bookings/${b.id}`} replace />;

  const upload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 5)) {
        const path = `${user.id}/${b.id}/${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from("verification-docs").upload(path, file, { upsert: false });
        if (error) throw error;
        const { data } = supabase.storage.from("verification-docs").getPublicUrl(path);
        urls.push(data.publicUrl);
      }
      setEvidence((e) => [...e, ...urls]);
      toast.success(`${urls.length} file(s) uploaded`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    if (description.trim().length < 20) {
      toast.error("Please add at least 20 characters describing what happened.");
      setStep("what");
      return;
    }
    setBusy(true);
    try {
      const fullDesc = [
        description.trim(),
        whenAt ? `\n\nWhen: ${whenAt}` : "",
        `\n\nPreferred outcome: ${OUTCOMES.find(o => o.id === outcome)?.label}${outcomeNote ? ` — ${outcomeNote}` : ""}`,
      ].join("");
      await createDispute({
        booking_id: b.id,
        parent_id: b.parent_id,
        sitter_id: b.sitter_id,
        reason,
        description: fullDesc,
        evidence_urls: evidence,
      });
      setStep("done");
    } catch (e: any) {
      toast.error(e.message ?? "Could not file dispute");
    } finally {
      setBusy(false);
    }
  };

  const StepHeader = ({ n, title }: { n: number; title: string }) => (
    <div className="mb-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-salmon-deep">Step {n} of 4</div>
      <h2 className="mt-1 font-display text-xl font-bold text-pitch-black">{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-xl py-8">
        <Link to={`/bookings/${b.id}`} className="inline-flex items-center gap-2 text-sm text-slate-grey hover:text-pitch-black">
          <ArrowLeft className="h-4 w-4" /> Back to booking
        </Link>

        <div className="mt-4 flex items-center gap-2 text-pitch-black">
          <ShieldAlert className="h-5 w-5 text-salmon-deep" />
          <h1 className="font-display text-2xl font-bold">Report a problem</h1>
        </div>
        <p className="mt-1 text-sm text-slate-grey">
          We hold your payment in escrow. Filing a dispute pauses release and routes this to our trust team — typical response within 24 hours.
        </p>

        <section className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-card">
          {step === "what" && (
            <>
              <StepHeader n={1} title="What happened?" />
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Reason</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-1.5">
                {REASONS.map((r) => (
                  <label key={r.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-cream">
                    <RadioGroupItem value={r.id} id={r.id} />
                    <span>{r.label}</span>
                  </label>
                ))}
              </RadioGroup>

              <Label className="mt-5 mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Tell us more</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what happened, in your own words. The more detail, the faster we can resolve this."
                rows={6}
                maxLength={2000}
              />
              <div className="mt-1 text-right text-[11px] text-slate-grey">{description.length}/2000</div>

              <div className="mt-6 flex justify-end gap-2">
                <Button onClick={() => setStep("when")} disabled={description.trim().length < 20}>
                  Continue
                </Button>
              </div>
            </>
          )}

          {step === "when" && (
            <>
              <StepHeader n={2} title="When did this happen?" />
              <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Approximate date / time</Label>
              <Input
                type="datetime-local"
                value={whenAt}
                onChange={(e) => setWhenAt(e.target.value)}
              />
              <p className="mt-2 text-xs text-slate-grey">
                Leave blank if you're not sure — we can reconstruct from messages and the sit timer.
              </p>
              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={() => setStep("what")}>Back</Button>
                <Button onClick={() => setStep("evidence")}>Continue</Button>
              </div>
            </>
          )}

          {step === "evidence" && (
            <>
              <StepHeader n={3} title="Add evidence (optional)" />
              <p className="text-sm text-slate-grey">
                Screenshots, photos, or anything that supports your report. Up to 5 files.
              </p>

              <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border px-4 py-8 text-sm text-slate-grey hover:bg-cream">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                <span>{uploading ? "Uploading…" : "Tap to upload files"}</span>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,application/pdf"
                  onChange={(e) => upload(e.target.files)}
                />
              </label>

              {evidence.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {evidence.map((url, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2 text-xs">
                      <span className="truncate">{url.split("/").pop()}</span>
                      <button type="button" onClick={() => setEvidence((e) => e.filter((_, j) => j !== i))} className="text-slate-grey hover:text-destructive">
                        <X className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={() => setStep("when")}>Back</Button>
                <Button onClick={() => setStep("outcome")}>Continue</Button>
              </div>
            </>
          )}

          {step === "outcome" && (
            <>
              <StepHeader n={4} title="What outcome would you like?" />
              <RadioGroup value={outcome} onValueChange={setOutcome} className="space-y-1.5">
                {OUTCOMES.map((o) => (
                  <label key={o.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm hover:bg-cream">
                    <RadioGroupItem value={o.id} id={`out-${o.id}`} />
                    <span>{o.label}</span>
                  </label>
                ))}
              </RadioGroup>

              <Label className="mt-5 mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-grey">Anything else?</Label>
              <Textarea
                value={outcomeNote}
                onChange={(e) => setOutcomeNote(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Optional — what would make this right for you?"
              />

              <div className="mt-6 flex justify-between gap-2">
                <Button variant="outline" onClick={() => setStep("evidence")} disabled={busy}>Back</Button>
                <Button onClick={submit} disabled={busy} className="bg-salmon text-primary-foreground hover:bg-salmon-deep">
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "File dispute"}
                </Button>
              </div>
            </>
          )}

          {step === "done" && (
            <div className="text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-success-green/15 text-success-green">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <h2 className="mt-3 font-display text-xl font-bold text-pitch-black">Dispute filed</h2>
              <p className="mt-1 text-sm text-slate-grey">
                Our trust team will be in touch within 24 hours. Payment is paused until this is resolved.
              </p>
              <Button asChild className="mt-6 w-full">
                <Link to={`/bookings/${b.id}`}>Back to booking</Link>
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
