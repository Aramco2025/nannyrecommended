import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
import { formatCurrency } from "@/lib/fees";
import { EarningsCalculator } from "@/components/sitter/EarningsCalculator";
import { ProfileCompletenessCard } from "@/components/sitter/ProfileCompletenessCard";

const profileSchema = z.object({
  headline: z.string().trim().max(120).optional(),
  bio: z.string().trim().max(2000).optional(),
  area: z.string().trim().max(80).optional(),
  hourly_rate_aed: z.number().min(30).max(1000),
  years_experience: z.number().int().min(0).max(70),
});

const SitterDashboard = () => {
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const [sitterId, setSitterId] = useState<string | null>(null);
  const [sitter, setSitter] = useState<any>(null);
  const [hasAvailability, setHasAvailability] = useState(false);
  const [hasPayout, setHasPayout] = useState(false);
  const [form, setForm] = useState({
    headline: "", bio: "", area: "", hourly_rate_aed: 75, years_experience: 1, photos: "",
  });
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("sitters").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
        setSitterId(data.id);
        setSitter(data);
        setHasPayout(!!data.preferred_payout_method);
        setForm({
          headline: data.headline ?? "",
          bio: data.bio ?? "",
          area: data.area ?? "",
          hourly_rate_aed: Number(data.hourly_rate_aed),
          years_experience: data.years_experience,
          photos: (data.photos ?? []).join("\n"),
        });
        const [{ data: bks }, { count: avCount }] = await Promise.all([
          supabase.from("bookings").select("*").eq("sitter_id", data.id).order("start_at", { ascending: false }),
          supabase.from("availability").select("id", { count: "exact", head: true }).eq("sitter_id", data.id),
        ]);
        setBookings(bks ?? []);
        setHasAvailability((avCount ?? 0) > 0);
      }
    })();
  }, [user]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  const save = async () => {
    setBusy(true);
    try {
      const parsed = profileSchema.safeParse({
        headline: form.headline, bio: form.bio, area: form.area,
        hourly_rate_aed: Number(form.hourly_rate_aed), years_experience: Number(form.years_experience),
      });
      if (!parsed.success) {
        toast({ title: "Check your details", description: parsed.error.issues[0].message, variant: "destructive" });
        return;
      }
      const photos = form.photos.split("\n").map(s => s.trim()).filter(Boolean);
      const profileData = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
      const payload = {
        user_id: user.id,
        full_name: profileData.data?.full_name ?? user.email?.split("@")[0] ?? "Sitter",
        ...parsed.data,
        photos,
        is_active: true,
      };
      if (sitterId) {
        const { error } = await supabase.from("sitters").update(payload).eq("id", sitterId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("sitters").insert(payload).select("id").single();
        if (error) throw error;
        setSitterId(data.id);
      }
      toast({ title: "Profile saved" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally { setBusy(false); }
  };

  const updateBookingStatus = async (id: string, status: "confirmed" | "cancelled" | "completed") => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    setBookings(bs => bs.map(b => b.id === id ? { ...b, status } : b));
    toast({
      title: status === "confirmed"
        ? "Booking accepted"
        : status === "cancelled"
        ? "Booking declined"
        : "Booking completed",
      description: status === "cancelled"
        ? "The parent will be refunded manually via Stripe."
        : undefined,
    });
  };

  const acceptBooking = (id: string) => updateBookingStatus(id, "confirmed");
  const declineBooking = (id: string) => {
    if (!confirm("Decline this booking? The parent will need to be refunded.")) return;
    updateBookingStatus(id, "cancelled");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-pitch-black">Sitter dashboard</h1>
            <p className="mt-1 text-sm text-slate-grey">Manage your profile and incoming bookings.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm" className="relative"><a href="/sitter/requests">
              Requests
              {bookings.filter(b => b.status === "pending").length > 0 && (
                <span className="ml-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-salmon px-1 text-[10px] font-bold text-pure-white">
                  {bookings.filter(b => b.status === "pending").length}
                </span>
              )}
            </a></Button>
            <Button asChild variant="outline" size="sm"><a href="/sitter/applications">My applications</a></Button>
            <Button asChild variant="outline" size="sm"><a href="/sitter/set-rate">Set your rate</a></Button>
            <Button asChild variant="outline" size="sm"><a href="/sitter/payment-setup">Payout method</a></Button>
            <Button asChild size="sm" className="bg-salmon hover:bg-salmon-deep"><a href="/sitter/wallet">Open wallet</a></Button>
          </div>
        </div>

        <div className="mt-8">
          <ProfileCompletenessCard
            sitter={sitter ? { ...sitter, ...{
              headline: form.headline, bio: form.bio, area: form.area,
              hourly_rate_aed: form.hourly_rate_aed,
              photos: form.photos.split("\n").map(s => s.trim()).filter(Boolean),
            } } : null}
            hasAvailability={hasAvailability}
            hasPayout={hasPayout}
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-card">
            <h2 className="text-lg font-semibold text-pitch-black">Your listing</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Headline</Label>
                <Input value={form.headline} onChange={e => setForm({ ...form, headline: e.target.value })} maxLength={120} placeholder="e.g. Paediatric nurse · weekends" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Hourly rate (AED)</Label>
                  <Input type="number" min={30} max={1000} value={form.hourly_rate_aed} onChange={e => setForm({ ...form, hourly_rate_aed: Number(e.target.value) })} />
                </div>
                <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Years experience</Label>
                  <Input type="number" min={0} max={70} value={form.years_experience} onChange={e => setForm({ ...form, years_experience: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Area</Label>
                <Input value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} maxLength={80} placeholder="e.g. Dubai Marina" />
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-slate-grey">About you</Label>
                <Textarea rows={5} value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} maxLength={2000} />
              </div>
              <div className="space-y-1.5"><Label className="text-xs text-slate-grey">Photo URLs (one per line)</Label>
                <Textarea rows={3} value={form.photos} onChange={e => setForm({ ...form, photos: e.target.value })} placeholder="https://..." />
              </div>
              <Button disabled={busy} onClick={save} className="w-full bg-salmon hover:bg-salmon-deep text-primary-foreground">
                {busy ? "Saving…" : sitterId ? "Save changes" : "Publish listing"}
              </Button>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-pitch-black">Bookings</h2>
            <div className="mt-4 space-y-3">
              {bookings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-slate-grey">No bookings yet.</div>
              )}
              {bookings.map(b => (
                <div key={b.id} className="rounded-2xl border border-border bg-card p-4 shadow-card">
                  <a href={`/bookings/${b.id}`} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-pitch-black">{new Date(b.start_at).toLocaleString()}</div>
                      <div className="text-xs text-slate-grey">{b.hours}h · payout {formatCurrency(Number(b.sitter_payout_aed))}</div>
                    </div>
                    <span className="rounded-full bg-off-white px-2 py-0.5 text-[11px] font-medium capitalize text-slate-grey">{b.status.replace("_", " ")}</span>
                  </a>
                  {b.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" onClick={() => acceptBooking(b.id)}>Accept</Button>
                      <Button size="sm" variant="outline" onClick={() => declineBooking(b.id)}>Decline</Button>
                    </div>
                  )}
                  {b.status === "confirmed" && (
                    <div className="mt-3 text-xs text-slate-grey">Open the booking to start the sit when you arrive — the timer runs until you tap End sit.</div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6">
              <EarningsCalculator hourlyRate={Number(form.hourly_rate_aed) || 60} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitterDashboard;
