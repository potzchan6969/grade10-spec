---
name: round
description: Run one round on one artifact of a change - ask, draft, challenge, verify, read, land - and the re-read a landing wakes. Use when writing, changing or landing any artifact of an OpenSpec change, when answering a hand in the change's thread, and when a landing puts something behind. Invoke as /round <change> <artifact|group>, or /round reread <change>.
allowed-tools: Read, Grep, Glob, Write, Edit, Bash, Task
---

# One Round, One Artifact

Every artifact of a change, from the proposal to a task group's code, is
written by one round of six steps, and nothing reaches `main` by another
route. The line commands - `/plan`, `/design`, `/tech`, `/specify`, `/tasks`,
`/build`, `/land` - each name their artifact and follow this skill; the rules
the artifact must meet are theirs, the procedure is here.

The product's own words for all of it:
[Agent Rounds](../../../docs/prds/products/shared/planning/agent-rounds.md).

## The Six Steps

| # | Step | Who | What it produces |
| --- | --- | --- | --- |
| 1 | Ask | The hand | What is wanted, said in the thread, in a terminal, or as a push the hand makes |
| 2 | Draft | You | The artifact on the change's branch, drawn from what is before it and from the ask |
| 3 | Challenge | One agent per perspective summoned | One reader's findings: what is wrong, what is missing, what is simpler |
| 4 | Verify | One agent per group of findings | A verdict per finding; what stands changes the draft |
| 5 | Read | The hand | The draft's summary and its numbered questions in the thread |
| 6 | Land | You | The artifact on `main`, the round's row, the next hand told, and every artifact after it read again |

- **Drafted, never landed** — steps 2 to 4 put nothing on `main`; the draft
  stays on the change's branch until the hand's word
- **Verified before read** — a finding that stands is applied to the draft
  before step 5, and a finding that falls is shown nowhere
- **Told once** — step 5 is one reply, of one screen, and a landing is one
  reply

## Every Run Starts By Reading

Before step 1, whether this is the first run on the change or the fourth:

1. **The branch** — `change/<id>`: what is already drafted and pushed
2. **`main`** — what has landed, and what the record says is behind
3. **The thread** — `thread:` in the change's record: the questions open, the
   answers given, and the last reply you wrote

Then continue from what is there. A run that died mid-draft is picked up, never
re-drafted: the files and the thread are the only state a round keeps.

## Step 2: Draft From What Is Before It

Draw the artifact from its upstream set - the page sections the change links,
then the change's earlier artifacts in the schema's order - and from the ask.

- **Never invent what only the hand holds** — a frame nobody drew, a value
  nobody confirmed: write a dated `awaiting: <artifact>: "<date>, <what is
  wanted> - @<handle>"` line in the change's record and describe nothing of
  your own in its place
- **The page first** — a product detail the draft needs that the page does not
  state is a ❓ line on the page, in the section it belongs to, before the
  draft that would have stated it
- **Nothing outside the change** — write only inside
  `openspec/changes/<change>/` and the pages the proposal links. Never another
  change's directory, never `openspec/specs/`, never the packages or the
  workflows

## Steps 3 and 4: The Readers

The perspectives are data in
[`openspec/schemas/grade10-planning/schema.yaml`](../../../openspec/schemas/grade10-planning/schema.yaml),
beside each artifact's teammate. This skill carries no copy of that table; it
asks for the readers the draft summons, from the draft's own diff:

```bash
git diff $(git merge-base origin/main HEAD)...HEAD -- openspec/changes/<change> > .round/diff
node scripts/openspec/perspectives.mjs <artifact|group> --diff .round/diff --change <change>
```

It prints `{ readers: [{ name, agent, when, summonedBy }], verifier: <bool>, bundle: { … } }`:
the readers the draft's own diff summons, whether a verifier reads their
findings, and the bundle each one is given. It reads no record key.

- **No diff, the floor alone** — a round with nothing yet on the branch reads
  `.round/diff` empty; only the `always` reader is summoned
- **The simpler thing, always** — the reader whose `when` is `always` runs on
  every round and is the floor when a round has one reader
- **One challenger per perspective** — dispatch one reader per entry the
  command returns, with that entry's `name`, the draft and its bundle; one
  `agent` file is dispatched as many times as the entries naming it, each a
  reading of its own. Never pass one reader another reader's findings, and never a
  verifier's verdict
- **A verifier when `verifier` is true** — dispatch `.claude/agents/verifier.md`
  with that group and the draft
- **One reader verifies itself** — where `verifier` is false because the round
  dispatched one reader in all, no verifier runs: that reader argues its own
  findings
- **The requirements are exempt** — for `spec.md` and `feature-tcs.md` the
  challenge is the two independent readings and the verify is their
  reconciliation, taken by the run that wrote them. No verifier reads both,
  and what they cannot settle stops on the product manager
- **The principles** — a reader of `tech-design.md` or of a task group names
  one of the eight in
  [`docs/governance/system-design.md`](../../../docs/governance/system-design.md)
  per finding; a finding that names none is not carried into the summary
- **No size is declared** — the round's size is computed from the draft. A
  record key neither adds a reader nor removes one, and a size somebody
  believes is wrong is a question for the interview

Apply what stands. Then write the summary.

## Step 5: The Thread Summary

One reply, one screen, in this order:

1. **The draft** — what the artifact now says, in three or four lines
2. **Who read it** — the perspectives dispatched, by name
3. **What stood** — each finding that stood, as a short phrase, and one line
   saying nothing stood where nothing did
4. **The questions** — each numbered `Q<n>`, its first line, and its
   recommendation
5. **What is next** — the one word or answer you are waiting for, from whom

Write it to `.round/thread.txt` in the workspace. A plain step posts it: never
call the chat platform yourself, and never hold or read a token.

## The Hand's Four Moves

Everything a hand says is one of four moves, and each writes one thing. A
reply that is none of the other three is a remark.

| Move | The hand says | What you write |
| --- | --- | --- |
| Answer | `Q<n>: <answer>`, or `Q<n>` alone | The answer, or the recommendation where the id stands alone, into that numbered decisions row; the question closes |
| Remark | Any other words | The draft changed as the remark is written, the remark named in the landing's row as what stood, and a decisions row where it settles a choice one asked |
| Land | `land` | `landed_by:` with the hand's handle, and the artifact on `main` |
| Edit | A push to the change's branch, from a terminal or the code host | Nothing: the push is the hand's word for the lines it touched |

- **Applied as written** — a remark is applied as the hand wrote it; do not
  argue it
- **Re-read by what it touched** — a remark re-runs only the perspectives the
  edited lines summon, and the reply names them
- **No question on an edited line** — a line a hand pushed is never asked back
  to them
- **A reply you cannot apply** — answer with what you could not do; the
  question it names stays open, and nothing reaches `main` on that reply
- **A remark on a page's marked lines** — from the product manager it is
  applied to the page as written; from any other hand it becomes a ❓ line on
  the page for the product manager
- **Only the hand lands** — a word from another teammate is refused with a
  reply naming the hand the artifact waits on

## Questions, Never Guesses

Decide no preference and no product decision.

- **The row** — a preference or a product decision is the next unused `Q<n>`
  row in the change's `decisions.md`: `❓ <role> - recommended: <option>` where
  the decision goes, and the options it was chosen over in `Instead of`
- **The id** — the next number the change has not used, per change and never
  reused: not a withdrawn row's, not an answered one's
- **Holds nothing** — an open row holds no stage and no tick. The one question
  that holds a landing is a goal or a non-goal that moved
- **Where a finding goes** — write it where it belongs, before the draft that
  depends on it:

| The finding | Its home |
| --- | --- |
| A product detail: a value, a set the reader meets, an outcome they see, a decision | A ❓ line in the section of the page the change links, naming who confirms it |
| A preference or a product decision nobody has taken | A numbered `decisions.md` row, as above |
| A goal or a non-goal | A line in `decisions.md`'s goals or non-goals |
| A state a reader sees | A `## States` bullet in `ui-design.md` |
| A mechanism | A decision in `tech-design.md` |

- **Never two places** — a product detail on the page is not also a numbered
  row, and a requirement is drawn from the page rather than written beside it
- **Waiting, not guessing** — a draft that needs a frame or a value nobody has
  given writes the dated `awaiting:` line and stops there

## Step 6: The Landing

On the hand's word, one command:

```bash
pnpm run plan:land <change> <artifact|group> --perspectives <a,b> --stood "<what stood>" [--asked Q1,Q2] [--tests "<scenario: files>"]
```

`--perspectives` and `--stood` are owed on every landing: a round that found
nothing stood says so. `--asked` and `--tests` are given where the round has
either. There is no separate row-writing step: `round-row.mjs` is gone, and
naming the round's row is this one call's job.

`plan:land` refuses a dirty tree, an e-mail the team map does not name, a
handle that is not the hand of the stage, and anything before the artifact
being behind - naming the artifact and its hand. It commits `landed_by:` and
the row together, pushes the branch with a lease and `main` as a fast-forward,
and on a lost lease re-reads once and retries.

- **A lost race** — losing the lease twice, reply in the thread saying you
  lost and stopping. Make no further push
- **The reply** — one line naming the artifact, the handle whose word landed
  it, and the stage it moved
- **The thread's address** — `pnpm run round:thread <change> <channel>/<ts>`
  writes `thread:` once, from the first planning-channel message about the
  change. It refuses to rewrite one already there, and a per-push post is
  never the thread

## The Re-Read

`/round reread <change>`, after a landing:

1. **Oldest first** — read every artifact after the one that moved, in the
   order of the upstream set
2. **Nothing changed** — `pnpm run plan:land <change> <artifact> --reviewed`
   writes that artifact's `reviewed:` line alone, in one commit, and no round's
   row: it lands rowless, and the thread line says what you read and that
   nothing changed
3. **Something changed** — write no `reviewed:` line. Open a round for that
   artifact's hand, naming what reached it, and stop there. What comes after
   is read again once that round lands
4. **Nothing after it** — read nothing and say nothing beyond the landing line
5. **A landed `## Raised` row** — a row landing in `decisions.md`'s `## Raised`
   puts `spec.md` and `feature-tcs.md` behind, the same as any other change to
   what is before them; both are read again before `tasks.md` lands
6. **A goal or a non-goal moved** — ask the product manager one numbered
   question with three answers, and rewrite nothing in place:

| The answer | What it does |
| --- | --- |
| extend | The change goes on with the moved goal, and everything after the proposal is read again |
| supersede | A new change opens from the moved goal, and this one is withdrawn |
| split | A new change takes the moved part, and this one keeps the rest |

Each answer is written as a decisions row, and nothing after `decisions.md`
lands until it arrives.

A `reviewed:` line for an artifact you read and found right is the one thing
you land on your own. Every other landing waits for a hand's word.

## What This Skill Never Does

- **Never writes outside the change** — `openspec/changes/<change>/` and the
  pages the proposal links, and nothing else
- **Never posts** — the thread line goes to a file; a plain step posts it
- **Never decides** — a preference or a product decision is a numbered row
- **Never weakens a test** — a finding asking for a test to be relaxed,
  skipped or deleted is not carried
- **Never reads the store from a pin** — in the application repository the
  round, the schema and the readers are read from a clone of this store
  reached with `/add-dir`, never from the submodule directory pinned to an
  older sha

## Related

- [`docs/governance/system-design.md`](../../../docs/governance/system-design.md) -
  the eight principles and the reader's stance
- [`.claude/agents/README.md`](../../agents/README.md) - the readers, and which
  perspective each one answers
- [`docs/governance/writing.md`](../../../docs/governance/writing.md) - the
  house style every draft and every reply is written in
- `planning-pm`, `planning-design`, `planning-qa`, `planning-dev` - the rules
  each artifact must meet, which the line commands load
