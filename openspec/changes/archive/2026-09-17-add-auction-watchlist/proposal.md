# Watching a listing

**Author:** @jeffffej0909 - 2026-08-24

Product context: [Watchlist](../../../docs/prds/products/grade10-site/auction/watchlist.md).
Prerequisite for [`add-auction-notifications`](../add-auction-notifications/proposal.md):
progress mail enrols when a collector watches **and** email alerts are on
for that listing.

**Terminology.** **Listing** is the domain entity. **Lot** is only the
collector-facing label for a listing (`listingLabel` / copy such as
`lotLabel`). Specs, contracts, and processors name the listing; surfaces may
still say "lot" in copy.

## Why

A collector who finds a listing they want and is not ready to bid has nothing
to do with it. Bidding is the only way to register interest in a Grade10
listing, and a bid holds money on a card — so the collector who is still
deciding either commits early or navigates away and finds the listing again by
memory. Listings close on a moving deadline, so "find it again later"
frequently means not finding it.

There is already a hole shaped like this feature. `ListingLotHeader` ships
watch and unwatch controls, and the listing page in preview already fills them.

**Metric:** the share of signed-in collectors who watch at least one listing,
and the share of watched listings their watcher later bids on. **Acceptance
signal:** a collector watches a listing, closes the tab, and returns to it
from their watched list without searching.

## What Changes

- **A signed-in collector watches and unwatches a listing** from the listing
  page and from the catalogue.
- **Watching is per collector and per listing**, and survives sign-out and
  sign-in on another device. It is stored by Grade10, never in the browser.
- **A collector reads their watched listings** as a list, most recently
  watched first, showing each listing's current bid and close.
- **Watching is a signal, not a claim.** It confers no bidding priority, no
  reservation, and no visibility to other collectors or to the seller.
- **A watch outlives its listing's close.** A watched listing that has closed
  stays in the list, marked closed, so a collector can see what happened to
  it.
- **Watching defaults email alerts on.** Unwatching removes the listing from
  Watching and turns email alerts off for that listing.

## Non-Goals

- **Watching anything but an auction listing.** Not store products — the
  wishlist heart was deliberately removed from `Nav` and from every product
  tile, and nothing here brings it back.
- **Sending mail or owning mute semantics.** Mail kinds, mute, and fanout are
  `add-auction-notifications`. This change owns list membership and that
  unwatch clears alerts with the watch.
- **Bidding from the watched list.** It links to the listing.
- **Sharing, following a collector, or a public watch count.** A watch is
  private to the collector who made it, and a listing does not display how
  many people watch it.
- **Watching while signed out**, and migrating a browser-held watch into an
  account on sign-in.
- **Sorting, filtering, or searching the watched list** beyond most-recent
  first.
- **ZZZ auction surfaces.** Watch and unwatch on ZZZ, and ZZZ's watched list,
  are [`add-zzz-auction-watchlist`](../add-zzz-auction-watchlist/proposal.md).
  This change ships Grade10 only. The shared auction still accepts a watch
  from either brand's collector once that brand's surface exists.

## Capabilities

### New Capabilities

- `grade10-site/auction/watchlist`: a signed-in collector marks an auction
  listing to come back to — what watching means, who can see it, what it does
  and does not confer, how the watched list is ordered, what happens to a
  watch when its listing closes, and that watch / unwatch set per-lot email
  alerts on / off without defining which messages fire.

### Modified Capabilities

None. `ListingLotHeader` already exposes watch and unwatch, so the
shared UI contract does not change; see Impact.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10-site/auction/auction` | Owns the watch record: collector, listing, and Watched At. Shared across both brands, like the listings themselves. |
| `@grade10/auction-contracts` | Gains watch and unwatch actions, the viewer's watching state on authenticated listing facts, and a watched-listings read. Additive; nothing breaks. |
| `apps/frontend/grade10` | Fills `ListingLotHeader`'s existing watch control and `watched` / `onWatchToggle`; adds a watch control to the catalogue tile and a watched-listings surface. |
| `@grade10/ui` | **No export change.** `ListingLotHeader` already has watch and unwatch. The catalogue tile's control is application-owned until a second consumer needs it. |
| `@grade10/i18n` | Watch, unwatch, and watched-list copy for every locale Grade10 answers. |

**Ordering.** `add-auction-notifications` depends on this change; progress
mail needs a watch with email alerts on (or a bid with alerts on). Independent
of `add-auction-auto-bidding`.

**On the removed wishlist.** `2026-08-19-remove-wishlist-control` removed the
store heart because no surface answered it. That reasoning is respected here:
this control is built with its surface and its persistence in the same change,
and the store heart stays removed.

## Follow-on changes

- A ZZZ collector watches and returns to a listing the same way a Grade10
  collector does — [`add-zzz-auction-watchlist`](../add-zzz-auction-watchlist/proposal.md).
