Drawn from [Agent Rounds](../../docs/prds/products/shared/planning/agent-rounds.md), the proposal and the journeys, before the requirements. The requirements pass reads it; the reconciliation re-reads it.

## Context

- **The skills already run rounds by hand.** `planning-pm` interviews through `grilling`, `planning-qa` dispatches two blind sub-agents and reconciles, `planning-design` and `planning-dev` write one file each; every rule an artifact must meet is rendered by `openspec instructions <artifact>` from `schema.yaml` and `openspec/config.yaml`, which is the load path a round reads.
- **Freshness is read from text because history is not always there.** `tools/manual/check/stale.mjs` compares a spec's requirements as they stood at the page's commit with whitespace collapsed. `tools/manual/src/store/git.mts` does walk full history — it is how `lastLanded` is read — but a depth-1 checkout, which is what CI takes by default, dates nothing: every commit reads as the same one. That is why no check reads freshness from a date, and why the content id is a hash of the text a one-commit checkout can still read.
- **`stage-changes-and-notify-hands` derives everything this change acts on.** `stageOf`, `handOf` and `behindOf` in `derive.ts`; `reviewed:`, `landed_by:` and `thread:` read by `read-changes.mts`; the push workflow computing the stage, the hands and the behind set at base and head, on a full checkout, with the Slack bot token.
- **Two repositories, one submodule.** Code lands in `grade10`, which carries this store as `external/grade10-spec`; `pnpm plan done` there pushes the tick to this store's `main`.
- **What a thread can hold.** A Slack app can post replies in a thread it can see; a second app cannot answer inside another app's direct message, so a thread every hand and every agent can use sits in a channel.
- **The hosted runner's push check.** A Claude Code Routine's session pushes freely to branches prefixed `claude/`; a push to any other branch is refused when the branch is protected, when somebody else has an open pull request from it, or when it carries a commit authored by somebody other than the routine's owner. Every firing is a fresh session, and the payload an API trigger carries arrives labelled as data.

## Goals / Non-Goals

**Goals:**

- One round procedure, one set of perspectives per artifact, read by every line skill from the load path
- A re-read that clears Behind with a record no person has to write, and a landing that refuses while anything before it is behind
- A thread a person can work a change from, and a wake on every landing, with the files as the only state
- One relay per store that wakes a run, lets it post, and moves `main` on a human word it checked itself

**Non-Goals:**

- A runner of our own: the session is the vendor's hosted Routine, and the relay is glue between Slack, the Routine and the code host that holds no model
- `pnpm land` as the one gate for both repositories - the round's landing step runs the same checks until that change lands
- Interactive Slack messages

## Decisions

The page governs what a round is and what a hand can say; these are how that lands.

- **The round is one skill.** `.claude/skills/round/SKILL.md` holds the six steps: read what is before the artifact, draft on `claude/<id>`, dispatch one challenger per perspective, dispatch one verifier per group of findings, write the summary and the questions to the thread, land on the hand's word. `/plan`, `/design`, `/tech`, `/specify`, `/tasks`, `/build` and `/land` each name their artifact and call it, standing beside the planning skills until `land-on-main-through-the-gate` consolidates them; `/specify` sets its Challenge to the two blind readings and its Verify to the reconciliation and keeps the scenario draft out of the branch. Rejected: the procedure repeated in each skill, which `agent:check-parity` cannot hold together.
- **Perspectives are schema data, read by our own reader.** `perspectives:` beside `teammate:` on each artifact in `openspec/schemas/grade10-planning/schema.yaml`, one entry per reader with `name`, `when` (what in the draft summons it: `surface`, `schema`, `export`, `system`, `migration`, `flag`, `money`, `deploy`, `copy`, `always`) and the prompt file under `.claude/agents/`. A task group is no artifact of the schema, so its readers sit as `perspectives:` on the schema's `apply:` block. `tools/manual/src/store/read-schema.mts` gains the key and `apply.perspectives` beside it, and the round, the surfaces and the checks all read it from there. Rejected: a copy of the table in each artifact's `rules` block in `openspec/config.yaml` — the CLI renders those blocks into the instruction budget, forty words at a time, and a table of readers would eat it while leaving two places to keep in step. The simpler-thing reader is `always`.
- **Challengers and verifiers are agent definitions.** One file per perspective under `.claude/agents/`, and one `verifier` definition that takes a group of findings and the draft; the round dispatches them as sub-agents that see the draft and what is before it, and never each other's output. The tech design's and the build's readers cite `docs/governance/system-design.md`.
- **The size is computed from the diff.** The round classifies the draft's diff against the `when` set - a changed `ui-design.md` or a `::story` is `surface`, a `## Data model` or an export line is `schema` or `export`, a migration group is `migration`, `flag:` is `flag`, minor units are `money` - and dispatches the readers summoned plus `always`; one reader means no verifier and the writer reconciles. Nothing is declared; a wrong set is a question for the interview.
- **Questions are decisions rows.** A finding the verifier calls a preference or a product decision is written as a `## Decisions` row `Q<n>` with `❓ <role> - recommended: <option>` in `Decided` and the options in `Instead of`; the id is the next unused in the change. A product detail goes to the page as a ❓ line. The thread's message lists the ids; a reply `Q<n>: <answer>` writes the answer into `Decided`, and `Q<n>` alone takes the recommendation. `cited` resolves scenario and journey ids only, so the `round` rule reads the `Q<n>` pattern itself. Two classes of row (`Q59`): a row is held, and keeps the ❓, when it moves scope, is costly to undo, needs a fact only a person has, or divides its options by more than a task group of work; every other preference the round decides on the best option and writes as `<option> - decided by the round`, with what it passed over in Instead of. `plan:land` refuses a landing while a held row is open, naming the rows, and `--with-recommendations` writes each held row's recommendation in the landing commit (`lib/held.mjs` parses the table). My turn and the digest count ❓ rows, so a decided row drops out of them on its own.
- **The read record is a content id, and one function computes it.** `reviewed: <artifact>: <id>` where `id` is the first 8 hex characters of SHA-256 over the artifact's `upstream:` texts in the schema's order, each with its whitespace collapsed and trimmed and nothing else normalised, joined by a NUL. `contentIdOf` lands in the store with `stage-changes-and-notify-hands`, where `behindOf` compares it to the tree; every script here imports it rather than hashing again, so a surface and a landing step can never disagree about what is fresh. A re-read that changes nothing writes the line in one commit that says so in the thread; a re-read that edits opens a round and writes nothing. `.openspec.yaml` is excluded from every upstream set.
- **The relay wakes the run, and every run is a fresh session.** `tools/relay` is a Cloudflare Worker with one Durable Object per Slack thread (`Q52`, `Q61`). It verifies the Slack app's events, drops repeats and bot posts, debounces a burst of replies for a minute, and fires the Routine's API trigger with a data payload: the change, why it woke, the thread's messages since the run's last post with the senders' handles, and a signed token scoped to that wake (`Q63`). The push workflow's `reread` job posts one `/wake` per change a landing put behind, with the change, the base and the head, and nothing else: no session, no write permission and no chat token in the workflow (`Q62`). Its bounds:

  | Bound | Why |
  | --- | --- |
  | One running wake per thread; a message during a run sets the room dirty and fires again after `done` | Two runs on one branch race; a run that starts after the last reply reads it |
  | A minute's debounce on a reply, none on a plan or a landing | Three quick replies are one wake |
  | The wake token: HMAC over the room, the wake and its expiry, valid for the wake's budget | A post or a landing carries proof of the wake it belongs to, and the bot token never leaves the relay |
  | Budgets: thirty minutes on a reply or a landing, two hours on a plan (`Q57`); the run pushes after every artifact | A run that dies loses one artifact; a hung run frees the thread |
  | The run's last act is `done`; the alarm posts the failure line with the run's link when it never comes (`Q56`) | The runner offers no completion webhook, and a run that dies silently looks like a run that found nothing |
  | The relay moves `main` only as a fast-forward, only after its own checks (`Q54`, `Q55`) | The hosted runner refuses a push to `main`, and a word the run reports is not a word the relay saw |
  | The matrix excludes a push whose only change is `reviewed:`, `thread:` or `landed_by:` lines | The re-read's own commit does not wake another re-read, which is what makes the loop terminate |
  | The whole `reread` job behind `AGENT_REREAD` | Operations turns the cascade on |

  Rejected: the vendor's action running the session inside the workflow, which needed `contents: write`, a settings file and a guard step in the job and still could not hold a thread; a completion webhook, which the runner does not offer; Claude Tag, whose pairing and spend nobody could confirm.
- **The thread is the relay's room, and the round records it.** `pnpm run round:thread <change> <channel>/<ts>` writes `thread:` once, called by the round when it answers the first planning-channel message about a change - the sentence that opened it, or the first later message naming it - and the run tells the relay the same id with `relay-post.mjs --bind`, so the room and the record agree. The push workflow never writes `thread:`: its own per-push post is a channel message about several changes, not any change's thread, and a change opened from a terminal carries no `thread:` until a channel message about it arrives. A run posts through the relay with its wake token and never holds the bot token; a terminal run posts nothing, and the push tells the thread. What Operations sets up is `docs/references/agent-runner.md`. Rejected: Claude Tag holding the thread, which nobody could pair, bound or observe.
- **Resumable, not idempotent.** Every run starts by reading the branch, `main` and the thread, computing what is behind and which questions are open, and continues from there; a session that dies loses nothing that was pushed, and every wake is a fresh session, so the files and the thread are the only memory there is. Every push to the branch is `--force-with-lease`; `main` moves as a fast-forward, by the terminal's own push or by the relay; a loser re-reads once and, if it loses again, replies in the thread and stops.
- **A wake drafts the chain and one word lands it.** A wake that opens a change or is asked to plan drafts every artifact it can reach on `claude/<id>` - the proposal, the decisions, the journeys, the design where a surface moves, the requirements and the cases, the tech design, the plan - each from the draft before it and each with its own readers, pushing after every artifact and landing nothing (`Q58`); a re-read that edits does the same from the artifact it reached. A draft that needs what only a hand holds writes the dated wait and drafts nothing that depends on it. `land` lands every drafted artifact of the speaker's hand in order and stops at the first artifact of another hand, who is told; while a held row is open it lands nothing and names the rows, and `land with recommendations` takes them (`Q60`). Rejected: stopping at the first hand, which puts a plan of seven artifacts behind seven replies.
- **The landing step is one transaction.** `pnpm run plan:land <change> <artifact|group>` in this store, in this order, stopping at the first refusal:

  1. Refuse a dirty working tree or a rebase in progress - a landing that carries somebody's uncommitted edit is not a landing
  2. Resolve the hand: `git config user.email` through the team map, refusing an e-mail the map does not name and a handle that is not the hand of the stage, naming whose word it waits on; `--as @handle` is taken only where it resolves to the same e-mail
  3. `git fetch origin main`, record that sha as `MAIN`, and rebase the change's branch on it
  4. Refuse when `behindOf` names anything before the artifact, and name it and its hand
  5. Run the gate - `validate:changes`, `check:manual`, `tcs:validate` - with `PLAN_NO_FETCH=1` so the gate reads the tree the step just built rather than fetching a second time
  6. One commit: `landed_by:` and the `rounds.md` row together
  7. Refuse while a held row is open and name the rows, unless `--with-recommendations` takes them in this commit; a `--reviewed` landing skips this
  8. `git push --force-with-lease=refs/heads/<branch>:<the sha the run read>` to the branch, then `main`: a plain fast-forward `push HEAD:main` from a terminal, or, where `.round/relay.json` names a wake, `POST /runs/<token>/land` with the sha, the kind and the artifact, and the relay moves `main` after its checks. In a wake the hand is the wake's sender, not `git config user.email`
  9. On a rejected push or a 409 from the relay, re-read `main` once and retry from 3; losing again, reply in the thread and stop; a 403 names the check the relay failed, and the run replies with it and stops

  `pnpm land` becomes this step when `land-on-main-through-the-gate` makes one gate for both repositories (`Q36`). The fold's refusal on a behind delta is `stage-changes-and-notify-hands`' (`Q37`).
- **`rounds.md` is a table.** `| Round | Artifact | Perspectives | Stood | Asked | Tests |`: the round number, the artifact id or the task group number, the perspective names run, the findings that stood as short phrases, the `Q<n>` ids raised, and per scenario id the test files that landed for a group. `read-change-documents.mts` reads it; `check:manual` gains rule `round`: a written artifact from `proposal` to `tasks` and a ticked group with no row, on a change created after the day the rule lands, is refused - the date sits in `ROUND_RECORD_SINCE` beside `DECISIONS_SINCE`. The archive copies the file across like the journeys.
- **A remark is a row before it is a change.** A reply that is not `Q<n>` and not `land` is a remark: the round appends a `rounds.md` row naming it, applies it as written, re-runs the perspectives whose `when` the edited lines summon, and, when the remark settles a choice a decisions row asked, writes it there too.
- **The first sentence opens the change.** A message in the planning channel mentioning the app with no change named runs `/plan` from nothing: `slugOf` from `tools/manual/src/editor/propose.ts` picks the id, `openspec new change` writes the record, `hands: pm:` is the asker's handle from the team map, the branch is pushed, and the reply names the id in the thread the message started, which `round:thread` records.
- **The tech design moves before the requirements, in the other change.** Moving `tech-design` above `specs` in the artifact list and setting its `requires` to `decisions` and `user-journeys` is `stage-changes-and-notify-hands`' task: it opens `schema.yaml` for the stage's derivation, and two changes editing one list in one week is a conflict for nothing. This change adds `perspectives:` and `upstream:` to the same file afterwards. What is ours: `planning-qa`'s requirements pass reads `tech-design.md` beside `ui-design.md`, and a requirement that reaches the design writes `awaiting: tech-design: "<date>, <requirement> re-read - @<tech>"`, cleared by the tech PIC's edit or a `reviewed:` line.
- **The build round runs in the application repository, reading the rules from here.** `grade10` carries its own thin `/build` and `/round` skills that name this store's rules and hold no copy of them: a session there runs `/add-dir` on a clone of this store and reads the `round` skill, the schema's `perspectives:` and the reader prompts under `.claude/agents/` from that clone. Never from `external/grade10-spec`, the submodule pinned to an older sha - a round read from a pin is a round held to last month's rules. `/build` runs the six steps against a task group: the tests the group's scenario ids name in their own commit first, then the code, then the group's readers from `apply.perspectives`, then the landing summary in the thread. `pnpm plan done` refuses a tick naming a scenario id no test in the tree its group's repository tag names cites, and accepts a task that names none; the round row lands in the store before the tick.
- **Flipping a case's automation status is a file edit.** `pnpm run tcs:automated <case…>` here edits the `**Automation status:**` line in place and pushes nothing - the walk's own commit carries it, which is what makes the flip and the suite one landing. In `grade10`, `pnpm plan automated` does the same over this store's checkout, as `pnpm plan done` does for a tick. `scripts/openspec/run-sheet.mjs` gains `--include-automated`, off by default. The suite runs on every push to `main`; its `smoke` cases on a staging deploy and a release cut belong to the release line's change (`Q35`).
- **The principles are a rulebook.** `docs/governance/system-design.md`: eight principles with one test each, and the reader's stance; `AGENTS.md` maps to it; the `tech` and `build` readers cite it.

## Service Interfaces

Not a service. The contracts that cross a boundary:

| Contract | Input | Output |
| --- | --- | --- |
| The round skill | A change id, an artifact id or a group number, the thread | The draft on `claude/<id>`, the thread's summary and questions, and on the hand's word one landing commit with `landed_by:`, the `rounds.md` row and, for a re-read, `reviewed:` |
| `perspectives:` per artifact, and `apply.perspectives` | `name`, `when`, `agent` | Read through `read-schema.mts` |
| `behindOf(entry, tree)`, `contentIdOf(texts)` | From `stage-changes-and-notify-hands` | The artifact ids behind and the content id every writer here imports |
| `pnpm run plan:land <change> <artifact\|group>` | The committer's e-mail and the change's record | One landing commit on `main`, or a refusal naming the artifact behind or the hand it waits on |
| A thread reply | `Q<n>: <answer>`, `Q<n>`, `land`, `land with recommendations`, or any other text | An answer written, the recommendation taken, the chain landed or the held rows named, the held rows taken and the chain landed, or a remark applied |
| `POST /slack/events`, `POST /wake` | The Slack app's events; `{ change, reason, base, head }` with the workflow's token | A wake queued on the thread's room |
| `POST /runs/<token>/{bind,post,land,done}` | `{ change }`, `{ text }`, `{ sha, kind, artifact }`, `{}` | The room bound; a reply in the thread; `main` moved or a 403 naming the check or a 409; the wake closed |
| `node scripts/openspec/relay-post.mjs` | `--message-file`, `--text`, `--bind`, `--done`, read with `.round/relay.json` | The call above from a wake, or the text printed from a terminal |
| `pnpm plan done` | A change id and a task id | Refused when the task names a scenario id no test in the group's tree cites; taken when the task names none |

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
- [The relay is down, or the Routine refuses a firing] → the terminal runs the same round against the same branch; the workflow's wake fails loudly and the push's own messages still went out; a burst of replies waits in the room rather than being dropped
- [A payload talks the run into landing] → the relay checks the word itself, against the Slack event it holds and the record at the sha, before `main` moves; the run's claim is not enough
- [A group lands by hand without a round] → the `round` rule refuses the tick, date-fenced to changes opened after it, and the fix is one row saying what happened
- [The requirements move after the tech design and nothing notices] → the requirements pass writes the dated wait on the tech PIC; a wait holds no stage
- [The perspectives table grows into a checklist] → a perspective is a reader with a `when`; a reader with no `when` a draft can summon is deleted

## Migration Plan

1. `docs/governance/system-design.md`, the `round` skill, the agent definitions, `perspectives:` and `upstream:` in the schema on top of the artifact order `stage-changes-and-notify-hands` moved; `/plan`, `/design`, `/tech`, `/specify`, `/tasks` and `/build` standing beside the planning skills and calling the round from a terminal. Nothing changes for a change already in flight.
2. `reviewed:`, `rounds.md`, the `round` rule fenced to the day after it lands, `pnpm run plan:land`, `run-sheet.mjs`'s filter, `tcs:automated`, `pnpm plan done`'s refusal in `grade10`.
3. The relay deployed and the Routine created; the `reread` job's wake behind `AGENT_REREAD`; `round:thread`; the first sentence opening a change. Rollback is the variable and the Slack app's event subscription.
4. The suite's smoke cases on a staging deploy and a release cut, with the release line's change (`Q35`).

## Open Questions

- How many API firings an hour the Routine takes before it refuses one; the first walk measures it.
- Whether a remark that settles nothing a row asked is also worth a decisions row; the round row holds it until somebody says so.
