# Tasks

Group 1 lands the reward's contract shape; group 2 and group 3 both depend
on it. Groups 4 through 6 touch separate code paths and can be claimed in
any order once group 1 ships.

## 1. Reward definitions (grade10)

- [ ] 1.1 Extend the reward contract with a kind, a discount (fixed amount,
  or a percentage with a maximum) and a scope (named products or variants,
  a worlds-and-types filter, or the whole order), plus a gift's own minimum
  spend, so *A reward names a kind, a discount and a scope* passes
- [ ] 1.2 Copy the definition onto the coupon a redemption issues, unchanged
  by a later edit to the reward
- [ ] 1.3 Evaluate a coupon's discount from its own definition wherever it
  is applied, online and at the till, so *A fixed-amount coupon takes a set
  amount off its scope*, *A percentage coupon is capped at its maximum
  discount*, *A coupon scoped to a catalog filter matches worlds and types*,
  *A coupon scoped to the whole order applies across every line*, *A gift
  adds a free line for its own variant*, and *A gift below its minimum
  spend does not apply* pass
- [ ] 1.4 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 2. Console reward form (grade10)

- [ ] 2.1 Add kind, discount and scope fields to the loyalty-admin reward
  form, so *A reward with a definition is created from the console alone*
  passes, and drop the admin-API-only path for a reward carrying a
  definition
- [ ] 2.2 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. Physical reward retires collection (grade10)

- [ ] 3.1 Settle a physical reward's redemption as a 100%-off coupon on the
  reward's own variant instead of an item owed, so *A physical reward's
  coupon takes 100% off its own variant* passes
- [ ] 3.2 Remove the fulfilment queue, the till's collection-confirm action,
  and the "waiting at the counter" list from the till session and the
  member surface
- [ ] 3.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run test`

## 4. The order's one discount (grade10)

- [ ] 4.1 Count a reward coupon against the order's one-discount limit and
  refuse a second, so *A coupon is the order's one discount* passes
- [ ] 4.2 Verify: `pnpm run test:backend`

## 5. Cancellation is its own permission (grade10)

- [ ] 5.1 Split cancelling a redemption into its own permission, apart from
  the point-movement permission it shares today, so *Moving points does not
  carry redemption cancellation* passes
- [ ] 5.2 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 6. Member disclosure and the staff-assisted notice (grade10)

- [ ] 6.1 Disclose a channel's own spending limit before points leave the
  balance, so *A channel's own limit is disclosed before the points go*
  passes — moved from `revise-loyalty-programme-rules`
- [ ] 6.2 Name the channel on every activity entry the member reads, so *An
  activity entry names its channel* passes — moved from
  `revise-loyalty-programme-rules`
- [ ] 6.3 Notify the member instantly on every staff-assisted act — points
  spent or a coupon applied — so *The member's phone is the monitor*
  passes — moved from `add-shopify-membership-pos` (its task 5.2), folded
  together with the collection notice group 3 retires
- [ ] 6.4 Verify: `pnpm run typecheck`, `pnpm run test:backend`
