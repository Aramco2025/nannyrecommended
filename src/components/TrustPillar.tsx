import { LucideIcon } from "lucide-react";

type Props = { icon: LucideIcon; title: string; description: string };

export function TrustPillar({ icon: Icon, title, description }: Props) {
  return (
    <div className="flex flex-col items-start rounded-2xl bg-card p-6 shadow-card">
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-salmon/10 text-salmon-deep">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-pitch-black">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-grey">{description}</p>
    </div>
  );
}
