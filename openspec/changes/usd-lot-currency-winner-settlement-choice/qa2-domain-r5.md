# QA2 Domain Reconciliation - usd-lot-currency-winner-settlement-choice (R5)

## Done

- Integrated current-case fixture and assertion corrections into the two domain suites. The blind QA1 files were not copied over whole suites. Current QA2 changes remain draft where the current case was draft, preserve opaque case IDs, and bump revisions from the current revision.
- R5 supersedes earlier `qa2-context.md`, `qa2-admin.md`, and `qa2-winner-order.md` dispositions only for `TC-sjg` and the five internal feature links named below. Their previous no-link or old-fixture conclusions are historical; this report records the integrated fixture and verified links.
- Admin `US4-TC2` (`g10adm.auction-dmn.TC-sjg`) is rev5. Its shared close fixture matches internal-bid `SC-71`, `SC-73`, `SC-75`, winner-order `SC-277`, and post-sale `SC-253`: Harbour Cards wins USD 10,100; the USD premium is 2,020; USD shipping is 1,001; converted HKD lines total 79,300 + 15,900 + 7,900 = 103,100. The route checks exactly one order, invoice `not_issued` at close, HKD/FPS, no setup, operator quote and send, expiry, manual cancellation, stock return, and no order letters to any recipient from close through cancellation.
- Site case fixture updates by opaque marker: `TC-yqv` rev3, `TC-rl3` rev4, `TC-5pk` rev4, `TC-r2v` rev3, `TC-0cq` rev4, `TC-wrl` rev3, `TC-5yl` rev2, `TC-wh3` rev3, `TC-n2z` rev2, `TC-nhf` rev4, `TC-fp8` rev4, `TC-3iz` rev3, `TC-8w7` rev3, `TC-cru` rev4, and `TC-b5t` rev4. IDs, routes, classifications and existing statuses were preserved. Corrected ranges follow the USD increment tiers. `TC-r2v` now uses the $50 increment at the $5,700 maximum; `TC-b5t` places $3,400 in the 100,000-499,999 minor-unit range.
- `TC-wrl` remains draft, `Automation status: manual`, and `Testability: automation, manual`; only its current-bid range changed. `TC-k4p` remains rev3 with its exact USD 101.00 / 20.20 / 10.01 fixture; USD subtotal 13,121; HKD subtotal 103,100; HKD gross-up fee 3,873; payable 106,973. Its expected results keep HKD totals and fee absent before the operator quotes and sends, then show the fee after invoice send.

## Considerations & Trade-off

- The internal feature suite had five existing links whose numeric fixtures did not match the revised internal close chain. They now use `covers=none` and have bumped revisions: `TC-rzs` rev4 (heading suffix 4), `TC-cww` rev3 (suffix 3), `TC-dqh` rev3 (suffix 3), `TC-kgs` rev3 (suffix 3), and `TC-2d2` rev3 (suffix 3). The admin domain `TC-sjg` heading suffix is 5, matching marker rev5. Their representative tests remain intact.
- The five scoped site contracts were read: `account-record`, `auto-bidding`, `bidder-suspension`, `listing-page`, and `notifications`. No new domain `covers` link was added from them. Existing cross-feature cases share several themes, but their exact pre-state, amount, audience, or expected mail checks do not fully assert the scoped scenarios.
- Site `TC-k4p` retains its existing winner-order links, `g10.auction-winner-order.SC-ug0` and `SC-fq4`. The other current and historic trace group headings remain unchanged.

## Questions & Blockers

None. This is a test coverage limitation, not an unresolved product decision. Planned implementation verification remains in tasks 6.10 and 11.8 for the full internal close-to-cancel route and the exact internal/winner close scenarios. Site auction behavior remains planned in tasks 7.7-7.11.

## Follow-up

- Run the named implementation verification tasks after implementation. These tasks are not yet executed.
- Scoped checks run: `pnpm run tcs:validate -- openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/domain-tcs.md` and `pnpm run tcs:validate -- openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/internal-bid/feature-tcs.md`. Both have zero errors. The domain suite has three existing warnings for other cases without post-hoc scenario links; the internal feature suite has no warnings. The site domain validator was not rerun in this follow-up. No product tests were run. The validator reports required Node 24.14.1 but ran under Node 26.9.0.

## Case and scenario dispositions

| Scope | Case or scenario | Disposition | Evidence / planned verifier |
| --- | --- | --- | --- |
| Admin domain | `g10adm.auction-dmn.TC-sjg` | Rev5; exact shared fixture; covers internal-bid `SC-71/73/75`, winner-order `SC-277`, and post-sale `SC-253`. | USD 101.00 + USD 20.20 premium + USD 10.01 shipping = HKD 1,031.00 after per-line conversion. Tasks 6.10 and 11.8 are planned implementation verifiers. |
| Admin internal bid | `grade10-admin-auction-internal-bid-SC-71` (`SC-nl0` rev3), `SC-73` (`SC-6fc` rev3), `SC-75` (`SC-jzh` rev1) | Covered by `g10adm.auction-dmn.TC-sjg` rev5 with the exact USD/HKD fixture and route assertions. | Tasks 6.10 and 11.8 are planned implementation verifiers; no implementation proof is claimed here. |
| Site winner order | `winner-order-SC-277` (`g10.auction-winner-order.SC-los` rev7) | Covered by `TC-sjg` rev5; winning bid matches at 10,100 USD minor units. | Tasks 6.10 and 11.8 are planned implementation verifiers; no implementation proof is claimed here. |
| Internal-bid feature suite | `TC-rzs` rev4, `TC-cww` rev3, `TC-dqh` rev3, `TC-kgs` rev3, `TC-2d2` rev3 | Removed their outdated scenario covers because their existing numeric fixture values do not match revised SC-71/73-derived cases. Retained representative tests and other fixture values. | Mechanical heading suffixes now match marker revisions. Scoped validator reports zero errors for this suite. |
| Site settlement | `TC-k4p` | Retain rev3 and its two existing winner-order scenario links. | The full setup-to-quote/send route and fee timing are asserted. |
| Site bid math | 15 cases listed under Done | Retain each case with corrected current USD fixture/range and revision; no new scenario links. | Tasks 7.7-7.9 cover schedule outcomes and auction-history reads. |
| Site account record | Changed `SC-64`, `SC-66`, `SC-67`, `SC-69`, `SC-70`, `SC-71`, `SC-65` | No domain link claimed. | The scoped scenario amounts/route differ from the current domain assertions, or require an account-state transition the domain case does not drive. Tasks 7.7 and 7.9 are planned. |
| Site auto-bidding | Changed `SC-09` through `SC-18`, `SC-30`, `SC-30a`, `SC-31` through `SC-47` as present in the scoped contract | No new domain link claimed. Existing cases cover representative two-maximum and house policies but do not match all scoped exact amounts, starting states, or house-time transitions. | Tasks 7.7 and 7.8 are planned. |
| Site bidder suspension | `SC12`-`SC16` | No domain link claimed; no domain case starts with a suspended account or asserts its invoice remains payable. | Task 7.11 is planned. |
| Site listing page | `SC-29`-`SC-32`, `SC-41`, `SC-43` | No domain link claimed. `TC-wrl` tests shared-link hydration; it does not assert the full live-bid / Outbid / 132,500 next-minimum THEN for `SC-43`. | Task 7.10 is planned for `SC-43`. |
| Site notifications | `SC-49`-`SC-54` | No new domain link claimed. `TC-88l` reads representative outbid and close letters, but does not assert every scoped exact-price, letter-recipient, or no-letter THEN. | Tasks 7.7 and 11.8 are planned for house close letters and internal-order mail. |

## Source fingerprints

- QA1 input manifest SHA-256: `191d57ae71acceee9e16c4496c711e566ec4b903451fab771b1ac84f11d96faa`; manifest digest: `4c0f429bb19757925c710ded1fb89c06410660e6ea5b14302f9d2fe2303ce858`.
- QA1 admin domain output SHA-256: `3e6ba67e2c91db6f0c6780fb2a9baaf6deb76cf5e6d555e5b1b021e3e1e740ca`.
- QA1 site domain output SHA-256: `d2bc9df42e9f2ef6317376457cc571c9da9527d0d63aa407fb2eeadc50ba0a28`.
- Active planning skill SHA-256: `e01f7b0e9bc0ce004c9d44328fc026c5d3696500fb610eb848b1f539d8aa7af4`.
- `specs-to-test-cases.md`: `d0be740ea9150360f08c6f73b5494e827a5ddce235369112367bfba18ccae0be`.
- `tcs-conventions.md`: `4badf297be3411c9c9d143a95522ea81ad80a4172e5f7ce0a286c683084b4767`.
- Scoped contract SHA-256 values: admin post-sale `50ee33fab41a0d47412a6b6669e08c16df184f75b3025be936b02bdb7502a188`; site account-record `d053fce17dcd9728ae0bf5238e1b76fffb3cff3b1447ff6b9cdcba1c50a1a042`; auto-bidding `33f8d9e6f9897f952408e4c920e00cc0d32a3af6edf74d0dffc42df95a11ff14`; bidder-suspension `c837498440ef5ce93fb34bf12a06c643cae4622bb9cc6c67e3d41591eeeec143`; listing-page `16f8ec38a3874dd91995672c0b1bc778e1192ccf2d594e26e2c2d24262b80068`; notifications `a768bccebc02793ce68fc38ae70f5648e40feb4ee0e7ca1f560b85df94b1d83`.
- Current domain suite SHA-256 after R5 reconciliation: admin `66287b23690c09c668e9557f2f47c0c856e64febd683578756769812130f75ac`; site `3756886b4eae0da9c2b58acf7ebcaa6aa7ac161fee8b0216f885e14f017fc5c6`. Current internal-bid feature suite SHA-256: `fc394a599be853f3d66a3373b84fd30be32b8b10c68c1fb647fa5643d4c3cac6`. Updated scenario source SHA-256 values: internal-bid `b9f5d782933af711ea7a2d88c713c51e632bcc25bfb944af7737ffb0fe0818b2`; post-sale `50ee33fab41a0d47412a6b6669e08c16df184f75b3025be936b02bdb7502a188`; winner-order `01e643666621190dbc56b4d7d400cafd5c31a00bf9cf299c7cd0074fcf23c6ab` (SC-277 rev7). The internal-bid scenario markers are SC-71 `g10adm.auction-internal-bid.SC-nl0` rev3, SC-73 `g10adm.auction-internal-bid.SC-6fc` rev3, and SC-75 `g10adm.auction-internal-bid.SC-jzh` rev1. Winner-order SC-277 is `g10.auction-winner-order.SC-los` rev7. These are the current source fingerprints used to verify each `TC-sjg` cover value.

`git diff --check` passed for the two owned domain suite files. No product tests were run.
