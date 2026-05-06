import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    const userId = user.id;

    // Anonymise rather than hard-delete dependent rows so reviews / bookings
    // referenced by other users stay intact.
    await admin
      .from("profiles")
      .update({
        full_name: "Deleted user",
        avatar_url: null,
        phone: null,
      })
      .eq("user_id", userId);

    await admin
      .from("sitters")
      .update({
        full_name: "Deleted user",
        bio: null,
        photos: [],
        is_active: false,
      })
      .eq("user_id", userId);

    // Finally delete the auth user. Cascades remove user_roles, etc.
    const { error: delErr } = await admin.auth.admin.deleteUser(userId);
    if (delErr) throw delErr;

    return json({ ok: true });
  } catch (e) {
    console.error("delete-account error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
