# QA2 reconciliation: winner-order

**Change:** `usd-lot-currency-winner-settlement-choice`
**Run:** 2026-10-14, independent QA2 on `/private/tmp/accept-review-1155-git`.
**Inputs read:** Revised PRDs, proposal, decisions and Raised table, user journeys, tech design, current winner-order delta, durable winner-order baseline, current QA1 feature cases, and `docs/governance/specs-to-test-cases.md`; pre-QA2 Dev review preflight was `READY` in `/private/tmp/accept-review-1155-preqa2-review.json`. The blind QA1 report was `/private/tmp/qa1-1155-site-output/qa1-report.md`. QA2 read the revised requirements and scenarios only after the blind cases were integrated.
**Method:** Every existing blind case was dispositioned before adding or correcting `covers` links. No case was generated from a scenario. The only changes below repair existing cases inside their original journey anchors; all changed cases remain `draft`.

## Blind-case dispositions

| Case | Disposition |
| --- | --- |
| `TC-n3p` | Repair in US8 anchor: vary the USD minimum by row and assert exact USD2,500/200/500/3,000 and USD1.01/0/0.20/1.21 outcomes; rev 3. |
| `TC-zt4` | Retain; the USD1 minimum example remains within US8 and has no exact matching scenario fixture. |
| `TC-dd3` | Retain; calculation boundary case remains a draft. It does not assert invoice-send route. |
| `TC-i06` | Retain; fully checks the sent and reissued premium transition. |
| `TC-xji` | Retain; the HKD conversion of premium and USD minimum is required by US8, but no scenario states this combined outcome. |
| `TC-w18` | Repair within US9: drive HKD/FPS setup, invoice send, then the FPS details dialog; it covers SC-181 and SC-299. It remains a duplicate candidate with TC-vvf; rev 4. |
| `TC-eu8` | Repair within US9: start from a USD-won order, choose currency and rail, inspect offered choices before confirm, then assert the persisted bank-transfer rail and Preparing Invoice; covers SC-90 for HKD/FPS. Rev 3. |
| `TC-9v4` | Repair US9 assertion to include SWIFT memo warning and no copy controls on bank detail rows; rev 5. Covers SC-95, SC-182 and SC-183. |
| `TC-vvf` | Retain; precise FPS dialog case is a duplicate candidate after TC-w18 was repaired; no cover link assigned. |
| `TC-x85` | Repair within US3: add the exact SC-40 operator quote/send route and no-premium-input assertion while retaining SC-41/42 rows; rev 3. |
| `TC-4dz` | Repair within US1: retain the FPS row and add the HK Local row for Card-to-rail change, confirming each recorded rail; rev 3, covers SC-93. |
| `TC-csb` | Retain; covers no-card-rule outcomes for HKD and USD, including the HKD rail choices. |
| `TC-ayp` | Retain; setup choices are unselected and fully assert SC-278. |
| `TC-79a` | Retain; USD/HKD invoice rows verify the selected settlement-currency pricing and line conversions for SC-281. |
| `TC-8ea` | Retain; HKD-sent invoice write to USD is refused and HKD remains, matching SC-282. |
| `TC-a61` | Retain; missing-currency confirmation and unchanged order match SC-279. |
| `TC-x0r` | Retain; confirms HKD and Preparing Invoice, matching SC-280. |
| `TC-flb` | Retain; operator pre-send currency correction and winner write refusal match SC-300. |
| `TC-r4x` | Retain; invoice reissue in USD preserves replaced HKD invoice, matching SC-301. |
| `TC-52z` | Retain; exact USD and HKD method sets match SC-293 and SC-294. |
| `TC-7j7` | Retain; asserts clearing only, not refusal of confirmation, so no SC-295 link. |
| `TC-vje` | Retain; full switch-clear-and-refuse path matches SC-295. |
| `TC-rwy` | Repair within US25: retain the Card row and add HK Local as a second still-offered method, covering SC-296; rev 2. |
| `TC-2ac` | Retain; invalid method confirmation refusal and no persisted setup state match SC-298. |
| `TC-jfi` | Retain; HKD fee wording and no-selection assertions match SC-91. |
| `TC-pes` | Retain; details-availability rows match SC-92 and SC-226. |
| `TC-a8g` | Retain; currency-specific fee ranges match SC-303. |
| `TC-ac5` | Repair within US26: assert exact SC-283/284/285 fixtures and invoice PDF disclosure for SC-288; rev 3. |
| `TC-nf6` | Repair within US26: set SC-289 total/payment fixture and assert receipt plus payment-confirmed letter outputs; rev 3. |
| `TC-9dm` | Retain; post-selection letters assert settlement-currency amounts and the pre-selection won-lot exception; no single scenario covers this full set. |
| `TC-q56` | Retain; refund currency is required by the anchor but no scenario covers it. |
| `TC-3ly` | Retain; exact HKD card-fee rule, fee and payable total match SC-286. |
| `TC-uz6` | Retain; unit conversion cases cover SC-283/284 values but scenario links go to invoice route case TC-ac5; keep unit test unlinked. |
| `TC-k5y` | Retain; no-rate assertions exceed scenario-specific surfaces but the anchor and requirement prohibit rate disclosure anywhere. It has no full scenario THEN match. |
| `TC-one` | Retain; USD-typed bank transfer fee conversion and sum match SC-302. |
| `TC-vwm` | Repair within US27: retain exact card row and add bank-transfer row for the same source amounts, asserting its HKD subtotal without a card fee; rev 3, covers SC-290 and SC-304. |
| `TC-7qs` | Retain; USD-only total and absence of HKD subtotal/fee match SC-291. |
| `TC-17a` | Retain; pre-send absence of HKD total plus USD lot-card bid match SC-292. |

## Scenario/source reconciliation and findings

Use the case-level matrix in [`feature-tcs.md`](specs/grade10-site/auction/winner-order/feature-tcs.md) as the persisted short form. Source paths below are repository-relative from the active checkout and line references identify the governing text.

- **Journeys:** [`user-journeys.md`](specs/grade10-site/auction/winner-order/user-journeys.md#L1) declares US1/03/08/09 and US24/25/26/27. All eight declared journey anchors are represented in the suite.
- **Currency and conversion:** [`winner-order/spec.md`](specs/grade10-site/auction/winner-order/spec.md#L36) lines 36-214 cover SC-278 through SC-289; exact line rounding is `10000 -> 78500`, `10100 -> 79300`, `1001 -> 7900`, and the line-sum fixture is 103100. Repaired `TC-ac5` now asserts all three invoice fixtures; SC-287 goes to planned pricing test task 6.1.
- **Summary:** [`winner-order/spec.md`](specs/grade10-site/auction/winner-order/spec.md#L247) lines 247-314 cover SC-290, SC-304, SC-291 and SC-292. `TC-vwm` matches both SC-290 and SC-304; its card row asserts SC-304's exact values: USD lines 10,100/2,020/1,001; rounded HKD lines 79,300/15,900/7,900; subtotals 13,121 and 103,100; HKD fee 3,873; payable 106,973.
- **Premium:** [`winner-order/spec.md`](specs/grade10-site/auction/winner-order/spec.md#L521) lines 521-606 govern SC-40/41/42/43/46/47. `TC-n3p` adds exact SC-46 and SC-47 rows; `TC-x85` asserts SC-40/41/42 through the operator quote/send and winner invoice route; `TC-i06` asserts SC-43.
- **Methods:** [`winner-order/spec.md`](specs/grade10-site/auction/winner-order/spec.md#L606) lines 606-874 govern method availability, switch/reset, and card-rule states. Corrected links now correspond to exact rows and steps. SC-296 and SC-93 are covered by repairs that add the exact HK Local fixture to existing cases.
- **Bank details:** [`winner-order/spec.md`](specs/grade10-site/auction/winner-order/spec.md#L875) lines 875-993 state one picked rail, no tabs/copy, the memo warning, and OUR note. SC-95 has a historical title by explicit note at lines 913-918. `TC-9v4` was repaired to assert the memo warning and no copy controls. SC-299 is covered by repaired `TC-w18`, which now combines setup, send and viewed details.
- **Internal order:** [`decisions.md`](decisions.md#L46) Q20 and [`winner-order/spec.md`](specs/grade10-site/auction/winner-order/spec.md#L1064) SC-277 agree on automatic HKD/FPS and no setup. The revised admin domain case [`grade10-admin-auction-e2e-US4-TC2-3`](specs/grade10-admin/auction/domain-tcs.md#L253), with trace id `g10adm.auction-dmn.TC-sjg`, now asserts exactly one internal order, `not_issued`, HKD/FPS, the internal bidder's address, Preparing Invoice, no setup, no invoice at close, and no won, address, invoice, payment or other order letters to any recipient. It fully asserts the scenario's close outcome. It uses a different valid USD bid fixture (505,000 minor units) than the scenario example (30,500); both exercise the same required close behavior.
- **Bank transfer fee:** current [SC-302 scenario](specs/grade10-site/auction/winner-order/spec.md#L464) and `TC-one` agree: USD 5,000 minor converts to HKD 39,300, and total is HKD 142,400. No contradiction remains.

## Remaining gaps and out-of-suite cases

- **SC-282 sent-invoice direction:** repaired case TC-8ea matches the specified HKD invoice to USD write path and is linked.
- **SC-296 still-offered method:** repaired TC-rwy adds an HK Local row and covers the exact method.
- **SC-90 recorded rail:** repaired TC-eu8 reads method choices, confirms setup, and asserts the bank-transfer FPS rail and Preparing Invoice state.
- **SC-93 method change:** repaired TC-4dz adds the HK Local confirmation row alongside FPS.
- **SC-299 setup-to-invoice rail:** repaired TC-w18 drives from setup through send to View Bank Details.
- **SC-285, SC-289:** initially uncovered by case shape; repaired existing TC-ac5 and TC-nf6 within US26 to assert their exact fixtures and full outputs.
- **Out of suite:** SC-287 goes to planned pricing test task 6.1 because the rate is a code constant; SC-94/249/257 to durable setup/deadline cases; unchanged invoice-field cases and lot-close cases stay with their durable suites. SC-277 is recorded as **Covered at domain** above.

## Contradictions, overclaims and duplication

- **Contradictions:** None in the current winner-order sources. SC-95 title is explicitly marked historical and its active scenario body requires only HK Local. SC-302 is corrected to 39,300/142,400. SC-277 agrees with Q20 and the domain verifier asserts the full close outcome.
- **Overclaim:** TC-k5y reads additional surfaces (setup choice and summary) but the requirement broadly bars rate disclosure on any page; it is kept unlinked because no scenario THEN includes all those surfaces.
- **Duplicate candidate:** TC-w18 and TC-vvf both read FPS detail fields. TC-w18 owns SC-181 and SC-299 after its route repair; TC-vvf remains unlinked. TC-7j7 and TC-vje both assert method clearing, but only TC-vje asserts the linked refusal.
- **No fabricated status:** all changed cases remain draft; no manual or automation result is claimed.

**Case lifecycle:** All new or changed cases remain `draft`; IDs are preserved. Ten existing cases were repaired within their original anchors: TC-n3p, TC-w18, TC-eu8, TC-9v4, TC-4dz, TC-rwy, TC-x85, TC-ac5, TC-nf6 and TC-vwm.

## Validation boundary

This is a planning QA reconciliation, not an execution result. No product tests were run. The scoped command `pnpm run tcs:validate -- usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/winner-order/feature-tcs.md` passed with no errors and 11 nonblocking QA2-pending or property-order warnings. The current full-store `pnpm run tcs:validate` receipt is `/private/tmp/accept-review-1155-qa2-cases-diagnostic.txt`; it reports three errors elsewhere in this active change: bid-payment-method retains a Reviewed line after leaving approved; the site domain status count is stale (2/26 vs 2/28); and the automated case `g10.auction-dmn.US6-TC1` lacks a Decided by line. These do not occur in the winner-order suite. Other suites also emit duplicate-trace and archived-case diagnostics, but those are not validator errors in this run.
