reviewed: 38ac456e94392c76013626c27832b4a78fa5c6c5
source-identity: e08ca20c74a54581928822241a5983cc15ff70952111f23479cd0726059436fa (review-scope-inputs, from plan:review-preflight at 38ac456)
baseline-identity: 6d64eb8b1f223fc1f33790f636467cf5d4541b8781aae09aaaea05cf53eb6358 (accept:preflight Baseline)
verdict: Ready to accept

Rerun of the first review (727d41abf35a3fcab185d8bb51b164bfedcfdb4c, 3 blockers). Bounded by `git diff 727d41a..38ac456` (14 files) and expanded to the dependents of each changed requirement. Gates at 38ac456: `accept:preflight` ready (fingerprint ac9b3c26968e19c81615feb4ae077b4f9483dd2ee23a7c63333dfd8932f51f04), `check:manual` 0 failures, `plan:review-preflight` ready with no blockers.

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `specs/shared/localization/user-journeys.md` | Added with the Walked-by-nobody line. | PM | - | fixed 38ac456 |
| 2 | blocker | `decisions.md:56` Q27 | ❓ replaced with "confirmed by the human". | PM | - | fixed 38ac456 |
| 3 | blocker | `docs/prds/products/grade10-site/auction/display.md:55` | The unrelated `❓ Listing facts` line now sits under its own `### Listing Facts` heading, outside Listing Schema; preflight no longer refuses. | PM | - | fixed 38ac456 |
| 4 | fix | Copy block and Details requirements; Q32, Q33, Q38 | Empty-English and frozen-switch rules added to both requirements, with SC-207 and SC-208 (admin listing) and SC-218 (catalog), cited by tasks 4.1 and 5.1. | Dev | - | fixed 38ac456 |
| 5 | fix | admin listing delta, SC-197 to SC-199 | Moved under the Copy block, Listings search and write requirements. | Dev | - | fixed 38ac456 |
| 6 | fix | "What staff quote" requirement | The six collector surfaces now point at `grade10-site/auction/listing-page`; SC-69 owns them (Q35). | Dev | - | fixed 38ac456 |
| 7 | note | Labs seeds and customer view (SC-200 to SC-206) without a Feature-set line or journey | Recorded as an Accepted Notes paragraph in `reconciliation.md`, not an anchor edit. Judged acceptable: every scenario's `Serves` resolves to US-75 or US-76, each requirement serves a 🚧 PRD line, the proposal and tasks now name both, and the suites list them Out of suite with reasons. Not a blocker. | Dev | - | accepted |
| 8 | note | Feature-set line "a closed or called-off listing" omits settled | Same Accepted Notes paragraph; the requirement text and Q22 name settled. Wording only. | Dev | - | accepted |
| 9 | fix | catalog requirement, translated-description cap | Folded into one sentence. | Dev | - | fixed 38ac456 |
| 10 | fix | `tasks.md` 2.7 / 2.8 | Renumbered (seeds 2.7, verify 2.8). Seed, customer-view and cap tasks still cite their scenario ids without a test task of their own; the ids are also cited by test tasks 2.1, 4.1 and 3.1. | Dev | `tasks.md` | accepted as note |
| 11 | fix | `specs/grade10-admin/auction/listing/spec.md:163` and `specs/grade10-admin/inventory/catalog/spec.md:116` | The new empty-English paragraph was inserted after a copied `<!-- trace:scenario id=g10adm.auction-listing.SC-z8j rev=1 -->` (admin) and `...inventory-catalog.SC-4vd rev=1` (catalog) comment on the same line. Each trace id now appears twice, once on prose and once on its scenario. Gates pass, but the stray marker folds into the durable spec. Remove the two inline comments; this changes the acceptance hash, so rerun `accept:preflight` and take its new baseline and fingerprint. | Dev | delta `spec.md` (both) | open |
| 12 | note | `reconciliation.md` "New ❓ for the PM ... both stay open and block nothing"; suites' "Raised, settled" lines naming Q43 and Q49 as open | Stale against `decisions.md`, where Q43 and Q49 read "the human confirmed". Neither sits in `## Raised`; nothing waits. | Dev | `reconciliation.md`, suites | open |
| 13 | note | overlap: localize-failure-copy, usd-lot-currency-winner-settlement-choice, release-called-off-listing-slugs | Unchanged from the first review: no requirement stated twice; scenario ids do not collide. | - | - | carried |

### Rerun checks

- Page to delta, same facts, nothing open: no ❓ or `TBC` left in scope; `## Raised` all landed; the repaired decisions Q27 and the rows 15 in `reconciliation.md` (2,000 cap) agree with the catalog delta.
- Folded result: durable Purposes still carried; the `shared/localization` Purpose rewrite is declared in `.openspec.yaml` `purpose_rewritten` and preflight warns only to read the folded text. MODIFIED requirements unchanged since the first review.
- Journeys and cases: new scenarios SC-207, SC-208, SC-218 carry `Serves`; new cases remain `draft`; suites' Reconciliation lines updated; US3 and US9 headings in `feature-tcs.md` now match the durable `grade10-admin-auction-listing-US3` style.
- Dependents of changed requirements: Copy block (SC-180 to SC-184, SC-197, SC-203 to SC-206), Details (SC-207 to SC-209, SC-215) and staff-quote (SC-192, SC-193) rechecked; none contradict the new sentences.

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Repair diff 727d41a..38ac456: display.md, `.openspec.yaml`, decisions, proposal, reconciliation, tasks, two admin delta specs, `user-journeys.md` for localization, five `feature-tcs.md` | 38ac456 | full diff read; each first-review finding verified | none |
| Admin listing and catalog `spec.md` | 38ac456 | requirement text, scenario placement, Serves, trace ids | unchanged parts carried from 727d41a |
| Listing-page and localization `spec.md`, durable specs, PRD pages other than display.md, overlapping changes | 727d41a content unchanged in the diff | not reread | first ledger |
| `accept:preflight` | exit 0, ready | gate run once | none |
| `check:manual` | exit 0, 0 failures | gate run once | none |
| `plan:review-preflight --json` | status ready, no blockers | gate run once | none |
