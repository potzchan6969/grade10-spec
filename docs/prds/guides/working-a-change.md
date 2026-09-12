---
title: Working a change
summary: One change id, seven files, four hands — who writes what, and how you know it is your turn.
order: 4
---

A change is one directory named by one id, and every command you run names
that id. This page walks a single feature through all four hands, so you can
find your part and see what the person before you left you.

## The change id

The handle for everything. `add-store-gift-receipt` — kebab-case, a verb and
the thing it acts on.

- **Chosen once**, by whoever creates the change, and never renamed — the id
  is in the branch, the commits, the board, and every prompt below
- **Opened through the tooling**, never by hand — ask for the change and the
  `.openspec.yaml` recording its schema comes with it; a directory you make
  yourself records nothing
- **The whole address** — `openspec/changes/add-store-gift-receipt/` holds
  every artifact, and no second change is ever opened for the same work
- **Not the capability** — `grade10-site/store/gift-receipt` is what the
  change writes *about*; the ids inside the files carry that path instead

## The seven files, four hands

| # | File | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/planning-pm` | Always |
| 2 | `specs/<capability>/spec.md` | Product manager | `/planning-pm` | Always |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/planning-pm` | Always — one nobody walks says so in it |
| 4 | `specs/<capability>/feature-tcs.md` | Product manager | `/planning-pm` | Always — unless the journeys file says `**Walked by:** nobody` |
| 5 | `ui-design.md` | Designer | `/planning-design` | Optional |
| 6 | `tech-design.md` | Engineer | `/planning-dev` | When a task group lands outside this store — or `design_waived: <why>` |
| 7 | `tasks.md` | Engineer | `/planning-dev` | Before anyone can build it |

Write your part and stop. An artifact invented ahead of the person who owns
it is worse than a missing one.

## What to say to the agent

The skill carries the rules. You carry the feature. A whole prompt is the
skill, the change id, and a sentence of what you want:

```text
/planning-pm add-store-gift-receipt

A gift receipt on a store order — a printable slip with no prices on it.
```

**QA's is shorter still**, and usually the whole prompt: the journeys are the
input, and they are already in the change.

```text
/planning-qa add-store-gift-receipt
```

**A designer adds the frames**, because a Figma URL is the one thing no skill
can read off the repository.

```text
/planning-design add-store-gift-receipt

Two surfaces: the print action on the order page, and the slip itself.
Frames: <paste the Figma links>
```

**An engineer adds their handle**, which the skill would otherwise stop to ask
for — it goes in `.openspec.yaml` as `promoted_by`.

```text
/planning-dev add-store-gift-receipt

Picking this up as @my-handle. Print rendering is server-side, so it earns a
tech design.
```

**Cursor types the same slash commands.** It reads skills from
`.cursor/skills`, which is this repository's `.claude/skills` under another
name, so every prompt above goes into the agent panel unchanged. What Cursor
has no equivalent for is `/add-dir` — the store clone reaches it as a second
workspace folder, and that is the prompt worth writing down, because it is the
one you send from `grade10`:

```text
/planning-pm add-store-gift-receipt

A gift receipt on a store order — a printable slip with no prices on it.

I'm in grade10, with the store clone as the second folder in this workspace.
Read the store's own rules for each artifact before you write it — the copy of
this skill here covers picking work up, not what an artifact must contain.
Write into the store clone, never into external/grade10-spec.
```

Read the capability first, open the change, run the interview, work from the
store's rules for each artifact, validate before handing over, stop where your
hand stops — all of that is in the skills already, and each runs the commands
it needs. A prompt that repeats any of it is a second copy of the rules to keep
in step, and the one that goes stale first. If you ever have to write "do not
write tasks.md", the skill should have said it; fix the skill.

Four things the skill cannot know, so say them when they are true:

- **The decisions are already made** — "skip the interview, draft from what
  I've given you". Otherwise expect to be questioned before a word is written
- **You are two hands** — "I'm the engineer as well, carry it through to
  tasks.md". Each skill stops at its own edge, which is the point; going
  further is something you ask for
- **Which capability you mean**, when a name is ambiguous — the full path,
  `grade10-site/store/gift-receipt`, not `gift-receipt`
- **You are in `grade10`** — most skills live in the store clone and are not
  installed there. Ask the agent to read the store's rules for each artifact
  and follow them; they are the same rules the skill would have applied. Give
  it the store clone before it tries to write — `/add-dir` in Claude Code, a
  second workspace folder in Cursor. [An
  agent workflow, end to
  end](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md)
  has both, with the commands written out for that lane

## The example, end to end

:::flow{title="add-store-gift-receipt"}
# Product manager

*PM* — **Open the change** — `/planning-pm add-store-gift-receipt`, and a
sentence saying what the feature is

## Get interviewed

The skill runs the grilling interview before it writes anything. Facts about
the store are its job to find; decisions are yours. A question you are not
the right person for is deferred into the proposal's open questions, naming
who should settle it — it does not hold the draft.

## Leave three files

`proposal.md` — the collector problem, the evidence, a metric that would
move, the non-goals. `spec.md` — the requirements, each scenario id'd
`grade10-site-store-gift-receipt-SC-01`. `user-journeys.md` — the stories,
each accepted by scenarios that exist.

## Hand over

The skill validates the change strictly before it stops. Fix what that names,
then say the change needs picking up — the board already shows it as still
being planned.

# QA

*QA* — **Review the suite** — `/planning-qa`; the PM derived it beside the
journeys with `/spec-to-tcs`, every case `draft`

## Read what the PM left

The journeys are the suite's sections; the scenarios beneath them are what
each case is built from. A case built from no scenario is a new requirement
in disguise — send it back to the spec.

## Review in its own pull request

`/tcs-review add-store-gift-receipt` walks the drafts with a human, one
journey at a time, and records `actual`, `deprecated`, or still `draft`. A
draft commits nobody to anything, so the spec's reviewer is never asked to
stand behind a case.

## Own the passes above it

`domain-tcs.md`, `product-tcs.md` and `platform-tcs.md` are QA's, and they
live beside the durable specs, never under a change.

# Designer

*Designer* — **Map the surface** — `/planning-design`

## Skip it when there is nothing to see

A change with no user-facing surface writes no `ui-design.md` at all.
Nothing downstream waits on it.

## Link, never describe

One subsection per screen, each linking its Figma frame. Exports named
exactly. States tied to the scenario that defines each.

## Flag what does not exist yet

A variant, a token, or a block that has to be built is work in
**grade10-spec** — flag it here so `tasks.md` carries it.

# Engineer

*Engineer* — **Plan delivery on the same change** —
`/planning-dev add-store-gift-receipt`

## Take it in hand

Say you are picking it up as @your-handle, and `promoted_by` lands in the
change's `.openspec.yaml`. Without it the card still reads "proposed by" alone
and the author never learns it was picked up.

## Write the plan

`tech-design.md` when the change earns one. `tasks.md` always — grouped by
layer, each task phrased as the spec scenario it makes pass, groups
unclaimed so an engineer claims one at pickup.

## Leave the archive copy out of the tasks

The fold keeps `## Requirements` and nothing else, and
`pnpm run archive:preflight` refuses the archive while the feature set and
`user-journeys.md` are uncarried. A task for it could never be ticked before
the deploy, so the plan does not carry one.

## Build, then archive

Claim a group in `grade10`, work test-first, and archive only once the code is
**deployed** — not when the branch merges.
:::

## How you know it is your turn

Nobody sends a message. The files themselves are the signal.

| What you see | What it means | Whose turn |
| --- | --- | --- |
| `proposal.md` alone | A reason, no requirements yet | PM |
| Deltas, no `user-journeys.md` | The stories are owed — a capability nobody walks says `**Walked by:** nobody` in the file, so a missing one is never the exemption | PM |
| Deltas, and no 🚧 line under a section the proposal links | The page is unmarked — mark it, or record `page_waived: <why>` in `.openspec.yaml` | PM |
| Journeys, no `feature-tcs.md` | The suite is derived beside the journeys with `/spec-to-tcs` | PM |
| A suite of `draft` cases | Review, in its own pull request | QA |
| A user-facing change, no `ui-design.md` | Screens unmapped | Designer |
| No `tasks.md` | Still being planned — the only handover signal there is | Engineer |
| Every box ticked | Waiting on a deploy, then the archive | Whoever owns it |

Ask the agent where a change stands to read this for one of them;
[In Flight](/in-flight) shows it for all of them.

## The ids inside the change

Different from the change id, and permanent once issued.

- **Prefixed by the capability's path**, slashes as hyphens —
  `grade10-site/store/gift-receipt` issues
  `grade10-site-store-gift-receipt-*`
- **Three kinds** — `-SC-01` a scenario in `spec.md`, `-US-01` a story in
  `user-journeys.md`, `-US1-TC1-1` a case in `feature-tcs.md`
- **Why the whole path** — two capabilities can share a name;
  `grade10-site/site/navigation` and `zzz-site/site/navigation` would
  otherwise both issue `navigation-SC-01`, and no reader could say which
- **Never renumbered** — a retired scenario is removed, a retired case marked
  `deprecated`; the next one takes the next unused number. A task, a review
  comment, and a test all point at an id, so a reused number rewrites every
  one of them silently
- **A renamed capability keeps its old prefix** — the ids were issued, and
  the readers take the prefix from the ids rather than from the directory

## The rules themselves

- [PRDs and OpenSpec](https://github.com/9gag/grade10-spec/blob/main/docs/governance/prd-and-openspec.md)
  — where a product brief stops and a spec starts.
- [Specs to test cases](https://github.com/9gag/grade10-spec/blob/main/docs/governance/specs-to-test-cases.md)
  — the suite's shape, and the two pull requests it rides in.
- [Task ownership](https://github.com/9gag/grade10-spec/blob/main/docs/governance/task-ownership.md)
  — the group format both repositories parse, and what a stale claim is.
- [An agent workflow, end to end](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md)
  — the same loop with the commands run from `grade10`.
