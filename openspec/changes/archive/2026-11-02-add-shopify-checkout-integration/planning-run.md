# Cart Header Follow-up Planning Run

Preparation dated 2026-10-07 for the cart-header amendment described in [the proposal](proposal.md) and [technical design](tech-design.md). No new requirements, acceptance fingerprint or implementation claim is published by this record.

## Baseline

| Input | Revision |
| --- | --- |
| Published spec-store main | `b1564948a0e6d5d1793bd3ffd4ba1a0d419d30a2` |
| Backend cart-header branch | `bd04abc5d91b51e5b99ccd31e21424039ed8f80e` |
| Frontend integration branch | `788efad654e14843c6295948afade5b4b064c99f` |
| Existing acceptance fingerprint | `137f9cec66da45e8975e44b4be5c14c272ad34df5ee7e37dca1b8061eb5e0d8c` |

- **Amendment home** - Keep this active change as the checkout delivery record. Preserve its acceptance snapshots, implementation provenance, completed task addresses and case review history.
- **Source order** - Settle the new product decisions on the checkout PRD and in `decisions.md`, then update proposal, journeys and UI design before freezing anchors.
- **Current contract** - Published durable checkout requirements still require persistent replay and response-loss recovery. The earlier unaccepted frontend amendment removes those requirements. The reviewed cart-header branch supplies saved-invoice reuse and conditional cart conversion without every stronger guarantee.
- **Decision sweep** - The user's instruction to integrate all backend changes and spec requirements settles Q20/Q21. Retain every durable guarantee and existing shared status labels; add no new badge. The PRD and `decisions.md` record this scope before the anchors were frozen.

## Scope Choices

| Question | Decision | Source |
| --- | --- | --- |
| Q20 - Backend safety scope | Retain all durable requirements; missing backend guarantees remain delivery prerequisites | User instruction, Q17/Q20 |
| Q21 - Payment labels | Follow existing shared status contracts; no new unpaid badge | User instruction, Q21 |

- **Authority** - The user said: "the frontend should be integrated all changes from the backend and the requirements from the specs". No stronger published guarantee is waived.
- **Operational scope** - Planning includes release prerequisites and evidence tasks. It performs no migration, deployment, production write or provider configuration change.

## Ownership and Isolation

- **Checkout overlap** - The existing checkout amendment has no same-capability overlaps in its review-preflight manifest.
- **Status ownership** - The durable spec `grade10-site/commerce/order-status` and `add-grade10-customer-order-pages` retain ownership of status mapping and order surfaces. This amendment consumes their existing contracts and adds no competing status delta.
- **Suite history** - The current checkout suite is `in-review` and contains draft and deprecated cases. Update it with permanent IDs and retained history; do not delete or regenerate the whole suite.
- **QA1 inputs** - A fresh context receives frozen Purpose/Feature set, journeys, proposal, decisions, linked PRDs, design without scenario dispositions, existing cases without reconciliation or scenario coverage markers, and the applicable higher suites. It receives no requirements, technical design or previous reconciliation.
- **Dev inputs** - A separate fresh context receives the same frozen product anchors, the durable requirements and owning implementation sources. It receives no QA1 cases or reconciliation until its design, scenarios and tasks are complete.
- **QA2 inputs** - A fresh context reconciles both readings on the frozen anchors, records every disposition and covers every requirement and task. New cases remain draft.
- **Acceptance review** - A fresh context that wrote no planning artifact runs the store's `accept-review` after preflights and any cluster reconciliation. Only a Ready to accept verdict permits the acceptance step.
- **Human acceptance** - Present the complete reviewable amendment before publishing acceptance. Use the supported command with the preflight baseline and prior fingerprint as `--supersedes`; preserve existing acceptance history.

## Preparation Evidence

| Check | Observation |
| --- | --- |
| Registered store resolution | `openspec store list` resolves `/Users/kinchan/Projects/9gag/grade10-spec` |
| Published baseline | Store checkout fast-forwarded to the fetched `origin/main`; unrelated `tools/openspec-viewer` changes and the follow-up reference retained |
| OpenSpec schema instructions | `pnpm openspec instructions specs --change add-shopify-checkout-integration --json` returned the planning schema and scenario/anchor rules |
| Existing review preflight | With repository Node 24.14.1, `pnpm plan:review-preflight add-shopify-checkout-integration --json` returned ready, 6 changed requirements and no overlaps, before recording Q20/Q21 |
| Whole-store cluster discovery | `pnpm accept:preflight --clusters` passed after fetching missing partial-clone history; checkout belongs to no cluster |

- **Frozen inputs** - Six checkout journeys and five feature-set roots are frozen in isolated QA1 and Dev bundles. QA1's bundle excludes requirements, technical design, reconciliation and scenario coverage metadata.
- **Resumed readings** - Both initial readers stopped at the account usage limit before saving drafts. The resumed readers use the same frozen inputs; no incomplete output is treated as completed evidence.
- **QA1 and Dev** - Independent drafts completed from the frozen inputs. The unchanged durable Purpose was subsequently supplied to QA1 alone as a permitted non-anchor supplement; QA1 confirmed no case or impact changes.
- **QA2** - Reconciled all cases, requirements, tasks and UI states. Its source repairs preserve all guarantees and existing surfaces; the focused repair check returned Ready for acceptance review.
- **Trace allocation** - New scenario and case identities were allocated through the trace CLI. Active case coverage names exact scenarios rather than the earlier blanket coverage.
- **Suite checks** - Scoped validation passed with 55 draft and 34 deprecated cases. The 89-case historical sweep passed; no case is classified actual.
- **Review preflight** - The integrated delta passed the scoped review preflight with no overlaps. `git diff --check` passed.
- **Workbench** - The supported `pnpm storybook:build:workbench` completed. Its refreshed generated index remains untracked build output.
- **Acceptance blocker** - The fold preflight refuses 19 inherited case-address/permanent-ID collisions between the published durable suite and the earlier unaccepted amendment. A provenance repair must retain the published identities and the amendment's reviewed history; this run does not guess a lineage or bypass the gate.
- **Manual blocker** - Two existing story references remain missing from the rebuilt workbench: `auction-admin-payment-settings--loaded` and `auction-listing-listingdetails--default`. Their owning pages are outside this checkout amendment.
- **Fresh acceptance review** - [The review ledger](accept-review.md) records Not ready with three blockers: the case-lineage group and the two story references. Its fresh scoped preflight passed; acceptance preflight and manual check refused publication. The reviewer verified that all 19 conflicting amendment identities already exist in the committed baseline. Content review remains pending under the gate rule.
- **Unrun** - Acceptance/publication, implementation, application tests, human QA and operations have not run. The existing acceptance and implementation provenance remain unchanged.

## Merged Backend Follow-up - 2026-10-08

- **Authorization** - The owner requested this planning-dev update to follow the merged backend and address the readiness review findings. The earlier no-push instruction remains in force; this run changes planning sources only.
- **Baselines** - Published store main is `b0bc23de57201d3cbcdf8a5b671b0869b9ba7ecb`. The local amendment starts at `d66ee0e34e7e67ce09fe1b8554940d5ed92d643d`. Application merge `665aaa9eee2fcd5aa552c9978ec6a099fc1d3e43` contains backend `5b434c7a7d8f8e236754c27c41cdb9121982658e`. Later backend work requires another source check before implementation.
- **Anchors** - The six journeys and five feature roots are unchanged. Q8 and Q22 clarify member-edit conversion, canonical concurrent Pay, current validation on reuse and ordinary zero-points checkout. No higher suite names these checkout journeys; existing impact dispositions remain valid.
- **Readings** - A fresh blind QA1 receives only sanitized anchors, product sources, UI states and existing cases. A separate fresh Dev receives product inputs, durable requirements and the merged application sources without QA1 cases. QA2 reconciles the resulting clarifications before fresh acceptance review.
- **Case lineage** - Published repair `a78cc27c503829c6da952abf9a1675b22cc01cc6` explicitly reconciles the 19 colliding case addresses with durable trace identities without changing their assertions. This amendment adopts those published identities at the same case addresses and retains all active and deprecated case headings. The old markers remain in Git and historical planning snapshots; no new case identity is guessed or allocated for those addresses.
- **Current gates** - Checks use the supported `PLAN_NO_FETCH=1` option against the fetched store baseline to avoid repeated partial-clone fetches. The initial scoped review preflight passes with no overlaps or blockers; final checks follow reconciliation.
- **Historical evidence** - The prior acceptance ledger remains historical until the fresh reviewer records this amended source. Its two missing story references remain outside checkout scope and require current verification; this run does not weaken manual or acceptance gates.
- **QA1** - The blind supplement revises five existing draft runs for zero points, shop-review conversion, independent member edits, canonical concurrent handoff and current validation before reuse. It proposes no new journey, feature root or case identity.
- **Dev** - Adds CLI-issued scenarios SC-61 (`g10.store-checkout.SC-gem`, revision 1) and SC-62 (`g10.store-checkout.SC-jab`, revision 1), refines SC-39/40/36/47, and records migration 0050 plus remaining backend safety work. V2 explicitly requires zero-inclusive points and seen-price acknowledgements; legacy adapters retain their wire shapes and use the same guarded engine.
- **QA2** - Integrates the five blind additions into their existing draft runs and records every scenario, task and UI-state disposition. The specific same-run draft assertion rule keeps case revisions unchanged. All 89 issued headings remain: 55 draft and 34 deprecated. Wire boundaries and internal counter assertions name backend verification tasks; manual UI cases receive only their visible coverage.
- **Verification** - Node 24.14.1 suite validation, strict OpenSpec change validation, scoped review preflight and whitespace checks pass after reconciliation. Cluster discovery lists no checkout cluster. Application implementation, provider operations and human QA are not performed by this planning follow-up.
- **Fresh acceptance gates** - The scoped review preflight passes with six changed requirements and no overlaps. Acceptance preflight verifies the 19-case lineage repair, then refuses only `auction-admin-payment-settings--loaded` and `auction-listing-listingdetails--default`. Manual validation reports the same two failures and 272 warnings. The fresh ledger records Not ready - 2 blockers and leaves content review pending under the skill's gate rule.
- **Draft fingerprint** - The fresh acceptance preflight reports `05f80d5f44e1cf1d90c1d1beb9948112b406052ddf0d3fd89b3a6c1e1fc714eb` against durable baseline `95d4bdf3f982412b8fcf71949706033025b35f7b742317fcc247a6a232ca15c1`. This is preflight evidence, not an accepted fingerprint. Acceptance, implementation records and durable checkout files remain unchanged; no commit or push is made.

## Frontend Scope Reconciliation - 2026-10-09

- **Authority** - Q24-Q29 keep this change to the frontend against the current backend. Frozen anchors (the five Feature set roots, US-01 to US-06) are unchanged. Dev read the application branch `codex/feat-shopify-checkout-integration` at `c05700431`.
- **Dropped** - The MODIFIED "A checkout intent is safe to repeat" block, which stays durable and unmodified for `add-checkout-purchase-safety`; the Cart Context and No Points paragraphs; SC-33, SC-39, SC-40, SC-41, SC-42, SC-43, SC-44, SC-46, SC-48 and SC-61, and the re-stated SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21.
- **Renamed** - The ADDED requirement is now "The cart drawer starts one current Pay at a time": request per Q25, one Pay at a time, older answers per Q28, lost answers per Q27, paid refresh with no browser-held purchase identity per Q29.
- **Kept** - SC-34, SC-35 and SC-38 reworded to rev 3; SC-45 and SC-62 reworded to rev 2 and placed under Cart release; SC-60 reworded at rev 1; SC-58 moved to the ADDED requirement. SC-36, SC-37, SC-47, SC-49 to SC-59 otherwise unchanged. SC-63 (`g10.store-checkout.SC-uzw`, rev 1) is new from the trace CLI for the Q25 request.
- **Tasks** - Retired 1.2, 1.3, 6.1-6.3, 7.1-7.4 (completed, then removed by app commit `306a68624`), 8.1-8.4, 9.1-9.5, 10.1-10.5, 11.1-11.5 and 12.1-12.5. Added 1.4, 1.5 and 11.6-11.11. Rewrote unchecked 5.6, 5.7 and 13.1-13.3 to frontend observations. Group 6 is retitled; Group 13 is the walk. Nothing is ticked.
- **Design** - `tech-design.md` is rewritten to the current wire, Pay guards, answer mapping, paid refresh and static return links, with a Not in This Change list. `ui-design.md` changes only its States dispositions and that table's separator row.
- **QA2** - Reconciled all 92 issued cases: 45 draft and 47 deprecated. Confirmed QA1's twelve deprecations, deprecated its US6-TC6-1 under Q32, and folded US5-TC13-1 and US1-TC35-1 with trace-CLI markers. Active cases cover only this delta's scenarios; the durable-only SC-09 to SC-11 and SC-19 to SC-21 are owed by `add-checkout-purchase-safety` (Q24).
- **Scenarios folded** - SC-64 (`g10.store-checkout.SC-cbb`, settling answer, US-05) and SC-65 (`g10.store-checkout.SC-f6v`, failed answer, US-02) come from the ADDED requirement's Answers paragraph, for US5-TC5-1 and US2-TC8-1. Tasks 11.6 and 11.7 name them.
- **Coverage** - Every delta scenario has an active case, except SC-07 and SC-08, which name Out of suite verifiers. Dropped ids are gone from every case marker; `## Settled` follows Q24-Q34. No question is raised.
- **QA2 rerun, 2026-10-09** - A fresh QA2 read the acceptance review of `217e6d6c` and the owner's source repairs in `43a88fa4e86c`. It edited only the suite, the UI dispositions and this record.
- **Feature set** - The five roots are unchanged. The fold merges leaves by label, so the durable provider-binding, intent, recovery and changed-intent leaves stay without the delta restating them.
- **Cases** - US6-TC5-2 follows SC-60 rev 2 and no longer asserts that the invoice stays open. US1-TC13-3 follows B1, and with US1-TC26-2 follows SC-37 rev 3 and SC-57 rev 2 on the profile gate. E2e cases name Proceed to Checkout. SC-63 rev 2 changes no case. Totals stay 45 draft and 47 deprecated.
- **Durable-only scenarios** - SC-09, SC-10, SC-11, SC-19, SC-20 and SC-21 stay off `**Out of suite:**`. After the fold, `check:manual` reaches them through the active US-01 cases and would refuse that listing. `add-checkout-purchase-safety` owes their cases.
- **Out of suite** - The same check on the folded store would refuse SC-07, so it leaves the header; tasks 11.6 and 11.7 stay its verifier. SC-08 stays Out of suite. SC-16 rev 2 serves US-03 (bea3f808), so it is traced after the fold.
- **Second review repairs, 2026-10-09** - The verification rows on both pages name the profile-page condition (B3); the page names Pay as Proceed to Checkout (F5) and links the cart drawer for where checkout starts (F7). The review before a reused invoice is listed for `add-checkout-purchase-safety` (F10). F11 is not applied: a 🚧 needs an accepted change, so those lines stay unmarked product rules. The delta no longer restates durable Feature set leaves (N4).

## Purchase Safety Case Handoff - 2026-10-10

- **Owner instruction** - Move the six backend cases identified by the review into `add-checkout-purchase-safety` as active drafts, preserving their IDs and traces. Leave the external site-chrome overlap unchanged.
- **Moved cases** - Seven legacy backend drafts (US1-TC3, TC4, TC5, TC8, TC9, TC10 and TC11) move with their existing IDs and traces. US5-TC2-1, US5-TC6-1, US5-TC8-1, US5-TC9-1, US5-TC10-1 and US6-TC1-1 retain their permanent IDs, revisions, markers, journey traces and expected results. Their status returns to draft; obsolete deprecation notes are removed. US1-TC5-1 is retained from the published suite instead of restoring the unaccepted TC5-2 rewrite that ignores an earlier invoice.
- **Durable coverage** - Remove the frontend safety overrides. The supported acceptance merge retains published US1-TC3, TC4, TC5, TC8, TC9 and TC10 as active drafts instead of replacing them with deprecated entries. This replaces the earlier journey-only coverage claim.
- **Follow-up scope** - The safety delta carries the published safe-repeat requirement unchanged so its suite has an owning contract. Its backend design, tasks and further refinements remain pending. No acceptance, implementation, provider operation or case approval is performed.
- **Verification** - Both scoped suites pass strict validation. The supported acceptance dry fold retains all six published safety cases and the safe-repeat requirement unchanged. All 13 moved drafts retain their IDs and traces; TC5 uses its published revision and assertions. Acceptance preflight still refuses only the external overlap, which is left unchanged. Fresh acceptance review remains pending; no acceptance is published.
