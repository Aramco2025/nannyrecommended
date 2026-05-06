import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns true when the signed-in user is a flagged Apple App Review test
 * account. Used to short-circuit real-world side effects (Twilio SMS, real
 * sitter notifications, manual verification) so reviewers can complete every
 * flow inside their 30-min review window.
 */
export function useReviewMode(): boolean {
  const { user } = useAuth();
  const [isReviewer, setIsReviewer] = useState(false);

  useEffect(() => {
    if (!user) { setIsReviewer(false); return; }
    let cancelled = false;
    supabase
      .from("profiles")
      .select("is_apple_reviewer")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => { if (!cancelled) setIsReviewer(!!data?.is_apple_reviewer); });
    return () => { cancelled = true; };
  }, [user]);

  return isReviewer;
}
