import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Splash = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(async () => {
      if (!user) {
        navigate("/onboarding/welcome", { replace: true });
        return;
      }
      const { data: sitter } = await supabase
        .from("sitters")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      navigate(sitter ? "/sitter/dashboard" : "/parent/home", { replace: true });
    }, 1400);
    return () => clearTimeout(t);
  }, [user, loading, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-cream">
      <div className="flex flex-col items-center gap-4 animate-fade-in">
        <img
          src={logo}
          alt="NannyRecommended"
          className="h-32 w-auto animate-scale-in drop-shadow-md"
        />
        <p className="text-sm text-slate-grey animate-pulse">Loading your trusted village…</p>
      </div>
    </div>
  );
};

export default Splash;
