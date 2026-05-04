import { Link, NavLink } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/sitters", label: "Find a sitter" },
  { to: "/pricing", label: "Pricing" },
  { to: "/how-it-works", label: "How it works" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-pure-white/90 backdrop-blur-md">
      <div className="container flex min-h-24 items-center justify-between gap-4 py-3 sm:min-h-28 md:min-h-32 lg:min-h-36">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${isActive ? "text-pitch-black" : "text-slate-grey hover:text-pitch-black"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/sitter/signup" className="hidden text-sm font-medium text-slate-grey hover:text-pitch-black sm:inline">
            I'm a sitter
          </Link>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-pitch-black text-pure-white hover:bg-pitch-black/90">
            <Link to="/sitters">Find a sitter</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
