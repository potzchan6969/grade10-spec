**Author:** @mason5991 - 2026-09-30

Product context: [Bidding · Auction Logic](../../../docs/prds/products/grade10-site/auction/bidding.md#auction-logic),
[Auction Display · Auction Listing](../../../docs/prds/products/grade10-site/auction/display.md#auction-listing),
and [Account record](../../../docs/prds/products/grade10-site/auction/account.md) My Auctions.

## Why

Countdown, auction status, and extended close must stay aligned across
browsers and machines on the same auction. Today two collectors can see
different remaining seconds, jump to Ended while the auction is still
settling, miss an extension that another tab already shows, or read their own
last bid on My Auctions instead of the auction's top. Each open page must
follow the service clock and the same recorded close, not guess from its
device.

**Metric:** open auction pages and catalogue cards on one live auction show
the same remaining seconds, the same public status (Active, Closing, or
Ended), and the same recorded close within about one second of an accepted
bid, extension, or settle; My Auctions Ended rows show the auction top for
every bidder on that auction.

## What Changes

- **Aligned countdown across browsers and machines** — countdowns run from the
  auction service's clock, not each browser's; the page re-probes after sleep,
  a live reconnect, or a return to the tab so every open page keeps the same
  remaining seconds
- **Live rooms sync standing and extension** — one Durable Object per open
  auction and one catalogue hub push public state after Postgres commits,
  including a restarted recorded close; rooms re-read before they broadcast so
  every connected page sees the same hammer and extension without a reload
- **Aligned Closing / Ended status** — past the recorded close while still
  published, the auction is Closing on every page; pages do not show Ended from
  their own clock alone; settle (room alarm, a late public read, or cron)
  closes or extends for everyone together
- **My Auctions top** — Ended and Active bidding rows show the auction's
  current or winning top, not only the viewer's latest bid amount
- **Won from leading** — after settle, a standing that still says leading
  while the winner is this viewer becomes Auction won; a stale leading that
  lost becomes Did not win

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/auction/listing-page` — service clock, live refresh, Closing
  before Ended, won/lost badges after settle
- `grade10-site/auction/auction` — live relay after bid and close; opportunistic
  settle on a late public read
- `grade10-site/auction/account-record` — My Auctions money column is the
  auction top

## Impact

- Auction worker binds ListingLive and CatalogueLive Durable Objects; public
  WebSocket routes under `/api/public/live/*`
- Storefront auction frontend holds MeasuredClock, WebSocketAuctionLive, and
  Closing in listing UI
- Architecture handbook and `docs/architecture/auction.md` name the rooms and
  the Closing phase
- Browser E2E walks multi-bidder equal maxima, extension restart, auto-close
  badges, and My Auctions top (`apps/frontend/grade10/e2e/tests/auction/live-close.spec.ts`)

## Open Questions

None.

## References

- [Bidding · Extended Bidding](../../../docs/prds/products/grade10-site/auction/bidding.md#extended-bidding)
- [Bidding · Auto-Bidding](../../../docs/prds/products/grade10-site/auction/bidding.md#auto-bidding)
- Live relay sequence: [assets/live-relay.svg](assets/live-relay.svg)
