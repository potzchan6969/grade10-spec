---
title: Change Stages
order: 1
---

Where a change stands, who is on it, and how they are told. Every line here is
read from the change's files on `main`, never set by hand —
[How we plan](/guides/how-we-plan).

## Stages

A change is in exactly one stage, proven by a file on `main`.

| # | Stage | Proven by | Hand |
| --- | --- | --- | --- |
| 1 | Proposed | `proposal.md` alone | Product manager |
| 2 | Decided | `decisions.md`, `user-journeys.md`, one marked line per outcome on the page, `hands:` | Product manager |
| 3 | Designed | `ui-design.md` or `ui_waived`; `tech-design.md` or `design_waived` | Designer, tech PIC |
| 4 | Specified | `spec.md` with requirements; `feature-tcs.md`; every Raised row landed | QA run |
| 5 | Planned | `tasks.md`; `promoted_by`; `plan_approved` | Engineer |
| 6 | Building | Boxes ticking | Engineers |
| 7 | On staging | Every box ticked; `deployed_env: staging` | QA |
| 8 | Released | `released_in: <tag>` | Release hand |
| 9 | Archived | The directory under `archive/`; the fold; the marks off | — |

- 🚧 **One stage per change** — the board, the change page, a page's in-flight
  ribbon and My turn all show the same one
- 🚧 **Read, never set** — a stage moves when a file lands on `main`, and
  nothing else moves it
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
| Designer | `design` | Decided |
| Tech PIC | `tech` | Decided |
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
| A change enters a stage | That stage's hand, by direct message | The change, the stage, the command to paste |
| A push lands on `main` | The channel | Each change the push moved, and its stage |
| A wait is written | The hand that owes the artifact | The line, and its date |
| A dependency releases | The blocked change's hand | The change that is now free |
| Monday morning | Each person, by direct message | On you now; idle; waiting |

- 🚧 **Once per move** — a move told twice, or a message per commit, never
  happens
- **The channel post per push** — runs today, listing the changes a push
  touched

## Surfaces

- 🚧 **Board** — nine lanes, one per stage, stacked as In Flight stacks four
  today; each card the hand, the age, the overlays and the task bar; Mine,
  Waiting, Idle and Blocked filters; a stale shelf for a change idle 30 days
- 🚧 **Change page** — the stage as a stepper; a Your turn card with the
  command; the hands; each artifact with whether it is behind one upstream of
  it; tasks by group; where the code is: `main`, staging, a release
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
| Stage | Decided | Derived from the files on `main`, one of nine; never a status key somebody sets. | Product |
| Hands | Decided | Recorded in the change's manifest, one handle per role; the only stored fact. | Product |
| Messages | Decided | One direct message per move to the hand it reaches, the channel post per push kept, a weekly digest; never one per commit. | Product |
| Suite review | Decided | An overlay beside the stage, so planning never waits on QA's verdict. | Product, QA |
| Measure | Decided | Days between a stage landing and the next hand's first commit, shown on the change page. | Product |
| Team map | ❓ Open | Where the handle-to-Slack map lives. | Operations |
| Approval record | ❓ Open | What records a person's approval of the implementation summary. | Engineering |
| Tech design order | ❓ Open | Whether the tech design is written before the requirements, as the brief orders the phases. | Product, tech PIC |
| Hosted actions | ❓ Open | Whether the hosted manual can take an action without a sign-in. | Operations |
:::
