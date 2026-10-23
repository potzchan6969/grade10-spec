---
name: spec-to-tcs
description: Internal test-case generator for planning-dev's isolated QA1 pass and explicit suite refreshes. Writes blind feature cases or derives domain, product and platform suites. Invoke as /spec-to-tcs [platform|product|domain|feature] <target>.
---

# Generate Test Cases

This skill owns the workflow. The creation contract lives in [Specs to Test Cases](../../../docs/governance/specs-to-test-cases.md), the sole writing rules live in [TCS Conventions](../../../docs/governance/tcs-conventions.md), and case shape lives in the planning template. Read all three before writing.

- **Scope** - Generate or update the named suite in the named tree. Planning-dev invokes this for QA1; an explicit suite refresh may invoke it directly. New cases remain `draft`; human classification belongs to [tcs-review](../tcs-review/SKILL.md), and execution belongs to [tcs-run-sheet](../tcs-run-sheet/SKILL.md).
- **Isolation** - A feature QA1 run reads only the caller's bundle. Never read scenario text, technical design, QA2 material, archive or unpermitted durable specs to create or shape cases. Scenario comparison is a later QA2 action.
- **Completion** - Deliver the suite, validation result, anchor coverage gaps, partition/grouping decisions, unresolved product questions and pending QA2 scenario-link work to the caller.

## Workflow

1. **Resolve the target** - Determine level, active versus durable tree and the owning suite from the governance document. Archive is never a target. For multiple levels, work top down and finish each level's draft before deriving the next.
2. **Read the inputs** - Use the isolated bundle for a feature run. For composed suites, read every permitted journey and PRD in scope. Read the existing suite for id continuity, settled decisions and duplicate detection, but not its reconciliation as a source of requirements.
3. **Prepare the suite** - Show existing status, revision, journeys, cases and requested operation. Preserve reviewed and deprecated cases. Regenerate only the drafts allowed by the rules revision and regeneration guard. Add missing journeys only from permitted product context, never from scenario text.
4. **Generate independently** - Write every case as a GUI walk by a product user, through a product screen or what the product sends them. Write no unit, API-only, SEO or injection-payload case; list a scenario no product user can see under `**Out of suite (<category>):**`. Group by observable outcome, starting state, route and checking. Use representative equivalence partitions, stated boundaries and only outcome-changing or risk-changing interactions. Put same-purpose values in test-data rows. Do not create Cartesian products. Trace each case formally to its anchor. New case markers may omit `covers`; QA2 adds scenario links later.
5. **Plan walks** - After the cases exist, inspect their independent routes for shared setup, data and page transitions that would save a human tester repeated work. Add a feature-scoped `## Walk` only when it groups two or more existing cases without changing their assertions; keep unrelated routes separate and write no walk when no meaningful reuse exists. A walk references cases by their full human-facing ids, carries only starting state, shared data and route context, and never becomes a new coverage claim. Report `Walk added` or `No walk — <reason>`.
6. **Write the suite** - Follow the governance contract, the conventions file and the template. New cases are `draft` and `manual`. Apply **Step 5: Classify the Case** for property-only edits and **A Case That Already Exists Is Not Written Twice** for verified-content changes; a classification edit alone does not reset review or automation status. Keep existing trace marker ids; preserve `rev` for purpose-preserving edits and bump it only when behaviour changes. Write the human-facing `<app>.<domain>-<capability>.US<n>-TC<m>` heading without a duplicate local reference. Print walks before case definitions. Do not write human review verdicts, `Reviewed`, reconciliation links or scenario-derived cases.
7. **Record questions** - Put unresolved product choices in the change's `decisions.md` `## Raised` table, each with its options and `recommended: <option>` in the Raised cell; raise every unsettled point - QA2 closes what the held test does not hold. Report missing anchors, duplicate candidates, out-of-scope paths and cases that need a domain or higher-level owner. Do not turn a question into a test case.
8. **Validate** - Run the suite validator. Fix only findings that are resolvable within the isolated input. Return scenario-dependent findings to QA2 without breaking blindness.

```bash
pnpm run tcs:validate
pnpm run validate:changes <change-name>
```

## Handoff

Report:

- suite paths, level and source tree
- case counts, ids added or retained, grouped rows and partition decisions
- walks added, or the reason no walk was useful
- anchor coverage gaps, domain-level reuse and duplicate candidates
- unresolved decisions and cases blocked on execution details
- validator results and cases awaiting QA2 post-hoc scenario linking

Return the bundle and draft suite to [planning-dev](../planning-dev/SKILL.md). QA2 owns reconciliation, scenario comparison and `covers` links. Outside planning, route implementation-available suites to [tcs-review](../tcs-review/SKILL.md).
