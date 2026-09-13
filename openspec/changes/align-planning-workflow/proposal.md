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
- **The PRD is the essence, and the check says when it is not.** Every hand
  writes on the PRD first, and nothing said what a hand keeps to its own
  artifact, so pages took every scenario as a 🚧 line, every state as a
  bullet, every mechanism as an engineer paragraph. The house style gains
  the test — a line the reader would act differently without — one 🚧 line
  per outcome however many scenarios prove it, a closed set stated whole only
  where the reader meets it, and a `Cut` pass; `prd-and-openspec.md` tables
  what each hand keeps out; the four `planning-*` skills, `prd-authoring`,
  `writing-style` and `openspec-apply-change` carry the threshold. A new
  `dense` warning in `check:manual` names a page past 120 lines of prose
  outside its examples and details, a section opening on more than six
  sentences, an engineer block holding a paragraph, and a 🚧 inside a flow
  step or mid-line. KYC's engineer design note moves to
  `docs/references/kyc-service-design.md` as the first cut.

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
`openspec/config.yaml`, `docs/governance/writing.md`,
`docs/prds/guides/writing-the-manual.md`, seven skills, `package.json`, two
workflows, `tools/manual/check/record.mjs`, `tools/manual/check/dense.mjs`,
`tools/manual/src/store/read-changes.mts`, one in-flight change's `tasks.md`
headings, and the KYC page's engineer block.

The `dense` rule warns on 43 findings across 29 product pages today, every
one a page a reader would name as heavy; the Membership pages raise none.

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
- The manual renders a capability page's own suite beneath it, the way it
  already renders the spec's in-flight changes, so a page never has to reach
  for `::cases` and the `suite` warning retires. ❓ Whether the suite shows
  on the page or on the capability's spec view is the PM's call.
- The `dense` section-lead limit tightens from six sentences toward the
  style's two once the 9 sections over six today are cut, and the prose
  ceiling reads platform pages too once `auction-service` and
  `vault-custody` are reshaped.
- The 29 pages `dense` names today are cut, one page per pull request,
  starting with the ten over the prose ceiling.

## References

- [PRDs and OpenSpec](../../../docs/governance/prd-and-openspec.md)
- [Task ownership](../../../docs/governance/task-ownership.md)
