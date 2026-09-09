---
title: Bidder Suspension
spec: grade10-site/auction/bidder-suspension
order: 13
---

Bidder Suspension is an auction-only restriction applied when a winner leaves an invoice unpaid past its deadline. It stops new auction commitments while leaving payment, the store, loyalty, and platform sign-in available.

- **Reason** — the expired auction order and the amount still owed
- **Standing bids** — open-lot maxima are retracted atomically and each affected lot resolves again at the next bidder's own price
- **Won lots** — an already won lot stays won; its invoice remains payable through the order route
- **Payment** — the collector can pay what is owed, but payment and invoice reissue do not lift the restriction
- **Account record** — My Auctions explains the restriction beside the affected order and keeps the auction status distinct from a platform account ban
- **Reinstatement** — an operator confirms the action from the post-sale workflow; it is not automatic

The buyer-facing explanation lives in [Winner Order](/p/grade10-site/auction/winner-order). The operator's reinstatement control and reason trail live in the [Post-Sale Queue](/p/grade10-admin/auction/post-sale).

:::detail{title="Product decisions" for="pm"}
The restriction protects future auction commitments without turning a missed deadline into a platform-wide ban. A collector still has a clear path to pay, while only an operator can decide that the account may bid again.
:::
