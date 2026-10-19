# Storybook preview app

This project is the Storybook workbench for whole product pages. It composes
design-system primitives and `@grade10/ui` blocks as a consuming application
would; it is not a production application.

Where a story goes, how it is titled, and how screens, states, flows and
prototypes are drawn: [`docs/governance/storybook.md`](../../docs/governance/storybook.md).
The `storybook-workbench` skill walks a request through it, and
`pnpm storybook:check` holds every story to it.

## Composing primitives

- Before composing a design-system primitive — a dialog, toast, menu,
  tab set, and the like — read its source docblock and canonical stories in
  `packages/design-system/src/components/` and match the documented
  composition: canonical action order and variants, accessibility wiring
  (`DialogDescription` for `aria-describedby`, `aria-labelledby` hooks), and
  focus behaviour. The contract lives in prose, not prop types; nothing
  fails when it is ignored.
- The same applies to `@grade10/ui` blocks — read the block's docblock
  before placing it.
