# Settling money against the shop's own lines — design

## Context

See `proposal.md` — Why. The constraint that shapes everything below: the
lines are stated once, in the settlement body, and every money rule reads them
afterwards from wherever the Store put them.

## Goals / Non-Goals

- **Goal** — one record, written once, that the earn basis, the claw-back and
  the coupon rules all read. Two readings of the same money is how they drifted.
- **Goal** — an exact answer where the provider states the facts, and a named
  estimate where it does not. Never a guess presented as an answer.
- **Non-goal** — a provider-neutral allocation model. Shopify is the only
  provider that settles orders today; the contract states what any provider
  would have to answer, and the adapter is where Shopify's shape lives.

## Decisions

- **Two tables, not one** (`order_lines`, `order_discounts`). A line and an
  instrument are different grains: a refund names lines, a capture names an
  instrument, and one table keyed by both would make every read filter the
  other half out. Alternative considered: a single `order_settlement` table
  with a kind column — rejected, because the check constraints that keep each
  honest have nothing in common.
- **The rule reports its own verdict.** `eligibleGoods` already read line by
  line and returned only the total; it now returns the per-line verdict beside
  it. Alternative considered: a second pass over the lines at record time —
  rejected, because two readings of one rule is the defect this change closes.
- **Returned goods accumulate on the line**, not in a refund-to-line join
  table. A claw-back only ever asks "how much of this line has come back", and
  the order's own row lock already serializes two refunds. A join table would
  carry a second copy of the same sum for the sake of a history nothing reads.
- **A named allocation, not an index.** An allocation the source cannot name
  says money came off and nothing about which instrument took it. The decoders
  resolve the name — the code for a discount code, the applied title otherwise
  — and drop what they cannot name, rather than corroborating whichever coupon
  happens to match.
- **Every fallback is stated, never silent.** A refund naming no line is priced
  by share and counted as an estimate; a sale naming no allocations corroborates
  a coupon by variant alone; a points slot with no allocation falls back to the
  subtraction. Each is the old behaviour, reached deliberately.
- **The goods basis is what the shop sold, never what is left.** Both decoders
  read the pre-return subtotal; tax and shipping stay post-return, because they
  are what the buyer still holds rather than a basis. Read post-return, an order
  first seen after a refund states goods a claw-back has already taken, and
  every rule that divides by them answers on a smaller sale — the tender's
  threshold included, where it mints. The lines and the stated total are
  compared on every settlement to say when they disagree.
- **The tender is measured on the whole sale, not on what earned.** One
  threshold, `refunded_goods_stated_minor` against the goods the provider
  stated, and the charge where it stated none. Alternatives considered:
  refusing a tender on a sale carrying stored value — rejected, because it
  costs the sale and misses a gift card sold as a custom line; returning the
  tender per line — rejected here as the change of its own it is, since it
  needs the tender placed per line at the till first. What the earn basis
  cannot do is act as the threshold: the tender paid for the excluded lines
  too, so a member returning every card and keeping a gift card would be handed
  points that bought the card.
- **Only goods a refund stated reach that threshold.** A total carrying the
  share's estimate too reaches the whole sale exactly when the whole charge
  does, so goodwill, an amount typed beside a delivery, and a refund that
  overran a charge recorded too low would each stand in for a good coming home,
  and the answer would turn on which part an operator rang last.
  `refunded_goods_raw_minor` keeps the estimate and prices the claw-back, where
  a number short by a rounding is recoverable and a minted tender is not.

## Risks / Trade-offs

- **The allocation titles are assumed to match what the till applied.** A
  welded coupon is corroborated by its own title, and the points slot by
  `Points`. A shop or an app that rewrites a discount's title on the way to
  settlement would leave the coupon uncorroborated. → The fallback is the
  variant match that answered before, so a mismatch costs corroboration rather
  than spending a coupon wrongly; and `store.pos.sale.coupon_not_taken` counts
  it. ❓ Unverified against a live shop — `tasks.md` group 5 is the staging
  sale that settles it, and no allocation-fed rule should be trusted in
  production until it has run.
- **A partial removal is still ambiguous.** Two lines of one variant, with
  staff removing the cut from one, reads as corroborated. → Accepted: the weld
  goes on every line carrying the variant, so no per-line answer is available
  to be had.
- **A member the whole-sale threshold leaves short gets nothing back.**
  Everything that earned came back and a gift card stayed. → Accepted: a
  shortfall a person can pay back is not a mint nobody can unwind. Counted as
  `store.points_tender.return_held`, tagged by whether the sale stated goods or
  only a charge, and an operator returns the points by hand.
- **A sale returned as a typed amount never returns its tender.** Every penny
  back and nothing stated about the goods. → Reported as
  `commerce.order.charge_closed_short` on any sale, tendered or not: the money
  closed over goods the record still says are held, which is a sale somebody has
  to look at whoever paid for it.
- **The money may not decide what the goods decide.** Reading the closed charge
  as the whole sale would answer that second case without an operator — and mint
  on every one where money closes without a good moving: goodwill typed beside
  a delivery, a discrepancy adjustment, a refund that overran a charge the order
  recorded too low. → The threshold stays on the goods; the money is read only
  to report.
- **Orders settled before this lands keep the estimate.** → The shop keeps the
  lines and the Admin sweep already asks for them, so a backfill is possible;
  a refund already priced from the estimate is not undone by it.

## Migration Plan

- Two additive migrations create the tables. An order with no recorded lines is
  exactly the "cannot answer" case every rule already handles, so old and new
  orders coexist without a flag.
- A third adds the stated-goods total and backfills it, over orders with money
  back and only where the column still holds its default, so a re-run is a
  no-op. A sale already returned whole under the share carries its raw total
  across, which records the tender decision that was made rather than re-making
  it; every other row takes its settled lines' own returned sums, or zero. A
  part return the share had counted therefore falls short until a refund states
  its goods — reported, and settled by a person, which is the direction this
  rule always errs in.
- Rollback is dropping the tables and the column; every rule falls back to what
  it did before.
