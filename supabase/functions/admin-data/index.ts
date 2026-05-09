import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    if (!token) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authErr } = await admin.auth.getUser(token);
    if (authErr || !user) return json({ error: "Unauthorized" }, 401);

    // Verify admin role
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const url = new URL(req.url);
    const action = url.searchParams.get("action") ?? "";

    if (action === "users") {
      // List auth users with emails (paginated)
      const page = Number(url.searchParams.get("page") ?? "1");
      const perPage = 200;
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
      if (error) throw error;
      return json({
        users: data.users.map(u => ({
          id: u.id,
          email: u.email,
          phone: u.phone,
          created_at: u.created_at,
          last_sign_in_at: u.last_sign_in_at,
          email_confirmed_at: u.email_confirmed_at,
          provider: u.app_metadata?.provider,
        })),
      });
    }

    if (action === "storage_list") {
      const prefix = url.searchParams.get("prefix") ?? "";
      const { data, error } = await admin.storage
        .from("verification-docs")
        .list(prefix, { limit: 1000, sortBy: { column: "created_at", order: "desc" } });
      if (error) throw error;
      return json({ files: data });
    }

    if (action === "storage_list_all") {
      // Recursively list users + their files (one folder per user)
      const { data: folders, error } = await admin.storage
        .from("verification-docs")
        .list("", { limit: 1000 });
      if (error) throw error;
      const all: any[] = [];
      for (const f of folders ?? []) {
        if (f.id) continue; // skip files at root
        const { data: files } = await admin.storage
          .from("verification-docs")
          .list(f.name, { limit: 100, sortBy: { column: "created_at", order: "desc" } });
        for (const file of files ?? []) {
          all.push({
            path: `${f.name}/${file.name}`,
            name: file.name,
            user_id: f.name,
            size: file.metadata?.size,
            mimetype: file.metadata?.mimetype,
            created_at: file.created_at,
          });
        }
      }
      return json({ files: all });
    }

    if (action === "signed_url") {
      const path = url.searchParams.get("path");
      if (!path) return json({ error: "path required" }, 400);
      const { data, error } = await admin.storage
        .from("verification-docs")
        .createSignedUrl(path, 3600);
      if (error) throw error;
      return json({ url: data.signedUrl });
    }

    return json({ error: "Unknown action" }, 400);
  } catch (e) {
    console.error("admin-data error", e);
    return json({ error: (e as Error).message }, 500);
  }
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
