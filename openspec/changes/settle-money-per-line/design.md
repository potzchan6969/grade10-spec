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
- **Orders settled before this lands keep the estimate.** → The shop keeps the
  lines and the Admin sweep already asks for them, so a backfill is possible;
  a refund already priced from the estimate is not undone by it.

## Migration Plan

- Two additive migrations, both creating tables. Nothing is backfilled: an
  order with no recorded lines is exactly the "cannot answer" case every rule
  already handles, so old and new orders coexist without a flag.
- Rollback is dropping the tables; every rule falls back to what it did before.
