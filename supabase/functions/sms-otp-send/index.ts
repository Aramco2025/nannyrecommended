// SMS OTP send via Twilio (gateway). Stores hashed code, 10-min expiry.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/twilio";

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
    const { phone } = await req.json();
    if (typeof phone !== "string" || !/^\+\d{6,16}$/.test(phone)) {
      return jsonRes({ error: "invalid_phone" }, 400);
    }

    const url = Deno.env.get("SUPABASE_URL")!;
    const srv = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(url, srv);

    // Check unsubscribe list
    const { data: unsub } = await sb.from("sms_unsubscribes").select("phone").eq("phone", phone).maybeSingle();
    if (unsub) return jsonRes({ error: "unsubscribed" }, 403);

    // Rate limit: max 3 sends per phone in last hour
    const since = new Date(Date.now() - 3600 * 1000).toISOString();
    const { count } = await sb
      .from("sms_otp_codes")
      .select("id", { count: "exact", head: true })
      .eq("phone", phone)
      .gte("created_at", since);
    if ((count ?? 0) >= 3) return jsonRes({ error: "rate_limited" }, 429);

    const code = String(Math.floor(100000 + Math.random() * 900000));
    const code_hash = await sha256(code);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await sb.from("sms_otp_codes").insert({ phone, code_hash, expires_at });

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
    const TWILIO_FROM = Deno.env.get("TWILIO_FROM_NUMBER");

    if (!LOVABLE_API_KEY || !TWILIO_API_KEY || !TWILIO_FROM) {
      // Fallback: don't fail in dev. Log code so support can read.
      console.log(`[sms-otp-send] Twilio not configured, code for ${phone}: ${code}`);
      return jsonRes({ ok: true, dev_code: code });
    }

    const tw = await fetch(`${GATEWAY_URL}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": TWILIO_API_KEY,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        To: phone,
        From: TWILIO_FROM,
        Body: `Your Nanny Recommended code: ${code}. Valid 10 min. Reply STOP to unsubscribe.`,
      }),
    });

    if (!tw.ok) {
      const txt = await tw.text();
      console.error("Twilio send failed", tw.status, txt);
      return jsonRes({ error: "send_failed", detail: txt }, 502);
    }

    return jsonRes({ ok: true });
  } catch (e) {
    console.error(e);
    return jsonRes({ error: String((e as Error).message) }, 500);
  }
});
