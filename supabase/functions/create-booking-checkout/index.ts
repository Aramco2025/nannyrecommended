// Creates a draft booking and a Stripe Embedded Checkout session.
// Returns { booking_id, client_secret } for the front-end to mount.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STRIPE_KEY = Deno.env.get("STRIPE_SANDBOX_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function stripe(path: string, body: Record<string, string>) {
  const form = new URLSearchParams(body).toString();
  const r = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${STRIPE_KEY}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });
  const json = await r.json();
  if (!r.ok) throw new Error(json?.error?.message || "Stripe error");
  return json;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ?? Deno.env.get("SUPABASE_ANON_KEY") ?? "", {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { sitter_id, start_at, hours, address, notes, return_url } = await req.json();
    if (!sitter_id || !start_at || !hours || !return_url) {
      return new Response(JSON.stringify({ error: "missing fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (hours <= 0 || hours > 24) {
      return new Response(JSON.stringify({ error: "invalid hours" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Look up sitter rate
    const { data: sitter, error: sErr } = await admin
      .from("sitters").select("id, hourly_rate_aed, full_name, is_active")
      .eq("id", sitter_id).maybeSingle();
    if (sErr || !sitter || !sitter.is_active) {
      return new Response(JSON.stringify({ error: "sitter not available" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const rate = Number(sitter.hourly_rate_aed);
    const subtotal = +(rate * hours).toFixed(2);
    const fee = +(subtotal * 0.08).toFixed(2);
    const payout = +(subtotal * 0.96).toFixed(2);
    const total = +(subtotal + fee).toFixed(2);
    const start = new Date(start_at);
    const end = new Date(start.getTime() + hours * 3600 * 1000);

    // Create draft booking (pending_payment)
    const { data: booking, error: bErr } = await admin
      .from("bookings")
      .insert({
        parent_id: user.id,
        sitter_id,
        start_at: start.toISOString(),
        end_at: end.toISOString(),
        hours,
        hourly_rate_aed: rate,
        subtotal_aed: subtotal,
        platform_fee_aed: fee,
        sitter_payout_aed: payout,
        total_aed: total,
        status: "pending_payment",
        address: address ?? null,
        notes: notes ?? null,
      })
      .select("id").single();
    if (bErr) throw bErr;

    // Stripe Checkout — embedded mode, AED, single line item
    const totalMinor = Math.round(total * 100);
    const session = await stripe("/checkout/sessions", {
      "ui_mode": "embedded",
      "mode": "payment",
      "currency": "aed",
      "line_items[0][quantity]": "1",
      "line_items[0][price_data][currency]": "aed",
      "line_items[0][price_data][unit_amount]": String(totalMinor),
      "line_items[0][price_data][product_data][name]":
        `Booking with ${sitter.full_name ?? "sitter"} — ${hours}h`,
      "return_url": `${return_url}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      "metadata[booking_id]": booking.id,
      "metadata[parent_id]": user.id,
      "payment_intent_data[metadata][booking_id]": booking.id,
    });

    await admin.from("bookings")
      .update({ stripe_session_id: session.id, payment_method_ref: session.payment_intent ?? null })
      .eq("id", booking.id);

    return new Response(
      JSON.stringify({ booking_id: booking.id, client_secret: session.client_secret }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("create-booking-checkout error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
