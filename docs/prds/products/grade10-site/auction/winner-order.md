---
title: Winner Order
spec: grade10-site/auction/winner-order
order: 11
---

Winner Order is the authenticated route where a collector settles one lot after it closes. It keeps the invoice, delivery choice, payment, receipt, shipment, and delivery evidence for that lot together.

- 🚧 **Address first** — a closed lot asks the winner where to ship; there is nothing to pay until Grade10 sends the invoice
- 🚧 **Invoice** — sent by Grade10 once the address is confirmed: the winning amount, buyer's premium, shipping and insurance quoted for that address, tax when supplied, and a payment deadline 7 days from sending
- 🚧 **Address** — the account's saved addresses and the selected delivery snapshot; changeable until the invoice is sent, then locked, with a later change going through Grade10
- 🚧 **Payment** — a fresh card payment, the only method offered; a declined attempt leaves the invoice payable, before or after its deadline
- 🚧 **Receipt** — the itemised amount and how it was paid: card brand and last four, or the method Grade10 recorded
- **Shipment** — carrier, tracking number, carrier link, fulfilment events, and delivery proof when available
- **Suspension** — the auction-only restriction and the amount still owed when the deadline has passed; paying the order does not restore bidding
- **Notifications** — the post-close letters for this lot, with reminders ending when the order is no longer payable
- **URL** — an authenticated auction-order address that identifies one order and never another collector's order
The account-wide address book belongs to [Account](/p/grade10-site/account). The account record shows the auction outcome and derived status; this page owns the invoice and settlement journey. The operator works exceptions from the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
The winner needs one place to understand what is owed and what happens next. The page is order-native rather than listing-native, so a collector who wins several lots receives one independent deadline, address snapshot, payment, and shipment for each.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Winner | A lot has just closed | 🚧 Is asked where to ship, then receives an invoice priced for that address, without waiting for an operator to call. |
| Winner | The first payment attempt fails | Understands the refusal and can retry while the invoice remains payable. |
| Winner | The card has been dispatched | Finds the receipt, tracker, fulfilment trail, and delivery proof later. |
| Suspended winner | The payment deadline passed | Sees what remains owed, why bidding stopped, and how to pay without a bid action. |

**Not in scope.** Combined invoices, payment plans, partial settlement, buyer-initiated returns, or changes to the bid-time auction rules.
:::
