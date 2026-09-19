---
title: Change Stages
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
| 1 | Proposed | `proposal.md`; then `decisions.md`, `user-journeys.md`, one marked line per outcome on the page and `hands:`, with ❓ on what is still open | Drafts the marks and the three files from what you ask; asks what is a preference or a product decision | Product manager: say what is wanted, answer |
| 2 | Designed | `ui-design.md` or `ui_waived`; `tech-design.md` or `design_waived` | Proposes each design from the page and the journeys, challenged and verified | Designer: tweak. Tech PIC: challenge |
| 3 | Specified | `spec.md` with requirements; `feature-tcs.md`; every Raised row landed | Two blind readings of the journeys, reconciled | Product manager: read the requirements and the cases together |
| 4 | Planned | `tasks.md`; `promoted_by` | Writes the plan, challenged for order, tests first and size | Engineer: read the summary |
| 5 | Building | Boxes ticking | Builds each group test first, audited and verified | Engineer: read each landing |
| 6 | On staging | Every box ticked; `deployed_env: staging` | The deploy; the run sheet | QA: walk it |
| 7 | Released | `released_in: <tag>` | The cut | Release hand: cut |
| 8 | Archived | The directory under `archive/`; the fold; the marks off | The fold | Whoever archives |

- 🚧 **One stage per change** — the board, the change page, a page's in-flight
  ribbon and My turn all show the same one
- 🚧 **Read, never set** — a stage moves when a file lands on `main`, and
  nothing else moves it
- 🚧 **One stage for what is wanted** — the proposal, the decisions and the
  journeys sit in Proposed together, because the product manager settles the
  three in one sitting; an item still open stays ❓ on the decisions or the
  page and holds nothing
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
- 🚧 **Behind** — shown, told once, and listed in the digest after 7 days;
  it holds a tick, a claim and a wait never, and the fold at archive always —
  what clears it is [Agent Rounds · Read Again](agent-rounds#read-again)
- 🚧 **Suite** — shown beside the stage and never holding the ladder
- **Flag and hotfix** — the release line carries both: a flag on a change and a
  hotfix branch are read where releases are cut, not here
- ❓ **Day bounds** — whole calendar days on the Hong Kong date, the chip from
  the seventh and the shelf from the thirtieth; the product manager confirms

## Hands

One handle per role on each change.

| Role | Key | Takes the change at |
| --- | --- | --- |
| Product manager | `pm` | Proposed, and Specified |
| Designer | `design` | Proposed, once the decisions and the journeys are on `main` |
| Tech PIC | `tech` | Proposed, once the decisions and the journeys are on `main` |
| QA | `qa` | On staging; the suite's review, any time, as an overlay |
| Engineer | `dev` | Planned |
| Release hand | `release` | On staging |

- 🚧 **Recorded in git** — `hands:` in the change's `.openspec.yaml`, written
  by the product manager at the interview's end, by Assign on the locally run
  manual, or by `pnpm plan hand` from the application repository
- 🚧 **Unnamed hand** — the role's channel is told instead, and the card says
  the hand is open
- 🚧 **Who landed it** — each artifact records the hand whose word landed it,
  and the change page shows the handle beside the artifact
- 🚧 **Team map** — `docs/prds/team.yaml` in the store: one entry per handle
  with its e-mail, its Slack member and the roles it takes, and one channel per
  role
- ❓ **A handle's Slack member** — written into the map, or looked up by e-mail
  through the Slack app; Operations confirms

## Messages

Slack tells one person, once per move, in the change's thread.

| When | Who is told | Carries |
| --- | --- | --- |
| A change reaches a hand: a stage lands, or the decisions and the journeys complete Proposed | That hand, by direct message | The change, the stage, the thread to answer in |
| A change reaches staging | Its QA hand, by direct message | The change, and the run sheet to walk |
| An artifact is behind | The hand of the earliest behind artifact | The artifact, and what changed before it |
| A push lands on `main` | The channel | Each change the push moved, and its stage |
| Monday morning | Each person, by direct message | On you now; open questions; idle; behind; waiting; freed by a dependency |

- 🚧 **Once per move** — a move is the hand changing; a move told twice, or a
  message per commit, never happens
- 🚧 **One thread per change** — every message about a change is a reply in
  its thread, and a reply there is how a hand answers
- **The channel post per push** — runs today, listing the changes a push
  touched
- ❓ **Two fewer messages** — a written wait and a freed dependency are digest
  lines, not messages of their own; the product manager confirms

## Surfaces

- 🚧 **Board** — eight lanes, one per stage, stacked as In Flight stacks four
  today; the five drafted lanes wear the agent mark and the hand's move in
  their heading; each card the hand, the age, the overlays and the task bar;
  Mine, Waiting, Idle, Behind and Blocked filters; a shelf for a change idle
  30 days
- 🚧 **Change page** — the stage as a stepper, the agent mark and the hand's
  move under each drafted step; a Your turn card with the thread and the
  command; the hands; each artifact with fresh or behind, its open questions
  and who landed it; tasks by group; where the code is: `main`, staging, a
  release
- 🚧 **My turn** — the open questions addressed to the reader, then the
  changes whose current stage names them, then the ones that are theirs
  later; the handle is chosen once per browser
- 🚧 **A page's marked line** — a line a page marks as being built wears the
  pip of its change's stage
- ❓ **Actions on the hosted manual** — Assign stays on the locally run
  manual until the hosted site has a sign-in; Operations confirms

:::detail{title="Product decisions" for="pm"}
A change passes through five hands and nobody is told when it reaches theirs;
the board shows four lanes, so a change waiting on a designer sits in the same
lane as one waiting on a deploy. The owner's brief is
[the blueprint](/references/delivery-workflow-blueprint).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Stage | Decided | Derived from the files on `main`, one of eight; never a status key somebody sets. | Product |
| Proposed and Decided | Decided | One stage: the product manager settles the proposal, the decisions and the journeys in one sitting, and an open item stays ❓ instead of holding a gate. | Product |
| Who drafts | Decided | The change's agent drafts every stage from Proposed to Building; the hand of the stage answers, tweaks, challenges or reads, and their word lands it. Every surface marks the five. | Product, Engineering |
| Approval record | Decided | The landing: an artifact reaches `main` on its hand's word, and the change records whose. No approval key beside it. | Engineering |
| Tech design order | Decided | Before the requirements, from the page, the decisions and the journeys, on every change; owed when the work lands outside this store. | Product, tech PIC |
| Hands | Decided | Recorded in the change's manifest, one handle per role. | Product |
| Messages | Decided | One direct message per move to the hand it reaches, every message a reply in the change's thread, the channel post per push kept, a weekly digest; never one per commit. | Product |
| Behind | Decided | An overlay, told once, listed in the digest; it holds nothing but the fold. | Product, Engineering |
| Suite review | Decided | An overlay beside the stage, so planning never waits on QA's verdict. | Product, QA |
| Measure | Decided | Days between a stage landing and the next hand's word, shown on the change page. | Product |
| Team map | ❓ Open | Where the handle-to-Slack map lives. | Operations |
| Hosted actions | ❓ Open | Whether the hosted manual can take Assign without a sign-in. | Operations |
:::
