import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Download, Eye, FileText, Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { format } from "date-fns";

type TabId =
  | "users" | "sitter_apps" | "sitters" | "children" | "bookings"
  | "messages" | "reviews" | "payments" | "safety" | "disputes"
  | "storage" | "exports";

const TABS: { id: TabId; label: string }[] = [
  { id: "users", label: "Users (with email)" },
  { id: "sitter_apps", label: "Sitter applications" },
  { id: "sitters", label: "Sitter profiles" },
  { id: "children", label: "Children" },
  { id: "bookings", label: "Bookings" },
  { id: "messages", label: "Messages" },
  { id: "reviews", label: "Reviews" },
  { id: "payments", label: "Payments" },
  { id: "safety", label: "Safety reports" },
  { id: "disputes", label: "Disputes" },
  { id: "storage", label: "Files (ID docs / videos)" },
  { id: "exports", label: "Data export requests" },
];

export default function AdminDataBrowser() {
  const { user, roles, loading } = useAuth();
  const [tab, setTab] = useState<TabId>("users");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<any[] | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    if (!user || !roles.includes("admin")) return;
    setRows(null);
    fetchTab(tab).then(setRows).catch((e) => {
      console.error(e);
      setRows([]);
    });
  }, [tab, user, roles, refreshKey]);

  const filtered = useMemo(() => {
    if (!rows) return null;
    if (!query.trim()) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(q));
  }, [rows, query]);

  if (loading) return <div className="grid min-h-screen place-items-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!roles.includes("admin")) return (
    <div className="min-h-screen bg-background"><Header />
      <main className="container py-16 text-center"><p className="text-slate-grey">Admins only.</p></main>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-bold text-pitch-black">Customer data browser</h1>
            <p className="mt-1 text-sm text-slate-grey">Read-only view of all customer records and uploaded files.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setRefreshKey(k => k + 1)}>
              <RefreshCw className="mr-2 h-3.5 w-3.5" /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportCsv(tab, filtered ?? [])}>
              <Download className="mr-2 h-3.5 w-3.5" /> Export CSV
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <nav className="flex flex-row flex-wrap gap-2 lg:flex-col lg:flex-nowrap">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                  tab === t.id ? "bg-pitch-black text-pure-white" : "bg-cream text-slate-grey hover:bg-cream-deep"
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Main panel */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-grey" />
              <Input
                placeholder="Search this tab…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
              {!filtered ? (
                <div className="grid place-items-center py-16"><Loader2 className="h-5 w-5 animate-spin" /></div>
              ) : filtered.length === 0 ? (
                <div className="py-16 text-center text-sm text-slate-grey">No records.</div>
              ) : (
                <DataTable tab={tab} rows={filtered} onSelect={setSelected} />
              )}
            </div>
            <p className="text-xs text-slate-grey">Showing {filtered?.length ?? 0} rows · click any row for details.</p>
          </div>
        </div>
      </main>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Record details</SheetTitle>
          </SheetHeader>
          {selected && <RowDetail tab={tab} row={selected} />}
        </SheetContent>
      </Sheet>

      <Footer />
    </div>
  );
}

// ---------- Fetch per tab ----------

async function fetchTab(tab: TabId): Promise<any[]> {
  if (tab === "users") {
    const { data, error } = await supabase.functions.invoke("admin-data?action=users", { method: "GET" });
    if (error) throw error;
    const users = (data as any)?.users ?? [];
    // Join profiles
    const ids = users.map((u: any) => u.id);
    const { data: profiles } = await supabase.from("profiles").select("*").in("id", ids);
    const { data: rolesRows } = await supabase.from("user_roles").select("user_id, role").in("user_id", ids);
    const profMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
    const roleMap = new Map<string, string[]>();
    for (const r of rolesRows ?? []) {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    }
    return users.map((u: any) => ({
      ...u,
      ...(profMap.get(u.id) ?? {}),
      roles: roleMap.get(u.id) ?? [],
    }));
  }
  if (tab === "sitter_apps") {
    const { data } = await supabase.from("sitter_applications").select("*").order("updated_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "sitters") {
    const { data } = await supabase.from("sitters").select("*").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "children") {
    const { data } = await supabase.from("children").select("*, profiles:parent_id(full_name)").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "bookings") {
    const { data } = await supabase.from("bookings").select("id, start_at, hours, status, total_aed, parent_id, sitter_id, created_at, sitters:sitter_id(full_name), profiles:parent_id(full_name, phone)").order("start_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "messages") {
    const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "reviews") {
    const { data } = await supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "payments") {
    const { data } = await supabase.from("charges").select("*").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "safety") {
    const { data } = await supabase.from("safety_reports").select("*").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "disputes") {
    const { data } = await supabase.from("disputes").select("*").order("created_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "exports") {
    const { data } = await supabase.from("data_export_requests").select("*").order("requested_at", { ascending: false }).limit(500);
    return data ?? [];
  }
  if (tab === "storage") {
    const { data, error } = await supabase.functions.invoke("admin-data?action=storage_list_all", { method: "GET" });
    if (error) throw error;
    return (data as any)?.files ?? [];
  }
  return [];
}

// ---------- Table ----------

function DataTable({ tab, rows, onSelect }: { tab: TabId; rows: any[]; onSelect: (r: any) => void }) {
  const cols = COLS[tab];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-cream text-xs uppercase text-slate-grey">
          <tr>
            {cols.map(c => <th key={c.key} className="px-4 py-3 text-left font-medium">{c.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? r.path ?? i} onClick={() => onSelect(r)} className="cursor-pointer border-t border-border hover:bg-cream/50">
              {cols.map(c => (
                <td key={c.key} className="px-4 py-3 text-pitch-black">{c.render ? c.render(r) : formatCell(r[c.key])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type Col = { key: string; label: string; render?: (r: any) => any };

const COLS: Record<TabId, Col[]> = {
  users: [
    { key: "email", label: "Email" },
    { key: "full_name", label: "Name" },
    { key: "phone", label: "Phone" },
    { key: "roles", label: "Roles", render: (r) => (r.roles ?? []).join(", ") || "—" },
    { key: "created_at", label: "Joined", render: (r) => fmtDate(r.created_at) },
    { key: "last_sign_in_at", label: "Last sign in", render: (r) => fmtDate(r.last_sign_in_at) },
  ],
  sitter_apps: [
    { key: "sitter_user_id", label: "User ID", render: (r) => short(r.sitter_user_id) },
    { key: "status", label: "Status", render: (r) => <Badge variant="secondary">{r.status}</Badge> },
    { key: "id_doc_url", label: "ID doc", render: (r) => r.id_doc_url ? "✅" : "—" },
    { key: "video_url", label: "Video", render: (r) => r.video_url ? "🎥" : "—" },
    { key: "submitted_at", label: "Submitted", render: (r) => fmtDate(r.submitted_at) },
  ],
  sitters: [
    { key: "full_name", label: "Name" },
    { key: "area", label: "Area" },
    { key: "hourly_rate_aed", label: "Rate", render: (r) => `AED ${r.hourly_rate_aed}` },
    { key: "tier", label: "Tier" },
    { key: "rating", label: "Rating" },
    { key: "is_active", label: "Active", render: (r) => r.is_active ? "✅" : "—" },
  ],
  children: [
    { key: "name", label: "Child" },
    { key: "dob", label: "DOB" },
    { key: "profiles", label: "Parent", render: (r) => r.profiles?.full_name ?? "—" },
    { key: "notes", label: "Notes" },
  ],
  bookings: [
    { key: "start_at", label: "Date", render: (r) => fmtDate(r.start_at) },
    { key: "profiles", label: "Parent", render: (r) => r.profiles?.full_name ?? "—" },
    { key: "sitters", label: "Sitter", render: (r) => r.sitters?.full_name ?? "—" },
    { key: "status", label: "Status" },
    { key: "total_aed", label: "Total", render: (r) => `AED ${r.total_aed}` },
  ],
  messages: [
    { key: "booking_id", label: "Booking", render: (r) => short(r.booking_id) },
    { key: "sender_id", label: "Sender", render: (r) => short(r.sender_id) },
    { key: "body", label: "Message", render: (r) => (r.body ?? "").slice(0, 80) },
    { key: "created_at", label: "When", render: (r) => fmtDate(r.created_at) },
  ],
  reviews: [
    { key: "rating", label: "★" },
    { key: "comment", label: "Comment" },
    { key: "created_at", label: "When", render: (r) => fmtDate(r.created_at) },
  ],
  payments: [
    { key: "user_id", label: "User", render: (r) => short(r.user_id) },
    { key: "amount_minor_units", label: "Amount", render: (r) => `${r.currency} ${(r.amount_minor_units / 100).toFixed(2)}` },
    { key: "status", label: "Status" },
    { key: "stripe_payment_intent_id", label: "Stripe PI", render: (r) => short(r.stripe_payment_intent_id) },
    { key: "created_at", label: "When", render: (r) => fmtDate(r.created_at) },
  ],
  safety: [
    { key: "category", label: "Category" },
    { key: "description", label: "Description", render: (r) => (r.description ?? "").slice(0, 80) },
    { key: "status", label: "Status" },
    { key: "created_at", label: "When", render: (r) => fmtDate(r.created_at) },
  ],
  disputes: [
    { key: "reason", label: "Reason" },
    { key: "status", label: "Status" },
    { key: "refund_amount_aed", label: "Refund" },
    { key: "created_at", label: "When", render: (r) => fmtDate(r.created_at) },
  ],
  storage: [
    { key: "name", label: "File" },
    { key: "user_id", label: "Uploader", render: (r) => short(r.user_id) },
    { key: "mimetype", label: "Type" },
    { key: "size", label: "Size", render: (r) => r.size ? `${(r.size / 1024).toFixed(1)} KB` : "—" },
    { key: "created_at", label: "Uploaded", render: (r) => fmtDate(r.created_at) },
  ],
  exports: [
    { key: "user_id", label: "User", render: (r) => short(r.user_id) },
    { key: "status", label: "Status" },
    { key: "requested_at", label: "Requested", render: (r) => fmtDate(r.requested_at) },
  ],
};

// ---------- Row drawer ----------

function RowDetail({ tab, row }: { tab: TabId; row: any }) {
  const [signed, setSigned] = useState<Record<string, string>>({});

  const getSignedUrl = async (path: string) => {
    if (signed[path]) return signed[path];
    const { data, error } = await supabase.functions.invoke(`admin-data?action=signed_url&path=${encodeURIComponent(path)}`, { method: "GET" });
    if (error) { alert(error.message); return null; }
    const url = (data as any).url;
    setSigned(s => ({ ...s, [path]: url }));
    return url;
  };

  // For sitter applications — id doc + video
  const fileLinks: { label: string; path: string }[] = [];
  if (tab === "sitter_apps") {
    if (row.id_doc_url) fileLinks.push({ label: "Identity document", path: row.id_doc_url });
    if (row.video_url) fileLinks.push({ label: "Intro video", path: row.video_url });
  }
  if (tab === "storage" && row.path) {
    fileLinks.push({ label: row.name, path: row.path });
  }
  if (tab === "disputes" && Array.isArray(row.evidence_urls)) {
    for (const u of row.evidence_urls) fileLinks.push({ label: u.split("/").pop() || u, path: u });
  }

  return (
    <div className="mt-6 space-y-6">
      {fileLinks.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-pitch-black">Files</h3>
          {fileLinks.map(f => (
            <div key={f.path} className="flex items-center justify-between rounded-xl border border-border bg-cream p-3">
              <div className="flex items-center gap-2 truncate text-sm">
                <FileText className="h-4 w-4 shrink-0 text-slate-grey" />
                <span className="truncate">{f.label}</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={async () => {
                  const url = await getSignedUrl(f.path);
                  if (url) window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" /> Open
              </Button>
            </div>
          ))}
          <p className="text-xs text-slate-grey">Links expire after 1 hour.</p>
        </div>
      )}

      <div>
        <h3 className="mb-2 text-sm font-semibold text-pitch-black">Raw record</h3>
        <pre className="max-h-[60vh] overflow-auto rounded-xl border border-border bg-cream p-4 text-xs text-pitch-black">
{JSON.stringify(row, null, 2)}
        </pre>
      </div>
    </div>
  );
}

// ---------- Helpers ----------

function fmtDate(d?: string | null) {
  if (!d) return "—";
  try { return format(new Date(d), "dd MMM yyyy HH:mm"); } catch { return d; }
}

function short(id?: string | null) {
  if (!id) return "—";
  return id.slice(0, 8) + "…";
}

function formatCell(v: any): string {
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "object") return JSON.stringify(v).slice(0, 60);
  return String(v);
}

function exportCsv(tab: TabId, rows: any[]) {
  if (!rows.length) return;
  const cols = COLS[tab].map(c => c.key);
  const header = cols.join(",");
  const lines = rows.map(r => cols.map(k => {
    const v = r[k];
    const s = v === null || v === undefined ? "" : typeof v === "object" ? JSON.stringify(v) : String(v);
    return `"${s.replace(/"/g, '""')}"`;
  }).join(","));
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${tab}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
