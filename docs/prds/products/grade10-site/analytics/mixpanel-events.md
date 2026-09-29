---
title: Mixpanel Events
spec: grade10-site/analytics/analytics
order: 1
reviewed: 2026-09-29
---

Who did what in Mixpanel, and the user-profile snapshot that filters
them. The pipeline is [Product Analytics](/platform/tracking). Domain signals
that use these names sit on [Analytics](/p/grade10-site/analytics).

## Events

Properties and who may send each name live in the capability spec.
The browser may submit client event names only; ingest rejects a server
event name from the client.

### Client events

The storefront posts these through first-party `/api/track`.

| Event          | Fires when                                        | Domain          |
| -------------- | ------------------------------------------------- | --------------- |
| Page Viewed    | A collector opens a page                          | Store · Auction |
| Product Viewed | A collector opens a product page                  | Store           |
| Product Added  | First successful add of that product this session | Store           |
| Cart Opened    | The collector opens the cart                      | Store           |
| Lot Viewed     | A collector opens a lot                           | Auction         |

### Server events

Workers send these when the domain fact lands. The browser cannot.

| Event                 | Fires when                                     | Domain             |
| --------------------- | ---------------------------------------------- | ------------------ |
| Checkout Started      | The store accepts a checkout                   | Store              |
| Order Paid            | A paid order lands, online or at the till      | Store · Membership |
| Account Created       | The store first knows a user id                | Store              |
| Card Linked           | A collector links a card to bid                | Auction            |
| Bid Placed            | A collector's maximum is accepted              | Auction            |
| Lot Watched           | A collector watches a lot                      | Auction            |
| Bidder Outbid         | A collector stops leading                      | Auction            |
| Auction Won           | A listing closes with this collector as winner | Auction            |
| Invoice Paid          | The winner's invoice is paid                   | Auction            |
| Pass Added            | A member card is issued to a wallet            | Membership         |
| Reward Redeemed       | A member buys a reward with points             | Membership         |
| Member Identified     | A till identification succeeds                 | Membership         |
| Vault Case Submitted  | A collector submits a case                     | Vault              |
| Vault Visit Booked    | A vault visit is booked                        | Vault              |
| Vault Offer Made      | Staff make an offer                            | Vault              |
| Vault Offer Accepted  | The offer is accepted                          | Vault              |
| Vault Offer Declined  | The offer is declined                          | Vault              |
| Vault Payout Recorded | The treasurer records the payout               | Vault              |
| Identity Bound        | A case gains a verified identity               | Vault              |

- **Goods and charge apart** — Order Paid carries both; tax and shipping
  are not revenue
- **Once per order** — a replay or claim does not send Order Paid twice
- **Points on the paid order** — earn and spend sit there, not a second
  earn event
- **First-touch campaign on the landing** — Page Viewed and Lot Viewed
  carry UTM when the address had those keys; the first Page Viewed on a
  device may also carry Initial Referrer
- 🚧 **Never lost** - a server event reaches Mixpanel however long Mixpanel
  or the worker that sent it is down, and counts once -
  [Product Analytics · Delivery](/platform/tracking#delivery)

## Identity

- **Simplified ID Merge** — Mixpanel links anonymous browse to the member via
  `$device_id` on signed-in emits; Grade10 does not send `$merge` (Original ID
  Merge). Pipeline detail:
  [Product Analytics · Identity](/platform/tracking#simplified-id-merge)
- **Member or device** — signed-in on the person; anonymous on the device;
  ownerless paid on the order alone
- **Session end starts a new device** — sign-out and session expiry both
  rotate the device, so the next guest is not merged onto the last person
- **Server emits keep the collector device** — Checkout Started, web
  Order Paid, and every other server event that continues a browser or
  till visit name that `$device_id` when Grade10 still has it; browse
  then joins the account after pay or sign-in
- **Collector IP for geo** — every Mixpanel send, client or server,
  carries the collector's IP when Grade10 knows it so Mixpanel can set
  city and country; the IP is not stored as a property

## User Profile

Mixpanel holds a user profile for a **user id only** — the latest
snapshot used to filter events and build cohorts.

| Property          | Values                                | Source                                                           | Written when                                              |
| ----------------- | ------------------------------------- | ---------------------------------------------------------------- | --------------------------------------------------------- |
| Audience          | `collector` · `staff`                 | Session role on an identified event                              | An identified event is recorded                           |
| Member            | true · false                          | [Membership](/p/grade10-site/loyalty)                            | The person is a member, or stops being one                |
| Tier              | `Silver` · `Gold` · `Black`           | [Tiers](/p/grade10-site/loyalty/tiers)                           | The held tier changes; omitted when they are not a member |
| Identity Standing | `unverified` · `verified` · `expired` | [KYC](/p/grade10-site/account/kyc)                               | Standing changes                                          |
| Wallet Pass       | `none` · `apple` · `google` · `both`  | [Wallet member card](/p/grade10-site/loyalty/wallet-member-card) | A pass is issued or ended                                 |
| Created           | Mixpanel created-at                   | Account Created                                                  | Once, when Account Created fires                          |

- **Server only** — each property is written when that fact changes and
  overwrites the previous value; the browser never writes a profile
- 🚧 **Latest write, whatever the outage** - the profile ends on the latest
  write of each property; a held write is never sent over a later one -
  [Product Analytics · Delivery](/platform/tracking#delivery)
- **No anonymous device** — an unsigned visit has events, not a profile
- **Collector IP for geo** — engage sets `$ip` to the collector's
  address when known; `$ip` is `0` only when none was captured, so the
  worker's location is never written
- **Audience on events too** — staff traffic can be filtered before a
  profile exists
- **Created once** — set when Account Created fires, never updated
- ❓ **Contact fields** — Mixpanel encourages `$email`, `$name`, and
  `$phone`; Grade10 does not send them until consent and Mixpanel erasure
  settle
- **Secrets stay off** — document numbers, date of birth, address, coupon
  codes, pass serials, and device fingerprints are not cohort traits

:::detail{title="Code map" for="engineer"}
- **Architecture** — [tracking architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/tracking.md) (Simplified ID Merge, per-env tokens, empty-token no-op, capture tests)
- **Store catalog + ingest** — `packages/grade10-store/backend/src/services/analytics/events.ts`, `…/track.ts`, `…/routes/track.ts` (`POST /api/track`)
- **Storefront client** — `apps/frontend/grade10/src/core/analytics/` (`createTrackingClient`, device reset); feature call sites under `packages/grade10-store/frontend`
- **Auction / vault / loyalty emits** — `packages/grade10-auction/backend/src/services/analytics/`, `packages/vault/backend/src/services/analytics/`, `packages/loyalty/backend/src/services/analytics/`
- **Shared library** — `packages/mixpanel` (🚧 `/outbox` for backend sends, `/ingest` for `/api/track`, browser client)
:::

:::detail{title="Product decisions" for="pm"}
**Decisions.**

| Item                       | Status  | Decision                                                                                                                                                                    | Owner           |
| -------------------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Identity merge             | Decided | Simplified ID Merge only. No Original ID Merge and no `$merge` call — linking is `$device_id` on identified emits.                                                          | Product         |
| User profile               | Decided | Snapshot of audience, member, tier, identity standing, wallet pass. Server only. Never an anonymous device.                                                                 | Product         |
| Contact fields on Mixpanel | ❓ Open | Mixpanel encourages `$email`, `$name`, `$phone`. Whether Grade10 sends them waits on consent and Mixpanel erasure.                                                          | Product · Legal |
| Session end resets device  | Decided | Sign-out and session expiry rotate the device. Mixpanel's logout reset, without Signed In or Signed Out events.                                                             | Product         |
| Server keeps `$device_id`  | Decided | Checkout Started, web Order Paid, and other server emits that continue a browser or till visit name that device when known, so pre-login browse joins after pay or sign-in. | Product         |
| First-touch campaign       | Decided | Page Viewed and Lot Viewed carry UTM from the landing address; first Page Viewed on a device may carry Initial Referrer.                                                    | Product         |
| First-party ingest         | Decided | No Mixpanel browser SDK, Autocapture, or Session Replay. Title Case names stay.                                                                                             | Product         |
| Checkout Started           | Decided | The worker sends it when checkout is accepted. The browser has already left for Shopify.                                                                                    | Product         |
| Ownerless then claimed     | Decided | Order Paid is sent once, on the order. A later claim does not send it again and does not merge the order device onto the member.                                            | Product         |
| Collector IP for geo       | Decided | Client and server Mixpanel sends carry the collector IP when known so Mixpanel geolocates the person, not the worker. IP is never stored as a property.                     | Product         |
| Backend delivery           | Decided | Every backend send reaches Mixpanel and counts once, whatever the outage. Browser events and Datadog counters are best effort.                                              | Product         |
:::
