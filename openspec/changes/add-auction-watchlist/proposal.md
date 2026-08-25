# Watching a lot

**Author:** @jeffffej0909 - 2026-08-24

Product context: [Grade10 Auction](../../../docs/prds/auction/auction.md).
Prerequisite for [`add-auction-notifications`](../add-auction-notifications/proposal.md),
whose before-and-during-auction mail has no trigger without it.

## Why

A collector who finds a lot they want and is not ready to bid has nothing to
do with it. Bidding is the only way to register interest in a Grade10 lot, and
a bid holds money on a card — so the collector who is still deciding either
commits early or navigates away and finds the lot again by memory. Lots close
on a moving deadline, so "find it again later" frequently means not finding it.

There is already a hole shaped like this feature. `ListingBidPanel` ships a
`watchAction` slot and a `watching` flag, and nothing in the product fills
them. That is the same dead end the removed wishlist heart was: a control that
saves nothing. This change fills it rather than removing it, because unlike
the store wishlist there is a surface that needs the signal — auction mail
fires on watching, and a lot's close is a deadline worth being told about.

**Metric:** the share of signed-in collectors who watch at least one lot, and
the share of watched lots their watcher later bids on. **Acceptance signal:**
a collector watches a lot, closes the tab, and returns to it from their
watched list without searching.

## What Changes

- **A signed-in collector watches and unwatches a lot** from the listing page
  and from the catalogue.
- **Watching is per collector and per lot**, and survives sign-out and sign-in
  on another device. It is stored by Grade10, never in the browser.
- **A collector reads their watched lots** as a list, most recently watched
  first, showing each lot's current bid and close.
- **Watching is a signal, not a claim.** It confers no bidding priority, no
  reservation, and no visibility to other collectors or to the seller.
- **A watch outlives its lot's close.** A watched lot that has closed stays in
  the list, marked closed, so a collector can see what happened to it.
- **Watching is available on both brands.** It is a property of the shared
  auction, so a ZZZ collector watching a lot watches the same lot.

## Non-Goals

- **Watching anything but an auction lot.** Not store products — the wishlist
  heart was deliberately removed from `Nav` and from every product tile, and
  nothing here brings it back.
- **Notifying anyone.** Mail is `add-auction-notifications`. This change makes
  the trigger exist; it sends nothing.
- **Bidding from the watched list.** It links to the lot.
- **Sharing, following a collector, or a public watch count.** A watch is
  private to the collector who made it, and a lot does not display how many
  people watch it.
- **Watching while signed out**, and migrating a browser-held watch into an
  account on sign-in.
- **Sorting, filtering, or searching the watched list** beyond most-recent
  first.

## Capabilities

### New Capabilities

- `grade10-auction/watchlist`: a signed-in collector marks an auction lot to
  come back to — what watching means, who can see it, what it does and does
  not confer, how the watched list is ordered, and what happens to a watch
  when its lot closes.

### Modified Capabilities

None. `ListingBidPanel` already exposes `watchAction` and `watching`, so the
shared UI contract does not change; see Impact.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | Owns the watch record: collector, listing, and Watched At. Shared across both brands, like the listings themselves. |
| `@grade10/auction-contracts` | Gains watch and unwatch actions, the viewer's watching state on authenticated listing facts, and a watched-lots read. Additive; nothing breaks. |
| `apps/frontend/grade10` | Fills `ListingBidPanel`'s existing `watchAction` slot and passes `watching`; adds a watch control to the catalogue tile and a watched-lots surface. |
| `apps/frontend/zzz` | Same, on the ZZZ auction surface. |
| `@grade10/ui` | **No export change.** `ListingBidPanel` already has `watchAction` and `watching`. The catalogue tile's control is application-owned until a second consumer needs it. |
| `@grade10/i18n` | Watch, unwatch, and watched-list copy for every locale the sites answer. |

**Ordering.** `add-auction-notifications` depends on this change; its §9.1 and
§9.2 mail cannot fire until a watch exists. Independent of
`add-auction-proxy-bidding`.

**On the removed wishlist.** `2026-08-19-remove-wishlist-control` removed the
store heart because no surface answered it. That reasoning is respected here:
this control is built with its surface and its persistence in the same change,
and the store heart stays removed.
