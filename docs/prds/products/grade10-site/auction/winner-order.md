---
title: Winner Order
spec: grade10-site/auction/winner-order
order: 11
---

Winner Order is the authenticated route where a collector settles one lot after it closes. It keeps the invoice, delivery choice, payment, receipt, shipment, and delivery evidence for that lot together.

- **Invoice** — the winning amount, buyer's premium, shipping, insurance, tax when supplied, estimate markers, and the fixed payment deadline
- **Address** — the account's saved addresses, the selected delivery snapshot, and the confirmation or amendment that makes the amount firm
- **Payment** — a fresh payment for the invoice, with a declined attempt left payable until the deadline
- **Receipt** — the itemised amount and whether settlement came through Stripe or manual collection
- **Shipment** — carrier, tracking number, carrier link, fulfilment events, and delivery proof when available
- **Suspension** — the auction-only restriction and the amount still owed when the deadline has passed; paying the order does not restore bidding
- **Notifications** — the post-close letters for this lot, with reminders ending when the order is no longer payable
- **URL** — an authenticated auction-order address that identifies one order and never another collector's order
- 🚧 **Address first** — a closed lot asks the winner where to ship; there is nothing to pay until Grade10 sends the invoice
- 🚧 **Invoice** — sent once the address is confirmed, with shipping and insurance quoted for that address and no estimates; sending opens the 7-day window
- 🚧 **Address** — changeable until the invoice is sent, then locked; a later change goes through Grade10
- 🚧 **Payment** — by card only
- 🚧 **Receipt** — says how it was paid: card brand and last four, or the method Grade10 recorded

The account-wide address book belongs to [Account](/p/grade10-site/account). The account record shows the auction outcome and derived status; this page owns the invoice and settlement journey. The operator works exceptions from the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
The winner needs one place to understand what is owed and what happens next. The page is order-native rather than listing-native, so a collector who wins several lots receives one independent deadline, address snapshot, payment, and shipment for each.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | A lot has just closed | Sees the invoice, delivery choice, and deadline without waiting for an operator. |
| Winner | The first payment attempt fails | Understands the refusal and can retry while the invoice remains payable. |
| Winner | The card has been dispatched | Finds the receipt, tracker, fulfilment trail, and delivery proof later. |
| Suspended winner | The payment deadline passed | Sees what remains owed, why bidding stopped, and how to pay without a bid action. |

**Not in scope.** Combined invoices, payment plans, partial settlement, buyer-initiated returns, or changes to the bid-time auction rules.
:::
