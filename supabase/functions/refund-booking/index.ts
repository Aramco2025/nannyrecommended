// Refund a booking charge through Stripe and record it.
// Splits between original-card refund and wallet credit happen elsewhere — this
// function performs the Stripe-side refund and marks the booking accordingly.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY =
  Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: u } = await userClient.auth.getUser();
    const user = u?.user;
    if (!user) {
      return json({ error: "unauthorized" }, 401);
    }

    const { booking_id, amount_minor_units, reason, environment } = await req.json();
    if (!booking_id) return json({ error: "missing booking_id" }, 400);

    const env: StripeEnv = environment === "live" ? "live" : "sandbox";
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: booking } = await admin
      .from("bookings")
      .select("id, parent_id, total_aed, payment_method_ref, stripe_payment_intent_id")
      .eq("id", booking_id)
      .maybeSingle();
    if (!booking) return json({ error: "booking not found" }, 404);

    // Authorisation: parent on the booking, or admin
    if (booking.parent_id !== user.id) {
      const { data: roleRow } = await admin
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleRow) return json({ error: "forbidden" }, 403);
    }

    const pi = booking.stripe_payment_intent_id ?? booking.payment_method_ref;
    if (!pi) return json({ error: "no payment intent on booking" }, 400);

    const stripe = createStripeClient(env);
    const refund = await stripe.refunds.create({
      payment_intent: pi,
      ...(amount_minor_units ? { amount: amount_minor_units } : {}),
      reason: "requested_by_customer",
      metadata: { booking_id, reason: reason ?? "" },
    });

    // Find the matching charge row to link the refund to (best-effort)
    const { data: chargeRow } = await admin
      .from("charges").select("id").eq("stripe_payment_intent_id", pi).maybeSingle();
    if (chargeRow) {
      await admin.from("refunds").insert({
        charge_id: chargeRow.id,
        stripe_refund_id: refund.id,
        amount_minor_units: refund.amount,
        currency: (refund.currency ?? "aed").toUpperCase(),
        reason: reason ?? null,
        status: refund.status ?? "pending",
      });
    }

    return json({ refund_id: refund.id, status: refund.status });
  } catch (e) {
    console.error("refund-booking error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
