reviewed: 14aec63344c318d54a448e6de0a4039cfdf9bcb2
source-identity: sha256:4413f4705158deda19c001591afb3a95b078e77853c4e43c76cb198f8b1ac6b2 (review-scope-inputs, 388 inputs)
baseline-identity: 4f82a026789c7e0be9da0cd3103cb8701f08e359a05c648542c4ba4bdd262120
verdict: Ready to accept

Rerun of the amendment review at 1eddc14f6, bounded by `git diff 1eddc14f6 14aec6334` (7 sources). The repair changed requirement text, the dialog requirement (`spec.md:346`) and Today's (`spec.md:530`), so both were reread against the page's Opening and Today lines, Q48 to Q50, SC-82, SC-85 and the tech design's Fold and scroll. Every repaired line was checked against the finding it answers. Rows #1 to #13 keep their numbers from 1eddc14f6.

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | blocker | `daily-reminder.md:173` vs `:110`-`:114`, Q49, delta `spec.md:530`, SC-83 | The decision row now reads one group open on Today, the first with rows, chosen over every group folded; it agrees with the Inner groups line, Q49, the requirement and SC-83. It also carries the dialog's fade. | PM | - | fixed 14aec6334 |
| 2 | fix | delta `spec.md:346`, `:530`, SC-82, SC-85; `tech-design.md:110` vs `daily-reminder.md:92`-`:94`, `:115`-`:117`, Q50 | Both requirements, SC-82 (rev 2) and SC-85 now fade the edge that has more; the tech design fades the dialog as on Today. | Dev | - | fixed 14aec6334 |
| 3 | fix | `tech-design.md:138` vs SC-87 | The tech design now gives SC-87's heading, `Auction daily reminder · Monday 12 Oct 2026`. | Dev | - | fixed 14aec6334 |
| 4 | fix | `tech-design.md:138`, `tasks.md:49` (5.2) | The design splits a list's rows across as many sections as keep each under 3,000 characters after escaping; task 5.2 names the test. The application's guard is task 5.2's work, not yet built. | Dev | - | fixed 14aec6334 |
| 5 | fix | `proposal.md:33`-`:35`, `:65` vs Q51 | The proposal now posts one message per product to its own channel, headed with the product, each service setting its own channel and token. | PM | - | fixed 14aec6334 |
| 6 | fix | `decisions.md:78`, `:80` | Q49 names the half of Q48 it replaces; Q51 names Q18. | PM | - | fixed 14aec6334 |
| 7 | fix | `feature-tcs.md:6`, `:2782`, `:2788`, `:2875` | SC-83 now goes to task 5.3; the Settled line opens the first group and fades the dialog; the scenarios no case reaches name SC-84 to SC-87. The count the repair wrote is #14. | QA2 | - | fixed 14aec6334 |
| 8 | note | `daily-reminder.md:108`-`:109` vs delta `spec.md:530` | The requirement now sets the one height by the taller of Needs you and an opened group, as the page does. | Dev | - | fixed 14aec6334 |
| 9 | note | `tech-design.md:36` vs `tasks.md:25` (3.4); `tech-design.md:110` | The Nothing yet groups now carry "each the operator can open". Ticked task 3.4 still names only `services/reminder/slackMessage.ts` while the composer sits in `@grade10/slack`; true of the application as built. | Dev | Optional | open |
| 10 | note | `daily-reminder.md` (`pnpm check:manual`) | 126 lines of prose against the style's 120; a warning. | PM | Optional | open |
| 11 | note | `openspec/specs/grade10-admin/console/daily-reminder/feature-tcs.md` (`pnpm check:manual`) | The durable suite's `covers` markers trace out-of-suite scenarios and leave SC-18, SC-19, SC-42, SC-53, SC-56, SC-57, SC-59, SC-60 and SC-65 untraced; the change's suite keeps them. Warnings only. | QA2 | Optional: `/tcs-review` after the build | open |
| 12 | note | `docs/prds/products/grade10-admin/console/index.md:22`-`:24` | Carried from 06a82418 #3: the console index's Daily reminder bullet stays unmarked. | PM | Optional | open |
| 13 | note | delta `spec.md:142`, `daily-reminder.md:59`-`:61`, Q31 vs `openspec/specs/grade10-admin/auction/post-sale/spec.md:899` | Carried from 06a82418 #8: a flagged order shows two waits on two surfaces, as decided. | - | None | open |
| 14 | fix | `feature-tcs.md:2788`, `:2882` vs delta `spec.md` | The QA2 record says 87 scenarios after the amendment and "each of the 87" named by a task. The delta holds 85: ids run to SC-87, and SC-55 and SC-58 do not exist, as the 81 before the amendment already counted. Every one of the 85 is named by a task. | QA2 | `feature-tcs.md`: 85 | open |
| 15 | fix | `feature-tcs.md:2882` vs `tasks.md` group 6 | The same line says the walk group walks US-01 and US-02 in 5.1, US-03 in 5.2 and US-04 in 5.3; the walk is now group 6 (6.1 to 6.3), and 5.1 to 5.3 are the repairs. | QA2 | `feature-tcs.md`: 6.1, 6.2, 6.3 | open |

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| `pnpm plan:review-preflight support-admin-daily-reminder --json` | status ready, no blockers, sourceIdentity 4413f470… (388 inputs) | Gate receipt | - |
| `pnpm accept:preflight support-admin-daily-reminder` | ready to fold and accept, fingerprint 15039100542c87fa66745846c1337224f17e014b26edadc744af0188f70ae57d, baseline 4f82a026…, 3 durable files to write | Gate receipt | - |
| `pnpm check:manual` | exit 0; no `changed meaning` on this change's pages; `dense` on `daily-reminder.md` (#10) | Warnings | - |
| `pnpm run tcs:validate` | no errors; change suite 80 draft, 0 approved | New cases stay draft | - |
| `git diff 1eddc14f6 14aec6334` (7 sources and this ledger) | 14aec6334 | Each repair against #1 to #9 | - |
| delta `spec.md` dialog requirement `:346`, Today requirement `:530`, SC-82, SC-85 | 14aec6334 | Changed requirement text: same facts against `daily-reminder.md:92`-`:94`, `:108`-`:121`, Q48 to Q50, `tech-design.md:110` | - |
| `daily-reminder.md:173`, `decisions.md:78`, `:80`, `proposal.md:33`-`:35`, `:65` | 14aec6334 | Same facts, nothing open | - |
| `feature-tcs.md` Out of suite, QA2 record | 14aec6334 | Scenario routing; scripted join of scenario ids to `tasks.md` (85 scenarios, all named) | - |
| `tasks.md` 5.2, `tech-design.md:138` | 14aec6334 | The section split delivered and tested | - |
| The rest of the amendment's scope: Slack and environment requirements, SC-83, SC-84, SC-86, SC-87, Feature set, tasks 3.6, 4.6, groups 5 and 6, the page's Slack section | unchanged since 1eddc14f6 | Page to delta, same facts, folded result | 1eddc14f6 |
| Requirements the amendment does not touch | unchanged since 06a82418 | Page to delta, same facts, journeys to scenarios | 06a82418 |
| Overlapping changes on `grade10-admin/console/daily-reminder` | none (preflight) | Overlap | - |
