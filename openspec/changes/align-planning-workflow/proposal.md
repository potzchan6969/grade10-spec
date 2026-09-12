# Align the planning workflow's rules, skills and checks

**Author:** @brianchacha6969 - 2026-09-12

## Why

The lifecycle is one shape and it is right: a capability's page is marked
first, a change carries the deltas those marks derive from, and the fold at
archive rewrites the durable spec. It is written in fifteen places, and the
places disagree. A PM, a designer, a QA reviewer and an engineer each read a
different answer to who writes `feature-tcs.md`, whether `tech-design.md` is
optional, whether `tasks.md` carries the archive hand-copy, and which skill
opens a change. The checks that would catch the drift are new, and one of them
has failed every push to `main` today.

| Signal on the store today | Count |
| --- | --- |
| Files stating who writes which artifact | 15 |
| Files disagreeing with the check or the schema on one of those rows | 6 |
| In-flight changes whose `tasks.md` heading names a product as a repository | 1, and it fails `Check manual` on `main` |
| Skills naming `page_waived` | 0 |
| Documents saying how to obtain the `openspec` CLI | 0 |

## What Changes

- **Main is green again.** The one change whose group headings name a product
  is retagged `(grade10-spec)`, the `design` rule says when a tag names a
  product, and `task-ownership.md` names the mis-tag.
- **One answer per rule.** The PM derives `feature-tcs.md` and QA reviews it.
  `tech-design.md` is owed by every change with work outside this store.
  `tasks.md` carries no archive hand-copy, because `archive:preflight` refuses
  the archive without it. The page is marked before the change is opened, and a
  capability with no page gets one first or records `page_waived`. The
  `openspec/` prose names the `planning-*` skills and the `docs/prds/` path.
- **The change's record in one table.** Every `.openspec.yaml` key, who writes
  it, when, and which check reads it, in `prd-and-openspec.md`.
- **The CLI runs from the repository.** `pnpm openspec …` pins
  `@fission-ai/openspec@1.8.0`; a test holds `package.json` and both workflows
  to one version.
- **An owner tag reads as the format defines it.** The manual accepts
  `(owner: alice.b)` and `(owner: unassigned)` the way `task-ownership.md` and
  `plan-preflight` already do, so a bare handle no longer reads as a
  repository.

## Non-Goals

- No product behaviour changes, and no delta against any durable spec.
- No edits to the application repository's skills or `pnpm plan`; they read the
  same `openspec/config.yaml` and `tasks.md` and need no change.
- No ticking of `close-planning-guardrails`. Its store-side tasks are done in
  the tree; the engineer who did them ticks them with `pnpm plan done`.
- No new CI gate on durable-spec edits, no `tcs:validate --strict`, and no
  waiver expiry. Each is a follow-on below.

## Capabilities

No spec-level behaviour changes, so this change declares no deltas and sets
`skip_specs: true`.

## Impact

`AGENTS.md` and its aliases, `docs/governance/prd-and-openspec.md`,
`docs/governance/task-ownership.md`, `docs/governance/agent-workflow-example.md`,
`docs/prds/guides/working-a-change.md`, `openspec/README.md`,
`openspec/config.yaml`, four skills, `package.json`, two workflows,
`tools/manual/check/record.mjs`, `tools/manual/src/store/read-changes.mts`, and
one in-flight change's `tasks.md` headings.

## Follow-on changes

- Add `@fission-ai/openspec` as a devDependency once a lockfile change can be
  generated, and drop the global install from the two workflows.
- A check that refuses a durable `openspec/specs/**/spec.md` edit outside an
  archive fold. ❓ `planning-pm` tells the PM to edit a capability's
  `## Purpose` directly when the page arrives; the guard needs that exception
  decided first.
- `pnpm run tcs:validate --strict` in CI once the 353 standing warnings are
  cleared.
- An age on `page_waived` and `design_waived`, so a waiver written to predate a
  rule does not become the default.
- One `tasks.md` reader for the store's own tools; the application repository
  keeps its own by design.

## References

- [PRDs and OpenSpec](../../../docs/governance/prd-and-openspec.md)
- [Task ownership](../../../docs/governance/task-ownership.md)
