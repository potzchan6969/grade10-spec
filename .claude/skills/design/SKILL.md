---
name: design
description: Run a round on a change's ui-design.md - the screens, the exports each composes and the states each carries - from the journeys. Use when a change alters something a user sees. Invoke as /design <change>.
---

# The Designer's Round

**The artifact:** `ui-design.md`, drawn from the page sections the change
links, the proposal, the decisions and the journeys. A change with no
user-facing surface writes none, and the record says `ui_waived: <why>`.

**The rules:** `planning-design` - what the file holds, what it links rather
than restates, and the design reference (Storybook,
`packages/design-system`, `packages/ui`, `packages/i18n`) it stands on - plus:

```bash
openspec instructions ui-design --change <change>
```

Then follow `round`: it holds the six steps, the readers, the questions, the
landing and the re-read.

## What the Round Adds Here

- **The frames come from the designer** — the ask carries the links to the
  frames. A screen no frame in the ask covers writes a dated
  `awaiting: ui-design: "<date>, <screen> - @<handle>"` line in the change's
  record, and the draft describes no screen of its own in its place
- **A state is a bullet** — a state a reader sees goes in `## States`, with
  the journey it serves; a product detail a state needs goes on the page as a
  ❓ line first
- **A designer specifying a new change** — that is `/plan`'s lane, the way
  `planning-design` routes it: the proposal, the decisions and the journeys
  first, with the design reference handed over with them
