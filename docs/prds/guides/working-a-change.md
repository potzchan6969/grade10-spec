---
title: Working a change
summary: One change id, eight files, four teammates — who writes what, and how you know it is your turn.
order: 4
---

## The Change Id

One id names the directory, and every command you run names that id.
`add-store-gift-receipt` — kebab-case, a verb and the thing it acts on.

- **Chosen once**, by whoever creates the change, and never renamed — the id
  is in the branch, the commits, the board, and every prompt below
- **Opened through the tooling**, never by hand — the `.openspec.yaml` recording
  its schema comes with it; a directory you make yourself records nothing
- **The whole address** — `openspec/changes/add-store-gift-receipt/` holds
  every artifact, and no second change is ever opened for the same work
- **Not the capability** — `grade10-site/store/gift-receipt` is what the
  change writes *about*; the ids inside the files carry that path instead

## The Eight Files, Four Hands

| # | File | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/planning-pm` | Always |
| 2 | `decisions.md` | Product manager | `/planning-pm` | Always — goals, non-goals, and what the interview settled |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/planning-pm` | Always — one nobody walks says so in it |
| 4 | `ui-design.md` | Designer, or the PM who already has the design | `/planning-design` | Optional — from the journeys, before the requirements |
| 5 | `specs/<capability>/spec.md` | Generated, the PM reads | `/planning-qa` | Always — the outline, then the requirements, with 6 between them |
| 6 | `specs/<capability>/feature-tcs.md` | Generated, QA reviews | `/planning-qa` | Always — blind, before the scenarios |
| 7 | `tech-design.md` | Engineer | `/planning-dev` | When a task group lands outside this store — or `design_waived: <why>` |
| 8 | `tasks.md` | Engineer | `/planning-dev` | Before anyone can build it |

Write your part and stop: an artifact invented ahead of its owner is worse than a
missing one. **Neither the PM nor the designer opens `spec.md`** — both of its
passes belong to the run that takes the two readings from the journeys, and the
PM is its reader of record rather than its author.

Two files every hand writes on. The PRD under `docs/prds/` is what the product
should be: a detail you learn goes there first, marked 🚧 or ❓, before your own
artifact cites it. `decisions.md` is what this change chose: a scope fact you
learn — a non-goal that turns out to be load-bearing, a goal no screen can
deliver — is a row revised there first, by whoever learned it. The PM keeps both
whole — [PRDs and OpenSpec](https://github.com/9gag/grade10-spec/blob/main/docs/governance/prd-and-openspec.md).

## What to Say to the Agent

The skill carries the rules — reading the capability, opening the change, the
interview, the store's rules for each artifact, validating, stopping at its own
edge. You carry the feature, the change id, and the store clone the agent writes
into. A prompt that repeats a rule goes stale first; if you ever have to write
"do not write tasks.md", fix the skill.

**PM** — the feature in a sentence

```text
/planning-pm add-store-gift-receipt

A gift receipt on a store order — a printable slip with no prices on it.
Write into the store clone, never into external/grade10-spec.
```

**QA** — the journeys and the decisions are the input, and both are already in the change

```text
/planning-qa add-store-gift-receipt

Write into the store clone, never into external/grade10-spec.
```

**Designer** — the Figma URL, the one thing no skill can read off the repository.
Specifying a new change is the PM's job, so run `/planning-pm` for that one and
`/planning-design` to supplement a change somebody else specified

```text
/planning-design add-store-gift-receipt

Two surfaces: the print action on the order page, and the slip itself.
Frames: <paste the Figma links>
Write into the store clone, never into external/grade10-spec.
```

**Engineer** — the handle, which lands in `.openspec.yaml` as `promoted_by`

```text
/planning-dev add-store-gift-receipt

Picking this up as @my-handle. Print rendering is server-side, so it earns a
tech design.
Write into the store clone, never into external/grade10-spec.
```

Four things the skill cannot know, so say them when they are true:

- **The decisions are already made** — "skip the interview, draft from what
  I've given you"; otherwise expect to be questioned before a word is written
- **You are two hands** — "I'm the engineer as well, carry it through to
  tasks.md"; each skill stops at its own edge unless you ask it to go on
- **Which capability you mean**, when a name is ambiguous — the full path,
  `grade10-site/store/gift-receipt`, not `gift-receipt`
- **You are in `grade10`** — most skills live in the store clone, and a role
  skill's copy there covers picking work up, not what an artifact must contain,
  so ask the agent to read the store's rules for each artifact. Give it the store
  clone before it writes — `/add-dir` in Claude Code, a second workspace folder in
  Cursor, whose `.cursor/skills` is this repository's `.claude/skills` under another
  name. [An agent workflow, end to end](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md) has the commands for that lane

## The Example, End to End

:::flow{title="add-store-gift-receipt" diagram="assets/diagrams/working-a-change.svg"}
# Product manager

*PM* — **Open the change** — `/planning-pm add-store-gift-receipt` and a sentence
saying what the feature is; the interview follows, and a question you are not the
right person for goes into the proposal's open questions, naming who settles it

## Leave Three Files, Then Hand Over

`proposal.md`, `decisions.md`, and `user-journeys.md`. What you commit has
journeys and no `spec.md`, which both gates refuse without a line saying why, so
write `awaiting: specs: <what is still to come>` in the change's
`.openspec.yaml` before you validate. The skill validates strictly before it
stops; fix what that names, then say the change is ready — for a designer where
it has a surface, and for `/planning-qa` either way.

# Designer

*Designer* — **Map the surface** — `/planning-design add-store-gift-receipt`;
a change with no user-facing surface writes no `ui-design.md` at all

## Link, Never Describe

One subsection per screen linking its Figma frame, exports named exactly,
states tied to the anchor each dresses — the requirements are not written yet.
A variant, a token, or a block that has to be built is work in
**grade10-spec** — flag it so `tasks.md` carries it.

# QA

*QA* — **Write the outline, then run the two readings** —
`/planning-qa add-store-gift-receipt` draws `## Purpose` and `## Feature set`
from the journeys and the 🚧 lines, commits that on its own, then drafts the
blind suite and the scenarios independently and reconciles them; a contradiction
it cannot settle goes back to the PM

## Review in Its Own Pull Request

`/tcs-review add-store-gift-receipt` walks the drafts one journey at a time and
records `actual`, `deprecated`, or still `draft`. A case built from no scenario
is a new requirement in disguise — send it back to the spec. `domain-tcs.md`,
`product-tcs.md` and `platform-tcs.md` are QA's, beside the durable specs.

# Engineer

*Engineer* — **Plan delivery on the same change** —
`/planning-dev add-store-gift-receipt`, picking it up as @your-handle so
`promoted_by` lands in the change's `.openspec.yaml`

## Write the Plan, Then Build

`tech-design.md` when a task group lands outside this store, or
`design_waived: <why>` in its place. `tasks.md` always — grouped by
layer, each task phrased as the spec scenario it makes pass, groups unclaimed
so an engineer claims one at pickup. Claim a group in `grade10`, work
test-first, and archive only once the code is **deployed** — not when the
branch merges.

## Leave the Archive Copy Out of the Tasks

The fold keeps `## Requirements` and nothing else, and `pnpm run archive:preflight`
holds four gates: proof of deploy, every task ticked, the feature set and
`user-journeys.md` carried across, and `--decisions-carried` saying which
decision rows outlived the change and went onto the capability's
`Product decisions` block. None of them could be ticked before the deploy, so
the plan carries no task for them.
:::

## How You Know It Is Your Turn

The change carries its own stage, one of eight, and the stage names the hand.
Paste the command below in the change's thread when it names you — how each
artifact gets written from there is [Agent Rounds](/p/shared/planning/agent-rounds).

| # | Stage | Hand | Say |
| --- | --- | --- | --- |
| 1 | Proposed | Product manager | `/plan <id>` |
| 2 | Designed | Designer · Tech PIC | `/design <id>` · `/tech <id>` |
| 3 | Specified | Product manager | `/specify <id>` |
| 4 | Planned | Engineer | `/tasks <id>` |
| 5 | Building | Engineer | `/build <id> <group>` |
| 6 | On staging | QA · Release hand | walks it · cuts it |
| 7 | Released | Release hand | — |
| 8 | Archived | Whoever archives | — |

- **On staging, Released and Archived have no command** — the deploy, the cut
  and the fold happen outside the agent
- **What proves each stage** — [Change Stages](/p/shared/planning/change-stages)

Ask the agent where a change stands to read this for one; [In Flight](/in-flight) shows it for all of them.

## The Ids Inside the Change

Different from the change id, and permanent once issued.

- **Prefixed by the capability's path**, slashes as hyphens —
  `grade10-site/store/gift-receipt` issues `grade10-site-store-gift-receipt-*`
- **Three kinds** — `-SC-01` a scenario in `spec.md`, `-US-01` a story in
  `user-journeys.md`, `-US1-TC1-1` a case in `feature-tcs.md`
- **Why the whole path** — two capabilities can share a name: `grade10-site/site/navigation`
  and `zzz-site/site/navigation` would otherwise both issue `navigation-SC-01`
- **Never renumbered** — a retired scenario is removed, a retired case marked
  `deprecated`, and the next one takes the next unused number; a task, a review
  comment and a test all point at an id, so a reused number rewrites every one
- **A renamed capability keeps its old prefix** — the ids were issued, and the
  readers take the prefix from the ids rather than from the directory
