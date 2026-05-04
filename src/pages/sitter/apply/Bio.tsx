import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingShell } from "@/components/onboarding/OnboardingShell";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadCloud, Video, FileCheck2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSitterApplication, useUpdateSitterApplication } from "@/hooks/useSitterApplication";
import { toast } from "@/hooks/use-toast";

export default function SitterBio() {
  const { user } = useAuth();
  const { data: app } = useSitterApplication();
  const update = useUpdateSitterApplication();
  const navigate = useNavigate();
  const [bio, setBio] = useState("");
  const [uploading, setUploading] = useState(false);
  const [videoName, setVideoName] = useState<string | null>(null);

  useEffect(() => {
    if (!app) return;
    setBio(app.bio ?? "");
    if (app.video_url) setVideoName("Video on file");
  }, [app]);

  const onVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 50 * 1024 * 1024) {
      toast({ title: "Video too large", description: "Maximum 50MB. Try a shorter clip.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "mp4";
      const path = `${user.id}/intro-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("verification-docs").upload(path, file, { upsert: true });
      if (error) throw error;
      await update.mutateAsync({ video_url: path });
      setVideoName(file.name);
      toast({ title: "Video uploaded" });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const next = async () => {
    if (bio.trim().length < 60) {
      toast({ title: "Bio is a bit short", description: "Aim for at least a couple of sentences.", variant: "destructive" });
      return;
    }
    try {
      await update.mutateAsync({ bio: bio.trim() });
      navigate("/sitter/apply/review");
    } catch (e: any) {
      toast({ title: "Couldn't save", description: e.message, variant: "destructive" });
    }
  };

  return (
    <OnboardingShell
      step={6} total={7}
      title="Bio & intro video"
      subtitle="Help families get to know you. The video is optional but doubles your chance of getting hired."
      footer={<Button size="lg" className="w-full bg-pitch-black text-pure-white" onClick={next} disabled={update.isPending}>Continue</Button>}
    >
      <div className="space-y-6">
        <div>
          <Label htmlFor="bio">Your bio</Label>
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} maxLength={1000} rows={6} className="mt-1.5" placeholder="What makes you a great sitter? Your style, what you love about the work, and what families can expect." />
          <p className="mt-1 text-xs text-slate-grey">{bio.length}/1000</p>
        </div>

        <div>
          <Label htmlFor="video" className="block">
            <div className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cream-deep bg-pure-white p-8 text-center hover:border-pitch-black/30">
              {videoName ? (
                <>
                  <FileCheck2 className="h-8 w-8 text-emerald-600" />
                  <p className="text-sm font-medium text-pitch-black">{videoName}</p>
                  <p className="text-xs text-slate-grey">Tap to replace</p>
                </>
              ) : (
                <>
                  <Video className="h-8 w-8 text-slate-grey" />
                  <p className="text-sm font-medium text-pitch-black">Upload a 30-60s intro</p>
                  <p className="text-xs text-slate-grey">MP4 or MOV · max 50MB · optional</p>
                </>
              )}
            </div>
            <input id="video" type="file" accept="video/*" className="hidden" onChange={onVideo} disabled={uploading} />
          </Label>
        </div>
      </div>
    </OnboardingShell>
  );
}
