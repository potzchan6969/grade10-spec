## Purpose
What shows under a card on its own page: the cards the stock keeper chose for
it and the cards like it, up to six, in the response as the page arrives, and
what fills the rail, in what order, and when it shows nothing.

## Feature set

- The rail
  - Place and heading: under the card, headed You may also like, in the page's response
  - Order: the picks first in the stock keeper's order, then similar cards, up to six
  - Opens the card: a tile opens its card's own page; nothing in the rail adds to the cart
  - Nothing to show: no rail and no space where there are no picks and no similar cards
  - Never itself: the card being read is never in its own rail
- Picks
  - Chosen in Shopify: the cards a stock keeper picks on the card, in the dashboard, in their order
  - Left out: a pick the catalogue no longer holds
  - Sold out: a pick nobody can buy stays, says so and still opens
  - Reaches the page: with the card's own page
- Similar cards
  - Shared facts: a card sharing this card's world, its language or its type, weighed in that order, newest first among equals
  - Nothing shared: no similar cards
  - For sale only: a card nobody can buy is never among them
  - Moves with the catalogue: appears and leaves as the store's copy of the catalogue moves
- Rail block
  - One export: the rail composes the tiles it is given, with the heading, and draws no cart control
