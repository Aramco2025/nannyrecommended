
# Plan: Make NannyRecommended fully functional and testable

Goal: turn the current mock-data shell into a real app with login, real sitter profiles, working bookings, and live (test-mode) payments — so you can use it like Bubble. Then wrap it for iOS via Capacitor.

## What's there today
- Pages: Home, Find a sitter, Sitter profile, Booking flow (UI), Pricing, How it works, Sitter signup
- Components: SitterCard, FeeBreakdown, LoyaltyProgress, Header/Footer, etc.
- All data is hardcoded in `src/data/sitters.ts`
- No login, no database, no payments, no real bookings

## Phase 1 — Backend foundations (Lovable Cloud)
Enable Lovable Cloud (one click). Gives us database, auth, file storage, serverless functions — no external accounts.

Database tables:
- `profiles` — user info (name, phone, avatar, role: parent/sitter)
- `user_roles` — separate roles table (parent, sitter, admin) for security
- `sitters` — sitter listings (linked to a user, hourly rate AED, bio, area, network badges, verified flag, photos)
- `availability` — sitter time slots
- `bookings` — parent_id, sitter_id, start/end, status, total fee, platform fee, sitter payout
- `reviews` — booking_id, rating, comment
- `loyalty` — bookings count per parent, current tier
- `messages` — parent ↔ sitter chat per booking

All tables get Row Level Security so parents only see their own bookings, sitters only see requests sent to them, etc.

## Phase 2 — Authentication
- Email + password sign-up / sign-in (instant, no email confirmation in test mode)
- Role chosen at signup: "I'm a parent" or "I'm a sitter"
- Profile auto-created via DB trigger
- Protected routes: `/account`, `/bookings`, `/sitter/dashboard`
- Header shows Sign in / Account avatar based on state

## Phase 3 — Real sitter listings
- Replace mock data on `/sitters` and `/sitter/:id` with live DB queries
- Sitter signup flow (`/sitter/signup`) actually writes to the DB
- Sitter dashboard: edit profile, set hourly rate, set availability, upload photos
- Filters on `/sitters`: area (Dubai neighbourhoods), price (AED/hr), date, network badges

## Phase 4 — Booking flow (real)
- Parent picks date/time + duration on a sitter's profile
- Confirms → creates a `booking` row with status `pending`
- Sitter gets it in their dashboard, accepts or declines
- Status transitions: pending → confirmed → completed → reviewed
- Transparent fee breakdown shown at every step (already built UI-side)
- Email/in-app notifications on status changes

## Phase 5 — Payments (Stripe, test mode)
Use Lovable's built-in Stripe payments — no account setup needed to test. AED supported.

- On booking confirmation, parent pays via Stripe Checkout
- Funds held until job is marked complete
- Platform fee retained (per your fairer model — sitters keep more than Bubble's cut)
- Refunds for cancellations per policy
- Test cards (e.g. `4242 4242 4242 4242`) so you can run end-to-end bookings without real money
- When ready for live: account verification flow inside Lovable

## Phase 6 — Reviews, loyalty, messaging
- After completed booking → parent prompted to leave review
- Loyalty tier auto-updates based on completed bookings count
- Simple in-app messaging thread per booking (parent ↔ sitter)

## Phase 7 — QA pass
- Test full happy path: sign up as parent → book sitter → pay (test card) → sitter accepts → complete → review
- Test as sitter: sign up → create profile → receive booking → accept → get paid out
- Fix any rough edges, confirm AED/UAE-only language throughout

## Phase 8 — Wrap for iOS (Capacitor)
Once the web app works end-to-end:
- Install Capacitor + iOS platform
- Configure with hot-reload pointing at the sandbox preview (so Lovable edits show up live in the iOS Simulator)
- You run on your Mac: `npx cap add ios` → `npm run build` → `npx cap sync` → `npx cap run ios`
- Test in iOS Simulator and on your iPhone (no Apple Developer account needed yet)
- When Apple Developer account is approved → archive in Xcode → upload to App Store Connect → submit for review

## Suggested execution order
I'd recommend tackling this in 3 build batches so you can test as we go:

1. **Batch A** (Phases 1–3): Backend + auth + real sitter listings. After this you can sign up, create sitter profiles, browse real listings.
2. **Batch B** (Phases 4–6): Booking flow + Stripe test payments + reviews/loyalty/messaging. After this the app is fully functional.
3. **Batch C** (Phases 7–8): QA pass + iOS wrapping.

## What I need from you to start
1. **Approve this plan** so I can switch out of plan mode and start building.
2. **Confirm Batch A start**: I'll enable Lovable Cloud, build the schema, wire up auth + real listings.
3. **For payments later**: confirm AED is your billing currency, and confirm the platform fee % you want to charge parents and the % cut from sitters (your "fairer than Bubble" numbers).

Once approved, I'll begin with Batch A.
