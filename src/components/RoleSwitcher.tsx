import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Baby, Briefcase, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

export function RoleSwitcher() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState<"parent" | "sitter" | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("active_role").eq("id", user.id).maybeSingle();
      setActive((data?.active_role as any) ?? (roles.includes("sitter") ? "sitter" : "parent"));
    })();
  }, [user, roles]);

  // Only show if user has both roles
  if (!user || !(roles.includes("parent") && roles.includes("sitter"))) return null;

  const swap = async (next: "parent" | "sitter") => {
    if (next === active) return;
    const { error } = await supabase.from("profiles").update({ active_role: next }).eq("id", user.id);
    if (error) { toast({ title: "Couldn't switch", description: error.message, variant: "destructive" }); return; }
    setActive(next);
    toast({ title: `Switched to ${next === "sitter" ? "Sitter" : "Parent"} mode` });
    navigate(next === "sitter" ? "/sitter/dashboard" : "/parent/home");
  };

  const Icon = active === "sitter" ? Briefcase : Baby;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden gap-1.5 rounded-full bg-cream md:inline-flex">
          <Icon className="h-3.5 w-3.5 text-salmon" />
          <span className="font-semibold capitalize">{active ?? "parent"}</span>
          <ChevronDown className="h-3.5 w-3.5 text-slate-grey" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs uppercase text-slate-grey">Switch mode</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => swap("parent")} className="gap-2">
          <Baby className="h-4 w-4" /> Parent
          {active === "parent" && <Check className="ml-auto h-3.5 w-3.5 text-success-green" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => swap("sitter")} className="gap-2">
          <Briefcase className="h-4 w-4" /> Sitter
          {active === "sitter" && <Check className="ml-auto h-3.5 w-3.5 text-success-green" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
