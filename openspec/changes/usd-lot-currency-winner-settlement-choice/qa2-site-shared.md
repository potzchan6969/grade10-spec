# QA2 site/shared reconciliation

**Change:** `usd-lot-currency-winner-settlement-choice`
**Run:** independent QA2, 2026-10-14
**QA1 input:** `/private/tmp/qa1-1155-site-output/qa1-report.md`
**Dev preflight:** `/private/tmp/accept-review-1155-preqa2-review.json`, source identity `8147b832...`
**Scope:** site auction domain, site auction feature suites for auction, bid increments and notifications/order, and shared UI feature suites for auction listing and auction order. Bid-payment-method is assigned to the separate `qa2-context_r3` worker and is excluded here. Winner-order feature suite is owned by `qa2_winner`; its verified SC-fq4 amounts were cross-checked for the domain order-summary route.

## Method and evidence boundary

I read the planning-dev skill's step 3 and `docs/governance/specs-to-test-cases.md` before reconciling. I read the change proposal, decisions, PRDs and raised items, tech design, task list, relevant delta specs and journeys, durable specs and suites, and related durable payment-settings gross-up contract. I recorded QA2 case dispositions before adding scenario links. I added or retained a `covers` marker only where the route and Expected Results fully assert that scenario's THEN. I did not generate cases from scenarios. No runtime tests were run, no execution proof was added, and no human approval or acceptance is claimed.

A post-hoc marker is traceability only. Cases that changed or were repaired remain `draft`; inherited actual cases retain their prior honest status. Their inherited status is not evidence that this QA2 ran them.

## Dispositions by suite

### `grade10-site/auction/domain-tcs.md`

There are 30 cases: 28 active cases and 2 deprecated cases. `TC-57p` and `TC-cnk` are untouched inherited actual cases; `TC-13a` and `TC-qus` are untouched deprecated cases. The other 26 active cases remain drafts. Case identities and unaffected routes were retained. `TC-k4p` was repaired in place from rev2 to rev3 because its original order-summary reads occurred before invoice creation, which made the HKD total assertion temporally invalid. It now checks no HKD total or fee before confirmation/invoice; confirms HKD and Card; has the operator quote USD10.01 shipping and send the invoice; then reopens the sent, pending-payment order and checks the summary/payable. It asserts USD lines 101.00, 20.20 and 10.01; converted HKD lines 793.00, 159.00 and 79.00; USD subtotal 131.21; HKD subtotal 1,031.00; HKD gross-up fee 38.73 after the separator and outside both subtotals; and payable 1,069.73 HKD. These values match the scenario and the durable Payment Settings gross-up rule. It now covers winner-order `SC-ug0` and `SC-fq4`.

Case disposition register: `TC-23e`, `TC-yqv`, `TC-qvl`, `TC-rl3`, `TC-5pk`, `TC-r2v`, `TC-0cq`, `TC-wrl`, `TC-5yl`, `TC-wh3`, `TC-n2z`, `TC-nhf`, `TC-n6x`, `TC-fp8`, `TC-0rf`, `TC-3iz`, `TC-8w7`, `TC-88l`, `TC-su0`, `TC-acb`, `TC-cru`, `TC-b5t`, and `TC-6dl` were read and retained as draft cases without new scenario links. `TC-57p` and `TC-cnk` retain inherited actual status, untouched. `TC-13a` and `TC-qus` retain deprecated status, untouched. `TC-dw9@4` remains the existing released-address route; its existing claims are retained as bounded to the case's own route and assertions. `TC-wrl` keeps its baseline `Testability: automation, manual`; only `Automation status` changed from automated to manual at rev2. It remains a draft because no existing `Decided by` provenance identifies a current automation result. `TC-k4p@3` is the repaired draft case described above.

Scenario disposition: the sole current winner-order scenario in this site's domain route, `g10.auction-winner-order.SC-ug0`, is fully asserted by `TC-k4p@3`; `SC-fq4` is also fully asserted by `TC-k4p@3` after the temporal repair. No other domain case was relinked. No uncovered current changed-behavior scenario remains in this domain lane.

### `grade10-site/auction/auction/feature-tcs.md`

All three cases remain drafts. Case register: `TC-zsd@3 -> SC-d78`; `TC-5gi@3 -> SC-uhh, SC-l64`; `TC-49i@2 -> SC-ndj, SC-99a`. The `$14,999.00` below-bar row was added to the existing `TC-49i` case; no case identity changed. The route distinguishes verified bid at threshold, held unverified bid at/above threshold with the stated form guidance and no recorded bid, and below-threshold bid without verification checks or standing reads.

All five scenarios on `grade10-site-auction-auction-US-04` are fully covered: `SC-d78` by `TC-zsd`; `SC-uhh` and `SC-l64` by `TC-5gi`; `SC-ndj` and `SC-99a` by `TC-49i`. No changed scenario is uncovered. The identity-store-absent bar requirement remains an unchanged gap: it has no scenario in this change and no case in the durable suite. It is recorded as a requirement-level hole, not a new product decision or a current changed-behavior gap. The USD15,000 bar configuration value itself remains outside this suite's behavioral cases and is verified by the existing launch check.

### `grade10-site/auction/bid-increments/feature-tcs.md`

All 12 cases remain drafts. Case register: `TC-2ed@1 -> SC-vqb, SC-w8f`; `TC-kyx@2 -> SC-ijk`; `TC-n6d@3 -> SC-mn9, SC-u6t`; `TC-9do@3 -> SC-b2w`; `TC-4ox@3 -> SC-c1v, SC-pd0`; `TC-d9d@3 -> SC-hm3`; `TC-dfw@3 -> SC-xnb`; `TC-dlk@3 -> SC-pd0`; `TC-y0l@1` remains unlinked; `TC-fdc@1 -> SC-60d, SC-5ea, SC-gq8`; `TC-sze@1 -> SC-xjw, SC-tke`; `TC-pn8@2 -> SC-ws7`. `TC-9do` was repaired in place to rev3 with a USD104.99 bid against a USD105.00 opening price and an explicit refusal naming the minimum. `TC-fdc` includes EUR as an unsupported-currency create attempt in addition to HKD and JPY. The USD schedule fixtures were checked against the delta's tier arithmetic; no current scenario fixture arithmetic conflict remains.

All 16 scenarios are covered by the linked cases above. `TC-y0l` stays intentionally unlinked: it is a broad same-schedule exploratory route and its current behavior is not fully stated by one scenario; the narrower changed requirements are covered by SCs linked to other cases. The old reconciliation's `SC-03`/`SC-06` hold is stale: current IDs are `SC-u6t` (covered by `TC-n6d`) and `SC-gq8` (covered by `TC-fdc`). Unsupported EUR schedule writes are also covered by the admin listing lane's existing cases, but this site's `TC-fdc` now fully covers its own current scenario. The durable suite's old JPY maximum row remains a publish/archive reconciliation item; it does not create an uncovered delta scenario.

### `grade10-site/auction/notifications-order/feature-tcs.md`

All seven cases remain drafts. Case register: `TC-8bw@3 -> SC-pyd`; `TC-5o0@3 -> SC-tfm, SC-3mo`; `TC-ew9@1` stays unlinked; `TC-vxo@2 -> SC-16k`; `TC-l6s@2 -> SC-0e7`; `TC-xsq@2 -> SC-7qg`; and `TC-i7q@1` stays unlinked. The rows now use USD schedule/winning-bid fixtures and exact matching converted HKD values where applicable. The reissue case preserves the prior letter unchanged while asserting the new payment-reminder letter. The internal bidder no-letter case remains linked to the settled feature-set rule, but has no delta scenario.

All six current delta scenarios are covered: `SC-pyd`, `SC-tfm`, `SC-3mo`, `SC-16k`, `SC-0e7`, and `SC-7qg`. Later reminders and the internal bidder no-letter case have no delta scenarios and remain unlinked. There is no remaining active-source contradiction about which letter invoice send/reissue emits: the active post-sale delta at its send and reissue sections names the payment-reminder letter, matching this capability. The separate invoice-reissued letter is dropped by the product decision. The feature-set shorthand “invoice” is understood as the payment reminder sent with the invoice, not as a second letter. The old contradiction note was withdrawn.

### `shared/ui/auction-listing/feature-tcs.md`

All 14 cases remain drafts. Case register: `TC-fb2@4 -> SC-9e0, SC-q3n`; `TC-ygd@3 -> SC-8ym`; `TC-35i@3 -> SC-wdd`; `TC-jr1@3 -> SC-z2x, SC-qdv`; `TC-bfp@3 -> SC-y2e`; `TC-hsy@3 -> SC-xxl`; `TC-ftm@3 -> SC-z2x`; `TC-g02@3 -> SC-6n7`; `TC-dej@2 -> SC-huw`; `TC-w4r@2 -> SC-atq`; `TC-9rx@2 -> SC-v6g, SC-1mi`; `TC-5dh@2 -> SC-cfl`; `TC-swf@2 -> SC-rnz`; `TC-oem@1 -> SC-2wv`. `TC-fb2` was repaired in place at rev4 to assert the exact 1,000,000,000 USD-minor-unit callback in both set and raise routes. USD fixtures now replace former HKD/JPY schedule examples only where the changed suite requires them. No new case was generated.

The 16 linked scenarios are fully covered. Four scenarios are outside this suite's changed behavior and remain explicit out-of-suite items: `SC-7o5`, `SC-t9f`, `SC-2s5`, and `SC-dv0`; the suite names the existing durable cases that exercise them. Their unchanged durable rows still include older HKD/JPY fixtures that need removal when the durable contract is rewritten at archive. The automated `Decided by` labels on these draft feature cases are not execution evidence; QA2 did not run their E2E deciders. `TC-19` remains a draft manual case after the callback repair. No contradictory case/scenario assertion remains.

### `shared/ui/auction-order/feature-tcs.md`

All 11 cases remain drafts. Case register: `TC-2fz@1 -> SC-cdc`; `TC-3cr@1 -> SC-8j6`; `TC-giz@1 -> SC-7if`; `TC-kiy@1 -> SC-7if`; `TC-bu1@3 -> SC-z03, SC-m7x`; `TC-p6m@2 -> SC-hc5`; `TC-62a@1 -> SC-pd1`; `TC-pm2@1 -> SC-nxj`; `TC-y6r@1 -> SC-bzz`; `TC-mvr@1 -> SC-k6i`; `TC-9r5@1 -> SC-8eq`. `TC-25` uses explicit method choices by currency: USD has Card/HK Local/SWIFT and no FPS; HKD has Card/FPS/HK Local and no SWIFT. `TC-26` checks each HKD bank rail separately. Existing cases remain within their original anchors.

Eleven of 16 scenarios are covered. Five are out-of-suite, with explicit existing verifiers: `SC-xdd` and `SC-tm6` by the public-exports test; `SC-10a` by durable `TC-g9u`/`TC-l1e`; `SC-i3e` by durable `TC-1f8`; `SC-qb6` by durable `TC-fjf`. They are unchanged behavior and are not current coverage gaps. The USD/HKD method partition and separate bank rails are fully asserted by `TC-giz` and `TC-kiy`. No active contradiction remains.

## Anchor coverage, uncovered behavior, and over-claims

The current changed anchors in these six scopes have case coverage. The only recorded requirement-level hole is the unchanged identity-store-absent threshold behavior, which has neither a delta scenario nor a durable test case. It does not block QA2 coverage of the current changed scenarios and must not be silently presented as settled by these suites.

Out-of-suite scenarios above remain out-of-suite for unchanged behavior and name another lane or durable verifier. Each marker was checked against current scenario IDs. No link was added for a case whose route and Expected Results only partially assert a scenario. Changed/repaired cases retain draft lifecycle status. No approval, automated execution, or passed-gate claim is made.
