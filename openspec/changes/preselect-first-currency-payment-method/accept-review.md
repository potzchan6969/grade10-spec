reviewed: 0a5e152f2a9a5d1efa7cdf1d94fa7d265df422f4
source-identity: f48640fef72d1d79e47fb4cd1a1f318b338602a8803e793009afb45b3cbf956c
baseline-identity: 5a10360969e85fc1027704aeadce1a99f7557f1e980bbe7a80a46046f34a57dd
verdict: Not ready - 1 blocker

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `openspec/specs/grade10-site/auction/winner-order/feature-tcs.md` `US9-TC23` (`TC-bmd`, covers `SC-8dl`), `US9-TC22` (`TC-eu8`, covers `SC-v59`), `US1-TC51` (`TC-miy`, covers `SC-wn1`) · delta `specs/grade10-site/auction/winner-order/feature-tcs.md` `## Reconciliation` | Three durable cases cover scenarios this change revises and are neither revised nor dispositioned. `US9-TC23` still expects `Bank fee set on your invoice` and "Neither method is selected" - the opposite of `SC-91` rev 3 (bank rails read no fee line, card selected). `US9-TC22` step 1 expects "none selected" - `SC-305` selects the first method. `US1-TC51` has the winner "choose no payment method, and confirm" - with a preselected radio choice the winner cannot reach that state; it is reachable only after a currency switch (`SC-295`) or with no method offered (`SC-249`), and `SC-94` repeats the same unreachable GIVEN. Folded as is, the durable suite holds cases that fail on the first walk. | Dev (@tangconst) | the delta `feature-tcs.md`: revise or retire `TC-bmd` (it duplicates revised `TC-jfi`), fix `TC-eu8` step 1, re-ground `SC-94` and `TC-miy` on a cleared method, and add the three rows to `## Reconciliation` | open |
| 2 | fix | `tasks.md` 2.1-2.2, 3.1 · `specs/grade10-site/auction/winner-order/spec.md` `SC-91` · `specs/grade10-admin/auction/test-winners/spec.md` `SC-11` | Q5 (bank rails read no fee line) is a requirement with no task: 2.1 names only `SC-278`, `SC-305`, `SC-306`, and 2.2 verifies only `US24-TC1` and `US25-TC9`. `@grade10/i18n` `auctionOrders.json` `fee.bankTransfer` still reads `Bank fee set on your invoice`. The test-winners requirement (`SC-11`) has no consumption or walk row either. | Dev (@tangconst) | `tasks.md`: add `SC-91` and `SC-11` to 2.1, `US25-TC6` to 2.2, and drop `fee.bankTransfer` from the catalog | open |
| 3 | fix | `docs/prds/products/grade10-admin/auction/management.md:576` | `check:manual` warns: 🚧 sits mid-line in the `Bid and settlement` row; a mark starts an outcome's line | Product (@tangconst) | the page | open |
| 4 | note | `specs/grade10-site/auction/winner-order/spec.md` `SC-278` | The title "...with neither picked" is now false. The delta says so and keeps title and id by convention | - | - | open |
| 5 | note | `openspec/specs/grade10-site/auction/domain-tcs.md` `US12-TC3` | Carried from the prior review: stale against `order-summary-hkd-conversion-note`, which this change does not touch | - | a later suite refresh | open |

Carried and verified fixed since the 2026-10-20 review: the three "nothing preselected" page lines, the `US25-TC9` numbering, the test-winners journeys file, the `US12` story, the `## Raised` split. Pages `post-bidding.md#order-setup`, `#payment-methods-by-currency` and the `:243` currency-switch line agree with the delta; `check:manual` reports 0 failures; `accept:preflight` reports ready to fold and accept.

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| proposal.md, decisions.md, tasks.md, .openspec.yaml | 0a5e152f2 | page-to-delta, nothing-open (Raised rows land on Q1, Q2), waivers recorded | - |
| specs/grade10-site/auction/winner-order/spec.md | 0a5e152f2 | folded-result against durable requirements and scenarios `SC-90`..`SC-94`, `SC-226`, `SC-248`..`SC-257`, `SC-278`; no durable requirement left contradicting | - |
| specs/grade10-admin/auction/test-winners/spec.md | 0a5e152f2 | folded-result; feature set line replaces durable "nothing preselected" | - |
| feature-tcs, domain-tcs, user-journeys deltas | 0a5e152f2 | cases stay draft; durable cases on revised scenarios searched - finding 1 | - |
| docs/prds post-bidding.md, management.md | 0a5e152f2 | same-facts; 🚧 lines served - finding 3 | 2026-10-20 review (three lines fixed) |
| usd-lot-currency-winner-settlement-choice | accepted 2026-10-13 (`acceptance.json`) | overlap: amendment recorded at decisions.md Q1 | 2026-10-20 review |
| add-auction-internal-bid, convert-hkd-order-at-subtotal | 0a5e152f2 | overlap: no shared requirement, no shared scenario id | - |
| pnpm plan:review-preflight --json | ready, no blockers | manifest, overlaps, durable targets | - |
| pnpm accept:preflight | ready to fold and accept | gate receipt | - |
| pnpm check:manual | 0 failures, 348 warnings | one names this change (finding 3) | - |
