## Context

The title is written in two places: the store's online draft order
(`packages/grade10-store/backend/src/adapters/shopify/shopifyProvider.ts`)
and the till extension's cart write
(`integrations/shopify-pos/grade10/src/acts/flow.ts`). It is read in two:
settlement's points share (`services/coupons/money.ts`) and the till's slot
read (`acts/spend.ts`), which every hold, strip and write confirmation goes
through.

A till that meets a points discount it does not recognise treats it as
somebody else's: on a strip it leaves the discount on and takes the order id
off, so money comes off a sale nothing can bind or charge. That is what the
rollout has to rule out.

Store contracts, tasks 1.1 to 1.5 and the staging walk of 2.2 are done: every
reader goes through one check and accepts both titles, and both writers still
write "Points".

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

4. **The till matches ignoring letter case, as the store does.** Ownership
   still needs the order id on the cart, so a staff-keyed "points" changes
   nothing it could not already do with "Points".

5. **A re-applied sale takes the current title.** Apply strips the sale's own
   points discount, under either title, before it writes
   (`acts/flow.ts`, the points write), so a parked "Points" sale resumed
   after release 2 goes back on as "Deduction from Points". No special case.

6. **Labels for the money are not the discount title.** The till panel's row
   is its own till copy (`acts/view.ts`), unchanged in wording. Order
   Details' points row reads what the settled order states was paid with
   points (`add-grade10-customer-order-pages`), which settlement finds
   through the same check, so it shows under either title.

7. **Recorded tablet payloads stay as recorded.** They become the proof that
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
