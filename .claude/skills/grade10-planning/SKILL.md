---
name: grade10-planning
description: Draft an OpenSpec change in this store - proposal, specs, user journeys, test cases, ui design, tech design, tasks. Use whenever a change is being written, whether the work ends at the requirements or carries a delivery plan.
---

# Draft a grade10-planning change

`grade10-planning` is the only lane in this store. One change passes through
every hand that has something to say about it, and each artifact names who
writes it:

| # | Artifact | Written by | Required |
| --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | Always |
| 2 | `specs/<capability>/spec.md` | Product manager | Always |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | Unless nobody walks the capability |
| 4 | `specs/<capability>/test-cases.md` | QA | Optional |
| 5 | `ui-design.md` | Designer | Optional |
| 6 | `tech-design.md` | Engineer | Optional |
| 7 | `tasks.md` | Engineer | Before the change can be applied |

**Stop where your work stops.** A PM who finishes at the journeys has finished;
they do not invent a delivery plan for whoever picks the change up. An engineer
picking it up adds 5 through 7 to the same change and never opens a second one:
the implementing repository has no planning shape of its own — its `openspec/`
resolves to this store — so delivery is planned here.

A change with no `tasks.md` reads as still being planned on both boards. That
is the handoff signal, and it is the only one: say the change needs picking up
rather than assuming someone will find it.

## Steps

1. **Read from an up-to-date main.** `git fetch origin` first; when
   `git log --oneline HEAD..origin/main` is not empty, update before reading. A
   MODIFIED block copied from a stale spec silently reverts whatever landed in
   between, and an overlap scan against a stale `openspec/changes/` finds
   nothing. Then read: the capability under
   `openspec/specs/<product>/<domain>/<capability>/`, every active change in
   `openspec/changes/` for overlap, and the capability's page under `docs/prds/`
   when one exists. Find facts yourself — bring only decisions to the author.
2. **Interview the author.** Run the `grilling` skill's round-based frontier
   interview before drafting. Do not write the proposal until the frontier is
   empty and the author confirms shared understanding. The interview scales
   with the open questions, not the change's size: if reading left nothing
   open, say so and proceed.

   A question settles three ways, not two: answered, accepted as recommended,
   or **deferred** — the author saying they are not the right person for it. A
   deferred question goes under the proposal's open questions with a note on
   who should settle it, and does not hold the draft. Sizing, export names, and
   what code a change touches are never the author's to answer: find them
   yourself, or leave them to the engineer who plans delivery.
3. **Create the change through the CLI.**

   ```bash
   openspec new change <change-name>
   ```

   Kebab-case. A directory made by hand records no schema in `.openspec.yaml`;
   it then takes the default in `openspec/config.yaml`, which is this lane, so
   it happens to work — but nothing else the CLI writes is there either.
4. **Read the enriched instructions for each artifact as you reach it.**

   ```bash
   openspec instructions proposal --change <change-name>
   openspec instructions specs --change <change-name>
   openspec instructions user-journeys --change <change-name>
   ```

   These carry this store's own rules — the ones in `openspec/config.yaml` — on
   top of the schema's. Read them rather than working from memory.
5. **Write the artifacts your work covers**, in the order above. Each section
   below says what its file holds.
6. **Validate.**

   ```bash
   openspec validate <change-name> --strict
   openspec status --change <change-name>
   ```

## proposal.md

Author line first (`**Author:** @handle - YYYY-MM-DD`, ask for the handle).
Open with the collector problem and the evidence, not the solution. Carry a
metric that would move if this works, and always list Non-Goals. The
**Capabilities** section is the contract with the specs: every capability named
there needs a delta file, and nothing else gets one.

## The delta specs

One per capability the proposal named, at `specs/<capability-path>/spec.md`,
using the exact existing path for a modified capability.

- `### Requirement: <name>` with SHALL or MUST — never should or may.
- `#### Scenario: <capability>-SC-<n> - <name>` in WHEN/THEN form. **Exactly
  four hashes.** Three hashes or a bullet fails silently: the scenario is
  simply not seen.
- Every requirement carries at least one scenario, and every scenario is
  checkable by a test or a manual pass.
- A **new** capability's delta opens with `## Purpose` — one or two sentences,
  50+ characters. Archive copies it into the main spec. A delta for an
  **existing** capability must not have one; it is ignored, and the
  capability's Purpose is edited in `openspec/specs/` directly.
- **No `## User journeys` section.** The stories are their own file beside this
  one, and `pnpm check:manual` refuses a delta that holds the heading.
- Never name a class, function, hook, table, or library. That is
  `tech-design.md`'s job. Public component exports are the one exception — the
  export name is the cross-repo contract, so name it, and keep the set in one
  requirement. Read `packages/ui` and the capability's existing export
  requirement and propose the set yourself; never ask the author for an export
  name. Say in the proposal which exports do not exist yet, and the engineer
  confirms the set when delivery is planned.
- `## MODIFIED Requirements` needs the **entire** requirement block copied from
  the main spec and then edited. Partial content loses detail at archive. When
  you are adding a concern rather than changing existing behavior, use `ADDED`.
- Money is an integer count of minor units plus an ISO 4217 code, never a
  float. Convert it yourself — the author says HKD 10, the spec says 1000 HKD
  minor units.

## user-journeys.md

One beside each `spec.md`, holding a single `## User journeys` section.

- At most five journeys across every capability the change touches. A journey
  is one actor pursuing one goal start to finish; a name that needs an `and` is
  two journeys, and a change wanting a sixth is two changes.
- Title actor first, then the action, in the third person — `Collector enters
  the catalogue through a collection`. Not a bare verb phrase, not the first
  person.
- `### <capability>-US-<n>: <title>`, then the story on three labeled lines
  (`**As a** …`, `**I want** …`, `**so that** …`), then an `**Accepted by:**`
  list where each line is `` `<capability>-SC-<n>` — Scenario title ``.
- Every accepted-by id names a scenario the `spec.md` beside it issues.
  `pnpm check:manual` fails on one that resolves to nothing.
- **A capability nobody reaches on its own writes no file at all** — a
  cross-cutting policy, a package contract, a backend convention. Never invent
  an actor to fill one.

## test-cases.md

QA's, one beside each spec whose journeys are worth walking. Do not write it by
hand: run `/spec-to-tcs <change-name>` once the specs validate, commit the
suites as their own `test(<domain>): derive test cases for <capability>`
commit, and leave every case `draft`. QA approves them later in their own pull
request with `/tcs-review`, so this asks nothing of whoever reviews the specs.

`docs/governance/specs-to-test-cases.md` governs the shape; `pnpm run
tcs:validate` checks it.

## ui-design.md

Only when the change adds or alters something a user sees. A change with no
user-facing surface skips the file entirely — nothing depends on it.

- **Screens**: link the Figma frame. The frame is the layout's source of truth,
  so never describe a screen in prose.
- **Components**: name design-system and `packages/ui` exports exactly — the
  export name is the cross-repo contract. A component, variant, or token that
  does not exist yet is work in **grade10-spec**; flag it so `tasks.md` carries
  it.
- **States**: loading, empty, error and edge states, each tied to the spec
  scenario that defines it. A state with no scenario behind it means the spec
  is missing one — fix the spec, not this file.

## tech-design.md

Write one when the change is cross-cutting, introduces an architectural pattern
or an external dependency, changes the data model, carries security,
performance or migration complexity, or holds an ambiguity better settled
before coding.

- **Context**: only the current state and constraints needed to explain the
  approach. Point at the proposal for motivation; never restate it.
- **Decisions**: how the spec lands, not a restatement of it. Open by naming
  what the spec already governs, then record the implementation choice (which
  row, which service, persist vs recompute, reuse vs add) and the alternatives
  rejected. A decision that could be a spec scenario belongs in the spec. Keep
  the implementation alternative an engineer might still try even when the spec
  forbids the resulting behavior.
- **Data model**: database schema is a must. Each added or changed column with
  Postgres type, nullability, and default, matching the existing schema. Reuse
  a table or stamp that already holds the fact. Spec fields read from another
  row at query time are not stored.
- **Contracts**: only when the wire changes in a meaningful way. Do not list
  unchanged endpoints.
- **Risks / Trade-offs**, and a **Migration Plan** where one applies. Do not
  mitigate a risk with "the spec says so".
- **Open Questions** only for unknowns that can be answered later *without*
  changing the specs, the approach, or the task breakdown. Anything that would
  change one of those is not an open question — resolve it now, asking rather
  than guessing.

Screens and Figma sources belong in `ui-design.md`.

## tasks.md

This is the artifact the implementing repository reads, checks off, and claims
groups in, and the one that moves the change off the planning board. Follow
`docs/governance/task-ownership.md` for the format exactly — tooling on both
sides parses it.

- **Group by layer**, in order: shared types and interfaces, data migration,
  backend and API, frontend. Omit a layer the change does not touch rather than
  writing an empty group. When a change spans grade10-spec and an application
  repo, the grade10-spec groups land first — the submodule bump is the
  boundary. A group title names its repository by clone name —
  `(grade10-spec)`, `(grade10)` — never "this repo" or "here": tasks.md is
  written in this store and read from the application repo, so a deictic
  reference flips meaning between the two.
- **Once the shared-interface group lands, the rest are parallel.** Write each
  so it can be claimed on its own and verified on its own — frontend against
  the contracts and fixtures, never a running backend. When a group genuinely
  needs another's landed code, say so in a prose line under its heading.
- **Phrase an implementation task as the spec scenario it makes pass**, naming
  the scenario, so the scenario's test is the evidence behind the checkmark.
- **Never split "write the tests" into its own task or group.** The engineer
  works test-first inside each task; a separate testing task invites the
  opposite.
- **End every group with its verification step** — the checks that group runs.
- **When a delta carries `## Feature set`, or a capability carries a
  `user-journeys.md`, the store group carries a task to copy them across at
  archive time.** The fold keeps `## Requirements` and nothing else, so the
  feature set and every `-US-` id die with the change unless someone carries
  them — and the someone is decided here, at planning time, not discovered by
  whoever archives. `pnpm run archive:preflight` refuses the archive while they
  are uncarried.
- Keep each task to something one engineer finishes in a session.
- **Write groups without owner tags.** Engineers claim them at pickup with
  `pnpm plan claim`. Never renumber a group or task that is claimed or already
  has checkmarks.

Before writing tasks, read `tech-design.md`'s Open Questions. If any of them
would change what gets built, resolve it with the author first rather than
baking an unstated assumption into the list.

## Picking up a change somebody else specified

Work on the branch that carries the change, not on `main`. If it is already
merged, start from an up-to-date `main`; if it is still on a branch, work
there.

Add `promoted_by: @your-handle` to the change's `.openspec.yaml` beside
`schema:`. The board names the promoter from that key — without it the card
still reads "proposed by" alone, and the author never learns their change was
picked up.

The proposal, the deltas and the journeys carry over untouched. Do not send the
proposal back to its author for a task list — their part is finished.

## Where a statement belongs

| Statement | Home |
| --- | --- |
| Anything testable | The delta spec, and nowhere else |
| Who walks it, and what accepts their story | `user-journeys.md` beside that spec |
| Why this problem, for whom, what was ruled out, what will be measured | The capability page's `Product decisions` block (`prd-authoring` skill) |
| How it will be built | `tech-design.md` |

A testable statement left on a page or in a proposal is the failure this store
exists to prevent: `docs/governance/prd-and-openspec.md` draws the boundary.

## Related

- `openspec-propose` — routes here, and covers what to check before drafting.
- `prd-authoring` — for the product judgment a requirement will not preserve.
- `grilling` — the interview that precedes the proposal.
- `spec-to-tcs`, `tcs-review` — deriving and approving the suites.
- `openspec-apply-change`, `openspec-archive-change` — the far end of the
  lifecycle.
