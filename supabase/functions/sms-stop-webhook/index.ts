// Twilio inbound SMS webhook — handles STOP / UNSUBSCRIBE / QUIT.
import { createClient } from "npm:@supabase/supabase-js@2.95.0";

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("ok");
  try {
    const form = await req.formData();
    const from = String(form.get("From") ?? "");
    const body = String(form.get("Body") ?? "").trim().toUpperCase();
    if (!from) return new Response("<Response/>", { headers: { "Content-Type": "text/xml" } });

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (["STOP", "UNSUBSCRIBE", "QUIT", "STOPALL", "CANCEL", "END"].includes(body)) {
      await sb.from("sms_unsubscribes").upsert({ phone: from });
      return new Response(
        `<Response><Message>You're unsubscribed from SMS. You can still receive notifications via push and email. Reply START to re-subscribe.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } },
      );
    }
    if (body === "START" || body === "UNSTOP") {
      await sb.from("sms_unsubscribes").delete().eq("phone", from);
      return new Response(
        `<Response><Message>You're re-subscribed to SMS from Nanny Recommended.</Message></Response>`,
        { headers: { "Content-Type": "text/xml" } },
      );
    }
    return new Response("<Response/>", { headers: { "Content-Type": "text/xml" } });
  } catch (e) {
    console.error(e);
    return new Response("<Response/>", { headers: { "Content-Type": "text/xml" } });
  }
});
