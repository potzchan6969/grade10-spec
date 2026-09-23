## Context

The motivation is the [proposal](proposal.md)'s. The machinery it changes:

- **Reading** — `upstreamOf` (`tools/manual/src/store/upstream.mts`) hashes
  all that is before each artifact with `contentIdOf` and dates the change's
  own artifacts, onto every in-flight entry
- **Verdict** — `behindOf` (`tools/manual/src/api/stages.ts`) compares the
  `reviewed:` id, or else the commit dates (`newer`); it names whole
  artifacts, never a row or a line
- **Record** — `reviewed:` is written by `plan:land --reviewed` with no hand's
  word and by `reviewedAfterDecisions`; 58 of 60 in-flight records carry none
- **Told** — `newlyBehind` (`scripts/openspec/lib/moves.mjs`) tells the
  earliest newly behind artifact's hand; Told now, the chip and the digest read
  that same artifact
- **Held** — `plan-land.mjs` step 4 and `archive-preflight.mjs` refuse on any
  behind artifact

## Goals / Non-Goals

**Goals:**

- **No new stored state** — one scalar `reviewed:` id per artifact; the before
  text is git's, and the class one pure function every reader shares

**Non-Goals:**

- **A second hasher** — `contentIdOf` and what it hashes stay as they are
- **The archive gate** — it refuses any behind artifact today and still does

## Decisions

### What Moved Is Read From Git

Q1 and Q7 govern it. Where an artifact's `reviewed:` id differs from its
current id, the store walks the commits touching what is before it, newest
first, to the first whose texts hash to the recorded id under `upstreamOf`'s
own construction. Those texts are the before, the checkout's the after, and
the next commit in the walk dates `since`. No match — a shallow checkout,
`NO_GIT`, an id never on `main` — reads the artifact behind as a whole, and
major. `upstreamOf` takes a text reader, so one construction serves the disk
and a revision; `GitIndex` gains a synchronous `log` and `cat-file` beside
`readBlobs`, since the snapshot is synchronous. Rejected: a per-unit id or a
text snapshot in the record, a copy of what git holds; the commit that wrote
the line, which is wrong for a backfilled id and needs the hash check anyway.

### Units Come From the Readers That Exist

Q1 governs it. `unitsOf` splits an item with the store's own parsers: a row
through `decisionRows`, a requirement through `deltaRequirementSections`, a
case through the section `readTestCases` finds, anything else by `##` section.
A row, a requirement and a case are quoted whole; a section from its first to
its last changed line. Rejected: a line-diff dependency, which cuts a row
mid-cell.

### The Class Is One Pure Function

Q3, Q4 and Q6 govern it. `classOf` reads a unit's kind and place, never its
meaning. A Decided cell that went from `❓ <role> - recommended: X` to `X`, or
to `X - <whose word>`, reads as unmoved; then the first rule that matches
decides.

| # | When | Class |
| --- | --- | --- |
| 1 | Equal once whitespace is collapsed | none |
| 2 | Added or removed | major |
| 3 | Equal once punctuation is removed | small |
| 4 | A row whose Decided cell moved, other than gaining the ❓ wrapper | major |
| 5 | Any other row move: Asked, Instead of, the ❓ wrapper put on | small |
| 6 | A line under the proposal's `## Why` | small |
| 7 | Anything else | major |

An artifact whose units all read none is not behind, so taking a
recommendation needs no carve-out: `reviewedAfterDecisions` and its call are
deleted from `plan-land.mjs`. Rejected: classing by which artifact moved,
which holds on a reworded Asked cell; a class the landing sets, a judgement
the non-goals rule out.

### Behind Keeps One State

Q3 and Q5 govern it. `BehindArtifact` gains `moved` and `holds`. Small is
today's Behind: shown, told, in the digest after seven days, refused by the
fold. Major adds `holds`, which step 4 of `plan-land.mjs` alone refuses on;
`archive-preflight.mjs` is unchanged. My turn and the digest read `behindOf`
for each of the person's artifacts, not the chip's earliest; the chip says
whether it holds. Rejected: a `read` verb and a second state beside behind.

### Every Artifact Landing Writes the Line

Q7 governs it. `plan-land.mjs` writes `reviewed:` beside `landed_by:` on every
artifact landing, its id read over `MAIN` with the landing's files laid over
it, through the overlay `reviewedAfterDecisions` uses today; a group landing
writes none, so a tick clears nothing. Deleted: `newer`, `firstNewerOn` and
the artifact's own date in `upstreamOf`, and the dated branch of `behindOf`.
A written artifact with no line reads behind as a whole, and major. Rejected:
the dates kept as a fallback, which a tick moves.

### One Message Per Person Per Landing

Q2 governs it. `toldOf` in `lib/moves.mjs` replaces `newlyBehind`: an artifact
is reached where its `moved` at the head holds a unit its `moved` at the base
did not, grouped by the handle of its role, keyed `<change>:<head>:<handle>` —
`<role>` for an unnamed hand — through the sent-keys file. `rereadMatrixOf`
reads the same reach; Told now calls `toldOf` with an empty base. Rejected:
one message per artifact, several to one person for one landing.

### The Hand Says It Was Read

Q8 governs it. `--reviewed` resolves the hand in step 2 like any landing; its
bypass and the wake with no sender are deleted. Rejected: the agent landing
the read.

## Service Interfaces

Pure over their arguments; only the walk reads git.

- **`unitsOf(item, text) → Unit[]`** — `Unit = { kind: "row" | "requirement" |
  "case" | "section", item, key, text }`

  ```text
  unitsOf("decisions", "…| Q3 | Does every move hold the next landing? | A major move holds … |…")
  → [{ kind: "row", item: "decisions", key: "Q3", text: "| Q3 | Does every move hold … |" }, …]
  ```

- **`classOf(unit, before?, after?) → "none" | "small" | "major"`** — no
  `before` is an added unit, no `after` a removed one

  ```text
  classOf({ kind: "row", item: "decisions", key: "Q4" },
    "| Q4 | … | ❓ pm - recommended: Everything … but a named small set | … |",
    "| Q4 | … | Everything … but a named small set - the owner's word | … |")
  → "none"
  ```

- **`toldOf(base, head) → Told[]`** — `Told = { key, id, hand?, role, reached:
  { artifact, holds }[], moved: { item, key, before?, after?, major }[] }`,
  worded by `movedText` in `lib/wording.mjs`

  ```text
  { key: "tell-each-hand-what-moved:4e1f0c2:ecchochan", hand: "ecchochan", role: "tech",
    reached: [{ artifact: "tech-design", holds: true }, { artifact: "tasks", holds: true }],
    moved: [{ item: "decisions", key: "Q3", before: "…Every move holds…", after: "…A major move holds…", major: true }] }

  *What moved* — before `tech-design`, `tasks` on <change>
  `decisions` Q3, major — before: Every move holds … — after: A major move holds …
  Holds your next landing of `tech-design`, `tasks` until you read it again.
  ```

## Risks / Trade-offs

- [Risk] The walk slows the snapshot → it runs only where the ids differ,
  stops at the first match, and reads a revision in one `cat-file --batch`
- [Risk] A checkout without history holds every move → closed on purpose; the
  manual, notify, digest and test workflows fetch in full, and on a shallow
  relay clone step 4 fetches `main` unshallowed once and reads again
- [Risk] An artifact reaching `main` outside `plan:land` has no line and holds
  → step 4 names it; `--reviewed` on its hand's word writes the line
- [Risk] An answer that extends the recommendation reads unmoved → the taken
  reading allows nothing after `X` but ` - <whose word>`, the form
  `takeRecommendations` writes (`lib/held.mjs`)

## Migration Plan

1. **Backfill** — a one-off script writes, for each in-flight change and each
   written, unwaived artifact with no `reviewed:` line, the content id of what
   was before it at the artifact's own last commit, which is what the dated
   path reads as drawn; it writes only a missing line, so a rerun writes
   nothing
2. **Silenced** — one commit touching only `reviewed:` keys, so `keysOnly`
   puts every change in `suppressed`: no message, no re-read wake; it lands
   before the code in one pull request, and the script is deleted after it
3. **What moves** — an artifact whose linked page section changed after its
   last commit now reads behind, which the dated path never showed; the dry
   run lists them first
4. **Rollback** — revert the code commit and the dated path returns, reading
   the backfilled lines by id; revert the backfill commit, also suppressed,
   to restore today's verdicts exactly
