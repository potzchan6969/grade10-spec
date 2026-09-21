---
title: Agent Rounds
spec: shared/planning/agent-rounds
order: 2
---

How every artifact of a change is written: you say what is wanted, the
change's agent drafts it and has the draft challenged, you answer what only
you can, and your word lands it. Where a change stands is
[Change Stages](change-stages); the artifacts themselves are
[How we plan](/guides/how-we-plan).

## The Round

One round per artifact, and one per task group while the change is building.

| Step | Who | What happens |
| --- | --- | --- |
| 1 Ask | You | Say what is wanted, where you are: the change's thread, a terminal, or an edit you push yourself |
| 2 Draft | The agent | Writes the artifact on the change's branch from what is before it and what you asked |
| 3 Challenge | Agents, one per perspective | Each reads the draft as one reader would and says what is wrong, missing or simpler |
| 4 Verify | Agents, one per group of findings | Argues whether each finding stands; what stands changes the draft |
| 5 Read | You | Read the summary and the questions in the thread; answer, remark, or say land |
| 6 Land | The agent | On your word: every drafted artifact of your hand lands on `main` in order, the stage moves, the next hand is told, and what comes after it is read again |

- 🚧 **Your word lands it** — nothing reaches `main` without your word, and
  whose is recorded
- 🚧 **A question, not a guess** — what moves scope, is costly to undo, needs a
  fact only you have, or divides the options by more than a task group of work
  is asked, never chosen: a numbered row in the change's decisions with the
  agent's recommendation, or a `❓` line on the page; every other preference the
  round decides on the best option, says so, and one reply from you overturns
  it
- 🚧 **One sentence plans the change** — the first message drafts every artifact
  of the chain, each from the one before it and each read by its perspectives,
  and lands nothing; you read the held questions, not seven documents
- 🚧 **A finding goes where it belongs** — a product detail to the page, a scope
  fact to the decisions, a state to the design, a mechanism to the tech design,
  before the draft that depends on it
- 🚧 **Sized by what it touches** — the simpler-thing reader runs on every
  round; a perspective joins only when the draft touches what it reads for; one
  reader verifies itself
- 🚧 **The blind readings are their own challenge** — the requirements and the
  cases are two readings of the same journeys, reconciled after both are
  written; what they cannot settle stops on the product manager

## Your Moves

| Move | You say | What happens |
| --- | --- | --- |
| Answer | `Q4: the second` · `Q4` takes the recommendation | The row is written in and the question closes |
| Remark | `The empty state is a link, not a button` | Applied as written; only the perspectives it touches read again |
| Land | `land`, or `land with recommendations` | Every drafted artifact of your hand lands on `main` in order, with your handle on it; while a held question is open, `land` lands nothing and names it, and `land with recommendations` takes the recommendations and goes on |
| Edit | An edit you push yourself, from a terminal or from GitHub | The same round: the push is your word for the lines it touched |

- 🚧 **The first sentence opens the change** — a product manager's message to
  the app in the planning channel names the change, records them as its hand,
  and is answered in the thread it started
- 🚧 **A sentence that overlaps a change in flight** — the run answers in that
  change's thread, and the change's stage decides whether it is extended, held
  for its product manager, or depended on by a new change
- 🚧 **Every later hand answers in the thread** — the message that says it is
  your turn points at it; you reply there
- 🚧 **The frames come from you** — a designer's ask carries the frame links; a
  draft that needs a frame nobody drew writes a dated wait on the designer,
  never a screen in prose
- 🚧 **Told once** — a draft ready for you is one reply, a landing one reply
- 🚧 **The button says it for you** — a summary waiting on your word carries
  `Confirm <artifact>`; a press is that word, said by whoever pressed, and the
  thread reads who pressed; a member the team map does not name lands nothing
- 🚧 **Only the hand lands** — another teammate's land is refused and names
  whose word it waits on, and the relay checks the word again before `main`
  moves

## Perspectives

Who reads a draft before you do: one row of the planning schema per artifact.

- 🚧 **The simpler thing, always** — one reader on every round argues for the
  simpler shape, and is the floor when a round has one reader
- 🚧 **Every reader is conscientious** — a wrong thing already there is named
  and its structure fixed, never patched around; one fix per kind of problem
- 🚧 **Eight principles** — determinism, simplicity, clarity, flexibility,
  modularity, consistency, resilience, observability: one governance page the
  readers cite

## Read Again

An artifact is drawn from what is before it, the page's marks first.

| Before | After |
| --- | --- |
| The page's marked and open lines the change links | Everything below |
| `proposal.md`, `decisions.md`, `user-journeys.md` | The designs, the requirements, the cases, the plan, the code |
| `ui-design.md`, `tech-design.md` | The requirements, the cases, the plan, the code |
| `spec.md`, `feature-tcs.md` | The plan, the code |
| `tasks.md` | The code and its end-to-end tests |

- 🚧 **Behind** — an artifact is behind when what is before it changed after
  the artifact was drawn or last read again; read from the content, never set
- 🚧 **Read again, ahead** — a landing wakes the change's agent, which reads
  every artifact after it in order and redraws each one the landing reached, on
  the branch, for its hand's word; where nothing reached one, the record and
  the thread say it was read
- 🚧 **Nothing is built on a behind artifact** — an artifact lands only when
  everything before it is fresh, the fold refuses a behind delta, and a tick, a
  claim and a wait are never held
- 🚧 **Goals that moved are a question** — a re-read that finds a goal or a
  non-goal moved asks the product manager to extend, supersede or split, and
  lands nothing until they answer
- 🚧 **A waived artifact is fresh** — nothing is owed, so nothing after it waits
- 🚧 **Extend, supersede, split** — extend reads everything after the proposal
  again; supersede opens a new change and withdraws this one; split opens one
  for the moved part

## The Walk

- 🚧 **Each group lands checked** — tests from the cases first, then the code,
  read by the group's perspectives and verified before the engineer reads the
  landing summary
- 🚧 **The last group is the walk** — the journeys walked end to end through
  each actor's interface, kept as the suite that runs on every push to `main`,
  its smoke cases on every deploy and cut
- 🚧 **The run sheet keeps what only staging proves** — a case the walk
  automates is marked so, and the run sheet leaves it out
- 🚧 **One pass over the whole** — after the last group, one reader argues the
  simpler shape for the whole change before it goes to staging

## Surfaces

- 🚧 **The thread** — one per change in the planning channel, opened by the
  first message; the summaries, the numbered questions, each landing and each
  re-read are replies, and the message that says it is your turn points at it
- 🚧 **Change page** — the open questions by hand, the rounds one row each, the
  automated count against the suite, the thread as `main` records it, and what
  the hands are told now
- 🚧 **My turn** — your open questions, above the changes on you
- 🚧 **The record** — one row per round: the artifact or group, the readers,
  what stood, what was asked, the tests per scenario; archived with the change
- 🚧 **The runner** — a custom Slack app in front of the relay, one queue per
  thread, and a hosted run that is a fresh session every time; a run posts and
  lands through the relay, and one that does not finish is said so in the
  thread with its link; what Operations sets up is [the
  runner](/references/agent-runner)

:::detail{title="Product decisions" for="pm"}
The owner's brief asks that the product manager start with what is wanted and
agents refine the rest, that the tech PIC and the designer review what agents
propose, and that every step passes through layers of checks. The brief is
[the blueprint](/references/delivery-workflow-blueprint).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Who drafts | Decided | The change's agent drafts every artifact from the proposal to the code; a person answers, remarks and lands. | Product, Engineering |
| Challenge and verify | Decided | Every draft is read by named perspectives and each finding verified before a person sees it; the blind readings are their own challenge and reconciliation. | Product, QA, Engineering |
| Questions | Decided | Numbered rows in the change's decisions, or `❓` lines on the page, with a recommendation; a question the round decides holds nothing, and a held question holds the landing until it is answered or waved through. | Product |
| Read again | Decided | A landing reads every artifact after it, in order; behind holds only a landing and the fold, never a tick. | Product, Engineering |
| Round size | Decided | The simpler-thing reader on every round; a reader whose subject the artifact is - the tech PIC's readings on the tech design, QA and the build's readings on the plan and a task group - on every round of it; the others when the draft touches what they read for; no waiver. | Engineering |
| The record | Decided | One row per round in the change, archived with it; a landing or a tick without its row is refused from the change's first landing on, and on every change once the old skills go. | Engineering |
| The walk | Decided | The last group demonstrates the journeys end to end and leaves the suite that guards every deploy and cut. | QA, Engineering |
| Runner | Decided | A custom Slack app, the relay in this repository and a hosted Routine; the relay checks the word before `main` moves and says when a run did not finish. | Operations, Engineering |
| A run-sheet failure | ❓ Open | Whether a failed row on the run sheet reaches the change's thread on its own, or QA writes the sentence there; today it is QA's sentence, read as a remark. Recommended: QA's sentence in the thread, naming the case id, and the sheet left as the record of the walk. | QA, Product |
:::
