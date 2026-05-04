import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Mail, CheckCircle2, XCircle, Bell } from "lucide-react";
import { useSitterApplication } from "@/hooks/useSitterApplication";
import { useNotifications } from "@/hooks/useNotifications";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const statusMeta = {
  submitted: {
    label: "Under review",
    tone: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
    title: "Application received",
    desc: (date: string) =>
      `Submitted ${date}. Our team reviews each application personally — usually within 2-3 business days.`,
  },
  approved: {
    label: "Approved",
    tone: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
    title: "You're approved! 🎉",
    desc: () => "Welcome to the platform. Set your rate and availability to start getting jobs.",
  },
  rejected: {
    label: "Not approved",
    tone: "bg-rose-50 text-rose-800 border-rose-200",
    icon: XCircle,
    title: "Application not approved",
    desc: () => "Unfortunately we can't approve your application at this time. Check your email for details.",
  },
  draft: {
    label: "Draft",
    tone: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
    title: "Application in progress",
    desc: () => "Finish your application to submit it for review.",
  },
} as const;

export default function SitterPending() {
  const { user } = useAuth();
  const { data: app } = useSitterApplication();
  // Subscribes to in-app notifications and shows a toast on submit/approve/reject.
  useNotifications();
  const qc = useQueryClient();

  // Live updates to the application row itself
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`sitter-app-${user.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "sitter_applications", filter: `sitter_user_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["sitter-application", user.id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, qc]);

  const status = (app?.status ?? "submitted") as keyof typeof statusMeta;
  const meta = statusMeta[status] ?? statusMeta.submitted;
  const Icon = meta.icon;
  const submitted = app?.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "today";

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-deep/60 bg-pure-white/90">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <Link to="/" className="text-xs text-slate-grey hover:text-pitch-black">Home</Link>
        </div>
      </header>

      <main className="container max-w-xl py-16 text-center">
        <div className={`mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${meta.tone}`}>
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
          Status: {meta.label}
        </div>

        <div className="mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-salmon/10 text-salmon">
          <Icon className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-pitch-black md:text-4xl">{meta.title}</h1>
        <p className="mt-3 text-slate-grey">{meta.desc(submitted)}</p>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-grey">
          <Bell className="h-3.5 w-3.5" />
          We'll notify you here and by email the moment your status changes.
        </div>

        {status === "submitted" && (
          <div className="mt-8 grid gap-3 text-left">
            <div className="flex items-start gap-3 rounded-2xl border border-cream-deep bg-pure-white p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
              <div>
                <p className="text-sm font-medium text-pitch-black">Verifying your ID & references</p>
                <p className="text-xs text-slate-grey">We'll call your references and confirm your documents.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-cream-deep bg-pure-white p-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-pitch-black" />
              <div>
                <p className="text-sm font-medium text-pitch-black">We'll email when you're live</p>
                <p className="text-xs text-slate-grey">Then you can set your rate, availability and start applying to jobs.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
          {status === "approved" ? (
            <Button asChild className="bg-pitch-black text-pure-white"><Link to="/sitter/dashboard">Go to dashboard</Link></Button>
          ) : status === "rejected" ? (
            <Button asChild className="bg-pitch-black text-pure-white"><Link to="/contact">Contact support</Link></Button>
          ) : (
            <Button asChild className="bg-pitch-black text-pure-white"><Link to="/sitter/dashboard">Go to dashboard</Link></Button>
          )}
        </div>
      </main>
    </div>
  );
}
