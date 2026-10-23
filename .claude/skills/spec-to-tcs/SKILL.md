---
name: spec-to-tcs
description: Internal test-case generator for planning-dev's isolated QA1 pass and explicit suite refreshes. Writes blind feature cases or derives domain, product and platform suites. Invoke as /spec-to-tcs [platform|product|domain|feature] <target>.
---

# Generate Test Cases

This skill is the workflow. What a case is and covers is [Specs to Test Cases](../../../docs/governance/specs-to-test-cases.md); how it reads is [TCS Conventions](../../../docs/governance/tcs-conventions.md). Read both before writing. The file's shape is the template the rules document links to.

- **Scope** - Write or update the named suite in the named tree. Planning-dev invokes this for QA1; an explicit refresh may invoke it directly. New cases stay `draft`; review belongs to [tcs-review](../tcs-review/SKILL.md), execution to [tcs-run-sheet](../tcs-run-sheet/SKILL.md).
- **Isolation** - A feature QA1 run reads only the caller's bundle. Never read scenario text, technical design, QA2 material, archive or unpermitted durable specs to create or shape a case.
- **Store** - A Grade10 store target writes only to `docs/prds/products/grade10-site/store/tests/`, from the PRD pages and Storybook; never a `*-tcs.md` under `openspec/`.

## Workflow

1. **Resolve the target** - the level, the tree and the owning suite, from the rules document. Archive is never a target. For several levels, finish each level's drafts top down before the next.
2. **Read the inputs** - the isolated bundle on a feature run; every permitted journey and PRD page for a composed suite. Read the existing suite and the live cases for id continuity, settled questions and duplicates, never its reconciliation as a source.
3. **Prepare the suite** - show its status, revision, journeys, cases and the requested operation. Keep reviewed and deprecated cases. Regenerate only what the rules revision and the regeneration guard allow.
4. **Write each case as a GUI walk** - a product user acting in the product, checked on a screen, email, PDF or notification. Add an observation or an edge value to a live case on the same route before writing a new case. List a scenario no product user can reach under `**Out of suite (<category>):**`. Wording is platform- and environment-neutral; tag a platform requirement `[Mobile only]` or `[Web only]`; end a result with `UI matching <story-id>` where a story draws the state. Group by outcome, starting state, route and checking; use representative partitions and stated boundaries; no Cartesian products. Trace each case to its anchor; a new marker carries `id` and `rev` only.
5. **Draft walks where useful** - per the conventions; report `Walk added` or `No walk - <reason>`.
6. **Write the suite** - new cases `draft` and `manual`, the template's shape, the conventions' wording. Keep marker ids; keep `rev` unless behaviour changed. Print walks before cases. Write no review verdict, `Reviewed` line, reconciliation link or scenario-derived case.
7. **Record questions** - unsettled product choices go to the change's `decisions.md` `## Raised`, each with its options and `recommended: <option>`. Report missing anchors, duplicates and cases needing a higher-level owner. A question is never turned into a case.
8. **Validate** - fix only what the isolated input can settle; return scenario-dependent findings to QA2.

```bash
pnpm run tcs:validate
pnpm run validate:changes <change-name>
```

## Handoff

Report:

- suite paths, level and tree
- cases added, kept and grouped, with partition decisions
- observations added to live cases instead of new cases
- walks drafted, or why none
- anchor gaps, out-of-suite lists, domain reuse and duplicate candidates
- unresolved decisions and cases blocked on execution detail
- validator results and cases awaiting QA2 links

Return the bundle and draft suite to [planning-dev](../planning-dev/SKILL.md). QA2 owns reconciliation and `covers` links. Outside planning, send deployed suites to [tcs-review](../tcs-review/SKILL.md).
