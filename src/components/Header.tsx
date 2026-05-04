import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User as UserIcon } from "lucide-react";

const links = [
  { to: "/sitters", label: "Find a sitter" },
  { to: "/pricing", label: "Pricing" },
  { to: "/how-it-works", label: "How it works" },
];

export function Header() {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const isSitter = roles.includes("sitter");

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
          {!user ? (
            <>
              <Link to="/auth?mode=signup&role=sitter" className="hidden text-sm font-medium text-slate-grey hover:text-pitch-black sm:inline">
                I'm a sitter
              </Link>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth?mode=signin">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <Link to="/sitters">Find a sitter</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="gap-1.5">
                <Link to={isSitter ? "/sitter/dashboard" : "/account"}>
                  <UserIcon className="h-4 w-4" /> {isSitter ? "Dashboard" : "Account"}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" onClick={async () => { await signOut(); navigate("/"); }} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
