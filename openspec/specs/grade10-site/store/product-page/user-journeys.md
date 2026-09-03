## User journeys

### product-page-US-01: Collector reads a card at its own address

**As a** collector,
**I want** a product address to answer with that card's own page, and to refuse
when the catalogue holds no such card,
**so that** the page I read is the card the address names rather than an empty
product page.

**Accepted by:**

- `product-page-SC-01` — A card answers whole
- `product-page-SC-02` — Two cards, two pages
- `product-page-SC-03` — A handle the catalogue has nothing for
- `product-page-SC-04` — A card added to the catalogue answers

### product-page-US-02: Collector opens a card from the storefront

**As a** collector,
**I want** to reach a card's own address from the grid without a page load,
**so that** the card I opened is the one I land on, at an address that answers
on its own.

**Accepted by:**

- `product-page-SC-05` — A card is opened from the grid
- `product-page-SC-06` — The sitemap names no pattern

### product-page-US-03: Collector adds a variant to the cart

**As a** collector,
**I want** to add the variant I chose from the card's own page,
**so that** I can buy the grade I picked without leaving the card or returning
to the grid.

**Accepted by:**

- `product-page-SC-07` — A collector adds the grade they chose
- `product-page-SC-08` — A card with one thing to buy needs no choice
- `product-page-SC-09` — The collector keeps their place
- `product-page-SC-10` — The same card twice

### product-page-US-04: Collector meets a card with nothing for sale

**As a** collector,
**I want** a card that cannot be bought to say so where the buying happens,
still carrying its prices,
**so that** I can tell a card that sold from a page that failed.

**Accepted by:**

- `product-page-SC-11` — Nothing on the card is for sale
- `product-page-SC-12` — One grade sold, another still for sale
