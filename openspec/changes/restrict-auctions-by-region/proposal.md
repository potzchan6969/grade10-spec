**Author:** @tangconst - 2026-10-08

Product context: [Auction Display · Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details) and [Bidding · Refusals](../../../docs/prds/products/grade10-site/auction/bidding.md#refusals) carry the 🚧 and ❓ lines this change delivers and owes.

## Why

Auctions cannot be offered in every region the site serves. A collector
reaching Grade10 from a restricted region should shop the store as usual but
never meet an auction they cannot legally enter — not in the navigation, not
at a direct address, and not through a bid the service accepts and cannot
settle. The metric that moves: auction actions attempted and refused from
restricted regions, which today is unmeasured because nothing refuses them.

## What Changes

- **Auction entry points hidden** — a request judged to come from a
  restricted region renders no auction navigation item, account-menu auction
  item, watch control or other auction surface; the store and the rest of the
  site render unchanged.
- **A restriction page for direct access** — a direct auction address (the
  catalogue, a lot, My Auctions, a winner order) reached from a restricted
  region answers a dedicated page saying auctions are not available in the
  collector's region, with a link to the store; it is an honest answer, not a
  404.
- **Auction actions refused** — bids, watches and order actions arriving
  from a restricted region are refused before the auction hears of them, so
  hidden navigation is never the only barrier.
- **Per-request judgement** — the restriction is read on each request from
  the edge's region signal, so a collector whose network location changes
  sees the answer for where they now are.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `grade10-site/auction/availability`: which regions auctions are offered
  in, what a restricted region hides and refuses, and the page a direct
  auction address answers there.

### Modified Capabilities

- `shared/ui/site-chrome`: `SiteHeader`'s account menu gates My Auctions on
  its handler like every other optional item — today the contract requires
  it, so restricted regions could not omit it. Backward compatible: a
  consumer that supplies `onMyAuctions` renders exactly what it does today.

## Impact

- **grade10-site application** — edge region check and flag plumbing into
  the page request; navigation and account-menu item filtering; a new
  restriction route answering auction addresses; guards on auction mutations.
- **`@grade10/i18n`** — new message keys for the restriction page in every
  language the brand speaks.
- **`packages/ui`** — `SiteHeader`'s `onMyAuctions` becomes optional and
  handler-gated; every other export is untouched. `Nav`/`Footer` already
  take all items through props.
- **Auction emails** — outbound letters already sent carry links that a
  restricted recipient now resolves to the restriction page.

## Open questions

- **Restricted collector with open commitments** — ❓ Product: whether a
  signed-in collector in a restricted region with a standing bid, a watched
  lot or an unpaid winner invoice keeps read access to settle it. The spec
  drafts assume read-only access.
- **zzz-site scope** — ❓ Product: whether ZZZ shares the restriction rule
  or auctions simply never launch there.

## References

- [Auction Display · Auction Details](../../../docs/prds/products/grade10-site/auction/display.md#auction-details)
- [Bidding · Refusals](../../../docs/prds/products/grade10-site/auction/bidding.md#refusals)
