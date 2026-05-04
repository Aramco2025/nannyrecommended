import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ShieldCheck, UploadCloud, FileCheck2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSitterApplication, useUpdateSitterApplication } from "@/hooks/useSitterApplication";
import { toast } from "@/hooks/use-toast";

export default function SitterIdUpload() {
  const { user } = useAuth();
  const { data: app } = useSitterApplication();
  const update = useUpdateSitterApplication();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [filename, setFilename] = useState<string | null>(app?.id_doc_url ? "ID on file" : null);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Maximum 10MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${user.id}/id-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("verification-docs").upload(path, file, { upsert: true });
      if (error) throw error;
      await update.mutateAsync({ id_doc_url: path });
      setFilename(file.name);
      toast({ title: "ID uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const next = () => {
    if (!app?.id_doc_url) {
      toast({ title: "Please upload your ID", variant: "destructive" });
      return;
    }
    navigate("/sitter/apply/references");
  };

  return (
    <OnboardingShell
      step={4} total={7}
      title="Upload your ID"
      subtitle="Emirates ID, passport, or driving licence. Stored privately and securely."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next}>Continue</Button>}
    >
      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-pitch-black">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <p>Only our verification team can view your ID. It is never shown to parents.</p>
      </div>

      <Label htmlFor="id" className="block">
        <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cream-deep bg-pure-white p-8 text-center hover:border-pitch-black/30">
          {filename ? (
            <>
              <FileCheck2 className="h-8 w-8 text-emerald-600" />
              <p className="text-sm font-medium text-pitch-black">{filename}</p>
              <p className="text-xs text-slate-grey">Tap to replace</p>
            </>
          ) : (
            <>
              <UploadCloud className="h-8 w-8 text-slate-grey" />
              <p className="text-sm font-medium text-pitch-black">Tap to upload</p>
              <p className="text-xs text-slate-grey">JPG, PNG or PDF · max 10MB</p>
            </>
          )}
        </div>
        <input id="id" type="file" accept="image/*,application/pdf" className="hidden" onChange={onFile} disabled={uploading} />
      </Label>
    </OnboardingShell>
  );
}
