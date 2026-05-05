import { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const schema = z.object({
  type: z.enum(["one_off", "repeat", "permanent"]),
  date: z.string().min(1),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  area: z.string().trim().min(1).max(120),
  hourly_rate_aed: z.number().min(30).max(1000),
  notes: z.string().trim().max(2000).optional(),
});

const PostJob = () => {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [search] = useSearchParams();
  const editId = search.get("edit");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    type: "one_off" as "one_off" | "repeat" | "permanent",
    date: new Date().toISOString().slice(0, 10),
    startTime: "18:00",
    endTime: "22:00",
    area: "",
    hourly_rate_aed: 60,
    notes: "",
  });

  useEffect(() => {
    if (!editId) return;
    supabase.from("job_posts").select("*").eq("id", editId).maybeSingle().then(({ data }) => {
      if (!data) return;
      const s = new Date(data.start_at);
      const e = new Date(data.end_at);
      setForm({
        type: data.type,
        date: s.toISOString().slice(0, 10),
        startTime: s.toTimeString().slice(0, 5),
        endTime: e.toTimeString().slice(0, 5),
        area: data.area ?? "",
        hourly_rate_aed: Number(data.hourly_rate_aed),
        notes: data.notes ?? "",
      });
    });
  }, [editId]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth?mode=signin" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast({ title: "Check the form", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    setBusy(true);
    try {
      const start_at = new Date(`${form.date}T${form.startTime}:00`).toISOString();
      const end_at = new Date(`${form.date}T${form.endTime}:00`).toISOString();
      const payload = {
        type: form.type,
        start_at,
        end_at,
        area: form.area,
        hourly_rate_aed: form.hourly_rate_aed,
        notes: form.notes || null,
      };
      if (editId) {
        const { error } = await supabase.from("job_posts").update(payload).eq("id", editId);
        if (error) throw error;
        toast({ title: "Job updated" });
        nav(`/parent/jobs/${editId}/applicants`);
      } else {
        const { data: inserted, error } = await supabase.from("job_posts")
          .insert({ parent_id: user.id, ...payload }).select("id").single();
        if (error) throw error;
        toast({ title: "Job posted", description: "Sitters in your area are being notified." });
        nav(`/parent/jobs/${inserted.id}/applicants`);
      }
    } catch (e: any) {
      toast({ title: "Couldn't save job", description: e.message, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      <Header />
      <main className="container max-w-xl py-10">
        <h1 className="font-display text-3xl font-bold text-pitch-black">{editId ? "Edit job" : "Post a job"}</h1>
        <p className="mt-1 text-sm text-slate-grey">{editId ? "Update the details — applicants will see the changes." : "Tell us what you need and verified sitters will apply."}</p>

        <form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl bg-pure-white p-6 shadow-card">
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-grey">Type</Label>
            <div className="flex gap-2">
              {(["one_off","repeat","permanent"] as const).map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    form.type === t ? "bg-pitch-black text-pure-white" : "bg-cream text-slate-grey hover:bg-cream-deep"
                  }`}
                >
                  {t === "one_off" ? "One-off" : t === "repeat" ? "Repeat" : "Permanent"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Date</Label>
              <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Start</Label>
              <Input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} required /></div>
            <div className="space-y-1.5"><Label className="text-xs text-slate-grey">End</Label>
              <Input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} required /></div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Area</Label>
              <Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="Dubai Marina" required maxLength={120} /></div>
            <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Hourly rate (AED)</Label>
              <Input type="number" min={30} max={1000} value={form.hourly_rate_aed}
                onChange={e => setForm({ ...form, hourly_rate_aed: Number(e.target.value) })} required /></div>
          </div>

          <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Notes (optional)</Label>
            <Textarea rows={4} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={2000}
              placeholder="2 children aged 4 and 7. Bedtime 8pm." /></div>

          <Button disabled={busy} type="submit" size="lg" className="w-full rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
            {busy ? (editId ? "Saving…" : "Posting…") : (editId ? "Save changes" : "Post job")}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
