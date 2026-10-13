# Dev R5 source repair report

## Done

- Added complete modified requirement deltas for five site capabilities. The deltas retain all 62 scenario IDs and titles. The 34 scenarios with changed behavior use the next trace revision; unchanged scenarios keep their source revision.
- Repaired USD bid facts and schedule outcomes, including auto-bidding SC-30/30a, SC-09/10/11/12/13/33/37/41/42/43, account-record SC-71, listing-page SC-43, bidder-suspension SC12/13/14, and notifications SC-50/51.
- Bound post-sale SC-84 and SC-250 to `post-sale-US-20` for telephone-recorded setup.
- Added site bid paths, backend-supplied viewer-floor behavior, and the internal-order settlement boundary to the technical design.
- Added tasks for all five site capabilities, telephone setup, exact quote totals, tenant/API authorization (including SC-50 send refusal and SC-77 reopen refusal), zero-value Insurance refusal, third setup reopen, early-reopen refusal, and internal invoice expiry without account suspension.

## Files

- `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/auto-bidding/spec.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/account-record/spec.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/listing-page/spec.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/bidder-suspension/spec.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-site/auction/notifications/spec.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/specs/grade10-admin/auction/post-sale/spec.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/tech-design.md`
- `openspec/changes/usd-lot-currency-winner-settlement-choice/tasks.md`

## Validation

- Scoped Python check: all 62 scenario IDs and titles are retained; 34 changed-body revisions are incremented once and unchanged revisions are preserved; all five site deltas contain no HKD or JPY bid facts.
- Task check: 79 task IDs are unique; all 290 referenced scenario IDs resolve in change spec files.
- Post-sale check: SC-84 and SC-250 bind `grade10-admin/auction/post-sale#post-sale-US-20`.
- `git diff --check` passed for the assigned tracked edits. Whitespace check passed for all eight assigned artifacts.
- No test suite or plan-review validator ran. No feature-TCS, domain-TCS, QA1 or QA2 artifact was read.

## Observer

No observation was logged. The shared observer workspace was scanned read-only; the parent task set a no-write boundary for it.
