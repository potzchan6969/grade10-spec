# A coupon is never locked — design

## Context

See `proposal.md` — Why. One constraint shapes everything: **loyalty and the
store are separate databases behind a service binding.** A rule spanning them
cannot be one transaction, so each side owns the facts it can see and writes
its own compensation.

The store owns every fact this change turns on: which order claims a coupon
(`orders.loyalty_coupon_id`), whether it can still take money (`status`),
whether its checkout can be killed (the provider), and what code was minted for
it (`orders.loyalty_coupon_code`). Loyalty owns one: whether the coupon is
spent.

## Goals / Non-Goals

- **Goal** — a member is never refused their own coupon by a sale they walked
  away from.
- **Goal** — a paid sale spends a coupon only where the shop actually gave the
  cut, and says so when it did not.
- **Non-goal** — stopping a counter cart that already carries the code from
  collecting. Shopify honours an applied discount whatever becomes of its node,
  and the till has no call that takes one code off a sale.
- **Non-goal** — a schema change. The claim stays on `coupon_instances`: that
  guarded write is the serialization point `reverseRedemption` and
  `endMembership` already lock against.

## Decisions

- **The store supersedes; loyalty records.** The store gives back every claim
  its own orders hold, then asks the programme to claim. Rejected alternative —
  loyalty transferring the claim and naming what it displaced — fails three
  ways: loyalty cannot see an order's status, so it would move a coupon off a
  sale whose money is already in flight; the order row does not exist when the
  claim is made, so a racer is invisible to the compensation; and a crash
  between the two databases leaves an order holding a released claim and a live
  code with no outbox row to retry from.

- **`reserved` stops meaning *locked* and starts meaning *claimed by*.** No
  column moves, no status is removed. What changes is who may take it.

- **Deactivating a code is never a gate.** The shop goes on honouring one a
  cart already carries — this store says so in four places — so refusing a
  claim because the shop would not answer buys no money and costs a member
  their own coupon during an outage. It stays in the release outbox, where a
  failure means come round again.

- **The guard is settlement, not deactivation.** A paid sale is corroborated
  against what it carried. That is the only fact both sides agree on, and it is
  missing today rather than weakened here.

- **One status set, read by the offer and the claim alike.** A coupon is
  offered exactly where it can be taken back, so the drawer can never offer
  what the checkout then refuses.

## Corroborating a reward at settlement

Inside the paid transaction, beside `settleCoupons`, which cannot see a reward:
its code is written to the order's own columns and never to `coupon_mints`,
whose foreign key points at the store's own registry.

- **The sale does not name the reward's code** — or, for a gift, does not show
  its line: the reward comes off the order and its release is enqueued, so the
  capture stops spending a coupon for a cut nobody gave, and the surviving code
  dies with it.
- **The sale names a reward code the order no longer claims**: counted and
  reported with the order on it. Nothing can re-attach it — the coupon is
  already claimed or spent elsewhere, and a settled usage answers `conflict`
  whatever is retried.

Scoped to a counter sale carrying a minted code: a gift reward carries none by
design, and an order written before codes existed has none either.

`confirmTillSale` is the other half, and today it is unreachable: it returns
early on any row that is not `pending`, while every counter sale expires within
the hour. It reads the statuses a sale can still be paid from instead — the row
lock it takes already re-reads the status under it.

## Claiming

The give-back already exists. `supersedePromisedOrders` runs three lines before
the claim in `promiseOrder`: it lists the member's promised drafts, deletes each
checkout at the provider, cancels the order, and the cancel already kills the
mints, enqueues the release and attempts it. Two things stop it freeing a
coupon, and both are narrow:

- **It cannot see a counter sale the member walked away from.** It lists the
  statuses a reconcile pass still works on, and a superseded till promise is
  moved to `expired` — which is not one of them.
- **Its counter branch keeps the claim alive on purpose.** A till promise has no
  checkout to kill, so it expires rather than cancels: the shop's cart can still
  collect, and the money must bind to the row it was promised against. Keeping
  the cart is right; keeping the claim is what locks the member out.

So the pass gains the statuses a sale can still be paid from, and its counter
branch takes the reward off the sale — and only the coupon this checkout is
about to claim, never one the member did not ask for. The sale keeps its cart
and collects without the cut.

Rejected alternative: a second give-back beside the claim, reading the member's
orders by `loyalty_coupon_id`. It would retire and cancel the same web drafts
the supersede cancelled moments earlier — two provider round trips per checkout
— and duplicate a tested pass.

| Holder | What happens |
| --- | --- |
| A web draft | Retired at the provider, then cancelled — as today |
| A counter sale, `pending` or `expired` | Keeps its cart; the cut comes off, the code is deactivated best-effort, and the claim is released |
| A draft the provider will not kill | Keeps the coupon; the claim is refused by name |

The pass answers which coupon it could not free, and `reserveRewardCoupon`
refuses on that rather than letting the programme say the coupon is
unavailable. **The refusal is new and needs a cause of its own**:
`riding_elsewhere` is the store registry's rule and says the opposite of what
this change promises, and `not_available` is the sentence this change exists to
stop showing.

Three things the pass cannot cover, each fixed where it lives:

- **The till never ran it.** `planTillSale` swaps the pass out inside the
  promise, so a coupon on the member's open checkout is still claimed when the
  till asks for it — the reveal that fails in front of a shopkeeper. It runs
  now, holding the sale it is planning out of its own reach.
- **A plan must survive its own supersede.** The survivor is the
  `(createdAt, id)`-greatest draft, and a till row keeps its original
  `createdAt` across re-plans, so a newer web draft expires the sale being
  planned underneath it. The row a plan is writing is named the survivor
  outright.
- **The mint writes unguarded, after the claim.** A reward's code is minted once
  `promiseOrder` has returned, with an update keyed on the order alone — so a
  checkout that lost its claim in between still writes a live, single-use code
  onto a row that no longer claims the coupon, with no mint row and no reader.
  The write is keyed on the usage it was minted for.

And one race the pass cannot see: two checkouts claiming at once, the second
reading before the first's row exists. Loyalty's guarded write settles it
atomically, so only one claim ever stands — but the loser reads the sentence
this change abolishes. It retries once, and the second read sees the racer's
row.

## What each surface reads

`RECLAIMABLE_STATUSES` — every status except `paid`, `processing` and
`refunded` — is the complement of the refusal table above, named once and read
by both the give-back and the drawer. `BINDABLE_STATUSES` is the wrong
borrowing: it answers *still open at a counter*, so it would offer a coupon
held by a `processing` order the claim then refuses, and hide one held by a
`canceled` order whose release has not drained yet.

A claimed coupon already reads as spendable in the wallet, the SPA and the
shared coupon list. What is owed there is one line in the programme: expiry is
computed from `available` alone, so a claimed coupon that lapses reads claimed
forever — and the till panel, widened to offer one, would hand a shopkeeper a
dead coupon. Computing it from `reserved` too fixes every reader at once.

The till panel offers every coupon that is not spent, lapsed or void. It cannot
read the rule the drawer reads — the programme holds no order statuses, and
the panel's own wire type carries no claim — and it does not need to: under
this rule a claim never blocks, so the store is what refuses, once.

## The counter

- **A plan must survive its own supersede.** `planTillSale` names its own row
  as the newborn, but the survivor is the `(createdAt, id)`-greatest draft — and
  a till row keeps its original `createdAt` across re-plans, so a newer web
  draft expires the sale being planned underneath it.
- **A dropped reward's code must stop being handed back to the till.**
  `checkoutRequest.ts` already requires the code *and* the claim; the till path
  reads the column alone.
- **A sale a reward has left mints no more reward codes.** The mint
  short-circuits on the code column, so after a give-back that sale can never
  carry a reward again — not the one that left, and not any other. The row's
  own record of it is a code with no claim, and the counter already has the
  sentence for it.
- **A reward refusal must reach the till as a sentence.** The plan refusal
  assumes a code-less refusal cannot happen, so every reward refusal renders as
  an empty code and an English reason inside a translated one.

## The sweep, and the two clocks

`sweepStaleCouponReservations` stays: it is the only thing that frees a claim
nothing else will move — a promise that crashed before its order row existed,
and the operator reversal waiting on one.

Its horizon and the minted code's lifetime are both a day, but they start at
different moments: the claim's clock at the reserve, the code's at the mint. So
the sweep frees a coupon while its code is still live, which is the one money
defect running in production today.

Raising the horizon alone does not close it, because the gap between the two is
not bounded. A till sale whose mint the shop refuses keeps its reservation —
the web path fails the order and releases, the till path just answers and
leaves it — so staff can fix the cause and re-plan hours later, and the code
then outlives any fixed horizon. **The till releases on a refused mint, like
the web path.** With the gap back to one request, the horizon clears the code's
own life and there is nothing left to collect.

## Risks

- **A checkout refused after the claim** — an unpriceable gift, points the
  member cannot spend — has already taken the cut off the earlier sale. The
  coupon returns to the wallet spendable anywhere, but not back onto the sale
  it left. The remedy the counter already names is a new sale.
- **Staff watch a cut leave a sale they are working.** The plan result now names
  the member's coupon so the extension can say so; a live push is its own
  change.
