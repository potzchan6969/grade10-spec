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
| 6 Land | The agent | On your word: the artifact lands on `main`, the stage moves, the next hand is told, and what comes after it is read again |

- 🚧 **Your word lands it** — nothing reaches `main` without a person's word,
  and the change records whose
- 🚧 **A question, not a guess** — what is a preference or a product decision
  is asked, never chosen: a numbered row in the change's decisions with the
  agent's recommendation, or a ❓ line on the page; an open question holds
  nothing
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
| Answer | `Q4: the second` | The row is written in and the question closes |
| Remark | `The empty state is a link, not a button` | Applied as written; only the perspectives it touches read again |
| Land | `land` | The artifact lands on `main`, with your handle on it |
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
- ❓ **Only the hand lands** — another teammate's land is refused and names
  whose word it waits on; the product manager confirms

## Perspectives

Who reads a draft before you do. A perspective is a reader, not a checklist.

| Artifact | Perspectives |
| --- | --- |
| The page's marks, the proposal, the decisions, the journeys | Product; the reader of the product; design; backend; integration; QA; operations |
| `ui-design.md` | The journeys, walked; the design system's inventory and Figma parity; the copy, in the reader's words |
| `tech-design.md` | Deterministic, resilient, observable; simple and clear; consistent, modular, built on later; testable and buildable |
| `spec.md`, `feature-tcs.md` | The two blind readings, then the reconciliation |
| `tasks.md` | Order and dependencies; tests first; the end-to-end group; migration and flag; size |
| A task group | Missing pieces; simplicity; code smell; the repository's conventions |

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
- 🚧 **Read again, in order** — a landing wakes the change's agent, which
  reads every artifact after it: where the change reaches one, a round opens
  for that artifact's hand; where it does not, the record says it was read,
  and the thread says what was read
- 🚧 **Nothing is built on a behind artifact** — an artifact lands only when
  everything before it is fresh, and the fold at archive refuses a behind
  delta; a tick, a claim and a wait are never held
- 🚧 **Goals that moved are a question** — a re-read that finds a goal or a
  non-goal moved asks the product manager whether the change is extended,
  superseded or split, and lands nothing until they answer
- 🚧 **A waived artifact is fresh** — a waiver says nothing is owed, so
  nothing after it waits
- ❓ **Extend, supersede, split** — extend reads everything after the proposal again, supersede opens a new
  change and withdraws this one, split opens a new change for the moved part; the product manager confirms

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
  by hand, and who landed it; the rounds run on the change, one row each
- 🚧 **My turn** — the open questions addressed to the reader, above the
  changes on them
- 🚧 **The record** — one row per round in the change: the artifact or group,
  the perspectives run, what stood, what was asked, and the tests each
  scenario landed with; archived with the change
- ❓ **The runner** — which agent holds a change's thread, which wakes on a
  landing, and what the Slack workspace needs for them; Operations confirms
  against [the runner](/references/agent-runner)

:::detail{title="Product decisions" for="pm"}
The owner's brief asks that the product manager start with what is wanted and
agents refine the rest, that the tech PIC and the designer review what agents
propose, and that every step passes through layers of checks. The brief is
[the blueprint](/references/delivery-workflow-blueprint).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Who drafts | Decided | The change's agent drafts every artifact from the proposal to the code; a person answers, remarks and lands. | Product, Engineering |
| Challenge and verify | Decided | Every draft is read by named perspectives and each finding verified before a person sees it; the blind readings are their own challenge and reconciliation. | Product, QA, Engineering |
| Questions | Decided | Numbered rows in the change's decisions, or ❓ lines on the page, with a recommendation; an open question never holds a stage. | Product |
| Read again | Decided | A landing reads every artifact after it, in order; behind holds only a landing and the fold, never a tick. | Product, Engineering |
| Round size | Decided | The simpler-thing reader always, the others when the draft touches what they read for; no waiver. | Engineering |
| The record | Decided | One row per round in the change, archived with it; a landing or a tick without its row is refused on a change opened after the rule. | Engineering |
| The walk | Decided | The last group demonstrates the journeys end to end and leaves the suite that guards every deploy and cut. | QA, Engineering |
| Runner | ❓ Open | Which agent holds the thread and which wakes on a landing, and what the workspace needs for them. | Operations |
:::
