**Author:** @ecchochan - 2026-10-07

Product context: [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: the batch accept-review of 17 store changes on 2026-10-06 and 2026-10-07, about 500 agents over three rounds. Depends on `run-a-round-on-every-artifact`, which writes the held test this change applies to raised questions, and `stage-changes-and-notify-hands`, whose open Raised row holds acceptance.

## Why

Acceptance waits on questions that do not need a person. The blind reading
raises every point its input did not settle, and it should: an empty Raised
table is how a failed reading shows. But every raised row then holds
acceptance until a human answers it, and nothing sorts the rows that matter
from the rows a recommendation settles. In the batch, 32 raised rows waited
on a human and the written recommendation settled 30 of them; one change
alone carried about 30. AGENTS.md asks only what materially affects scope or
an irreversible product choice, and the round's held test says the same for
its own questions, but the blind reading's rows never pass through either.

A designer's ask holds a feature the same way. 20 asks about a look - a hover
cell, a Figma frame to retire, a screen-reader label, a story - sat as ❓
lines on feature pages and held whole feature changes, though planning-design
already keeps a look off the page. The batch moved them into five changes of
their own that wait on the designer, and each feature shipped the recommended
interim.

Success is an accepting human who answers only what moves scope or cannot be
undone, and a designer who finds every ask under their name on Pending. The
number to move: raised rows waiting on a human per accepted change, from 32
across 17 changes in the batch to the held ones alone, and feature changes
held by a look, from 20 asks to none.

## What Changes

- **BREAKING: Raised rows close** - a raised question carries options and a
  recommendation; the planner closes a row that the page, the build or a
  sensible default settles, as a decision row decided by the round, and any
  hand reopens it with one reply. Only a row the held test holds stays open
  and holds acceptance. This reverses "one human resolves every raised
  question", running in `planning-dev`, `accept-review` and
  [Specs to Test Cases · Raised](../../../docs/governance/specs-to-test-cases.md#raised).
- **The blind reading still raises everything** - its method, its isolated
  input and the failure signal of an empty Raised table do not change.
- **A closed row is settled for the next reading** - its answer goes to the
  suite's `## Settled`, so the next blind pass does not raise it again.
- **A look waits on the designer** - a designer's ask about a look ships as
  the recommended interim in the feature's `ui-design.md`. The ask goes to a
  change of its own for that surface, waiting through `awaiting: ui-design`
  with the designer named, so Pending lists it under them. The feature does
  not depend on that change.
- **One test** - the held test in `workflow-round` is the one test for every
  question, raised or asked; AGENTS.md's line links it rather than stating a
  second one.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/planning/agent-rounds` - ADDED requirements: a raised question
  carries a recommendation, the planner closes a settled one, only a held one
  holds acceptance, and a look waits on the designer in its own change.
  `run-a-round-on-every-artifact` creates the capability; under
  `stage-changes-and-notify-hands` an open Raised row still holds acceptance,
  and this change decides which rows stay open.

## Impact

- `docs/governance/specs-to-test-cases.md` - Raised: each row carries options
  and a recommendation, the planner closes a settled row, and only a held row
  stays open.
- `docs/governance/prd-and-openspec.md` - Waiting for an input: a designer's
  ask about a look waits in its own change through `awaiting: ui-design`,
  naming the designer.
- `docs/governance/round-summary.md` - Held Row and Interview: the closed rows
  are listed as decided by the round with their source.
- `AGENTS.md` - the line on what to ask links the held test.
- `.claude/skills/` - `workflow-round`, `planning-dev`, `spec-to-tcs`,
  `planning-design` and `accept-review` carry the rule once each; the
  `decisions.md` template's Raised note says the same.
- `tools/manual/check/planned.mjs` - the `raised` rule refuses a row with no
  recommendation.
- `scripts/openspec/lib/acceptance.mjs` - the Raised and ❓ refusals stay, and
  name each open row with its role and recommendation.

## References

- [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round)
