---
title: Working a change
summary: One change id, eight files, four teammates — who writes what, and how you know it is your turn.
order: 4
---

## The Change Id

One id names the directory, and every line command names that id:
`add-store-cross-sell` — kebab-case, a verb and the thing it acts on.

- **Drawn from the first sentence**, and never renamed — it is in the branch
  `claude/add-store-cross-sell`, the commits and the board
- **Opened by the run**, never by hand — the `.openspec.yaml` recording its
  schema comes with it; a directory you make yourself records nothing
- **The whole address** — `openspec/changes/add-store-cross-sell/` holds every
  artifact, and no second change is opened for the same work
- **Not the capability** — `grade10-site/store/cross-sell` is what the change
  writes *about*; the ids inside the files carry that path instead

## The Eight Files, Four Hands

| # | File | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/plan`, `planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `/plan`, `planning-pm` | Always — goals, non-goals, and what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/plan`, `planning-pm` | Always — one nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM who already has the design | `/design`, `planning-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Engineer | `/tech`, `planning-dev` | When a task group lands outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | Generated, the PM reads | `/specify`, `planning-qa` | Always — the outline, then the requirements, with 7 between them |
| 7 | `specs/<capability>/feature-tcs.md` | Generated, QA reviews | `/specify`, `planning-qa` | Always — blind, before the scenarios |
| 8 | `tasks.md` | Engineer | `/tasks`, `planning-dev` | Before anyone can build it |

The round drafts ahead: the first sentence puts every file above on the
change's branch, each read by its own perspectives, and lands nothing. A hand
lands only their own artifacts — one word lands every drafted artifact of that
hand, in the order above, and tells the next hand. **Neither the PM nor the
designer opens `spec.md`**: its two readings belong to the run that takes them
from the journeys, and the PM is its reader of record.

Two files every hand writes on. A product detail you learn goes on the PRD
under `docs/prds/` first, ❓ until somebody confirms it, and a scope fact on
`decisions.md`, both before your own artifact cites them — [PRDs and OpenSpec](https://github.com/9gag/grade10-spec/blob/main/docs/governance/prd-and-openspec.md).

## What to Say to the Agent

The skill carries the rules — reading the capability, opening the change, the
interview, what each artifact holds, validating. You carry the feature and what
only you have: a frame, a value, a handle.

**The product manager says the sentence**, to the app in the planning channel
`#grade10-planning`, or after `/plan` in a terminal:

```text
/plan cross-sell on a card's page: the products we pick per card in Shopify
first, then similar cards by the tags and the facets they share, up to six.
Customers-also-bought from orders is phase two, once this ships.
```

**Every later hand is told in that change's thread**, and answers there: `Q4`
to take a question's recommendation, `Q4: the second` to answer it, any other
words as a remark applied as written, `land` or `land with recommendations` to
land what is drafted, and a push to the branch as your word for the lines it
touched. From a terminal it is your artifact's line command instead —
`/design`, `/tech`, `/specify`, `/tasks`, each with the change id, then
`/build add-store-cross-sell 1` per group.

Four things the round cannot know, so say them when they are true:

- **The decisions are already made** — "draft from what I've given you";
  otherwise expect the interview first
- **You are two hands** — "I'm the engineer as well, carry it to `tasks.md`"
- **Which capability you mean** — the full path, `grade10-site/store/cross-sell`
- **You are in `grade10`** — the line commands live in this store, so give the
  agent a clone of it first: `/add-dir` in Claude Code, a second workspace
  folder in Cursor; [that lane's commands](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md) are here

## The Example, End to End

:::flow{title="add-store-cross-sell" diagram="assets/diagrams/working-a-change.svg"}
# Product manager

*PM* — **The sentence** — one message to the app in the planning channel opens
`add-store-cross-sell`, `hands: pm: @ecchochan`, and the thread it started.

## The Chain, and the Two Held Rows

The run marks `docs/prds/products/grade10-site/store/cross-sell.md` first — one
line per outcome, ❓ on what is open, linked from the proposal — then drafts
every artifact after it and lands nothing. Two rows it holds: `Q1` where the
per-card picks live, recommended the complementary products Shopify's Search &
Discovery app keeps on the card; `Q2` does the rail sell, recommended no cart.
Six cards, the order of the similar picks and the heading "You may also like"
it decides itself, and one reply overturns each.

## The First Word

`Q1: Shopify`, `Q2: no cart`, then `land`: the page's marks, `proposal.md`,
`decisions.md` and `user-journeys.md` reach `main` in that order with
`@ecchochan` on each — US-01 the picks the shop chose, US-02 similar cards
where a card has none, US-03 a stock keeper's picks in Shopify admin, seen
within the mirror's refresh. The designer and the tech PIC are told in the same
thread, and everything after the journeys is read again.

# Designer

*Designer* — **The frame** — nobody has drawn the rail, so the draft writes
`awaiting: ui-design: "2026-09-22, frame for the rail - @kinisworking"`.

## The Rail and Its States

One screen: the rail under the buy box on the card's page, from
`StoreSectionHeader` and `ProductCard`. Five states — the picks, similar only,
mixed, none at all and no rail, and a chosen pick nobody can buy. The frame
arrives as a remark, and the designer's word lands `ui-design.md`.

# Tech PIC

*Tech PIC* — **The challenge** — what the tech PIC remarks is applied as written.

## The Mirror and the Rule

The catalogue mirror gains the card's complementary references and its tags,
and the similar rule runs when the card's page is served, in the response
before any script runs. Rejected: Storefront's `productRecommendations`,
Shopify's own ranking rather than the store's facets and not deterministic, and
a nightly precompute, stale inside the window the mirror already closes. The
tech PIC's word lands `tech-design.md`.

# QA

*QA* — **The two readings** — the cases are written blind of the scenarios and
the requirements are reconciled against them after.

## The Requirements and the Cases

The ids start at `grade10-site-store-cross-sell-SC-01` in `spec.md` and
`grade10-site-store-cross-sell-US1-TC1-1` in `feature-tcs.md`, beside a delta
on `grade10-site/store/product-page` for the rail's place on the page. The
product manager reads the two side by side, and one word lands both.

# Engineer

*Engineer* — **The plan** — four groups, each with its test task first: the
mirror in `grade10`, the rule and the page response in `grade10`, the rail
block in `packages/ui` here, and the walk; their word lands `tasks.md`.

## Built and Walked

`/build add-store-cross-sell 1`, then one round per group: the tests in their
own commit, the code, the group's readers, and the row in `rounds.md` before
the tick. `pnpm plan claim` and `pnpm plan done` run from `grade10`. The last
group walks US-01 to US-03 end to end and leaves the suite every deploy runs.

# The store

*The store* — **Staging and the cut** — the deploy, the run sheet QA walks,
then the release hand's cut.

## The Fold, Then Phase Two

The fold rewrites `openspec/specs/grade10-site/store/cross-sell/spec.md` and
takes the marks off the page's lines. Phase two is its own change,
`add-store-also-bought`, opened by the next sentence with `depends_on:
add-store-cross-sell`; it decides first whether to compute the store's first
behavioural signal from `Order Paid`, the only store event sent today.
:::

## How You Know It Is Your Turn

The change carries its own stage, one of eight, and the stage names the hand.
Answer in the change's thread when it names you, or run the command below in a
terminal — how an artifact gets written is [Agent Rounds](/p/shared/planning/agent-rounds).

| # | Stage | Hand | Say |
| --- | --- | --- | --- |
| 1 | Proposed | Product manager, then Designer · Tech PIC | `/plan <id>`, then `/design <id>` · `/tech <id>` |
| 2 | Designed | nobody | — |
| 3 | Specified | Product manager | `/specify <id>` |
| 4 | Planned | Engineer | `/tasks <id>` |
| 5 | Building | Engineer | `/build <id> <group>` |
| 6 | On staging | QA · Release hand | — |
| 7 | Released | nobody | — |
| 8 | Archived | nobody | — |

- **Proposed's turn moves without moving the stage** — the product manager
  answers first; once the decisions and the journeys land, the turn passes to
  the designer and the tech PIC while the stage is still Proposed
- **Designed names nobody** — its designs already landed during Proposed's
  second turn, and the requirements are drafted next, read at Specified
- **What proves each stage** — [Change Stages](/p/shared/planning/change-stages)

[My turn](/my-turn) shows what is on you; [In Flight](/in-flight) shows every change; ask the agent where a change stands to read this for one.

## The Ids Inside the Change

Different from the change id, and permanent once issued.

- **Prefixed by the capability's path**, slashes as hyphens —
  `grade10-site/store/cross-sell` issues `grade10-site-store-cross-sell-*`
- **Three kinds** — `-SC-01` a scenario in `spec.md`, `-US-01` a story in
  `user-journeys.md`, `-US1-TC1-1` a case in `feature-tcs.md`
- **Why the whole path** — two capabilities can share a name: `grade10-site/site/navigation`
  and `zzz-site/site/navigation` would otherwise both issue `navigation-SC-01`
- **Never renumbered** — a retired scenario is removed, a retired case marked
  `deprecated`, and the next one takes the next unused number; a task, a review
  comment and a test all point at an id, so a reused number rewrites every one
- **A renamed capability keeps its old prefix** — the ids were issued, and the
  readers take the prefix from the ids rather than from the directory
