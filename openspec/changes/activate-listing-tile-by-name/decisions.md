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
| Q4 | What does a tile with no activation callback do? | Its name and photo stay inert - the proposal, @tangconst, 2026-09-11 | A default navigation inside the package — the consumer owns where a product opens |
| Q5 | Which keys open the name? | The keys its native control takes: Enter and Space on a button, Enter on a link - decided by @ecchochan, 2026-10-05 | Enter alone on both — a button that ignores Space is not a button |
| Q6 | Does the keyboard stop on both the photo and the name? | On the name alone: the name is the tile's one stop and the one control a screen reader announces; the photo opens on a pointer press and is no second stop — 24 tiles cost 24 Tab presses, not 48, and each product is announced once - decided by @ecchochan, 2026-10-05 | Two stops for one destination, the product announced twice |
| Q7 | Does a name that does not open take the underline? | No: it is plain text, with no underline and no focus, so the underline only ever means the name opens - decided by @ecchochan, 2026-10-05 | The underline on every name — a cue that promises a press that does nothing |
| Q8 | Does a tile given its product's address and no activation callback open? | Yes, as a link: a tile that has an address is a link to it. This change knows no address, so its rule speaks of the callback alone; `add-store-cross-sell`, which adds the address, modifies this requirement to "no callback and no address" at its fold - decided by @ecchochan, 2026-10-05 | Inert without a callback, address or not — a link that does not open |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| shared/ui/store-product-listing | Blind pass: which keys activate the name from the keyboard - Enter only, or Enter and Space - and is it the same where the tile is given its product's address and the name is a link? | Q5 |
| shared/ui/store-product-listing | Blind pass: on a tile whose photo and name both open the product, does the keyboard stop on both, or on one of them only, so a Tab user does not pass two stops for one destination? | Q6 |
| shared/ui/store-product-listing | Blind pass: does an inert name - sold out on a tile that sells, or a tile with no activation callback - take the hover and focus underline? The decisions make the underline the cue that the name opens, and say nothing of a name that does not. | Q7 |
