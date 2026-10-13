# QA2 Context Reconciliation - USD lot currency and winner settlement

## Scope and evidence

This bounded QA2 covers `grade10-admin/auction/internal-bid` and `grade10-site/auction/bid-payment-method`. The blind QA1 report was `/private/tmp/qa1-1155-context-r3-output/qa1-report.md`; its physical bundle digest was `852597efc39b627e7bfdea8bc3d229a253a91404ac60d030951c862b4e97411b`, with all 22 hashes matching. The independent Dev report was `/private/tmp/dev-1155-context-r3-report.md`; the carried admin QA2 report was `/private/tmp/qa2-1155-admin-report.md`. QA1 made no edits. Dev found no product-source gap and did not read feature or domain TCS.

Source identities after this bounded pass:

- **Internal-bid feature TCS** - `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/internal-bid/feature-tcs.md` SHA-256 `d4dbad494cc4171ea8577dd7560e67527c4399eb8e958a881ce159c3fe5c4900`
- **Internal-bid delta spec** - `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/internal-bid/spec.md` SHA-256 `d85248e6466ae60a6ed1cbc45d86a7ce0dcceccd60e170f08c60b659309ee687`
- **Internal-bid journeys** - `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/internal-bid/user-journeys.md` SHA-256 `ffd6d6bc66f359d6ab3a4904f444f1e9699f364b7de362399a0c65d6f666e2cc`
- **Bid-payment-method feature TCS** - `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/bid-payment-method/feature-tcs.md` SHA-256 `0603ebc46a037bdb9b981c007b1f413fea2493ed613f662f2a28b093632d3c60`
- **Bid-payment-method delta spec** - `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/bid-payment-method/spec.md` SHA-256 `f6c92d2f6972999c7fd8e492fc4a877c4f052ab9a12bf1d2bc5f73f6f95cf8ff`
- **Bid-payment-method journeys** - `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/bid-payment-method/user-journeys.md` SHA-256 `da238c1b0fb5ad158ff9a4cc533dac83b0eae667c544fa45607068c7af999690`

## Readonly recheck after metadata fold

The parent restored the exact durable `Purpose` sections and canonical case-group aliases. This reread confirms: internal-bid groups are US-01 through US-09; bid-payment-method groups are US-01, US-02 and US-04; all 71 internal and 13 site trace-case markers are unique; and the 90 internal plus two site `covers` links resolve to current scenarios. The site US1-TC1 legacy heading has no trace marker, as recorded in the case ledger. No case-marker ID repeats. Some scenarios have links from multiple independently complete cases as recorded in the ledger; no marker replacement or coverage overwrite occurred.

The case counts still match the canonical anchors: internal active cases are 13/4/6/4/8/7/12/5/10, excluding the two deprecated historical cases; site cases are 10/2/2, with the legacy unmarked US1-TC1 retained in the 10. The one deliberate group/Trace difference is TC-v7q: it is listed under the restored US-08 group but traces to US-01, matching SC-wib/qzx/ps0 and the carried admin QA2 disposition. US-08 still has its five active cases. The durable Purpose sections match exactly; no scenario, journey or case behavior changed in this metadata fold.

## Disposition rules and anchors

Each case marker was assigned to the next case heading in that marker block. A `covers` link is retained only when the case uses the same route and state and its Expected Results assert the complete active scenario THEN. Candidate links were read against the current scenario bodies, not inferred from scenario titles. Existing IDs and suite routes remain. Cases whose assertions changed have a revision bump; all new or changed cases remain draft. No execution or approval is claimed.

QA1 found active feature-case coverage for all nine internal-bid journeys, and the site US-01, US-02 and US-04 journeys. Current cases retain those anchors. Internal US-01-TC1, US-01-TC2, US-06-TC3 and US-09-TC2 receive in-anchor assertion repairs described below. Site US-04 cases already cover both modified scenarios.

## Internal-bid case dispositions

| Case marker | Status | Scenario dispositions |
| --- | --- | --- |
| `g10adm.auction-internal-bid.TC-d07` rev3 | draft | SC-dq6; SC-glg |
| `g10adm.auction-internal-bid.TC-5y2` rev3 | draft | SC-2s1 |
| `g10adm.auction-internal-bid.TC-39a` rev2 | draft | SC-mxk; SC-5x7; SC-avn; SC-9ve; SC-m8q; SC-ols |
| `g10adm.auction-internal-bid.TC-of0` rev2 | draft | none |
| `g10adm.auction-internal-bid.TC-x4y` rev2 | draft | SC-urt; SC-fti |
| `g10adm.auction-internal-bid.TC-88a` rev2 | draft | none |
| `g10adm.auction-internal-bid.TC-jm4` rev2 | draft | none |
| `g10adm.auction-internal-bid.TC-kyo` rev2 | draft | SC-awq |
| `g10adm.auction-internal-bid.TC-huh` rev2 | draft | SC-tbo |
| `g10adm.auction-internal-bid.TC-dui` rev2 | deprecated | none |
| `g10adm.auction-internal-bid.TC-qzd` rev2 | draft | SC-i7f |
| `g10adm.auction-internal-bid.TC-6a2` rev2 | draft | SC-rzl |
| `g10adm.auction-internal-bid.TC-akn` rev2 | draft | SC-dnq; SC-i32 |
| `g10adm.auction-internal-bid.TC-h13` rev2 | draft | SC-1af |
| `g10adm.auction-internal-bid.TC-qbl` rev2 | draft | SC-jtj |
| `g10adm.auction-internal-bid.TC-1p0` rev2 | draft | SC-1c4 |
| `g10adm.auction-internal-bid.TC-kok` rev2 | draft | none |
| `g10adm.auction-internal-bid.TC-ul9` rev2 | draft | none |
| `g10adm.auction-internal-bid.TC-gem` rev2 | draft | SC-lqc |
| `g10adm.auction-internal-bid.TC-vk1` rev2 | draft | none |
| `g10adm.auction-internal-bid.TC-ben` rev2 | draft | SC-6v8 |
| `g10adm.auction-internal-bid.TC-t5b` rev2 | draft | SC-xfi |
| `g10adm.auction-internal-bid.TC-nrn` rev2 | draft | SC-hsd |
| `g10adm.auction-internal-bid.TC-fku` rev2 | draft | SC-ubh |
| `g10adm.auction-internal-bid.TC-pw6` rev2 | draft | SC-x8q |
| `g10adm.auction-internal-bid.TC-cu7` rev3 | draft | SC-eng; SC-16a |
| `g10adm.auction-internal-bid.TC-79d` rev2 | draft | SC-wmp |
| `g10adm.auction-internal-bid.TC-0l0` rev2 | draft | SC-spg; SC-u2x |
| `g10adm.auction-internal-bid.TC-6at` rev2 | draft | SC-11v; SC-otk |
| `g10adm.auction-internal-bid.TC-7rg` rev2 | draft | SC-quv |
| `g10adm.auction-internal-bid.TC-2dl` rev3 | draft | SC-11v |
| `g10adm.auction-internal-bid.TC-kew` rev2 | draft | SC-ujg |
| `g10adm.auction-internal-bid.TC-wf1` rev2 | draft | SC-te0 |
| `g10adm.auction-internal-bid.TC-jzx` rev2 | draft | SC-qom; SC-x95 |
| `g10adm.auction-internal-bid.TC-ipm` rev2 | draft | SC-oml; SC-r5u; SC-tbl |
| `g10adm.auction-internal-bid.TC-54s` rev2 | draft | SC-r5u |
| `g10adm.auction-internal-bid.TC-rzs` rev3 | draft | SC-nl0 |
| `g10adm.auction-internal-bid.TC-17a` rev3 | draft | SC-u1p |
| `g10adm.auction-internal-bid.TC-vuc` rev4 | draft | SC-on5 |
| `g10adm.auction-internal-bid.TC-cww` rev2 | draft | SC-nl0 |
| `g10adm.auction-internal-bid.TC-dqh` rev2 | draft | SC-6fc |
| `g10adm.auction-internal-bid.TC-kgs` rev2 | draft | partial: expiry status and no letters only; no suspension assertion |
| `g10adm.auction-internal-bid.TC-2d2` rev2 | draft | SC-jzh |
| `g10adm.auction-internal-bid.TC-hy3` rev2 | draft | SC-n08; SC-27a; SC-d57 |
| `g10adm.auction-internal-bid.TC-kku` rev2 | draft | SC-w8v |
| `g10adm.auction-internal-bid.TC-jjr` rev2 | draft | SC-53a |
| `g10adm.auction-internal-bid.TC-rfj` rev3 | draft | SC-ftu; SC-rrc |
| `g10adm.auction-internal-bid.TC-net` rev3 | draft | SC-rzd; SC-36t; SC-wib; SC-n08 |
| `g10adm.auction-internal-bid.TC-r33` rev2 | draft | SC-2l8 |
| `g10adm.auction-internal-bid.TC-g02` rev2 | draft | SC-ftu |
| `g10adm.auction-internal-bid.TC-gnk` rev2 | draft | SC-ftu; SC-27a |
| `g10adm.auction-internal-bid.TC-4b4` rev2 | draft | SC-fs2 |
| `g10adm.auction-internal-bid.TC-mnc` rev2 | draft | SC-epm |
| `g10adm.auction-internal-bid.TC-k1j` rev2 | draft | SC-s2h |
| `g10adm.auction-internal-bid.TC-81p` rev2 | draft | SC-rrc; SC-u1p |
| `g10adm.auction-internal-bid.TC-bgs` rev2 | draft | SC-rzd; SC-bjb |
| `g10adm.auction-internal-bid.TC-96e` rev2 | draft | SC-36t; SC-9xf |
| `g10adm.auction-internal-bid.TC-qxx` rev2 | deprecated | none |
| `g10adm.auction-internal-bid.TC-o5e` rev2 | draft | SC-rzd |
| `g10adm.auction-internal-bid.TC-m9d` rev2 | draft | SC-pzs |
| `g10adm.auction-internal-bid.TC-v7q` rev2 | draft | SC-wib; SC-qzx; SC-ps0 |
| `g10adm.auction-internal-bid.TC-wkj` rev3 | draft | SC-piq |
| `g10adm.auction-internal-bid.TC-kg8` rev3 | draft | SC-h93; SC-tj3 |
| `g10adm.auction-internal-bid.TC-g99` rev2 | draft | SC-ec7 |
| `g10adm.auction-internal-bid.TC-xjb` rev2 | draft | SC-2x8 |
| `g10adm.auction-internal-bid.TC-8at` rev3 | draft | SC-bio |
| `g10adm.auction-internal-bid.TC-skz` rev2 | draft | SC-9ng |
| `g10adm.auction-internal-bid.TC-eo1` rev2 | draft | SC-d57 |
| `g10adm.auction-internal-bid.TC-fnh` rev2 | draft | SC-d6h |
| `g10adm.auction-internal-bid.TC-nbx` rev2 | draft | SC-uem |
| `g10adm.auction-internal-bid.TC-2nf` rev2 | draft | SC-l6i |

Case-level findings:

- **TC-d07 rev3 / US1-TC1-3** - Added a public-facts read immediately after Save. It confirms no bid and unchanged starting price before commit. Retains SC-dq6 and SC-glg full coverage.
- **TC-5y2 rev3 / US1-TC2-3** - Added a read before scheduled close. It confirms Scheduled at exact close, then the existing later read confirms commit. Covers SC-2s1.
- **TC-vuc rev4 / US6-TC3-4** - Added reserve-holder and staff Orders searches by the internal bidder email label after the order opens. Both searches expect no order. Covers SC-on5 (SC-78).
- **TC-kg8 rev3 / US9-TC2-3** - Existing no-billing-address row explicitly refuses and creates no bidder. Covers SC-tj3 (SC-79).
- **TC-v7q rev2 / US8-TC6-2** - Retained the corrected current behavior; EUR, HKD and JPY update rows refuse and preserve the USD listing and bid. Covers SC-wib, SC-qzx and SC-ps0 (historical SC-35/42/43 titles).
- **Deprecated cases** - TC-dui (US1 currency-edit history) and TC-qxx (US8 currency-change history) remain deprecated with `covers=none`; neither claims current coverage.
- **TC-kgs rev2 / US7 expiry route** - Asserts invoice expiry and absence of letters. It does not assert the no-suspension outcome, so it is partial for SC-77a (historical label SC-74) and is not linked as full coverage.
- **Other active cases** - Baseline-linked candidate scenarios were carried only when current THEN assertions remained complete on the case route. Candidate overclaims removed include TC-of0 and TC-jm4 to SC-dq6, TC-88a to SC-5x7, TC-kok to SC-mxk/SC-m8q, TC-d07 to SC-glg before its repair, TC-vuc to SC-nl0, and TC-81p to SC-on5.

## Internal-bid scenario dispositions

| Scenario | Full disposition |
| --- | --- |
| `SC-dq6` - An admin sets an internal bid on a published listing | Covered by `g10adm.auction-internal-bid.TC-d07` |
| `SC-mxk` - A time outside the bidding window is refused | Covered by `g10adm.auction-internal-bid.TC-39a` |
| `SC-tbo` - A time already passed is refused | Covered by `g10adm.auction-internal-bid.TC-huh` |
| `SC-5x7` - An amount above the ceiling is refused | Covered by `g10adm.auction-internal-bid.TC-39a` |
| `SC-i7f` - A second save changes the one internal bid | Covered by `g10adm.auction-internal-bid.TC-qzd` |
| `SC-2s1` - A time at the scheduled close is accepted | Covered by `g10adm.auction-internal-bid.TC-5y2` |
| `SC-avn` - An amount that is not whole is refused | Covered by `g10adm.auction-internal-bid.TC-39a` |
| `SC-9ve` - An amount below the starting price is refused | Covered by `g10adm.auction-internal-bid.TC-39a` |
| `SC-urt` - A draft listing takes no internal bid | Covered by `g10adm.auction-internal-bid.TC-x4y` |
| `SC-awq` - An admin sets an internal bid on a created listing | Covered by `g10adm.auction-internal-bid.TC-kyo` |
| `SC-otk` - An amount below the price at Save waits for its time | Covered by `g10adm.auction-internal-bid.TC-6at` |
| `SC-m8q` - A save with no time is refused | Covered by `g10adm.auction-internal-bid.TC-39a` |
| `SC-fti` - A lot past its scheduled close takes no new internal bid | Covered by `g10adm.auction-internal-bid.TC-x4y` |
| `SC-ols` - A save with no internal bidder is refused | Covered by `g10adm.auction-internal-bid.TC-39a` |
| `SC-1af` - A retired internal bidder is refused | Covered by `g10adm.auction-internal-bid.TC-h13` |
| `SC-dnq` - Before its time the admin changes the internal bidder | Covered by `g10adm.auction-internal-bid.TC-akn` |
| `SC-i32` - After its time the internal bidder is fixed | Covered by `g10adm.auction-internal-bid.TC-akn` |
| `SC-rzl` - One internal bidder serves two listings | Covered by `g10adm.auction-internal-bid.TC-6a2` |
| `SC-rzd` - A window change past the time clears the internal bid | Covered by `g10adm.auction-internal-bid.TC-net`, `g10adm.auction-internal-bid.TC-bgs`, `g10adm.auction-internal-bid.TC-o5e` |
| `SC-bjb` - A window change that keeps the time keeps the internal bid | Covered by `g10adm.auction-internal-bid.TC-bgs` |
| `SC-36t` - A starting price raised over the internal bid clears it | Covered by `g10adm.auction-internal-bid.TC-net`, `g10adm.auction-internal-bid.TC-96e` |
| `SC-wib` - A currency change past the new ceiling clears the internal bid | Covered by `g10adm.auction-internal-bid.TC-net`, `g10adm.auction-internal-bid.TC-v7q` |
| `SC-9xf` - A starting price that stays under the internal bid keeps it | Covered by `g10adm.auction-internal-bid.TC-96e` |
| `SC-qzx` - A currency change keeps the internal bid's minor units | Covered by `g10adm.auction-internal-bid.TC-v7q` |
| `SC-ps0` - A currency change that leaves the amount not whole clears the internal bid | Covered by `g10adm.auction-internal-bid.TC-v7q` |
| `SC-pzs` - A new save replaces a cleared internal bid | Covered by `g10adm.auction-internal-bid.TC-m9d` |
| `SC-nl0` - A lot an internal bidder wins opens its internal order | Covered by `g10adm.auction-internal-bid.TC-rzs`, `g10adm.auction-internal-bid.TC-cww` |
| `SC-l6i` - A later change to the internal bidder's address leaves its order as it was | Covered by `g10adm.auction-internal-bid.TC-2nf` |
| `SC-6fc` - An operator sends the internal order's invoice and nobody is mailed | Covered by `g10adm.auction-internal-bid.TC-dqh` |
| `SC-77a` (historical label SC-74) - The internal order's invoice expires with no letter and no suspension | Partial - `g10adm.auction-internal-bid.TC-kgs` asserts expiry and no letters, but not no suspension. Out-of-suite verifier: backend test planned in `openspec/changes/add-auction-internal-bid/tasks.md` task 4.1; this change has no current complete case for that assertion. See gap disposition below. |
| `SC-jzh` - An operator cancels the expired internal order and the lot returns to stock | Covered by `g10adm.auction-internal-bid.TC-2d2` |
| `SC-rrc` - Staff read an internal order's buyer as House | Covered by `g10adm.auction-internal-bid.TC-rfj`, `g10adm.auction-internal-bid.TC-81p` |
| `SC-u1p` - Only a reserve holder sees the listing flagged as the internal bidder's win | Covered by `g10adm.auction-internal-bid.TC-17a`, `g10adm.auction-internal-bid.TC-81p` |
| `SC-on5` - An internal bidder's email label matches no Orders search | Covered by `g10adm.auction-internal-bid.TC-vuc` |
| `SC-jtj` - Before its time an admin changes the amount and the time | Covered by `g10adm.auction-internal-bid.TC-qbl` |
| `SC-1c4` - Before its time an admin removes the internal bid | Covered by `g10adm.auction-internal-bid.TC-1p0` |
| `SC-glg` - At its time the internal bid reads Placed | Covered by `g10adm.auction-internal-bid.TC-d07` |
| `SC-11v` - An internal bid short at its time is not placed | Covered by `g10adm.auction-internal-bid.TC-6at`, `g10adm.auction-internal-bid.TC-2dl` |
| `SC-quv` - Raising a not-placed internal bid places it at once | Covered by `g10adm.auction-internal-bid.TC-7rg` |
| `SC-qom` - A raise still short is refused | Covered by `g10adm.auction-internal-bid.TC-jzx` |
| `SC-ujg` - A not-placed internal bid is lowered | Covered by `g10adm.auction-internal-bid.TC-kew` |
| `SC-te0` - A not-placed internal bid is removed | Covered by `g10adm.auction-internal-bid.TC-wf1` |
| `SC-oml` - An internal bid whose time comes before publishing is not placed | Covered by `g10adm.auction-internal-bid.TC-ipm` |
| `SC-r5u` - A save places an internal bid not placed before publishing | Covered by `g10adm.auction-internal-bid.TC-ipm`, `g10adm.auction-internal-bid.TC-54s` |
| `SC-x95` - A re-save of a not-placed internal bid still short is refused | Covered by `g10adm.auction-internal-bid.TC-jzx` |
| `SC-tbl` - A lower that still reaches the minimum next bid places it | Covered by `g10adm.auction-internal-bid.TC-ipm` |
| `SC-xfi` - The time is fixed once it has arrived | Covered by `g10adm.auction-internal-bid.TC-t5b` |
| `SC-lqc` - An admin raises a placed internal bid | Covered by `g10adm.auction-internal-bid.TC-gem` |
| `SC-spg` - An admin lowers a placed internal bid that moves nothing | Covered by `g10adm.auction-internal-bid.TC-0l0` |
| `SC-x8q` - A leading house lowers to its current bid | Covered by `g10adm.auction-internal-bid.TC-pw6` |
| `SC-eng` - A lower that moves the current bid is refused | Covered by `g10adm.auction-internal-bid.TC-cu7` |
| `SC-u2x` - A lower below the house's own bid is refused | Covered by `g10adm.auction-internal-bid.TC-0l0` |
| `SC-16a` - A lower that moves the price and goes below the house's bid names the house's bid | Covered by `g10adm.auction-internal-bid.TC-cu7` |
| `SC-hsd` - A raise of a placed internal bid still short is refused | Covered by `g10adm.auction-internal-bid.TC-nrn` |
| `SC-6v8` - A raise after the effective close is refused | Covered by `g10adm.auction-internal-bid.TC-ben` |
| `SC-wmp` - A lower after the effective close is refused | Covered by `g10adm.auction-internal-bid.TC-79d` |
| `SC-ubh` - A placed internal bid raises as its retired internal bidder | Covered by `g10adm.auction-internal-bid.TC-fku` |
| `SC-piq` - An admin adds an internal bidder | Covered by `g10adm.auction-internal-bid.TC-wkj` |
| `SC-h93` - An email label another profile has is refused | Covered by `g10adm.auction-internal-bid.TC-kg8` |
| `SC-ec7` - A rename after bidding shows in the listing's bids | Covered by `g10adm.auction-internal-bid.TC-g99` |
| `SC-2x8` - The email label is fixed once the profile has bid | Covered by `g10adm.auction-internal-bid.TC-xjb` |
| `SC-9ng` - An internal bidder in use is not retired | Covered by `g10adm.auction-internal-bid.TC-skz` |
| `SC-bio` - A retired internal bidder keeps its history and is no longer offered | Covered by `g10adm.auction-internal-bid.TC-8at` |
| `SC-uem` - A Not placed internal bid on a closed listing does not keep its internal bidder in use | Covered by `g10adm.auction-internal-bid.TC-nbx` |
| `SC-tj3` - An internal bidder with no billing address is refused | Covered by `g10adm.auction-internal-bid.TC-kg8` |
| `SC-n08` - Staff see no internal bid | Covered by `g10adm.auction-internal-bid.TC-hy3`, `g10adm.auction-internal-bid.TC-net` |
| `SC-w8v` - Staff cannot set or read one on the server | Covered by `g10adm.auction-internal-bid.TC-kku` |
| `SC-53a` - The audit trail records a set without its amount | Covered by `g10adm.auction-internal-bid.TC-jjr` |
| `SC-d57` - Staff cannot open or change internal bidders | Covered by `g10adm.auction-internal-bid.TC-hy3`, `g10adm.auction-internal-bid.TC-eo1` |
| `SC-d6h` - The audit trail records an internal bidder act without a listing | Covered by `g10adm.auction-internal-bid.TC-fnh` |
| `SC-ftu` - Staff read the house's bids as House | Covered by `g10adm.auction-internal-bid.TC-rfj`, `g10adm.auction-internal-bid.TC-g02`, `g10adm.auction-internal-bid.TC-gnk` |
| `SC-2l8` - Stats count the house as a bidder | Covered by `g10adm.auction-internal-bid.TC-r33` |
| `SC-27a` - A not-placed internal bid leaves no trace for staff | Covered by `g10adm.auction-internal-bid.TC-hy3`, `g10adm.auction-internal-bid.TC-gnk` |
| `SC-fs2` - Staff see no row for a house raise or lower | Covered by `g10adm.auction-internal-bid.TC-4b4` |
| `SC-epm` - A reserve holder reads which internal bidder bid | Covered by `g10adm.auction-internal-bid.TC-mnc` |
| `SC-s2h` - An internal bidder's email label matches no Listings search | Covered by `g10adm.auction-internal-bid.TC-k1j` |

Scenario count check: 76 current internal-bid scenarios; each has a feature case, full domain case, or explicit partial/out-of-suite disposition above. SC-77a (historical label SC-74) is the only partial behavior. SC-71, SC-73 and SC-75 are fully asserted by the admin domain case `g10adm.auction-dmn.TC-sjg` rev3.

## Bid-payment-method dispositions

| Case marker | Status | Scenario disposition |
| --- | --- | --- |
| `g10.auction-bid-payment-method.US1-TC1` (legacy heading ID; no trace marker) | actual | none |
| `g10.auction-bid-payment-method.TC-tm1` rev2 | actual | none |
| `g10.auction-bid-payment-method.TC-heq` rev1 | deprecated | none |
| `g10.auction-bid-payment-method.TC-h30` rev1 | deprecated | none |
| `g10.auction-bid-payment-method.TC-b9p` rev1 | deprecated | none |
| `g10.auction-bid-payment-method.TC-d2o` rev2 | actual | none |
| `g10.auction-bid-payment-method.TC-rg2` rev2 | draft | none |
| `g10.auction-bid-payment-method.TC-hgh` rev1 | deprecated | none |
| `g10.auction-bid-payment-method.TC-ilh` rev1 | actual | none |
| `g10.auction-bid-payment-method.TC-l7t` rev2 | draft | none |
| `g10.auction-bid-payment-method.TC-x5g` rev2 | actual | none |
| `g10.auction-bid-payment-method.TC-hk4` rev1 | deprecated | none |
| `g10.auction-bid-payment-method.TC-lbz` rev2 | draft | g10.auction-bid-payment-method.SC-x21 |
| `g10.auction-bid-payment-method.TC-nvs` rev2 | draft | g10.auction-bid-payment-method.SC-oeb |

- **TC-lbz rev2** - Covers SC-x21. It asserts the USD bid panel shows the 20% rate without a premium amount.
- **TC-nvs rev2** - Covers SC-oeb. It asserts the rate remains 20% for USD and no HKD or JPY rate appears. This assertion was added within the existing draft case.
- **TC-rg2 / US1-TC7 close route** - Reread the case with Walk 1’s shared starting-state fixture. The fixture says customer A and customer B each open `<listing_8 url>` and wait on that page for close; the case uses the same listing, close and winning state. This resolves the surface ambiguity on the existing collector lot-page route. The journey and modified requirement introduce no additional route or product decision.
- Removed the duplicated `USD | 20% of winning bid` row from Walk 2. The five unchanged linked-card actual cases remain actual; changed premium cases remain draft. The prior `Reviewed` line was marked lapsed on 2026-10-14, preserving review history.

## Remaining gaps and overclaims

- **Internal-bid SC-74** - The feature case `g10adm.auction-internal-bid.TC-kgs` asserts invoice expiry and no letters, but it does not assert the no-account-suspension THEN; the domain cases do not add this assertion. No current backend test specifically verifies an internal invoice expiring without suspension. The exact planned verifier is `openspec/changes/add-auction-internal-bid/tasks.md` task 4.1 (unchecked): add backend tests including “an expiry with no suspension.” Its implementation dependency is task 4.3 in that file: skip `suspendForExpiredInvoice` for an internal order and scope the expiry error to a collector order. The reason is explicit in the scenario: an internal bidder has no site account that could be suspended. The current change task 11.8 also plans a walk that lets the invoice expire with no account suspension, but it is unchecked and is not current evidence. Its source is `openspec/changes/usd-lot-currency-winner-settlement-choice/tasks.md` SHA-256 `223a32a60c68eb6bad36bf00c3d305aa13f81521142339cf18b4727535039824`. Thus SC-74 remains partial/out of suite until task 4.1's test is implemented and passes. No feature or domain case link is assigned to this partial assertion.
  - **Verifier references and source hashes** - Active delta scenario: `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/internal-bid/spec.md` SHA-256 `d85248e6466ae60a6ed1cbc45d86a7ce0dcceccd60e170f08c60b659309ee687`. Feature out-of-suite note: `.../internal-bid/feature-tcs.md` SHA-256 `d4dbad494cc4171ea8577dd7560e67527c4399eb8e958a881ce159c3fe5c4900`. Domain out-of-suite note: `.../auction/domain-tcs.md` SHA-256 `0de56610b26eaa8c809d39acbb2ee6e0e30e825ea050abe8ffc33ba1418bd1e9`. Planned verifier task: `openspec/changes/add-auction-internal-bid/tasks.md` SHA-256 `3d4d17f7549b00cf3f1767ee099068159e0035809bc2df37147ad6c1754f96a0`; implementation task 4.3 is in the same file. The durable QA record that assigns this exact backend test lane is `openspec/specs/grade10-admin/auction/internal-bid/feature-tcs.md` SHA-256 `1a9824b653e7c82ffd49b11ff35f9ef4f43d7b3161f20458b32cc6568ee4e74e`.
  - **Current-code test check** - `apps/backend/grade10/auction/test/db/sweeps/winnerInvoice.spec.ts:59` SHA-256 `2628ade4099397e8c01a2aec63aa13ca06c4a099429bbe103fb12fb391e093be` covers a regular overdue winner and expects suspension; it does not exercise an internal order. `packages/grade10-auction/backend/test/services/bidders/suspension.test.ts:203` SHA-256 `d15c3ec1ce07f0fca5746697582867f8a4ba77f0e9ecf7ad81cbc4d77ea0dac3` checks that a missing bidder does not create a suspension row, but it does not test invoice expiry. Neither is claimed as SC-74's verifier.
- **No uncovered current internal-bid scenario remains after QA2 repairs.** SC-78 and SC-79 were already present in the delta and now have full current cases.
- **No uncovered bid-payment-method delta scenario remains.** SC-x21 and SC-oeb have direct full cases.
- **Product questions** - None. Current settled behavior is USD universal bidding; internal house wins automatically receive HKD settlement and bank transfer on FPS at close, with no setup and no letters; the operator still quotes and sends the invoice.

## Observer

No observer entry was logged. The parent explicitly prohibited global observer writes for this bounded subtask.
