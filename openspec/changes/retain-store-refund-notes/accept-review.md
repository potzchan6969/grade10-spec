reviewed: 95f0a5534ab82532a553dea727678d831b6d0ff8
source-identity: sha256:5e384f9abdd2aadcdc9dc725a03b494ac1101c5adc8877d0a0c9ff0e38b00b47
baseline-identity: sha256:770e4b09b6c661054e3a22c5371df1718b36987256cfdfe9e1a58dd2a2d48365
verdict: Ready to accept

Independent first acceptance review on the committed, clean source revision above. The reviewer did not author the plan. Full acceptance checks were applied because no prior acceptance-review ledger exists. Only this ledger is written; planning sources, acceptance, publication and application implementation remain outside this review.

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |

No open findings or unresolved human decisions.

## Coverage

All source paths below are relative to this store. `reviewed revision` means the committed bytes at the SHA above; additional hashes distinguish gate dependencies outside the review manifest. No prior acceptance verdict or coverage was carried forward.

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Review-scope manifest | `5e384f9abdd2aadcdc9dc725a03b494ac1101c5adc8877d0a0c9ff0e38b00b47` | Read manifest first: four ADDED requirements, two indexed PRD locations, two durable targets, no expansions or overlaps; strict structural validation passes. | None; fresh JSON manifest |
| [Proposal](proposal.md), [decisions](decisions.md), `.openspec.yaml` | reviewed revision | Backend retention/direct literal exposure agrees with Q1–Q9; no approval, mapping, classification, frontend or new access grant; Raised row lands in Q9. No awaiting/TBC/open product fact in scope. | None |
| [Order Details PRD](../../../docs/prds/products/grade10-site/store/order-detail.md):52–64, 91–122, 149–152 | SHA-256 `39b4e937cbd3619fb04edef6e933459ccab812e8fbb4aebb13e393cadffe9406` | Only PRD owner for this capability; marked Refund Reason Data serves all four added requirements, with explicit backend-only follow-on boundary. Existing exact-fact, owner/private-link and no-account-facts rules agree. Unrelated pre-existing marks are outside this change. | None |
| [Delta](specs/grade10-site/store/order-detail/spec.md):1–174 and [context journey](specs/grade10-site/store/order-detail/user-journeys.md) | reviewed revision | Read all four requirements, all thirteen scenarios and complete roots/journey; source fidelity, missing/empty distinction, source precedence, identity/line attribution, deterministic order, optional compatibility, authorization and erasure agree. Every changed root and journey outcome has scenario coverage. | None |
| [Technical design](tech-design.md):18–108 | reviewed revision | Per-provider-refund rows and original identity; exact source lines; canonical supplied values replace/clear, omission preserves; delayed webhooks cannot overwrite captured answers. Metadata precedes money filters/dedupe. Pending/restock-only data makes no settlement claim. Order locks and durable erasure guard protect races/replays; no raw reasons in diagnostics/analytics. Optional detail projection occurs after authorization. Schema rollout and bounded dry-run replay preserve existing financial rules. No UI design is required or supplied for this backend-only change. | None |
| [Tasks](tasks.md):1–46 | reviewed revision | Six coherent groups carry requirements and focused gates; contracts, real PostgreSQL lock/erasure tests, both schema migrations, both ingestion arms, financial/idempotency regression tests, authorized routes and deterministic protected fixture/API walk are planned. No production replay/deployment is performed or required during planning. | None |
| [QA1 evidence](qa1-evidence.md) and [validation](qa1-validation.json), frozen feature-set-only outline | evidence SHA-256 `cafe9244368b71ade4f437cb4b09ffb38ec51706b6ea0b1485eda5578b120ef2`; validation `7d27ee9ed6f288c65ba4b5f01c93c46c76a7f93b0c37466ad2b2c86fd75b8dbd` | Reviewed blind-input/isolation receipt, all thirteen backend partitions and raised recommendation; outline contains no requirements. No scenario-derived GUI cases or execution claims. Frozen hashes are historical, not current plan fingerprints. | QA1 partition/isolation evidence only |
| [QA2 evidence](qa2-evidence.md):13–94 | SHA-256 `296a04d01101b4ba047bfd9ec2cb32008b3b99361ddbf733887861267b1a1996` | All thirteen partition dispositions, SC10–SC22 dispositions, every root/journey and group, Q9 closure, API out-of-suite routing and purpose repair checked against current sources. Same-line/many-line association partitions are explicitly retained for implementation tests without claiming SC15 alone illustrates them. | QA2 source-linked reconciliation; independently checked changed/relevant sources |
| [Page suite](../../../docs/prds/products/grade10-site/store/tests/orderDetails-tcs.md):7–10, 850–852 | SHA-256 `5036ead756e16a23ab4982cc8da5b320786d98a3938191443c858c1bc66000cc` | API header honestly excludes hidden backend behavior from GUI QA; Q9 Settled matches canonical correction/clearing/omission and delayed-webhook protection. No new GUI case; 4 actual and 19 draft remain. Diff after QA2 changes no case body/marker/status. | QA1/QA2 unchanged-case comparisons |
| [Domain suite](../../../docs/prds/products/grade10-site/store/tests/domain-tcs.md) | SHA-256 `91a653f5e4d87ba5d5016440f4937ef55bd9badebc61f0fdd28fc27b0f5d7616` | Existing 7/7 suite remains navigation/access context; no hidden reason-data coverage claimed. | QA2 unchanged-domain comparison |
| [Current durable order detail](../../specs/grade10-site/store/order-detail/spec.md) and [journeys](../../specs/grade10-site/store/order-detail/user-journeys.md); prepared folded outputs | Folded spec SHA-256 `7e8a76eb61e4f499b61e4c65abd0491429efa1115b45cc5269d203c83813a36b`; folded journeys `faa3374fa9983b832fa2a2e310d1e1c8037e12c8ba606b62e49105309e5260e3` | Read prepared folded result alongside current durable contract. Existing Purpose survives verbatim, existing feature roots and journeys survive, new roots/requirements append. Existing access, totals, refunded-unit, points, pictures and tracking requirements remain consistent: new metadata does not feed those financial/UI facts. | None; prepared in memory without durable writes |
| [Order status](../../specs/grade10-site/commerce/order-status/spec.md):28–143 | SHA-256 `f0f06c7c2aea11c2e79c4afe93ad90a3e5f1c4496cd50df5ff6b055fed442c5e` | Existing status derives from named provider facts/parcels, never metadata collection presence or reason text. Pending/restock metadata leaves this rule unchanged. | None |
| [Membership exact-once recording](../../specs/grade10-site/store/membership/spec.md):330–361 | SHA-256 `3abc50729233ead89ff345402df23bb0af636362ceed850b71244c3033905d33` | Unknown-order recovery and ownerless refund exact-once obligations survive; metadata creates no orphan row or second settlement. | None |
| [Refunds PRD](../../../docs/prds/products/grade10-site/store/refunds.md) | SHA-256 `97ea56b8aef9934f5159ecb1a8cd7ffdc065e46bad8dad8c64c7ccbbe6039439` | Financial return/points behavior remains separate; unrelated unsettled pricing questions are not changed or answered by note retention. | None |
| [Account-data erasure](../../../docs/prds/platform/account-data.md):110–144 | SHA-256 `68c0fea583f6251d27ee487aa07d3cb17adb9586fe7b2aadfdedebb35929d841` | Existing operator authorization, person scope, status remaining-count semantics and preserved financial IDs agree with the note guard/clear/status extension. | None |
| [Suite governance](../../../docs/governance/specs-to-test-cases.md):50–98 | SHA-256 `5edb226b71e4c3a9f4fe160d8cf4157d28e9cf0bafd7d0e047b7b294180612ae` | Store PRD-owned cases, routine Raised closure/Settled record, API out-of-suite category and no invented GUI assertions applied. | None |

## Gate receipts

All current checked sources were committed and clean at the reviewed revision before this ledger was created. No source edit occurred during review. The review-scope identity is not used as a cache key for acceptance or manual checking.

| Gate | Command / result | Exact evidence |
| --- | --- | --- |
| Review preflight | Reused coordinator `pnpm plan:review-preflight retain-store-refund-notes`, exit 0, ready; ran JSON form once to obtain the missing manifest, also exit 0/ready. | `/tmp/refund-note-review-preflight.log`, SHA-256 `ce971b2a10d7d124bd00e257dfb0c6e3d8439a8455cafde0800cf5c3cc74785a`; current JSON source identity above, no overlaps/expansions. |
| Acceptance preflight | Reused coordinator `pnpm accept:preflight retain-store-refund-notes`, exit 0, ready to fold. Independently recomputed prepared acceptance identity/folded outputs without writing them; both fingerprint and baseline match exactly. | `/tmp/refund-note-accept-preflight.log`, SHA-256 `65996f4f1f4e10c0d7e755339e6956619a4c89d29d64c8886139fbd4a2453ac6`; acceptance fingerprint `432c8e63aee0f15545b25afa443437d4fe695484db75b6e19e72828f2fff37fc`; baseline as above. Acceptance code SHA-256 `42f71b0e08a7cc4ea33b2ecfbd6e43679b268cc60bada71a2e052ba552327e61` (`scripts/openspec/lib/acceptance.mjs`). |
| Current-tree manual | Ran `PATH=/Users/kinchan/.nvm/versions/node/v24.14.1/bin:$PATH pnpm check:manual`, exit 0: **0 failures, 96 warnings**. No warning targets this Order Details PRD or says its spec changed meaning. | `/tmp/refund-note-accept-review-manual.log`, SHA-256 `a8eb01afecc3fce20011f6b47c53ddbfd4905f04ab706984d14b299c99e544ac`; current committed tree at reviewed SHA, including Q9 Settled. Manual checker entry SHA-256 `b15b1a670839eeb07a117a175840649e220f005b4a7231192eb26ab334fed24f` (`tools/manual/check/check-manual.mjs`); all imported checker dependencies fixed by that clean revision. |

The acceptance preflight covers the folded-tree gate; the manual command above separately covers the current tree. Global style warnings are existing unrelated material and do not supply a finding against this scope. Gate receipts are planning evidence only.

## Closed Raised row

- [decisions.md:33](decisions.md#raised), later observations change the same refund note: **closed by Q9** at [decisions.md:27](decisions.md#decisions). Confirmed provider text replaces, explicit empty clears, omission preserves. [SC13–SC14](specs/grade10-site/store/order-detail/spec.md#requirement-refund-metadata-retains-the-supplied-source-facts), technical design decision 3 and [suite Settled](../../../docs/prds/products/grade10-site/store/tests/orderDetails-tcs.md#settled) agree. QA1 recommended authoritative current text; no contradiction between independent readings or held human decision remains. An accepting person can reopen this decision.

The non-anchor Purpose repair at `95f0a5534ab82532a553dea727678d831b6d0ff8` restores the existing durable Purpose verbatim. The repair diff and QA2 addendum confirm unchanged roots, journeys and scenarios; no new blind-case reading is required.

## Limits

No application implementation, contract tests, migrations, PostgreSQL concurrency tests, API/browser walk, provider calls, production backfill or deployment was performed by this review. These remain explicit implementation obligations. In particular, the backend walk must retain both same-line/many-line association fixtures identified by QA2. Existing GUI cases do not verify the new hidden API data.

Ready to accept
