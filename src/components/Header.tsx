import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User as UserIcon, Menu, Bell } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNotifications } from "@/hooks/useNotifications";

const guestLinks = [
  { to: "/sitters", label: "Find a sitter" },
  { to: "/pricing", label: "Pricing" },
  { to: "/how-it-works", label: "How it works" },
];
const sitterLinks = [
  { to: "/sitter/jobs", label: "Jobs" },
  { to: "/sitter/availability", label: "Availability" },
  { to: "/messages", label: "Inbox" },
  { to: "/sitter/wallet", label: "Wallet" },
];
const parentLinks = [
  { to: "/sitters", label: "Find a sitter" },
  { to: "/favourites", label: "Favourites" },
  { to: "/friends", label: "Friends" },
  { to: "/parent/post-job", label: "Post a job" },
  { to: "/messages", label: "Inbox" },
];

export function Header() {
  const { user, roles, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isSitter = roles.includes("sitter");
  const links = !user ? guestLinks : isSitter ? sitterLinks : parentLinks;
  const { data: notifications } = useNotifications();
  const unread = (notifications ?? []).filter(n => !n.read_at).length;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-pitch-black" : "text-slate-grey hover:text-pitch-black"}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-pure-white/90 backdrop-blur-md">
      <div className="container flex min-h-20 items-center justify-between gap-4 py-3 md:min-h-28">
        <Logo />
        <nav className="hidden items-center gap-7 md:flex">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} className={navLinkClass}>{l.label}</NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {!user ? (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth?mode=signin">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex bg-pitch-black text-pure-white hover:bg-pitch-black/90">
                <Link to="/sitters">Find a sitter</Link>
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="icon" className="relative hidden md:inline-flex" aria-label="Notifications">
                <Link to="/notifications">
                  <Bell className="h-4 w-4" />
                  {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-salmon px-1 text-[10px] font-bold text-pure-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  )}
                </Link>
              </Button>
              <Button asChild variant="ghost" size="sm" className="hidden gap-1.5 md:inline-flex">
                <Link to={isSitter ? "/sitter/dashboard" : "/account"}>
                  <UserIcon className="h-4 w-4" /> {isSitter ? "Dashboard" : "Account"}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="hidden md:inline-flex" onClick={async () => { await signOut(); navigate("/"); }} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-6 flex flex-col gap-1">
                {links.map(l => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `rounded-xl px-3 py-3 text-base font-semibold ${isActive ? "bg-cream text-pitch-black" : "text-slate-grey hover:bg-cream"}`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
                <div className="my-3 border-t border-cream-deep" />
                {!user ? (
                  <>
                    <Button asChild variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                      <Link to="/auth?mode=signin">Sign in</Link>
                    </Button>
                    <Button asChild className="mt-2 rounded-full bg-pitch-black text-pure-white" onClick={() => setOpen(false)}>
                      <Link to="/auth?mode=signup&role=sitter">I'm a sitter</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" className="rounded-full" onClick={() => setOpen(false)}>
                      <Link to={isSitter ? "/sitter/dashboard" : "/account"}>
                        <UserIcon className="h-4 w-4" /> {isSitter ? "Dashboard" : "Account"}
                      </Link>
                    </Button>
                    <Button variant="ghost" className="mt-2 rounded-full" onClick={async () => { setOpen(false); await signOut(); navigate("/"); }}>
                      <LogOut className="h-4 w-4" /> Sign out
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
