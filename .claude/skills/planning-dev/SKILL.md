---
name: planning-dev
description: Plan and accept one OpenSpec change in one invocation: QA1 writes blind cases, Dev writes design, scenarios and tasks, and QA2 reconciles them. Publish the accepted contract before implementation.
---

# Plan and Accept a Change

- **Scope** - Run `/planning-dev <change>` after the proposal, decisions,
  journeys and any required UI design are settled. Coordinate QA1, Dev, QA2,
  unresolved decisions, acceptance review and publication.
- **Inputs** - Honor recorded decisions and existing user authorization. Ask
  only about unresolved choices; do not repeat settled readiness reviews.
- **Cases** - Planning produces draft cases. Human classification and execution
  belong to `tcs-review` and `tcs-run-sheet` after deployment.

## Prepare

Read the capability PRD, durable spec, overlapping active changes, proposal,
decisions, journeys, UI design where present, and the relevant
`openspec instructions` output. Resolve product, scope and technical questions
in their source artifacts before acceptance. Do not invent an answer.

Write the `spec.md` outline: `## Purpose` and `## Feature set`. Freeze the
complete anchors: the journey set plus the feature-set root groups. If an
anchor changes after a reading starts, invalidate QA1 and Dev and restart both
in fresh contexts. Patch non-anchor clarifications explicitly, then rerun QA2.

## Decision Sweep

Before Dev writes deltas, collect every open decision once:

- **Open Choices** - Every ❓ or `TBC` in the page sections the change cites
- **Decision Log** - Read human-provided decisions first; do not re-ask them
- **Overlap** - Shared requirements and `depends_on` order, settled in step 5

Put unresolved choices to the human as a [Clarification Request](../../../AGENTS.md#questions-and-blockers).
Record each answer on the page and in `decisions.md` before drafting. Raise newly exposed decisions when they affect the plan.

## One Planning Run

1. **QA1** - Blind cases. Apply [When a Change Touches a Suite Above It](../../../docs/governance/specs-to-test-cases.md#when-a-change-touches-a-suite-above-it) before the readings, and a domain or
   product hit drafts that suite into the change. Then, in a fresh context,
   QA1 runs `spec-to-tcs` against only frozen anchors and the domain suite
   above, without requirements, scenarios, technical design, QA2 or archive
   material. Keep `feature-tcs.md` draft.
2. **Dev** - Delivery draft. In another fresh context, Dev writes the
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
   Before QA2, check the draft's structure, trace markers and overlaps:

   ```bash
   pnpm plan:review-preflight <change>
   ```

   A refusal is a Dev repair; rerun the check before starting QA2.
3. **QA2** - Reconciliation. In a fresh context, reconcile each blind case
   and scenario against the anchors in `feature-tcs.md`. Record whether a case
   was folded, rejected with reason, raised for the human or remains uncovered.
   Put unresolved product questions in `decisions.md`'s `## Raised` table.
4. **Resolve and Check** - A question the readings cannot settle goes to the
   same human, as a numbered `Q<n>` row, and is put to them as a
   [Clarification Request](../../../AGENTS.md#questions-and-blockers).
   The same human resolves questions that affect behaviour, scope, design,
   architecture or tasks. Update the source first,
   then dependent artifacts and apply the restart rule under Prepare. Confirm
   artifacts are complete and new cases remain draft.
5. **Reconcile the Cluster** - Before `accept-review`, group the open
   changes that edit one durable requirement or are linked by `depends_on`
   (the preflight's `--clusters` report lists them); a change in no cluster
   skips this. Write one sheet per cluster, `reconciliation.md` in the
   first-accepted change's directory: no validator reads it and acceptance
   does not hash it, like `accept-review.md`. It holds:

   - **Ownership** - The change owning each shared requirement (the `overlap`
     rule of `check:manual`) and what the others say
   - **Decisions** - Open ❓ and conflicts, resolved through the shared
     Clarification Request; preserve the human's decision log
   - **Order** - The acceptance order

   Reconcile, do not merge: each change keeps its own scope, acceptance and
   verdict, and a slow change never holds the others once ownership and order
   are settled.
6. **Review** - In a fresh context, run `accept-review`; a cluster is reviewed
   as one run. Accept only on its `Ready to accept` verdict. Batch findings by source owner for repair. Follow `accept-review`
   for the ledger and rerun criteria, including changed requirement text.
7. **Accept and Publish** - With the human's acceptance authorization, obtain
   the current baseline and accept the reviewed plan:

   ```bash
   pnpm accept:preflight <change>
   ```

   ```bash
   pnpm spec:accept <change> --baseline <digest> --reviewed-by <human>
   ```

   An amendment adds `--supersedes <fingerprint>`. Follow the repository's
   [publishing workflow](../../../AGENTS.md#pushes-pull-requests-and-commits)
   to land the accepted contract before implementation.

## Artifact Constraints

Every external implementation change needs `tech-design.md`; use
`design_waived: <why>` only for work wholly in this store. Each scenario has
an anchor in `**Serves:**`; each case has one in `**Trace:**`. Reconciliation
does not add scenario ids to blind cases. Task groups include tests before
implementation, verification, and a final end-to-end walk.

## Completion

- **Evidence** - Report the change, completed artifacts, QA1/Dev/QA2 results,
  acceptance verdict, baseline, accepted fingerprint and published revision.
  Name any remaining decision or failed check; do not claim acceptance or
  publication from a draft or review alone.
- **App Repository Handoff** - Planning ends with the accepted contract
  published. Pass the change id, accepted fingerprint and published store
  revision to the app repository's implementation workflow. Implementation,
  verification and archive run there under its own skills; do not invoke this
  store's apply or archive skills for app work.
