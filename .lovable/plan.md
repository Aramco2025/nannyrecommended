## Goal

Turn the screens you uploaded into real working features for **sitters**, and let parents **book instantly** when a sitter is available. Today the sitter side has a dashboard + wallet + static `/nanny-jobs` mock list, but no live job board, no calendar/availability UI, no instant booking, and no in-app chat. We'll build all of that.

## What gets built

### 1. Live job board for sitters (`/sitter/jobs`)
Replaces the static mock at `/nanny-jobs` for signed-in sitters.
- Tabs: **One-off · Repeat · Permanent** (matches your screen 1)
- Filter chips: Childcare · Night nanny · After-school
- Each job card: parent first name + initial, date/time, area, distance, hourly rate, **Apply** button
- Pulls from a new `job_posts` table; "Apply" creates a `job_applications` row (parent gets notified)
- Empty state with link to update notification radius

### 2. Parents post jobs (`/parent/post-job`)
Simple form on the parent side so the board has real content:
- Type (one-off / repeat / permanent), date(s), time window, area, hourly rate offered, notes
- Inserts into `job_posts`, visible to sitters whose preferences match

### 3. Availability calendar (`/sitter/availability`) — your screen 4
- Week-by-week view with day pills (M T W T F S S)
- 30-min time slots per day, tap to toggle **Available / Unavailable**
- Booked slots auto-shown as blocked with the parent's name
- Saves to existing `availability` table (extending to support specific-date overrides)

### 4. Instant booking for parents
Today `/book/:sitterId` creates a `pending` booking that the sitter must accept. We'll add an **"Available now — book instantly"** path:
- On a sitter profile, parent picks a date/time → if it falls inside the sitter's saved availability and no clash, status goes straight to **`confirmed`** (skips pending), escrow held
- Sitter still gets a notification but doesn't need to accept

### 5. In-app messaging (`/messages` and `/messages/:bookingId`) — your screen 6
- Inbox listing all bookings the user is part of (parent or sitter view)
- Thread view using the existing `messages` table + Supabase Realtime for live updates
- "Parent profile" / "Sitter profile" quick-link chips at the top of the thread

### 6. Notification preferences (`/sitter/notifications`) — your screen 5
- Per job-type radius sliders (One-off, Repeat, Night nanny, Permanent) with mute toggles
- Saved on a new `sitter_notification_prefs` table; used to filter the job board

### 7. Sitter profile polish — your screen 2
- Add **Bookings completed** + **Repeat families** counters at the top of public sitter profile
- "Open to meeting" + "Healthcare professional" trust chips driven by existing sitter flags

### 8. Header/nav
- When signed in as a sitter: show **Jobs · Availability · Inbox · Wallet · Account** instead of the marketing nav
- Mobile: hamburger menu (still missing from previous QA) added in the same pass

## Database changes

New tables:
- `job_posts` — parent_id, type (`one_off|repeat|permanent`), start_at, end_at, area, lat/lng, hourly_rate_aed, notes, status (`open|filled|cancelled`)
- `job_applications` — job_post_id, sitter_id, message, status (`pending|accepted|declined|withdrawn`)
- `sitter_notification_prefs` — sitter_id, type, radius_km, muted

Extensions:
- `availability` — add `specific_date date NULL` so sitters can override a single date in addition to weekly recurring slots
- `bookings` — no schema change; just allow direct `confirmed` status via a new RPC `create_instant_booking` that validates the slot is free and inside availability

All new tables get RLS:
- `job_posts`: public read for active sitters, parent owns insert/update/delete
- `job_applications`: parent (post owner) and applying sitter can read; sitter inserts own
- `sitter_notification_prefs`: sitter owns

Realtime enabled on `messages` and `job_applications`.

## Out of scope for this pass
- Push notifications (web/mobile) — we save preferences but won't send pushes yet
- Distance/geo filtering uses sitter's saved area as a string match; lat/lng comes later
- Insurance + booking timer screen (your screens 7 & 8) — call out as next step

## Files (high level)

New: `src/pages/SitterJobs.tsx`, `src/pages/PostJob.tsx`, `src/pages/SitterAvailability.tsx`, `src/pages/Messages.tsx`, `src/pages/MessageThread.tsx`, `src/pages/SitterNotifications.tsx`, `src/components/sitter/JobCard.tsx`, `src/components/sitter/AvailabilityGrid.tsx`, `src/components/messages/ChatBubble.tsx`, `src/hooks/useJobPosts.ts`, `src/hooks/useMessages.ts`.

Edited: `src/App.tsx` (routes), `src/components/Header.tsx` (sitter nav + mobile menu), `src/pages/SitterProfile.tsx` (instant-book CTA + counters), `src/pages/Booking.tsx` (instant path).

After you approve I'll run the DB migration first, then ship the UI.