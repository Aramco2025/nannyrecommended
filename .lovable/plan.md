## Plan: Seed reviewer accounts + generate App Store screenshots

Two parallel tracks so you can keep moving on the Mac side while I prep the rest.

### Track 1 — Seed the three Apple reviewer accounts

1. Invoke the existing `seed-reviewer-accounts` edge function from the sandbox (using the service role key already stored as a secret — no curl needed on your side).
2. Verify all three accounts exist in `auth.users` and `profiles` with `is_apple_reviewer = true`:
   - `apple.review.parent@nannyrecommended.com`
   - `apple.review.sitter@nannyrecommended.com`
   - `apple.review.both@nannyrecommended.com`
3. Confirm the parent has: 2 children rows, AED 1,000 wallet balance, 1 completed past booking, an active Family Plus subscription row.
4. Confirm the sitter has: a verified `sitters` row, hourly rate set, an availability window, AED 1,000 wallet.
5. Sign in once as each account in the preview to sanity-check the login works (catches password-hash issues now, not on submission day).

### Track 2 — Generate 10 App Store screenshots at 1290×2796

Use Puppeteer against the published web build (`https://nannyrecommended.com`) at iPhone 15 Pro Max viewport with `deviceScaleFactor: 3`. Sign in as `apple.review.parent@nannyrecommended.com` so screenshots show realistic data, not empty states.

Pages captured (in App Store display order):

1. **Home** — `/` parent home with next booking card
2. **Find a sitter** — `/sitters` list with filters visible
3. **Sitter profile** — `/sitter/{id}` showing verification + reviews
4. **Booking flow** — `/booking/{sitter-id}` with date/time picked
5. **Payment summary** — booking confirm step with fee breakdown
6. **Messages** — `/messages` thread list
7. **Message thread** — `/messages/{id}` with safety banner
8. **Account** — `/account` showing wallet + Family Plus state
9. **Family Plus** — `/pricing` (iOS-style, no buy button)
10. **Trust & Safety** — `/trust-safety` for App Review's "what makes this safe" answer

Each screenshot:
- Saved as `/mnt/documents/screenshots/01-home.png` … `10-trust.png`
- A second pass at 1242×2688 (6.5") for the older required size, saved to `/mnt/documents/screenshots/6.5/`

Then bundle into `/mnt/documents/nannyrecommended-screenshots.zip` for one-click drag into App Store Connect.

### What I need from you before starting

Nothing — both tracks use credentials already in the project (service role key + the seeded reviewer login). Approve and I'll run them back-to-back, then post the artifact links here.

### Out of scope (deferred unless you ask)

- Sentry wiring (needs a free DSN from sentry.io — say the word)
- Native Apple Pay sheet (Stripe Checkout already covers this in WKWebView)
- iPad screenshots (you're listing iPhone-only)
- Marketing copy variants on screenshots (plain UI capture only — annotated marketing screenshots are a separate ~1hr job)