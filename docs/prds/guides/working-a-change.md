---
title: Working a change
summary: One change id, eight files, the hand that lands each — who writes what, and how you know it is your turn.
order: 4
---

## The Change Id

One id names the whole change: `add-store-cross-sell` — kebab-case, a verb and
the thing it acts on. `openspec/changes/add-store-cross-sell/` holds every
artifact, and no second change is opened for the same work.

- **Drawn from the first sentence**, and never renamed — it is in the branch
  `claude/add-store-cross-sell`, the commits and the board
- **Not the capability** — `grade10-site/store/cross-sell` is what the change
  writes *about*; the ids inside the files carry that path instead

## The Eight Files, and the Hand of Each

| # | File | Hand | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/workflow-plan` | Always |
| 2 | `decisions.md` | Product manager | `/workflow-plan` | Always — goals, non-goals, and what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/workflow-plan` | Always — one nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM who already has the design | `/workflow-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Dev in the integrated planning run | `/planning-dev` | Every implementation change outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | QA1 outline, Dev scenarios | `/planning-dev` | Always — anchors first, scenarios after QA1 and technical design |
| 7 | `specs/<capability>/feature-tcs.md` | QA1 cases, QA2 reconciliation | `/planning-dev` | Always — blind draft cases before scenarios |
| 8 | `tasks.md` | Dev in the integrated planning run | `/planning-dev` | Before acceptance and implementation |

The PM writes 1 to 3; a designer adds 4 where the change affects a surface.
Then `/planning-dev <id>` freezes the anchor set, gets QA1's blind draft cases,
gets Dev's independent technical design, scenarios and tasks, then reconciles
both in QA2. The same human answers questions and accepts the complete plan
once, after `accept-review` reports the page, designs and deltas agree. `pnpm accept:preflight <id>` checks readiness and prints the baseline
fingerprint; `pnpm spec:accept <id> --baseline <digest> --reviewed-by <human>`
records that decision and publishes the requirements to `openspec/specs/`
before implementation. An amended acceptance names its prior fingerprint
with `--supersedes <old-fingerprint>` and preserves that snapshot. The new
cases remain drafts until human QA reviews them after deployment; manual
execution uses `/tcs-run-sheet`.

Two files every hand writes on. A product detail you learn goes on the PRD
under `docs/prds/` first, marked 🚧 or ❓, and a scope fact on `decisions.md`,
both before your own artifact cites them — [PRDs and OpenSpec](https://github.com/9gag/grade10-spec/blob/main/docs/governance/prd-and-openspec.md).

## What to Say to the Agent

The skill carries the rules — reading the capability, opening the change, the
interview, what each artifact holds, validating. You carry the feature and what
only you have: a frame, a value, a handle.

**The product manager says the sentence**, to the app in the planning channel;
in a terminal `/workflow-plan` comes before it:

```text
cross-sell on a card's page: the products we pick per card in Shopify first,
then similar cards by the tags and the facets they share, up to six.
Customers-also-bought from orders is phase two, once this ships.
```

**Every later hand is told by direct message**, and answers in that change's thread —
[Agent Rounds](/p/shared/planning/agent-rounds). You answer only what is yours:

- **Your moves** — the summary lists the moves that are yours
- **A question held for you** — arrives as its own reply mentioning you, with
  the row and the page's sentence quoted
- **A line a build round puts on your page** — comes back to you as ❓, with
  the line before and after
- **Planning questions** — go to the same human who is accepting the complete plan
- **Human QA** — reviews the suite after deployment; `/tcs-run-sheet` handles manual execution

From a terminal it is your artifact's line command instead —
`/workflow-design`, then one `/planning-dev` run with the change id, then
`/workflow-build add-store-cross-sell <group>`,
once per group.

Four things the round cannot know, so say them when they are true:

- **The decisions are already made** — "draft from what I've given you";
  otherwise expect about three questions first, one of them whether to do
  it now, with every default the round took listed for one reply to overturn
- **You are two hands** — "I'm the engineer as well, carry it to `tasks.md`"
- **Which capability you mean** — the full path, `grade10-site/store/cross-sell`
- **You are in `grade10`** — the line commands live in this store, so the agent
  needs a clone of it first — [the engineer's command sheet](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md)

## The Example, End to End

The handles are examples; the team map names who takes each role —
[Change Stages](/p/shared/planning/change-stages).

:::flow{title="add-store-cross-sell" diagram="assets/diagrams/working-a-change.svg"}
## *PM* — **The sentence**

One message to the app in the planning channel opens `add-store-cross-sell`,
`hands: pm: @ecchochan`, and the thread it started. The run marks
`docs/prds/products/grade10-site/store/cross-sell.md` first — one marked line
per outcome, ❓ on what is open — and links that section from the proposal.
Then it drafts every artifact after it and lands nothing. Two rows it holds:
`Q1` where the per-card picks live, recommended the complementary products
Shopify's Search & Discovery app keeps on the card; `Q2` does the rail sell,
recommended no cart. Six cards, the order of the similar picks and the heading
"You may also like" it decides itself, and one reply overturns each.

## *PM* — **The first word**

`Q1: Shopify`, `Q2: no cart`, then `land`: the page's marks, `proposal.md`,
`decisions.md` and `user-journeys.md` reach `main` in that order with
`@ecchochan` on each — US-01 the picks the shop chose, US-02 similar cards
where a card has none, US-03 a stock keeper's picks in Shopify admin, seen
within the mirror's refresh. The designer and the tech PIC are told in the same
thread, and everything after the journeys is read again.

## *Designer* — **The rail**

Nobody has drawn the rail, so the draft writes
`awaiting: ui-design: "2026-09-22, frame for the rail - @kinisworking"`. One
screen: the rail under the buy box on the card's page, from
`StoreSectionHeader` and `ProductCard`. Five states — the picks, similar only,
mixed, none at all and no rail, and a chosen pick nobody can buy. The frame
arrives as a remark, and the designer's word lands `ui-design.md`.

## *Dev* — **The technical design and rule**

The catalogue mirror gains the card's complementary references and its tags,
and the similar rule runs when the card's page is served, in the response
before any script runs. Rejected: Storefront's `productRecommendations`,
Shopify's own ranking rather than the store's facets and not deterministic, and
a nightly precompute, stale inside the window the mirror already closes. The
technical design lands with the delivery draft and explains how accepted
behavior will be implemented.

## *QA1 · Dev · QA2* — **Cases, scenarios and reconciliation**

QA1 writes draft cases from the frozen anchors without reading scenarios. Dev
independently writes requirement scenarios and tasks. QA2 compares cases and
scenarios against the anchors and records every disposition. The ids start at
`grade10-site-store-cross-sell-SC-01` in `spec.md` and
`grade10-site-store-cross-sell-US1-TC1-1` in `feature-tcs.md`, beside a delta
on `grade10-site/store/product-page` for the rail's place on the page. The
same human answers questions throughout and accepts the completed plan once,
using the baseline fingerprint from `pnpm accept:preflight` with
`pnpm spec:accept`. That acceptance publishes the requirements to durable
specs. The draft cases remain unreviewed until human QA reviews them after
deployment; `/tcs-run-sheet` handles manual execution.

## *Engineer* — **The plan, then the build**

Four groups, each with its test task first: the mirror in `grade10`, the rule
and the page response in `grade10`, the rail block in `packages/ui` here, and
the walk; their word lands `tasks.md`. Then `/workflow-build add-store-cross-sell 1`,
one round per group: the tests in their own commit, the code, the group's
readers, and the row in `rounds.md` before the tick. A group in `grade10`
lands its row from that clone. Its test paths are bare, and the group's tag
names the repository. A lane the environment could not start says `written,
not run` first and leaves its tasks unticked. A reader that ran on a fallback
model is named so. A reader the fallback could not run stops the round and
tells the thread which one is missing. The last group walks US-01 to US-03
end to end and leaves the end-to-end suite that runs on every push to `main`.

## *Engineer* — **Implementation and archive**

After engineering verification, record the accepted fingerprint, repository
commits and deploy components with `pnpm plan implementation`. Archive the
change; acceptance already published the durable spec, so archive makes no
second fold. Deployment does not wait for archive. Human QA reviews the
suite once the application is available; `/tcs-run-sheet` handles manual
execution. Phase two is its own change,
`add-store-also-bought`, opened by the next sentence with `depends_on:
add-store-cross-sell`; it decides first whether to compute the store's first
behavioural signal from `Order Paid`, the only store event sent today.
:::

## How You Know It Is Your Turn

The change carries its own stage, and the stage names the hand.
Answer in the change's thread when it names you, or run the command below in a
terminal — how an artifact gets written is [Agent Rounds](/p/shared/planning/agent-rounds).

| # | Stage | Hand | Say |
| --- | --- | --- | --- |
| 1 | Proposed | Product manager | `/workflow-plan <id>` |
| 2 | Designed | Designer, when needed | `/workflow-design <id>` |
| 3 | Accepted | Invoking human, after QA1 · Dev · QA2 | `/planning-dev <id>`, then accept with the preflight fingerprint |
| 4 | Building | Engineer | `/workflow-build <id> <group>` |
| 5 | Implementation-complete | Engineer, after verification | `pnpm plan implementation <id> --commit <sha> --component <id>` |
| 6 | Archived | Nobody | App repository archive workflow after verification |

- **What proves each stage** - [Change Stages](/p/shared/planning/change-stages). Deployment availability is tracked separately and does not wait for archive.

[My turn](/my-turn) shows what is on you; [Board](/in-flight) shows every change; ask the agent where a change stands to read this for one.

## Each Way In

The round is the same whichever door you take: the same branch, the same
readers, the same landing with your handle on it. What differs is where you
say what you say, and what has to be running.

| Door | You say it | It lands through | It needs |
| --- | --- | --- | --- |
| The thread | A sentence to the app in the planning channel, then your answers in the change's thread | The relay, on your word or the Confirm button | The Slack app, the relay and the Routine, which Operations sets up — [Agent Runner](/references/agent-runner) |
| A terminal | The line command in Claude Code, in a clone of this store: `/workflow-plan <sentence>` first, then each hand's command from the table above | `/workflow-land <id> <artifact>` from the terminal, on the handle the team map gives your git e-mail | The clone, and a GitHub account that may push `main` — no Slack at all |
| The locally run manual | Assign on a change page, Propose on a product page, Pull when the checkout is behind | Your working tree, uncommitted: committing and pushing it is yours, as any other edit | `pnpm manual` on the clone; the hosted manual is read-only |
| The application repository | `pnpm plan claim`, `done`, `hand` and `implementation` | A commit straight to the store's `main` | `grade10`, with the store clone beside it |
| A push of your own | A push to the change's branch, from a terminal or the code host | The round, which reads it as your word for the lines it touched | Nothing more |

- **A terminal alone, end to end** — `/workflow-plan` opens the change and
  drafts ahead, as above; the readers run in your session; you answer the
  numbered questions there and say land. The landing rebases, runs the gate
  and pushes `main`, and the push workflow tells the channel and the change's
  thread by itself. Slack adds two things: the message that says it is your
  turn, which `NOTIFY_DMS` gates, and a reply in the thread that wakes a run,
  which the relay makes
- **The doors mix** — a change opened in the thread carries on from a
  terminal and back: the files are the state, and each door reads them
- **The old flow, meanwhile** — `spec-push` and `dev-help`
  stay until the team has adopted the line commands. A change opened with
  them shows on the board like any other, owes no round row, and gets the
  same channel post

## The Ids Inside the Change

Different from the change id, and permanent once issued.

- **Three kinds, one prefix** — the capability's path with slashes as hyphens:
  `grade10-site-store-cross-sell-SC-01` a scenario in `spec.md`, `-US-01` a
  story in `user-journeys.md`, `-US1-TC1-1` a case in `feature-tcs.md` —
  [Naming](https://github.com/9gag/grade10-spec/blob/main/docs/governance/specs-to-test-cases.md#naming)
