---
name: planning-pm
description: Write the product manager's half of an OpenSpec change - proposal.md, the spec deltas, and the user journeys beside them. Use when a PM or designer is specifying a change, and stop where the requirements stop.
---

# The product manager's artifacts

Three of the seven artifacts in `grade10-planning` are yours, and they are the
first three:

| Artifact | What it holds |
| --- | --- |
| `proposal.md` | Why this problem, for whom, what it will not do |
| `specs/<capability>/spec.md` | The requirement deltas, with id'd scenarios |
| `specs/<capability>/user-journeys.md` | Who walks them, and what accepts each story |

**Stop there.** QA derives `feature-tcs.md`, a designer writes `ui-design.md`,
and the engineer who picks the change up writes `tech-design.md` and
`tasks.md` — on this same change, never a second one. A change with no
`tasks.md` reads as still being planned on both boards; that is the handoff
signal, and it is the only one, so say the change needs picking up rather than
assuming someone will find it.

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

   Kebab-case. A directory made by hand records nothing in `.openspec.yaml`.
4. **Read the enriched instructions for each artifact as you reach it.**

   ```bash
   openspec instructions proposal --change <change-name>
   openspec instructions specs --change <change-name>
   openspec instructions user-journeys --change <change-name>
   ```

   These carry this store's own rules — the ones in `openspec/config.yaml` — on
   top of the schema's. Read them rather than working from memory.
5. **Write the three artifacts**, in that order.
6. **Validate, then hand to QA.**

   ```bash
   openspec validate <change-name> --strict
   openspec status --change <change-name>
   ```

   With the specs valid, run `/spec-to-tcs domain <domain>` for each domain a
   cross-feature path runs through, then `/spec-to-tcs feature <capability>`
   for each capability the change carries — in that order, because the domain
   file names the paths the feature suites are trimmed against. The suites
   belong in this same pull request, as their own commits. See
   `/planning-qa`.

## proposal.md

Author line first (`**Author:** @handle - YYYY-MM-DD`, ask for the handle).
Open with the collector problem and the evidence, not the solution. Carry a
metric that would move if this works, and always list Non-Goals. The
**Capabilities** section is the contract with the specs: every capability named
there needs a delta file, and nothing else gets one.

A change that alters no behavior at all — a pure refactor, tooling, docs — sets
`skip_specs: true` in its `.openspec.yaml` rather than inventing a requirement
to satisfy validation.

An optional last section, **Follow-on changes**, names what this change makes
possible next — one bullet each, no dates, no owners, no commitments. The
manual's `::next` block collects them onto the capability pages this change is
about, each bullet under the change that wrote it, so write them for a reader
of a capability page rather than for the board. Omit the section when there is
nothing to name; a proposal that names none has decided nothing.

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
- **A capability's id prefix is its path with slashes as hyphens** —
  `grade10-site/store/product-listing` issues
  `grade10-site-store-product-listing-SC-01`. The path form is what keeps two
  capabilities of the same name apart: `grade10-site/site/navigation` and
  `zzz-site/site/navigation` would otherwise both issue `navigation-*`.
- Ids are permanent. Number from 01 within a capability and never renumber one
  that exists — a task, a review, a journey's `Accepted by`, and a downstream
  test all point at it. A capability that is later renamed or moved goes on
  issuing what it always issued, so read the ids that exist before adding one;
  only a capability issuing its first derives the prefix from its path.

## user-journeys.md

One beside each `spec.md`, holding a single `## User journeys` section. This is
what QA derives the suites from, so it is finished when every story names an
actor the spec already knows and scenarios that already exist.

- At most five journeys across every capability the change touches. A journey
  is one actor pursuing one goal start to finish; a name that needs an `and` is
  two journeys, and a change wanting a sixth is two changes.
- Title actor first, then the action, in the third person — `Collector enters
  the catalogue through a collection`. Not a bare verb phrase, not the first
  person.
- `### <capability>-US-<n>: <title>`, then the story on three labeled lines
  (`**As a** …`, `**I want** …`, `**so that** …`), then an `**Accepted by:**`
  list where each line is `` `<capability>-SC-<n>` — Scenario title ``.
- Hold every story to the four criteria its author owns: Independent,
  Negotiable, Valuable, Testable. A story that fails one is split or reworded,
  never widened to fit. Estimable and Small are sizing judgements and belong to
  the engineer who plans delivery.
- Every accepted-by id names a scenario the `spec.md` beside it issues.
  `pnpm check:manual` fails on one that resolves to nothing.
- **A capability nobody reaches on its own says so in place of the stories**
  — a cross-cutting policy, a package contract, a backend convention. Its file
  keeps the `## User journeys` heading and holds one line and no story:
  `**Walked by:** nobody on their own - <who inherits it, and which
  capability's journeys reach it instead>`. Never invent an actor to fill one,
  and never leave the file out: `pnpm check:manual` fails a capability with
  neither stories nor the declaration, so the exemption is always a decision
  on record.
- **The role is a person, or an agent that acts on its own** — a crawler, a
  preview fetcher, a provider calling back. Never software this repository
  ships: a consuming application, a service, a caller, a package is the
  system's side of the story, and the journey belongs to whoever operates it.
- **Whoever builds the product is not walking it.** An engineer wiring a
  call, a developer seeding fixtures, a reviewer reading a contract — that is
  a test or a working step. A capability only they reach is unwalked and says
  so: an internal reference, a dev-build-only surface, a fixture panel. Its
  scenarios stand on their own.
- **A single scenario needs no journey.** The exemption above is
  capability-wide, but a walked capability still issues some no story reaches
  — a package's export list, a copy shape, a defaulting rule no surface shows.
  Leave those out of every `**Accepted by:**`, and tell QA to name them under
  `**Out of suite:**`. Widening a shopper's story to cover one, or inventing
  an application to import it, is how an actor gets invented inside a
  capability that has real ones.

## Where a statement belongs

| Statement | Home |
| --- | --- |
| Anything testable | The delta spec, and nowhere else |
| Who walks it, and what accepts their story | `user-journeys.md` beside that spec |
| Why this problem, for whom, what was ruled out, what will be measured | The capability page's `Product decisions` block (`prd-authoring` skill) |
| How it will be built | `tech-design.md` — not yours |

A testable statement left on a page or in a proposal is the failure this store
exists to prevent: `docs/governance/prd-and-openspec.md` draws the boundary.

## Related

- `openspec-propose` — what to settle before drafting, and who writes what.
- `planning-qa` — the suites derived from your journeys.
- `planning-design`, `planning-dev` — the artifacts that come after yours.
- `prd-authoring` — for the product judgment a requirement will not preserve.
- `grilling` — the interview that precedes the proposal.
