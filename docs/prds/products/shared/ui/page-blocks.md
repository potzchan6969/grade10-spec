---
title: Page Blocks
spec: shared/ui/page-blocks
order: 15
---

The parts a site page composes rather than drawing its own: a titled card of
facts and its loading cards, short lines one under the other, a rail of
stages, and an empty panel. Grading's collector pages use them; each page
supplies the words, the figures and the callbacks.

## The Blocks

- **`FactCard`** - one titled card of facts: a lead, label and value
  rows, a body and actions, each drawn only when given
- **`FactCardSkeleton`** - the cards a read will fill, as one loading
  line a screen reader hears once
- **`NoteList`** - short lines one under the other, a divider between two
  lines and none after the last
- **`StageRail`** - stages in order with the current one marked; an ended
  case stays where it ended, and a narrow screen scrolls the rail, not the
  page
- **`EmptyPanel`** - nothing here yet: a title, the line under it and the
  way out

A page finds each block by the slot it gives it; given none, a block keeps
the design system's own.

::story{id="page-blocks-factcard--every-part" title="A fact card with every part"}

::story{id="page-blocks-notelist--with-link-item" title="A line carrying a link"}

::story{id="page-blocks-stagerail--financed-mid" title="A rail at its fifth stage"}

::story{id="page-blocks-emptypanel--with-action" title="An empty panel with a way out"}

:::detail{title="Product decisions" for="pm"}
Design Override refuses a site page that draws a card, a list, a table, a
stepper or an empty state from the design system, so these parts are store
blocks every site page can compose.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One set for every site page | Decided | First drawn for the vault as vault-named blocks, then named for any page when grading's collector pages met the same rule; a second, grading-named set was rejected as two copies of one shape | Design |
| Found by slot | Decided | Each block takes the `data-slot` a page's tests and walks find it by, keeping the design system's own when given none, so no page reaches for a `className` on a store block | Design |
| No existing block moves | Decided | `BookingSteps` and `GradingStatusRail` keep their stage unions; `StageRail` is the rail a page draws its own stages with | Design |
| Story ids | Decided | `page-blocks-<component>--<state>`, the package's `Page Blocks/<Component>` title | Design |
:::
