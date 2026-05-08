import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // Supabase JS handles tokens in URL hash automatically; just read the session.
      const { data: { session }, error } = await supabase.auth.getSession();

      if (cancelled) return;

      if (error || !session?.user) {
        toast({
          title: "Sign-in failed",
          description: error?.message ?? "We couldn't complete sign-in. Please try again.",
          variant: "destructive",
        });
        navigate("/auth", { replace: true });
        return;
      }

      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (cancelled) return;

      if (!roles || roles.length === 0) {
        navigate("/onboarding/role", { replace: true });
        return;
      }

      const r = roles.map((x) => x.role as string);
      if (r.includes("sitter")) navigate("/sitter/dashboard", { replace: true });
      else if (r.includes("parent")) navigate("/parent/home", { replace: true });
      else navigate("/", { replace: true });
    })();

    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="flex flex-col items-center gap-3 text-slate-grey">
        <Loader2 className="h-6 w-6 animate-spin" />
        <div className="text-sm">Signing you in…</div>
      </div>
    </div>
  );
}
