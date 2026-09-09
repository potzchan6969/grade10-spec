---
title: Watchlist
spec: grade10-site/auction/watchlist
order: 7
---

A watch is one action on a lot that says "come back to this" and costs
nothing: no money is held, no standing in the sale is gained, and the sale
never changes because somebody watches. Bidding is the other way to register
interest, and that one holds money on a card — watching is the saved list for
everyone still deciding. Email alerts for a lot are a separate preference;
[notifications](/products/grade10-site/auction/notifications) owns when mail
fires.

## Vocabulary

| Concept | Preferred | Avoid |
| --- | --- | --- |
| List membership | **Watch** / **Watching** / **Unwatch** / on Watching | Wishlist, follow, subscribe (for the list) |
| Email preference | **Email alerts** / mute email alerts / alerts on or off | Using **Unwatch** or **Stop watching** to mean mute |
| Combined remove | **Unwatch** — removes from Watching and turns email alerts off | Implying unwatch is mail-only |

## Watching

Watching takes a signed-in collector; a signed-out viewer is offered sign-in
rather than a watch the browser would forget. A watch follows the collector
across devices, and watching the same lot twice leaves one watch with its
original date. Watching turns email alerts on for that lot by default;
unwatching turns them off. Both brands sell the same lots, so a lot accepts
watches from collectors of either brand — each collector sees only their own.

## Watched list

The lots a collector watches read most recently watched first, and each entry
carries enough to act on: the lot, its current bid, its close, whether the
sale is open, closed, or called off, and an **Email alerts** control beside
**Unwatch**. Lots the collector is bidding on read above the ones they are
only watching. Turning a lot's alerts off is confirmed on screen and says
what it left alone — the watch, or the bid. A close or a call-off never
removes a watch — the entry stays,
honestly labelled, until its owner unwatches it. Mute leaves the lot on
Watching. A collector watching nothing is told so rather than shown an error
or an empty page. Unwatch is available on the listing page, the catalogue, and
this list — email mute links to signed-in My Auctions; it is not the only way
out.

## Visibility

Only its owner. No public fact carries a watch count or a watcher's identity,
and one collector never learns what another watches. The one other reader is
an operator judging interest: they see how many collectors watch a lot,
counted across both brands, and never a name — a watch is not a commitment to
buy.

:::detail{title="Product decisions" for="pm"}
Bidding is the only other way to register interest in a lot, and a bid holds
money, so a collector still deciding either commits early or finds the lot
again by memory against a moving close. A watch is the cheap, private mark
that closes that gap. Mail is not the definition of watch — alerts are a
preference on the lot. The control, its persistence and its list land
together, so the empty heart the store wishlist once shipped is never
repeated.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Signed-in collector | Found a lot, not ready to bid | Marks it, leaves, returns from their list. |
| Signed-in collector | Wants the list without the inbox | Mutes email alerts; lot stays on Watching. |
| Signed-out viewer | Tries to watch | Is offered sign-in, not a local watch that will vanish. |
| Auction operator | Judging interest in a lot | Sees how many collectors watch it, across both brands, not as expected bidders. |

**Not in scope.** Watching store products — the wishlist heart stays removed.
Sending mail or owning mute fanout — that is notifications. Bidding from the
watched list; the list links to the lot. Sharing, following a collector, or a
public watch count. Watching while signed out, and migrating a browser-held
watch on sign-in. Sorting, filtering, or searching the watched list beyond
most-recent first.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Watchers | Share of signed-in collectors who watch at least one lot. | Product |
| Watch-to-bid | Share of watched lots their watcher later bids on. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Watch ≠ email alerts | Decided | Watch is list membership. Email alerts are a separate per-lot preference; watching defaults alerts on; unwatch turns them off. | Product |
| Privacy | Decided | A watch is visible only to the collector who made it. No public count. | Product |
| No standing | Decided | Watching does not bid, reserve, or change the sale. | Product |
| Sign-in | Decided | Signed-out viewers are offered sign-in. Nothing is stored in the browser. | Product |
| Survives close | Decided | A closed or called-off lot stays in the list until the collector unwatches. | Product |
| Unwatch surfaces | Decided | Listing page, catalogue tile, and watched list. Email mute → My Auctions for that lot's alerts; it does not unwatch. | Product |
| Store heart | Decided | Not restored. This control exists because a list answers it. | Product |
| List placement | Decided | My Auctions in the account area — Bidding then Watching as sections on one page (Order History shell). Per-row Email alerts + Unwatch. Entrance copy names lots / auction. No header-only destination. | Design |
| Bidding above Watching | Decided | A lot holding the collector's money outranks one they are only following, so Bidding leads the page. | Design |
| Operator count placement | ❓ Open | Listings table vs listing admin page. | Design |

**Risks.** Stopping auto-watch on bid would drop bidders from watcher-only
lanes; bidder mail stays on bids with its own alerts preference. Watching is
independent of auto bidding.
:::
