# iOS Pre-Submission Build Plan (Part 1)

This plan covers everything **Lovable can build** from your protocol. Part 2 (the human testing) is yours to execute on a Mac with Xcode + TestFlight — no code can do that for you.

What's already in place from earlier waves:
- Capacitor wired up (`capacitor.config.ts`, bundle id `com.nannyrecommended`)
- Sign in with Apple as the first OAuth option on iOS
- Account-deletion edge function + `DeleteAccountSection`
- Family Plus reader-rule copy on iOS (no prices, no buy button)
- `STORE_SUBMISSION.md` + `STORE_SUBMISSION_PRIVACY.md`
- `openExternal` helper using in-app SFSafariViewController

So this plan only fills the **remaining gaps** from your protocol.

---

## Wave T-A — Capacitor config tightening (10 min)

1. Add `limitsNavigationsToAppBoundDomains: true` (already set ✓) and add `WKAppBoundDomains` to the iOS `Info.plist` template note in `STORE_SUBMISSION.md` listing `nannyrecommended.com`.
2. Confirm `bundleId` matches your Apple Dev console: **`com.nannyrecommended`** (currently set). Note in the submission doc that the App ID in Apple Developer must match exactly.
3. Document the dev/prod toggle of the `server.url` block more loudly (add a `// PROD: COMMENT OUT` banner).

## Wave T-B — Required Info.plist permission strings (15 min)

Create `ios-permissions.md` with the exact NSCameraUsageDescription / NSPhotoLibrary / NSLocationWhenInUse / NSContacts / NSFaceID / NSUserTracking strings from your brief, ready to paste into `ios/App/App/Info.plist` after `npx cap add ios` runs on your Mac. (Capacitor's CLI generates a starter Info.plist; we can't edit it from here because the `ios/` folder is created on your Mac, not in this repo.)

## Wave T-C — Sentry crash + error reporting (~30 min)

1. Add `@sentry/react` and `@sentry/capacitor`.
2. New `src/lib/observability/sentry.ts` initialised from `main.tsx`, gated on `import.meta.env.PROD` and a `VITE_SENTRY_DSN` env var.
3. Wrap the app in `Sentry.ErrorBoundary` with a friendly fallback (no white screen).
4. Add `add_secret` request for `VITE_SENTRY_DSN` (you create the project at sentry.io — free tier is fine for v1).

## Wave T-D — Apple Reviewer accounts + Review Mode (~60 min)

Database migration:
- Add `is_apple_reviewer boolean default false` to `profiles`.
- Seed three users via SQL migration:
  - `apple.review.parent@nannyrecommended.com`
  - `apple.review.sitter@nannyrecommended.com`
  - `apple.review.both@nannyrecommended.com`
  Password `AppleReview2026!` for all (created via `auth.admin.createUser` in a one-shot edge function so the password hash is correct).
- Pre-load each: profile data, children for the parent, a verified sitter row, AED 1000 wallet balance, one completed past booking, an active Family Plus row in `subscriptions`.

Review-mode helpers:
- `src/hooks/useReviewMode.ts` returns `true` when the signed-in profile has `is_apple_reviewer = true`.
- In cash-out flow: if reviewer, instantly mark request as `completed` with a mocked pickup code and skip real Twilio SMS.
- In sitter verification: if reviewer, auto-grant verified badge.
- In booking confirm: if reviewer, suppress real-sitter push notifications.
- All Stripe calls already run in sandbox in non-published preview, so reviewers will use sandbox automatically — no extra change needed there.

## Wave T-E — Offline + network resilience (~30 min)

1. `src/hooks/useOnline.ts` — wraps `navigator.onLine` + `window.addEventListener('online'/'offline')` and Capacitor `Network` plugin when native.
2. `<OfflineBanner />` mounted in `App.tsx`: friendly "You're offline — we'll retry when you reconnect" bar (not a scary error).
3. Wrap booking-confirm and payment-confirm buttons with a "disable while offline + queue retry" guard so a mid-payment airplane-mode toggle doesn't double-charge.
4. Add idempotency: the existing checkout buttons get a `useRef` lock to prevent rapid-tap double submission.

## Wave T-F — Apple-required UI sweep (~20 min)

- **Privacy policy link** inside the app — already at `/privacy`; add a visible link in `Account.tsx` footer (currently only in onboarding).
- **Report a concern** button on each sitter profile (`SitterProfile.tsx`) → opens a dialog that POSTs to a new `report-concern` edge function which emails `safety@nannyrecommended.com` (or just inserts into a `safety_reports` table for v1).
- **Block user** action in message thread overflow menu (`MessageThread.tsx`) → inserts into a new `blocked_users` table; messaging hooks already filter on user_id so we extend the query.
- **Account deletion** — already shipped, but move the section into Account so it's reachable in ≤2 taps from the home tab bar. Verify path: Tab bar → Account → Danger zone → Delete (✓ 2 taps).
- **Restore purchases** — N/A because we don't ship IAP, but add a one-line "Manage subscription on web →" CTA in Account that opens `nannyrecommended.com/account` via `openExternal`.

## Wave T-G — Status / health page (~10 min)

`/status` route showing: backend reachable (ping `subscriptions` head), auth reachable, Stripe reachable. Plain page, no auth required. Used by you (and indirectly by Apple if they hit it).

## Wave T-H — Reviewer notes file (~5 min)

Create `STORE_REVIEWER_NOTES.md` with the verbatim text block from your protocol, pre-filled with the seeded reviewer credentials. You paste this into App Store Connect → App Review Information.

## Wave T-I — TestFlight pre-flight checklist file (~5 min)

Append a new section to `STORE_SUBMISSION.md`: the 48-hour sweep checklist from Part 2 of your brief, formatted as a printable markdown checklist. Belt-and-braces for you on submission day.

---

## What this plan deliberately does NOT do

- **Native Apple Pay button via Stripe PaymentRequest** — your booking flow already runs through Stripe Checkout (embedded), which renders Apple Pay automatically on iOS Safari/WKWebView when the device supports it. Building a separate native Apple Pay sheet would mean a second payments path to maintain. Recommend leaving as-is unless review flags it.
- **Native push notifications** — your protocol lists this as expected, but you currently have no push backend. Adding APNs + a push edge function is a separate ~1 day of work. Suggest deferring to v1.1; in-app notifications already work and Apple does not require push.
- **Image moderation (Sightengine/Rekognition)** — needs a paid third-party account. Your existing flow already requires manual sitter verification before profiles go live, which satisfies guideline 1.2 for v1. Add automated moderation in v1.1 once volume justifies it.
- **Biometric Face ID app-unlock** — listed as "optional but expected". Skipping for v1; can add via `@capacitor-community/biometric-auth` later.
- **iPad-optimised layouts** — out of scope; we'll declare iPhone-only in App Store Connect (Apple still tests iPad rendering but accepts iPhone-only listings).
- **The `ios/` Xcode project itself** — created by `npx cap add ios` on your Mac. Cannot exist in this repo because Capacitor regenerates it from `capacitor.config.ts`.

---

## Order of execution if you approve

1. T-D (reviewer accounts + review mode) — biggest unlock for your testing
2. T-C (Sentry) — so you can see what reviewers/testers hit
3. T-F (Apple UI sweep: report/block/privacy link)
4. T-E (offline + idempotency)
5. T-G, T-H, T-I, T-A, T-B (docs + small files)

Estimated total agent time: ~3 hours of build + one DB migration approval + one secret request (`VITE_SENTRY_DSN`).

## One question before I start

**Where should "Report a concern" submissions go?**
- A) Just insert into a new `safety_reports` table you'll review manually in the Lovable Cloud DB viewer (fastest, no email setup).
- B) Insert + send email to a `safety@nannyrecommended.com` address via Resend (needs a Resend API key + verified domain).
- C) Insert + Twilio SMS to your phone (you already have Twilio configured for OTP — cheapest reuse).

Reply with A, B, or C and I'll start with Wave T-D.