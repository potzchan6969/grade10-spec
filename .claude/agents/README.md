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
  `name`, its `when` and its `agent`. The `round` skill reads them through
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

## Perspective to Reader

| Artifact | Perspective | `when` | Agent |
| --- | --- | --- | --- |
| The page's marks, `proposal.md`, `decisions.md`, `user-journeys.md` | product | `surface`, `copy` | `.claude/agents/product.md` |
| The same | the reader of the product | `copy` | `.claude/agents/reader.md` |
| The same | design | `surface` | `.claude/agents/design.md` |
| The same | backend | `schema`, `export` | `.claude/agents/backend.md` |
| The same | integration | `system` | `.claude/agents/integration.md` |
| The same | QA | `always` | `.claude/agents/qa.md` |
| The same | operations | `migration`, `flag`, `money`, `deploy` | `.claude/agents/operations.md` |
| `ui-design.md` | the journeys, walked | `surface` | `.claude/agents/design.md` |
| `ui-design.md` | the design system's inventory and its parity | `surface` | `.claude/agents/design.md` |
| `ui-design.md` | the words, as the reader would say them | `copy` | `.claude/agents/reader.md` |
| `tech-design.md` | deterministic, resilient, observable | `always` | `.claude/agents/tech.md` |
| `tech-design.md` | simple and clear | `always` | `.claude/agents/tech.md` |
| `tech-design.md` | consistent, modular, built on later | `always` | `.claude/agents/tech.md` |
| `tech-design.md` | testable and buildable | `always` | `.claude/agents/tech.md` |
| `spec.md`, `feature-tcs.md` | the two blind readings, then the reconciliation | — | none: `planning-qa`'s own passes |
| `tasks.md` | order and dependencies | `always` | `.claude/agents/operations.md` |
| `tasks.md` | tests first | `always` | `.claude/agents/qa.md` |
| `tasks.md` | the end-to-end group | `always` | `.claude/agents/qa.md` |
| `tasks.md` | migration and flag | `migration`, `flag` | `.claude/agents/operations.md` |
| A task group (`apply`) | missing pieces | `always` | `.claude/agents/build.md` |
| A task group (`apply`) | simplicity | `always` | `.claude/agents/build.md` |
| A task group (`apply`) | code smell | `always` | `.claude/agents/build.md` |
| A task group (`apply`) | the repository's conventions | `always` | `.claude/agents/build.md` |
| A task group (`apply`) | tests first | `always` | `.claude/agents/qa.md` |
| A task group (`apply`) | migration and flag | `migration`, `flag` | `.claude/agents/operations.md` |
| Every artifact and every task group | the simpler thing | `always` | `.claude/agents/simpler.md` |
| A group of findings | the verifier | — | `.claude/agents/verifier.md` |

- **The requirements are exempt** — `spec.md` and `feature-tcs.md` are
  challenged by the two independent readings `planning-qa` runs and verified by
  their reconciliation, so they carry no `perspectives:` entry and no verifier
- **Size on `tasks.md`** — the plan's size reading is the simpler thing's, so
  it is the one `always` entry rather than a second row
- **Two readings named for one reader** — `.claude/agents/design.md` holds the
  surface, the journeys walked and the inventory; `.claude/agents/reader.md`
  holds the page's words and a design's copy. Each is dispatched once per
  perspective, and the definition names which reading is which. The choice is a
  choice: one stance per reader, rather than one file per phrase

## Adding a Reader

1. Write the definition here, with `name`, `description`, `model` and
   `tools: Read, Grep, Glob, Bash`, and say what it is given, what it reads
   for, its stance and the table it returns
2. Add its row to this table and its `perspectives:` entry in the schema, with
   a `when` a draft can actually summon
3. Run `pnpm run agent:sync-parity && pnpm run agent:check-parity` and
   `node --test scripts/openspec/round-skill.test.mjs`

A reader with no `when` a draft can summon is not an entry, and a reader
nothing dispatches is deleted.
