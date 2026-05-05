// Transfer funds from the platform balance to a sitter's connected Stripe
// account in fulfilment of an approved bank-transfer cash-out request.
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
    if (!user) return json({ error: "unauthorized" }, 401);

    const { cash_out_request_id, environment } = await req.json();
    if (!cash_out_request_id) return json({ error: "missing cash_out_request_id" }, 400);
    const env: StripeEnv = environment === "live" ? "live" : "sandbox";

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    // Authorisation: admin OR the sitter who owns the cash-out request.
    const { data: cor } = await admin
      .from("cash_out_requests")
      .select("id, sitter_id, amount_minor_units, currency, method, status")
      .eq("id", cash_out_request_id)
      .maybeSingle();
    if (!cor) return json({ error: "request not found" }, 404);
    if (cor.method !== "bank_transfer") return json({ error: "not a bank transfer" }, 400);

    if (cor.sitter_id !== user.id) {
      const { data: roleRow } = await admin
        .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      if (!roleRow) return json({ error: "forbidden" }, 403);
    }

    const { data: prof } = await admin
      .from("profiles").select("stripe_connect_account_id, stripe_connect_onboarded")
      .eq("id", cor.sitter_id).maybeSingle();
    if (!prof?.stripe_connect_account_id) {
      return json({ error: "sitter has not connected a bank account" }, 400);
    }

    const stripe = createStripeClient(env);
    const transfer = await stripe.transfers.create({
      amount: cor.amount_minor_units,
      currency: (cor.currency ?? "AED").toLowerCase(),
      destination: prof.stripe_connect_account_id,
      metadata: { cash_out_request_id, sitter_id: cor.sitter_id },
    });

    await admin.from("sitter_payouts").insert({
      sitter_id: cor.sitter_id,
      cash_out_request_id,
      stripe_transfer_id: transfer.id,
      stripe_destination_account: prof.stripe_connect_account_id,
      amount_minor_units: cor.amount_minor_units,
      currency: cor.currency ?? "AED",
      status: "pending",
      environment: env,
    });

    await admin.from("cash_out_requests")
      .update({ status: "processing", processed_at: new Date().toISOString() })
      .eq("id", cash_out_request_id);

    return json({ transfer_id: transfer.id, status: "pending" });
  } catch (e) {
    console.error("stripe-transfer-payout error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
