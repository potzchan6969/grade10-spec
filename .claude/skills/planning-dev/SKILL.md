---
name: planning-dev
description: Plan and accept one OpenSpec change in one invocation: QA1 writes blind cases, Dev writes design, scenarios and tasks, and QA2 reconciles them. Publish the accepted contract before implementation.
---

# Plan and Accept a Change

`/planning-dev <change>` is the single planning entry point after the PM has
settled the proposal, decisions and journeys, and the designer has added any
needed UI design. It owns QA1, Dev, QA2, clarification, acceptance and
publication. Durable specs hold the rolling latest accepted contract. The
immutable acceptance snapshot and fingerprint preserve planning provenance;
the first implementation claim records the durable contract baseline that
archive will reconcile.

Planning creates draft cases only. Human QA reviews and classifies them with
`/tcs-review` after deployment makes the implementation available; manual
execution uses `/tcs-run-sheet`. Do not mark new cases approved or actual.

## Prepare

Read the capability PRD, durable spec, overlapping active changes, proposal,
decisions, journeys, UI design where present, and the relevant
`openspec instructions` output. Resolve product, scope and technical questions
in their source artifacts before acceptance. Do not invent an answer.

Write the `spec.md` outline: `## Purpose` and `## Feature set`. Freeze the
complete anchors: the journey set plus the feature-set root groups. If an
anchor changes after a reading starts, invalidate QA1 and Dev and restart both
in fresh contexts. Patch non-anchor clarifications explicitly, then rerun QA2.

## One Planning Run

1. **QA1 - blind cases.** Levels first: the rulebook's **When a Change
   Touches a Suite Above It** runs before the readings, and a domain or
   product hit drafts that suite into the change. Then, in a fresh context,
   QA1 runs `spec-to-tcs` against only frozen anchors and the domain suite
   above, without requirements, scenarios, technical design, QA2 or archive
   material. Keep `feature-tcs.md` draft.
2. **Dev - delivery draft.** In another fresh context, Dev writes the
   technical design in `tech-design.md`, requirement scenarios in `spec.md`,
   then `tasks.md`. Dev does not read QA1 until this independent draft is
   complete. Derive scenarios from the PRD, journeys, UI design and technical
   design: the requirements pass reads `tech-design.md` beside
   `ui-design.md`; a requirement contradicting either is not written. A
   requirement that reaches a design another hand owns writes a dated wait on
   them rather than writing over them:
   `awaiting: tech-design: "<date>, <requirement> re-read - @<tech>"`. It is
   cleared by their edit or by that artifact's `reviewed:` line, and it holds
   no stage. Use `docs/governance/task-ownership.md` for groups and owners.
3. **QA2 - reconciliation.** In a fresh context, reconcile each blind case
   and scenario against the anchors in `feature-tcs.md`. Record whether a case
   was folded, rejected with reason, raised for the human or remains uncovered.
   Put unresolved product questions in `decisions.md`'s `## Raised` table.
4. **Resolve and check.** A question the readings cannot settle goes to the
   same human, as a numbered `Q<n>` row, and is put to them as a
   [Clarification Request](../../../docs/governance/round-summary.md#clarification-request).
   The same human resolves questions that affect behaviour, scope, design,
   architecture or tasks. Update the source first,
   then dependent artifacts. A changed anchor restarts QA1 and Dev; another
   edit reruns QA2. Confirm artifacts are complete and new cases remain draft.
5. **Review.** In a fresh context, run `accept-review`. Accept only on its
   `Ready to accept` verdict; fix each blocker in its source first.
6. **Accept and publish.** Run `pnpm accept:preflight <change>`. With its
   printed baseline, run `pnpm spec:accept <change> --baseline <digest>
   --reviewed-by <human>`. An amendment names `--supersedes <fingerprint>`.
   Acceptance publishes the durable contract and preserves prior snapshots.

`acceptance.json` version 2 records the change, baseline content fingerprint,
reviewer, time, scoped artifact hashes and derived durable target paths and
anchors. `implementation.json` version 2 records the accepted fingerprint, the
first-claim durable commit and targets, repository commits and components. They
are planning and engineering evidence, not QA execution evidence.

## Artifacts

| Artifact | Owner | Contract |
| --- | --- | --- |
| `tech-design.md` | Dev | Implementation decisions, interfaces and risks |
| `spec.md` | QA1 outline, Dev scenarios | Frozen anchors and accepted requirements |
| `feature-tcs.md` | QA1, QA2 | Blind draft cases and reconciliation |
| `tasks.md` | Dev | Scenario-linked groups and verification |

Every external implementation change needs `tech-design.md`; use
`design_waived: <why>` only for work wholly in this store. Each scenario has
an anchor in `**Serves:**`; each case has one in `**Trace:**`. Reconciliation
does not add scenario ids to blind cases. Task groups include tests before
implementation, verification, and a final end-to-end walk.

## After Implementation

At the first task claim, `pnpm plan claim` records the published durable commit
and derived targets. Implement against the rolling durable contract. After
engineering verification, record repository commits and components with `pnpm
plan implementation`. Archive compares the claim baseline with current targets:
every difference needs a compatibility acknowledgement, and semantic changes
name test or other evidence. Archive preserves history and does not fold again
or wait for human QA, and deployment does not wait for archive. After deployment, QA reviews with `/tcs-review` and
executes manual cases with `/tcs-run-sheet` where needed.

## Related

- `planning-pm` - proposal, decisions and journeys.
- `planning-design` - optional UI design.
- `spec-to-tcs` - internal QA1 generator.
- `accept-review` - the page, designs, deltas and durable specs agree before acceptance.
- `tcs-review` - human QA after implementation.
- `openspec-apply-change`, `openspec-archive-change` - implementation and archive.
