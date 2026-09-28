---
title: Design Override
spec: shared/design-sync/design-override
order: 4
---

## Rules

| Rule | Value |
| --- | --- |
| 🚧 Agreed look | What `main` renders in the store's blocks, primitives, preview pages and tokens |
| 🚧 Runs | On every commit and every push, in the store and in the application repository |
| 🚧 Stops | A commit that changes the agreed look, a merge that drops either side's work, and site page code that rebuilds a store block |
| 🚧 Passes | A commit whose message ends with `Design-Override: <what changes and why>`; a page that rebuilds a block on purpose is listed with its reason in the application's block check |
| 🚧 Confirmed by | The person the committer works for; an agent never writes the line on its own |
| 🚧 Exempt | Commits the designer authored, committed or co-authored; a merge or a rebuilt block never is |
| 🚧 Told | The designer, on the commit, for every override that reaches `main` and every commit that reached it unchecked |

## Stops

| Stop | When | Where |
| --- | --- | --- |
| 🚧 Changes the look | A line setting a class, a variant, spacing, a motion value or a story's title is removed or rewritten, or a token is removed or changed | Store: `packages/ui/src/blocks`, `packages/design-system/src/components`, `packages/design-system/tokens.json`, `apps/preview/src/pages` |
| 🚧 Drops a side | A merge result leaves out a line either parent holds that the other did not remove | Both repositories, in the paths above and the site page code |
| 🚧 Rebuilds a block | Site page code uses a card, dialog, drawer, tabs, table, stepper, list, empty state, pagination, breadcrumbs or radio card from the design system, or gives a store block a `className` | Application: the site frontends and the site packages' `frontend` folders |

- 🚧 **What passes without a stop** — new lines, new files, new stories, code
  moved unchanged, whitespace, and lines that set no look; a reordered class
  list stops
- 🚧 **The stop names the lines** — each file, the line before and after, and
  who last set it and when, so the person asked can answer without opening
  the diff
- 🚧 **A check that cannot run** — refuses the commit or the push, naming
  what it could not read
- **A missing state or variant** — the designer draws it, never a local
  addition — [Design Sync](/p/shared/design-sync)

## Confirming

- 🚧 **One line per commit** — `Design-Override:` and a reason a teammate can
  read, as the message's last paragraph; an empty reason is refused
- 🚧 **Asked, never assumed** — an agent that meets a stop shows the lines to
  its person and waits; it never adds the line or the reason itself, and never
  skips the check
- 🚧 **A push checks again** — a rebased or cherry-picked commit is checked
  before it leaves the machine

## Telling the Designer

- 🚧 **Every override reaching `main`** — the designer is mentioned on that
  commit with the lines it changed
- 🚧 **A commit that skipped the check** — one that reaches `main` stopping
  and without the line is reported the same way; it is never reverted

:::detail{title="Code map" for="engineer"}
- **The check** — `scripts/design-override/` in the store; the application
  runs it from its pinned copy of the store
- **Rebuilt blocks** — `scripts/checks/check-store-blocks.mjs` in the
  application
- **Hooks** — `.githooks/commit-msg` and `.githooks/pre-push` in both
  repositories, set by `pnpm install`
- **Who is the designer** — the `design` role in `docs/prds/team.yaml`
:::
