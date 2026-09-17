---
title: Lot Status
spec: grade10-site/auction/lot-status
order: 14
---

## External Lot Status

🚧 Every lot a collector can see shows one external lot status. It describes
the lot only, never the collector's bid or order, and every page reads the
same value because it travels with the listing data.

| External lot status | Meaning |
| --- | --- |
| **Upcoming** | Published; bidding has not started |
| **Active** | Bidding is open, extended bidding included |
| **Ended** | Bidding is over, with or without a winner, whatever the state of the winner's order |

## Status Mapping

🚧 Each internal lot status reads as one external lot status, or the lot is
hidden. The external status is worked out from the internal status and the
lot's times, so the two always agree.

| Internal lot status | Collectors see |
| --- | --- |
| Draft | Hidden |
| Scheduled | **Upcoming** |
| Live | **Active** |
| Unsold | **Ended** |
| Called off | Hidden |
| Awaiting Address · Preparing Invoice · Pending Payment · Processing · Shipped · Delivered · Cancelled · Refunded | **Ended** |

## Hidden Lots

🚧 A Draft lot was never published and a Called off lot was withdrawn before a
sale. Collectors never see either:

| Surface | What a collector sees |
| --- | --- |
| Catalogue | The lot is not listed; search and filters never return it |
| Lot page | Page not found, even at an address the lot once answered from |
| Watchlist | The lot leaves the list |
| My Auctions | Not shown — except to a collector who bid on a called-off lot, who still sees it; when that bid held a card authorization, the row says the hold was released |

:::detail{title="Product decisions" for="pm"}
Collectors read three lot statuses wherever a lot is shown, and never see a
draft or called-off lot. The internal lot status changes for operator needs;
the external one does not.

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
| Status labels | Distinct lot status labels on collector pages: three, one per external status | Design |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Three statuses | Decided | Upcoming, Active, Ended | Product |
| Extended bidding | Decided | Shown as Active. The "Extended bidding: ON" label appears only in the operator queue | Product |
| Draft | Decided | Has no external lot status. Never shown | Product |
| Unsold | Decided | Shown as Ended | Product |
| Called off | Decided | Hidden on every collector page. The lot's address shows Page not found | Product |
| Bidder exception | Decided | A collector who bid on a called-off lot still sees it in My Auctions, with the card hold note when the bid held one | Product |
| Winner's order | Decided | Shown separately. Ended describes the lot, not the order | Product |
| Display | Decided | The designer decides where and how pages show the status | Design |
:::
