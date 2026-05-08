import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    const now = new Date().toISOString();

    // Insert export request row
    const { error: insertErr } = await admin
      .from("data_export_requests")
      .insert({ user_id: user.id, status: "queued", requested_at: now });
    if (insertErr) throw insertErr;

    // Stamp profiles for the dashboard "last requested" indicator
    await admin
      .from("profiles")
      .update({ data_export_requested_at: now })
      .eq("id", user.id);

    return json({ queued: true, requested_at: now });
  } catch (e) {
    console.error("export-user-data error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
