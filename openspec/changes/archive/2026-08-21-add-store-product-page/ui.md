# UI: Product pages

## Screens

**No Figma frame exists for a card's page.** The page delivered here is a
stand-in assembled from primitives so the address has something to serve, and
it is the one part of this change a designer will replace. Designing it is
work in grade10-spec, against the live catalogue's fields.

## Components

From `@grade10/design-system`, all existing exports:

- `VStack`, `HStack` — the page's stacking and its label/value rows.
- `Text` — the card's name (`as="h2"`), the price, the labels and the copy.
- `Badge` — the grade (`variant="success"`) and the certificate number.
- `Button` — the page's action, rendered `disabled`.
- `Link` — back to the storefront.

Nothing from `@grade10/ui`: no compound component covers a detail page. Money
is formatted through `@grade10/utils/money` from minor units and a currency
code, never from a float.

## States

- **A card** — `A card answers whole`. Every field the catalogue holds for
  that card, rendered from the read that ran before the page did.
- **No such card** — `A slug the catalogue has nothing for`. The site's
  not-found surface, inside the site chrome, under a 404.
- **No loading state.** The read finishes before the page renders; there is no
  moment where the page is on screen without its card.
