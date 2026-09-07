---
title: Watchlist
spec: grade10-site/auction/watchlist
order: 7
---

A watch is one action on a lot that says "tell me about this" and costs
nothing: no money is held, no standing in the sale is gained, and the sale
never changes because somebody watches. Bidding is the other way to register
interest, and that one holds money on a card — watching is the signal for
everyone still deciding, and it is what the auction's mail fires on.

## Watching

Watching takes a signed-in collector; a signed-out viewer is offered sign-in
rather than a watch the browser would forget. A watch follows the collector
across devices, and watching the same lot twice leaves one watch with its
original date. Both brands sell the same lots, so a lot accepts watches from
collectors of either brand — each collector sees only their own.

## Watched list

The lots a collector watches read most recently watched first, and each entry
carries enough to act on: the lot, its current bid, its close, and whether the
sale is open, closed, or called off. A close or a call-off never removes a
watch — the entry stays, honestly labelled, until its owner unwatches it. A
collector watching nothing is told so rather than shown an error or an empty
page.

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
that closes that gap, and the trigger auction mail fires on. The control, its
persistence and its list land together, so the empty heart the store wishlist
once shipped is never repeated.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Signed-in collector | Found a lot, not ready to bid | Marks it, leaves, returns from their list. |
| Signed-out viewer | Tries to watch | Is offered sign-in, not a local watch that will vanish. |
| Auction operator | Judging interest in a lot | Sees how many collectors watch it, across both brands, not as expected bidders. |

**Not in scope.** Watching store products — the wishlist heart stays removed.
Notifying anyone; mail is its own capability, this one makes the trigger
exist. Bidding from the watched list; the list links to the lot. Sharing,
following a collector, or a public watch count. Watching while signed out,
and migrating a browser-held watch on sign-in. Sorting, filtering, or
searching the watched list beyond most-recent first.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Watchers | Share of signed-in collectors who watch at least one lot. | Product |
| Watch-to-bid | Share of watched lots their watcher later bids on. | Product |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Privacy | Decided | A watch is visible only to the collector who made it. No public count. | Product |
| No standing | Decided | Watching does not bid, reserve, or change the sale. | Product |
| Sign-in | Decided | Signed-out viewers are offered sign-in. Nothing is stored in the browser. | Product |
| Survives close | Decided | A closed or called-off lot stays in the list until the collector unwatches. | Product |
| Store heart | Decided | Not restored. This control exists because a list and later mail answer it. | Product |
| List placement | ❓ Open | Header vs account area. Placement, not behaviour. | Design |
| Operator count placement | ❓ Open | Listings table vs listing admin page. | Design |

**Risks.** Stopping auto-watch on bid would drop bidders from watcher mail;
bidder mail stays on bids. Watching is independent of auto bidding and a
prerequisite for auction mail.
:::
