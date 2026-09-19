# Run a round on every artifact

**Author:** @ecchochan - 2026-09-19

Product context: [Agent Rounds](../../../docs/prds/products/shared/planning/agent-rounds.md), a planned page under [Planning](../../../docs/prds/products/shared/planning/index.md). Owner's brief: [Delivery workflow blueprint · The Second Brief](../../../docs/references/delivery-workflow-blueprint.md#the-second-brief). Depends on `stage-changes-and-notify-hands`, which derives the stage, the hands and Behind and sends the messages this change answers in.

## Why

Every artifact of a change is written by whoever holds the pen that day, in a terminal, with one voice asking questions, and nothing reads it again when what it was drawn from moves. A product manager who wants a gift receipt opens a terminal or waits for someone who will; a designer or a tech PIC gets a change to write, not a proposal to review; the requirements are re-read against a late answer only because a skill says so; and a proposal edited on Tuesday leaves a design drawn on Monday looking fresh on every surface. On 2026-09-19, 63 of the 72 changes in flight have a proposal and no decisions, and no file in the store can say which of the other nine were read after their proposal last changed.

Success is a product manager who writes one sentence in Slack and answers numbered questions there until the three files land; a designer and a tech PIC who receive a draft to tweak or challenge rather than a blank file; every draft read by named perspectives and verified before a person sees it; an artifact that goes behind when what is before it moves and is read again before anything is built on it; and a change that ends with its journeys walked end to end. The number to move: the days between a stage landing and the next hand's word, which `stage-changes-and-notify-hands` puts on the change page, and the count of artifacts behind for more than 7 days, zero after this change.

## What Changes

- **One round per artifact.** Ask, draft, challenge, verify, read, land. The change's agent drafts on the change's branch from what is before the artifact and what the hand asked; agents read the draft, one per perspective; one agent per group of findings argues whether each stands; the hand reads the summary and the questions in the thread and answers, remarks, or says land; on their word the artifact lands on `main` with `landed_by:`, and what comes after it is read again. The page: [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round).
- **Questions, never guesses.** What is a preference or a product decision becomes a numbered `## Decisions` row with the agent's recommendation and the hand it waits on, or a ❓ line on the page; ids are issued per change and never reused. The change page and My turn list the open ones per hand.
- **Three moves in the thread, and an edit anywhere.** A product manager's first sentence in the planning channel opens the change and its thread; every later hand answers in the thread the direct message points at; a remark is applied as written and re-runs only the perspectives it touches; a hand's own edit pushed from a terminal or GitHub is the same round. [Agent Rounds · Your Moves](../../../docs/prds/products/shared/planning/agent-rounds.md#your-moves).
- **Perspectives as data.** Each artifact's readers are one table in the schema beside `teammate:`; the simpler-thing reader runs on every round and the others join when the draft touches what they read for; a round of one reader verifies itself. The blind readings of the requirements and the cases stay two independent readings reconciled after both, with their stops on the product manager and no verifier over them. [Agent Rounds · Perspectives](../../../docs/prds/products/shared/planning/agent-rounds.md#perspectives).
- **Read again, in order.** A landing wakes the change's agent, which reads every artifact after the one that moved: an edit opens a round for that artifact's hand; a read that changes nothing writes `reviewed:` with the content id of what is before the artifact. An artifact lands only when everything before it is fresh; the fold at archive refuses a behind delta; a tick, a claim and a wait are never held. A goal or a non-goal that moved is a question to the product manager: extend, supersede or split. [Agent Rounds · Read Again](../../../docs/prds/products/shared/planning/agent-rounds.md#read-again).
- **The record.** `rounds.md` in the change: one row per round with the artifact or group, the perspectives run, what stood, the question ids raised and the tests each scenario landed with; `check:manual` refuses a landed artifact or a ticked group with no row on a change opened after the rule.
- **The walk.** Each task group lands test first, read by its perspectives and verified before the engineer reads the landing summary; the last group demonstrates the journeys in a browser and leaves the end-to-end suite, marks the cases it automates, and the run sheet on staging leaves those out; one reader argues the simpler shape for the whole change before staging. [Agent Rounds · The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk).
- **The thread and the runner.** One thread per change in the planning channel, its address recorded as `thread:`; the direct messages point at it; the agent that answers in it and the one that wakes on a landing are named in the tech design and confirmed by Operations. [Agent Rounds · Surfaces](../../../docs/prds/products/shared/planning/agent-rounds.md#surfaces).
- **Keys the record gains.** `reviewed:` (artifact id to content id, written by the re-read), `thread:` (the channel and message the thread hangs off, written once when the thread opens). `rounds.md` becomes the ninth file of a change, copied across at archive like the journeys.

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/planning/agent-rounds`: how an artifact is written and read again - the round, the moves a hand has, the perspectives, the re-read, the record and the walk. Held to by the store's skills and checks and by the application repository's build, which is why it sits under `shared/`.

### Modified Capabilities

None.

## Impact

- `grade10-spec`: one `round` skill every line skill calls, and the line skills `/plan`, `/design`, `/tech`, `/specify`, `/tasks`, `/build`, `/land` in place of the planning skills; challenger and verifier agent definitions under `.claude/agents/`; `perspectives:` per artifact in `openspec/schemas/grade10-planning/schema.yaml` and `tech-design`'s `requires` moved before `specs`; `docs/governance/system-design.md` with the eight principles; `planning-qa`'s requirements pass reads `tech-design.md`; `tools/manual/check/` gains the `round` rule and the behind refusal in `archive:preflight`; `read-changes.mts` reads `reviewed:`, `thread:` and `rounds.md`; `scripts/openspec/run-sheet.mjs` leaves automated cases out; `.github/workflows/proposal-notify.yml` wakes the re-read and posts to the thread; the change page gains the rounds rows; `AGENTS.md` and `docs/prds/guides/working-a-change.md` describe the round.
- `grade10`: `/build` runs there in a session bound to it with the store as its submodule; `pnpm plan done` refuses a tick whose task names no scenario id or one no test in the tree cites; the end-to-end suite runs on every push to `main` and its smoke cases on every staging deploy and cut.
- Every teammate: answers in a thread instead of writing a file; a round's summary and questions arrive there.
- This change's own artifacts: `ui-design.md` and `tech-design.md` are drawn from the page and this proposal; a state or a constraint either needs that the page lacks lands on the page first.

## Open Questions

- ❓ **The runner** - which agent holds a change's thread and which wakes on a landing, what the Slack workspace needs for them, and where the secret lives. Operations and the tech PIC decide.
- ❓ **The thread's home** - a thread in the planning channel, because a second app cannot answer inside another app's direct message. Operations confirms.

## References

- [Agent Rounds · The Round](../../../docs/prds/products/shared/planning/agent-rounds.md#the-round)
- [Agent Rounds · Your Moves](../../../docs/prds/products/shared/planning/agent-rounds.md#your-moves)
- [Agent Rounds · Perspectives](../../../docs/prds/products/shared/planning/agent-rounds.md#perspectives)
- [Agent Rounds · Read Again](../../../docs/prds/products/shared/planning/agent-rounds.md#read-again)
- [Agent Rounds · The Walk](../../../docs/prds/products/shared/planning/agent-rounds.md#the-walk)
- [Agent Rounds · Surfaces](../../../docs/prds/products/shared/planning/agent-rounds.md#surfaces)
- [Change Stages](../../../docs/prds/products/shared/planning/change-stages.md)
- [Delivery workflow blueprint](../../../docs/references/delivery-workflow-blueprint.md)
- [PRDs and OpenSpec · The change's record](../../../docs/governance/prd-and-openspec.md#the-changes-record)
- [Specs to test cases](../../../docs/governance/specs-to-test-cases.md)
