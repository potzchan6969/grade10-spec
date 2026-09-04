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
  is in the branch, the commits, the board, and every command below
- **Created by the CLI**, never by hand — `openspec new change <id>` writes
  the `.openspec.yaml` that records the schema; a directory made by hand
  records nothing
- **The whole address** — `openspec/changes/add-store-gift-receipt/` holds
  every artifact, and no second change is ever opened for the same work
- **Not the capability** — `grade10-site/store/gift-receipt` is what the
  change writes *about*; the ids inside the files carry that path instead

## The seven files, four hands

| # | File | Written by | Skill | Required |
| --- | --- | --- | --- | --- |
| 1 | `proposal.md` | Product manager | `/planning-pm` | Always |
| 2 | `specs/<capability>/spec.md` | Product manager | `/planning-pm` | Always |
| 3 | `specs/<capability>/user-journeys.md` | Product manager | `/planning-pm` | Unless nobody walks it |
| 4 | `specs/<capability>/test-cases.md` | QA | `/planning-qa` | Optional |
| 5 | `ui-design.md` | Designer | `/planning-design` | Optional |
| 6 | `tech-design.md` | Engineer | `/planning-dev` | Optional |
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
Run `openspec instructions <artifact> --change add-store-gift-receipt` before
each file and work from what it returns — grade10's copy of this skill carries
picking work up, not what an artifact must contain. Write into the store
clone, never into external/grade10-spec.
```

Read the capability first, create the change through the CLI, run the
interview, work from `openspec instructions`, stop where your hand stops — all
of that is in the skills already. A prompt that repeats it is a second copy of
the rules to keep in step, and the one that goes stale first. If you ever have
to write "do not write tasks.md", the skill should have said it; fix the skill.

Four things the skill cannot know, so say them when they are true:

- **The decisions are already made** — "skip the interview, draft from what
  I've given you". Otherwise expect to be questioned before a word is written
- **You are two hands** — "I'm the engineer as well, carry it through to
  tasks.md". Each skill stops at its own edge, which is the point; going
  further is something you ask for
- **Which capability you mean**, when a name is ambiguous — the full path,
  `grade10-site/store/gift-receipt`, not `gift-receipt`
- **You are in `grade10`** — most skills live in the store clone and are not
  installed there. `openspec instructions <artifact> --change <id>` returns the
  same rules the skill would have applied; ask the agent to follow its output,
  and give it the store clone before it tries to write — `/add-dir` in Claude
  Code, a second workspace folder in Cursor. [An
  agent workflow, end to
  end](https://github.com/9gag/grade10-spec/blob/main/docs/governance/agent-workflow-example.md)
  has both, with prompts written for that lane

## The example, end to end

:::flow{title="add-store-gift-receipt"}
# Product manager

*PM* — **Create the change** — `openspec new change add-store-gift-receipt`,
then `/planning-pm add-store-gift-receipt`

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

`openspec validate add-store-gift-receipt --strict`, then say the change
needs picking up. The board already shows it as still being planned.

# QA

*QA* — **Derive the suite** — `/planning-qa`, which runs
`/spec-to-tcs add-store-gift-receipt`

## Read what the PM left

The journeys are the suite's sections; the scenarios beneath them are what
each case is built from. A case built from no scenario is a new requirement
in disguise — send it back to the spec.

## Commit the drafts on the same branch

`test(store): derive test cases for gift-receipt`. Every case lands `draft`,
so the spec's reviewer is not being asked to stand behind one.

## Review later, in its own pull request

`/tcs-review add-store-gift-receipt` walks the drafts with a human, one
journey at a time, and records `actual`, `deprecated`, or still `draft`.

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

*Engineer* — **Plan delivery on the same change** — `/planning-dev`

## Take it in hand

`pnpm run plan:preflight add-store-gift-receipt`, then add
`promoted_by: @your-handle` to the change's `.openspec.yaml`. Without it the
card still reads "proposed by" alone and the author never learns it was
picked up.

## Write the plan

`tech-design.md` when the change earns one. `tasks.md` always — grouped by
layer, each task phrased as the spec scenario it makes pass, groups
unclaimed so an engineer claims one at pickup.

## Carry the archive debt

The fold keeps `## Requirements` and nothing else, so `tasks.md` carries a
task to copy the feature set and `user-journeys.md` across.
`pnpm run archive:preflight` refuses the archive while they are uncarried.

## Build, then archive

Claim a group in `grade10` with `pnpm plan claim`, work test-first, and
archive only once the code is **deployed** — not when the branch merges.
:::

## How you know it is your turn

Nobody sends a message. The files themselves are the signal.

| What you see | What it means | Whose turn |
| --- | --- | --- |
| `proposal.md` alone | A reason, no requirements yet | PM |
| Deltas, no `user-journeys.md` | The capability may be one nobody walks — check before assuming | PM |
| Journeys, no `test-cases.md` | Nothing has been derived yet | QA |
| A user-facing change, no `ui-design.md` | Screens unmapped | Designer |
| No `tasks.md` | Still being planned — the only handover signal there is | Engineer |
| Every box ticked | Waiting on a deploy, then the archive | Whoever owns it |

`openspec status --change <id>` prints this for one change;
[In Flight](/in-flight) shows it for all of them.

## The ids inside the change

Different from the change id, and permanent once issued.

- **Prefixed by the capability's path**, slashes as hyphens —
  `grade10-site/store/gift-receipt` issues
  `grade10-site-store-gift-receipt-*`
- **Three kinds** — `-SC-01` a scenario in `spec.md`, `-US-01` a story in
  `user-journeys.md`, `-US1-TC1-1` a case in `test-cases.md`
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
