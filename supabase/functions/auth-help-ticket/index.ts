// Creates a high-priority support ticket from /auth/help with debug info.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonRes(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return jsonRes({ error: "method_not_allowed" }, 405);

  try {
    const { category, subject, body, contact_email, contact_phone, debug_info } = await req.json();
    if (!category || !subject || !body) return jsonRes({ error: "missing_fields" }, 400);
    if (String(subject).length > 200 || String(body).length > 4000) {
      return jsonRes({ error: "too_long" }, 400);
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Pull recent auth attempts for this contact for support context
    let attempts: any[] = [];
    if (contact_email || contact_phone) {
      const { data } = await sb
        .from("auth_attempts")
        .select("method, success, error_code, error_message, created_at")
        .eq("email_or_phone", contact_email ?? contact_phone)
        .order("created_at", { ascending: false })
        .limit(20);
      attempts = data ?? [];
    }

    const { data: ticket, error } = await sb
      .from("support_tickets")
      .insert({
        category,
        subject,
        body,
        contact_email,
        contact_phone,
        priority: "p1",
        debug_info: { ...debug_info, recent_auth_attempts: attempts, ua: req.headers.get("user-agent") },
      })
      .select("id")
      .single();
    if (error) throw error;

    return jsonRes({ ok: true, ticket_id: ticket.id });
  } catch (e) {
    return jsonRes({ error: String((e as Error).message) }, 500);
  }
});
