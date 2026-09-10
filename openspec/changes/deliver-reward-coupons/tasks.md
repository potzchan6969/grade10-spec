# Tasks

Group 1 lands the reward's contract shape; group 2 and group 3 both depend
on it. Group 3 additionally depends on `mint-coupons-as-discount-codes`
task group 1 (gift coupons minting as a real, `usageLimit: 1` Shopify
Discount) — see group 3's note below. Group 5 is independent. Group 6
touches the same coupon-apply path `mint-coupons-as-discount-codes`
rewrites and is sequenced after that change ships.

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

**Depends on `mint-coupons-as-discount-codes` task group 1.** The
collection-confirm step being retired here (3.2) is today's only guard
against handing a physical reward over twice; its replacement is the real,
single-use Shopify Discount code that change mints for a `gift` coupon at
redemption — Shopify refuses a second redemption of a `usageLimit: 1` code
outright, the same way the QR/short-code presentation already gets
consumed once. Do not land 3.2 until that mint exists: settling a physical
reward as a `gift` coupon that still only welds a local line (today's
behavior, and `mint-coupons-as-discount-codes`' own current state) leaves
no guard at all between 3.1 shipping and 3.2 removing the one that exists.

- [ ] 3.1 Settle a physical reward's redemption as a 100%-off coupon on the
  reward's own variant instead of an item owed, so *A physical reward's
  coupon takes 100% off its own variant* passes
- [ ] 3.2 Once `mint-coupons-as-discount-codes` task group 1 has shipped
  (the gift coupon now mints a real, single-use Shopify Discount at
  redemption), remove the fulfilment queue, the till's collection-confirm
  action, and the "waiting at the counter" list from the till session and
  the member surface
- [ ] 3.3 Verify: `pnpm run typecheck`, `pnpm run test:backend`, `pnpm run test`

## 4. The order's one discount

Removed from this change. `mint-coupons-as-discount-codes` owns
"a coupon is the order's one discount" end to end, including the reward's
own `couponId` path, via `grade10-site-store-discounts-SC-04` — see that
change's task 3.2. This group's draft scenario
(`grade10-site-loyalty-programme-SC-163`) is dropped, not folded into any
spec; nothing to implement in this change for this rule.

## 5. Cancellation is its own permission (grade10)

- [ ] 5.1 Split cancelling a redemption into its own permission, apart from
  the point-movement permission it shares today, so *Moving points does not
  carry redemption cancellation* passes
- [ ] 5.2 Verify: `pnpm run typecheck`, `pnpm run test:backend`

## 6. Member disclosure and the staff-assisted notice (grade10)

**Sequence after `mint-coupons-as-discount-codes` ships** — 6.3 reads the
same coupon-apply path that change rewrites, and the notification's
"a coupon applied" branch should reflect what actually landed there.

- [ ] 6.1 Disclose a channel's own spending limit before points leave the
  balance, so *A channel's own limit is disclosed before the points go*
  passes — moved from `revise-loyalty-programme-rules`
- [ ] 6.2 Name the channel on every activity entry the member reads, so *An
  activity entry names its channel* passes — moved from
  `revise-loyalty-programme-rules`
- [ ] 6.3 Notify the member on **settlement** — the paid order, or the
  till's trim-to-what-landed pass (`discounts.md`'s POS step 9) — for every
  staff-assisted act (points spent or a coupon applied), never at Apply:
  Apply is explicitly a re-plannable claim (`discounts.md` step 7, up to
  20 plans per session per 5 minutes) that can still be trimmed or walked
  away from entirely, and "nothing is held" until paid. If a benefit
  already notified at Apply is later trimmed or the sale abandoned, send a
  correction notice — so *The member's phone is the monitor* passes without
  ever showing the member a result that contradicts what actually
  happened. Folds together with the collection notice group 3 retires and
  the notice moved from `add-shopify-membership-pos` (its task 5.2)
- [ ] 6.4 Verify: `pnpm run typecheck`, `pnpm run test:backend`
