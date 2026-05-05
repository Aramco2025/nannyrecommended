// Verify SMS OTP code. Returns { ok: true } if valid; logs attempt.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function sha256(s: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

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
    const { phone, code } = await req.json();
    if (typeof phone !== "string" || typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return jsonRes({ error: "invalid_input" }, 400);
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const ua = req.headers.get("user-agent") ?? null;
    const code_hash = await sha256(code);

    const { data: row } = await sb
      .from("sms_otp_codes")
      .select("*")
      .eq("phone", phone)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!row) {
      await sb.from("auth_attempts").insert({
        email_or_phone: phone, method: "sms_otp", success: false,
        error_code: "no_active_code", user_agent: ua,
      });
      return jsonRes({ error: "no_active_code" }, 400);
    }

    if (row.attempts >= 5) {
      await sb.from("auth_attempts").insert({
        email_or_phone: phone, method: "sms_otp", success: false,
        error_code: "too_many_attempts", user_agent: ua,
      });
      return jsonRes({ error: "too_many_attempts" }, 429);
    }

    if (row.code_hash !== code_hash) {
      await sb.from("sms_otp_codes").update({ attempts: row.attempts + 1 }).eq("id", row.id);
      await sb.from("auth_attempts").insert({
        email_or_phone: phone, method: "sms_otp", success: false,
        error_code: "wrong_code", user_agent: ua,
      });
      return jsonRes({ error: "wrong_code" }, 400);
    }

    await sb.from("sms_otp_codes").update({ used: true }).eq("id", row.id);
    await sb.from("auth_attempts").insert({
      email_or_phone: phone, method: "sms_otp", success: true, user_agent: ua,
    });

    return jsonRes({ ok: true });
  } catch (e) {
    return jsonRes({ error: String((e as Error).message) }, 500);
  }
});
