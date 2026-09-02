**Author:** @jeffffej0909 - 2026-08-27

## Why

A collector who bids on six listings closing across one evening has no single
place that tells them where they stand. Bidding is per-listing: the only page
carrying a listing's standing is that listing's own page, so a collector holds
their auction activity in browser tabs and memory. Being outbid is learned by
going back and looking. Winning is learned from the operator who makes contact.

Three facts make this concrete rather than speculative:

- There is no collector-facing account surface for auctions anywhere in this
  store. `grade10-auction` holds `admin-listing`, `listing-media`, and
  `listing-page`; the account area holds `grade10-store/account-profile`, which
  is profile fields alone. Nothing addresses a collector's own activity.
- Every post-sale fact a winner needs already exists — as an operator-side
  requirement. `grade10-auction/post-sale` records outcome, payment state, and
  shipment state for the queue. The person those records are about cannot see
  any of them.
- A losing bidder's card authorization is released asynchronously. Nothing tells
  them so. A pending authorization on a bank statement, with no explanation
  anywhere in the product, reads as a charge for a listing they did not win.

There is also nothing to measure. Interest before a bid does not exist as a
recorded event, so the product cannot distinguish a listing nobody wanted from
one many collectors considered and did not bid on.

**Metric:** watch-to-bid conversion — watched listings on which the watching
collector later placed at least one bid, divided by watched listings whose
bidding window opened. It has no baseline today because neither the watch nor
the surface exists; this change establishes it.

The product decision behind this change, including what was ruled out and why,
is [`docs/prds/products/grade10-auction/account-auction-record.md`](../../../docs/prds/products/grade10-auction/account-auction-record.md).

## What Changes

- **A collector can watch a listing.** Watch and unwatch from a listing's own
  page and from the catalogue that lists it. A watch is private to the
  collector who made it.
- **A new account surface: the auction record.** Two pages behind one
  navigation — **Watching** for listings they follow, **Bidding** for listings
  they have bid on.
- **Watching carries four listing states only** — Scheduled, Live, Ending soon,
  Ended. It answers whether a listing is open and how soon it closes, nothing
  more.
- **Bidding groups a collector's listings** as Active, Won, and Didn't win, and
  says where they stand in each: leading, outbid, or the outcome of a close.
- **A winner follows their own listing to delivery.** Payment and shipment
  state, read-only, projected from the records `grade10-auction/post-sale`
  already keeps for the operator queue.
- **A losing bidder is told about their card hold**, including while its release
  is still in flight.
- **The collector sees one `Paid`**, however collection happened. This is
  deliberately not the operator queue's rule, which forbids a bare "Paid" and
  separates Paid via Stripe from Paid via Manual for finance reconciliation.
- **`@grade10/ui` gains the record's components**, so the surface is composed
  rather than rebuilt per application.

No breaking changes. No existing requirement's behavior changes; the
`listing-page` delta adds a control and alters nothing already specified.

## Non-Goals

- **Notifications.** No email, push, or SMS for a close approaching, an outbid,
  or a win. This surface is pull-only. A notification programme carries its own
  consent, delivery, and quiet-hours decisions and is a separate change.
- **A catalogue capability.** Watching from the catalogue is required here, but
  the catalogue has no durable spec and does not gain one as a side effect of
  this change.
- **Auto-bidding and proxy bids**, excluded by the parent auction decision and
  unchanged here.
- **Retracting or editing a bid.** A placed bid is binding.
- **Paying, requesting a wire, or arranging delivery from this surface.** The
  winner reads their state; every write stays the operator's under
  `grade10-auction/post-sale`. A winner-initiated wire request remains
  follow-on.
- **Invoices, receipts, refunds, and disputes.**
- **A public watch list or public collector profile.** The record is owner-only.
  Watch counts do not appear on a listing.
- **Search, saved searches, filters, and recommendations.** Discovery stays the
  catalogue's job.
- **Seller-side records.** Grade10 is the seller; there is no consignor view.
- **ZZZ.** `zzz` has no account surface and gains none here.

## Capabilities

### New Capabilities

- `grade10-auction/account-auction-record`: a signed-in collector's own record
  of the listings they watch and the listings they have bid on — what it holds,
  how a watch is added and removed, the states each page distinguishes, and what
  a winner and a losing bidder are told after a close.
- `shared-ui/auction-record`: the components `@grade10/ui` exports for the
  surface and what each is responsible for. Content and product state reach them
  through props, as with every block in that package. Named `auction-record`,
  not `account-auction-record`, so its scenario ids cannot collide with the
  `grade10-auction` capability's — the same reason `shared-ui/store-profile`
  and `grade10-store/account-profile` carry different directory names.

### Modified Capabilities

- `grade10-auction/listing-page`: a lot's own page gains a control that watches
  and unwatches it. Additive — no existing requirement of that capability
  changes.

## Impact

- **grade10 SPA** — a new account route composed from the new `@grade10/ui`
  blocks, plus the watch control on the lot page and the catalogue. It owns
  routing, session gating, copy, and the read and refresh calls.
- **Store service** — resolves the Grade10 customer session and calls the
  pinned Auction service entrypoint for the collector's own record and for
  watch writes. It cannot read a record for anyone but the session's owner.
- **Auction service** — owns watch records and composes the collector's record
  from listings, their bids, and the payment and shipment milestones it already
  holds. The collector view is a projection, never a second source of truth for
  outcome, payment, or shipment.
- **Anonymous API gateway** — unchanged. It never resolves bidder identity, so
  no part of this surface routes through it.
- **`@grade10/ui`** — new blocks composed from existing design-system
  primitives. This lands here and reaches the application through a submodule
  bump, so the export contract settles before application work starts.
- **`@grade10/i18n`** — new state labels and empty-state copy in every locale
  the brands speak. Collector-facing labels are not the operator queue's labels.
- **Design system** — expected to need no new primitive, variant, or token. If a
  state cannot be built from what ships today, that is a separate change with
  its own Figma reconciliation.
- **Admin panels** — unaffected. The operator queue keeps its own outcome
  labels, including the Paid via Stripe and Paid via Manual distinction.
- **ZZZ store service** — unaffected.
