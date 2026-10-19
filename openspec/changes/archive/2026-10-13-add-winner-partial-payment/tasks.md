## 1. Product record (grade10-spec) (owner: @htonyl)

- [x] 1.1 Update the auction payment, post-sale, order-status, account-record and Winner Order PRD pages with partial collection and the closing tolerance (`grade10-admin-auction-post-sale-SC-140`, `auction-status-SC-49`, `winner-order-SC-156`).

## 2. Contracts and data (grade10) (owner: @htonyl)

- [x] 2.1 Add the payment-history, balance, receipt and tolerance types to the auction contracts.
- [x] 2.2 Add the append-only payment table, indexes and receipt-number migration without changing the invoice quote.

## 3. Backend (grade10) (owner: @htonyl)

- [x] 3.1 Implement idempotent operator payment recording, balance validation, the 90% refusal below the tolerance and the close-or-keep decision (`grade10-admin-auction-post-sale-SC-140`–`SC-144`).
- [x] 3.2 Derive Partially Paid and remove Pay, reissue, cancellation and the payment deadline after the first payment (`auction-status-SC-49`, `SC-50`).
- [x] 3.3 Count only a payment that counts toward the balance when refusing Reissue and Cancel and deriving Partially Paid; money that counts toward nothing blocks neither and moves no status (`grade10-admin-auction-post-sale-SC-242`, `auction-status-SC-49`, `SC-58`).

## 4. Frontend (grade10) (owner: @htonyl)

- [x] 4.1 Render the operator payment history, remaining balance, tolerance prompt and overpayment confirmation.
- [x] 4.2 Render the locked Partially Paid Winner Order and My Auctions row with every receipt (`winner-order-SC-156`, `grade10-site-auction-account-record-SC-62`).

## 5. Verification (grade10) (owner: @htonyl)

- [x] 5.1 Run the domain cases, contract tests, migration checks and the focused admin/site E2E journeys.
- [x] 5.2 Run `post-sale-US12-TC7-1` and `auction-status-US7-TC5-1` against money that counts toward nothing.

Every checked task above was built before this change was accepted; each is re-verified against the accepted contract before it is read as done. Tasks 3.3 and 5.2 come from the amendment that carries the counts-toward-nothing rule (`decisions.md` Q21).


## Delivery Verification

- **Revision** - [Grade10 PR 1127](https://github.com/9gag/grade10/pull/1127), commit `e564fb611f76a97f25fed9595a53099d38a1ae74`.
- **Task 3.3** - Pending Payment with only non-counting payments permits Cancel. Empty Pending Payment and counted or mixed payment histories keep their refusal rules. Reissue and status derivation already use the counted-payment rule. Red-first contract and persisted regressions passed after the correction.
- **Task 5.2** - The two named draft cases were executed as engineering regressions with a signed local fake payment event. Reissue and Cancel preserve the mismatched payment; the winner remains Pending Payment. Human QA classification and execution records stay unchanged.
- **Local checks** - `pnpm check:quick --base=8ac28bb1db68cd89da02f4c3680253494a132ee8` passed on the delivered revision. `pnpm test:backend` passed all 57 packages, including 113 auction-service files and 728 tests. `pnpm build` and `pnpm check:store-tcs` passed. The full backend and build runs used `f35c821ac5`; subsequent changes only corrected browser selectors.
- **Browser checks** - The four targeted mismatch, winner-status, operator-edge and partial-payment tests passed together with retries disabled. A fresh current-revision run of `bash e2e/run.sh -- tests/auction/non-counting-payments.spec.ts --retries=0 --workers=1` passed both new walks. Run `e2e-mv6ty1ja-3307-9nklhx` verified the served commit before tests started. [Visual proof](https://github.com/9gag/grade10/pull/1127#issuecomment-6149006230) contains the three asserted screenshots, read back through authenticated GitHub.
- **Review and scope** - Standards and Spec review found no material findings. No UI block source or production backend-service target changed; UI ownership shares, backend-service CRAP and mutation are not applicable. No migration or generated API change was needed.
- **Remaining delivery** - All product test and build jobs passed in CI run 38422009944 on the published commit. At archive, its final gate was blocked by the pre-existing failed main E2E run 38408563297. Application merge was not authorized. Deployment and human QA remain separate from archive.
- **Suite warnings** - Archive validation passed with no errors. Its legacy-ID check flags five renamed cases. Their preconditions, steps and results remain in the durable suites as `g10.auction-account-record.US8-TC1`, `g10.auction-order-status.US7-TC3`, `g10.auction-order-status.US7-TC4`, `g10.auction-order-status.US7-TC5` and `g10.auction-winner-order.US20-TC1`. No case was restored or duplicated at archive. Published store commit 1263363b9 removed backtick wrappers from the existing trace comments without changing case content. The implementation record acknowledges that editorial difference from the original claim baseline.
