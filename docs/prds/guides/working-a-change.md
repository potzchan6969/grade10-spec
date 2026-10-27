---
title: Working a change
summary: One change id, eight files, the skill that writes each — who writes what, and how you know it is your turn.
order: 4
---

## The Change Id

One id names the whole change: `add-store-cross-sell` — kebab-case, a verb and
the thing it acts on. `openspec/changes/add-store-cross-sell/` holds every
artifact, and no second change is opened for the same work.

- **Drawn from the first sentence**, and never renamed — it is in the branch,
  the commits and the store
- **Not the capability** — `grade10-site/store/cross-sell` is what the change
  writes *about*; the ids inside the files carry that path instead

## The Eight Files, and Who Writes Each

| # | File | Who | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `/planning-pm` | Always — goals, non-goals, and what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/planning-pm` | Always — one nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM who already has the design | `/planning-design` | Optional — from the journeys |
| 5 | `tech-design.md` | Dev in the planning run | `/planning-dev` | Every implementation change outside this store — or `design_waived: <why>` |
| 6 | `specs/<capability>/spec.md` | QA1 outline, Dev scenarios | `/planning-dev` | Always — anchors first, scenarios after QA1 and technical design |
| 7 | `specs/<capability>/feature-tcs.md` | QA1 cases, QA2 reconciliation | `/planning-dev` | Always — blind draft cases before scenarios |
| 8 | `tasks.md` | Dev in the planning run | `/planning-dev` | Before acceptance and implementation |

The PM writes 1 to 3; a designer adds 4 where the change affects a surface.
Then `/planning-dev <id>` freezes the anchor set, gets QA1's blind draft cases,
gets Dev's independent technical design, scenarios and tasks, then reconciles
both in QA2. The same human answers questions and accepts the complete plan
once, after `accept-review` reports the page, designs and deltas agree.
`pnpm accept:preflight <id>` checks readiness and prints the baseline
fingerprint; `pnpm spec:accept <id> --baseline <digest> --reviewed-by <human>`
records that decision and publishes the requirements to `openspec/specs/`
before implementation. An amended acceptance names its prior fingerprint
with `--supersedes <old-fingerprint>` and preserves that snapshot. The new
cases remain drafts until human QA reviews them after deployment; manual
execution uses `/tcs-run-sheet`.

A product detail you learn goes on the PRD under `docs/prds/` first, marked 🚧
or ❓, before the artifact that cites it — [PRDs and OpenSpec](https://github.com/9gag/grade10-spec/blob/main/docs/governance/prd-and-openspec.md).

## What to Say to the Agent

The skill carries the rules — reading the capability, opening the change, the
interview, what each artifact holds, validating. You carry the feature and what
only you have: a frame, a value, a handle.

**The product manager says the sentence** to `/planning-pm`:

```text
cross-sell on a card's page: the products we pick per card in Shopify first,
then similar cards by the tags and the facets they share, up to six.
Customers-also-bought from orders is phase two, once this ships.
```

Three things the agent cannot know, so say them when they are true:

- **The decisions are already made** — "draft from what I've given you";
  otherwise expect a few questions first, one of them whether to do it now
- **Which capability you mean** — the full path, `grade10-site/store/cross-sell`
- **You are in `grade10`** — the planning skills live in this store, so the
  agent needs a clone of it first — [the engineer's command sheet](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md)

## The Example, End to End

The handles are examples; the team map names who takes each role —
[Change Stages](/p/shared/planning/change-stages).

:::flow{title="add-store-cross-sell"}
## *PM* — **The proposal**

`/planning-pm` opens `add-store-cross-sell` with `hands: pm: @ecchochan`. It
marks `docs/prds/products/grade10-site/store/cross-sell.md` first — one marked
line per outcome, ❓ on what is open — and links that section from the
proposal. It asks where the per-card picks live (the complementary products
Shopify's Search & Discovery app keeps on the card) and whether the rail
sells (no cart). Then `proposal.md`, `decisions.md` and `user-journeys.md`:
US-01 the picks the shop chose, US-02 similar cards where a card has none,
US-03 a stock keeper's picks in Shopify admin, seen within the mirror's
refresh.

## *Designer* — **The rail**

`/planning-design` draws one screen: the rail under the buy box on the
card's page, from `StoreSectionHeader` and `ProductCard`. Five states — the
picks, similar only, mixed, none at all and no rail, and a chosen pick nobody
can buy. Nobody has drawn the frame yet, so `ui-design.md` writes
`awaiting: ui-design: "2026-09-22, frame for the rail - @kinisworking"` until
it arrives.

## *QA1 · Dev · QA2* — **The plan**

`/planning-dev add-store-cross-sell` runs the rest in one invocation. Dev's
technical design: the catalogue mirror gains the card's complementary
references and its tags, and the similar rule runs when the card's page is
served. Rejected: Storefront's `productRecommendations`, Shopify's own ranking
and not deterministic, and a nightly precompute, stale inside the window the
mirror already closes. QA1 writes draft cases from the frozen anchors without
reading scenarios; Dev writes the scenarios and four groups of tasks, each
with its test task first; QA2 reconciles them. The same human answers the
questions and accepts once, which publishes the requirements to the durable
specs.

## *Engineer* — **The build**

In `grade10`, `pnpm plan claim add-store-cross-sell` records the store's
`main` and the accepted targets, and each group is built test first and
ticked with `pnpm plan done`. The last group walks US-01 to US-03 end to end.

## *Engineer* — **Implementation and archive**

After engineering verification, record the repository commits and deploy
components with `pnpm plan implementation`. Archive the change; acceptance
already published the durable spec, so archive makes no second fold.
Deployment does not wait for archive. Human QA reviews the suite once the
application is available; `/tcs-run-sheet` handles manual execution. Phase
two is its own change, `add-store-also-bought`, with `depends_on:
add-store-cross-sell`.
:::

## How You Know It Is Your Turn

The change carries its own stage, and the stage names who is next. Slack
tells that person by direct message.

| # | Stage | Who | Say |
| --- | --- | --- | --- |
| 1 | Proposed | Product manager | `/planning-pm <id>` |
| 2 | Designed | Designer, when needed | `/planning-design <id>` |
| 3 | Accepted | Invoking human, after QA1 · Dev · QA2 | `/planning-dev <id>`, then accept with the preflight fingerprint |
| 4 | Building | Engineer | `pnpm plan claim <id>` in `grade10`, then `pnpm plan done` per group |
| 5 | Implementation-complete | Engineer, after verification | `pnpm plan implementation <id> --commit <sha> --component <id>` |
| 6 | Archived | Nobody | App repository archive workflow after verification |

- **What proves each stage** - [Change Stages](/p/shared/planning/change-stages). Deployment availability is tracked separately and does not wait for archive.

Ask the agent where a change stands to read this for one.

## The Ids Inside the Change

Different from the change id, and permanent once issued.

- **Three kinds, one prefix** — the capability's path with slashes as hyphens:
  `grade10-site-store-cross-sell-SC-01` a scenario in `spec.md`, `-US-01` a
  story in `user-journeys.md`, `-US1-TC1-1` a case in `feature-tcs.md` —
  [Naming](https://github.com/9gag/grade10-spec/blob/main/docs/governance/specs-to-test-cases.md#naming)
