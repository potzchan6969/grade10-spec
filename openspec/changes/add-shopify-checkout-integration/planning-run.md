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
- **Status ownership** - `add-store-order-status` and `add-grade10-customer-order-pages` retain ownership of status mapping and order surfaces. This amendment consumes their existing contracts and adds no competing status delta.
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
