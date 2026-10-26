---
name: storybook-workbench
description: Draw a feature's screens, states, click-through journeys, Scenarios and prototypes in the workbench Storybook, placed and named the way the manual reads. Use when a designer or anyone asks to add or change a story, a state, a Scenario or a prototype, or to show a feature's stories.
---

# Storybook Workbench

The rules are [`docs/governance/storybook.md`](../../../docs/governance/storybook.md);
read it before the first story of a session. This skill is the order to work
in. A designer asks in three plain parts — the feature, the kind, the state:

- `Appointment › Booking: add a "No slots this month" state to Book Visit`
- `Vault › Portfolio: draw the "Retrieval requested" state of the asset card from <Figma link>`
- `Store › Cart: let me set the discount, the code and the points on the drawer`
- `Grading › Drop Off: wireframe the booking screen from its journeys`
- `Vault › Portfolio: /prototype three empty states`
- `Show me every state of Book Visit at 375px`

## Steps

1. **Find the feature** — its manual page under
   `docs/prds/products/grade10-site/<domain>/<feature>.md` (or `shared/auth/`),
   and the active change on it, if any. No page: stop and ask for one; never
   invent a domain or feature
2. **Read what exists** — the feature's folder in `apps/preview/src/pages/`,
   its Blocks in the sidebar (`pnpm storybook`, or the Storybook MCP's
   `get-stories-by-component`), the change's `ui-design.md` States table, the
   `user-journeys.md` beside each spec the page names, and
   `pnpm storybook:coverage --gaps` for what the feature still owes
3. **Pick the kind** — a whole screen or its state is a story under `Screens`; a
   journey walked screen to screen is a click-through; an outcome that turns
   on what staging is set to is the Screen's Scenario; a screen not yet designed is a
   wireframe Prototype; three directions to choose from is a Prototype; a piece
   only this feature draws is a Part; an `@grade10/ui` export's own state is a
   Block story, beside the block. A new block, variant or token is the
   designer's call and Design Override's; say so rather than adding one
4. **Name it** — the title from the grammar; each state story named with the
   State column's words. A state the table lacks goes into `ui-design.md`
   first, and a rule found while drawing onto the manual page, marked 🚧 or ❓
5. **Build it** — compose existing blocks and primitives; content and stand-in
   data in the feature's `*-content.ts`; screens fullscreen; a journey's
   buttons open the next screen's story through `workbench-story-nav.ts`,
   with `parameters: { journeys: [...] }` naming the journey ids it walks.
   Every state story gets a `play` interaction test that asserts what its
   Shows cell says, and reaches a state the reader gets to by acting with
   `userEvent` from the default (`docs/governance/storybook.md#states`).
   Where the outcome turns on what staging is set to, add the Screen's
   Scenario, as `docs/governance/storybook.md#scenarios` says: one `Scenario`
   story whose settings reach every case, and each case a unit-test row. A
   wireframe sits under `apps/preview/src/prototypes/<domain>/<feature>/`,
   one story per state, with a note on what the design must settle. A
   `/prototype` draft runs
   `/prototype` inside one `Prototypes/<Piece>` story tagged `!test` under
   `apps/preview/src/prototypes/<domain>/<feature>/`
6. **Check it** — `pnpm storybook:sort` when a manual page was added, renamed
   or reordered, then `pnpm storybook:check`, `pnpm --dir apps/preview exec tsc -b`,
   and `pnpm test:stories:app` (or the MCP's `run-story-tests` on the stories
   you touched); `pnpm run test:stories:ui` when a block story changed
7. **Hand back** — one link per story, `http://localhost:6006/?path=/story/<id>`,
   each with the state it shows in a line; for a prototype, the picker's keys
   and each direction's trade-off. After a pick, fold the direction in and
   delete the prototype file in the same commit

## Stops

- **Design Override** — a commit that changes a line in `apps/preview/src/pages`,
  `packages/ui/src/blocks` or the design system stops. Show your person the
  lines; only on their yes, end the message with `Design-Override: <what
  changes and why>`. Never `--no-verify`
- **No page, no story** — a feature the manual does not have is a product
  question before it is a story
