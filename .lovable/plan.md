ns
# iOS-Only App Store Readiness Plan

You have an Apple Developer account — let's get the app submission-ready for iOS only (we'll skip Android entirely for now). Most of the foundation (Capacitor, account deletion, web-only Family+ routing, safe-area padding) is already in place from the previous wave. This plan closes the remaining gaps.

## Wave I-A: Sign in with Apple (mandatory for App Store)

Apple **requires** Sign in with Apple in any app that offers third-party login (you have Google + Facebook coming soon), so this is a hard blocker.

- The `lovable.auth.signInWithOAuth("apple", ...)` call already exists in `src/pages/Auth.tsx` and routes to a working Apple button — confirmed working on web.
- For iOS native, the same call works through the in-app browser via the OAuth broker. No native plugin needed for the MVP path.
- Action: verify Apple provider is enabled in Lovable Cloud → Auth Settings (managed mode is fine for v1; BYOC can come later for custom branding).
- Add a short "Continue with Apple" priority on iOS (move Apple button to top of the OAuth list when `isNativeApp()` is true).

## Wave I-B: iOS-only Capacitor configuration

- Update `capacitor.config.ts`: keep iOS settings, drop the dev-server hot-reload `url`/`cleartext` block before production builds (leave a commented dev block so you can switch back). Production must bundle `dist/` directly — Apple rejects apps that load remote arbitrary HTML.
- Add iOS-specific plugin config: `ios.contentInset = "always"`, `ios.scheme = "nannyrecommended"`, `ios.limitsNavigationsToAppBoundDomains = true`.
- Add `App` plugin handling for back-gesture / deep links (`@capacitor/app`) so push-notification taps and universal links route through React Router.

## Wave I-C: Required iOS assets & metadata

- Create `public/apple-app-icon-1024.png` placeholder spec + `STORE_SUBMISSION.md` section listing every required size (Xcode generates the rest from the 1024 master in the asset catalog).
- Create `public/ios-launch-screen.png` spec (2732×2732 centered logo on cream background to match brand).
- Add iOS-specific meta to `index.html`: `apple-mobile-web-app-capable`, `apple-mobile-web-app-status-bar-style`, `apple-touch-icon` link tags (helps when running via in-app browser).
- App Store metadata template in `STORE_SUBMISSION.md`: app name, subtitle, keywords, description, what's new, support URL, privacy policy URL, marketing URL, age rating answers, category (Lifestyle / primary, Kids / secondary — but **not** Kids category since that imposes COPPA constraints; document this choice).

## Wave I-D: App Privacy & data declarations

Apple's "App Privacy" questionnaire is now strict. Create `STORE_SUBMISSION_PRIVACY.md` documenting exactly what to declare:
- Data linked to user: name, email, phone, address, payment info, photos, messages, location (approximate), user content, identifiers.
- Data used for tracking: none (we don't use IDFA).
- Purposes: app functionality, account management, customer support.
- Third parties: Stripe (payments), Lovable Cloud (backend), Twilio (SMS OTP).
- Add a `/privacy` review pointing reviewers to existing `Privacy.tsx` (already exists) — and add a one-line "data deletion" link there to the Account → Danger Zone we just built.

## Wave I-E: Reviewer-friendly subscription wording

Apple reviewers are tough on "external purchase" routing. Polish the native Family+ card and Pricing page copy to match the Reader-rule pattern exactly:
- Remove the word "Upgrade" on native — already done.
- Remove all prices on native — verify, then add a line: "Family Plus is a website feature. Visit nannyrecommended.com to learn more."
- Add a hidden "Reviewer test account" banner in `STORE_SUBMISSION.md` with credentials + a 5-step walkthrough so the reviewer can complete a full booking.

## Wave I-F: Submission handoff doc rewrite

Rewrite `STORE_SUBMISSION.md` to be **iOS-only and step-by-step**:
1. Apple Developer Console — create App ID, enable Sign in with Apple capability.
2. App Store Connect — create app record (bundle ID `app.lovable.e1e5d17a34de4ddfa367ad73ca194925` — note: you may want to change this to `com.nannyrecommended.app` before first submission since bundle IDs are immutable; will flag this for decision).
3. On a Mac: `git pull && npm install && npm run build && npx cap add ios && npx cap sync ios && npx cap open ios`.
4. In Xcode: set team, signing, version 1.0.0 / build 1, capabilities (Sign in with Apple, Push if used), upload icon to asset catalog.
5. Archive → Distribute → App Store Connect.
6. Fill in metadata, App Privacy, reviewer notes (paste from doc), submit.
7. Common rejection reasons + how we already handle them.

---

## Decision needed before I start

**Bundle identifier**: the current Capacitor config uses `app.lovable.e1e5d17a34de4ddfa367ad73ca194925`. This is fine for testing but looks unprofessional in App Store listings (and is permanent once you submit). I recommend `com.nannyrecommended.app`. I'll ask you in a quick question after you approve.

## What you'll do manually (I can't from here)
- Enable Sign in with Apple in Lovable Cloud Auth Settings (one click).
- Run the Xcode steps on a Mac.
- Upload screenshots (10 required at 6.7" + 6.5"; you can generate via simulator).
- Pay $99 (already done) and submit.

## What you do NOT need to do
- Android setup, Google Play console, anything about Android Studio.
- Native IAP / StoreKit — Family+ stays web-only as before.

Approve and I'll start with **Wave I-A** (Sign in with Apple priority on iOS) and **Wave I-B** (iOS-only Capacitor config), then ask the bundle-ID question before generating the rewritten submission doc.
