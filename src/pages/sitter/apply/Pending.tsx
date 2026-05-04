import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Clock, ShieldCheck, Mail } from "lucide-react";
import { useSitterApplication } from "@/hooks/useSitterApplication";

export default function SitterPending() {
  const { data: app } = useSitterApplication();
  const submitted = app?.submitted_at ? new Date(app.submitted_at).toLocaleDateString() : "today";
  const status = app?.status ?? "submitted";

  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-cream-deep/60 bg-pure-white/90">
        <div className="container flex items-center justify-between py-4">
          <Logo />
          <Link to="/" className="text-xs text-slate-grey hover:text-pitch-black">Home</Link>
        </div>
      </header>

      <main className="container max-w-xl py-16 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-salmon/10 text-salmon">
          <Clock className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold text-pitch-black md:text-4xl">
          {status === "approved" ? "You're approved!" : status === "rejected" ? "Application not approved" : "Application received"}
        </h1>
        <p className="mt-3 text-slate-grey">
          {status === "approved"
            ? "Welcome to the platform. Set your rate and availability to start getting jobs."
            : status === "rejected"
              ? "Unfortunately we can't approve your application at this time. Check your email for details."
              : `Submitted ${submitted}. Our team reviews each application personally — usually within 2-3 business days.`}
        </p>

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

        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Button asChild variant="outline"><Link to="/">Back to home</Link></Button>
          <Button asChild className="bg-pitch-black text-pure-white"><Link to="/sitter/dashboard">Go to dashboard</Link></Button>
        </div>
      </main>
    </div>
  );
}
