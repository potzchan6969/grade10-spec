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

A change is in exactly one planning or delivery stage, proven by a file on
`main`. Deployment availability is read separately from GitHub Deployments.

| # | Stage | Proven by | The agent | You |
| --- | --- | --- | --- | --- |
| 1 | Proposed | `proposal.md`; then `decisions.md`, `user-journeys.md`, one marked line per outcome on the page and `hands:`, with `❓` on what is still open | Drafts the marks and the three files from what you ask; asks what is a preference or a product decision | Product manager: say what is wanted and whether to do it now |
| 2 | Designed | `ui-design.md` or `ui_waived` | Drafts the UI design from the page and the journeys | Designer: tweak and land the UI design, or record `ui_waived` |
| 3 | Specified | `spec.md` with requirements; `feature-tcs.md`; `tech-design.md` or `design_waived` | QA1 writes the blind cases from the frozen anchors; Dev independently writes the technical design, requirements and scenarios; QA2 reconciles the two readings | Product manager: resolve every open question; QA1 does not review the requirement draft |
| 4 | Planned | `tasks.md` | Dev writes the dependency-ordered plan after QA2 reconciliation | Engineer: read the plan and challenge the tech design before acceptance |
| 5 | Accepted | `acceptance.json`, with a content fingerprint of the resolved plan | Reviews the page, designs and deltas against each other, then records the human's acceptance and publishes the contract to `openspec/specs/`; no product question remains open | Product manager or named owner: accept the plan |
| 6 | Building | A ticked task; the first claim recorded the store's `main` commit and the accepted targets in `implementation.json` | Builds each group test first, audited and verified | Engineer: read each landing |
| 7 | Implementation complete | `implementation.json`, with the repository, commit and concrete application component ids | Records implementation and ancestry against the accepted contract | QA: run human review after implementation, on a deployed environment when required |
| 8 | Archived | The directory under `archive/`; the accepted contract and implementation record verified | Compares the claimed targets with the current durable contract; acceptance already folded it | Engineer: archive after implementation verification |

- 🚧 **One stage per change** — the board, the change page, a page's in-flight
  ribbon and My turn all show the same one
- 🚧 **One stage for what is wanted** — the product manager settles the proposal,
  the decisions and the journeys in one sitting; a decision still open holds
  acceptance
- 🚧 **Independent planning readings** — QA1 writes blind cases from the frozen
  anchors, then Dev writes design, requirements, scenarios and tasks without
  reading them; QA2 reconciles both and closes each raised question the [held
  test](agent-rounds#the-round) does not hold; one human resolves the rest
- 🚧 **Implementation before human QA** — planning acceptance does not mark a
  suite approved or actual; human QA starts after implementation is complete
- 🚧 **Accepted and verified records** — the acceptance fingerprint stays
  immutable, implementation records its repository, commit and application
  component ids, and the archive verifies that record
- 🚧 **Availability apart from archive** - a GitHub Deployment receipt records
  whether each application component is newly, still, no longer, partially,
  unknown or stale in an environment; a deploy never waits for archive
- 🚧 **Drafted, then landed on your word** — each planning artifact reaches
  `main` only when its hand lands it, and the landing records whose word it was
- 🚧 **The Design stage draws the UI alone** — Designed is proven by
  `ui-design.md` or `ui_waived` and nothing else; the designer is its one hand
- 🚧 **The tech design inside planning** — Dev writes `tech-design.md` in the
  planning run, after QA1 freezes the blind cases and before the scenarios,
  and it proves Specified beside the requirements and the suite; a question it
  cannot settle is a Raised row, which holds acceptance
- **Four lanes today** — proposed, specified, in progress and complete, read
  the same way — [Board](/in-flight)

## Overlays

A fact beside the stage, never a stage of its own. The set is five, and closed.

| Overlay | Read from | Shown as |
| --- | --- | --- |
| Waiting | `awaiting:`, one line per artifact, dated | An amber chip with the line |
| Blocked | `depends_on:` naming a change not yet released | A grey chip naming it |
| Idle | 7 days without a tick, a claim or an artifact landing; shelved at 30 | A red chip with the day count |
| 🚧 Behind | An artifact whose page lines or artifacts before it changed after it was drawn or last read again | A chip naming the earliest behind artifact and its hand, and whether it holds their next landing |
| Suite | `feature-tcs.md` status, `draft` or `approved` | A chip beside the stage |

- **Waiting and blocked** — read today from the same two keys —
  [Pending](/pending)
- 🚧 **Idle** — counted from the last tick, claim or artifact landing, so a
  repository-wide commit moves nobody's count
- 🚧 **Behind** — shown, told once, and listed in the digest after 7 days
  counted from the day it went behind; it holds a tick, a claim and a wait
  never, the archive always, and the next landing where what moved is
  major —
  what clears it is [Agent Rounds · Read Again](agent-rounds#read-again)
- 🚧 **Suite** — shown beside the stage and never holding the ladder
- **Flag and hotfix** — the release line carries both: a flag on a change and a
  hotfix branch are read where releases are cut, not here
- 🚧 **Day bounds** — whole calendar days on the Hong Kong date, the chip from
  the seventh and the shelf from the thirtieth

## Environment Availability

Deployment availability is separate from a change's stage. Each application
component has its own status in each environment, read from its GitHub
Deployment receipt. A change remains Archived after deployment; the manual
keeps its availability visible with both active and archived changes.

| Status | Meaning |
| --- | --- |
| Newly | The component first appears in this environment |
| Still | The deployed component has not changed |
| No longer | A component previously present is absent from the environment |
| Partial | Only some of the change's components are present |
| Unknown | The available evidence cannot establish the component state |
| Stale | The receipt is older than the environment's latest evidence |

- 🚧 **Receipt detail** — each row links to the GitHub Deployment, the resolved
  deployed ref, the component URL and the manual and QA testing links
- 🚧 **Testing summary** — the change page and the environment view show a
  friendly summary of the components QA should verify

## Hands

One handle per role on each change.

- 🚧 **Five roles** — the tech PIC is retired: the engineer who will build the
  change challenges the tech design before acceptance, the human who accepts
  the plan judges it whole, and `tech-design.md` is the engineer's

| Role | Key | Takes the change at |
| --- | --- | --- |
| Product manager | `pm` | Proposed, Specified and Accepted |
| Designer | `design` | Proposed, once the decisions and the journeys are on `main` |
| QA | `qa` | Implementation complete, for the suite's human verdict |
| Engineer | `dev` | Planned, Accepted and Building |
| Release hand | `release` | Availability review after archive |

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
| A change reaches Implementation complete | Its QA hand, by direct message | The change, the accepted implementation identity and the run sheet to walk |
| 🚧 What moved reaches their artifacts | Each hand it reaches, one message per person per landing | What moved, before and after, and which of their artifacts it holds |
| 🚧 An artifact lands from a terminal | The change's thread | What landed, whose word landed it, the stage now, and whose turn it is |
| A change is proposed, accepted, claimed, completed or archived | The channel, once the manual has deployed it | Each change that crossed one, under its milestone |
| Monday morning | Each person with a line to read, by direct message | On you now; open questions; idle; behind for 7 days; waiting; freed by a dependency |

- 🚧 **Once per move** — a move is the hand changing; a move told twice, or a
  message per commit, never happens
- 🚧 **One thread per change** — every direct message links the change's
  thread, and the change page until the round opens one; a reply in the
  thread is how a hand answers
- **The channel post** — names a change only when it is proposed, accepted,
  claimed, has every task checked, or is archived; any other push is silent
  in the channel
- **After the deploy** — nothing is sent until the manual and the OpenSpec
  viewer have deployed what the message says; a failed deploy sends nothing,
  and the next one that succeeds carries it
- 🚧 **Two fewer messages** — a written wait and a freed dependency are digest
  lines, not messages of their own
- 🚧 **QA follows implementation** — the QA hand is told when implementation
  is complete and sees the run sheet and application components to verify
- 🚧 **Availability is a receipt** — the environment view links each component
  to its GitHub Deployment receipt and the actual deployed ref

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
  by group; the accepted fingerprint and archived implementation record
- 🚧 **[My turn](/my-turn)** — the open questions addressed to the reader, then the
  changes whose current stage names them, then the ones that are theirs
  later, then what moved before their artifacts and is not read yet; the
  handle is chosen once per browser
- 🚧 **A section's in-flight row** — names the stage and the hand of each
  change delivering it
- 🚧 **A page's marked line** — a line a page marks as being built wears the
  pip of its change's stage
- 🚧 **Actions on the hosted manual** — Assign stays on the locally run
  manual until the hosted site has a sign-in
- 🚧 **A page open while `main` moves** — the hosted manual says `main` moved,
  with the commit's subject and how long ago, offers Refresh now, and refreshes
  itself once the site has caught up, never under a reader who is typing
- 🚧 **Ten minutes behind** — the site has not caught up, and the manual stops
  promising to refresh itself
- 🚧 **The locally run manual** — says how many commits behind `main` the
  checkout is, pulls on one click, and names what is in the way of a pull it
  cannot make

:::detail{title="Product decisions" for="pm"}
A change passes through planning and implementation, then reaches one or more
deployment environments. A single stage cannot describe component-level
availability, so deployment receipts are shown separately. The owner's brief is
[the blueprint](/references/delivery-workflow-blueprint).

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Stage | Decided | Eight stages are derived from files on `main`; deployment availability comes from GitHub Deployments and never changes the stage. | Product |
| Planning readings | Decided | QA1 writes isolated cases from the frozen anchors; Dev writes the delivery design and artifacts independently; QA2 reconciles both. | Product, QA, Engineering |
| 🚧 Human questions | Decided | One human resolves every question still open before accepting the plan; a raised question the held test does not hold closes as decided by the round. An open question prevents acceptance. | Product |
| Human QA | Decided | QA does not review the planned suite as an execution verdict. Human QA happens after implementation, using a deployed environment when needed. | Product, QA |
| Who drafts | Decided | The change's agent drafts artifacts; each hand lands its own artifacts. The landing records whose word it was. | Product, Engineering |
| Approval record | Decided | The landing: an artifact reaches `main` on its hand's word, and the change records whose. No approval key beside it. | Engineering |
| Tech design order | Decided | Written by Dev in the planning run, after the blind cases and before the scenarios; proves Specified; owed when the work lands outside this store. | Product, Engineering |
| Tech PIC | Decided | Retired: the engineer who will build the change challenges the tech design, and the accepting human judges the requirements and the suite whole. | Product |
| Raised rows | Decided | An open Raised row holds acceptance, never Specified; the product manager's turn at Specified is to resolve it. | Product |
| Hands | Decided | Recorded in the change's manifest, one handle per role. | Product |
| Messages | Decided | One direct message per move to the hand it reaches, each linking the change's thread, a channel post on five milestones only, a weekly digest; never one per commit, and nothing before the manual has deployed it. | Product |
| Behind | Decided | An overlay, told once, listed in the digest; it holds nothing but the fold, 🚧 and the next landing where what moved is major. | Product, Engineering |
| Plan acceptance | Decided | `acceptance.json` records an immutable content fingerprint after QA2 and human resolution. | Product, Engineering |
| Measure | Decided | Days between a stage landing and the next hand's word, shown on the change page. | Product |
| Team map | Decided | `docs/prds/team.yaml`: one entry per handle with the e-mail, the Slack member and the roles, and a channel per role. | Operations |
| Hosted actions | Decided | Assign stays on the locally run manual until the hosted site has a sign-in. | Operations |
| Open pages | Decided | A page open while `main` moves is told and refreshes once the site has caught up; the locally run manual pulls. | Operations, Engineering |
| Implementation evidence | Decided | `implementation.json` records the first claim's durable baseline, the repository, commit and concrete application component ids. Archive verifies it; deployment does not wait for archive. | Engineering |
| Availability | Decided | GitHub Deployment receipts report per-component environment status as newly, still, no longer, partial, unknown or stale; archived changes remain visible. | Product, Operations |
:::
