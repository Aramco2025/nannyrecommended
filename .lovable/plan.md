# Batch 1 — Apple Submission Blockers

Five screens/flows required before App Store submission. All other batches wait for verification.

---

## 1. P3 — Global Error Boundary

**New file:** `src/components/ErrorBoundary.tsx`
- Class component with `componentDidCatch` / `getDerivedStateFromError`
- Friendly fallback UI: brand-styled card, "Something went wrong" heading, short reassurance, "Try again" (resets state) and "Go home" (window.location = '/') buttons
- Logs error to console (Sentry hook stub — add TODO; Sentry isn't wired yet, so use `console.error` and prepare a `reportError(err)` shim that can be swapped later)
- Show error message + "Copy details" only in dev mode (`import.meta.env.DEV`)

**Edit:** `src/main.tsx` — wrap `<App />` with `<ErrorBoundary>`.

---

## 2. N7 — Multi-step Delete Account Flow

**New page:** `src/pages/account/DeleteAccount.tsx` at `/account/delete`

Three steps in a single page (state machine):
1. **Consequences** — explains: active bookings cancelled per policy, data anonymised after 30-day grace, profile/messages/reviews removed; lists what's kept (anonymised booking history for the other party). Continue / Cancel.
2. **Final confirm** — type `DELETE` to enable button (reuse pattern from existing `DeleteAccountSection.tsx`).
3. **Success** — "Account deleted, confirmation sent to {email}", auto sign-out and route to `/` after 5s.

Calls existing `delete-account` edge function (already supports anonymisation). No backend changes needed for v1; the "30-day grace" copy is policy-only since the function deletes immediately — flag this as a known gap to align later.

**Edit:** `src/components/account/DeleteAccountSection.tsx` — replace inline modal with a Link to `/account/delete` (keeps the entry point, simplifies UX).

**Edit:** `src/App.tsx` — add route.

---

## 3. N6 — Privacy & Data Dashboard

**New page:** `src/pages/account/Privacy.tsx` at `/account/privacy`

Sections:
- **Data we hold** — static list with icons: profile, messages, bookings, payment refs (no card numbers), location (last city), device tokens.
- **Download my data** — button calls a new edge function `export-user-data` that queues an export and emails a ZIP within 24h. Shows "We'll email {user.email} within 24 hours." toast + last-requested timestamp stored in `profiles.data_export_requested_at` (new column).
- **Permissions & revocations** — toggles for: marketing emails, SMS notifications, push notifications, share profile with friends. Persists to existing `notification_prefs` where applicable; new fields added if missing.
- **Delete my account** — link to `/account/delete`.

**New edge function:** `supabase/functions/export-user-data/index.ts` — v1 stub: validates JWT, inserts a row into `data_export_requests` table, returns `{ queued: true }`. Actual ZIP build is out of scope; ops processes manually for now (acceptable for Apple review since the user-facing promise is "within 24h").

**DB migration:**
- `alter table profiles add column data_export_requested_at timestamptz;`
- `create table data_export_requests (id uuid pk default gen_random_uuid(), user_id uuid not null, requested_at timestamptz default now(), fulfilled_at timestamptz);` + RLS (user can insert/select own rows; admin can update).

**Edit:** `src/App.tsx` — add route. Add link from Account page.

---

## 4. B5 — Email Verification Pending Screen

**New page:** `src/pages/VerifyEmail.tsx` at `/verify-email`

- Reads pending email from query (`?email=`) or session
- "Check your inbox" copy with email shown
- **Resend email** button — calls `supabase.auth.resend({ type: 'signup', email })`, 60s cooldown
- **Use phone instead** link → `/onboarding/phone`
- **I've verified, continue** button — re-checks session and routes to `/onboarding/role` if confirmed
- Polls `supabase.auth.getUser()` every 5s; auto-advances when `email_confirmed_at` is set

**Edit:** `src/pages/Auth.tsx` — after successful signup, navigate to `/verify-email?email=...` instead of current behaviour.

**Edit:** `src/App.tsx` — add route.

---

## 5. B7 — OAuth Callback Handler

**New page:** `src/pages/AuthCallback.tsx` at `/auth/callback`

- On mount: `supabase.auth.getSession()` (Supabase JS handles the URL hash parsing automatically)
- If error → toast and route to `/auth`
- If session exists:
  - Query `user_roles` for current user
  - If empty → first-time user, route to `/onboarding/role`
  - If has role → route to `/parent/home` (parent), `/sitter/dashboard` (sitter), or `/` fallback
- Loading spinner while resolving

**Edit:** `src/integrations/lovable/` — verify the OAuth `redirect_uri` for Google sign-in points at `/auth/callback`. Update existing `lovable.auth.signInWithOAuth(...)` calls to pass `redirect_uri: ${window.location.origin}/auth/callback`.

**Edit:** `src/App.tsx` — add route.

---

## Files Created
- `src/components/ErrorBoundary.tsx`
- `src/pages/account/DeleteAccount.tsx`
- `src/pages/account/Privacy.tsx`
- `src/pages/VerifyEmail.tsx`
- `src/pages/AuthCallback.tsx`
- `supabase/functions/export-user-data/index.ts`

## Files Edited
- `src/main.tsx` (error boundary wrap)
- `src/App.tsx` (5 new routes)
- `src/components/account/DeleteAccountSection.tsx` (link out)
- `src/pages/Auth.tsx` (post-signup redirect, OAuth redirect_uri)
- `src/pages/Account.tsx` (link to privacy dashboard)

## DB Migration
- `profiles.data_export_requested_at` column
- `data_export_requests` table + RLS

## Verification (browser checks before Batch 2)
1. Throw a test error in any page → boundary fallback renders, "Try again" recovers.
2. `/account/delete` → 3 steps, typed DELETE works, account anonymised, signed out.
3. `/account/privacy` → toggles persist, download triggers queued toast.
4. Sign up with new email → lands on `/verify-email`, resend works, auto-advances after confirm.
5. Sign in with Google → lands on `/auth/callback` → routes correctly first-time vs returning.

After verification I'll wait for your go-ahead before starting Batch 2.