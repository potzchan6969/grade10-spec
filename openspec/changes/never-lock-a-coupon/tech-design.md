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

- **A cut the shop gave is paid for once.** A counter sale paid with a code
  its order had given up spends the coupon where it is still free, rather
  than leaving the member both the cut and the coupon. Rejected alternative —
  taking the coupon off a sale that claims it now, so the first to settle
  spends it — reaches into an unpaid sale the member is standing at, from a
  settlement that has no member in front of it.

## Corroborating a reward at settlement

Inside the paid transaction, beside `settleCoupons`, which cannot see a reward:
its code is written to the order's own columns and never to `coupon_mints`,
whose foreign key points at the store's own registry.

- **The sale does not name the reward's code** — or, for a gift, does not show
  its line: the reward comes off the order and its release is enqueued, so the
  capture stops spending a coupon for a cut nobody gave, and the surviving code
  dies with it.
- **The sale names a reward code the order no longer claims** — or shows the
  gift line it gave up, read off `loyalty_coupon_gift_variant_id`: always
  reported, and the coupon is spent by this sale where nothing else claims it
  (`SC-23`, `SC-25`); where another sale claims it or it is spent, this sale
  spends nothing (`SC-21`, `SC-195`).

A counter sale only: online, the shop refused the checkout outright if a code
would not apply. An order written before codes existed states nothing to read
and settles as carried.

### Spending a coupon the sale carried

The paid transaction writes the fact, and the programme hears it through the
order-events outbox, the same row that captures a reward's claim today. The
event names the coupon the sale carried instead of a usage, and the sink calls
one new programme operation, `spendCarriedCouponFor`: in one transaction it
moves the coupon from `available` to `used` and writes an `applied` usage keyed
on the order id. It does not price the coupon against the basket again — the
shop already gave the cut — and it refuses a coupon that is claimed, spent,
lapsed or void. The released usage under the same key does not block it, by
the retry rule group 8 set; a second delivery replays the applied usage.

A refusal is the answer, not a fault: the event is delivered and the sale is
reported. A transport failure retries on the outbox's own ladder.

### Reporting

Every such sale logs the order, the code or the gift's variant, and whether
the coupon was spent, and counts `store.coupons.reward_double_ride` tagged
`spent:true|false`. Each is money the shop gave against a code this store let
go, so it joins the commerce monitors in `docs/architecture/commerce.md` as
an alert on any, rather than a dashboard line.

`confirmTillSale` is the other half. It returned early on any row that was not
`pending`, while every counter sale expires within the hour, so it never ran on
a sale paid late. It reads the statuses a sale can still be paid from instead —
the row lock it takes already re-reads the status under it.

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
branch takes off whatever reward the sale holds — `giveBackReward(order, null)`,
the move `expireTillSale` makes at the hour. The sale it retires is `expired`,
so its next plan is refused `sale_closed`, as is one whose own hour ran out
or that landed. The till's sentence for `sale_closed` asks for a fresh scan
(`integrations/shopify-pos/grade10/src/till/sentences.ts:45`); a scan on the
same cart leaves the deactivated code on it, so the sentence names a new sale
instead, for every closed sale alike (task 10.4, `SC-24`, `SC-27`, `SC-29`). A
retired counter sale leaves the open list, so a claim left on it, even one on a
coupon this checkout does not name, would wait for the programme's day-old
sweep and block an operator's reversal until then. The pass still answers whether the coupon this checkout
names came free, which is what the claim reads. The sale keeps its cart; one
paid still carrying the code is settled as the section above says.

Rejected alternative: a second give-back beside the claim, reading the member's
orders by `loyalty_coupon_id`. It would retire and cancel the same web drafts
the supersede cancelled moments earlier — two provider round trips per checkout
— and duplicate a tested pass.

| Holder | What happens |
| --- | --- |
| A web draft | Retired at the provider, then cancelled — as today |
| A counter sale, `pending` or `expired` | Keeps its cart; whatever reward it holds comes off, the code is deactivated best-effort, and the claim is released |
| A draft the provider will not kill | Keeps the coupon; the claim is refused by name |

**Which checkout retires a counter sale.** Every checkout of a signed-in member
runs the pass, whatever it carries (`services/orders/promise.ts:218-225`), and
the pass lists the member's earlier sales carrying points, a reward or a store
coupon (`repositories/orders.ts:362-383`). So a checkout carrying neither points
nor a coupon still retires a counter sale that holds a reward — the Discounts
page's `The newer promise retires the older` line read as written, where
"carrying points or a code" describes the earlier sale.

The pass answers which coupon it could not free, and `reserveRewardCoupon`
refuses on that rather than letting the programme say the coupon is
unavailable. **The refusal is new and needs a cause of its own**:
`riding_elsewhere` is the store registry's rule and says the opposite of what
this change promises, and `not_available` is the sentence this change exists to
stop showing. `CouponRefusalCause` gains `held_elsewhere`, the name the till
already gives the same fact (`coupon_held_elsewhere`), and `checkoutResult`
carries it as its own refusal cause with its own copy, never as English detail
inside `coupon_refused`. The till branches on the same cause rather than on
`SALE_HOLDS_IT`'s English sentence (`services/pos/sale/sale.ts:659`). The copy
for `idempotency_conflict` stops saying a coupon is held for another checkout,
in the catalogs and in the store's own sentence
(`services/coupons/apply.ts:125`): after group 8 that cause answers only a
claim already collected, or a key reused for another order.

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

`BINDABLE_STATUSES` — the statuses a sale can still be paid from — is what the
give-back reads. A dead order is deliberately not in it: its release is already
enqueued, and listing every order a member ever abandoned would grow that read
without bound on the checkout's own path.

The claim reaches a dead order on the miss rather than on every ask: when the
programme answers `not_available`, the claim runs inline the unsettled
`coupon_release_jobs` of this member's dead orders whose `loyalty_coupon_id` is
this coupon — an indexed, bounded read with no provider call — then makes the
second ask the race retry already makes (`SC-209`). The happy path reads
nothing more.

So the drawer offers a claimed coupon wherever one of the member's own orders
holds the claim, whatever that order's status: the claim can free it, or
refuses it by name. It reads those orders by the ids the wallet names on its
claimed coupons — one bounded read, no wider than the coupons the member holds
— rather than listing the member's open orders. That closes the window in which
a cancelled order's release has not drained and the drawer hid a coupon the
till panel offered (`SC-196`). A claim whose order id names no row — a checkout
that crashed before writing it — stays hidden until the sweep releases it.

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

- **A dropped reward's code must stop being handed back to the till.**
  `checkoutRequest.ts` already requires the code *and* the claim; the till path
  reads the column alone.
- **A sale a reward's code has left takes no reward again.** The mint
  short-circuits on the code column, so after a give-back that sale can never
  carry a reward again — not the one that left, and not any other. The row's
  own record of it is a code with no claim. The plan refuses `coupon_off_sale`
  only when it names a reward, so a points-only re-plan after Remove every
  discount goes through, where today every re-plan of that row is refused
(`services/pos/sale/sale.ts:140-142`). The till's
  sentence names a reward, not this coupon, so it reads true for any. A sale
  whose coupon left before any code was minted carries no such record, and can
  claim again. Only an open sale reaches this check: one whose coupon was
  claimed elsewhere is already `expired`, and refused `sale_closed`.
- **A fresh scan on a closed sale's cart is refused.** A till session lives
  ten minutes from its scan (`pos/deps.ts:54`, `identity/sessions.ts:141`) and
  a sale's hour runs from its last plan, so a sale that ran out its hour, or a
  retired one whose session lapsed, never takes another plan from its own
  session: staff are told the session expired and scan again
  (`till/sentences.ts:32`). The new session writes a new row on a cart that
  still carries the old row's `grade10_order_id` and its deactivated code, and
  a coupon chosen there would mint a second code beside the dead one.
  `PosSalePlanInput` gains `cartOrderId`, the attribute the cart carries before
  the plan writes its own; `planTillSale` refuses `sale_closed` when it names a
  row of this member's that this session did not write and that carries a
  reward's code (`SC-27`). A pending one is included: this plan's own
  supersede would retire it and leave its code dead on the cart. One read by
  id; a cart naming no order, or this session's own, plans as today.
- **A gift's line stays on a cart its sale has left.** Nothing of the store
  runs at the counter once staff walk away, so the hour and a newer promise
  take the claim off the row and leave the line on the shop's cart. The row
  keeps the gift's variant (8.5), and a paid sale showing that line is settled
  as one carrying a code is (`SC-25`).
- **A reward refusal must reach the till as a sentence.** The plan refusal
  assumes a code-less refusal cannot happen, so every reward refusal renders as
  an empty code and an English reason inside a translated one.

## Giving the key back with the claim

Task group 8. Each item ties to the modified retry requirement in
`grade10-site/loyalty/programme`.

- **A key answers only a live claim** (8.1, 8.2) — `useCoupon` reads only
  `pending` and `applied` usages for its key, and the unique index narrows to
  the same predicate. A retry of a claim that still stands replays it
  (`SC-204`); a released claim's key makes a new claim (`SC-207`), which is
  how a till sale whose plan was refused after it claimed — the promise's
  guard gives the claim back — claims it again under its own order id when
  staff re-plan (`SC-203`); an applied claim still refuses a
  second (`SC-208`), `uq_coupon_usages_live`'s rule.
- **The hour gives the coupon back** (8.3) — `expireTillSale` calls
  `giveBackReward(order, null)` before it moves the row to `expired`, the move
  the supersede pass makes on a counter sale it ends (`SC-205`, `SC-206`).
- **One guarded write sets a claim** (8.4) — the claim columns come off
  `NewOrderValues` and off `upsertPromisedOrder`'s conflict arm;
  `writeOrderReward` is the one write, and it refuses a row already holding a different claim.
  `planTillSale` gives the standing claim back in its own transaction before it
  promises.
- **The gift is written where the claim ends** (8.5) — the gift's variant is
  written beside the claim and kept when the claim goes, as the code is, so
  settlement can tell a paid sale carried a gift line the order had given up
  (`services/coupons/rides.ts:126-129`).
- **The release outbox stops and reports** (8.6) — a job stops asking an hour
  past the programme's sweep, a deadline rather than a count of rungs, pinned
  by the same test as the other cross-database clock. Stopping is not dropping:
  the row keeps its error and stays owed, and three gauges report what is owed,
  what has stopped, and how old the oldest is.

## The sweep, and the two clocks

`sweepStaleCouponReservations` stays, and releases every claim still pending
25 hours after it was made (`packages/loyalty/backend/src/services/rewards/coupons.ts:551-575`).
Every sale that ends gives its claim back itself except one: an online order
that only expires keeps its claim while its code can be collected, and the
sweep is what releases it once the code is dead (`SC-210`). The sweep also
catches a claim no store row carries — a promise that crashed before its order
row existed — so an operator's reversal never waits longer than the sweep.

Its horizon and the minted code's lifetime are both a day, but they start at
different moments: the claim's clock at the reserve, the code's at the mint. So
the sweep freed a coupon while its code was still live — the one money defect
this change found running in production.

Raising the horizon alone does not close it, because the gap between the two is
not bounded: a till sale whose mint the shop refuses keeps its claim, and staff
can fix the cause and re-plan hours later. **So a reward's code runs from the
order's own creation rather than from the mint**, which is never later than the
claim it stands for. The horizon then clears it by an hour, and the two numbers
are held apart by a test that reads both.

A claim left standing by a refused mint is not released at the till — failing a
sale over a throttled shop costs more than it saves — and it costs nothing:
that row has no code, so the settlement frees the coupon rather than spending
it for a cut nobody gave.

## Measures

- **Coupon claims refused as unavailable** — `store.checkout.outcome` tags a
  refused coupon `reason:couponRefused`, and `store.pos.sale.refused` tags it
  `reason:coupon_refused`; neither names the cause, so neither can read zero.
  Both gain a `cause` tag carrying the coupon's refusal cause, and the measure
  reads `cause:not_available`. `store.coupons.claim_blocked` counts the named
  refusal, `held_elsewhere`, which is correct and stays apart (task 15.2).
- **Coupons spent within a day of a counter sale the member walked away
  from** — the hour's give-back counts `store.pos.sale.expired` and says
  nothing of a reward. It is tagged `reward:given_back` when `giveBackReward`
  freed one, and the programme counts `loyalty.coupon.used_after_release` when
  it marks used a coupon whose previous claim was released less than 24 hours
  before. The measure reads the second against the first (task 15.3).

## Risks

- **A checkout refused after the claim** — an unpriceable gift, points the
  member cannot spend — has already taken the cut off the earlier sale. The
  coupon returns to the wallet spendable anywhere, but not back onto a counter
  sale whose code it left. The remedy the counter already names is a new sale.
- **A claim a crashed checkout left** — no order row holds it, so nothing in
  the store can free it; the till panel offers that coupon and the programme
  refuses it as unavailable until the sweep releases it. The request's own
  guard gives a claim back on every exit short of a crash, so this is the one
  route left to `cause:not_available`.
- **Staff watch a cut leave a sale they are working.** The plan result now names
  the member's coupon so the extension can say so; a live push is its own
  change.
