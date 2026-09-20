---
name: plan
description: Run a round on the product manager's three artifacts of a change - proposal.md, decisions.md and the journeys - and open the change where there is none. Use when a product manager or a designer says what is wanted, in the planning channel or a terminal. Invoke as /plan <what is wanted>, or /plan <change>.
---

# The Product Manager's Round

**The artifacts:** `proposal.md`, `decisions.md` and
`specs/<capability>/user-journeys.md`, in that order. They stop there: the
requirements are `/specify`'s.

**The rules:** `planning-pm` - the interview, the PRD marks, what each file
holds and where a statement belongs - plus, as you reach each artifact:

```bash
openspec instructions proposal --change <change>
openspec instructions decisions --change <change>
openspec instructions user-journeys --change <change>
```

Then follow `round`: it holds the six steps, the readers, the questions, the
landing and the re-read. One round per artifact.

## Opening a Change From One Sentence

A sentence addressed to the app in the planning channel that names no existing
change opens one. From a wake the sentence is the first of `.round/relay.json`'s
`messages`; from a terminal it is the argument.

**A sentence that overlaps a change in flight** — read what is in flight
before opening, off what the store already prints: `pnpm run plan:preflight`
lists the changes, `pnpm run spec:id <capability>` names the change carrying a
delta on the capability the sentence is about, and each change page in the
manual shows its stage (`stageOf` in
[`tools/manual/src/api/stages.ts`](../../../tools/manual/src/api/stages.ts)). A
change whose proposal links the page sections the sentence would mark overlaps
it too. `openspec/changes/archive/` is read for the last row alone, which is
the only one an archived change answers. Where one overlaps, answer in that
change's thread and take the row for its stage and who asked. The rows are
`shared/planning/agent-rounds`' own, under **A first sentence opens a
change**, and nothing beyond them is restated here:

| The change in flight is | The run does |
| --- | --- |
| Proposed or Designed, and the sentence is its product manager's | Extends it: the sentence is a remark on its proposal, the chain is redrawn, and the reply names the change - decided by the round |
| Proposed or Designed, and the sentence is another hand's | Writes a held row on its product manager: extend, recommended |
| Specified or Planned | Writes a held row on its product manager: extend where the moved part is smaller than a task group of work, split otherwise |
| Building | Writes a held row on its product manager: split, recommended; supersede where the sentence contradicts what is built |
| On staging, Released or Archived | Opens a new change, with `depends_on:` naming it |

Where no change overlaps, or where the row above opens a new change, what the
sentence opens:

1. **The id** — drawn from the sentence with `slugOf` as
   [`tools/manual/src/editor/propose.ts`](../../../tools/manual/src/editor/propose.ts)
   derives it
2. **The record** — `pnpm openspec new change <id> --schema grade10-planning`,
   with `depends_on: <change>` in it where the row above named one, and from a
   wake `node scripts/openspec/relay-post.mjs --bind <change>` right after it,
   which makes the thread the change room's alias
3. **The hand** — `hands: pm: @<handle>`, the asker's handle from the team map
   (`docs/prds/team.yaml`). An asker the map does not name opens the change
   with its product manager unnamed, and the reply says so and asks for the
   handle
4. **The branch** — `claude/<id>`, pushed
5. **The reply** — the change's id, said back in the thread that message
   started, which `pnpm run round:thread <change> <channel>/<ts>` records

A message naming a change that already exists is answered in that change's
thread, the reply names that change's id, and nothing is opened.

## What Is Yours to Ask

The interview is the ask step. Everything after it the round handles: a
preference or a product decision becomes a numbered `Q<n>` row with your
recommendation, and a product detail becomes a ❓ line on the page.

## The Whole Plan in One Wake

- **The three files start the chain** — draft ahead, as `round` says, in the
  order the schema gives them, and landed nowhere
- **Where the chain stopped** — hand on with the change's `awaiting: specs:`
  line only where it stopped before the requirements, as `planning-pm` says
