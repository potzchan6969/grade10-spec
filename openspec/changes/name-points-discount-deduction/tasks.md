## 1. Every reader knows both titles (grade10) (owner: @ecchochan)

- [x] 1.1 One import-free store contracts subpath holds the order id attribute, the title writers use, and the title check; both copies of each go
- [x] 1.2 Settlement finds the points share by the check, and a paid order carrying "Points" still captures its points
- [x] 1.3 The till's slot read goes through the check, so a cart titled "Points" or "Deduction from Points", ignoring letter case and surrounding spaces, is ours to count, strip and recheck
- [x] 1.4 The till panel row takes its own copy instead of the wire title
- [x] 1.5 Tests name the title through the contract, and the tablet recordings stay as recorded
- [ ] 1.6 The readers' tests cite the scenario each proves: the till counts and strips a marked sale's "points" discount before the order id, and never an offer or a code titled the same, in `integrations/shopify-pos/grade10/src/acts/spend.test.ts` and `acts/flow.test.ts` (`grade10-site-store-membership-SC-82`); settlement reads the points share under "Points" and " deduction FROM points " in `packages/grade10-store/backend/test/services/coupons/settle.test.ts` (`grade10-site-store-membership-SC-83`); a paid order naming discounts, none under either title, reads no points allocation, in `packages/grade10-store/contracts/test/saleMarks.test.ts` and `settle.test.ts`, and is debited the applied total less every other instrument, never more than promised, in `packages/grade10-store/backend/test/services/loyalty/pointsSpend.test.ts` (`grade10-site-store-membership-SC-84`); a points title keyed on a sale with no order id refuses a points spend and a coupon alone in `acts/spend.test.ts`, and the panel shows no points field, no coupons and no Apply in `acts/view.test.ts` (`grade10-site-store-membership-SC-85`)
- [ ] 1.7 Verify: the store contracts, store backend and till extension tests, and typecheck

## 2. Release 1 (grade10) (owner: @ecchochan)

- [x] 2.1 Deploy the store to staging and publish the till version for a person to release
- [ ] 2.2 Walk the staging tablet: a spend, a strip and a paid sale settle as before; a fixed order discount keyed as "Deduction from Points" keeps its whole title on the cart row, the order summary and the paid order (`docs/architecture/shopify-verification.md` §23)
- [ ] 2.3 Release 1 in production: the store deployed, the till version activated at every location, and its client version number recorded in the verification doc for the gate in 3.5

## 3. Writers switch (grade10)

- [ ] 3.1 Tests first: the online draft and the till's cart write carry "Deduction from Points", the till's write confirmation passes under it, and a parked "Points" sale re-applied goes back on under it; the browser till, the admin simulator and the demo lane read the title through the contract (`grade10-site-store-membership-SC-81`, `grade10-site-store-membership-SC-86`)
- [ ] 3.2 `POINTS_DISCOUNT_TITLE` becomes "Deduction from Points"; the pull request stays open until the gate in 3.5 (`grade10-site-store-membership-SC-81`)
- [ ] 3.3 Verify: the store contracts, store backend, till extension and demo tests, the till's size budget, and typecheck
- [ ] 3.4 Staging, through the `deploy:staging` label and a staging till version published from the branch: a spend online and at the till passes the extension's write confirmation under the new title, and the cart row, the printed receipt and the paid order show it whole
- [ ] 3.5 Production: once every location's manager confirms release 1 is active and the audit rows show no client version below release 1's for 7 days, merge, deploy the store and publish the till version; the managers' release notes say release 1 is the oldest version that may be activated

## 4. Say what changed (grade10)

- [ ] 4.1 The verification doc records the new title's tablet walk and a new recording of the three sales
- [ ] 4.2 The store contracts handbook card names the new subpath and why

## 5. The pages follow release 2 (grade10-spec)

- [ ] 5.1 Once release 2 is live in production, Shopify Integration's payload examples carry "Deduction from Points", and the 🚧 comes off Paying with Points and Shopify Integration in the same commit

## 6. The walk (grade10)

- [ ] 6.1 After group 3 reaches staging, review the feature suite (`/tcs-review name-points-discount-deduction`) as input to the walk
- [ ] 6.2 Walk US-02 end to end in the counter journey (`apps/backend/grade10/store/test/db/counterJourney.spec.ts`): a till sale promised, sold and paid under "Deduction from Points" debits the balance once, and a sale written as "Points" before the switch settles the same way (`grade10-site-store-membership-SC-81`, `grade10-site-store-membership-SC-83`)
- [ ] 6.3 In the walk's commit, mark only the cases the walk decides to automate with `pnpm run tcs:automated <case…> --decided-by <walk path>`; name manual cases, the printed receipt among them, in the suite and in the change's `rounds.md` row
- [ ] 6.4 Verify: the store database lane, `pnpm run tcs:validate` and `pnpm run validate:changes name-points-discount-deduction`
