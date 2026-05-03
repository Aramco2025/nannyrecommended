import { Users } from "lucide-react";

export function NetworkBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-salmon/10 px-2.5 py-1 text-xs font-medium text-salmon-deep">
      <Users className="h-3.5 w-3.5" />
      {text}
    </span>
  );
}
