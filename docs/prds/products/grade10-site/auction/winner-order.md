---
title: Winner Order
spec: grade10-site/auction/winner-order
order: 11
---

Winner Order is the authenticated route where a collector settles one lot after it closes. It keeps the delivery choice, invoice, payment, receipt, shipment, and delivery evidence for that lot together.

- **Address first** — a closed lot opens asking for a delivery address; the winner confirms the account's saved or newly entered address before an operator prepares an invoice
- **Invoice** — one operator-quoted invoice per lot; shipping and insurance are priced for the confirmed address, the address locks when the invoice is sent, and the seven-day payment window starts at send
- 🚧 **Invoice lines** — Winning Bid, Buyer's Premium, Shipping & Handling, Insurance, Tax and Order Total; Shipping & Handling of zero reads Free, and Insurance appears only when the operator added it
- 🚧 **Buyer's premium** — 20% of the winning bid, or the currency's minimum charge when that is higher; a minimum of 0 means none
- **Address** — changeable by the winner until the invoice is sent; a later change is handled by Grade10 through an operator re-quote and reissue
- **Payment** — a fresh card payment, the only self-service method offered while the invoice is `pending`; a declined attempt leaves the invoice payable until the deadline
- 🚧 **After the deadline** — card Pay is hidden; the overdue alert carries Contact Us; an operator reissues, settles manually, or cancels
- 🚧 **Progress** — five presentation steps in order: Address → Invoice → Payment → Shipped → Completed; Cancelled and Refunded show no stepper. Order status keeps its eight names
- 🚧 **Invoice PDF** — once an invoice has been sent, the winner can view and download it; hidden before send and when Cancelled
- **Receipt** — the itemised amount and how it was paid: card brand and last four, or the method Grade10 recorded
- **Shipment** — carrier, tracking number, carrier link, fulfilment events, and delivery proof when available
- **Suspension** — the auction-only restriction and the amount still owed when the deadline has passed; paying after an operator restores a payable invoice does not restore bidding by itself
- **Notifications** — the post-close letters for this lot, with reminders ending when the order is no longer self-service payable
- **URL** — an authenticated auction-order address that identifies one order and never another collector's order
The account-wide address book belongs to [Account](/p/grade10-site/account). The account record shows the auction outcome and derived status; this page owns the invoice and settlement journey. The operator works exceptions from the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
The winner needs one place to understand what is owed and what happens next. The page is order-native rather than listing-native, so a collector who wins several lots receives one independent deadline, address snapshot, payment, and shipment for each.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | A lot has just closed | Confirms where to ship, waits for Grade10 to quote the delivery cost, and then sees the invoice and its payment deadline. |
| Winner | The first payment attempt fails before the deadline | Understands the refusal and can retry while the invoice remains `pending`. |
| Winner | The card has been dispatched | Finds the receipt, tracker, fulfilment trail, and delivery proof later. |
| Suspended winner | The payment deadline passed | Sees what remains owed, why bidding stopped, and Contact Us — not a card Pay control. |

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Line names | Decided | Hammer price reads Winning Bid, Shipping reads Shipping & Handling, and Final amount reads Order Total, for the winner and the operator. | Product |
| Insurance | Decided | Optional per invoice; when added it is more than zero. An invoice without it shows no Insurance line. | Product |
| Free shipping | Decided | Shipping & Handling of zero reads Free rather than hiding the line. | Product |
| Deadline ends self-service Pay | Decided | When the invoice is `expired`, Winner Order hides card Pay and shows Contact Us in the overdue alert. A deadline that still allowed card pay would not be a deadline. Operator reissue, manual settlement, or cancel remain. | Product (@tangconst) |
| Progress stepper | Decided | Five presentation steps: Address → Invoice → Payment → Shipped → Completed. Status vocabulary stays eight values; Processing maps under Shipped; Delivered maps to Completed. | Product and design (@tangconst) |
| Invoice PDF | Decided | After send, the winner may view and download the invoice PDF on Winner Order until Cancelled. | Product (@tangconst) |
| Buyer’s Premium rate | ❓ Deferred | The line exists; the rate is not fixed on this page. | Product / finance |
| Buyer's premium | Decided | 20% of the winning bid alone, rounded half up, or the lot currency's minimum charge when higher. Grade10 computes it; no operator enters, waives or changes it. | Product and finance |
| Premium minimum | Decided | One Grade10-owned amount per currency, changed by engineering on request. 0 means no minimum. A new value applies to invoices sent or reissued after it. | Product and finance |
| Minimum values | ❓ Open | Launch at 0 in USD, HKD and JPY until the real amounts are set. | Product and finance |

**Not in scope.** Combined invoices, payment plans, partial settlement, buyer-initiated returns, or changes to the bid-time auction rules.

:::
