reviewed: b1564948a0e6d5d1793bd3ffd4ba1a0d419d30a2
verdict: Not ready - 3 blockers

## Review Scope

Fresh acceptance review dated 2026-10-07. The reviewer did not write the plan. The reviewed SHA names the store's current committed `main` baseline. The planning amendment is uncommitted; this SHA does not identify its draft text.

- **Draft fingerprint** - `b448eb54004fc410ad2143068ef2960a97d30922345c5ab442232846f873bd48`, reported by this run's `accept:preflight`; no acceptance is published
- **Durable baseline fingerprint** - `95d4bdf3f982412b8fcf71949706033025b35f7b742317fcc247a6a232ca15c1`, reported by the same preflight
- **Existing acceptance** - `137f9cec66da45e8975e44b4be5c14c272ad34df5ee7e37dca1b8061eb5e0d8c`, recorded in [acceptance.json](acceptance.json); this review does not replace it
- **Scoped planning gate** - `pnpm plan:review-preflight add-shopify-checkout-integration --json` passes with `status: ready`, no overlaps and no blockers
- **Acceptance gate** - `pnpm accept:preflight add-shopify-checkout-integration` exits 1 with 19 `fold:retitled-case` failures and 2 missing story references
- **Manual gate** - `pnpm check:manual` exits 1 with 2 failures and 272 warnings. The 2 story references below also appear in the acceptance gate
- **Content review** - Pending. [accept-review](../../../.claude/skills/accept-review/SKILL.md) states that "a refusal from either stops the review". No page-to-delta, folded-contract, design, journey, case or overlap content verdict is issued while these gates refuse the draft

## Findings

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `openspec/specs/grade10-site/store/checkout/feature-tcs.md` and `openspec/changes/add-shopify-checkout-integration/specs/grade10-site/store/checkout/feature-tcs.md`; 19 addresses listed below | The fold retitles published case addresses with different permanent trace IDs. Every conflicting amendment marker is already present in the committed change suite at the reviewed SHA. This is an inherited lineage mismatch, not a new loss caused by this review. | Checkout planning and QA owner, with the human who owns case history | Establish the lineage between the published suite, accepted snapshot and earlier unaccepted amendment. Preserve both published permanent identities and reviewed amendment history. Apply the supported provenance repair, then rerun QA2 and acceptance review. Do not delete cases, renumber issued history, replace IDs by guesswork or weaken the gate. | open |
| 2 | blocker | `docs/prds/products/grade10-admin/auction/management.md:432` and `apps/preview/storybook-static/index.json` | `auction-admin-payment-settings--loaded` does not resolve in the generated Storybook index. Both acceptance and manual checks refuse it. | Auction management page and workbench owner | Restore the intended story export and regenerate through the supported workbench build, or have the page owner reconcile the reference with its intended story. Parent reports the supported build already ran successfully without clearing this failure. This unrelated page is outside the amendment's edit scope. | open |
| 3 | blocker | `docs/prds/products/shared/ui/auction-listing.md:139` and `apps/preview/storybook-static/index.json` | `auction-listing-listingdetails--default` does not resolve in the generated Storybook index. Both acceptance and manual checks refuse it. | Auction listing page and workbench owner | Restore the intended story export and regenerate through the supported workbench build, or have the page owner reconcile the reference with its intended story. Parent reports the supported build already ran successfully without clearing this failure. This unrelated page is outside the amendment's edit scope. | open |

## Case Lineage

[Case numbering](../../../docs/governance/specs-to-test-cases.md) keeps issued IDs permanent and retired cases deprecated. [Fold checks](../../../scripts/openspec/lib/fold-checks.mjs) refuse a retitled address whose marker differs from the durable marker. The arrows below record the conflict, not an approved mapping. All addresses start with `grade10-site-store-checkout-`; all markers start with `g10.store-checkout.TC-`.

- **US1-TC1** - Durable line 13 `tb9` -> draft line 696 `uke`
- **US1-TC2** - Durable line 45 `sew` -> draft line 740 `m23`
- **US1-TC3** - Durable line 77 `jze` -> draft line 775 `ifk`
- **US1-TC4** - Durable line 109 `1yv` -> draft line 810 `i1x`
- **US1-TC5** - Durable line 140 `gwn` -> draft line 844 `wod`
- **US1-TC6** - Durable line 263 `ldd` -> draft line 892 `kd3`
- **US1-TC7** - Durable line 293 `inp` -> draft line 932 `7s9`
- **US1-TC8** - Durable line 170 `w18` -> draft line 971 `13i`
- **US1-TC9** - Durable line 201 `3dr` -> draft line 1016 `d42`
- **US1-TC10** - Durable line 232 `jje` -> draft line 1050 `9mi`
- **US2-TC1** - Durable line 328 `kpm` -> draft line 1994 `q0v`
- **US2-TC2** - Durable line 359 `b5w` -> draft line 2038 `uuk`
- **US2-TC3** - Durable line 390 `njp` -> draft line 2074 `vyf`
- **US3-TC1** - Durable line 428 `wam` -> draft line 2564 `a1c`
- **US3-TC2** - Durable line 459 `xym` -> draft line 2601 `09w`
- **US3-TC3** - Durable line 491 `nds` -> draft line 2638 `eul`
- **US3-TC4** - Durable line 522 `dno` -> draft line 2672 `ub1`
- **US3-TC5** - Durable line 552 `ce0` -> draft line 2714 `b6s`
- **US4-TC1** - Durable line 588 `nos` -> draft line 3139 `fwd`

## Questions

1. **Permanent Case Lineage** - Confirm which published cases the earlier unaccepted amendment revises and which cases are distinct, with the provenance that permits a repair preserving both issued histories.
   - **Why it matters** - The 19 addresses above refer to different permanent IDs in the two sources. Guessing the mapping can replace published case identity or discard reviewed amendment history
   - **Blocks** - Provenance repair, the acceptance fold and the pending content review
   - **Reasons** - Finding 1, the [published suite](../../specs/grade10-site/store/checkout/feature-tcs.md), the [draft suite](specs/grade10-site/store/checkout/feature-tcs.md), the committed change suite at the reviewed SHA and [permanent case numbering](../../../docs/governance/specs-to-test-cases.md)

Not ready - 3 blockers
