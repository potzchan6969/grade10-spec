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
change opens one:

1. **The id** — drawn from the sentence with `slugOf` as
   [`tools/manual/src/editor/propose.ts`](../../../tools/manual/src/editor/propose.ts)
   derives it
2. **The record** — `pnpm openspec new change <id> --schema grade10-planning`
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
recommendation, a product detail becomes a ❓ line on the page, and the three
files land one at a time on the product manager's word.

## The Whole Plan in One Wake

The three files are the start of the chain, not the end of the run. Draft
ahead, as `round` says: `/design` where a surface moves, `/tech`, `/specify`
and `/tasks` in turn - the tech design before the requirements, as the
schema orders them - each from the draft before it and each read by its own
perspectives, pushed after every artifact and landed nowhere. A held
question does not stop the chain - draft on its recommendation and list it
first in the summary; a dated `awaiting:` line does, for what depends on it.
The product manager then reads the held questions, not seven documents, and
one `land` lands every artifact of their hand in order; the artifacts of the
designer's and the engineer's hands wait on their own word, and the landing
tells them.

Hand on with the change's `awaiting: specs:` line only where the chain
stopped before the requirements, as `planning-pm` says.
