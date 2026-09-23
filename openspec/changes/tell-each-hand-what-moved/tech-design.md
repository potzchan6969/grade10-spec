## Decisions

### What Moved Is Read From Git

Q1 and Q7 govern it: the record keeps one id per artifact, the before is git's.

- **The line's commit** — where the `reviewed:` id differs from the current
  one, `git log -1 --format=%H -S<id> -- <record>` through `walkGit`
  (`store/git.mts`) finds the commit that wrote it, `plan:land`'s own `L`
- **The before** — `upstreamOf`'s items and files read at that commit, one
  `git show <sha>:<path>` each through `walkGit`, a page through `parsePage`
  and `sectionTextOf`, hashed once with `contentIdOf`; a match is the before
- **No before** — no line, no commit or a missed hash is one whole move,
  major, and step 4 says which; a git refusal throws in `plan-land.mjs` and
  `archive-preflight.mjs`, and the manual keeps `walkGit`'s one warning
- **`since`** — `beforeOn` renamed, dating page files by `commitOf` too
- **Rejected** — walking history for a match, which helps only a line written
  outside `plan:land`; rebuilding the reading at a revision, where a changed
  link, capability or waiver reads whole; a per-unit id or text in the record;
  a second git reader beside `readBlobs`, so `GitIndex` is unchanged

### Units Come From One Outline Walk

Q1 governs it: one `outline` walk (`store/markdown.mts`) per file puts each
line in one unit — a Decisions row through `tableRows` keyed by Q-id, a
`### Requirement:` block, a case `CASE_HEADING` matches, each `##` section
less those, and the preamble before the first heading.

- **Key** — `<capability>/<key>` in `specs/**`; a repeated key reads it whole
- **Quote** — a unit trimmed of its common leading and trailing lines, a row
  by its moved cells; a property test holds that the units give back the text
- **Browser-safe** — both heading patterns move beside `outline`; none throws
- **Rejected** — `decisionRows`, `deltaRequirementSections` and
  `readTestCases`, three shapes with no text to quote, the last throwing on an
  old revision; a line diff, which cuts a row mid-cell

### The Class Is One Pure Function

Q3, Q4 and Q6 govern it. `decidedOf(cell)` takes off the ❓ wrapper by
`ASKED_OF`'s pattern and `recommended:`, then one attribution from a closed
set kept in `src/api` with `DECIDED_BY_THE_ROUND`, which `lib/held.mjs`
imports: `decided by the round`, `the owner's word`, `the round's word`, `the
<role>'s word`. A row is compared cell by cell and takes its largest class;
the first rule that matches decides.

| # | When | Class |
| --- | --- | --- |
| 1 | Equal once whitespace is collapsed, `/\s+/` as `contentIdOf` does | none |
| 2 | A unit added or removed | major |
| 3 | Equal once punctuation, `\p{P}` not touching a digit, is removed | small |
| 4 | A Decided cell | none on an equal `decidedOf` value, small where the ❓ wrapper was put on, else major |
| 5 | An Asked or Instead of cell | small |
| 6 | The proposal's `## Why` section | small |
| 7 | Anything else, the preamble included | major |

A taken recommendation reads none, so it needs no carve-out. Rejected:
classing by which artifact moved; a class the landing sets.

### Behind Keeps One State

Q3 and Q5 govern it: a major move holds, and small is today's Behind.

- **Types** (`src/api/types.ts`) — `Moved = { item, key, before?, after?,
  major }`; `UpstreamRead = { id, items, moved?, since? }`, the store writing
  `moved` through `movedOf`; `BehindArtifact = { artifact, moved, since? }`
- **Holding** — `holdsOf(behind)` in `src/api/stages.ts`, true on a major
  move: step 4 refuses every landing after it until its own landing or read;
  `archive-preflight.mjs` still refuses any behind artifact
- **Surfaces** — My turn and the digest read each of the person's behind
  artifacts; the chip says whether it holds
- **Deleted** — `newer`, `firstNewerOn`, `beforeOn`, `changed`, `whole`, the
  dated branch of `behindOf`, and `oldest` with the `newer` block
- **Rejected** — a `read` verb and a second state; `holds` stored on the read

### Every Artifact Landing Writes the Line

Q7 and Q8 govern it: a hand's landing writes `reviewed:`, a tick never does.

- **One read** — step 4 reads the change over a worktree at `MAIN` with the
  landing's carried and written files laid over it, the overlay kept from
  `reviewedAfterDecisions`; it gives both the verdict and the id
- **No line** — for an artifact with nothing before it and for a group;
  `readAgainst`'s refusal fails no landing
- **Shallow clone** — step 3's `fetchMain` runs `git fetch --unshallow` where
  `git rev-parse --is-shallow-repository` says true, else stops with stderr
- **`--reviewed`** — an artifact landing carrying only the record: it resolves
  the hand in step 2 and skips the row and the held rows; the bypass and the
  other `reviewedOnly` branches are deleted
- **Relay** — `checkReviewed` (`tools/relay/src/land.ts`) gains `checkWord`'s
  check of the word and the hand, keeping its record-only path check; the
  `reread` job's agent redraws for the hand's word
- **Rejected** — the id over the branch checkout or tip, a tree `main` never
  holds; the dates as a fallback, which a tick moves; the agent landing a read

### One Message Per Person Per Landing

Q2 governs it: `toldOf` in `src/api/told.ts` replaces `newlyBehind`, and
`lib/moves.mjs`, `rereadMatrixOf` and Told now, with an empty base, call it.

- **Reach** — a unit `(item, key, after)` in `moved` at the head and not at
  the base; a whole reading is one unit keyed by the artifact, the id after
- **Key** — `messagesOf` builds `<change>:behind:<handle or role>` against
  the run's sent-keys file, one message per handle or unnamed role
- **Words** — `movedText` (`lib/wording.mjs`) replaces `behindText` in the
  message, Told now, the digest and `behindLabelOf`; the kind stays `behind`
- **Rejected** — a message per artifact; `toldOf` in node-only `lib/moves.mjs`

## Service Interfaces

- **`movedOf(item, before, after) → Moved[]`** — pure, `src/api/moved.ts`;
  split, pairing and class are private, the class table tested through it

  ```text
  movedOf("decisions", "| Q3 | … | ❓ pm - recommended: X | … |", "| Q3 | … | X - the owner's word | … |") → []
  movedOf("decisions", "| Q3 | … | Every move holds | … |", "| Q3 | … | A major move holds | … |")
  → [{ item: "decisions", key: "Q3", before: "Every move holds", after: "A major move holds", major: true }]
  ```

- **`toldOf(base, head) → Told[]`** — pure; `Told = { hand?, roles: Role[],
  behind: BehindArtifact[] }`, worded by `movedText`, which quotes a unit once

  ```text
  *What moved* on <change>, before `tech-design`, `tasks`
  `decisions` Q3, major — before: Every move holds — after: A major move holds
  Holds every landing after `tech-design` until you read it again or land it.
  ```

## Risks / Trade-offs

- [Risk] A changed link, capability or waiver, a line typed by hand, or an
  reaching `main` outside `plan:land` reads whole → held, step 4 says why, and
  `--reviewed` on its hand's word writes the line
- [Risk] A git refusal reads as a move → it throws in the scripts
- [Risk] `X - only for admins` reads as taken → the attribution set is closed
- [Risk] A linked page section is hashed whole
  ([Q10](decisions.md#decisions)), so a reworded unmarked line or another
  change's fold is major → one hash construction; step 4 quotes
  the section, and `--reviewed` on the hand's word clears it

## Migration Plan

1. **Backfill** — [Q9](decisions.md#decisions): a one-off script writes
   `readAgainst`'s current id for every in-flight, written, unwaived
   artifact with no line, 58 of 60 records, that `behindOf` does not name
   today; one it names gets none and is held whole
   until read, as today. It writes only a missing line, so a rerun is safe
2. **Silenced** — one commit touching only `reviewed:` keys, so `keysOnly`
   puts every change in `suppressed`. It lands before the code in one pull
   request, is rerun on it rebased just before merge, and the script goes
3. **Rollback** — revert the code; the old id comparison reads every line, so
   a before moved since its line, a taken recommendation included, reads
   behind until read, and no line takes the dated path. The backfill stays
