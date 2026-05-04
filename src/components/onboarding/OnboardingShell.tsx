import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Progress } from "@/components/ui/progress";

type Props = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function OnboardingShell({ step, total, title, subtitle, children, footer }: Props) {
  const pct = Math.round((step / total) * 100);
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-30 border-b border-cream-deep/60 bg-pure-white/90 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-4">
          <Logo />
          <Link to="/" className="text-xs text-slate-grey hover:text-pitch-black">Save & exit</Link>
        </div>
        <div className="container pb-3">
          <Progress value={pct} className="h-1.5" />
          <p className="mt-1 text-[11px] uppercase tracking-wider text-slate-grey">Step {step} of {total}</p>
        </div>
      </header>

      <main className="container max-w-xl py-8 pb-32">
        <h1 className="text-3xl font-semibold text-pitch-black md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 text-slate-grey">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </main>

      {footer && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-cream-deep bg-pure-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
          <div className="container max-w-xl py-3">{footer}</div>
        </div>
      )}
    </div>
  );
}
