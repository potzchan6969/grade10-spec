reviewed: 75f2c0baac232daaa1a4d4bd50e8dc6bdff4780b (plus uncommitted change files)
source-identity: 3e85968291f13b6adb4c7146974374f16c3ba9c60438e626e960756b696bcae3 (rerun on 2026-10-20 after the USD-default amendment)
baseline-identity: 134f0563e99c4ef8e256d9f8787108c5576354d4a8b365c533f4fa4a369989ea
verdict: Ready to accept

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | docs/prds/products/grade10-site/auction/post-bidding.md:703 · docs/prds/products/grade10-admin/auction/management.md:568,652 · openspec/changes/preselect-hkd-first-payment-method/specs/ | Three page lines still state "nothing preselected" — the post-bidding `Settlement currency` decisions row and the management test-winners row and decisions row — while the delta and the Order Setup table preselect HKD and the first offered method. One fact stated two ways. Repaired on the pages: each now carries 🚧 HKD and the first offered method preselected; the Order Setup defaults column also carries 🚧. | Product (@tangconst) | the pages, then `decisions.md` Q1 already records the supersession | fixed 05e063a+worktree |
| 2 | fix | openspec/changes/preselect-hkd-first-payment-method/specs/grade10-site/auction/winner-order/feature-tcs.md — `US25-TC9` (was `US25-TC17`) | Numbering repaired to the next free durable case number during review | agent | — | fixed 05e063a+worktree |
| 3 | fix | openspec/changes/preselect-hkd-first-payment-method/specs/grade10-admin/auction/test-winners/user-journeys.md | Missing file was added — the capability's durable `Walked by: nobody` line | agent | — | fixed 05e063a+worktree |
| 4 | fix | openspec/changes/preselect-hkd-first-payment-method/specs/grade10-site/auction/domain-tcs.md:6 | US12 journey section carried no three-line story; added the durable story | agent | — | fixed 05e063a+worktree |
| 5 | fix | openspec/changes/preselect-hkd-first-payment-method/decisions.md `## Raised` · tasks.md | Raised table landed on `Q1, Q2` — split into one row per question; tasks now end on `The walk` | agent | — | fixed 05e063a+worktree |
| 6 | note | openspec/specs/grade10-site/auction/domain-tcs.md `US12-TC3` | The durable case still asserts a USD amount beneath each HKD summary line — stale against `order-summary-hkd-conversion-note`, which this change does not touch | — | a later suite refresh | open |
| 8 | note | whole change | Amended 2026-10-20: the default is now the first offered currency (USD, the first tab), not HKD — decided by @tangconst. Deltas, cases, decisions, tasks, pages and the preview dialog all agree; strict validation passes; no requirement text changed in kind, so this review's checks carry | — | — | open |
| 7 | note | accept:preflight | Refusals that remain are pre-existing store noise (`notifications-order` `Contact Us destination` traces, `complete-auction-post-sale` reissued SC ids, cross-store suite mismatches); nothing names this change beyond `former Type: acceptance` warnings | — | — | open |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| proposal.md, decisions.md, tasks.md, .openspec.yaml | worktree | page-to-delta, nothing-open, decisions name their lines | — |
| specs/grade10-site/auction/winner-order/spec.md | worktree | folded-result read against durable 636-672, 1451-1727, 3455-3556; scenario ids and titles preserved; SC-278 rev=2 keeps title per convention | — |
| specs/grade10-admin/auction/test-winners/spec.md | worktree | folded-result read against durable 30-192; SC-11 rev=3 | — |
| feature-tcs deltas (winner-order, test-winners), domain-tcs delta | worktree | cases stay draft; trace markers cover SC-278/SC-91/SC-305/SC-306, SC-11, US12-TC3 | — |
| docs/prds/products/grade10-site/auction/post-bidding.md#order-setup, #payment-methods-by-currency | worktree | same-facts against the delta; currency-switch bullet agrees | — |
| docs/prds/products/grade10-admin/auction/management.md test-winners lines | worktree | same-facts — disagreement found, finding 1 | — |
| complete-auction-post-sale, usd-lot-currency-winner-settlement-choice | accepted (acceptance.json, 2026-10-08 / 2026-10-13) | overlap — both accepted and folded; this acceptance amends their result, recorded at decisions.md Q1 | — |
| pnpm plan:review-preflight --json | ready, no blockers | manifest, overlaps, durable targets | — |
| pnpm accept:preflight | refused on pre-existing store failures only | gate receipt; change-attributable errors fixed during review | — |
| pnpm check:manual | 14 failures, all pre-existing outside this change | page warnings; nothing names this change | — |
