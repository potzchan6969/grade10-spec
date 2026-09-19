---
name: land
description: Land one artifact or one task group of a change on main as the round's landing step - the hand's word, the record line, the round's row, the next hand told and what comes after read again. Use when a hand says land. Invoke as /land <change> <artifact|group>.
---

# The Landing

**What it is:** step 6 of the round, run on the hand's word and on nobody
else's.

```bash
pnpm run round:row <change>                    # the round's row
pnpm run plan:land <change> <artifact|group>   # one transaction
```

Then follow `round` for what the landing tells and what it wakes: the reply,
the next hand, and the re-read of everything after the artifact that moved.

## What `plan:land` Does, In Order

1. Refuses a dirty working tree or a rebase in progress
2. Resolves the hand from `git config user.email` through the team map
   (`docs/prds/team.yaml`), refusing an e-mail the map does not name and a
   handle that is not the hand of the stage
3. Fetches `origin main`, records that sha, and rebases the change's branch on
   it
4. Refuses while anything before the artifact is behind, naming the artifact
   and the hand it waits on
5. Runs the gate - `validate:changes`, `check:manual`, `tcs:validate`
6. Commits `landed_by:` and the `rounds.md` row together
7. Pushes the branch with a lease, then `main` as a plain fast-forward
8. On a rejected push, reads `main` once more and retries; losing again, it
   says so and stops

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
