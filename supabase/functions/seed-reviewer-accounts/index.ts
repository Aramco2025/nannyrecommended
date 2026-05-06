// Seeds Apple App Review test accounts. Idempotent — safe to call multiple
// times. Requires admin role (or service-role secret in header).
//
// Usage from your machine, after publishing:
//   curl -X POST https://<project>.supabase.co/functions/v1/seed-reviewer-accounts \
//     -H "x-admin-secret: $SUPABASE_SERVICE_ROLE_KEY"
//
// Or invoke via the Lovable preview as a signed-in admin user.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-secret",
};

const REVIEWERS = [
  { email: "apple.review.parent@nannyrecommended.com", full_name: "Apple Reviewer (Parent)", role: "parent" as const },
  { email: "apple.review.sitter@nannyrecommended.com", full_name: "Apple Reviewer (Sitter)", role: "sitter" as const },
  { email: "apple.review.both@nannyrecommended.com",   full_name: "Apple Reviewer (Both)",   role: "parent" as const },
];

const PASSWORD = "AppleReview2026!";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const adminSecret = req.headers.get("x-admin-secret");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey);

    // Allow either: header secret OR signed-in admin role
    let authorised = adminSecret === serviceKey;
    if (!authorised) {
      const token = req.headers.get("Authorization")?.replace("Bearer ", "");
      if (token) {
        const { data: { user } } = await admin.auth.getUser(token);
        if (user) {
          const { data: roles } = await admin.from("user_roles").select("role").eq("user_id", user.id);
          authorised = (roles ?? []).some(r => r.role === "admin");
        }
      }
    }
    if (!authorised) return json({ error: "Forbidden" }, 403);

    const results: Array<{ email: string; status: string; user_id?: string }> = [];

    for (const r of REVIEWERS) {
      // Try to find existing user
      const { data: list } = await admin.auth.admin.listUsers();
      const existing = list?.users?.find(u => u.email === r.email);
      let userId = existing?.id;

      if (!userId) {
        const { data: created, error: createErr } = await admin.auth.admin.createUser({
          email: r.email,
          password: PASSWORD,
          email_confirm: true,
          user_metadata: { full_name: r.full_name, role: r.role },
        });
        if (createErr) { results.push({ email: r.email, status: "error: " + createErr.message }); continue; }
        userId = created.user!.id;
      } else {
        // Ensure password is the documented one
        await admin.auth.admin.updateUserById(userId, { password: PASSWORD, email_confirm: true });
      }

      // Mark as reviewer + ensure profile fields
      await admin.from("profiles").upsert({
        id: userId,
        full_name: r.full_name,
        is_apple_reviewer: true,
        onboarding_completed: true,
        phone_verified: true,
        active_role: r.role,
      });

      // Sitter row for sitter + both accounts
      if (r.role === "sitter" || r.email.includes("both")) {
        await admin.from("sitters").upsert({
          user_id: userId,
          full_name: r.full_name,
          headline: "Apple Review demo profile",
          bio: "This is a demonstration sitter profile for App Review.",
          area: "Dubai Marina",
          hourly_rate_aed: 75,
          years_experience: 5,
          languages: ["English", "Arabic"],
          is_active: true,
          verified: true,
          police_cleared: true,
          first_aid_certified: true,
          early_years_qualified: true,
          rating: 4.9,
          bookings_completed: 12,
        }, { onConflict: "user_id" });
      }

      // Wallet credit (AED 1000 = 100000 minor units) for sitter accounts
      if (r.role === "sitter" || r.email.includes("both")) {
        try {
          await admin.rpc("ensure_wallet", { _user: userId });
          await admin.from("wallets").update({ balance_minor_units: 100000 }).eq("user_id", userId);
        } catch { /* wallet may already exist */ }
      }

      // Loyalty for parents
      if (r.role === "parent" || r.email.includes("both")) {
        await admin.from("loyalty").upsert({ parent_id: userId, completed_bookings: 2, tier: "silver" });
      }

      results.push({ email: r.email, status: existing ? "updated" : "created", user_id: userId });
    }

    return json({ ok: true, password: PASSWORD, results });
  } catch (e) {
    console.error("seed-reviewer-accounts", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
