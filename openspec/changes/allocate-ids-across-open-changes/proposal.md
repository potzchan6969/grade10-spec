# Issue each id once across open changes

**Author:** @ecchochan - 2026-10-07

Product context: [Agent Rounds · Ids](../../../docs/prds/products/shared/planning/agent-rounds.md#ids), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: the batch accept-review of 17 store changes on 2026-10-06 and 2026-10-07. Depends on `run-a-round-on-every-artifact`, which opens `shared/planning/agent-rounds`.

## Why

A journey, scenario or case id is issued as "the next unused", counted by
hand. The `issued` check refuses at the landing a journey or scenario id that
`main` already holds, but nothing issues the next id and nothing moves a
branch's ids once the check refuses them: the batch counted and moved eight
scenario ids by hand on the loyalty programme. The check does not read case
numbers, and acceptance reads the branch's own tree, so two branches can each
be accepted with one id. The trace CLI gives a scenario copied into a second
change a fresh trace id, so one membership scenario carries two.

The batch's collision reached acceptance through a hole in the check, which
read only ADDED requirements; that is a bug, fixed apart from this change.

Success is an id another change holds refused at a landing or an acceptance,
with the command that moves it. The number to move: ids another change
issued that an acceptance refused, from 8 in one batch to none.

## What Changes

- **The next id is issued by a command** - it reads the branch's tree and the
  fetched `main`, prints the commit it read, and issues the next journey,
  scenario or case number, or the next letter beside a named id; nobody
  counts by hand.
- **The refusal names the command that moves the ids** - the `issued` check
  names each id another change or `main` already holds and the command that
  moves the branch's own ids above them, rewriting every id built from them
  and every citation inside the change.
- **The check reads case numbers** - at every suite level, in the compact and
  the canonical spelling.
- **Acceptance reads `main`** - `accept:preflight` and `spec:accept` refuse an
  id the fetched `main` holds before the fingerprint is written.
- **One record, one trace id** - `trace init` reuses the trace id the target's
  readable id already holds in its scope, in the durable spec or an open
  change, never matching on the heading's text.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/planning/agent-rounds` - ADDED requirements: the next id issued by
  a command from the branch and the fetched `main`, the refusal that names
  the command that moves a branch's ids, case numbers read at every suite
  level, acceptance read against `main`, and one trace id per record.

## Impact

- **Id command** - `scripts/openspec/spec-issue.mjs`, run as
  `pnpm run spec:issue`, issues the next id in its scope: `US-<n>` and
  `SC-<n>` within the capability's prefix, `TC<m>` within its journey in its
  suite, and a suite's `e2e` journeys within that suite's prefix; or the next
  unused letter beside a named id. `spec:issue move <change>` moves the
  change's ids that `main` holds, lettered ones included. Moving a journey
  moves every case id, suite heading and `**Trace:**` line built from it, in
  the canonical and the compact spelling, at every suite level in the change.
- **Issued ids** - one `issuedIds(root)` exported from `tools/manual/src/store`,
  beside `reused-ids.mts`, read by the `issued` check, the `spec:id` resolver
  and `spec:issue`, so all three read one set the same way.
- **`issued` check** - `tools/manual/check/deltas.mjs` names `spec:issue move`
  in its refusal and holds case numbers at every suite level. A scenario's or
  a case's issued identity is its readable id, a case's with `<v>` stripped
  (`<prefix>-US<n>-TC<m>`), paired with its trace id, parsed as
  `reused-ids.mts` parses it: the same pair is a carry; the same readable id
  under another trace id, in the durable spec or another change, is refused.
- **Acceptance** - `scripts/openspec/accept-preflight.mjs` and
  `scripts/openspec/spec-accept.mjs` read the fetched `main` through
  `storeMain` and run the issued set against it before writing the
  fingerprint.
- **Trace CLI** - `scripts/test-traceability/trace.mjs`: `init` reuses the
  trace id the target's readable id holds in its scope (`…-SC-<n>`,
  `…-US<n>-TC<m>` with `<v>` stripped), never the heading's text; a readable id
  held elsewhere with no marker, or under more than one, is refused.
  `init batch` keeps `mirrorKey`.
- **Rules** - `docs/governance/specs-to-test-cases.md` Naming,
  `docs/governance/test-traceability.md`, the schema's `specs` and
  `test-cases` instructions, `openspec/config.yaml`'s scenario rule and the
  `tcs-review` skill name the command in place of "the next unused".
- **Bug fixes, not here** - the `issued` check refusing a scenario id reused
  under `MODIFIED Requirements` with another trace id, and the fold reading a
  delta with no title, with a test that folds a change scaffolded from
  `openspec/schemas/grade10-planning/templates`, land as `fix` commits on
  `fix/openspec-delta-sections`.
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
