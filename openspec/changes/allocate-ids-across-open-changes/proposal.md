# Issue each id once across open changes

**Author:** @ecchochan - 2026-10-07

Product context: [Agent Rounds · Ids](../../../docs/prds/products/shared/planning/agent-rounds.md#ids), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: the batch accept-review of 17 store changes on 2026-10-06 and 2026-10-07. Depends on `run-a-round-on-every-artifact`, which opens `shared/planning/agent-rounds`.

## Why

A journey, scenario or case id is issued as "the next unused", read from the
branch that issues it. Two open changes on one capability, worked on parallel
branches, both read the same last id and issued the same eight scenario ids on
the loyalty programme. Nothing refused it until the second change's acceptance,
after both suites and plans cited the ids. The trace CLI fails the other way:
a scenario copied into a second change took a fresh trace id, so one membership
scenario carries two. The same batch met 11 acceptance-tool bugs, each a form
the governance defines that no test folds; the first was the spec template's
missing title, which 46 of the 106 open deltas share.

Success is an id refused at the landing of the branch that took it second,
never at an acceptance. The number to move: acceptances refused for an id
another change issued, from 8 ids in one batch to none.

## What Changes

- **The next id is read across open changes** - a command issues the next
  journey, scenario or case number from the durable specs and every open and
  archived change on the capability; nobody counts by hand.
- **The second branch to land moves its own ids** - the landing's `issued`
  check names each id `main` already holds and the command that moves the
  branch's own ids above them, rewriting their citations inside the change.
- **One record, one trace id** - `trace init` reuses the id the same heading
  already holds in its scope, in the durable spec or an open change.
- **A guard test folds the templates** - CI scaffolds a change from
  `openspec/schemas/grade10-planning/templates`, fills each placeholder, and
  folds it through acceptance, so a form the templates write that the fold
  refuses fails `pnpm run test:openspec`. Where the two disagree the fold
  changes: it accepts an untitled delta first.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/planning/agent-rounds` - ADDED requirements: the next id read
  across the durable specs and every open and archived change, the landing
  that refuses and names the command for an id `main` already holds, one
  trace id per record, and a change written from the templates that folds.

## Impact

- **Id command** - `scripts/openspec/spec-id.mjs`, or a sibling the tech
  design names, issues the next `US-<n>`, `SC-<n>` and `TC<m>` per capability
  and suite level, and moves a change's unlanded ids with their citations.
- **Trace CLI** - `scripts/test-traceability/trace.mjs`: `init` reuses the id
  a matching heading holds in its scope; `init batch` keeps `mirrorKey`.
- **`issued` check** - `tools/manual/check/deltas.mjs` names the command in
  its refusal and holds every suite level's case numbers.
- **Fold** - `scripts/openspec/lib/acceptance.mjs` accepts every form the
  templates write, the untitled delta first.
- **Guard test** - a test under `scripts/openspec/` scaffolds a change from
  `openspec/schemas/grade10-planning/templates` into the
  `fixtures/accept-sandbox.mjs` sandbox and runs it through `acceptanceGate`;
  it runs in CI under `pnpm run test:openspec`.
- **Rules** - `docs/governance/specs-to-test-cases.md` Naming,
  `docs/governance/test-traceability.md`, the schema's `specs` and
  `test-cases` instructions, `openspec/config.yaml`'s scenario rule and the
  `tcs-review` skill name the command in place of "the next unused".
- **Exports and consumers** - no component export; no consuming application.
  The application repository's `pnpm plan` reads the store and is unchanged.

## Follow-on changes

- Raised rows sorted before they reach the author: a question that moves
  scope or cannot be undone holds acceptance, and the rest take the written
  recommendation.
- A look held on the page as a ❓ line moved to the change's `ui-design.md`,
  where it waits on the designer without holding the feature.

## References

- [Agent Rounds · Ids](../../../docs/prds/products/shared/planning/agent-rounds.md#ids)
- [Specs to Test Cases · Naming](../../../docs/governance/specs-to-test-cases.md#naming)
- [Test Traceability](../../../docs/governance/test-traceability.md)
