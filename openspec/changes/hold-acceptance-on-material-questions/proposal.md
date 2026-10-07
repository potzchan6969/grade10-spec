**Author:** @ecchochan - 2026-10-07

Product context: [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round) and [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: the batch accept-review of 17 store changes on 2026-10-06 and 2026-10-07, about 500 agents over three rounds. Depends on `run-a-round-on-every-artifact`, which writes the held test this change applies to raised questions, and `stage-changes-and-notify-hands`, whose open Raised row holds acceptance; both are unaccepted, so this change extends their deltas in place.

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

A question about a look holds a feature the same way. 20 of them - a hover
cell, a Figma frame to retire, a screen-reader label, a story - sat as ❓
lines on feature pages and held whole feature changes, though planning-design
already keeps a look off the page. The batch moved them into five changes of
their own that wait on the designer, and each feature shipped the recommended
interim.

Success is an accepting human who answers only what moves scope or cannot be
undone, and a designer who finds every ask under their name on Pending. The
number to move: raised rows waiting on a human per accepted change, from 32
across 17 changes in the batch to the held ones alone, and feature changes
held by a look, from 20 questions to none.

## What Changes

- **BREAKING: Raised rows close** - a raised question carries options and a
  recommendation. QA2, in planning-dev's reconciliation, closes each row the
  held test does not hold on its recommendation, as decided by the round,
  citing the page line where one settles it; any hand reopens it with one
  reply. Only a held row stays open and holds acceptance. A contradiction
  between the two readings is still asked whatever the default. This reverses "one
  human resolves every raised question", running in `planning-dev`,
  `accept-review`,
  [Specs to Test Cases · Raised](../../../docs/governance/specs-to-test-cases.md#raised)
  and [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages).
- **The blind reading still raises everything** - its method, its isolated
  input and the failure signal of an empty Raised table do not change.
- **A closed row is settled for the next reading** - its answer goes to the
  suite's `## Settled`, so the next blind pass does not raise it again.
- **A question about a look waits on the designer** - the feature ships an
  interim built from the store's existing blocks and tokens, written as the
  shipped state in its `ui-design.md`; a look that needs a new variant, token
  or block ships without that look. The question goes to one designer's
  change per capability, waiting through `awaiting: ui-design` with the
  designer named and `hands: design` set, so Pending lists it under them. The
  feature does not depend on that change.
- **One test** - the held test in `workflow-round` is the one test for every
  question, raised or asked; AGENTS.md's line links it rather than stating a
  second one.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/planning/agent-rounds` - ADDED requirement: a question about a look
  waits in one designer's change per capability. Extended in place within
  `run-a-round-on-every-artifact`, which creates the capability: the held-row
  requirement and `shared-planning-agent-rounds-US-04` take a question raised
  by a reading or met by the round, `shared-planning-agent-rounds-SC-07` sorts
  a reading's unsettled point by the held test, and the requirement "A draft
  waits for what only its hand can give" with
  `shared-planning-agent-rounds-SC-20` ships the interim and leaves the frame
  in the designer's change.
- `shared/planning/change-stages` - extended in place within
  `stage-changes-and-notify-hands`: its requirement "Acceptance records the
  resolved plan before implementation", its Held bullet, stage row 5 and
  `shared-planning-change-stages-SC-79` let an open Raised row hold acceptance
  and a row landed on a decided `Q<n>` hold nothing.

## Impact

- `openspec/changes/run-a-round-on-every-artifact` and
  `openspec/changes/stage-changes-and-notify-hands` - the deltas above,
  extended in place.
- `docs/governance/specs-to-test-cases.md` - Raised: each row carries options
  and `recommended: <option>`, QA2 closes a row the held test does not hold,
  and only a held row stays open. Reconciliation: a case carrying behaviour
  nobody ever decided is asked when the held test holds it, and otherwise
  closed as decided by the round and recorded in `## Settled`; a
  contradiction between the two readings is still asked.
- `docs/governance/prd-and-openspec.md` - Waiting for an input: a question
  about a look waits in one designer's change per capability through
  `awaiting: ui-design`, naming the designer, with no `awaiting: specs`; a
  look-only answer closes it with `skip_specs`.
- `docs/governance/round-summary.md` - Interview: "What is decided" names the
  source of each row a round closes.
- `AGENTS.md` - the line on what to ask links the held test.
- `.claude/skills/` - `workflow-round`, `planning-dev`, `spec-to-tcs`,
  `planning-design` and `accept-review` carry the rule once each; the
  `decisions.md` template's Raised note says the same. planning-design's
  Product detail line adds the frame and the story to what stays off the
  page, and accept-review's report lists each closed row with its source.
- `scripts/openspec/lib/acceptance.mjs` - the Raised and ❓ refusals stay, and
  name each open row with its role and recommendation.

## References

- [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round)
- [Change Stages · Stages](../../../docs/prds/products/shared/planning/change-stages.md#stages)
