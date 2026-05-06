## App Store Readiness Plan

Goal: get the app submission-ready for the Apple App Store (and Google Play), and avoid Apple's 30% IAP cut on Family+ by routing subscriptions to the website instead.

---

### Wave S-A — Capacitor native wrap

Wrap the existing web app as a native iOS + Android binary so it can be submitted to the stores.

- Install `@capacitor/core`, `@capacitor/cli` (dev), `@capacitor/ios`, `@capacitor/android`.
- Create `capacitor.config.ts` with:
  - `appId: app.lovable.e1e5d17a34de4ddfa367ad73ca194925`
  - `appName: nannyrecommended`
  - `server.url` pointing at the sandbox preview for hot-reload during dev
- Add a `Capacitor.isNativePlatform()` helper (`src/lib/platform.ts`) used by later waves to branch UI behaviour (subscription routing, push, etc.).
- Document the local steps the user must run on their own Mac: `npx cap add ios/android`, `npx cap sync`, `npx cap run ios`.

No store assets generated in this wave — that's a manual step on the user's Mac with Xcode.

---

### Wave S-B — App Store compliance: Sign in with Apple + account deletion

Apple rejects apps that offer Google login without also offering Apple, and now requires in-app account deletion.

- **Sign in with Apple**
  - Add Apple as an OAuth provider option in `src/pages/Auth.tsx` next to Google.
  - Use the existing Lovable Cloud managed Apple auth (no Apple Developer credentials needed up front; user can swap to BYOC later).
  - Add a small Apple logo button matching the existing Google button styling.
- **In-app account deletion**
  - Add a "Delete my account" section at the bottom of `src/pages/Account.tsx` with a confirmation dialog.
  - Create edge function `delete-account` (verify_jwt = true) that:
    - Verifies the caller, cancels any active Stripe subscription, anonymises `profiles`/`sitters` rows (so reviews/bookings stay referentially intact), then calls `auth.admin.deleteUser`.
  - Sign the user out and route to `/` after success.
- **Privacy & support links** — make sure the Apple-required URLs (`/privacy`, `/contact`) are linked from Account.

---

### Wave S-C — Family+ subscription routing (web-only billing)

This is the headline change you asked for: don't sell Family+ inside the iOS app. Instead, send users to the website to subscribe, then their account auto-unlocks.

- **Native detection**
  - In `FamilyPlusUpgradeDialog.tsx` and `FamilyPlusCard.tsx`, branch on `Capacitor.isNativePlatform()`.
  - **Native (iOS/Android app):** replace the "Subscribe" CTA with a "Manage on web" button + short copy: "To start or change Family+, visit nannyrecommended.com/pricing on any browser. Your account here will update automatically."
    - Tapping it opens the URL in the system browser (`window.open` → Capacitor Browser plugin).
    - Critically: do **not** mention pricing, plans, or external purchase incentives in the native UI beyond "manage on web" — Apple's guideline 3.1.3(a) "Reader" exception requires no buy buttons, no price calls-to-action.
  - **Web:** unchanged Stripe Embedded Checkout flow.
- **Cross-device unlock**
  - Already handled: subscriptions are keyed to `user_id` via webhook, so a web purchase under the same login unlocks Family+ on the native app automatically through the existing `useSubscription` hook.
- **Customer portal**
  - Same treatment in `src/pages/Pricing.tsx` / Account page: native build hides "Manage subscription" in-app and links to the web portal.
- **Edge cases**
  - Add a small "Refresh status" button on Family+ gated screens so users coming back from the web can force-refresh `useSubscription` if realtime hasn't fired yet.

This keeps 100% of Family+ revenue (vs. losing 30% to Apple IAP) and is the same model Spotify/Netflix/Audible use.

---

### Wave S-D — Mobile polish + native niceties

Small but important once the app runs natively.

- **Safe areas:** add `env(safe-area-inset-*)` padding to `Header` and `MobileTabBar` so content doesn't sit under the iPhone notch/home indicator.
- **Status bar:** install `@capacitor/status-bar`, set style to match the app's light/dark theme.
- **Splash screen:** install `@capacitor/splash-screen`, add a basic branded splash (logo on background colour). Real artwork comes later from the user.
- **Keyboard:** install `@capacitor/keyboard` to auto-resize inputs (chat, booking forms).
- **External links:** route all `target="_blank"` (Privacy, Terms, Stripe portal, web pricing) through `@capacitor/browser` so they open in the in-app system browser instead of trying to navigate the WebView.
- **App icon placeholder:** drop a 1024×1024 placeholder into the `ios/` and `android/` folders' resource locations (final icon is the user's job).

---

### Wave S-E — Submission checklist + handoff doc

A read-me page in the repo (`STORE_SUBMISSION.md`) the user can follow on their Mac.

Covers:
1. Apple Developer account ($99/yr) signup link.
2. Bundle ID + provisioning profile in App Store Connect.
3. `npx cap sync ios && npx cap open ios` → archive in Xcode → upload to App Store Connect.
4. Required metadata: app description, keywords, age rating questionnaire (childcare → likely 4+), screenshots for 6.7", 6.5", 5.5" iPhone + 12.9" iPad.
5. App Privacy questionnaire — what data the app collects (email, name, location for sitter search, payment via web).
6. Review notes template explicitly stating: "Family+ subscription is sold only on our website (nannyrecommended.com). The app provides no in-app purchase. This follows the 'Reader' app model (3.1.3(a))."
7. Same outline for Google Play (Play Console $25 one-time, easier review).

---

### Technical notes

- No new tables required.
- New edge function: `delete-account` (verify_jwt = true).
- New files (approx): `capacitor.config.ts`, `src/lib/platform.ts`, `src/lib/native/openExternal.ts`, `STORE_SUBMISSION.md`.
- Edited files: `src/pages/Auth.tsx`, `src/pages/Account.tsx`, `src/pages/Pricing.tsx`, `src/components/payments/FamilyPlusCard.tsx`, `src/components/payments/FamilyPlusUpgradeDialog.tsx`, `src/components/payments/FamilyPlusGates.tsx`, `src/components/Header.tsx`, `src/components/MobileTabBar.tsx`, `index.html`, `src/index.css` (safe areas).
- Push notifications (APNs/FCM) deliberately deferred — needs Apple Developer account + certs to wire up. Web-side notifications keep working in the meantime.

---

### Order

S-A → S-B → S-C → S-D → S-E, sequentially. After S-E you'll have a buildable iOS project, all Apple compliance bases covered, and Family+ revenue routed through the web at full margin. The remaining manual steps (Mac, Xcode, Apple Developer account, screenshots, submission) are yours.

Approve to start with **Wave S-A**.