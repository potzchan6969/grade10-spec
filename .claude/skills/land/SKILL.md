---
name: land
description: Land one artifact or one task group of a change on main as the round's landing step - the hand's word, the record line, the round's row, the next hand told and what comes after read again. Use when a hand says land. Invoke as /land <change> <artifact|group>.
---

# The Landing

**What it is:** step 6 of the round, run on the hand's word and on nobody
else's.

```bash
pnpm run plan:land <change> <artifact|group> --perspectives <a,b> --stood "<what stood>" [--asked Q1,Q2] [--tests "<scenario: files>"] [--with-recommendations]
```

One command per artifact: it writes the round's row and the landing commit
together, and there is no separate row-writing step. One word lands the chain:
`land` runs it once per drafted artifact of the speaker's hand, in the chain's
order, and stops at the first artifact of another hand, who is told it is
their turn. While a held row is open the command refuses and names the rows;
`land with recommendations` is the same word with `--with-recommendations`,
which writes each held row's recommendation in the landing commit. From a
wake, the hand is the wake's sender and `main` moves through the relay, never
by the run's own push. The perspectives named are ones the
artifact's list issues, every `always` reader among them; a task group whose
tasks cite a scenario id owes `--tests` an entry per id, and the landing
names the ids left out.

Then follow `round` for what the landing tells and what it wakes: the reply,
the next hand, and the re-read of everything after the artifact that moved.

## What `plan:land` Does, In Order

The steps, in order, are the header comment of
[`scripts/openspec/plan-land.mjs`](../../../scripts/openspec/plan-land.mjs):
this skill names no copy of them, only what you do with each refusal.

## What You Do With Each Refusal

- **Another teammate's word** — reply naming the hand the artifact waits on;
  reassigning the hand is the way around
- **A held row** — reply with the rows it named; the hand answers them, or
  says `land with recommendations`
- **The relay's 403** — reply with the check it named and stop; a 409 is one
  re-read and one retry
- **Behind** — say which artifact is behind and whose hand it is, and run
  `/round reread <change>`
- **A lost lease twice** — reply in the thread saying the run lost and is
  stopping, and make no further push
- **The gate** — fix what it names, or say what it refuses; never pass it a
  flag it does not have

`pnpm land` becomes this step when one gate serves both repositories; until
then `pnpm run plan:land` is the command, and it runs the same checks.
