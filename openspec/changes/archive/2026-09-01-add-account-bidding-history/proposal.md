**Author:** @htonyl - 2026-08-27

## Why

A collector can see where one listing stands now, but cannot reconstruct what
happened across their bids: which action succeeded, why one failed, when their
private automatic-bid maximum changed, or which competing bid left them
outbid. That missing explanation turns an auditable money decision into a
support question; success is a lower number of bid-state and bid-failure
support contacts per 1,000 bidders.

## Market reference

- [eBay](https://www.ebay.com/help/buying/bidding/bidding?id=4014) keeps the
  bidder's maximum private, distinguishes current and lost bidding activity in
  the account, and makes an immediate outbid understandable as another earlier
  or higher maximum.
- [Alt](https://support.alt.xyz/en/articles/9425203-buying-in-alt-auctions)
  puts monitored auction cards under **My Auction**, keeps each maximum private,
  and lets the collector act again without returning to the catalogue.
- [SNKRDUNK](https://snkrdunk.com/) is an offer marketplace rather than an
  auction model. Its useful pattern is a compact item summary beside price and
  transaction history; it does not supply the personal event semantics needed
  here.

Grade10 will combine those useful patterns without copying their mechanics: a
scan-friendly account list opens into one chronological explanation containing
the public auction movements and that collector's private events.

## What Changes

- Give each signed-in storefront account a private, cursor-paged record of its
  retained bid attempts, accepted bids, failures, automatic-bid maximums, and
  final standing, without crossing storefront identity boundaries.
- Combine the public accepted-price movements for one listing with the
  collector's private events into one chronological history, marking the
  collector as **You** while every rival remains pseudonymous.
- Add a Grade10 `/bids` account page with active and completed filters,
  scan-friendly listing summaries, expandable histories, and a route back to
  an open listing when the collector can act again.
- Keep ZZZ compatible with the shared history contract and backend behavior,
  without adding a ZZZ bidding-history screen.
- Treat automatic bidding as an already-delivered prerequisite. This change
  records and presents maximums and automatic raises; it does not implement or
  change their bidding or payment rules.

## Non-Goals

- Implement, alter, enable, or migrate automatic bidding.
- Change bid increments, tie-breaking, authorization, settlement, extension,
  notification, or auction-close policy.
- Publish private maximums, payment facts, failure reasons, or storefront
  identity on an anonymous auction surface.
- Add a ZZZ page, delete/hide controls for retained financial history, or an
  operator bidding-history screen.
- Add a price chart or market-value analytics; SNKRDUNK's transaction-history
  treatment informs information density, not scope.

## Capabilities

### New Capabilities

- `grade10-site/auction/bidding-history`: The private account index and per-listing
  combined history, its privacy boundary, retained chronology, filters, states,
  and Grade10 screen.

### Modified Capabilities

None.

## Impact

- `@grade10/i18n` gains a shared bidding-history namespace in every supported
  language; it contains neutral auction vocabulary and no Grade10-specific
  override.
- `@grade10/auction-contracts` gains storefront-neutral private-history
  contracts; the Grade10 and ZZZ Store backends remain the identity boundary
  over their pinned Auction-service entrypoints.
- `@grade10/auction-backend` and the shared Auction worker persist bid attempts
  and project public and private events without copying account identity.
- `@grade10/auction-frontend` gains a data-backed bidding-history feature; the
  Grade10 SPA owns the `/bids` route, page composition, copy, and navigation.
- Existing `@grade10/design-system` primitives are sufficient; no token,
  primitive, or shared `@grade10/ui` block is proposed.
- Delivery depends on automatic bidding and its event facts having landed
  before implementation begins.
