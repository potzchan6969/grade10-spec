# Grade10 Auction watchlist

## Summary

A collector who finds a lot they want and is not ready to bid needs a way to
mark it and come back, without holding money on a card and without telling
anyone else they are interested.

## Context

- Problem: bidding is the only way to register interest in a Grade10 lot, and
  a bid holds money, so a collector who is still deciding either commits
  early or navigates away and finds the lot again by memory. Lots close on a
  moving deadline.
- Evidence: `ListingBidPanel` already ships a `watchAction` slot and a
  `watching` flag with nothing filling them — the same dead end the removed
  store wishlist heart was. Unlike that heart, auction mail fires on
  watching, and a lot's close is a deadline worth being told about.
- Related: [Grade10 Auction](./auction.md), [Auction notifications](./notifications.md),
  OpenSpec change `add-auction-watchlist`. The store wishlist was removed in
  `2026-08-19-remove-wishlist-control`.

## Goals

- Let a signed-in collector mark a lot to come back to, from the lot and
  from the catalogue, and find it again from a list.
- Keep a watch private and worthless as a claim: it confers no standing and
  is invisible to other collectors.
- Build the control with its persistence and its list in the same change, so
  it does not repeat the empty-heart mistake.

## Non-goals

- Watching store products. The wishlist heart stays removed.
- Notifying anyone. Mail is a separate change; this one makes the trigger
  exist.
- Bidding from the watched list. The list links to the lot.
- Sharing, following a collector, or a public watch count.
- Watching while signed out, and migrating a browser-held watch on sign-in.
- Sorting, filtering, or searching the watched list beyond most-recent first.

## Users and jobs to be done

| User | Situation | Desired outcome |
| --- | --- | --- |
| Signed-in collector | Found a lot, not ready to bid | Marks it, leaves, returns from their list. |
| Signed-out viewer | Tries to watch | Is offered sign-in, not a local watch that will vanish. |
| Auction operator | Judging interest in a lot | Sees how many collectors watch it, across both brands, not as expected bidders. |

## Experience

### Primary flow

1. A signed-in collector watches a lot from the catalogue or the lot page.
2. The lot shows as watched wherever it is shown to them.
3. They open their watched list, most recently watched first, and return to
   a lot. A closed or called-off lot stays until they unwatch it.

## Requirements

Checkable requirements: `openspec/specs/grade10-auction/watchlist/spec.md`
(in flight as the `add-auction-watchlist` delta until archived).

## Consuming applications and integration

| Application | How it consumes this work | Compatibility consideration |
| --- | --- | --- |
| Grade10 auction service | Owns the watch record, shared across both brands like the listings. | Identity stays `(storefront, user id)`. |
| Grade10 storefront | Fills the existing bid-panel watch slot; adds a catalogue control and a watched-lots surface. | No new `@grade10/ui` export. |
| ZZZ storefront | Same, on the ZZZ auction surface. | Same shared listings, different collector. |
| Grade10 admin | Watch count on a lot, both brands. | Presented as watchers, not expected bidders. |

## Measurement

| Signal | Definition | Owner |
| --- | --- | --- |
| Watchers | Share of signed-in collectors who watch at least one lot. | Product |
| Watch-to-bid | Share of watched lots their watcher later bids on. | Product |

## Decisions and open questions

| Item | Status | Decision, assumption, or question | Owner |
| --- | --- | --- | --- |
| Privacy | Decided | A watch is visible only to the collector who made it. No public count. | Product |
| No standing | Decided | Watching does not bid, reserve, or change the sale. | Product |
| Sign-in | Decided | Signed-out viewers are offered sign-in. Nothing is stored in the browser. | Product |
| Survives close | Decided | A closed or called-off lot stays in the list until the collector unwatches. | Product |
| Store heart | Decided | Not restored. This control exists because a list and later mail answer it. | Product |
| List placement | Open | Header vs account area. Placement, not behaviour. | Design |
| Operator count placement | Open | Listings table vs listing admin page. | Design |

## Rollout and risks

- Shipping the control without the list would repeat the empty-heart
  mistake; they land together.
- Stopping auto-watch on bid would drop bidders from watcher mail; bidder
  mail stays on bids (`add-auction-notifications`).
- Independent of auto bidding. Prerequisite for auction mail.
