// Creates a draft booking and a Stripe Embedded Checkout session.
// Returns { booking_id, client_secret } for the front-end to mount.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { createStripeClient, type StripeEnv } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
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
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { sitter_id, start_at, hours, address, notes, return_url, environment } =
      await req.json();
    if (!sitter_id || !start_at || !hours || !return_url) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (hours <= 0 || hours > 24) {
      return new Response(JSON.stringify({ error: "invalid hours" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const env: StripeEnv = environment === "live" ? "live" : "sandbox";

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: sitter, error: sErr } = await admin
      .from("sitters")
      .select("id, hourly_rate_aed, full_name, is_active")
      .eq("id", sitter_id)
      .maybeSingle();
    if (sErr || !sitter || !sitter.is_active) {
      return new Response(JSON.stringify({ error: "sitter not available" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rate = Number(sitter.hourly_rate_aed);
    const subtotal = +(rate * hours).toFixed(2);
    const fee = +(subtotal * 0.08).toFixed(2);
    const payout = +(subtotal * 0.96).toFixed(2);
    const total = +(subtotal + fee).toFixed(2);
    const start = new Date(start_at);
    const end = new Date(start.getTime() + hours * 3600 * 1000);

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
      .select("id")
      .single();
    if (bErr) throw bErr;

    const stripe = createStripeClient(env);
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "aed",
            unit_amount: Math.round(total * 100),
            product_data: {
              name: `Booking with ${sitter.full_name ?? "sitter"} — ${hours}h`,
            },
          },
        },
      ],
      return_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}&booking_id=${booking.id}`,
      metadata: {
        booking_id: booking.id,
        parent_id: user.id,
      },
      payment_intent_data: { metadata: { booking_id: booking.id } },
    });

    await admin
      .from("bookings")
      .update({
        stripe_session_id: session.id,
        payment_method_ref: (session.payment_intent as string) ?? null,
      })
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
