// Stripe webhook — confirms booking and holds escrow on checkout.session.completed.
// Lovable registers this endpoint automatically: ?env=sandbox (test) or ?env=live.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function verify(body: string, sigHeader: string, secret: string) {
  // Stripe-Signature: t=...,v1=...
  const parts = Object.fromEntries(sigHeader.split(",").map(p => p.split("=")));
  const t = parts.t;
  const v1 = parts.v1;
  if (!t || !v1) return false;
  const payload = `${t}.${body}`;
  const key = await crypto.subtle.importKey(
    "raw", new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  const hex = Array.from(new Uint8Array(sigBuf)).map(b => b.toString(16).padStart(2, "0")).join("");
  return hex === v1;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });
  const url = new URL(req.url);
  const env = url.searchParams.get("env") === "live" ? "live" : "sandbox";
  const secret = env === "live"
    ? Deno.env.get("PAYMENTS_LIVE_WEBHOOK_SECRET")
    : Deno.env.get("PAYMENTS_SANDBOX_WEBHOOK_SECRET");
  if (!secret) return new Response("webhook secret missing", { status: 500 });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const ok = await verify(body, sig, secret);
  if (!ok) {
    console.error("webhook signature invalid");
    return new Response("invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);
  const admin = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    if (event.type === "checkout.session.completed" || event.type === "transaction.completed") {
      const session = event.data.object;
      const bookingId = session?.metadata?.booking_id;
      if (!bookingId) return new Response("ok", { status: 200 });

      const { data: booking } = await admin
        .from("bookings").select("id,status,parent_id").eq("id", bookingId).maybeSingle();
      if (!booking) return new Response("ok", { status: 200 });
      if (booking.status === "confirmed" || booking.status === "completed") {
        return new Response("ok", { status: 200 });
      }

      await admin.from("bookings").update({
        status: "pending",
        escrow_held: true,
        paid_at: new Date().toISOString(),
        payment_method_ref: session.payment_intent ?? session.id,
      }).eq("id", bookingId);

      // Notify parent: payment received, awaiting sitter
      await admin.from("notifications").insert({
        user_id: booking.parent_id,
        type: "booking_awaiting_sitter",
        title: "Payment received",
        body: "We've notified the sitter. You'll hear back shortly.",
        link: "/account",
      });

      // Notify sitter: new booking request to accept
      const { data: bk } = await admin
        .from("bookings").select("sitter_id,start_at,hours").eq("id", bookingId).maybeSingle();
      if (bk) {
        const { data: s } = await admin
          .from("sitters").select("user_id").eq("id", bk.sitter_id).maybeSingle();
        if (s?.user_id) {
          await admin.from("notifications").insert({
            user_id: s.user_id,
            type: "booking_request",
            title: "New booking request 🎉",
            body: `A parent booked ${bk.hours}h. Accept to confirm.`,
            link: "/sitter/dashboard",
          });
        }
      }
    }

    if (event.type === "checkout.session.expired" || event.type === "transaction.payment_failed") {
      const bookingId = event.data.object?.metadata?.booking_id;
      if (bookingId) {
        await admin.from("bookings")
          .update({ status: "cancelled" })
          .eq("id", bookingId)
          .eq("status", "pending_payment");
      }
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    console.error("webhook handler error", e);
    return new Response("error", { status: 500 });
  }
});
