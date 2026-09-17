---
title: Watchlist
spec: grade10-site/auction/watchlist
order: 28
reviewed: 2026-09-17
---

A watch is one action on a lot that says come back to this, and it costs
nothing: no money is held, no standing in the sale is gained, and the sale
never changes because somebody watches.

## Values

| Rule | Value |
| --- | --- |
| Watch limit | ❓ A maximum number of watches per collector, bids counted; Design sets the value — [My Auctions](/p/grade10-site/auction/account-record) |
| Email alerts | On for a lot when it is watched, off when it is unwatched — [Bidding Notifications](/p/grade10-site/auction/notifications) |

## Words

| Word | Meaning |
| --- | --- |
| **Watch**, **Watching** | The lot is on the collector's list |
| **Email alerts** | The per-lot mail preference, apart from the watch; muting leaves the watch and any bid intact |
| **Unwatch** | Leaves the list and turns email alerts off |

## Watching

- **Signed in** — watching takes a signed-in collector; a signed-out viewer
  is offered sign-in rather than a watch the browser would forget
- **Follows the collector** — a watch follows them across devices, and
  watching the same lot twice leaves one watch with its original date
- **Both brands** — a lot accepts watches from collectors of either brand,
  and each sees only their own
- **From where the lot is shown** — the lot page while the lot is open and
  the collector has no bid on it, the catalogue, and the watched list; a bid
  keeps the lot watched until it closes — [Auction Details ·
  Watching](/p/grade10-site/auction/listing-page#watching)
- **Undo** — unwatching can be undone at once, without finding the lot again
- **After the close** — unwatching still works after a close or a call-off

## The Watched List

- **Where** — watched lots read on [My
  Auctions](/p/grade10-site/auction/account-record), each entry leading to
  its lot, most recently watched first among the watch-only rows
- **An entry** — the lot, its current bid, its close, and whether its sale is
  open or closed
- **After the close** — the entry stays until its owner unwatches it
- 🚧 **Called off** — a called-off lot leaves the watched list rather than
  staying on it — [Lot Status](/p/grade10-site/auction/lot-status)
- **Nothing watched** — the collector is told so, rather than shown an error
  or an empty page

## Visibility

- **Owner only** — no public fact carries a watch count or a watcher's
  identity, and one collector never learns what another watches
- **Operators** — see how many collectors watch a lot, counted across both
  brands and never a name; a watch is not a commitment to buy — [Listing
  Management](/p/grade10-admin/auction/listing)

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
| Survives close | Decided | A closed lot stays in the list until the collector unwatches. | Product |
| Called-off leaves the list | 🚧 In flight | A called-off lot is hidden, so it leaves the watched list instead of surviving on it — [Lot Status](/p/grade10-site/auction/lot-status). Supersedes "Survives close" for called-off lots, and the watchlist delta's own "shown as called off" row. | Product |
| Unwatch surfaces | Decided | Listing page, catalogue tile, and watched list. Email mute → My Auctions for that lot's alerts; it does not unwatch. | Product |
| Store heart | Decided | Not restored. This control exists because a list answers it. | Product |
| List placement | Decided | My Auctions in the account area, one table with bid rows first. Per-row Email alerts + Unwatch. Entrance copy names lots / auction. No header-only destination. | Design |
| Bidding above Watching | Decided | A lot holding the collector's money outranks one they are only following, so bid rows lead the table. | Design |
| Operator count placement | Decided | A Watchers column on the admin Listings table, so an operator compares lots at a glance. | Design |
:::
