# The Bug Readers

The challenger and verifier definitions a bug fix's rounds dispatch.
`.claude/agents/` is canonical and mirrored nowhere: every platform reads
these files, and `pnpm run agent:check-parity` asserts the directory is here
and that every `agent` path in the schema resolves to one of them.

- **The table is the schema's** — the `bug:` block of
  [`openspec/schemas/grade10-planning/schema.yaml`](../../openspec/schemas/grade10-planning/schema.yaml)
  names each round's readers, with their `name`, their `when` and their
  `agent`. `node scripts/openspec/bug-readers.mjs` reads it; nothing carries a
  second copy
- **Two rounds** — the diagnosis round and the fix round of
  [Bug Fixes](../../docs/governance/bug-fixes.md), which `/fix-bug` runs and
  dispatches
- **One perspective, one dispatch** — one challenger per perspective
  summoned, each given the report, the diagnosis and, in the fix round, the
  diff, and never another reader's output; then one verifier over every
  reader's findings where more than one ran. Several perspectives share one
  definition where they are one reader with one stance: the dispatch carries
  the perspective's name, and the definition says which reading is which
- **`always` is per round** — a reader whose `when` is `always` reads every
  run of that round. The simpler thing reads both rounds, and is the floor
  when a round has one reader
- **The model** — `opus` where a reading is held to the eight principles and
  reads code; `sonnet` everywhere else. A file has one model
- **Read-only** — every definition carries `tools: Read, Grep, Glob, Bash`
  and writes nothing. What the verifier says stands goes back to its round

## The Page Verifier

[`page-verifier.md`](page-verifier.md) is no round's reader: the
`handoff-page` and `checkpoint-digest` skills dispatch it on a built page,
before they publish it. It runs on `haiku`, because it checks each claim
against a source rather than weighing a design, and it writes nothing.

## The Digest Chunk

[`digest-chunk.md`](digest-chunk.md) is no round's reader either: the
`checkpoint-digest` skill dispatches one per chunk when `chunks.mjs` splits a
busy day. It is the one definition here that writes, and only its chunk's
file, which the skill's `merge.mjs` folds into the day's page. It runs on
`sonnet`, because it reads diffs and words the cards they draw.

## Adding a Reader

1. Write the definition here, with `name`, `description`, `model` and
   `tools: Read, Grep, Glob, Bash`, and say what it is given, what it reads
   for, its stance and the table it returns
2. Add its entry to the schema's `bug:` block, with a `when` a diagnosis or a
   diff can actually summon
3. Run `pnpm run agent:sync-parity && pnpm run agent:check-parity` and
   `node --test scripts/openspec/bug-readers.test.mjs`

A reader with no `when` a bug can summon is not an entry, and a reader
nothing dispatches is deleted.
