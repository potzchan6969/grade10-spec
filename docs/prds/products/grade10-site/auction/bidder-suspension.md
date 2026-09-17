---
title: Bidder Suspension
spec: grade10-site/auction/bidder-suspension
order: 35
---

A suspension is an auction-only restriction: it stops new auction commitments
and nothing else. It starts when any one of the winner's invoices goes unpaid
past its deadline, whatever they have paid on other lots.

## What It Stops

| While suspended | Allowed |
| --- | --- |
| Place a new bid | No |
| Raise a standing maximum | 🚧 No |
| Standing maxima on open lots | 🚧 Keep bidding to their cap, and can win |
| Pay what is owed | Yes |
| Store, loyalty and sign-in | Yes |
| Read the account and its orders | Yes |

- **Told at once** — the notice names what is owed and how to resolve it, so
  a suspension is never discovered by being refused
- **Won lots** — an already won lot stays won; its invoice remains payable
  through the order
- **Payment lifts nothing** — paying, and an invoice reissue, leave the
  restriction in place; only an operator's reinstatement lifts it
- **Account record** — My Auctions explains the restriction beside the
  affected order, apart from any platform account ban

## Operator Suspension

- 🚧 **Where** — an operator suspends or reinstates an account from its panel
  on the admin Users page
- 🚧 **Reason** — required; operators read it on the account record, and the
  collector never sees it
- 🚧 **Notice** — the collector is told they can no longer bid and how to
  contact Grade10
- 🚧 **One suspension** — an operator suspension and a missed deadline are the
  same restriction with different causes; a new cause while suspended is
  recorded beside the first, and reinstating lifts every cause

## Standing Bids

- 🚧 **Standing bids** — a maximum set before the suspension keeps bidding up
  to its cap and can still win the lot, which gets its own order, invoice
  and deadline; no lot's price or leader changes because of the suspension
- 🚧 **Bid history** — suspension adds, edits and removes nothing in any lot's
  bid history

The buyer-facing explanation lives in [Winner
Order](/p/grade10-site/auction/winner-order). The operator's reinstatement
control and reason trail live in the [Post-Sale
Queue](/p/grade10-admin/auction/post-sale).

::cases{id="grade10-site/auction/bidder-suspension"}

:::detail{title="Code map" for="engineer"}
- **Grant** — `auction:moderate`, the one grant that suspends and reinstates,
  in the auction service and on the admin Users panel
:::

:::detail{title="Product decisions" for="pm"}
The restriction protects future auction commitments without turning a missed
deadline into a platform-wide ban. A collector still has a clear path to pay,
while only an operator can decide that the account may bid again.

A suspension looks forward only. A maximum is a binding bid, and other bidders
have already bid against it, so withdrawing it would move prices and leaders
on lots the missed payment has nothing to do with. Grade10 accepts that a
suspended account can win more lots through bids it placed before the
suspension. Each lot won that way gets its own invoice and deadline.

An operator can suspend for reasons that have nothing to do with an unpaid
order — fraud, abuse, a dispute. The same grant that stops a bidder in the
auction service stops one here, so there is one grant and one switch. The
collector's notice leaves out the operator's reason because the reason is
written for colleagues, not for the person it concerns.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Bidders ban and suspension | ❓ Open | Whether the auction admin's Bidders ban is this same suspension. | Engineering |
:::
