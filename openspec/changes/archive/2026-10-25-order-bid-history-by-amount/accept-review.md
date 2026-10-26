reviewed: b1e15405d8692e43fe43062e5c16aa4c6453b2c6 (store HEAD, clean tree; rerun of the review at 70b1b6b, repair diff `70b1b6b..HEAD`)
source-identity: bf88916f304b05a53c52e09f0eab1bfc52ac9f05731b53ed1ceeb5db6460a8a0
baseline-identity: ea76cb9b921c36f9d1bd06d7445a80e6e12bfdd3fe204b0993903c9466b0a1cb
verdict: Ready to accept

| # | Severity | Where | Finding | Owner | Fix in | Status |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | fix | delta `feature-tcs.md` US3-TC7 (`g10.auction-bidding-history.US3-TC7`), rows 1 and 2; delta `spec.md` SC-56 (`g10.auction-bidding-history.SC-y3v`) | Neither TC7 row can tell Q8's rule (a raise reads by its time) from the rejected option (b) (by its own amount). In row 1 the raise (560) is newer and higher than the 280 bid; in row 2 the newer bid is 585, above the raise's 560. Both orders come out the same by time and by amount. The raise rule is only exercised where a newer record is LOWER than the raise, e.g. customer B places a maximum of 500 so B's bid at 500 and A's automatic response at 525 are newer than A's raise to 560 and must read above it (by amount the raise would read above both). SC-56 states "below every record newer" and is right; the case that serves it does not fail an implementation that sorts a raise by amount, and task 2.1's tests derive from the scenario. | QA (QA1/QA2 through planning-dev) | `feature-tcs.md`: add a row to TC7 where the newer records are lower than the raise (fixture to be checked against the tiers) | open |
| 2 | fix | `tech-design.md` Decisions · Comparison ("Every record one auction decision wrote sorts at that decision's highest public bid") and Risks; against delta `spec.md:42-45` (requirement) and SC-56 | The tech design does not deliver the new clause: a decision that wrote no public bid (a raise by the leader) has no highest public bid to sort by, and the design names no key for it nor how it compares to records keyed by amount. It is consistent only because time and amount agree for bids; that is the reason to say it. `tasks.md` 2.2 cites SC-56 but the design owns the mechanism. | Dev | `tech-design.md`: add the key for a no-bid decision (its own time, newer first) and how it compares with amount-keyed decisions, then the stable-order tie at one timestamp | open |
| 3 | fix | delta `feature-tcs.md` Reconciliation · "Product page" ("is silent on the raise that causes no bid ... owes one clause") against `docs/prds/products/grade10-site/auction/bidding.md:326-329` | Stale: the PRD line now carries the clause. Also the `Story order` decision row (`bidding.md:547`) names the set but not the raise; it is not untrue, only short. | QA (Reconciliation); PM (row, optional) | restate the Reconciliation line; optionally one clause on the `Story order` row | open |
| 4 | note | Q8 `decisions.md` (decided by the round) | See "Held test" below. The round followed its rule; no hold is required. | none | none | open |
| 5 | note | delta `feature-tcs.md` Reconciliation, line "QA1's extract of the spec ran wider than the Feature set" | See "QA1 blindness" below. Disclosed, does not block. | QA | none | open |
| 6 | note | durable `feature-tcs.md:230` (US2-TC4 "records one maximum set at USD420, then one raised to USD560"), Walk 1 step 2, delta spec Feature set | Confirmed a note: both narrate the order the owner acted in, assert no top-down order, and US2-TC4's `Decided by` e2e is the only place that could assert it; task 2.1 explicitly checks "no expectation reads a maximum set above its later raise". The delta's Reconciliation flags it and defers the wording to `/tcs-review`. Durable US6-TC2 ("the raise, then the set") is the Your maximums tab, newest first, a different surface that this change leaves. | none | none | open |
| 7 | note | SC-55/SC-56 trace ids `g10.auction-bidding-history.SC-d6n`, `...SC-y3v`, case `...TC-c8f` | Accepted: `pnpm accept:preflight`, `pnpm run tcs:validate` and `pnpm run validate:changes` pass; the ids occur only in this change's `spec.md` and `feature-tcs.md`; no duplicate id in the durable `spec.md`; display names SC-55 and SC-56 are unused in the durable spec (durable top is SC-53, the delta's SC-54 follows). | none | none | open |
| 8 | note | `decisions.md` `## Raised` | One row, landed on Q8; no open row, no `❓`, no `TBC`, no `awaiting:`. | none | none | open |
| 9 | blocker | prior finding 1: Walk 3 with ten step-range setups | The delta suite is now 176 lines with no walks; `pnpm accept:preflight` prints "ready to fold and accept" with no suites error. | QA | none | fixed b1e1540 |
| 10 | blocker | prior finding 2: delta suite not rebased onto the regenerated durable suite | Rebased: TC1 (`rev` 2) and TC6 (`rev` 2) revise the durable cases in place at their durable covers (11 and 12 plus `SC-m9q`; TC6 adds `SC-d6n`); TC3 is not put back; TC2 and TC5 are gone; one new case, TC7, with its `New, not an extension` line. Fixtures re-derived against the tiers (1 from 0, 2 from 10, 25 from 200): TC1 325 and 435; TC6 rows 5, 9, 10, 11 (capped), 13 (12 once) are whole-dollar and the 13 row carries the maximum above the bid. Status drops from `actual`/`automated` to `draft`/`manual` and the Reconciliation says why. `tcs:validate` has no warning on the delta suite. | QA | none | fixed b1e1540 |
| 11 | note | prior finding 3: Raised empty | Q7 stays a decision row; Q8 is logged in `## Raised` and landed. | Dev | none | fixed b1e1540 |
| 12 | fix | prior findings 7 to 10 (Feature set wording, requirement paragraph 1, "history" for "chronology", tech design key) | Unchanged since 70b1b6b except the requirement's new raise clause and the History order bullet, which agree. | none | none | fixed 9c26fc0 |

## Held test

Q8 asks where a maximum raise that causes no bid sorts. The held test in `workflow-round` holds a row that moves scope, is costly to undo, needs a fact only a person has, or divides its options by more than a task group. Q8 meets none: it moves no scope, a comparator key is cheap to undo, it needs no outside fact (it follows Q3 and the data's own time), and the options differ by a line in one comparison. So decided by the round is the rule's outcome and not a breach. It is still a product detail the reader sees (the owner's raise above or below their own set and bid), it is on the PRD as a 🚧 clause, and any hand can overturn it with one reply. The human accepting this change can reopen it with that reply; the review's view is that it needs no hold. Contrast the equal-maximum case, which was held for the user and confirmed (item 6 of the brief).

## QA1 blindness

The suite's Reconciliation records that QA1's extract ran past the Feature set and showed the requirement and scenario text, and that nothing verifies that no case was shaped from it. For acceptance it does not matter, for three reasons: the cases are `draft` and `manual` and need human QA (`/tcs-review`) before approval; the revised TC1 and TC6 keep their durable covers and fixtures, which were written blind earlier, and change only the expected order the PRD line and Feature set already state; TC7 is QA2's own, written with the scenarios in hand, and is labelled so. What it costs is independence: the cases cannot be offered as evidence that the scenarios are readable alone. The one place that shows it is finding 1, where TC7 mirrors the scenario's example and so cannot fail the neighbouring rule. Acceptance hashes neither the extract nor the blindness claim, and no tool checks it.

## Equal maximum

Confirmed the user's rule (earlier leader A stays leading, both records the same amount, A's response above B's bid) in: the Feature set `Tie outcome`, requirement paragraph 2, SC-55's last AND, TC6's `10` row, `## Settled`, and `tech-design.md` Equal maximum. No source says otherwise.

## Raise rule against the pages

The PRD `Highest bid on top` 🚧 line (`bidding.md:326-329`) carries the raise clause and is served by the modified requirement and SC-56. Unmarked lines read: `One listing's story` (`:323`, interleaving, no order), `Your bidding, on the lot` (a different surface), and the `Story order` row (`:547`, not contradicted). A search of the grade10-site PRDs and the durable auction specs found no other unmarked line that states the history's order. No ❓ or `TBC` in scope.

## Closed rows

- **Where does a maximum raise that causes no bid sort?** - `decisions.md` `## Raised`, closed on its recommendation (a), landed as Q8, source `decisions.md` Q8 and the suite's Reconciliation "Raised, answered". The accepting human reopens it with one reply.

## Human input

### Questions

1. **Raise placement** - Optional: confirm that a maximum raise that causes no bid reads by its own time, newer above older (Q8), or choose another placement.
   - **A - Confirm Q8 as written - Recommended** - No change; the PRD line, SC-56 and TC7 stand.
   - **B - Sort a raise by its own amount** - The raise can read above bids newer than it; SC-56, the PRD clause, Q8 and the tasks change, and a new restart of QA1/QA2 is needed.
   - **Why it matters** - What an owner reads when they raise a maximum that places no bid.
   - **Blocks** - None - optional feedback.
   - **Reasons** - Q8 in `decisions.md`; the held test in `workflow-round` does not hold it.

### Decisions made by Agents

- **Findings 1 to 3 left as `fix`, not blockers** - Each has a single source repair and the contract (the PRD line, the requirement, SC-55 and SC-56) is consistent; the repairs are case and design wording owned by QA and Dev.

## Coverage

| Source or dependency | Checked identity | Checks applied | Carried from |
| --- | --- | --- | --- |
| `pnpm plan:review-preflight --json` | status ready, no blockers, `overlaps: []`, digest bf88916f... | evidence gate | none |
| `pnpm accept:preflight` | fingerprint `f432cfe3f21d358e181403694a6c6f9de665cc98cb7c87e06c073942d837eb8e`, baseline `ea76cb9b...`, 3 durable files | "ready to fold and accept"; the only note concerning this capability is the durable `SC-53` out-of-suite line, unrelated | none |
| `pnpm check:manual` | 0 failures, 226 warnings | no warning in scope beyond the standing ones | 70b1b6b for the `## Raised` warning, now cleared |
| `pnpm run tcs:validate`, `pnpm run validate:changes --strict` | pass | delta suite shows no warning; the one bidding-history warning (`US9-TC1`) is durable and not this change's | none |
| Repair diff `70b1b6b..HEAD` (`bidding.md`, `decisions.md`, delta `spec.md`, delta `feature-tcs.md`, `tasks.md`) | b1e1540 | checks 1 to 6 of the brief; Page to delta, Same facts, Nothing open, Folded result, Designs, Journeys and cases | none |
| Dependents: durable `bidding-history/spec.md` (SC ids, order text), durable `feature-tcs.md` (US2-TC4, US3-TC4, US6-TC2, US8-TC1, Walk 1), PRDs under `grade10-site` (order wording), `tech-design.md`, `user-journeys.md`, `proposal.md` | b1e1540 | findings 2, 3, 6, 7; `user-journeys.md` and `proposal.md` unchanged in the repair diff | 70b1b6b for those two |
| Overlapping changes | no other change with a delta on `bidding-history` | none | none |
| Issue 9gag/grade10#1292 | not reachable | not read; decisions taken from `decisions.md` and the user | none |
