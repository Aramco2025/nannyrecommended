## Goal

Close the gap between what's built and the full 78-screen / 12-section spec. Most of the core data layer (sitters, bookings, messages, wallet, jobs, favourites, friends) is already in place. The missing work is mainly **onboarding flows**, **lifecycle screens**, **the role switcher**, and **a proper account/trust hub**.

I'll build this in 6 sequential batches so you can review each before the next.

---

## Coverage map (built ✅ / new 🆕 / enhance ✏️)

**1. Pre-Auth & Onboarding** — Index ✅, Auth ✅ · 🆕 Welcome carousel, Region picker (UAE emirate), Role picker, Phone verification, Permissions primer

**2. Parent Onboarding** — 🆕 What kind of help, Family setup (children ages), Address, Connect-friends prompt, Payment method intro (5 short steps + final "you're set")

**3. Parent Home & Tab Bar** — Tab bar ✅ (5 tabs) · 🆕 Parent Home (dashboard), My Family page, Bookings list page (currently embedded in Account)

**4. Browse Sitters** — Sitters ✅, Filter modal ✅, Favourites ✅ · 🆕 Map view toggle, Compare drawer (up to 3), Empty state component

**5. Sitter Profile (parent view)** — Profile ✅ · 🆕 Verification badge detail sheet, Full reviews page

**6. Booking Flows** — Browse path ✅ (5 screens already work), Job-post path ✅ (PostJob → JobApplicants) · ✏️ add "choose applicant → confirm booking" handoff

**7. Sitter Onboarding** — SitterSignup ✅, SetRate ✅, PaymentSetup ✅, Availability ✅ · 🆕 Eligibility gate (the filter), Experience step, Qualifications step, ID/verification upload, References step, Bio + video step, Review & submit, Pending approval screen

**8. Sitter Home & Tab Bar** — Dashboard ✅, EarningsCalculator ✅ · 🆕 Profile completeness wizard, Education hub (tips/articles), Role switcher component (for users with both roles)

**9. Sitter Jobs Flow** — SitterJobs feed ✅ · 🆕 Job filters, Job detail page, My applications page, Direct requests inbox

**10. Bookings Lifecycle** — Booking create ✅ · 🆕 Booking detail page, Pre-sit reminder, Sit-start check-in, Live sit (timer + emergency), Sit ended (sitter view: log hours), Sit ended (parent view: confirm + pay), Review flow, Dispute flow

**11. Wallet & Payments** — Wallet ✅, CashOut ✅, Transactions ✅ — no work needed

**12. Account / Settings / Trust** — Account ✅ · 🆕 Notifications settings, Subscriptions, Verified+ upsell, Verification status, Safety hub, Help center, Support contact, Blocked users, Privacy controls, Sign-out + role switch

**Cross-cutting** — Add `role` switcher in header for dual-role users; add `region` + `onboarding_completed` to profiles so we can route new users through the right onboarding.

---

## Batch order

**Batch A — Onboarding spine (Sections 1, 2, 7 gate)**
Welcome, region, role picker, phone verify, permissions, parent onboarding wizard, sitter eligibility gate. Without this, new users land in a half-empty app. Adds `region`, `onboarding_completed`, `phone_verified` to `profiles`.

**Batch B — Sitter onboarding (rest of Section 7) + Section 8 extras**
Multi-step wizard: experience → qualifications → ID upload → references → bio + video → review → pending. Profile completeness widget on sitter home. Role switcher.

**Batch C — Bookings lifecycle (Section 10)**
The biggest UX hole. Booking detail page with state machine: upcoming → reminder → check-in → live (with timer) → ended → reviewed. Sitter "log hours" flow. Parent "confirm & release escrow" flow. Reviews. Disputes (creates a support ticket row).

**Batch D — Sitter Jobs (Section 9) + Browse enhancements (Section 4)**
Job detail page, my-applications, direct requests inbox. Sitter map view + compare drawer for parents.

**Batch E — Account & Trust hub (Section 12)**
Notifications prefs page, Verified+ upsell, verification status tracker, safety hub, help, blocked users, privacy.

**Batch F — Polish (Section 3, 5)**
Parent home dashboard (next booking + shortcuts), My Family page, dedicated Bookings page, verification-badge detail sheet, full reviews page.

---

## Technical notes

**New tables / columns**
- `profiles`: add `region text`, `onboarding_completed boolean default false`, `phone_verified boolean default false`, `active_role app_role`
- `children` (id, parent_id, name, dob, notes) — for My Family
- `sitter_applications` (sitter_user_id, status: draft/submitted/approved/rejected, eligibility json, experience json, qualifications json, references json, id_doc_url, video_url, submitted_at) — drives the multi-step onboarding & "pending approval" screen
- `booking_events` (booking_id, type: check_in/check_out/incident, lat, lng, at, by_user) — powers live-sit timeline
- `disputes` (booking_id, opened_by, reason, status, resolution)
- `blocked_users` (blocker_id, blocked_id)
- `notification_prefs` (user_id, channel, type, enabled) — generic, replaces sitter-only table for parents

**Routing additions** (all new routes mounted in `App.tsx`):
`/onboarding/welcome`, `/onboarding/region`, `/onboarding/role`, `/onboarding/phone`, `/onboarding/permissions`, `/onboarding/parent/*` (5 sub-steps), `/sitter/apply/*` (eligibility, experience, qualifications, id, references, bio, review, pending), `/parent/home`, `/parent/bookings`, `/parent/family`, `/bookings/:id` (lifecycle hub), `/bookings/:id/review`, `/bookings/:id/dispute`, `/sitter/jobs/:id`, `/sitter/applications`, `/sitter/requests`, `/sitter/education`, `/account/notifications`, `/account/verified-plus`, `/account/verification`, `/account/safety`, `/account/help`, `/account/blocked`, `/account/privacy`.

**Routing guard**: A small `<RequireOnboarding>` wrapper redirects signed-in users to the next onboarding step until `onboarding_completed = true`.

**Role switcher**: Lives in Header for users with both roles. Writes `active_role` to profile and re-renders nav links + tab bar accordingly.

**Lovable AI** powers the "What kind of help?" recommender (Section 2) and the booking-detail copy summarizer — no extra API key needed.

**Storage**: One new bucket `verification-docs` (private) for ID + reference uploads.

---

## What I'll ask before each batch

For each batch I'll quickly confirm any design preferences (e.g. eligibility-gate questions for Batch A, dispute reason categories for Batch C). Otherwise I'll use sensible defaults and you can iterate.

Approve to start with **Batch A — Onboarding spine**.