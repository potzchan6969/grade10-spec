---
title: Bid Card and Holds
spec: grade10-site/auction/bid-payment-method
order: 25
---

## Values

| Rule | Value |
| --- | --- |
| Bid-time hold | **Off** by default; optional |
| Holds per bidder per listing | **1**, covering the committed maximum |
| Buyer's premium on the panel | **20%** of the winning bid, the rate only |

## The Linked Card

- **Linked once** — linking lives on [Bid Panel
  Enrollment](/p/grade10-site/auction/bid-panel-enrollment); a linked card
  carries over to new lots
- **Change until the first bid** — Change stays enabled until the first bid on
  that lot is accepted; afterwards the lot locks the card for later raises
- **Same card on raises** — later bids on the listing keep the committed card

## Holds

When holds are enabled, committing a maximum authorizes the linked card in the
background, and the bid stands only once the authorization is confirmed.

- **Silent on commit** — no confirmation and no payment-method modal
- **One hold, the maximum** — exactly one manual-capture authorization covers
  the submitted maximum; a raise updates that same authorization rather than
  stacking a second, so a bank statement carries one pending amount per
  listing
- **Outbid releases** — being outbid cancels the authorization without capture
- **Provider record** — every authorization keeps its provider payment
  reference

## Refusals

| Outcome | What the collector sees |
| --- | --- |
| Decline or unusable card | Refusal copy on or near the bid action, before the bid stands |
| Provider failure | Distinct network or provider failure copy |
| Failed raise | The same refusal copy; the prior maximum stays in place |
| Pending or a bank challenge | Busy, or the provider's challenge, on the bid surface |

## Premium Disclosure

The bid panel shows the buyer's premium as **20%** of the winning bid, the
rate only; the calculated amount first appears on the invoice — [Winner
Order](/p/grade10-site/auction/winner-order).

::story{id="auction-listing-bid-panel--payment-authorization" title="Payment authorization"}

::story{id="auction-listing-bid-panel-dialogs--payment-authorization-pending" title="Payment authorization pending"}

::story{id="auction-listing-bid-panel-dialogs--payment-authorization-refused" title="Payment authorization refused"}

::cases{id="grade10-site/auction/bid-payment-method"}

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

**Not in scope.** Card linking and age attestation, which belong to [Bid Panel Enrollment](/p/grade10-site/auction/bid-panel-enrollment). Capturing a hold before the collector wins. A general account payment manager.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Hold on commit | Decided | When holds are enabled, authorize the linked card when the collector commits a maximum; do not reopen payment setup or ask for a separate confirmation. | Product |
| Change timing | Decided | Keep Change enabled until the first bid on the lot is accepted, then lock the method for later raises. | Product |
| One active hold | Decided | When holds are enabled, maintain one manual-capture authorization per bidder and listing and update it when the maximum rises. | Product |
:::
