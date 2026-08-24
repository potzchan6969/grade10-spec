# Who is signed in

**Author:** @rita-liu - 2026-08-20

## Why

A collector who signs in on one Grade10 or ZZZ site should already be that
person on every other site of the same brand, and every product should name
them by user id. Almost none of that is written down. `shared-auth/sign-in` today
covers only in-flight duplication.

**Metric:** products that key a person by email, not user id, stays at zero.

## What Changes

- A signed-in person is named by user id, email, name, and roles. Sign-in
  covers the brand, not another brand. Products key by user id, never email.
- A person signs in with an emailed link, an emailed code, or Google when
  the brand has it. First success creates the account; the same email is
  the same person, case-insensitive, without folding plus-tags. One
  sign-in email per address per minute; a new send kills the earlier
  unused link or code. A link or code expires. Google counts only a
  verified email. Sign-in does not leave the brand.
- A product that has verified an email — anonymous checkout is the first
  caller — may create that account or enter the existing one, and may sign
  the person in. The client cannot do this by naming an email. Checkout
  itself stays with the store.
- Product analytics names a signed-in visit by user id and an anonymous
  visit by device. The client cannot choose the user.

## Related

| Owner | Governs |
| --- | --- |
| `shared-auth/sign-out` | Leaving a session |
| `grade10-site/page-shell` | Header account control |
| `grade10-site/navigation` | Profile ↔ sign-in redirect |
| `add-auth-access` | Roles, the users directory, the identity trail |
| `add-account-profile` | Store profile fields |
| `add-grade10-shopify-store` | When checkout creates or signs in the buyer |

## Non-Goals

- Roles, the users directory, the identity trail — `add-auth-access`.
- A second factor.
- Sign-out, header account control, profile↔sign-in redirect — see Related.
- Store profile fields — `add-account-profile`.
- Account deletion, email change, ending other sessions.
- Passwords. Dev-only sign-in.
- Signed-in / signed-out analytics events. Which events a product records.
- People-profile sync. A consent gate in front of analytics.
- Checkout, cart, payment, and when the store verifies an email —
  `add-grade10-shopify-store` and later store specs.

## Capabilities

### New Capabilities

- `shared-auth/session`: who a signed-in person is, that user id keys identity, and
  how analytics names a visitor.

### Modified Capabilities

- `shared-auth/sign-in`: which methods exist, first success creates the account, a
  product that has verified an email may create or sign in, one sign-in email
  per address per minute, a new send replacing earlier unused mail, expiry,
  case-folded uniqueness without alias folding, Google only from a verified
  email, and sign-in stays on the brand. In-flight duplication stays.

## Impact

- Identity worker, collector sites, and admin panels of both brands.
- Every product: identity keyed by user id; analytics named from who is
  signed in. Store (and later any product that verifies an email) may
  create or sign in an account without the collector sign-in surface.
- `@grade10/ui` `auth-sign-in` (`SignInCard`, `SignInEmailForm`,
  `SignInCodeForm`). No new export.
- No Figma or design-system change.
