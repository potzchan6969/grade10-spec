# UI: A card is bought where it is read

## Screens

**No Figma frame exists for a card's page**, and none is drawn for the buying
either. The page it is added to is itself a stand-in
([`add-store-product-page`](../add-store-product-page/ui.md)), so the buy box
is assembled from primitives beside it and a designer replaces both together.
Designing them is work in grade10-spec, against the live catalogue's fields.

## Components

From `@grade10/design-system`, all existing exports:

- `RadioList` — the grades, as one group that owns which is chosen. Its
  optional `label` is the group heading.
- `RadioListItem` — one grade and its price. `disabled` is what a variant not
  for sale is rendered with; it dims the label as well as the control, so a
  sold-out grade reads as unchoosable rather than missing.
- `Button` — the add. Rendered `disabled` when nothing on the card is for sale.
- `Text` — the count of what the cart holds, and the line that says a card
  cannot be bought.
- `Badge` — unchanged: the grade and whether it is for sale, as the page
  already renders them.
- `VStack`, `HStack` — the buy box's stacking, as the rest of the page stacks.

Nothing from `@grade10/ui`, and nothing new in grade10-spec: every export above
exists today. `ListingBidPanel` is the analogous panel for the other product
and is deliberately not the model here — see tech-design.md, *The buy box is
composed in the app*.

Money is formatted through `@grade10/utils/money` from minor units and a
currency code, never from a float.

## States

- **A card with grades to choose between** — `A collector adds the grade they
  chose`. Every variant listed with its price, the one the page prices already
  chosen.
- **A card with one thing to buy** — `A card with one thing to buy needs no
  choice`. The single variant is the chosen one; a group of one is still the
  group, so the page does not change shape between the two cards.
- **A grade sold, a grade for sale** — `One grade sold, another still for
  sale`. Each variant reads as its own state, and the sold one cannot be
  chosen.
- **Nothing for sale** — `Nothing on the card is for sale`. The page says the
  card cannot be bought, every price still shown, and the add cannot be
  pressed.
- **Added** — `The collector keeps their place`. The collector is where they
  were; what the site says the cart holds accounts for the add.
- **No loading state for the card.** The read finishes before the page renders.
  The cart is the one thing the page does not know at first paint — browser
  storage reads empty where there is no browser — so what the cart holds is
  absent in the served document and appears once the browser has it, which is
  what keeps the served markup and the first client render identical.
