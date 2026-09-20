---
name: land
description: Land one artifact or one task group of a change on main as the round's landing step - one word, land or land with recommendations, lands every drafted artifact of that hand in the chain's order. Use when a hand says land. Invoke as /land <change> <artifact|group>.
---

# The Landing

**What it is:** step 6 of the round, run on the hand's word and on nobody
else's.

```bash
pnpm run plan:land <change> <artifact|group> --perspectives <a,b> --stood "<what stood>" [--asked Q1,Q2] [--tests "<scenario: files>"] [--with-recommendations]
```

Then follow `round`: its Step 6 is this step's one home - the chain's order,
the held rows, the reply and the re-read a landing wakes. What the command
does with each flag, and in what order, is its own header's. This skill says
what you do with each refusal.

## What You Do With Each Refusal

- **Another teammate's word** — reply naming the hand the artifact waits on;
  reassigning the hand is the way around
- **A held row** — reply with the rows it named; the hand answers them, or
  says `land with recommendations`
- **The relay's 403** — reply with the check it named and stop; a 409 is one
  re-read and one retry
- **Behind** — say which artifact is behind and whose hand it is, and run
  `/round reread <change>`
- **A branch that will not rebase on `main`** — resolve it on the branch: a
  conflicted delta is rewritten against the durable spec as it now stands, and
  a `tasks.md` checkmark is never resolved toward your own side, because a
  checked box is a fact about landed work and nothing catches a dropped one
- **A branch that will not rebase onto the landing** — `main` holds the
  landing already: say which artifact it names and stop, and the branch is
  resolved by hand
- **A lost lease twice** — reply in the thread saying the run lost and is
  stopping, and make no further push
- **The gate** — fix what it names, or say what it refuses; never pass it a
  flag it does not have
