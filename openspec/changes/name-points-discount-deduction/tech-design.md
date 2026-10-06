## Context

The title is written in two places: the store's online draft order
(`packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts`)
and the till extension's cart write
(`integrations/shopify-pos/grade10/src/acts/flow.ts`). It is read in three:
settlement's points share (`services/coupons/money.ts`), Order Details'
points credit (`services/orders/readOrder.ts`) and the till's slot read
(`acts/spend.ts`), which every read of the sale, every strip, every write
confirmation and Apply's refusals go through.

A till that meets a points discount it does not recognise treats it as
somebody else's: on a strip it leaves the discount on and takes the order id
off, so money comes off a sale nothing can bind or charge. That is what the
rollout has to rule out.

Store contracts and tasks 1.1 to 1.5 are done: every reader goes through one
check and accepts both titles, and both writers still write "Points". Of 2.2,
only the title is walked: the staging tablet kept all 21 characters of it
(grade10 `docs/architecture/shopify-verification.md` §23).

## Decisions

The spec governs the title written, the titles read and that a "Points"
discount settles as points. These decisions are how it lands.

1. **One module holds both marks a sale carries.** The import-free subpath
   `@grade10/store-contracts/sale-marks` holds the order id attribute, the
   title the writers use (`POINTS_DISCOUNT_TITLE`) and the one check every
   reader calls (`isPointsDiscountTitle`: trimmed, ignoring letter case,
   "deduction from points" or "points").
   - Import-free, like the eligibility subpath the till already imports, so
     the till's size budget does not move.
   - Rejected: a till copy and a store copy held together by a test - two
     sources, and the test is one more thing to keep.

2. **Readers first, writers second, as two releases.**
   - **Release 1:** every reader accepts both titles; both writers still
     write "Points".
   - **Release 2:** `POINTS_DISCOUNT_TITLE` becomes "Deduction from Points",
     so both writers switch in one edit.
   - The online writer waits too: POS can load a draft made online or at
     another location, and a manager activates till versions per location.
     Whether a loaded draft carries the order id is open (grade10
     `docs/architecture/shopify-verification.md` §24); the wait is safe
     either way.
   - Rejected: raising the minimum client version in one release. A refused
     till still reads the cart and runs its strip from cart signals, with no
     gateway call.
   - Rejected: a runtime switch for the title. The constant is read by an
     extension bundle that a manager activates, so a store-side switch moves
     only one writer and adds a second state to prove.

3. **The store accepts "Points" forever.** Paid orders keep their discount
   rows; refunds and later reads meet the old title for as long as the orders
   exist.

4. **The till matches through the same check as the store, on its one
   slot.** Only the cart's custom order discount, for a fixed amount, is read
   (`acts/spend.ts` `pointsDiscountOf`), so an offer or a code the shop titled
   the same never counts and is never stripped. Ownership still needs the
   order id on the cart (`ownPointsDiscount`), so a staff-keyed "points"
   changes nothing it could not already do with "Points".
   - A points title in the slot of a sale with no order id refuses every
     Apply, a coupon alone included (`benefitBlockers`, `keyedAsOurs`): the
     order id Apply writes would make it read as the member's, counted and
     stripped as theirs. Because it refuses a spend of any amount, the panel
     drops the points field, the coupons and Apply and shows only the
     sentence (`acts/view.ts` `held`; Q7).
   - A staff discount under another title refuses only a points spend; a
     coupon alone goes on beside it, because only points write the slot.

5. **Settlement reads a sale that names no points title like one that names
   no discounts.** Where the paid order names its discounts and none is under
   either title, the points share is unknown, not zero
   (`services/coupons/money.ts` `pointsApplied`, `allocatedMinor: null`), and
   the debit falls back to the applied total less every other instrument,
   capped at the promise (`services/loyalty/pointsSpend.ts` `pointsCapture`).
   A shop can drop the title the store asked for and title the cut itself;
   reading that as zero gives the member money off no points paid for (Q8).
   - No discount under another title is taken as the points allocation.
     The fallback can still count an order-level cut staff took off by hand,
     up to the promise, which is why Order Details shows no row for it
     (decision 7).

6. **A re-applied sale takes the current title.** Apply strips the sale's own
   points discount, under either title, before it writes
   (`acts/flow.ts`, the points write), so a parked "Points" sale resumed
   after release 2 goes back on as "Deduction from Points". No special case.

7. **Labels for the money are not the discount title.** The till panel's row
   is its own till copy (`acts/view.ts`), unchanged in wording. Order
   Details' points row reads what the settled order states was paid with
   points (`add-grade10-customer-order-pages`), found through the same check
   settlement uses (`readOrder.ts`), so it shows under either title. An order that
   names no points discount shows no row, though settlement debits it from
   the rest of the applied total (`readOrder.ts` `pointsCreditOf`): that
   figure can hold a staff discount, so it is no receipt fact (Q9).

8. **Recorded tablet payloads stay as recorded.** They become the proof that
   a cart titled "Points" is still ours; a new recording is added once
   release 2 reaches the staging tablet.

## Risks / Trade-offs

- **Release 2 merged early ships with the next production deploy** of the
  store for any reason. → Its pull request stays open until the gate; staging
  takes it through the `deploy:staging` label and a staging till version
  published from its branch.
- **A till rolled back past release 1 after release 2** meets carts it does
  not recognise. → Release notes for managers say release 1 is the oldest
  version that may be activated.
- **The audit rows only see a till that calls the gateway.** → The managers'
  confirmation is the gate, and the rows are its check.
- **POS keeps the whole 21-character title.** Keyed on the staging tablet,
  the title stayed whole on the cart row, the order summary and the paid
  order's discount applications (grade10
  `docs/architecture/shopify-verification.md` §23). The extension's own read
  of it is proven by its write confirmation in release 2's staging walk.

## Migration Plan

1. **Release 1** - deploy the store, publish the till version, and record its
   client version number; every location's manager activates it.
2. **Gate** - every location's manager confirms release 1 is active, and the
   audit rows show no client version below release 1's for 7 days.
3. **Release 2** - merge, deploy the store to production, and publish the
   till version; managers activate it per location. A till still on release 1
   writes "Points" meanwhile, which every reader accepts.

- **Rollback** - either release reverts on its own. Reverting release 2
  writes "Points" again, which every reader accepts; reverting release 1 is
  unsafe once release 2 has written anything, which the release notes say.
