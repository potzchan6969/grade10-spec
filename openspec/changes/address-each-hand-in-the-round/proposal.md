# Address each hand in the round

**Author:** @ecchochan - 2026-09-22

Product context: [Agent Rounds · Your Moves](../../../docs/prds/products/shared/planning/agent-rounds.md#your-moves), [Perspectives](../../../docs/prds/products/shared/planning/agent-rounds.md#perspectives), [The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk) and [Checks](../../../docs/prds/products/shared/planning/agent-rounds.md#checks), and [Change Stages · Hands](../../../docs/prds/products/shared/planning/change-stages.md#hands), under [Planning](../../../docs/prds/products/shared/planning/index.md). Source: [Cross-Sell Walkthrough](../../../docs/references/cross-sell-walkthrough.md), one feature walked through every role on 2026-09-21 with an agent standing in for each hand. Depends on `run-a-round-on-every-artifact`, whose round this change corrects, and `stage-changes-and-notify-hands`, whose hands it extends.

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
  are theirs; a held row addressed to another hand is the round's own reply
  in the change's thread, mentioning that hand, keyed so it is posted once,
  with the row, the page sentence and the decision rows it touches quoted; a
  product detail a build round lands on a page reaches the product manager as
  ❓ with the line quoted before and after, never as decided by the round.
- **QA is a hand of Specified** — the landing that puts the suite up for
  review is a move to QA, told by the message every hand gets, and the walk
  group names the review as its input.
- **The interview asks about three questions** — none trivial; a further
  choice the held test holds is held, never a default; the defaults the round
  applies are listed as such, the questions asked are the ones that change
  what is built, and one asks whether to do it now.
- **A round is sized by what it lands** — a task group that lands prose is
  read by the reader of words and QA, not the build's four readings; one
  verifier reads a round's readings together; a reader or verifier that ran
  on a fallback model is named in the row, and a dispatch the vendor killed
  stops the round rather than thinning it.
- **The record takes the application repository** — a group's repository tag
  says where its paths live, and the landing resolves them in the application
  clone it runs beside; a row or a suite's Manual row that credits a test is
  refused when the file cites no such id; a group whose lane did not run says
  so first and keeps its tasks unticked.
- **Four gates stop refusing what is right** — a page naming a capability an
  in-flight change declares resolves; a written design may still wait on its
  frame; two in-flight deltas that fold one requirement are named to each
  other however each is headed; a suite's Manual table is refused where it is
  written when it sits outside the reconciliation.
- **The walk's ids are checked at the tick** — in the application repository,
  a walk's bracketed case id whose case is not yet actual is refused by the
  tick, in the pass that already looks for a task's scenario ids.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### Modified Capabilities

- `shared/planning/agent-rounds` — ADDED requirements: whom a summary
  addresses, when QA is asked, the interview's size, a task group sized by
  what it lands, the record's application paths and refusals, the gates
  corrected. The three statements of `run-a-round-on-every-artifact`'s delta
  that said otherwise — one verifier per group of findings, a task group's
  readers, the `when` table — are moved in that delta by this change's round,
  recorded as its round 43, since a MODIFIED block can name only a durable
  requirement.
- `shared/planning/change-stages` — the Hands table of
  `stage-changes-and-notify-hands`'s delta gains QA at Specified, moved in that
  delta by this change's round, recorded as its round 27; no new message kind.

## Impact

- `openspec/schemas/grade10-planning/schema.yaml` — the `apply` block's
  perspectives carry `when:` triggers; `tools/manual/src/api/types.ts` names
  the `code` trigger in the same landing.
- `scripts/openspec/` — `lib/perspectives.mjs` raises `code`; `plan-land.mjs`
  resolves an application group's paths in the clone it runs beside, takes
  `--unrun`, holds a `(fallback)` suffix, and refuses a cited test that
  carries no such id through one helper in `lib/`; `validate-test-cases.mjs`
  refuses a Manual table outside the reconciliation and a Manual row whose
  test in this store carries no such case id.
- `tools/manual/check/` — `context.mjs` counts a change's declared
  capabilities among the changing; `record.mjs` no longer refuses a wait on a
  written artifact; `deltas.mjs` names two in-flight deltas on one requirement
  however each is headed.
- `tools/manual/src/` — the hands of Specified include QA, so the existing
  turn message reaches them.
- `.claude/skills/` and `.claude/agents/` — the round's summary, the held
  row's reply, the interview's shape, one verifier per round, the fallback and
  the killed dispatch.
- `docs/governance/round-summary.md` and the planning pages and guides — each
  role's page carries the new rules once; the governance page keeps the
  procedure and points at the requirements.
- `grade10` — `pnpm plan done` reads a walk's bracketed case ids.

## References

- [Agent Rounds · Your Moves](../../../docs/prds/products/shared/planning/agent-rounds.md#your-moves)
- [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round)
- [Agent Rounds · Perspectives](../../../docs/prds/products/shared/planning/agent-rounds.md#perspectives)
- [Agent Rounds · The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk)
- [Agent Rounds · Checks](../../../docs/prds/products/shared/planning/agent-rounds.md#checks)
- [Change Stages · Hands](../../../docs/prds/products/shared/planning/change-stages.md#hands)
- [Cross-Sell Walkthrough](../../../docs/references/cross-sell-walkthrough.md)
