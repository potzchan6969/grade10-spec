# Watching a listing on ZZZ

**Author:** @mason5991 - 2026-09-17

Depends on [`add-auction-watchlist`](../add-auction-watchlist/proposal.md) for
the shared watch record, contracts, and Grade10 surfaces. Behaviour matches
[Grade10 Watchlist](../../../docs/prds/products/grade10-site/auction/watchlist.md);
this change only carries that behaviour onto ZZZ. ZZZ's own auction PRD is
not drafted yet.

**Terminology.** **Listing** is the domain entity. **Lot** is only the
collector-facing label for a listing (`listingLabel` / copy such as
`lotLabel`). Specs, contracts, and processors name the listing; surfaces may
still say "lot" in copy.

## Why

A ZZZ collector who finds a listing and is not ready to bid has the same gap
Grade10 closed with watching: bidding holds money on a card, and without a
watch the collector either commits early or finds the listing again by memory
against a moving close. The shared auction already stores a watch per
storefront, and Grade10 ships the controls and the watched list. ZZZ's site
still has no auction page, so a ZZZ collector cannot mark a listing or return
to one from a list on their own brand.

**Metric:** the share of signed-in ZZZ collectors who watch at least one
listing, and the share of watched listings their ZZZ watcher later bids on.
**Acceptance signal:** a ZZZ collector watches a listing, closes the tab, and
returns to it from their watched list on ZZZ without searching.

## What Changes

- **A signed-in ZZZ collector watches and unwatches a listing** from the
  listing page and from the catalogue on ZZZ.
- **A ZZZ collector reads their watched listings** on ZZZ, most recently
  watched first, with each listing's current bid and close, and can unwatch
  from that list.
- **ZZZ carries the auction surfaces watching needs** — a listing's own page,
  the catalogue, and the watched list — so the controls have somewhere to
  hang. Watching means what Grade10 already defined; this change does not
  invent a second list.
- **Watch, unwatch, and watched-list copy** land in the locales ZZZ answers
  (Korean).

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `zzz-site/auction/watchlist`: a signed-in ZZZ collector marks an auction
  listing to come back to on ZZZ — the same meaning of watch as
  `grade10-site/auction/watchlist`, scoped to ZZZ's listing page, catalogue,
  and watched list.

### Modified Capabilities

None. The shared watch record and operator count across brands already land
in `add-auction-watchlist`; this change does not rewrite them.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/frontend/zzz` | Fills watch and unwatch on the ZZZ listing page and catalogue tile; adds a watched-listings surface. |
| `@grade10/i18n` | Watch, unwatch, and watched-list copy for the locales ZZZ answers. |
| `apps/backend/zzz/store` | Already binds `ZzzAuctionService`; no new watch table — the shared auction owns the row. |

**Ordering.** Ships after `add-auction-watchlist` has the shared contracts and
Grade10 surfaces. Independent of ZZZ vault, appointment, and store launch.

## References

- [Grade10 Watchlist](../../../docs/prds/products/grade10-site/auction/watchlist.md) — behaviour this change mirrors on ZZZ
