# A coupon is never locked — design

## Context

See `proposal.md` — Why. One constraint shapes everything: **loyalty and the
store are separate databases behind a service binding.** A rule spanning them
cannot be one transaction, so each side owns the facts it can see and writes
its own compensation.

The store owns every fact this change turns on: which order claims a coupon
(`orders.loyalty_coupon_id`), whether it can still take money (`status`),
whether its checkout can be closed (the provider), and what code was minted for
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

- **Every surface offers what the member holds; the claim decides.** The
  drawer and the till panel offer every coupon that is not spent, lapsed or
  void. The claim takes it back from an earlier sale or refuses it by name, so
  no surface offers what the checkout then refuses as unavailable.

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
coupon this checkout does not name, would wait for the programme's 25-hour
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
| A web draft the provider reports collected | Keeps the coupon; the claim is refused by name |
| A web draft the provider will not close | Keeps the coupon; the claim is refused by name |
| A claim naming an order never written, five minutes old or more | Released by the programme, then claimed, as `releaseUnwrittenClaim` below says |
| A claim naming an order never written, under five minutes old | Keeps the coupon; the claim is refused by name |

**Which checkout retires a counter sale.** Every checkout of a signed-in member
runs the pass, whatever it carries (`services/orders/promise.ts:218-225`), and
the pass lists the member's earlier sales carrying points, a reward or a store
coupon (`repositories/orders.ts:357-383`). So a checkout carrying neither points
nor a coupon still retires a counter sale that holds a reward, a till gift
among them, as the Discounts page's `The newer promise retires the older` line
says.

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
second ask the race retry already makes (`SC-237`). The happy path reads
nothing more.

So the drawer offers every reward coupon the wallet quote returns, as the
till panel does, and reads no orders to decide it: whatever holds the claim,
the claim frees it or refuses it by name. `spendableRewards` and its read of
the member's open orders go (`services/orders/quote.ts:263-293`). That closes
the windows in which a cancelled order's release has not drained, or a claim
names an order never written, and the drawer hid a coupon the till panel
offered (`SC-196`).

**A claim whose order was never written.** A checkout that stops between the
programme's claim and its own row write leaves a claim naming an order id no
store row carries. Only a crash does that, since the request's guard gives the
claim back on every other exit. When the programme answers `not_available` and the
wallet names such an id for the coupon, the claim asks the programme to
release it, then asks once more (`SC-241`). The release is a new programme
operation, `releaseUnwrittenClaim`, keyed on the coupon and that order id: it
releases the pending claim only where it is older than five minutes. The store
owns the fact that no row exists and the programme owns the claim's age, so
neither decides on the other's data. Five minutes is past any checkout still
running, and the promise's own row write refuses a claim it made more than a
minute before, so a release never meets a row still being written
(`SC-244`). That refusal leaves through the promise's guard, which gives the
claim back as on every other exit, and reaches the checkout as a value; the
sentence the member reads is raised in `decisions.md`, and its answer moves
only the cause and its copy. A younger claim may be a checkout still being promised, so the
operation answers
`too_recent` and the claim is refused by name, as an earlier sale that stands
(`SC-242`); the race retry above has already run by then. The sweep still
releases one nobody claims again.

The member's coupon list already carries no code for a reward coupon: the
block takes one only where its consumer passes it
(`packages/ui/src/blocks/loyalty-membership/types.ts:35`), and the wallet
passes none (`CouponListView.tsx:21-24`). The wallet is the block's only
consumer and lists the programme's coupons alone, so no store coupon's code
reaches it today. The forfeit count already reads
coupons past their validity, never a code
(`packages/loyalty/backend/src/services/finance/forfeits.ts`). So none of the
three requirements that now name the coupon, `The membership surface exports`
among them, needs code; their tests cite the scenarios (task 14.3).

A claimed coupon already reads as spendable in the wallet, the SPA and the
shared coupon list. What is owed there is one line in the programme: expiry is
computed from `available` alone, so a claimed coupon that lapses reads claimed
forever — and the till panel, widened to offer one, would hand a shopkeeper a
dead coupon. Computing it from `reserved` too fixes every reader at once.

The till panel offers every coupon that is not spent, lapsed or void, the same
set the drawer offers. Under this rule a claim never blocks, so the store is
what refuses, once, and by name.

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
- **A fresh scan reaches the sale its cart names.** A till session lives
  ten minutes from its scan (`pos/deps.ts:54`, `identity/sessions.ts:141`) and
  a sale's hour runs from its last plan, so a sale that ran out its hour, or a
  retired one whose session lapsed, never takes another plan from its own
  session: staff are told the session expired and scan again
  (`till/sentences.ts:32`). The new session writes a new row on a cart that
  still carries the old row's `grade10_order_id` and its deactivated code, and
  a coupon chosen there would mint a second code beside the dead one.
  `PosSalePlanInput` gains `cartOrderId`, the attribute the cart carries before
  the plan writes its own; `planTillSale` refuses `sale_closed` when it names a
  row of this member's that this session did not write, that is no longer
  `pending`, and that carries a reward's code (`SC-27`). A `pending` row of
  this member's is continued (Q27): it becomes the row the plan stands on in
  place of the session's own (`standingRow`, `services/pos/sale/sale.ts:131`),
  so the `coupon_off_sale` and `coupon_locked` guards and the give-back read
  it; the plan writes onto it under its own checkout reference, since the row
  is keyed on it (`repositories/orders.ts:450`), and the mint reuses its code,
  so the supersede pass names that row the survivor rather than retiring it
  (`SC-30`). Confirming needs nothing new: it reads the row by id and member,
  never by session (`sale.ts:372-376`). One read by id; a cart naming no
  order, this session's own, or another member's row plans as today.
- **What plans as today, as built.** A closed row of this member's carrying
  no reward's code is not refused (Q31): the apply first takes the closed
  sale's gift lines and points discount off the cart, and stops without
  planning where one will not come off (`acts/flow.ts:1085-1089`, `:646-651`);
  the new session then writes its own row, and the extension writes that
  row's id over the cart's (`acts/flow.ts:421-427`). Another member's record
  is stripped and the cart unbound when the new session arrives
  (`acts/flow.ts:1199-1222`, `:680-688`), so the plan usually reads no order
  id at all; where a points discount would not come off, the id stays, and the
  plan still writes the new member's own row (Q30).
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
  (`SC-204`); a released claim's key makes a new claim (`SC-235`), which is
  how a till sale whose plan was refused after it claimed — the promise's
  guard gives the claim back — claims it again under its own order id when
  staff re-plan (`SC-203`); an applied claim still refuses a
  second (`SC-236`), `uq_coupon_usages_live`'s rule.
- **The hour gives the coupon back** (8.3) — `expireTillSale` calls
  `giveBackReward(order, null)` before it moves the row to `expired`, the move
  the supersede pass makes on a counter sale it ends (`SC-205`, `SC-234`).
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
sweep is what releases it once the code is dead (`SC-238`). The sweep also
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
  Both gain a `cause` tag carrying the coupon's refusal cause. `not_available`
  also answers a coupon a racing paid order spent or an operator voided, which
  is correct, so the programme's `not_available` answer names the standing
  that refused it (`claimed`, `spent` or `not_live`) and the store tags it
  `standing`. The measure reads `cause:not_available` with `standing:claimed`.
  `store.coupons.claim_blocked` counts the named refusal, `held_elsewhere`,
  which is correct and stays apart (task 15.2).
- **Coupons spent within a day of a counter sale the member walked away
  from** — counted where both facts live. The programme knows which claim on a
  coupon it released and when; the store knows which order was a counter sale.
  So the programme's answer to a capture names the order whose claim on that
  coupon it released less than 24 hours before, and the store's sink counts
  `store.coupons.used_after_counter_release` when that order is a counter sale
  other than the paying one. An online checkout superseded by the member's
  next one is not counted. The give-backs it reads against are the counter
  sale's: `store.pos.sale.expired` at the hour and `store.pos.sale.superseded`
  when retired, each tagged `reward:given_back` when `giveBackReward` freed
  one (task 15.3). No column moves: the programme reads its own released
  usage, the store its own order.

## Risks

- **A checkout refused after the claim** — an unpriceable gift, points the
  member cannot spend — has already taken the claim off the earlier sale and
  deactivated its code. The
  coupon returns to the wallet spendable anywhere, but not back onto a counter
  sale whose code it left. The remedy the counter already names is a new sale.
- **Staff watch a cut leave a sale they are working.** The plan result now names
  the member's coupon so the extension can say so; a live push is its own
  change.
