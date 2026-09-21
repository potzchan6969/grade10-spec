---
title: Change Stages
spec: shared/planning/change-stages
order: 1
---

Where a change stands, who is on it, and how they are told. Every line here is
read from the change's files on `main`, never set by hand —
[How we plan](/guides/how-we-plan). How each artifact gets written is
[Agent Rounds](agent-rounds).

## Stages

A change is in exactly one stage, proven by a file on `main`. From Proposed to
Building the change's agent drafts, and a person's word lands.

| # | Stage | Proven by | The agent | You |
| --- | --- | --- | --- | --- |
| 1 | Proposed | `proposal.md`; then `decisions.md`, `user-journeys.md`, one marked line per outcome on the page and `hands:`, with `❓` on what is still open | Drafts the marks and the three files from what you ask; asks what is a preference or a product decision | Product manager: say what is wanted, answer |
| 2 | Designed | `ui-design.md` or `ui_waived`; `tech-design.md` or `design_waived` | Proposes each design from the page and the journeys, challenged and verified | Designer: tweak. Tech PIC: challenge |
| 3 | Specified | `spec.md` with requirements; `feature-tcs.md`; every Raised row landed | Two blind readings of the journeys, reconciled | Product manager: read the requirements and the cases together |
| 4 | Planned | `tasks.md`; `promoted_by` | Writes the plan, challenged for order, tests first and size | Engineer: read the summary |
| 5 | Building | Boxes ticking | Builds each group test first, audited and verified | Engineer: read each landing |
| 6 | On staging | Every box ticked; `deployed_env: staging` | The deploy; the run sheet | QA: walk it |
| 7 | Released | `released_in: <tag>` | The cut | Release hand: cut |
| 8 | Archived | The directory under `archive/`; the fold; the marks off | The fold | Whoever archives |

- 🚧 **One stage per change** — the board, the change page, a page's in-flight
  ribbon and My turn all show the same one
- 🚧 **One stage for what is wanted** — the product manager settles the proposal,
  the decisions and the journeys in one sitting; an item still open holds nothing
- 🚧 **Drafted, then landed on your word** — every stage from Proposed to
  Building is written by the change's agent and reaches `main` only when the
  hand of that stage says so; the landing records who said it, and every
  surface marks the five with the hand's move beside the agent's
- 🚧 **The tech design before the requirements** — `tech-design.md` is drawn
  from the page, the decisions and the journeys, beside `ui-design.md`; the
  requirements read both, and a requirement that reaches the design is a
  dated wait on the tech PIC, never a hold on the stage
- **Four lanes today** — proposed, specified, in progress and complete, read
  the same way — [In Flight](/in-flight)

## Overlays

A fact beside the stage, never a stage of its own. The set is five, and closed.

| Overlay | Read from | Shown as |
| --- | --- | --- |
| Waiting | `awaiting:`, one line per artifact, dated | An amber chip with the line |
| Blocked | `depends_on:` naming a change not yet released | A grey chip naming it |
| Idle | 7 days without a tick, a claim or an artifact landing; shelved at 30 | A red chip with the day count |
| Behind | An artifact whose page lines or artifacts before it changed after it was drawn or last read again | A chip naming the earliest behind artifact and its hand |
| Suite | `feature-tcs.md` status, `draft` or `approved` | A chip beside the stage |

- **Waiting and blocked** — read today from the same two keys —
  [Pending](/pending)
- 🚧 **Idle** — counted from the last tick, claim or artifact landing, so a
  repository-wide commit moves nobody's count
- 🚧 **Behind** — shown, told once, and listed in the digest after 7 days
  counted from the day it went behind; it holds a tick, a claim and a wait never, and the fold at archive always —
  what clears it is [Agent Rounds · Read Again](agent-rounds#read-again)
- 🚧 **Suite** — shown beside the stage and never holding the ladder
- **Flag and hotfix** — the release line carries both: a flag on a change and a
  hotfix branch are read where releases are cut, not here
- 🚧 **Day bounds** — whole calendar days on the Hong Kong date, the chip from
  the seventh and the shelf from the thirtieth

## Hands

One handle per role on each change.

| Role | Key | Takes the change at |
| --- | --- | --- |
| Product manager | `pm` | Proposed, and Specified |
| Designer | `design` | Proposed, once the decisions and the journeys are on `main` |
| Tech PIC | `tech` | Proposed, once the decisions and the journeys are on `main` |
| QA | `qa` | On staging; the suite's review, any time, as an overlay |
| Engineer | `dev` | Planned and Building |
| Release hand | `release` | On staging |

- 🚧 **Recorded in git** — `hands:` in the change's `.openspec.yaml`, written
  by the product manager at the interview's end, by Assign on the locally run
  manual, or by `pnpm plan hand` from the application repository
- 🚧 **Standing in** — a handle may be named for a role the team map does not
  list it under; Assign offers every handle, the role's own first
- 🚧 **Unnamed hand** — the role's channel is told instead, and the card says
  the hand is open
- 🚧 **Who landed it** — each artifact records the hand whose word landed it,
  and the change page shows the handle beside the artifact
- 🚧 **Team map** — `docs/prds/team.yaml` in the store: one entry per handle
  with its e-mail, its Slack member and the roles it takes, and one channel per
  role
- 🚧 **A handle's Slack member** — written into the map beside the e-mail; a
  handle with no member is sent nothing

## Messages

Slack tells one person, once per move, in the change's thread.

| When | Who is told | Carries |
| --- | --- | --- |
| A change reaches a hand: a stage lands, the decisions and the journeys complete Proposed, or a hand is taken off | That hand, by direct message; the role's channel when the change names nobody for it | The change, the stage, the thread to answer in, the command to paste |
| A change reaches staging | Its QA hand, by direct message; the release hand by the message above | The change, and the run sheet to walk |
| An artifact is behind | The hand of the earliest behind artifact | The artifact, and what changed before it |
| 🚧 An artifact lands from a terminal | The change's thread | What landed, whose word landed it, the stage now, and whose turn it is |
| A push lands on `main` | The channel | Each change the push moved, and its stage |
| Monday morning | Each person with a line to read, by direct message | On you now; open questions; idle; behind for 7 days; waiting; freed by a dependency |

- 🚧 **Once per move** — a move is the hand changing; a move told twice, or a
  message per commit, never happens
- 🚧 **One thread per change** — every direct message links the change's
  thread, and the change page until the round opens one; a reply in the
  thread is how a hand answers
- **The channel post per push** — runs today, listing the changes a push touched
- 🚧 **Two fewer messages** — a written wait and a freed dependency are digest
  lines, not messages of their own
- 🚧 **The build QA walks** — the staging message and the change page name
  the tagged build the deploy recorded

## Surfaces

- 🚧 **Board** — eight lanes, one per stage, stacked as In Flight stacks four
  today; the five drafted lanes wear the agent mark and the hand's move in
  their heading; each card the hand, the age, the overlays and the task bar;
  Mine, Waiting, Idle, Behind and Blocked filters; a shelf for a change idle
  30 days
- 🚧 **Change page** — the stage as a stepper, the agent mark and the hand's
  move under each drafted step; a Your turn card with the thread and the
  command; the hands; each artifact with fresh or behind, its open questions
  and who landed it; the marked lines it delivers, by page and section; tasks
  by group; where the code is: `main`, staging, a release
- 🚧 **[My turn](/my-turn)** — the open questions addressed to the reader, then the
  changes whose current stage names them, then the ones that are theirs
  later; the handle is chosen once per browser
- 🚧 **A section's in-flight row** — names the stage and the hand of each
  change delivering it
- 🚧 **A page's marked line** — a line a page marks as being built wears the
  pip of its change's stage
- 🚧 **Actions on the hosted manual** — Assign stays on the locally run
  manual until the hosted site has a sign-in
- 🚧 **A page open while `main` moves** — the hosted manual says `main` moved,
  with the commit's subject and how long ago, offers Refresh now, and refreshes
  itself once the site has caught up, never under a reader who is typing
- 🚧 **The locally run manual** — says how many commits behind `main` the
  checkout is, pulls on one click, and names what is in the way of a pull it
  cannot make

:::detail{title="Product decisions" for="pm"}
A change passes through five hands and nobody is told when it reaches theirs;
the board shows four lanes, so a change waiting on a designer sits in the same
lane as one waiting on a deploy. The owner's brief is
[the blueprint](/references/delivery-workflow-blueprint).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Stage | Decided | Derived from the files on `main`, one of eight; never a status key somebody sets. | Product |
| Proposed and Decided | Decided | One stage: the product manager settles the proposal, the decisions and the journeys in one sitting, and an open item stays `❓` instead of holding a gate. | Product |
| Who drafts | Decided | The change's agent drafts every stage from Proposed to Building; the hand of the stage answers, tweaks, challenges or reads, and their word lands it. Every surface marks the five. | Product, Engineering |
| Approval record | Decided | The landing: an artifact reaches `main` on its hand's word, and the change records whose. No approval key beside it. | Engineering |
| Tech design order | Decided | Before the requirements, from the page, the decisions and the journeys, on every change; owed when the work lands outside this store. | Product, tech PIC |
| Hands | Decided | Recorded in the change's manifest, one handle per role. | Product |
| Messages | Decided | One direct message per move to the hand it reaches, each linking the change's thread, the channel post per push kept, a weekly digest; never one per commit. | Product |
| Behind | Decided | An overlay, told once, listed in the digest; it holds nothing but the fold. | Product, Engineering |
| Suite review | Decided | An overlay beside the stage, so planning never waits on QA's verdict. | Product, QA |
| Measure | Decided | Days between a stage landing and the next hand's word, shown on the change page. | Product |
| Team map | Decided | `docs/prds/team.yaml`: one entry per handle with the e-mail, the Slack member and the roles, and a channel per role. | Operations |
| Hosted actions | Decided | Assign stays on the locally run manual until the hosted site has a sign-in. | Operations |
| Open pages | Decided | A page open while `main` moves is told and refreshes once the site has caught up; the locally run manual pulls. | Operations, Engineering |
| Pre-release build | Decided | The deploy record names the tagged build, so the change page and QA's staging message say which build the change is on. | Product, Operations |
:::
