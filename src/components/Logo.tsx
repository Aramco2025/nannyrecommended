import { Link } from "react-router-dom";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-salmon text-primary-foreground font-bold">
        N
      </span>
      <span className="font-semibold text-pitch-black tracking-tight">
        Nanny<span className="text-salmon">Recommended</span>
      </span>
    </Link>
  );
}
