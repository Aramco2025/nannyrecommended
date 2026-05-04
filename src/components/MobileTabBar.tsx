import { NavLink } from "react-router-dom";
import { Search, Heart, Calendar, MessageCircle, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/sitters", label: "Search", icon: Search },
  { to: "/favourites", label: "Favourites", icon: Heart },
  { to: "/account", label: "Bookings", icon: Calendar },
  { to: "/messages", label: "Inbox", icon: MessageCircle },
  { to: "/account", label: "Account", icon: UserIcon, exact: true },
];

export function MobileTabBar() {
  const { user, roles } = useAuth();
  // Only show for signed-in parents (sitters have their own dashboard nav)
  if (!user || roles.includes("sitter")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-cream-deep bg-pure-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {tabs.map((t, i) => (
          <li key={`${t.to}-${i}`}>
            <NavLink
              to={t.to}
              end={t.exact}
              className={({ isActive }) => cn(
                "flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition",
                isActive ? "text-salmon" : "text-slate-grey hover:text-pitch-black",
              )}
            >
              <t.icon className="h-5 w-5" />
              {t.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
