## Goals

- A collector reading a card finds up to six other cards worth opening under
  it, without going back to the listing.
- A stock keeper chooses the cards shown with a card once, in Shopify, and
  sees them on the page.
- A card with nothing to show keeps its page whole: no rail, no empty space.

## Non-Goals

- Customers also bought, from orders — its own change once the store has
  orders to count.
- A rail on the product listing, in the cart drawer or at checkout.
- Personalisation per collector.
- Bundles and discounts.
- A picks screen in the admin panel.
- Shopify's own ranking as the source of the similar cards.
- Recently viewed.
- The ZZZ store.
- Testing rail variants against each other.
- Ordering or curating the similar cards by hand.
- Auction lots.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where do the per-card picks live? | In Shopify, on the card, chosen by the stock keeper in the dashboard; which Shopify mechanism holds them is the tech design's | A picks screen in the admin panel — a second store of product data with its own screen, sync and permissions |
| Q2 | What makes a card similar, and in what order? | Same world, then same language, then same collectible type; newest first among equals; never the card itself; sold-out cards left out of the similar cards | Language after type — a Japanese and an English card are different markets to a collector |
| Q3 | Does customers-also-bought ship now? | No — phase two, its own change once orders exist | Shipping the rule now hidden until it has signal — a section nobody has seen cannot be tested or told broken; seeding it by hand — curation, not a rule |
| Q4 | One rail or one per source, and how many cards? | One rail, up to 6, the picks first in their order then similar cards to fill, unlabelled, shown even with just one card | One rail per source — labels a distinction no collector acts on; hiding a one-card rail — a chosen pick is a stock keeper's deliberate act |
| Q5 | Does the rail sell? | No — a rail card opens the card's page; the rail carries no cart control | Adding from the rail — the listing tile sells, so the rail block must be able to turn that control off |
| Q6 | Where does the rail show? | The product page only | The cart drawer and checkout — a conversion experiment for after the store has traffic |
| Q7 | What moves if this works? | Share of product-page sessions that open a second card from the rail, and their add-to-cart rate; unmeasured until instrumented | A launch target — the store is not public and nothing can be measured for months |
| Q8 | How fresh are the picks on the page? | Within the product page's own minute — the page reads the shop live behind a minute's cache, and the rail makes no new promise | Citing the listing mirror's 10 s and 5 min windows for the picks — the card's own read does not read the mirror; the similar half does (Q19), a fact engineering learned after this row |
| Q9 | Is Shopify's own recommendation API out? | No — it may be how the picks are read; only ranking the similar cards by it is out, as the non-goals say | Ruling it out outright — the picks may have no other read |
| Q10 | Extend the redesign or open a new change? | A new change, `depends_on: redesign-store-product-detail-page` as build order; the rail's place is a requirement of `grade10-site/store/cross-sell` - decided by the round after the readers | Extending the redesign — mid-build, and its scope is the card's own presentation; a second delta on `grade10-site/store/product-page` for the rail's place — opens a fold collision to say what the rail's own spec can say |
| Q11 | What does a card tagged with no world show? | Similar cards by whichever of the three facts it does carry; none carried, no similar cards - decided by the round | A ❓ on the page — the rule follows from Q2 and needs no new fact |
| Q12 | Is the rail in the page's response or added after? | In the response, before any script runs - decided by the round | Loaded after — the page moves when the rail appears, and "no empty space" is a promise the response keeps and a script does not |
| Q13 | What is the rail headed? | **You may also like** - decided by the round | Customers also like — implies orders the store does not have |
| Q14 | Does a sold-out card's own page show the rail? | Yes - decided by the round | Hiding it — a collector who cannot buy this card is the one most worth a next card |
| Q15 | Is this now or after launch? | Now — the picks are a stock keeper's work and can be loaded before the store opens | After launch — leaves the stock keeper's picks unseen until traffic exists |
| Q16 | Can a collector tell a chosen pick from a computed one? | Nothing names a card as chosen or computed; a sold-out card in the rail is always a pick, and that is accepted - decided by the round | One availability rule for the whole rail — never showing a sold-out card drops a stock keeper's deliberate pick; always showing fills the rail with unbuyable cards |
| Q17 | Does a sold-out pick still open its card? | Yes — the rail exists to carry a collector on, and an inert tile among openable ones reads as broken; the listing tile is inert when sold out, so an openable sold-out tile is design work in Figma and component work in this store - decided by the round, confirmed by the designer | An inert sold-out tile — no component work, and a dead end in the rail |
| Q18 | Is "nothing to show" a journey of its own? | No — it is a state of the collector's walk; the journeys are the collector's two and the stock keeper's - decided by the round | A third collector journey whose want is the absence of the rail |
| Q19 | How fresh are the similar cards? | The page states one clock, the product page's minute, and the rail makes no new promise; that the similar list rides the store's copy of the catalogue is the tech design's, and the spec says a card that sells out leaves the similar cards as that copy catches up | A second 🚧 line on the page naming the catalogue's minutes — two speeds for one rail, in the store's words rather than the collector's |
| Q20 | What shape does a rail card cross the wire in? | The listing's product summary, the shape the listing tile already takes - decided by the round | A new cut for the rail — a third card shape; the mirror's internal card — a mirror-internal shape leaking into a public contract; `ProductSummary` on the wire — a display-ready React prop type, corrected by the tech PIC: the wire carries the per-tile shape `catalog.products` answers and the page maps it |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
