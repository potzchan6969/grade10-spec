## Goals

- A collector who taps a product's name on a listing tile opens the product,
  as the photo already does.
- A tile that sells keeps a sold-out product's name and photo inert.

## Non-Goals

- Navigation inside the package — the consumer decides route or modal.
- Always-visible link chrome — the hover and focus underline is the cue.
- Changing cart or price behaviour.
- Adaptive Filter chrome — `adapt-listing-filter-drawer`.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | What does the name do when pressed? | Reports the same tile activation as the photo, through the one callback the tile already takes - the proposal, @tangconst, 2026-09-11 | A second callback for the name — two ways to say one thing |
| Q2 | What shows that the name opens? | An underline on hover and on keyboard focus; the Figma Product Card frame stays photo, plain name and prices - the proposal, @tangconst, 2026-09-11 | A name drawn as a link at rest — chrome the design does not draw |
| Q3 | Does a sold-out product's name open? | Not where the tile sells — a tile given a cart handler keeps a sold-out name and photo inert; where the tile does not sell, a sold-out tile opens, since a surface that carries the collector on rather than selling has no reason to stop at a card nobody can buy - decided by @ecchochan, 2026-10-05 | Always inert — a dead end on a surface that exists to carry the collector on |
| Q4 | What does a tile with no activation callback and no address do? | Its name and photo stay inert - the proposal, @tangconst, 2026-09-11 | A default navigation inside the package — the consumer owns where a product opens |
| Q5 | Which keys open the name? | The keys its native control takes: Enter and Space on a button, Enter on a link - decided by @ecchochan, 2026-10-05 | Enter alone on both — a button that ignores Space is not a button |
| Q6 | Does the keyboard stop on both the photo and the name? | On the name alone: the name is the tile's one keyboard stop that opens the product and the one control a screen reader announces for it; the photo opens on a pointer press and is no stop — 24 tiles cost 24 Tab presses to open, not 48, and each product is announced once. The cart control keeps its own stop - decided by @ecchochan, 2026-10-05 | Two stops for one destination, the product announced twice |
| Q7 | Does a name that does not open take the underline? | No: it is plain text, with no underline and no focus, so the underline only ever means the name opens - decided by @ecchochan, 2026-10-05 | The underline on every name — a cue that promises a press that does nothing |
| Q8 | Does a tile given its product's address and no activation callback open? | Yes, as a link: a tile that has an address is a link to it, and a plain press follows it with nothing reported. This change carries the rule: its tile requirement opens a tile given a callback or an address, and keeps it inert where it has neither; `add-store-cross-sell`'s requirement that a tile given an address is a link to it says how the link behaves - decided by @ecchochan, 2026-10-05 | Inert without a callback, address or not — a link that does not open |
| Q9 | Where does the rule that a sold-out tile opens where it does not sell live? | In the tile requirement this change modifies, with `shared-ui-store-product-listing-SC-97` as its scenario, since it is part of when any tile opens; `add-store-cross-sell`'s requirement "A sold-out tile still opens where its activation is handled" and its SC-91 leave that change's delta, so the durable spec states the rule once - decided by the round | The rule in two requirements, one from each change |
| Q10 | Is a tile always given its product's name? | Yes: the name is a supplied fact the tile requires as text, the name a screen reader reads the tile as (`ProductCardProps.name`, `packages/ui/src/blocks/store-product-listing/product-card.tsx:30`), and the catalogue authors a title for every product. A tile with no name is outside the contract, as one with no price is - decided by the round | The photo as the stop where the name is empty — a second rule for a tile no surface draws |
| Q11 | Do **Responsive layout** and **Load more** stay their own parts of the capability's map? | Yes, as the durable spec already places them: no other part means either, and moving them changes no outcome a shopper meets while it moves anchors other changes serve - decided by the round | Each folded into a part that already exists — Tile contract, Filters and sort |
| Q12 | Does the product page's rule that the storefront opens a card from the grid hold for a sold-out card? | Only where the card opens. The product page keeps the card's own address and the no-page-load rule; which cards open, and from which control, is the surface's rule - the listing's for the listing, where a sold-out card opens neither (Q3), and the front door's for its row. The listing page's **Every product** line says the same - decided by the round | The product page's rule unconditional beside the listing's, the same fact stated two ways |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-product-listing | Blind pass: which keys activate the name from the keyboard - Enter only, or Enter and Space - and is it the same where the tile is given its product's address and the name is a link? | Q5 |
| shared/ui/store-product-listing | Blind pass: on a tile whose photo and name both open the product, does the keyboard stop on both, or on one of them only, so a Tab user does not pass two stops for one destination? | Q6 |
| shared/ui/store-product-listing | Blind pass: does an inert name - sold out on a tile that sells, or a tile with no activation callback - take the hover and focus underline? The decisions make the underline the cue that the name opens, and say nothing of a name that does not. | Q7 |
| shared/ui/store-product-listing | R1 — Review: the page's Product decisions rows **Responsive layout** and **Load more** ask whether each belongs as its own part of the capability's map. Options: (a) keep both as their own Feature set groups, as the durable spec already places them; (b) fold each into a group that already means it. Recommended: (a). Owner: product manager | Q11 |
| shared/ui/store-product-listing | Blind pass: a tile that opens and is given no product name, or an empty one - what opens it from the keyboard and what does a screen reader announce for it? The name is the tile's one stop and the photo is none, and the tile contract's supplied facts list price, sold-out, cart action and image but not the name, so nothing says a name is always there. | Q10 |
