---
name: planning-dev
description: Plan and accept one OpenSpec change in one invocation: QA1 writes blind cases, Dev writes design, scenarios and tasks, and QA2 reconciles them. Publish the accepted contract before implementation.
---

# Plan and Accept a Change

`/planning-dev <change>` is the single planning entry point after the PM has
settled the proposal, decisions and journeys, and the designer has added any
needed UI design. It owns QA1, Dev, QA2, clarification, acceptance and
publication. Durable specs hold the latest accepted contract; an immutable
acceptance snapshot and fingerprint define what implementation delivers.

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

1. **QA1 - blind cases.** In a fresh context, run `spec-to-tcs` against only
   frozen anchors. Exclude requirements, scenarios, technical design, QA2 and
   archive material. Keep `feature-tcs.md` draft.
2. **Dev - delivery draft.** In another fresh context, write `tech-design.md`,
   requirement scenarios in `spec.md`, then `tasks.md`. Dev does not read QA1
   until this independent draft is complete. Derive scenarios from the PRD,
   journeys, UI design and technical design. Use
   `docs/governance/task-ownership.md` for groups and owners.
3. **QA2 - reconciliation.** In a fresh context, reconcile each blind case
   and scenario against the anchors in `feature-tcs.md`. Record whether a case
   was folded, rejected with reason, raised for the human or remains uncovered.
   Put unresolved product questions in `decisions.md`'s `## Raised` table.
4. **Resolve and check.** The same human resolves questions that affect
   behaviour, scope, design, architecture or tasks. Update the source first,
   then dependent artifacts. A changed anchor restarts QA1 and Dev; another
   edit reruns QA2. Confirm artifacts are complete and new cases remain draft.
5. **Accept and publish.** Run `pnpm accept:preflight <change>`. With its
   printed baseline, run `pnpm spec:accept <change> --baseline <digest>
   --reviewed-by <human>`. An amendment names `--supersedes <fingerprint>`.
   Acceptance publishes the durable contract and preserves prior snapshots.

`acceptance.json` version 1 records the change, baseline content fingerprint,
reviewer, time and scoped artifact hashes. `implementation.json` version 1
records the accepted fingerprint, repository commits and components. They are
planning and engineering evidence, not QA execution evidence.

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

Implement the accepted snapshot and check compatibility with newer durable
contracts. After engineering verification, record the accepted fingerprint,
repository commits and components with `pnpm plan implementation`. Archive
after that verification and before deployment. Archive preserves history and
does not fold again or wait for human QA. After deployment, QA reviews with
`/tcs-review` and executes manual cases with `/tcs-run-sheet` where needed.

## Related

- `planning-pm` - proposal, decisions and journeys.
- `planning-design` - optional UI design.
- `spec-to-tcs` - internal QA1 generator.
- `tcs-review` - human QA after implementation.
- `openspec-apply-change`, `openspec-archive-change` - implementation and archive.
