**Author:** @rita-liu - 2026-09-15

## Why

A collector who browses a lot, starts bidding, or pays still looks like
several people in Mixpanel, and the path before the money is empty. The
store emits only Order Paid. Auction launches first and sends nothing, so
lot views, enrollments, and bids cannot join a later win. Vault and
loyalty stay on tables Mixpanel cannot walk as a session.

**Metric:** share of Lot Viewed sessions that reach Bid Placed (the
auction value moment), once auction is live; share of Order Paid whose
distinct_id is a user id, among orders that had a checkout email, once
the store is live.

## What Changes

- New capability `grade10-site/analytics` records the Grade10 Mixpanel
  catalog, who sends each event, identity, user profiles, and what
  never goes to Mixpanel.
- The storefront records Page Viewed (with locale, any UTM on the
  landing, and Initial Referrer on the first view for a device), Product
  Viewed (with source), Product Added, Cart Opened, and Lot Viewed (with
  UTM when the lot address carried those keys). The worker records
  Checkout Started when checkout is accepted and keeps the browser's
  `$device_id`. A web Order Paid still names that same device, so
  pre-login browse joins the account after pay or sign-in. Other server
  emits that continue a browser or till visit keep `$device_id` when
  known.
- After sign-out **or session expiry** the browser starts a new device,
  so the next visitor is not merged onto the previous collector. That is
  Mixpanel's logout reset, without Signed In or Signed Out events.
- Client and server Mixpanel sends carry the collector IP when
  known so geolocation names the person, not the worker; IP is
  never stored as a property.
- Mixpanel holds a user profile that is the latest snapshot of
  audience, member, tier, identity standing, and wallet pass. The
  backend writes it when those facts change, only for a user id, never
  for an anonymous device. Created-at is written once.
- Auction records Card Linked, Bid Placed, Lot Watched, Bidder Outbid,
  Auction Won, and Invoice Paid. Payment rate and time to ship stay on
  listing records.
- Order Paid also carries member, tier, and the points that order earned
  and spent. Mixpanel records Reward Redeemed, Pass Added, and a
  successful till identification.
- Vault records case submitted, visit booked, offer made or answered,
  payout recorded, and identity bound to the case. Financed cases and
  loans outstanding stay on the vault ledger.
- An ownerless Order Paid is sent once. A later claim does not send it
  again and does not merge the order device onto the member.
- Account Created fires once when the store first knows a user id.
  Identity workers still send nothing to Mixpanel.

## Non-Goals

- Mixpanel as the money, points, or loan ledger.
- Mixpanel's browser SDK, Autocapture, or Session Replay. Events stay
  first-party. Title Case names stay; sister sites already use them.
- A consent gate in front of the browser client.
- Mixpanel erasure when an account is deleted.
- ZZZ storefront emit. Shared ingest libraries stay the groundwork.
- Operator consoles, admin Mixpanel, bid ticks, KYC payloads, coupon
  codes, and private maxima from the browser.
- Signed In and Signed Out as Mixpanel events.
- Points Earned, Tier Changed, or Coupon Used as their own events.
- User profiles for anonymous devices.
- Contact fields (`$email`, `$name`, `$phone`) on Mixpanel until Consent
  and Mixpanel erasure settle.

## Capabilities

### New Capabilities

- `grade10-site/analytics`: the Grade10 Mixpanel catalog, identity,
  user profiles, and refusals.

### Modified Capabilities

None. Session already names a visitor by user id or device.
`shared/auth/session` is not delta'd.

## Impact

- Store catalog, `/api/track`, storefront tracking client, Order Paid
  properties, and user-profile writes from the store.
- Auction-service server events into the Grade10 Mixpanel project.
  Storefront Lot Viewed and Page Viewed from the Grade10 SPA, not the
  auction UI package.
- Loyalty Reward Redeemed; store Pass Added and Member Identified.
- Vault-service server events into the same Grade10 project.
- Mixpanel project: Simplified ID Merge on before the first event; one
  token per Grade10 environment; staging and production are separate
  projects; timezone Asia/Hong_Kong. Empty remains a local no-op.
- Server events carry the domain time and a stable insert id from the
  domain key. A property with no value is omitted, never sent empty.
- No UI, Figma, or design-system change. `@grade10/ui` still forbids
  analytics.

## Open questions

- **Consent** — Legal confirms whether a gate sits in front of the
  browser client. The library can already drop.
- **Mixpanel erasure** — Legal confirms whether a deleted account must
  be deleted in Mixpanel.
- **Contact fields** — Product and Legal confirm whether Mixpanel
  user profiles may carry `$email`, `$name`, and `$phone` once Consent
  and Mixpanel erasure settle. This change does not send them.

## References

- [Analytics · Membership](../../../docs/prds/products/grade10-site/analytics/index.md#membership)
- [Analytics · Store](../../../docs/prds/products/grade10-site/analytics/index.md#store)
- [Analytics · Auction](../../../docs/prds/products/grade10-site/analytics/index.md#auction)
- [Analytics · Vault](../../../docs/prds/products/grade10-site/analytics/index.md#vault)
- [Mixpanel Events · Events](../../../docs/prds/products/grade10-site/analytics/mixpanel-events.md#events)
- [Mixpanel Events · Identity](../../../docs/prds/products/grade10-site/analytics/mixpanel-events.md#identity)
- [Mixpanel Events · User Profile](../../../docs/prds/products/grade10-site/analytics/mixpanel-events.md#user-profile)
- [Site Records](../../../docs/prds/products/grade10-site/analytics/site-records.md)
- [Datadog Counters](../../../docs/prds/products/grade10-site/analytics/datadog-counters.md)
- [Product Analytics · User Profile](../../../docs/prds/platform/tracking.md#user-profile)

## Follow-on changes

- ZZZ storefront events on ZZZ's own Mixpanel project, once it has a store.
- A consent gate in front of the browser client, if Legal requires one.
- Mixpanel erasure when an account is deleted, if Legal requires it.
- Lexicon descriptions for every shipped event and property.
