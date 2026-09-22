# The Round's Readers

The challenger and verifier definitions a round dispatches. `.claude/agents/`
is canonical and mirrored nowhere: every platform reads these files, and
`pnpm run agent:check-parity` asserts the directory is here and that every
`perspectives[].agent` path in
[`openspec/schemas/grade10-planning/schema.yaml`](../../openspec/schemas/grade10-planning/schema.yaml)
resolves to one of them.

- **One perspective, one dispatch** — the round dispatches one challenger per
  perspective summoned and one verifier per group of findings, each given the
  draft and what is before it and never another reader's output. Several
  perspectives share one definition where they are one reader with one stance:
  the dispatch carries the perspective's name, and the definition says which
  reading is which
- **The table is the schema's** — a perspective is a row there, with its
  `name`, its `when` and its `agent`. The `workflow-round` skill reads them through
  `node scripts/openspec/perspectives.mjs`; nothing carries a second copy
- **`always` is per artifact** — a reader whose `when` is `always` runs on
  every round of the artifacts whose list names it. Only the simpler thing
  sits on every list, and it is the floor when a round has one reader
- **The model** — `opus` where the tech design's or a task group's round can
  dispatch the reader, because those two readings are held to the eight
  principles and read code; `sonnet` everywhere else. A file has one model, so
  a reader that sits on both kinds of list takes `opus`
- **Read-only** — every definition carries `tools: Read, Grep, Glob, Bash` and
  writes nothing. The round applies what the verifier says stands

The mapping from an artifact to its perspectives lives once, in
[`openspec/schemas/grade10-planning/schema.yaml`](../../openspec/schemas/grade10-planning/schema.yaml),
and is read through
[`scripts/openspec/perspectives.mjs`](../../scripts/openspec/perspectives.mjs).
This file carries no copy of it.

## Adding a Reader

1. Write the definition here, with `name`, `description`, `model` and
   `tools: Read, Grep, Glob, Bash`, and say what it is given, what it reads
   for, its stance and the table it returns
2. Add its `perspectives:` entry to the schema, with a `when` a draft can
   actually summon
3. Run `pnpm run agent:sync-parity && pnpm run agent:check-parity` and
   `node --test scripts/openspec/round-skill.test.mjs`

A reader with no `when` a draft can summon is not an entry, and a reader
nothing dispatches is deleted.
