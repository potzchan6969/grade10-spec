---
title: Winner Order
spec: grade10-site/auction/winner-order
order: 11
---

Winner Order is the authenticated route where a collector settles one lot after it closes. It keeps the delivery choice, invoice, payment, receipt, shipment, and delivery evidence for that lot together.

- **Address first** — a closed lot opens asking for a delivery address; the winner confirms the account's saved or newly entered address before an operator prepares an invoice
- **Invoice** — one operator-quoted invoice per lot; shipping and insurance are priced for the confirmed address, the address locks when the invoice is sent, and the seven-day payment window starts at send
- **Address** — changeable by the winner until the invoice is sent; a later change is handled by Grade10 through an operator re-quote and reissue
- **Payment** — a fresh card payment, the only self-service method offered; a declined attempt leaves the invoice payable, before or after its deadline
- **Receipt** — the itemised amount and how it was paid: card brand and last four, or the method Grade10 recorded
- **Shipment** — carrier, tracking number, carrier link, fulfilment events, and delivery proof when available
- **Suspension** — the auction-only restriction and the amount still owed when the deadline has passed; paying the order does not restore bidding
- **Notifications** — the post-close letters for this lot, with reminders ending when the order is no longer payable
- **URL** — an authenticated auction-order address that identifies one order and never another collector's order
The account-wide address book belongs to [Account](/p/grade10-site/account). The account record shows the auction outcome and derived status; this page owns the invoice and settlement journey. The operator works exceptions from the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
The winner needs one place to understand what is owed and what happens next. The page is order-native rather than listing-native, so a collector who wins several lots receives one independent deadline, address snapshot, payment, and shipment for each.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | A lot has just closed | Confirms where to ship, waits for Grade10 to quote the delivery cost, and then sees the invoice and its payment deadline. |
| Winner | The first payment attempt fails | Understands the refusal and can retry while the invoice remains payable. |
| Winner | The card has been dispatched | Finds the receipt, tracker, fulfilment trail, and delivery proof later. |
| Suspended winner | The payment deadline passed | Sees what remains owed, why bidding stopped, and how to pay without a bid action. |

**Not in scope.** Combined invoices, payment plans, partial settlement, buyer-initiated returns, or changes to the bid-time auction rules.
:::
