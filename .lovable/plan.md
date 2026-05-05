## Final 3 Waves

Closes the remaining gap against the 78-screen spec. No new tables required — all data lives in `sitters`, `bookings`, `children`, `reviews`, `profiles`, `user_roles`.

---

### Wave L — Browse enhancements + Direct Requests

**New screen**
- `/sitter/requests` — inbox of pending bookings where a parent picked the sitter directly (no application). Accept / decline buttons update `bookings.status` (`confirmed` or `cancelled`).

**Enhancements on `/sitters`**
- List ↔ Map toggle. "Map" view is a lightweight CSS grid grouping sitter pins by `area` (no Mapbox key). Pins open a mini preview card → profile.
- Compare drawer: each sitter card gets a "Compare" checkbox (max 3). Sticky bottom drawer shows side-by-side rate / rating / verifications / years exp / response, with "Book" CTAs.

**Files**
- create `src/pages/sitter/Requests.tsx`, `src/components/sitters/SittersMapView.tsx`, `src/components/sitters/CompareDrawer.tsx`, `src/hooks/useDirectRequests.ts`
- edit `src/pages/Sitters.tsx`, `src/pages/SitterDashboard.tsx` (add request count badge), `src/App.tsx` (route)

---

### Wave M — Parent Home, Family hub, Bookings list, Role switcher

**New screens**
- `/parent/home` — dashboard: next booking hero (reuse `NextBookingCard`), quick actions (Find sitter, Post job, Messages), recent favourites, active job posts.
- `/parent/family` — children CRUD against `children` table (name, dob, notes), with avatar initials.
- `/parent/bookings` — dedicated paginated list with filters (Upcoming / Past / Cancelled), pulled out of Account page.

**Cross-cutting**
- `RoleSwitcher` component in `Header` for users with both `parent` and `sitter` rows in `user_roles`. Writes `profiles.active_role`, swaps the nav links + tab bar destinations. Hidden for single-role users.

**Files**
- create `src/pages/parent/Home.tsx`, `src/pages/parent/Family.tsx`, `src/pages/parent/Bookings.tsx`, `src/components/parent/ChildEditor.tsx`, `src/components/RoleSwitcher.tsx`, `src/hooks/useChildren.ts`, `src/hooks/useUserRoles.ts`
- edit `src/components/Header.tsx`, `src/pages/Account.tsx` (link to new bookings page), `src/App.tsx` (3 routes)

---

### Wave N — Polish

- **Full reviews page** `/sitters/:id/reviews` — paginated review list with filter by stars.
- **Verification badge sheet** — opening any "Verified" badge on a profile shows a slide-up sheet listing what's been checked (ID, police, references, first aid) and dates.
- **Sitter education hub** `/sitter/education` — static articles grid (tips, safety, growing earnings) seeded from a local TS array, opens `/sitter/education/:slug` reader.
- **Empty states** — uniform `EmptyState` component used across Favourites, Messages, Notifications, Applications.
- **QA pass** — sweep new pages for missing `Footer`, broken links, mobile padding, dark-text contrast.

**Files**
- create `src/pages/sitter/ReviewsAll.tsx`, `src/components/trust/VerificationSheet.tsx`, `src/pages/sitter/Education.tsx`, `src/pages/sitter/EducationArticle.tsx`, `src/lib/education/articles.ts`, `src/components/EmptyState.tsx`
- edit `src/components/trust/VerificationPanel.tsx`, `src/pages/SitterProfile.tsx`, `src/pages/Favourites.tsx`, `src/pages/Messages.tsx`, `src/pages/Notifications.tsx`, `src/pages/sitter/Applications.tsx`, `src/App.tsx` (3 routes)

---

### Order of execution

I'll ship them sequentially — Wave L, then M, then N — pausing only if a destructive choice appears (none expected). After Wave N the original 78-screen spec is fully covered.

Approve to start with **Wave L**.