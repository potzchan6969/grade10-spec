# Sharpen the planning cross-check

**Author:** @seankcw - 2026-09-17

## Why

The two readings are the store's one mechanism for finding behaviour the
scenarios left out, and three of its joints carry less than they look like they
carry.

| Signal on the store today | Count |
| --- | --- |
| Scenarios anchored on a feature set group rather than a journey | 519 durable, 230 in flight |
| Of those, whose prose after the dash restates the scenario heading | 492 durable, 222 in flight |
| Journeys files carrying a hand-written `**Also walked by:**` note | 1, read by nothing |
| Suites carrying `## Raised` | 11, five of them already durable |
| In-flight changes whose `## Raised` a check reads | 0 |

A group anchor names a part of the map and nobody who meets the rule, so a rule
somebody walks loses its walk the moment it takes one — and the only way to say
the walk belongs to another capability was a note in a journeys file that names
no scenario, joins on nothing and fails nowhere when it goes stale.

The blind pass's raised questions close the suite, which is a file nobody opens
until QA reviews it — and a review is its own pull request at its own pace,
sometimes after the change has shipped. Nothing gives a raised question a
deadline.

And both readings see `ui-design.md`, so the empty, error and edge states the
designer drew always reach the blind suite. Nothing walks that list on the
requirements side, so those states arrive at every reconciliation as findings
against scenarios nobody had asked about them — the most predictable finding
the cross-check produces, and the one that spends its credibility.

Success is a store where a rule names the walk it sits on wherever that walk
lives, a raised question cannot reach `main` unlanded, and a designed state
reaches the requirements by the same route the suite reached it by.

## What Changes

- **`**Serves:**` names another capability's journey.**
  `grade10-admin/auction/post-sale#post-sale-US-01` resolves against that
  capability's `user-journeys.md`, durable or in the same change, and
  `pnpm check:manual` names a capability the store does not hold and a journey
  it issues nowhere. `**Also walked by:**` stops being a line a journeys file
  may carry.
- **A group anchor is for a rule with no actor** — a derivation, an
  idempotency, a guard the system raises against its own callers — and its
  prose after the dash names the walk. `check:manual` refuses prose that only
  repeats the group name. The 492 lines that restate the scenario heading
  instead are named as a follow-on, not swept here: it is a wording change on
  every group-anchored scenario in the store.
- **The blind pass's raised questions move to `decisions.md`**, under a
  `## Raised` table carrying the capability that asked, and every row lands
  before the change merges — a `Decisions` row in that same file, or a ❓ on
  the capability's PRD. `check:manual` refuses a row that names neither and
  warns on a table that asks nothing, run after run. `## Settled` and
  `## Reconciliation` stay with the suite, and an escalated or deferred row is
  written into one of them as well, because `decisions.md` archives with the
  change and is folded nowhere.
- **The requirements' second pass accounts for every `ui-design.md` state.**
  The design's `## States` is one state per bullet, and pass two closes each
  with the scenario it became or an `**Out of suite:**` naming where the state
  is stated instead. The isolated input strips those dispositions, the way it
  strips `## Reconciliation`.
- **`grade10-site/auction/order-status` is the worked example.** Its note comes
  off, seven of its rules take the post-sale and winner-order journeys they
  actually sit on, and its remaining group anchors say how the rule is reached.

Each new rule is gated on the change carrying a `decisions.md`, the marker
`decided` already uses, so a change planned before these rules existed is left
alone rather than filling a register nobody can act on.

## Non-Goals

- Sweeping the 492 durable and 222 in-flight `**Serves:**` lines whose prose
  restates the scenario heading. The rule says what a line owes; the sweep is
  its own pull request per capability.
- Re-anchoring any capability but `order-status`. A rule's walk is a product
  judgement and belongs to the change that touches the capability.
- Moving the five durable suites' `## Raised` sections. They were written
  before `decisions.md` existed and have nowhere to move to.
- A `**Trace:**` that names another capability's journey. A feature case is one
  walk in one capability; a walk that crosses capabilities is a `domain-tcs.md`
  case and already has a home.

## Capabilities

No spec-level behaviour changes, so this change declares no deltas and sets
`skip_specs: true`. The `order-status` edits move anchors and anchor prose, not
a requirement, a scenario body or an id.

## Impact

`openspec/schemas/grade10-planning/schema.yaml` and its `decisions`,
`feature-tcs`, `ui-design` and `spec` templates, `openspec/config.yaml`,
`docs/governance/specs-to-test-cases.md`, five skills (`planning-pm`,
`planning-design`, `planning-qa`, `spec-to-tcs`, `tcs-review`),
`tools/manual/check/` (a new `planned.mjs`, plus `context.mjs`, `qa.mjs`,
`deltas.mjs`, `check-manual.mjs`), `tools/manual/src/store/read-specs.mts` and
`tools/manual/src/api/types.ts`,
`scripts/openspec/validate-test-cases.mjs`, and
`openspec/specs/grade10-site/auction/order-status/`.

Four rule keys are added: `restates` and `dressed` fail, `raised` fails,
`asking` warns. None of them finds anything on the store today.

## Follow-on changes

- The 492 durable and 222 in-flight `**Serves:**` lines whose prose restates
  the scenario heading are rewritten to name the walk, one capability per pull
  request, and `restates` then reads the heading as well as the group name.
- The capabilities whose group-anchored rules have actors take journeys, here
  or elsewhere — `post-sale`, `winner-order` and `account-record` are the
  three with the most. ❓ Whether a rule that no journey reaches at all is
  evidence of a missing journey is the PM's call.
- `dressed` reads a `ui-design.md` on a change with no `decisions.md` once the
  three in flight today are closed.
- The archive fold stops carrying a `## Raised` across, and the five durable
  suites that hold one lose it at their capability's next change.

## References

- [PRDs and OpenSpec](../../../docs/governance/prd-and-openspec.md)
- [Specs to test cases](../../../docs/governance/specs-to-test-cases.md)
