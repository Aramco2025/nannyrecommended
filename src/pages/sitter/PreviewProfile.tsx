import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const PreviewProfile = () => {
  const { user, loading } = useAuth();
  const [sitterId, setSitterId] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("sitters")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();
      setSitterId(data?.id ?? null);
    })();
  }, [user]);

  if (loading || sitterId === undefined) {
    return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!sitterId) return <Navigate to="/sitter/dashboard" replace />;
  return <Navigate to={`/sitters/${sitterId}?preview=1`} replace />;
};

export default PreviewProfile;
