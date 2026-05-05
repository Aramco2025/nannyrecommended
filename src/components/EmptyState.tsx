import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function EmptyState({
  icon, title, description, ctaLabel, ctaTo,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaTo?: string;
}) {
  return (
    <div className="rounded-3xl border border-dashed border-cream-deep bg-pure-white p-12 text-center">
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-salmon-soft text-salmon-deep">{icon}</div>
      <h2 className="mt-4 font-display text-lg font-bold text-pitch-black">{title}</h2>
      <p className="mt-1 text-sm text-slate-grey">{description}</p>
      {ctaLabel && ctaTo && (
        <Button asChild size="sm" className="mt-4 rounded-full bg-salmon text-primary-foreground hover:bg-salmon-deep">
          <Link to={ctaTo}>{ctaLabel}</Link>
        </Button>
      )}
    </div>
  );
}
