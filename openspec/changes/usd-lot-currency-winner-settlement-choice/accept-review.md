reviewed: fd43ec32a046a660c37448d426da021361272f1a
source-identity: e26c7cac8b77dc0ed446364b33436f5f23eb1c821f6f93f0f8c58e42028ab1ed (plan:review-preflight, 479 inputs)
baseline-identity: 313c29bfb08b0a85b88819b17e66f32a28263098c9c71d5d7cf87b10bd616ed7
verdict: Ready to accept

# Acceptance Review

PR: https://github.com/9gag/grade10-spec/pull/1155

Focused rerun of the two feature-set blockers from the review at `3d3368db613c19c4ddc30b8fb0bf6a24e223065a`. The four-file repair changes only the two affected specs and their QA2 reconciliation notes. Both findings are fixed in the folded contract. The unchanged 17-capability review coverage and all other prior findings remain carried from the prior reviewed revision.

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | Folded `openspec/specs/grade10-admin/auction/payment-settings/spec.md:11-20`; delta `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/payment-settings/spec.md:11-28` | The folded Feature set removes the retired per-currency premium minimums and legacy Stripe card-fee label. It retains one USD premium minimum with a USD 0 default, payment-processing access, and card rules for USD and HKD. These facts agree with the current Payment Settings PRD and decisions Q4, Q11 and Q13. | Payment Settings planning owner | Delta `Feature set` and `REMOVED Feature set`; fold regenerated at `/private/tmp/pr1155-feature-fix-folded` | fixed fd43ec32a046a660c37448d426da021361272f1a |
| 2 | blocker | Folded `openspec/specs/grade10-site/auction/bid-increments/spec.md:10-21`; delta `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/bid-increments/spec.md:10-22` | The folded Feature set removes the retired HKD and JPY schedule claims and the per-currency ceiling. It retains one USD schedule for every lot and one USD 10,000,000 ceiling. These facts agree with the current Bidding PRD and decision Q4. | Bid Increments planning owner | Delta `Feature set` and `REMOVED Feature set`; fold regenerated at `/private/tmp/pr1155-feature-fix-folded` | fixed fd43ec32a046a660c37448d426da021361272f1a |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| Review manifest and scoped sources | HEAD `fd43ec32a046a660c37448d426da021361272f1a`; manifest digest `e26c7cac8b77dc0ed446364b33436f5f23eb1c821f6f93f0f8c58e42028ab1ed`; 479 inputs | Verified all four changed paths; repair diff is limited to the payment-settings and bid-increments specs and their QA2 notes | Current manifest and repair diff |
| Payment Settings folded Feature set | Fold generated at `/private/tmp/pr1155-feature-fix-folded`; source HEAD `fd43ec32a046a660c37448d426da021361272f1a` | Compared against the current PRD Payment section and decisions Q4, Q11 and Q13. Confirmed retired per-currency minimum and legacy card-fee claims are absent; retained USD/HKD card rules and USD minimum agree | Current delta and PRD; focused QA2 note |
| Bid Increments folded Feature set | Fold generated at `/private/tmp/pr1155-feature-fix-folded`; source HEAD `fd43ec32a046a660c37448d426da021361272f1a` | Compared against the current Bidding PRD and decision Q4. Confirmed HKD/JPY schedules and per-currency ceiling claims are absent; retained universal USD schedule and USD 10,000,000 ceiling agree | Current delta and PRD; focused QA2 note |
| QA2 coverage for repaired suites | Payment Settings: 11 active draft cases and 5 out-of-suite entries; Bid Increments: 12 active draft cases and 16 reconciled scenarios; source HEAD `fd43ec32a046a660c37448d426da021361272f1a` | Confirmed no requirement, journey, scenario, case ID or case text changed. Coverage claims remain within the existing suite dispositions; `TC-y0l` remains unlinked with its stated reason | Focused QA2 notes in both feature suites |
| Other 17 capability scopes, unchanged PRD and decision checks, accepted overlaps and prior findings | Prior reviewed SHA `3d3368db613c19c4ddc30b8fb0bf6a24e223065a`; repaired paths are the complete diff from that review | Carried forward unchanged coverage from the prior independent review. No changed dependencies or expanded scope were found | Prior ledger at `3d3368db613c19c4ddc30b8fb0bf6a24e223065a` |
| Acceptance preflight | Exit 0; fingerprint `889549c14f701bf8957a02fb0a27be1a96c0be90b7fe19784bc45c2c82b561f9`; baseline `313c29bfb08b0a85b88819b17e66f32a28263098c9c71d5d7cf87b10bd616ed7`; 53 durable files | Reused matching receipt `/private/tmp/pr1155-feature-fix-accept.txt`; ready to fold and accept | Current receipt |
| Current-tree manual check | Exit 0; 295 warnings | Reused matching receipt `/private/tmp/pr1155-feature-fix-manual.txt`; warnings do not block | Current receipt |
| Change-scoped case and scenario validation | Exit 0 | Reused matching receipt `/private/tmp/pr1155-feature-fix-cases.txt` | Current receipt |

Ready to accept
