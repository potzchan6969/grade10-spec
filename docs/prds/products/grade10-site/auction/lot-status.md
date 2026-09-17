---
title: Lot Status
spec: grade10-site/auction/lot-status
order: 14
---

## External Lot Status

🚧 Every lot on the auction site shows one external lot status. It describes
the lot only, not the collector's bid or order.

| External lot status | Meaning |
| --- | --- |
| 🚧 **Upcoming** | Published. Bidding has not started |
| 🚧 **Active** | Bidding is open, including extended bidding |
| 🚧 **Ended** | Bidding is over, with or without a winner |

- 🚧 **Worked out, not saved** — the external lot status comes from the lot's
  internal status and times, so the two always agree
- 🚧 **Winner's order** — shown separately; Ended describes the lot, not the
  order
- 🚧 **Display** — the designer decides which pages show the status, and how

## Status Mapping

🚧 Each internal lot status maps to one external lot status, or is hidden from
collectors.

| Internal lot status | External lot status |
| --- | --- |
| Draft | **Hidden** |
| Scheduled | **Upcoming** |
| Live | **Active** |
| Unsold | **Ended** |
| Called off | **Hidden** |
| Awaiting Address | **Ended** |
| Preparing Invoice | **Ended** |
| Pending Payment | **Ended** |
| Processing | **Ended** |
| Shipped | **Ended** |
| Delivered | **Ended** |
| Cancelled | **Ended** |
| Refunded | **Ended** |

## Hidden Lots

🚧 Collectors never see a lot with one of these internal lot statuses:

- 🚧 **Draft** — never published
- 🚧 **Called off** — withdrawn before a sale

A hidden lot is left out of every collector page:

- 🚧 **Catalogue** — not listed, and search does not find it
- 🚧 **Lot page** — its address shows the Page not found screen
- 🚧 **Watchlist** — removed from the list
- 🚧 **My Auctions** — not shown, except to a collector who bid on a called-off
  lot, who still sees it with the note that their card hold was released

:::detail{title="Product decisions" for="pm"}
Collector pages use seven different labels for three lot statuses, and the
internal lot status changes often for operator needs. The external lot status
gives collectors three stable statuses, and hides draft and called-off lots.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Browsing or watching lots | Sees at a glance whether a lot can still be bid on |
| Bidder | Bid on a lot that was called off | Still sees the lot, and that their card hold was released |

**Not in scope.** The internal lot status. The winner's order status. How pages
show the external lot status. The Active and Completed filters in bidding
history.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Status labels | Number of different lot status labels on collector pages. 7 before, 3 after | Design |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Three statuses | Decided | Upcoming, Active, Ended | Product |
| Extended bidding | Decided | Shown as Active. The "Extended bidding: ON" label appears only in the operator queue | Product |
| Draft | Decided | Has no external lot status. Never shown | Product |
| Unsold | Decided | Shown as Ended | Product |
| Called off | Decided | Hidden on every collector page. The lot's address shows Page not found | Product |
| Bidder exception | Decided | A collector who bid on a called-off lot still sees it in My Auctions, with the card hold note | Product |
| Winner's order | Decided | Shown separately. Ended describes the lot, not the order | Product |
| Display | Decided | The designer decides where and how pages show the status | Design |
:::
