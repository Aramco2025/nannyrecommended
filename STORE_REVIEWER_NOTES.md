# App Review reviewer notes — paste into App Store Connect

App Store Connect → My App → App Review Information → Notes.

> Hi App Review Team,
>
> NannyRecommended is a marketplace connecting parents with verified
> babysitters and nannies in the UAE.
>
> **DEMO ACCOUNTS**
>
> Parent account:
>   Email: `apple.review.parent@nannyrecommended.com`
>   Password: `AppleReview2026!`
>
> Sitter account:
>   Email: `apple.review.sitter@nannyrecommended.com`
>   Password: `AppleReview2026!`
>
> Both accounts are pre-loaded with test data so you can experience the
> full flow without external setup. They are flagged internally as
> reviewer accounts so SMS, cash-pickup, and real-sitter notifications
> are mocked safely.
>
> **KEY FLOWS TO TEST**
>
> 1. Sign in with the parent account → tap **Find sitters** → tap any
>    sitter → **Book** → use Apple Pay (Stripe sandbox card
>    `4242 4242 4242 4242`, any future expiry, any CVC).
> 2. Sign in with the sitter account on a second device (or sign out and
>    back in) → see the booking under **Sitter dashboard** → **Accept**.
> 3. Back to the parent account → mark booking complete on the **Account**
>    screen → leave a review.
> 4. Sitter account: see funds in **Wallet** → request **Cash out** → see
>    the 6-digit pickup code (mocked for reviewer accounts).
>
> **PAYMENT NOTES**
>
> Family Plus subscriptions are processed via web checkout (Stripe) per
> Apple's "Reader app" guidelines (3.1.3(a)). The iOS app contains no
> in-app purchase, no Buy buttons, no subscription pricing, and no calls
> to action to upgrade. The Account screen shows "Manage on web" which
> opens Safari. Same model used by Spotify, Netflix, Kindle.
>
> Booking payments use Apple Pay or saved cards via Stripe — these are
> for a physical service (in-person childcare), not subject to IAP per
> guideline 3.1.3.
>
> **VERIFICATION & TRUST**
>
> Sitters are verified through Emirates ID upload, reference checks, and
> optional police clearance. For reviewer accounts, verification is
> pre-completed. Real users go through manual verification within
> 5 working days.
>
> **CHILD SAFETY (guideline 1.2)**
>
> - Sitters undergo background checks before being listed
> - "Report a concern" button on every sitter profile and message thread
> - "Block user" available in any conversation
> - Disputed bookings have funds frozen until reviewed
> - Trust team responds within 4 hours during operating hours
>
> **ACCOUNT DELETION (guideline 5.1.1(v))**
>
> Account → Danger zone → Delete account. Removes the auth user and
> anonymises personal data immediately.
>
> **SIGN IN WITH APPLE (guideline 4.8)**
>
> Implemented and shown as the first authentication option on iOS,
> alongside Google and email/password.
>
> Any questions during review:
> Email: founder@nannyrecommended.com
> Phone: [your phone here]
>
> Thanks,
> [your name]
> Founder, NannyRecommended
