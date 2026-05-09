## Admin Data Browser — single screen to view all customer data

A new admin-only page at **`/admin/data`** with tabs for every customer data source. Restricted to users with the `admin` role (uses the existing `has_role` function — no new tables or policies needed).

### Layout

Left sidebar with categories, right pane shows a searchable, paginated table. Click any row → side drawer with full details + links to related records (e.g. user → their bookings, messages, children, ID docs).

### Tabs (one per data source)

| Tab | Source | Key columns shown | Row drawer shows |
|---|---|---|---|
| **Users** | `auth.users` + `profiles` | email, name, phone, role, joined, verified | Full profile + buttons: view bookings, messages, children, sitter app |
| **Sitter Applications** | `sitter_applications` | name, status, submitted_at | Bio, experience, qualifications, references (JSON pretty-printed), **download ID doc**, **play intro video** |
| **Sitter Profiles** | `sitters` | name, area, rate, tier, rating, active | Full profile incl. certifications, surcharges |
| **Children** | `children` | parent name, child name, DOB, notes | — |
| **Bookings** | `bookings` | parent, sitter, date, status, total | Full booking + linked messages |
| **Messages** | `messages` | booking, sender, snippet, time | Full thread |
| **Reviews** | `reviews` + `parent_reviews` | booking, rating, comment | — |
| **Payments** | `charges`, `payment_methods`, `cash_out_requests`, `sitter_payouts` | user, amount, status, date | Stripe IDs + receipt link |
| **Safety & Disputes** | `safety_reports`, `disputes` | reporter, target, category, status | Description + **download evidence files** |
| **Storage Files** | `verification-docs` bucket | path, size, uploaded | Signed URL preview/download (ID docs + intro videos) |
| **Data Export Requests** | `data_export_requests` | user, status, requested_at | Mark fulfilled |

### Features

- **Global search** across email / name / phone (top bar)
- **Filter chips** per tab (status, date range, role)
- **CSV export** button per tab (downloads visible rows)
- **Signed URLs** for `verification-docs` files (1-hour expiry) — generated on-demand so private bucket stays private
- **Pagination** (50 rows/page) to handle the default 1000-row Supabase limit
- **Read-only** — no edits/deletes from this screen (safer for v1; can add later)

### Access control

- Route guarded: redirects non-admins to `/`
- All queries respect existing RLS — admins already have admin policies on every sensitive table
- ID docs / videos served via short-lived signed URLs (never exposed permanently)

### Technical bits

- New page: `src/pages/admin/DataBrowser.tsx`
- New components: `src/components/admin/DataTable.tsx`, `RowDrawer.tsx`, `StorageBrowser.tsx`
- New hook: `src/hooks/useAdminData.ts` (one query per tab, react-query)
- Edge function: `supabase/functions/admin-signed-url/index.ts` — verifies admin role then returns signed URL for any `verification-docs` path
- Route added to `src/App.tsx`: `/admin/data` (also link from existing admin pages sidebar)
- No DB migration needed — uses existing tables, policies, and `has_role()` function

### Out of scope (can add later)
- Inline editing / deleting records
- Bulk actions (delete user, refund booking)
- Audit log of admin views
- Email/notification sending from the screen
