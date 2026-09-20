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

- 🚧 **Your word lands it** — nothing reaches `main` without a person's word,
  and the change records whose
- 🚧 **A question, not a guess** — what moves scope, is costly to undo, needs a
  fact only you have, or divides the options by more than a task group of work
  is asked, never chosen: a numbered row in the change's decisions with the
  agent's recommendation, or a `❓` line on the page. Every other preference the
  round decides on the best option and records as decided by the round, and
  one reply from you overturns it
- 🚧 **One sentence plans the change** — the first message drafts the proposal,
  the decisions, the journeys, the design where a surface moves, the tech
  design, the requirements and the cases, and the plan, each from the one
  before it and each read by its perspectives, and lands nothing; you read the
  held questions, not seven documents
- 🚧 **A finding goes where it belongs** — a product detail to the page, a
  scope fact to the decisions, a state to the design, a mechanism to the tech
  design, before the draft that depends on it
- 🚧 **Sized by what it touches** — the simpler-thing reader runs on every
  round; a perspective joins only when the draft touches what it reads for;
  a round of one reader verifies itself
- 🚧 **The blind readings are their own challenge** — the requirements and
  the cases are two readings of the same journeys, reconciled after both are
  written; what they cannot settle stops on the product manager, and no agent
  decides it

## Your Moves

Three things you say in the thread, and one you can do anywhere.

| Move | You say | What happens |
| --- | --- | --- |
| Answer | `Q4: the second` · `Q4` takes the recommendation | The row is written in and the question closes |
| Remark | `The empty state is a link, not a button` | Applied as written; only the perspectives it touches read again |
| Land | `land`, or `land with recommendations` | Every drafted artifact of your hand lands on `main` in order, with your handle on it; while a held question is open, `land` lands nothing and names it, and `land with recommendations` takes the recommendations and goes on |
| Edit | An edit you push yourself, from a terminal or from GitHub | The same round: the push is your word for the lines it touched |

- 🚧 **The first sentence opens the change** — a product manager's message to
  the app in the planning channel names the change, records them as its hand,
  and is answered in the thread it started
- 🚧 **Every later hand answers in the thread** — the message that says it is
  your turn points at it; you reply there
- 🚧 **The frames come from you** — a designer's ask carries the frame links;
  a draft that needs a frame nobody has drawn writes a dated wait on the
  designer, never a screen in prose
- 🚧 **Told once** — a draft ready for you is one reply, a landing one reply
- 🚧 **Only the hand lands** — another teammate's land is refused and names
  whose word it waits on, and the relay checks the same word a second time
  before `main` moves

## Perspectives

Who reads a draft before you do. A perspective is a reader, not a checklist.
The readers each artifact may summon are one row of the planning schema,
beside the artifact's hand, and the capability's requirements table them.

- 🚧 **The simpler thing, always** — one reader on every round argues for the
  simpler shape, and is the floor when a round has one reader
- 🚧 **Every reader is conscientious** — a wrong thing already there is named
  and its structure fixed, never patched around; one fix per kind of problem
- 🚧 **Eight principles** — determinism, simplicity, clarity, flexibility,
  modularity, consistency, resilience, observability, one governance page the
  tech design's and the build's readers cite

## Read Again

An artifact is drawn from what is before it, the page's marked lines before
them all.

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
  every artifact after it in order and redraws each one the landing reached
  from the redrawn one before it, on the branch, for its hand's word; where
  nothing reached one, the record says it was read, and the thread says what
  was read
- 🚧 **Nothing is built on a behind artifact** — an artifact lands only when
  everything before it is fresh, and the fold at archive refuses a behind
  delta; a tick, a claim and a wait are never held
- 🚧 **Goals that moved are a question** — a re-read that finds a goal or a
  non-goal moved asks the product manager whether the change is extended,
  superseded or split, and lands nothing until they answer
- 🚧 **A sentence that overlaps a change in flight** — the run answers in that
  change's thread and its stage decides: an unbuilt change of the same product
  manager is extended, one further along asks its product manager to extend,
  split or supersede, and a released one gets a new change that depends on it
- 🚧 **A waived artifact is fresh** — a waiver says nothing is owed, so
  nothing after it waits
- 🚧 **Extend, supersede, split** — extend reads everything after the proposal
  again, supersede opens a new change and withdraws this one, split opens a
  new change for the moved part

## The Walk

Building ends by showing the change works, end to end.

- 🚧 **Each group lands checked** — tests from the cases first, then the code,
  read by the group's perspectives and verified before the engineer reads the
  landing summary
- 🚧 **The last group is the walk** — the journeys walked end to end through
  the interface each actor uses, kept as the end-to-end suite: it runs on
  every push to `main`, its smoke cases on every staging deploy and every cut
- 🚧 **The run sheet keeps what only staging proves** — a case the walk
  automates is marked so, and the run sheet leaves it out
- 🚧 **One pass over the whole** — after the last group, one reader argues the
  simpler shape for the whole change before it goes to staging

## Surfaces

- 🚧 **The thread** — one per change in the planning channel, opened by the
  first message; the draft's summary, the numbered questions, each landing
  and each re-read are replies, and the direct message that says it is your
  turn points at it
- 🚧 **Change page** — each artifact with fresh or behind, its open questions
  by hand, and who landed it; the rounds run on the change, one row each; the
  Delivery row's automated count against the suite's total
- 🚧 **My turn** — the open questions addressed to the reader, above the
  changes on them
- 🚧 **The record** — one row per round: the artifact or group, the readers,
  what stood, what was asked, the tests per scenario; archived with the change
- 🚧 **The runner** — a custom Slack app in front of the relay, one queue per
  thread, and a hosted run that is a fresh session every time, reading the
  files and the thread; a run posts and lands through the relay, and a run
  that does not finish is said so in the thread with its link; what
  Operations sets up is [the runner](/references/agent-runner)

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
| The record | Decided | One row per round in the change, archived with it; a landing or a tick without its row is refused on a change opened after the rule. | Engineering |
| The walk | Decided | The last group demonstrates the journeys end to end and leaves the suite that guards every deploy and cut. | QA, Engineering |
| Runner | Decided | A custom Slack app, the relay in this repository and a hosted Routine; the relay checks the word before `main` moves and says when a run did not finish. | Operations, Engineering |
:::
