# A coupon is never locked — design

## Context

See `proposal.md` — Why. One constraint shapes everything below: **loyalty and
the store are separate databases behind a Cloudflare service binding.** A rule
that spans them cannot be one transaction, so the only safe shape is the one
where each side owns the facts it can see and writes its own compensation.

The store owns every fact this change turns on: which order claims a coupon
(`orders.loyalty_coupon_id`), whether that order can still take money
(`status`), whether its checkout can be killed (the payment provider), and what
code was minted for it (`orders.loyalty_coupon_code`). Loyalty owns one fact:
whether the coupon has been spent.

## Goals / Non-Goals

- **Goal** — a member is never refused their own coupon by a sale they walked
  away from. The only refusal left is an outage.
- **Goal** — one sale claims a coupon at a time, and the claim moves before the
  new one is asked for, so no window exists where two orders both hold it.
- **Non-goal** — stopping a counter cart that already carries the code from
  collecting. Shopify honours an applied discount whatever becomes of its node;
  what this change owes is to notice and say so.
- **Non-goal** — a schema change. The first draft of this design moved the
  claim out of `coupon_instances` into `coupon_usages`. It bought nothing: the
  guarded write on the instance row is the serialization point that
  `reverseRedemption` and `endMembership` already lock against, and expand /
  contract would have split the column drop across two releases.

## Decisions

- **The store supersedes; loyalty records.** The store gives back every claim
  its own orders hold on the coupon, then asks the programme to claim it.
  Alternative considered — loyalty transferring the claim and answering which
  order it displaced — rejected three times over: loyalty cannot see an order's
  status, so it would transfer off an order whose money is already moving; the
  order row does not exist yet when the claim is made (`promiseOrder` claims
  before it inserts), so a racer's row is invisible to the compensation; and a
  crash between the two databases would leave an order holding a released usage
  and a live code with no outbox row to retry from.

- **`reserved` stops meaning *locked* and starts meaning *claimed by*.** No
  column moves and no status is removed. What changes is who is allowed to take
  it: today only a settle or a day-old sweep, and after this change any claim
  the store has already cleared the way for.

- **The give-back is per order, in its own transaction, anchored by the
  outbox.** `dropOrderReward` and `enqueueCouponRelease` commit together — the
  shape `confirmTillSale` already uses — and `attemptOrderRelease` follows
  outside it, because a transaction must never wait on the shop.

- **A claim that cannot be cleared is refused.** A holder whose money is
  moving, a draft the provider will not kill, a code the shop will not
  deactivate. This is the PRD's *an earlier code stands*, and it is an outage
  rather than a rule.

- **Settlement is the backstop, because the deactivation is not a guarantee.**
  A POS cart that already carries the code collects with it. The paid sale's
  own evidence is the only fact both sides agree on, so a sale naming a reward
  code its order no longer claims is counted and reported with the order on it.

## The claim, step by step

`reserveRewardCoupon` (`services/orders/promise.ts`), before it asks the
programme for anything:

1. **Read the holders.** `listOrdersClaimingCoupon(userId, couponId)` — a
   sibling of `listOpenPromisedOrders`, filtered on `loyalty_coupon_id` across
   `BINDABLE_STATUSES` plus `paid`, `processing` and `refunded`.
2. **Refuse where the money is moving.** A holder in `paid`, `processing` or
   `refunded` refuses the claim: its capture may still be in flight, and taking
   the coupon would spend it twice.
3. **Kill what can be killed.** A web draft is retired at the provider; one
   that will not die refuses the claim. A counter sale keeps its cart.
4. **Deactivate the code.** Synchronously, before the claim commits; a shop
   that will not answer refuses the claim.
5. **Give the order back**, in one transaction: `dropOrderReward`,
   `enqueueCouponRelease`. Then `attemptOrderRelease` outside it, which settles
   the usage and leaves the outbox to retry what it missed. A web draft is then
   cancelled.
6. **Claim it.** `coupons.reserve` as today.

Every prefix of that is a safe state. A crash before 5 leaves the order
claiming, which the next claim clears. A crash after 5 leaves the order given
back, which is what the rule says anyway. A crash before 6 leaves the coupon
free.

## What each surface reads

| Surface | Today | After |
| --- | --- | --- |
| Cart drawer | `spendableRewards` over `OPEN_STATUSES` — an expired counter sale hides the coupon | `BINDABLE_STATUSES`, so only a holder that has taken money hides it |
| Till panel | `status === "available"` — the member's own open checkout hides the coupon | the same rule the cart reads |
| Wallet | a claimed coupon reads `reserved` | it reads as spendable; the wire value stays |

## The counter

Three things the challenge found, each a defect on its own, each in the way of
this change:

- **A plan must survive its own supersede.** `planTillSale` runs
  `supersedePromisedOrders` naming its own row as the newborn, but `survivorOf`
  keeps the `(createdAt, id)`-greatest draft — and a till row keeps its original
  `createdAt` across re-plans, so a newer web draft wins and the sale being
  planned is expired underneath it.
- **A dropped reward's code must stop being re-applied.** `planTillSale` hands
  the till `loyaltyCouponCode` without checking the row still claims it.
  `checkoutRequest.ts`'s `rewardOnOrder` already has the right shape.
- **A reward code cannot go back on the sale it left.** The derived code is a
  pure function of the order and the coupon, so a re-mint adopts the
  deactivated node and hands the till a dead code it believes is fresh. The
  store refuses it with the sentence the counter already has.

And one that only shows once rewards start refusing at a till: `planRefusal`
assumes a code-less refusal cannot reach it, so every reward refusal renders as
an empty code and an English reason inside a Chinese sentence.

## The sweep

`sweepStaleCouponReservations` stays, and its horizon moves past
`MINT_LIFETIME_HOURS`. Today the two are both 24 hours and the code is minted
*after* the usage, so the sweep frees the coupon while its code is still live —
the one money defect running in production today. Past the code's own life
there is nothing left to collect, so the release is safe.

It protects two things the store cannot: a usage whose promise crashed before
the order row existed, and an operator's reversal blocked by a claim nothing
will ever move.

## Risks

- **A checkout refused after the claim** — an unpriceable gift, points the
  member cannot spend — has already taken the cut off the earlier sale. The
  coupon returns to the wallet spendable anywhere, but not back onto the
  counter sale it left. Stated on the page; the remedy the counter already
  names is a new sale.
- **Staff watch a cut leave a sale they are working.** It needs a deliberate
  double-use, the sale collects honestly, and the plan result now names the
  reward so the extension can say so. A live push is a change of its own.
