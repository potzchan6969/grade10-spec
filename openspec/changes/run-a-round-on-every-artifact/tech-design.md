Drawn from [Agent Rounds](../../docs/prds/products/shared/planning/agent-rounds.md), the proposal and the journeys, before the requirements. The requirements pass reads it; the reconciliation re-reads it.

## Context

- **The skills already run rounds by hand.** `planning-pm` interviews through `grilling`, `planning-qa` dispatches two blind sub-agents and reconciles, `planning-design` and `planning-dev` write one file each; every rule an artifact must meet is rendered by `openspec instructions <artifact>` from `schema.yaml` and `openspec/config.yaml`, which is the load path a round reads.
- **The store's freshness rule reads text, not history.** `tools/manual/check/stale.mjs` compares a spec's requirements as they stood at the page's commit with whitespace collapsed; `tools/manual/src/store/git.mts` reads `git ls-files -s` and blobs without history, which is what a one-commit checkout in CI can do.
- **`stage-changes-and-notify-hands` derives everything this change acts on.** `stageOf`, `handOf` and `behindOf` in `derive.ts`; `reviewed:`, `landed_by:` and `thread:` read by `read-changes.mts`; the push workflow computing the stage, the hands and the behind set at base and head, on a full checkout, with the Slack bot token.
- **Two repositories, one submodule.** Code lands in `grade10`, which carries this store as `external/grade10-spec`; `pnpm plan done` there pushes the tick to this store's `main`.
- **What a thread can hold.** A Slack app can post replies in a thread it can see; a second app cannot answer inside another app's direct message, so a thread every hand and every agent can use sits in a channel.

## Goals / Non-Goals

**Goals:**

- One round procedure, one set of perspectives per artifact, read by every line skill from the load path
- A re-read that clears Behind with a record no person has to write, and a landing that refuses while anything before it is behind
- A thread a person can work a change from, and a wake on every landing, with the files as the only state

**Non-Goals:**

- A relay of our own between Slack and a session; the runners below are the vendor's, and Operations confirms them
- `pnpm land` as the one gate for both repositories - the round's landing step runs the same checks until that change lands
- Interactive Slack messages

## Decisions

The page governs what a round is and what a hand can say; these are how that lands.

- **The round is one skill.** `.claude/skills/round/SKILL.md` holds the six steps: read what is before the artifact, draft on `change/<id>`, dispatch one challenger per perspective, dispatch one verifier per group of findings, write the summary and the questions to the thread, land on the hand's word. `/plan`, `/design`, `/tech`, `/specify`, `/tasks` and `/build` each name their artifact and call it; `/specify` sets its Challenge to the two blind readings and its Verify to the reconciliation and keeps the scenario draft out of the branch. Rejected: the procedure repeated in each skill, which `agent:check-parity` cannot hold together.
- **Perspectives are schema data.** `perspectives:` beside `teammate:` on each artifact in `openspec/schemas/grade10-planning/schema.yaml`, one entry per reader with `name`, `when` (what in the draft summons it: `surface`, `schema`, `export`, `system`, `migration`, `flag`, `money`, `deploy`, `copy`, `always`) and the prompt file under `.claude/agents/`; the round reads them through `openspec instructions <artifact>`. `pnpm run test:openspec` proves the CLI carries the key; where it does not, the same table lives in that artifact's `rules` block in `openspec/config.yaml`. The simpler-thing reader is `always`.
- **Challengers and verifiers are agent definitions.** One file per perspective under `.claude/agents/`, and one `verifier` definition that takes a group of findings and the draft; the round dispatches them as sub-agents that see the draft and what is before it, and never each other's output. The tech design's and the build's readers cite `docs/governance/system-design.md`.
- **The size is computed from the diff.** The round classifies the draft's diff against the `when` set - a changed `ui-design.md` or a `::story` is `surface`, a `## Data model` or an export line is `schema` or `export`, a migration group is `migration`, `flag:` is `flag`, minor units are `money` - and dispatches the readers summoned plus `always`; one reader means no verifier and the writer reconciles. Nothing is declared; a wrong set is a question for the interview.
- **Questions are decisions rows.** A finding the verifier calls a preference or a product decision is written as a `## Decisions` row `Q<n>` with `❓ <role> - recommended: <option>` in `Decided` and the options in `Instead of`; the id is the next unused in the change. A product detail goes to the page as a ❓ line. The thread's message lists the ids; a reply `Q<n>: <answer>` writes the answer into `Decided`, and `Q<n>` alone takes the recommendation. `check:manual`'s `cited` rule already resolves `Q<n>` from `rounds.md`.
- **The read record is a content id.** `reviewed: <artifact>: <id>` where `id` is the first 8 hex characters of SHA-256 over the upstream texts in the schema's order - the linked page sections first, then each artifact file before it - each with whitespace collapsed as `stale.mjs` collapses it, joined by a NUL. `behindOf` computes the same id from the tree; equal is fresh. A re-read that changes nothing writes the line in one commit that says so in the thread; a re-read that edits opens a round and writes nothing. `.openspec.yaml` is excluded from every upstream set.
- **The re-read is a run in the push workflow.** `proposal-notify.yml` gains a job after the messages: for each change the push touched whose behind set at head is not empty, run the round skill's re-read with the change id only, on the workflow's full checkout, with `concurrency: cascade-<change-id>` and `cancel-in-progress: false`, so a second push joins the queue and the running re-read reads `main` again before it lands. Rejected: a routine with an API trigger and a bearer token, which adds a second scheduler and a long-lived secret to a trigger the workflow already has.
- **The thread is the vendor's session.** The workflow opens the change's thread on the first landing and writes `thread: <channel>/<ts>` in one commit; a hand mentions the Slack app in that thread, and the app starts or continues a session on this repository reading the branch, the thread and the skills. The workflow's re-read posts into the same thread through the bot token. ❓ Which app, its admin approval and the workspace plan: Operations confirms. Rejected: a relay of our own, which is a service to run before the first round.
- **Resumable, not idempotent.** Every run starts by reading the branch, `main` and the thread, computing what is behind and which questions are open, and continues from there; a session that dies loses nothing that was pushed. Every push to the branch and to `main` is `--force-with-lease`; a loser re-reads once and, if it loses again, replies in the thread and stops.
- **The landing step runs the gate.** `/land` inside the round rebases on `main`, runs `validate:changes`, `check:manual` and `tcs:validate` on a full clone, refuses when `behindOf` names anything before the artifact, writes `landed_by:` and the `rounds.md` row in the same commit, and pushes. When `land-on-main-through-the-gate` ships, `pnpm land` is that step. `archive:preflight` gains the same refusal on a behind delta.
- **`rounds.md` is a table.** `| Round | Artifact | Perspectives | Stood | Asked | Tests |`: the round number, the artifact id or the task group number, the perspective names run, the findings that stood as short phrases, the `Q<n>` ids raised, and per scenario id the test files that landed for a group. `read-change-documents.mts` reads it; `check:manual` gains rule `round`: a written artifact from `proposal` to `tasks` and a ticked group with no row, on a change created on or after the rule's commit, is refused. The archive copies the file across like the journeys.
- **A remark is a row before it is a change.** A reply that is not `Q<n>` and not `land` is a remark: the round appends a `rounds.md` row naming it, applies it as written, re-runs the perspectives whose `when` the edited lines summon, and, when the remark settles a choice a decisions row asked, writes it there too.
- **The first sentence opens the change.** A message in the planning channel mentioning the app with no change named runs `/plan` from nothing: `slugOf` from `tools/manual/src/editor/propose.ts` picks the id, `openspec new change` writes the record, `hands: pm:` is the asker's handle from the team map, the branch is pushed, and the reply names the id in the thread the message started; the workflow writes `thread:` when the proposal first lands.
- **The tech design moves before the requirements.** `requires` for `tech-design` in `schema.yaml` becomes `decisions` and `user-journeys`; `planning-qa`'s requirements pass reads `tech-design.md` beside `ui-design.md`; a requirement that reaches the design writes `awaiting: tech-design: "<date>, <requirement> re-read - @<tech>"`, cleared by the tech PIC's edit or a `reviewed:` line.
- **The build round runs in the application repository.** `/build` in `grade10` calls the same round skill against a task group: the tests named by the group's scenario ids in their own commit first, then the code, then the group's readers, then the landing summary in the thread; `pnpm plan done` refuses a tick whose task names no scenario id or one no test in the tree cites, and the round row lands in the store before the tick. The walk is the E2E group: it flips each covered case's automation status to `automated` in its commit; `scripts/openspec/run-sheet.mjs` gains `--include-automated`, off by default; the suite runs on every push to `main` and its `smoke` cases on every staging deploy and cut.
- **The principles are a rulebook.** `docs/governance/system-design.md`: eight principles with one test each, and the reader's stance; `AGENTS.md` maps to it; the `tech` and `build` readers cite it.

## Service Interfaces

Not a service. The contracts that cross a boundary:

| Contract | Input | Output |
| --- | --- | --- |
| The round skill | A change id, an artifact id or a group number, the thread | The draft on `change/<id>`, the thread's summary and questions, and on the hand's word one landing commit with `landed_by:`, the `rounds.md` row and, for a re-read, `reviewed:` |
| `perspectives:` per artifact | `name`, `when`, `agent` | Read through `openspec instructions <artifact>` |
| `behindOf(entry, tree)` | From `stage-changes-and-notify-hands` | The artifact ids behind, which the landing step refuses on |
| A thread reply | `Q<n>: <answer>`, `Q<n>`, `land`, or any other text | An answer written, the recommendation taken, a landing, or a remark applied |
| `pnpm plan done` | A change id and a task id | Refused when the task names no scenario id or one no test cites |

The record's new keys:

```yaml
reviewed:
  ui-design: 8c4e1a2f
  tech-design: 8c4e1a2f
thread: C0456EFGH/1758270000.000100
```

## Risks / Trade-offs

- [A wrong no-op re-read leaves a stale artifact looking fresh] → the line is landed by the agent alone and says in the thread what it read; the hand of the artifact is told once, and a remark reopens the round
- [A reformat of one upstream file puts every artifact after it behind] → one re-read writes one line per artifact and lands them together; the cost is one run
- [Two runs race on one branch] → one run per change in the workflow, force-with-lease everywhere, a loser stops and says so
- [The thread's app is not approved in the workspace] → the terminal runs the same round against the same branch, and the workflow's re-read needs no app; the thread is the smooth path, not the only one
- [A group lands by hand without a round] → the `round` rule refuses the tick, date-fenced to changes opened after it, and the fix is one row saying what happened
- [The requirements move after the tech design and nothing notices] → the requirements pass writes the dated wait on the tech PIC; a wait holds no stage
- [The perspectives table grows into a checklist] → a perspective is a reader with a `when`; a reader with no `when` a draft can summon is deleted

## Migration Plan

1. `docs/governance/system-design.md`, the `round` skill, the agent definitions, `perspectives:` in the schema, `tech-design`'s `requires`; `/plan`, `/design`, `/tech`, `/specify`, `/tasks` and `/build` calling the round from a terminal. Nothing changes for a change already in flight.
2. `reviewed:`, `rounds.md`, the `round` rule date-fenced, the landing step's refusal, `archive:preflight`'s refusal, `run-sheet.mjs`'s filter, `pnpm plan done`'s refusal in `grade10`.
3. The re-read job in the push workflow; `thread:`; the first sentence opening a change. Rollback for this step is the job's `if:` on a repository variable.

## Open Questions

- Whether the Slack app that holds the thread can be told the change id in the message, or reads it from the thread's first line; the reply names it either way.
- Whether a remark that settles nothing a row asked is also worth a decisions row; the round row holds it until somebody says so.
