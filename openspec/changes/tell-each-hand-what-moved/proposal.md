# Tell each hand what moved

**Author:** @ecchochan - 2026-09-23

Product context: [Agent Rounds · Read Again](../../../docs/prds/products/shared/planning/agent-rounds.md#read-again) and [Change Stages · Messages](../../../docs/prds/products/shared/planning/change-stages.md#messages), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: the owner's rule after the audit of `address-each-hand-in-the-round` - "If a decision or proposal changes and affects anything, the parts depending on them must be notified and reviewed with what's changed. It could be async if trivial, but blocking if major." Depends on `run-a-round-on-every-artifact`, whose freshness rules it refines, `stage-changes-and-notify-hands`, whose behind message it replaces, and `address-each-hand-in-the-round`, whose suite and walk it holds to QA's review.

## Why

A hand whose artifact is behind learns which file moved, not what moved in
it. The audit found every surface - the direct message, Told now, the chip
and the digest - naming artifacts alone, so the round that reads again finds
the change for itself. It found every move treated the same: a reworded line
in the proposal holds the plan as long as a decision that changes what is
built. It found three re-reads that nobody did: an answered held row marks
every draft after the decisions read, a later commit to a file clears it, and
`--reviewed` lands without the hand. Only the earliest behind artifact's hand
is told, so the others learn at their next landing. And the walks of two
changes ran on suites whose every case was still a draft, with nothing
holding either change from folding them into the durable suite.

Success is a hand who reads the move in the message, re-reads only what it
reached, and is held only where the move changes what they build. The
number to move: landings refused for a move that changed nothing the hand
builds, from every reworded line today to none.

## What Changes

- **The move is quoted** - the hand of each artifact a move reaches is told
  the move itself, once: a decision row before and after, or the lines of a
  proposal, a journey or a page section before and after.
- **Every hand it reaches is told** - not only the earliest behind
  artifact's.
- **A major move holds, a small one tells** - a changed decision, goal,
  non-goal, requirement or case result holds every landing drawn from it
  until its hand reads it again; any other move is told, holds nothing, and
  stays on the hand's list until they read it.
- **An answer that takes the recommendation moves nothing** - one that
  overturns it is a major move; no answer marks a draft read on its own.
- **Read again is the hand's** - `--reviewed` lands on the hand's word, like
  any landing.
- **The suite is signed before it folds** - the archive refuses a change
  whose suite holds a draft case, and a case the review changes after the
  walk ran puts the walk group behind.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/planning/agent-rounds` - ADDED requirements: the move quoted to
  every hand it reaches, a major move held and a small one told, an answer
  that takes the recommendation, the hand's word on a re-read, and the suite
  signed before it folds. `run-a-round-on-every-artifact`'s "Nothing lands
  after a behind artifact" is narrowed to a major move by this change's round.
- `shared/planning/change-stages` - `stage-changes-and-notify-hands`'s
  behind message is replaced by the move's, to each hand it reaches.

## Impact

- `tools/manual/src/store/upstream.mts` and `src/api/stages.ts` - what moved
  is kept per unit: a decision row, a line range of a proposal, journey or
  page section, a requirement, a case; each move classed major or small.
- `scripts/openspec/` - `plan-land.mjs` refuses on an unread major move
  alone, takes `--reviewed` on the hand's word, and writes no read mark for
  an answer; `lib/wording.mjs` and `lib/moves.mjs` quote the move to every
  hand; `archive-preflight.mjs` refuses a draft case.
- `tools/manual/src/` - My turn lists a small move until its hand reads it;
  Told now quotes the move.
- `.claude/skills/workflow-round/` - the re-read reads the quoted move.
- The planning pages and guides - each role's page carries the rule once.

## Follow-on changes

- A move judged by what it means rather than where it sits: a reworded line
  that turns a decision, raised by the hand who reads it.

## References

- [Agent Rounds · Read Again](../../../docs/prds/products/shared/planning/agent-rounds.md#read-again)
- [Change Stages · Messages](../../../docs/prds/products/shared/planning/change-stages.md#messages)
