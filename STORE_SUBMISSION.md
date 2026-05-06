# App Store & Google Play Submission Guide

This project is wrapped with **Capacitor** so the same React app ships to iOS and Android. The web build remains the source of truth — native is just a shell.

---

## 1. One-time prerequisites

| What | Where | Cost |
|---|---|---|
| Apple Developer Program | https://developer.apple.com/programs/enroll/ | $99 / year |
| Google Play Console | https://play.google.com/console/signup | $25 once |
| A Mac with Xcode 15+ | Mac App Store | — |
| Android Studio | https://developer.android.com/studio | — |

---

## 2. Local setup (do once on your Mac)

```bash
# After cloning / pulling the repo
npm install
npm run build

# Add the native projects
npx cap add ios
npx cap add android

# Sync the built web assets into the native shells
npx cap sync
```

Whenever you pull new code:
```bash
npm install
npm run build
npx cap sync
```

---

## 3. Run on a device / simulator

```bash
# iOS (needs macOS + Xcode)
npx cap run ios

# Android (needs Android Studio)
npx cap run android
```

To open the native project directly:
```bash
npx cap open ios       # opens Xcode
npx cap open android   # opens Android Studio
```

---

## 4. Before submitting — flip the dev server off

`capacitor.config.ts` currently points at the Lovable preview for hot-reload. **Remove or comment out the `server` block** before building a release binary, otherwise the store version will try to load from the sandbox URL.

```ts
// capacitor.config.ts — production
const config: CapacitorConfig = {
  appId: 'app.lovable.e1e5d17a34de4ddfa367ad73ca194925',
  appName: 'nannyrecommended',
  webDir: 'dist',
  // server: { ... }   <-- delete this for release
};
```

Then `npm run build && npx cap sync` so the bundled `dist/` is what ships.

---

## 5. iOS submission

1. **App Store Connect** → My Apps → New App. Bundle ID: `app.lovable.e1e5d17a34de4ddfa367ad73ca194925`.
2. Open Xcode (`npx cap open ios`), set Team + Signing, bump version, archive (Product → Archive), Distribute → App Store Connect.
3. Fill in:
   - **App Privacy** — declare data collected: email, name, location (sitter search), payment via web only.
   - **Age rating** — likely 4+ (childcare service, no objectionable content).
   - **Screenshots** — required sizes: 6.7" (iPhone 15 Pro Max), 6.5" (iPhone 11 Pro Max), 5.5" (iPhone 8 Plus), 12.9" iPad Pro.
   - **Sign in with Apple** — already wired (uses Lovable Cloud managed Apple OAuth).
4. **Review notes — paste this verbatim:**

   > Family Plus subscriptions are sold only on our website (https://nannyrecommended.com). The app contains no in-app purchase, no purchase buttons, and does not display subscription pricing. This follows the App Store Review Guidelines 3.1.3(a) "Reader" model used by Spotify, Netflix, and similar services. Test account: [provide email + password for review].

5. Submit for review.

---

## 6. Android (Google Play) submission

1. Open Android Studio (`npx cap open android`).
2. Build → Generate Signed Bundle / APK → Android App Bundle (.aab). Create a keystore the first time and **back it up** — you cannot recover it.
3. Play Console → Create app → upload the `.aab` to a release track.
4. Complete the Data Safety form (same answers as Apple App Privacy).
5. Submit. Google reviews are usually faster (hours to days vs Apple's 1–3 days).

---

## 7. Family+ subscription model

The app deliberately routes all paid Family+ flows to the web:

- Native UI shows **"Manage on web"** with no prices or buy buttons.
- Users open `nannyrecommended.com`, sign in with the same account, and pay via Stripe.
- The webhook updates `subscriptions` for that `user_id`. The native app picks it up via realtime + the "Refresh status" button.

This keeps **100% of subscription revenue** instead of losing 30% to Apple IAP, and is the same pattern Spotify and Netflix use.

---

## 8. Things deferred (do later if needed)

- **Push notifications (APNs/FCM)** — needs Apple Developer certificates and Firebase setup. The in-app notification system already works; only push to the lock screen is missing.
- **Custom app icon & splash screen** — placeholders ship by default. Replace via `@capacitor/assets` (`npx @capacitor/assets generate`) once you have a 1024×1024 icon and splash artwork.
- **Deep links** — universal links / app links if you want sitter profile URLs to open the native app.

---

## 9. Common gotchas

- **White screen on launch** → forgot `npm run build` before `npx cap sync`.
- **OAuth (Apple/Google) doesn't return** → make sure `https://nannyrecommended.com` is in the OAuth redirect allowlist; native uses the same broker.
- **Family+ buttons rejected by Apple** → check no native screen ever mentions a price or "buy" — only "Manage on web".
