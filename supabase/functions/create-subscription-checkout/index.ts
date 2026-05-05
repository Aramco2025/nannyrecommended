// Creates a Stripe Embedded Checkout session for a Family Plus subscription.
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
    const auth = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: auth } },
    });
    const { data: ud } = await userClient.auth.getUser();
    const user = ud?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { priceId, return_url, environment } = await req.json();
    if (!priceId || !return_url) {
      return new Response(JSON.stringify({ error: "missing fields" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const env: StripeEnv = environment === "live" ? "live" : "sandbox";

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: existing } = await admin
      .from("subscriptions").select("id,status,cancel_at_period_end")
      .eq("user_id", user.id).eq("environment", env)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (existing && ["active", "trialing"].includes(existing.status) && !existing.cancel_at_period_end) {
      return new Response(JSON.stringify({ error: "already subscribed" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = createStripeClient(env);
    const prices = await stripe.prices.list({ lookup_keys: [priceId], limit: 1 });
    if (!prices.data.length) throw new Error("price not found");
    const price = prices.data[0];

    const { data: profile } = await admin
      .from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      mode: "subscription",
      line_items: [{ price: price.id, quantity: 1 }],
      return_url: `${return_url}?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: profile?.stripe_customer_id ? undefined : user.email,
      customer: profile?.stripe_customer_id ?? undefined,
      metadata: { userId: user.id, plan: "family_plus", priceId },
      subscription_data: { metadata: { userId: user.id, plan: "family_plus", priceId } },
    });

    return new Response(JSON.stringify({ client_secret: session.client_secret }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-subscription-checkout", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
