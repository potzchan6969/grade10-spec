# Address each hand in the round

**Author:** @ecchochan - 2026-09-22

Product context: [Agent Rounds · Your Moves](../../../docs/prds/products/shared/planning/agent-rounds.md#your-moves), [Perspectives](../../../docs/prds/products/shared/planning/agent-rounds.md#perspectives), [The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk) and [Checks](../../../docs/prds/products/shared/planning/agent-rounds.md#checks), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: [Cross-Sell Walkthrough](https://claude.ai/artifact/RRrhtNCREemYurRHHmcmjv), one feature walked through every role on 2026-09-21 with an agent standing in for each hand. Depends on `run-a-round-on-every-artifact`, whose round this change corrects, and `stage-changes-and-notify-hands`, whose messages it addresses.

## Why

The round works, and it asks the wrong people at the wrong time. In the
walkthrough the product manager was asked ten questions in one round, three
of them obvious, and then not asked at all for six rounds while build rounds
edited their pages; QA was named in the record at the interview and first
addressed at round 13, by build readers tripping on a rule in the application
repository; the engineer read a summary that listed counts where the test
asserted a list, and a row that said `corrected` before any commit held the
correction. Four gates refused work that was right: a page written first for a
new capability, a design that waits on its frame, a walk in the application
repository, and a row naming the tests that repository holds. Six readers were
dispatched onto three prose pages, four of them code readings; a spend cap
and a model outage killed ten dispatches and three verdicts came from a
fallback model the row could not name.

Success is a hand who reads one message that is theirs, answers it in a
sentence, and never opens a file to check a count; a suite QA is asked to
review the day it lands; a row that lands through the command whichever
repository its tests are in; and a round whose cost is the readings that
disagree, not the ones that repeat. The number to move: the minutes a hand
spends per read, from 20 to 30 in the walkthrough to under 10.

## What Changes

- **Each hand is addressed alone** — a summary shows a hand the moves that
  are theirs; a held row addressed to another hand is its own message, with
  the row, the page sentence and the decision rows it touches quoted; a
  product detail a round lands on a page reaches the product manager as ❓ with
  the line quoted before and after, never as decided by the round.
- **QA is asked when the requirements land** — the landing that puts the suite
  up for review addresses QA, and the walk group names the review as its
  input.
- **The interview asks two or three questions** — the defaults the round
  applies are listed as such, the questions asked are the ones that change
  what is built, and one asks whether to do it now.
- **A round is sized by what it lands** — a task group that lands prose is
  read by the reader of words and QA, not the build's four readings; the
  readings of one round are verified together; a reader or verifier that ran
  on a fallback model is named in the row.
- **The record takes the application repository** — a row names the
  repository with each test path and the landing resolves it through the
  submodule; a walk's case flips the same way; a row or a suite's Manual row
  that credits a test is refused when the file cites no such id; a group whose
  lane did not run says so first.
- **Four gates stop refusing what is right** — a page naming a capability an
  in-flight proposal names resolves; a written design may still wait on its
  frame; two in-flight deltas whose scenarios on one requirement state
  opposite outcomes are refused however each is headed; a suite's Manual table
  is refused where it is written when the fold would not read it.
- **The walk's ids are checked** — in the application repository, a walk's
  bracketed case id whose case is still draft is refused by the plan command.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/planning/agent-rounds` — ADDED requirements: whom a summary
  addresses, when QA is asked, the interview's size, a round sized by what it
  lands, the record's application paths and refusals, the gates corrected.
  Added beside `run-a-round-on-every-artifact`'s delta, which this change
  extends and never modifies.

## Impact

- `openspec/schemas/grade10-planning/schema.yaml` — the `apply` block's
  perspectives gain `when:` triggers, and the planning artifacts' instruction
  names the review step.
- `scripts/openspec/` — `perspectives.mjs` classifies a page and a suite;
  `plan-land.mjs` resolves an application path through the submodule and greps
  a cited test for its ids; `validate-test-cases.mjs` refuses the Manual
  table's three shapes.
- `tools/manual/check/` — the references rule counts a proposal's named
  capability; a wait may stand inside a written design; scenarios are read
  across in-flight deltas on one requirement.
- `.claude/skills/` and `.claude/agents/` — the round's summary and the
  verifier point at the conduct; the interview's shape; one verifier per round.
- `docs/governance/` and the planning pages — each role's page and guide
  carry the new rules.
- `grade10` — `pnpm plan` gains the walk-id check.

## References

- [Agent Rounds · Your Moves](../../../docs/prds/products/shared/planning/agent-rounds.md#your-moves)
- [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round)
- [Agent Rounds · Perspectives](../../../docs/prds/products/shared/planning/agent-rounds.md#perspectives)
- [Agent Rounds · The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk)
- [Agent Rounds · Checks](../../../docs/prds/products/shared/planning/agent-rounds.md#checks)
- [Cross-Sell Walkthrough](../../../docs/references/cross-sell-walkthrough.md)
