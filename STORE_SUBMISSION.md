# iOS App Store Submission Guide — NannyRecommended

This project is wrapped with **Capacitor** for iOS. The web app at
[nannyrecommended.com](https://nannyrecommended.com) is the source of truth;
the iOS app is a native shell around the same React build.

> **Scope: iOS only.** Android (Google Play) is deferred.

---

## 0. App identity (locked in)

| Field | Value |
|---|---|
| Bundle ID | `com.nannyrecommended` |
| App name | NannyRecommended |
| Display name | NannyRecommended |
| Primary category | Lifestyle |
| Secondary category | Shopping (Family services) — **not** "Kids" (avoids COPPA constraints) |
| Marketing URL | https://nannyrecommended.com |
| Support URL | https://nannyrecommended.com/contact |
| Privacy Policy URL | https://nannyrecommended.com/privacy |
| Age rating | 4+ |

---

## 1. One-time prerequisites

- ✅ Apple Developer Program ($99/yr) — you have this.
- A Mac with Xcode 15+.
- An iPhone for real-device testing (recommended; simulator works for screenshots).

---

## 2. Apple Developer Console setup

1. Go to **Certificates, Identifiers & Profiles → Identifiers → +**.
2. Create an **App ID** with bundle ID `com.nannyrecommended` (Explicit, not wildcard).
3. Enable capabilities:
   - **Sign in with Apple** (required — Apple mandates this if you offer any other social login)
   - **Push Notifications** (optional, only if you ship push later)
   - **Associated Domains** (optional, for universal links to nannyrecommended.com)
4. Save.

## 3. Lovable Cloud — enable Apple sign-in

Sign in with Apple is enabled in managed mode (no extra setup needed for v1).
You can later switch to "bring your own credentials" for custom branding on
the Apple sheet.

## 4. App Store Connect — create the app record

1. https://appstoreconnect.apple.com → My Apps → **+ New App**.
2. Platform: iOS · Name: **NannyRecommended** · Primary Language: English (UAE) ·
   Bundle ID: `com.nannyrecommended` · SKU: `nannyrecommended-ios-001`.
3. Leave the rest blank for now — we'll fill metadata after the build uploads.

---

## 5. Build & ship from your Mac

```bash
# Pull the latest code from GitHub
git pull
npm install

# IMPORTANT: comment out the `server` block in capacitor.config.ts before release builds
# (see comment in that file)

npm run build
npx cap add ios          # first time only
npx cap sync ios
npx cap open ios         # opens Xcode
```

In Xcode:
1. Select the **App** target → **Signing & Capabilities** → set your Team.
2. Add capability: **Sign in with Apple**.
3. Set version `1.0.0`, build `1`.
4. Drop a **1024×1024 PNG** into `App/App/Assets.xcassets/AppIcon.appiconset` — Xcode
   auto-generates the rest. (See section 7 for icon spec.)
5. **Product → Archive** → wait → **Distribute App → App Store Connect → Upload**.

Whenever you pull new code:
```bash
npm install && npm run build && npx cap sync ios
```

---

## 6. Required iOS assets

| Asset | Size | Where |
|---|---|---|
| App icon master | 1024×1024 PNG, no transparency, no rounded corners | Xcode asset catalog |
| Launch screen | Configured via `LaunchScreen.storyboard` (Capacitor default works) | Xcode |
| Screenshots — 6.7" (iPhone 15 Pro Max) | 1290×2796 | App Store Connect, **10 required** |
| Screenshots — 6.5" (iPhone 11 Pro Max) | 1242×2688 or 1284×2778 | App Store Connect, 10 required |
| Screenshots — 5.5" (optional but recommended) | 1242×2208 | App Store Connect |
| iPad Pro 12.9" (only if you also support iPad) | 2048×2732 | Skip for v1 — iPhone-only build |

**Quickest screenshot workflow:**
```bash
npx cap run ios --target="iPhone 15 Pro Max"
# Then: Simulator → File → Save Screen (⌘S) for each key page
```

Recommended pages to capture: Home, Find sitter, Sitter profile, Booking flow,
Messages, Account, Family Plus (web routing).

---

## 7. App Store Connect metadata

Paste these into the App Information / Pricing / App Privacy / Version pages.

### App Information
- **Subtitle (30 chars):** Trusted babysitters in UAE
- **Promotional text (170 chars):** Verified nannies recommended by people you trust. Transparent fees, instant booking, in-app messaging — built for families across the UAE.
- **Keywords (100 chars):** babysitter,nanny,childcare,sitter,kids,family,dubai,abu dhabi,uae,daycare,after school

### Description
> Find a babysitter or nanny you can trust — recommended by friends, verified by us.
>
> NannyRecommended is the easiest way for UAE families to book vetted babysitters and nannies. Every sitter is ID-checked and reviewed by real parents. Browse profiles, see transparent rates, message instantly, and book in a few taps.
>
> • Verified sitters with reviews from real parents
> • Transparent hourly rates — no hidden fees
> • Secure in-app messaging
> • Instant booking with calendar sync
> • Loyalty rewards and friend referrals
>
> We support last-minute babysitters, after-school nannies, full-time placements, and night nannies across Dubai, Abu Dhabi, Sharjah, and the wider UAE.
>
> Family Plus members unlock unlimited messaging, priority booking, and a personal concierge. Manage your subscription on nannyrecommended.com.

### What's New (v1.0.0)
> First release of NannyRecommended for iPhone — book trusted babysitters and nannies across the UAE.

### Pricing
- **Free**, with optional Family Plus subscription managed on the website.

---

## 8. App Privacy questionnaire

See **`STORE_SUBMISSION_PRIVACY.md`** for the full data-collection declaration
to paste into the App Privacy section. Summary:
- We collect: contact info, payment info, location (approximate), user content,
  identifiers, usage data — **all linked to identity**, **none used for tracking**.
- Third parties: Stripe, Lovable Cloud, Twilio.
- IDFA / advertising tracking: **None**.

---

## 9. Reviewer notes (paste verbatim)

> **Reviewer test account**
> Email: `reviewer@nannyrecommended.com`
> Password: `<set this before submission and paste here>`
>
> **Walkthrough (5 minutes):**
> 1. Tap "Sign in" → use the test account above (or "Continue with Apple").
> 2. Browse sitters on the Find page — filter by area.
> 3. Open any sitter profile, tap "Book" — choose a date/time.
> 4. Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC.
> 5. The booking confirmation screen shows the in-app messaging thread.
>
> **About Family Plus subscriptions:**
> Family Plus is a website-only feature, sold and managed at
> https://nannyrecommended.com. The iOS app contains no in-app purchase, no
> "Buy" button, displays no subscription pricing, and includes no calls to
> action to upgrade. The Account screen shows "Manage on web" which opens
> Safari. This follows the App Store Review Guidelines 3.1.3(a) "Reader" rule
> (the same model used by Spotify, Netflix, Kindle).
>
> **Account deletion:**
> Account → Danger Zone → Delete account. This anonymises personal data and
> deletes the auth user immediately, satisfying guideline 5.1.1(v).
>
> **Sign in with Apple:**
> Implemented and shown as the first authentication option on iOS, alongside
> Google and email/password.

---

## 10. Before each release — pre-flight checklist

- [ ] `capacitor.config.ts` — `server` block commented out
- [ ] `npm run build` succeeds without warnings
- [ ] `npx cap sync ios` ran after the build
- [ ] Bundle version in Xcode bumped (build number must increase every upload)
- [ ] Tested Sign in with Apple on a real device
- [ ] Tested booking flow with Stripe test card
- [ ] Verified Family Plus screen shows **no prices** and **no buy button** in iOS build
- [ ] Verified Account → Delete account works

---

## 11. Common rejection reasons (and how we handle them)

| Reason | Our defence |
|---|---|
| 3.1.1 — IAP required for digital goods | Family Plus is web-only; no buy buttons or prices in app. |
| 4.0 — Sign in with Apple missing | Implemented as first OAuth option on iOS. |
| 5.1.1(v) — No account deletion | Account → Delete account, in-app, fully wipes PII. |
| 5.1.2 — Privacy policy URL broken | https://nannyrecommended.com/privacy serves the live page. |
| 2.5.6 — Web view loading remote content | Production build bundles `dist/` locally; `server.url` is dev-only. |

---

## 12. Things deferred to later versions

- **Push notifications** — APNs cert + Firebase setup. In-app notifications already work.
- **Universal links** (open `nannyrecommended.com/sitter/xxx` directly in app) — requires `apple-app-site-association` file on the web domain.
- **Custom-branded Apple sheet** — switch to BYOC mode in Lovable Cloud auth settings.
- **iPad-optimised layout** — currently iPhone-only.
