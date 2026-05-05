import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LifeBuoy, AlertCircle, ShieldCheck, Mail, Phone, MessageCircle } from "lucide-react";

type Category =
  | "no_code"
  | "magic_link_broken"
  | "cannot_sign_in"
  | "wrong_region"
  | "dual_account"
  | "other";

const CATEGORIES: { id: Category; title: string; sub: string; icon: React.ReactNode }[] = [
  { id: "no_code", title: "I never got my SMS or email code", sub: "We'll re-send via the other channel and route this to a human within 30 minutes.", icon: <Phone className="h-5 w-5" /> },
  { id: "magic_link_broken", title: "My email link doesn't work", sub: "We'll send a 6-digit code instead, plus loop in support.", icon: <Mail className="h-5 w-5" /> },
  { id: "cannot_sign_in", title: "I have an account but can't sign in", sub: "Stuck in a loop, password reset failing, or repeatedly bounced.", icon: <AlertCircle className="h-5 w-5" /> },
  { id: "wrong_region", title: "I'm being told my region/phone isn't supported", sub: "We accept all countries. Tell us what you saw and we'll fix it.", icon: <ShieldCheck className="h-5 w-5" /> },
  { id: "dual_account", title: "I want to add a parent role to my sitter account (or vice versa)", sub: "We'll merge in the new role without making you create a second account.", icon: <MessageCircle className="h-5 w-5" /> },
  { id: "other", title: "Something else is going wrong", sub: "Free-form description. A human will read it.", icon: <LifeBuoy className="h-5 w-5" /> },
];

export default function AuthHelp() {
  const [category, setCategory] = useState<Category | null>(null);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  // Pull last error from sessionStorage (set by Auth.tsx when failures happen)
  const lastError = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem("nr_last_auth_error") ?? "null");
    } catch { return null; }
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const submit = async () => {
    if (!category) return;
    if (!body.trim() || (!contactEmail.trim() && !contactPhone.trim())) {
      toast({ title: "Tell us how to reach you", description: "Email or phone, plus a short description.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("auth-help-ticket", {
        body: {
          category,
          subject: CATEGORIES.find(c => c.id === category)?.title ?? "Auth help",
          body,
          contact_email: contactEmail.trim() || null,
          contact_phone: contactPhone.trim() || null,
          debug_info: {
            url: window.location.href,
            ua: navigator.userAgent,
            screen: `${window.innerWidth}x${window.innerHeight}`,
            last_error: lastError,
            ts: new Date().toISOString(),
          },
        },
      });
      if (error) throw error;
      setDone(true);
      toast({ title: "Help on the way", description: `Ticket #${(data as any)?.ticket_id?.slice(0,8) ?? ""} — we respond within 30 minutes.` });
    } catch (e: any) {
      toast({ title: "Couldn't send", description: e?.message ?? "Try again", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container max-w-2xl py-10">
        <Link to="/auth" className="text-sm text-slate-grey underline">← Back to sign in</Link>
        <h1 className="mt-4 text-3xl font-semibold text-pitch-black">We'll get you in.</h1>
        <p className="mt-2 text-slate-grey">
          You shouldn't be locked out of childcare because of a verification glitch. Pick what's happening and a real human will respond — usually within 30 minutes during UAE/UK overlap hours.
        </p>

        {done ? (
          <div className="mt-6 rounded-2xl border border-success-green/30 bg-success-green/10 p-6">
            <h2 className="text-lg font-semibold text-pitch-black">Got it. Help is coming.</h2>
            <p className="mt-2 text-sm text-slate-grey">
              We've attached your device info and recent sign-in attempts so support doesn't have to ask. You'll hear from us at the email/phone you provided.
            </p>
            <Link to="/" className="mt-4 inline-block text-sm font-medium text-pitch-black underline">Back to home</Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCategory(c.id)}
                  className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    category === c.id ? "border-pitch-black bg-pitch-black text-pure-white" : "border-border bg-card hover:border-pitch-black"
                  }`}
                >
                  <span className={category === c.id ? "text-pure-white" : "text-salmon"}>{c.icon}</span>
                  <span className="flex-1">
                    <span className="block font-medium">{c.title}</span>
                    <span className={`block text-xs mt-0.5 ${category === c.id ? "text-pure-white/80" : "text-slate-grey"}`}>{c.sub}</span>
                  </span>
                </button>
              ))}
            </div>

            {category && (
              <div className="mt-6 space-y-4 rounded-2xl border border-border bg-card p-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-grey">Email</Label>
                    <Input type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="you@example.com" maxLength={255} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-slate-grey">Phone (with country code)</Label>
                    <Input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="+971 50 123 4567" maxLength={32} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-grey">What happened?</Label>
                  <Textarea value={body} onChange={(e) => setBody(e.target.value)} maxLength={4000} rows={5} placeholder="The more detail the better — error messages, what you tried, when it started." />
                </div>
                <Button size="lg" disabled={submitting} onClick={submit} className="w-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
                  {submitting ? "Sending…" : "Send to support"}
                </Button>
                <p className="text-xs text-slate-grey">
                  We'll attach your device info and recent sign-in attempts automatically. No need to copy/paste anything.
                </p>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
