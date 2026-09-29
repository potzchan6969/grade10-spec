## Goals

- Collectors who browse, bid, and pay read as one path in Mixpanel, not
  several devices that never join.
- Grade10 emits a typed Mixpanel catalog across store, auction, vault, and
  loyalty — first-party ingest, identity, user profiles, and clear refusals.
- Auction, vault, and loyalty funnel joins become walkable in Mixpanel once
  those products are live; money and loan facts stay on Site Records.

## Non-Goals

- Mixpanel as the money, points, or loan ledger
- Mixpanel's browser SDK, Autocapture, or Session Replay
- A consent gate in front of the browser client (this change)
- Mixpanel erasure when an account is deleted (this change)
- ZZZ storefront emit
- Operator consoles, admin Mixpanel, bid ticks, KYC payloads, coupon codes,
  and private maxima from the browser
- Signed In and Signed Out as Mixpanel events
- Points Earned, Tier Changed, or Coupon Used as their own events
- User profiles for anonymous devices
- Contact fields (`$email`, `$name`, `$phone`) on Mixpanel until Consent and
  Mixpanel erasure settle

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | First-party or Mixpanel's browser SDK? | First-party `/api/track` and server `/import` — Title Case names stay | Mixpanel browser SDK, Autocapture, or Session Replay |
| Q2 | Who may write a user profile? | Server only, for a user id — snapshot of Audience, Member, Tier, Identity Standing, Wallet Pass; Created once | Browser writes; profiles for anonymous devices |
| Q3 | What happens at sign-out or session expiry? | Rotate the browser device id (Mixpanel logout reset) | Signed In / Signed Out events |
| Q4 | Do server emits keep the browser device? | Yes — Checkout Started, web Order Paid, and other continuing server emits keep `$device_id` when Grade10 still has it | Drop `$device_id` on the server so pre-login browse never joins |
| Q5 | Who sends Checkout Started? | The worker, when checkout is accepted | The browser (it has already left for Shopify) |
| Q6 | Ownerless Order Paid then claimed? | Send once on the order device; a later claim does not resend or merge | Merge the order device onto the member at claim |
| Q7 | Collector IP for geo? | Pass on `/import` and `/engage` when known; never store as a property; `$ip` is `0` on engage when none was captured | Omit IP and let Mixpanel geolocate the worker |
| Q8 | First-touch campaign fields? | Page Viewed and Lot Viewed carry UTM from the landing; first Page Viewed on a device may carry Initial Referrer | No campaign properties on browse events |
| Q9 | Contact fields on Mixpanel user profiles? | ❓ legal - recommended: keep them off until Consent and Mixpanel erasure settle | Send `$email` / `$name` / `$phone` with this change |
| Q10 | Consent gate in front of the browser client? | ❓ legal - recommended: none in this change; the library can already drop | Block the gate on shipping the catalog |
| Q11 | Delete the Mixpanel profile when an account is deleted? | ❓ legal - recommended: out of this change | Block shipping on erasure |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/analytics` | Whether user profiles may carry `$email`, `$name`, `$phone` | Q9 |
| `grade10-site/analytics` | Whether a consent gate sits in front of the browser client | Q10 |
| `grade10-site/analytics` | Whether a deleted account must be erased in Mixpanel | Q11 |
