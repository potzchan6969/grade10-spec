---
name: spec-to-tcs
description: Internal test-case generator for planning-dev's isolated QA1 pass and explicit suite refreshes. Writes blind feature cases or derives domain, product and platform suites. Invoke as /spec-to-tcs [platform|product|domain|feature] <target>.
---

# Generate Test Cases

- **Scope** - Generate or update the named suite in the named tree. Planning-dev invokes this for QA1; an explicit suite refresh may invoke it directly. New cases remain `draft`; human classification and execution belong to [tcs-review](../tcs-review/SKILL.md) and [tcs-run-sheet](../tcs-run-sheet/SKILL.md) after implementation is available.
- **Owner** - Read [Specs to Test Cases](../../../docs/governance/specs-to-test-cases.md) and [TCS Conventions](../../../docs/governance/tcs-conventions.md) once before writing. The rulebook owns suite formats, levels, ids, properties, revisions and lifecycle. Its rules prevail over conventions; apply the narrowest applicable convention and its `Refused` list.
- **Completion** - Deliver the suite, validation result, coverage gaps and unresolved decisions to the caller. A planning suite is ready for QA2 with draft cases; human approval is not this run's completion condition.

## Blind Feature Input

- **Isolation** - A feature run reads only the caller's bundle defined by the rulebook's `The Isolated Input`. Never read `## Requirements`, technical design, QA2 material, archive, or durable specs beyond the permitted sections and domain suite. This boundary also applies during refreshes and validation follow-up.
- **Sanitization** - The bundle keeps Purpose, Feature set, journeys, proposal, decisions including `Raised`, UI design without requirement-pass dispositions, linked PRDs, store context, and existing feature and domain suites without `Reconciliation`. Keep `Settled` for prior answers and existing case ids for continuity. Do not write cases for non-goals.
- **Direct invocation** - If no caller prepared a bundle, assemble only the permitted material and report that fact. Extract permitted sections without opening the rest of a spec. Do not inspect scenarios to check coverage or select updates; return scenario-dependent checks to QA2 or the review caller.
- **Different reading** - Use the rulebook's test-design checklist rather than paraphrasing journeys: boundaries, partitions, state transitions, CRUD, empty / one / many, null and missing, permissions, errors, SEO and indexability.
- **Blocked cases** - Preserve a case carrying `**Blocked:**` unchanged. It is an unanswered decision, not a rejected reading.

## Run

1. **Resolve scope** - Use `When Suites Are Generated`, `Where It Lives` and `Levels` in the rulebook. Infer the level from the target's shape and state it. Ask only when the target leaves the level or durable versus active tree ambiguous. Archive is never a target. Run multiple requested levels top down; offer a missing or stale higher suite before deriving the lower one.
2. **Handle existing work** - Follow `When a Suite Already Exists` and `Rules Revisions`. Show the file status, journeys, case counts and statuses, and revision. Preserve authorization already given for an update; otherwise ask which operation is wanted. Whole-file regeneration requires the rulebook's explicit confirmation and regeneration guard. Never delete a suite or silently reset reviewed cases. Report only anchor-based differences on a blind run.
3. **Read and prepare anchors** - Feature runs use the isolated bundle. Composed runs read every journey and PRD in their scope under `Compose from evidence`. Follow `Step 1: Digest the Capability` to add missing journeys from the feature set and PRD without adding behavior. If a planning run's frozen anchors would change, return the proposed change to planning-dev for its restart rule. Refuse generation only when the feature set and journeys describe nothing checkable.
4. **Write cases** - Follow rulebook Steps 2 through 5, `Naming`, `One purpose, one case`, and `A Case That Already Exists Is Not Written Twice`. Order positive cases before empty, missing and failure cases; include destructive cases only where the permitted input states that behavior. Keep case ids stable and marker revisions aligned. New cases are `draft` and `manual`; never assign human review verdicts or a fresh `Reviewed` stamp.
   - **Coverage** - Trace each feature case to one permitted anchor. Check every anchor has a case or an identified domain case asserting its outcome. Scenario coverage is QA2's job. A distinct refusal, boundary or outcome absent from that domain case still belongs in the feature suite.
   - **Mechanism** - Use only the permitted PRD, UI design and conventions to make cases runnable. Leave missing execution details for review preparation; do not invent a control label, route or outcome.
   - **Updates** - Apply current conventions to drafts without changing coverage or revision. Use the rulebook's behavior-change rules for reviewed cases only when the permitted input establishes the change; preserve unchanged reviewed and deprecated cases. Report automated cases whose changed behavior needs a test and acceptance-link task to the caller.
5. **Record questions** - Follow `Raised`: write unresolved product choices in the change's `decisions.md` table, `Capability | Raised | Landed`, leaving `Landed` for the author. Keep scenario ids out. The table may be empty only if the input settles every choice. If the artifact is absent, return questions to the caller; never put a `Raised` section in the suite.
6. **Validate** - Write the suite beside its resolved target using `The File Header` and `The Format`. Run the suite validator and fix findings within the permitted input. A failure requiring scenario inspection goes to the caller without breaking isolation.

   ```bash
   pnpm run tcs:validate
   ```

   Validate a change if this run added or upgraded journeys.

   ```bash
   pnpm run validate:changes <change-name>
   ```

## Handoff

- **Evidence** - Report suite paths and tree, applied convention scopes or conflicts, journeys and case counts, ids added, reworded or deprecated, reviewed cases moved and why, and any journeys changed. Name validation results and material gaps.
- **Deduplication** - Name assertions joined to existing cases, values represented as rows, and feature anchors left to domain cases with those case ids. Identify automated cases needing follow-up work.
- **Revision sweep** - Follow `Rules Revisions` for baseline checks, top-down order and separate commits. Report decisions about reviewed cases and cross-journey findings rather than narrating draft regeneration. The owner also defines the next stale-suite offer.
- **QA2** - Return the bundle description, suite and questions to [planning-dev](../planning-dev/SKILL.md). QA2 owns `Reconciliation` and scenario comparison; this generator neither writes that section nor reads it on later runs. Outside planning, route human suite review to tcs-review when implementation is available.
