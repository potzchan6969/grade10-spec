# Tell each hand what moved

**Author:** @ecchochan - 2026-09-23

Product context: [Agent Rounds · Read Again](../../../docs/prds/products/shared/planning/agent-rounds.md#read-again) and [Change Stages · Messages](../../../docs/prds/products/shared/planning/change-stages.md#messages), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: the owner's rule after the audit of `address-each-hand-in-the-round` - "If a decision or proposal changes and affects anything, the parts depending on them must be notified and reviewed with what's changed. It could be async if trivial, but blocking if major." Depends on `run-a-round-on-every-artifact`, whose freshness rules it refines, and `stage-changes-and-notify-hands`, whose behind message and chip it replaces.

## Why

A hand whose artifact is behind learns which file moved, not what moved in
it. The audit found every surface - the direct message, Told now, the chip
and the digest - naming artifacts alone, so the round that reads again finds
the change for itself. It found every move treated the same: a reworded line
in the proposal holds the plan as long as a decision that changes what is
built. It found three re-reads that nobody did: an answered held row marks
every draft after the decisions read, a later commit to a file clears it, and
`--reviewed` lands without the hand. Only the earliest behind artifact's hand
is told, so the others learn at their next landing.

Success is a hand who reads the move in the message, re-reads only what it
reached, and is held only where the move changes what they build. The
number to move: landings refused for a move that changed nothing the hand
builds, from every reworded line today to none.

## What Changes

- **What moved is quoted** - each hand it reaches is told what moved, before
  and after: a decision row, a requirement or a case, or the lines of any
  other artifact or page section before theirs.
- **One message per person per landing** - listing every artifact of theirs
  the landing reached and which of them it holds; not only the earliest
  behind artifact's hand.
- **A major move holds, a small one tells** - what moved and is major holds
  every landing drawn from it until its hand reads it again; what is small is
  told, holds only the fold, and stays on the hand's list until read. What
  counts as major is open with the product manager (Q4).
- **Fresh is a hand's read or landing** - every artifact landing writes
  `reviewed:`, a tick never does, and the dated fallback retires; the
  in-flight records are backfilled once.
- **An answer that takes the recommendation is no move** - the class reads
  the Decision cell without its ❓ wrapper; one that overturns it is major.
  No answer marks a draft read on its own.
- **Read again is the hand's** - `--reviewed` lands on the hand's word, like
  any landing.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/planning/agent-rounds` - ADDED requirements: what moved quoted to
  every hand it reaches, a major move held and a small one told, freshness as
  a hand's read or landing, an answer that takes the recommendation, and the
  hand's word on a re-read. `run-a-round-on-every-artifact`'s "Nothing lands
  after a behind artifact" is narrowed to a major move by this change's round.
- `shared/planning/change-stages` - `stage-changes-and-notify-hands`'s
  behind message and chip say which artifacts a landing holds, one message
  per person per landing, and My turn lists what is not read yet.

## Impact

- `tools/manual/src/store/upstream.mts` and `src/api/stages.ts` - what moved
  is read per unit, a decision row, a requirement, a case or a line range,
  and classed major or small; the dated fallback retires.
- `scripts/openspec/` - `plan-land.mjs` refuses on an unread major move
  alone, writes `reviewed:` on every artifact landing and never on a tick or
  an answer, and takes `--reviewed` on the hand's word; `lib/wording.mjs`
  and `lib/moves.mjs` send one message per person per landing, quoting what
  moved.
- `tools/manual/src/` - My turn lists a small move until its hand reads it;
  Told now and the chip quote what moved and whether it holds.
- `.claude/skills/workflow-round/` - the re-read reads the quoted move.
- The planning pages and guides - each role's page carries the rule once.

## Follow-on changes

- A move judged by what it means rather than where it sits: a reworded line
  that turns a decision, raised by the hand who reads it.
- The suite signed before it folds: the archive refuses a change whose suite
  holds a draft case, its own change, as the owner took it.

## References

- [Agent Rounds · Read Again](../../../docs/prds/products/shared/planning/agent-rounds.md#read-again)
- [Change Stages · Messages](../../../docs/prds/products/shared/planning/change-stages.md#messages)
