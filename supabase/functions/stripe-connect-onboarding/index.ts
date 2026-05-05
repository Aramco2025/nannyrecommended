// Stripe Connect Express onboarding for sitters.
// Creates (or reuses) an Express account, then returns an account-link URL.
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

    const { environment } = await req.json().catch(() => ({}));
    const env: StripeEnv = environment === "live" ? "live" : "sandbox";

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: profile } = await admin
      .from("profiles")
      .select("stripe_connect_account_id")
      .eq("id", user.id)
      .maybeSingle();

    const stripe = createStripeClient(env);

    let accountId = profile?.stripe_connect_account_id as string | null | undefined;
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        country: "AE",
        email: user.email ?? undefined,
        capabilities: { transfers: { requested: true } },
        metadata: { user_id: user.id },
      });
      accountId = account.id;
      await admin
        .from("profiles")
        .update({ stripe_connect_account_id: accountId })
        .eq("id", user.id);
    }

    const origin = req.headers.get("origin") ?? "https://nannyrecommended.com";
    const link = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${origin}/sitter/wallet?connect=refresh`,
      return_url: `${origin}/sitter/wallet?connect=done`,
      type: "account_onboarding",
    });

    return json({ url: link.url, account_id: accountId });
  } catch (e) {
    console.error("stripe-connect-onboarding error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(b: unknown, status = 200) {
  return new Response(JSON.stringify(b), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
