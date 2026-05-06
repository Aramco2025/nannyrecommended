# App Privacy Declaration — App Store Connect

Paste these answers into App Store Connect → App Privacy. Apple's wording
is reproduced here verbatim so you can match radio buttons quickly.

## 1. Do you or your third-party partners collect data from this app?
**Yes.**

---

## 2. Data Types — declare each one below

For every data type: **Linked to user = Yes**, **Used for tracking = No**.
We never use IDFA or share data with ad networks.

| Data type | Collected? | Linked to user | Used for tracking | Purposes |
|---|---|---|---|---|
| **Email address** | Yes | Yes | No | App Functionality, Account Management |
| **Name** | Yes | Yes | No | App Functionality, Account Management |
| **Phone number** | Yes | Yes | No | App Functionality (SMS OTP, sitter contact) |
| **Physical address** | Yes | Yes | No | App Functionality (booking location) |
| **Payment info** | Yes | Yes | No | App Functionality (booking payments via Stripe) |
| **Photos** (profile) | Yes | Yes | No | App Functionality |
| **Coarse location** | Yes | Yes | No | App Functionality (find nearby sitters) |
| **User content — Messages** | Yes | Yes | No | App Functionality (in-app messaging) |
| **User content — Other** (children's names, ages, dietary notes) | Yes | Yes | No | App Functionality |
| **User ID** | Yes | Yes | No | App Functionality |
| **Device ID** | No | — | — | — |
| **Product interaction** | Yes | Yes | No | Analytics, Product Personalization |
| **Crash data** | Yes | No | No | Analytics |
| **Performance data** | Yes | No | No | Analytics |
| **Advertising data / IDFA** | **No** | — | — | — |
| **Search history** | No | — | — | — |
| **Browsing history** | No | — | — | — |
| **Sensitive info** | No | — | — | — |
| **Contacts** | No | — | — | — |
| **Health & fitness** | No | — | — | — |
| **Financial info** (other than payment) | No | — | — | — |

---

## 3. Tracking
**Do you use data for tracking purposes?** → **No.**

We do not link user data with data from other apps/websites for advertising,
nor do we share data with data brokers. App Tracking Transparency prompt is
**not required**.

---

## 4. Third parties

These services receive a subset of the data above to perform their function:

| Service | Data shared | Purpose |
|---|---|---|
| **Stripe** | Payment info, name, email | Process bookings and Family Plus subscriptions |
| **Lovable Cloud (Supabase)** | All app data | Backend hosting, authentication, database |
| **Twilio** | Phone number | SMS one-time-passcode delivery |
| **Apple Sign in with Apple** | Email (relay or real), name | Authentication |
| **Google Sign-In** | Email, name, profile photo | Authentication |

We do **not** use: Facebook SDK, Google Analytics, Firebase Analytics, Mixpanel,
Segment, Amplitude, AppsFlyer, Adjust, or any advertising SDK.

---

## 5. Data deletion

Users can delete their account in-app via **Account → Danger Zone → Delete account**.
This:
- Anonymises personal data on the profile (name, phone, address cleared).
- Removes the auth user from Lovable Cloud.
- Preserves only anonymised booking history needed for the other party's records
  (per UAE consumer protection record-keeping requirements).

A web equivalent is available at `https://nannyrecommended.com/account` for
users who can't access the app.

---

## 6. Privacy policy

Live at https://nannyrecommended.com/privacy and inside the app at `/privacy`.
The policy describes everything declared above in plain language.
