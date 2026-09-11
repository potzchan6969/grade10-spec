---
title: Lot Status
spec: grade10-site/auction/lot-status
order: 15
---

🚧 A collector reads every auction lot as one of three statuses. The status
describes the lot, not the collector's bid or order, and a screen may show it or not.

| Status | The lot |
| --- | --- |
| 🚧 Upcoming | Published, bidding not open yet |
| 🚧 Active | Bidding open, extended bidding included |
| 🚧 Ended | Bidding over, with a winner, whatever the state of the winner's order |

## Hidden Lots

🚧 A lot that never opened, ended unsold, or was called off appears nowhere a
collector looks: not in the catalogue, not at its own address, not on the
watched list. The one exception is a collector who bid on a called-off lot —
they still read it in My Auctions, with what happened to their card hold.

:::detail{title="Product decisions" for="pm"}
The site describes one lot with seven status labels across its screens, and the
operator's outcome list moves for operator reasons. Collectors get three statuses
that do not move, and lots that cannot sell stay out of their way.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector | Browsing or watching lots | Tells at a glance whether a lot can still be bid on. |
| Bidder | Bid on a lot that was called off | Still sees it, and that their card hold was released. |

**Not in scope.** The operator's outcome list. A winner's order status. How any
screen shows the status. Bidding history's Active and Completed filters.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Status labels | Distinct lot-status labels on collector surfaces. Seven before, three after. | Design |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Three statuses | Decided | Upcoming, Active, Ended. | Product |
| Extended bidding | Decided | Active. The operator's "Extended bidding: ON" label stays on the queue. | Product |
| Draft | Decided | No status. Never shown. | Product |
| Unsold and Called off | Decided | Hidden from every collector surface; the address answers not found. | Product |
| Bidder exception | Decided | A bidder still reads a called-off lot in My Auctions, with their card hold. | Product |
| Winner's order | Decided | Stays a separate fact. Ended describes the lot. | Product |
| Display | Decided | Design decides whether and where each screen shows the status. | Design |
:::
