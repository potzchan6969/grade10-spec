---
name: land
description: Land one artifact or one task group of a change on main as the round's landing step - the hand's word, the record line, the round's row, the next hand told and what comes after read again. Use when a hand says land. Invoke as /land <change> <artifact|group>.
---

# The Landing

**What it is:** step 6 of the round, run on the hand's word and on nobody
else's.

```bash
pnpm run plan:land <change> <artifact|group> --perspectives <a,b> --stood "<what stood>" [--asked Q1,Q2] [--tests "<scenario: files>"]
```

One command: it writes the round's row and the landing commit together. There
is no separate row-writing step.

Then follow `round` for what the landing tells and what it wakes: the reply,
the next hand, and the re-read of everything after the artifact that moved.

## What `plan:land` Does, In Order

The steps, in order, are the header comment of
[`scripts/openspec/plan-land.mjs`](../../../scripts/openspec/plan-land.mjs):
this skill names no copy of them, only what you do with each refusal.

## What You Do With Each Refusal

- **Another teammate's word** — reply naming the hand the artifact waits on;
  reassigning the hand is the way around
- **Behind** — say which artifact is behind and whose hand it is, and run
  `/round reread <change>`
- **A lost lease twice** — reply in the thread saying the run lost and is
  stopping, and make no further push
- **The gate** — fix what it names, or say what it refuses; never pass it a
  flag it does not have

`pnpm land` becomes this step when one gate serves both repositories; until
then `pnpm run plan:land` is the command, and it runs the same checks.
