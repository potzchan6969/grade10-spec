---
title: Bid Card and Holds
spec: grade10-site/auction/bid-payment-method
order: 25
---

## Values

| Rule | Value |
| --- | --- |
| Bid-time hold | **Off** by default — [Bidding Rules](/p/grade10-site/auction/auction) |
| Holds per bidder per listing | **1**, covering the committed maximum |
| Hold window | 🚧 At least **14 days** after the scheduled close where the provider offers it; a shorter window is never shown as 14 days |
| Buyer's premium on the panel | **20%** of the winning bid, the rate only, in every currency; the amount first appears on the invoice — [Winner Order](/p/grade10-site/auction/winner-order) |

## The Linked Card

- **Linked once** — on [Bid Panel
  Enrollment](/p/grade10-site/auction/bid-panel-enrollment), and carried to
  new lots; card number, expiry and code never reach Grade10
- **Locked by the first bid** — Change stays until the first bid on the lot is
  accepted; later raises keep that card

## Holds

When holds are on, committing a maximum authorizes the linked card in the
background, and the bid stands only once the authorization is confirmed.

:::flow{title="A hold on a maximum"}
## *Collector* — **Commits a maximum**
No confirmation and no payment modal.
## *Grade10* — **Authorizes the card**
One manual-capture authorization for the whole maximum; a raise updates that
same authorization, so a bank statement carries one pending amount per
listing.
## *Provider* — **Confirms or refuses**
A pending outcome or a bank challenge shows on the bid surface until it
resolves.
## *Grade10* — **Accepts the bid**
Only once confirmed; a repeated request or a repeated provider outcome never
makes a second hold, bid or charge.
## *Grade10* — **Releases the hold**
When the bidder is outbid, and at the close for everyone who did not win.
:::

- 🚧 **A raise keeps its reference** — a supported raise uses the existing
  authorization and provider reference; nothing is cancelled and recreated
- 🚧 **A refused raise** — a raise the provider declines or cannot make
  settles at once with the card message; the prior maximum stands, and a
  later bid is not blocked by it
- **Provider record** — every authorization keeps its provider payment
  reference

## Refusals

| Cause | What the collector sees |
| --- | --- |
| No linked card | Refused before any authorization |
| Decline, an unusable card, or an expired hold | **Your card could not be authorized. Try another card.** on or near the bid action |
| Provider failure | **Your bid did not go through. The card was not authorized.** |
| A failed raise | The same message; the prior maximum stays in place |
| Pending, or a bank challenge | Busy, or the provider's challenge, on the bid surface |

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
| Hold window | 🚧 In flight | A hold asks the provider for an authorization window of at least 14 days past the scheduled close, and a raise increments the same authorization rather than replacing it. | Product and finance |
:::
