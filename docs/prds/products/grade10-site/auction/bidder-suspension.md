---
title: Bidder Suspension
spec: grade10-site/auction/bidder-suspension
order: 13
---

Bidder Suspension is an auction-only restriction applied when a winner leaves an invoice unpaid past its deadline. It stops new auction commitments while leaving payment, the store, loyalty, and platform sign-in available.

- **Reason** — the expired auction order and the amount still owed
- **Won lots** — an already won lot stays won; its invoice remains payable through the order route
- **Payment** — the collector can pay what is owed, but payment and invoice reissue do not lift the restriction
- **Account record** — My Auctions explains the restriction beside the affected order and keeps the auction status distinct from a platform account ban
- **Reinstatement** — an operator confirms the action from the post-sale workflow; it is not automatic

## Standing Bids

- 🚧 **Standing bids** — a maximum set before the suspension stays in force: it keeps bidding up to its cap and can still win the lot; the collector cannot place a new bid or raise it
- 🚧 **Bid history** — suspension adds, edits and removes nothing in any lot's bid history

The buyer-facing explanation lives in [Winner Order](/p/grade10-site/auction/winner-order). The operator's reinstatement control and reason trail live in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
The restriction protects future auction commitments without turning a missed deadline into a platform-wide ban. A collector still has a clear path to pay, while only an operator can decide that the account may bid again.

A suspension looks forward only. A maximum is a binding bid, and other bidders have already bid against it, so withdrawing it would move prices and leaders on lots the missed payment has nothing to do with. Grade10 accepts that a suspended account can win more lots through bids it placed before the suspension. Each lot won that way gets its own invoice and deadline.
:::
