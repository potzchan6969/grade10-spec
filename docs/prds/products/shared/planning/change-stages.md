---
title: Change Stages
order: 1
---

Where a change stands, who is on it, and how they are told. Every line here is
read from the change's files on `main`, never set by hand —
[How we plan](/guides/how-we-plan).

## Stages

A change is in exactly one stage, proven by a file on `main`.

| # | Stage | Proven by | Written by |
| --- | --- | --- | --- |
| 1 | Proposed | `proposal.md`; then `decisions.md`, `user-journeys.md`, one marked line per outcome on the page and `hands:`, with ❓ on what is still open | Product manager, grilled by an agent |
| 2 | Designed | `ui-design.md` or `ui_waived`; `tech-design.md` or `design_waived` | Designer and tech PIC, with an agent |
| 3 | Specified | `spec.md` with requirements; `feature-tcs.md`; every Raised row landed | An agent; QA reads the cases |
| 4 | Planned | `tasks.md`; `promoted_by`; `plan_approved` | An agent; the engineer approves the summary |
| 5 | Building | Boxes ticking | Agents, test first; the engineer reads each landing |
| 6 | On staging | Every box ticked; `deployed_env: staging` | The deploy; QA walks the run sheet |
| 7 | Released | `released_in: <tag>` | Release hand |
| 8 | Archived | The directory under `archive/`; the fold; the marks off | Whoever archives |

- 🚧 **One stage per change** — the board, the change page, a page's in-flight
  ribbon and My turn all show the same one
- 🚧 **Read, never set** — a stage moves when a file lands on `main`, and
  nothing else moves it
- 🚧 **One stage for what is wanted** — the proposal, the decisions and the
  journeys sit in Proposed together, because the product manager writes the
  three in one sitting; an item still open stays ❓ on the decisions or the
  page and holds nothing
- 🚧 **Agent-driven** — Specified, Planned and Building are written by an
  agent from what is upstream and read by a person before they land: QA the
  cases, the engineer the plan's summary and each landing; every surface
  marks the three, so a reader tells a person's step from an agent's
- **Four lanes today** — proposed, specified, in progress and complete, read
  the same way — [In Flight](/in-flight)

## Overlays

A fact beside the stage, never a stage of its own.

| Overlay | Read from | Shown as |
| --- | --- | --- |
| Waiting | `awaiting:`, one line per artifact, dated | An amber chip with the line |
| Blocked | `depends_on:` naming a change not yet released | A grey chip naming it |
| Idle | 7 days without a tick, a claim or an artifact landing; stale at 30 | A red chip with the day count |
| Suite | `feature-tcs.md` status, `draft` or `approved` | A chip beside the stage |
| Flag | `flag:` on the tasks heading | A blue chip with the flag's name |
| Hotfix | A `hotfix/<tag>` branch naming the change | A chip with the tag |

- **Waiting and blocked** — read today from the same two keys —
  [Pending](/pending)
- 🚧 **Idle** — counted from the last tick, claim or artifact landing, so a
  repository-wide commit moves nobody's count
- 🚧 **Suite, flag and hotfix** — shown beside the stage and never holding
  the ladder

## Hands

One handle per role on each change.

| Role | Key | Takes the change at |
| --- | --- | --- |
| Product manager | `pm` | Proposed |
| Designer | `design` | Proposed, once the decisions and the journeys are on `main` |
| Tech PIC | `tech` | Proposed, once the decisions and the journeys are on `main` |
| QA | `qa` | Designed, and On staging |
| Engineer | `dev` | Specified |
| Release hand | `release` | On staging |

- 🚧 **Recorded in git** — `hands:` in the change's `.openspec.yaml`, written
  by the product manager at the interview's end, by Assign on the locally run
  manual, or by `pnpm plan hand` from the application repository
- 🚧 **Unnamed hand** — the role's channel is told instead, and the card says
  the hand is open
- ❓ **Team map** — where the handle-to-Slack map lives: `docs/prds/team.yaml`
  in the store, or a lookup by e-mail through the Slack app; Operations
  confirms

## Messages

Slack tells one person, once per move.

| When | Who is told | Carries |
| --- | --- | --- |
| A change reaches a hand: a stage lands, or the decisions and the journeys complete Proposed | That hand, by direct message | The change, the stage, the command to paste |
| A push lands on `main` | The channel | Each change the push moved, and its stage |
| A wait is written | The hand that owes the artifact | The line, and its date |
| A dependency releases | The blocked change's hand | The change that is now free |
| Monday morning | Each person, by direct message | On you now; idle; waiting |

- 🚧 **Once per move** — a move is the hand changing; a move told twice, or a
  message per commit, never happens
- **The channel post per push** — runs today, listing the changes a push
  touched

## Surfaces

- 🚧 **Board** — eight lanes, one per stage, stacked as In Flight stacks four
  today; the three agent-driven lanes say so in their heading, with who reads
  them; each card the hand, the age, the overlays and the task bar; Mine,
  Waiting, Idle and Blocked filters; a stale shelf for a change idle 30 days
- 🚧 **Change page** — the stage as a stepper, the agent-driven three
  bracketed under it; a Your turn card with the command; the hands; each
  artifact with whether it is behind one upstream of it; tasks by group; where
  the code is: `main`, staging, a release
- 🚧 **My turn** — the changes whose current stage names the reader, then the
  ones that are theirs later; the handle is chosen once per browser
- 🚧 **A page's marked line** — a line a page marks as being built wears the
  pip of its change's stage
- ❓ **Actions on the hosted manual** — Assign and approve stay on the locally
  run manual until the hosted site has a sign-in; Operations confirms

:::detail{title="Product decisions" for="pm"}
A change passes through five hands and nobody is told when it reaches theirs;
the board shows four lanes, so a change waiting on a designer sits in the same
lane as one waiting on a deploy. The owner's brief is
[the blueprint](/references/delivery-workflow-blueprint).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Stage | Decided | Derived from the files on `main`, one of eight; never a status key somebody sets. | Product |
| Proposed and Decided | Decided | One stage: the product manager writes the proposal, the decisions and the journeys in one sitting, and an open item stays ❓ instead of holding a gate. | Product |
| Agent-driven stages | Decided | Specified, Planned and Building are an agent's to write and a person's to read: QA the cases, the engineer the summary and each landing. Every surface marks the three. | Product, Engineering |
| Hands | Decided | Recorded in the change's manifest, one handle per role; the only stored fact. | Product |
| Messages | Decided | One direct message per move to the hand it reaches, the channel post per push kept, a weekly digest; never one per commit. | Product |
| Suite review | Decided | An overlay beside the stage, so planning never waits on QA's verdict. | Product, QA |
| Measure | Decided | Days between a stage landing and the next hand's first commit, shown on the change page. | Product |
| Team map | ❓ Open | Where the handle-to-Slack map lives. | Operations |
| Approval record | ❓ Open | What records a person's approval of the implementation summary. | Engineering |
| Tech design order | ❓ Open | Whether the tech design is written before the requirements, as the brief orders the phases. | Product, tech PIC |
| Hosted actions | ❓ Open | Whether the hosted manual can take an action without a sign-in. | Operations |
:::
