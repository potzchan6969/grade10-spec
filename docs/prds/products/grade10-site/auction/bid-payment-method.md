---
title: Payment Method
spec: grade10-site/auction/bid-payment-method
order: 5
---

Bid-time authorization is optional and disabled by default. Linking a card
lives on [Bid panel enrollment](/p/grade10-site/auction/bid-panel-enrollment).
When holds are enabled and the collector commits a maximum, Grade10 authorizes
a hold on that linked card in the background — no confirmation modal — and
binds the method to them and the listing so a raise does not ask again.

When holds are enabled, exactly one manual-capture authorization covers the
submitted maximum. Raising the maximum updates that same authorization rather
than stacking a second hold, so a bidder's bank statement carries one pending
amount per listing. A decline, unusable method, or provider failure surfaces on
or near the bid action before the bid stands; a failed raise leaves the prior
maximum in place. The linked card's Change action stays enabled until the first
bid on that lot is accepted; afterward the listing locks that method for later
raises.

::story{id="auction-listing-bid-panel--payment-authorization" title="Payment authorization"}

::story{id="auction-listing-bid-panel-dialogs--payment-authorization-pending" title="Payment authorization pending"}

::story{id="auction-listing-bid-panel-dialogs--payment-authorization-refused" title="Payment authorization refused"}

:::detail{title="Product decisions" for="pm"}
The card is linked before amount entry, but the hold waits for the collector's
maximum. This keeps a card carried from another lot reusable without making a
new lot feel like a second payment setup, while the first accepted bid fixes
the method for that lot.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Collector with a linked card | Commits a maximum on a live lot | Sees authorization start from the bid action without a separate confirmation modal. |
| Collector before the first accepted bid | Wants another card | Uses the enabled Change action on the bid panel. |
| Collector after the first accepted bid | Raises a maximum | Reuses the locked listing method without card selection. |

**Not in scope.** Card linking and age attestation, which belong to [Bid panel enrollment](/p/grade10-site/auction/bid-panel-enrollment). Capturing a hold before the collector wins. A general account payment manager.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Hold on commit | Decided | When holds are enabled, authorize the linked card when the collector commits a maximum; do not reopen payment setup or ask for a separate confirmation. | Product |
| Change timing | Decided | Keep Change enabled until the first bid on the lot is accepted, then lock the method for later raises. | Product |
| One active hold | Decided | When holds are enabled, maintain one manual-capture authorization per bidder and listing and update it when the maximum rises. | Product |
:::
