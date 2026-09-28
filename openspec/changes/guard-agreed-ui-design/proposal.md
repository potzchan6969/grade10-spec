# Guard the agreed UI design

**Author:** @ecchochan - 2026-09-28

Product context: [Design Override](../../../docs/prds/products/shared/design-sync/design-override.md), under [Design Sync](../../../docs/prds/products/shared/design-sync/index.md).

## Why

Implementation keeps changing what the designer already agreed, and nobody
notices until she checks Storybook again.

- **#667** - a banner was moved into `@grade10/ui` from a copy older than the
  designer's polish a day before. The layout and motion she set disappeared,
  and she republished them two days later in #675
- **#30** - the designer's merge of `main` into her branch (`c865b8565`)
  kept her old product card beside an engineer's new types. The card broke,
  and she fixed it 35 minutes later in #33
- **#185 and #547** - an engineer flattened her per-status alert spacing, and
  another her mobile dialog padding, as part of "lint fixes". Both are still
  on `main`

Each commit landed unreviewed: all 640 merged pull requests in the store
carry no approval, and the team is moving to pushing to `main` directly, so
review cannot be the guard. The number to move: designer work lost without a
confirmed override, from four known cases in five weeks to none.

## What Changes

- **A commit that changes the agreed look stops** - in the store's blocks,
  primitives, preview pages and tokens, when a line setting a class, a
  variant, spacing, a motion value, a story title or a token value is
  removed or rewritten. New lines, moved code and formatting pass
- **A merge that drops either side's work stops** - in both repositories,
  for everyone, the designer included
- **Site page code that rebuilds a store block stops** - a card, dialog,
  drawer, tabs, table, stepper, list, empty state, pagination, breadcrumbs or
  radio card from the design system, or a `className` on a store block. A
  page that does it on purpose is listed with its reason in the application's
  layer check
- **The person confirms, not the agent** - a commit passes with
  `Design-Override: <what changes and why>` in its message, written only after
  the agent's person says yes
- **Checked again at push** - a rebased or cherry-picked commit is checked
  before it leaves the machine
- **The designer is told** - every override that reaches `main`, and every
  commit that skipped the check, is reported to her on the commit
- **The rule is in the instructions** - both repositories' `AGENTS.md`, and
  the build, bug-fix and frontend skills, say implementation keeps the agreed
  look and a missing state is the designer's

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

- `shared/design-sync/design-override` - what stops a commit, what passes one,
  who confirms, who is exempt, and who is told

## Impact

- **Store** - `scripts/design-override/` (the check), `.githooks/`, a
  `prepare` script that sets the hooks path, a workflow on push to `main`,
  `AGENTS.md`, and the `workflow-build` and `fix-bug` skills
- **Application** - `.githooks/` calling the store's check from
  `external/grade10-spec` and the layer check on staged files,
  `scripts/checks/check-frontend-layers.mjs` with the rebuilt-block rule and
  today's rebuilt pages listed, a `prepare` script that sets the hooks path
  for the repository and its submodule, a workflow on push to `main`,
  `AGENTS.md`, and the `frontend-structure` skill
- **Consumer apps** - none; no component export changes

## References

- [Design Override · Rules](../../../docs/prds/products/shared/design-sync/design-override.md#rules)
- [Design Override · Stops](../../../docs/prds/products/shared/design-sync/design-override.md#stops)
- [Design Override · Confirming](../../../docs/prds/products/shared/design-sync/design-override.md#confirming)
- [Design Override · Telling the Designer](../../../docs/prds/products/shared/design-sync/design-override.md#telling-the-designer)

## Follow-on changes

- A screenshot of every story, compared on `main`, so a change the line
  patterns miss is still seen
- The same stop for the admin frontends, once their screens come from the
  store
