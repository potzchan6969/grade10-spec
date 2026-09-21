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
- Ordering or curating the similar picks by hand.
- Auction lots.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Where do the per-card picks live? | In Shopify, on the card, chosen by the stock keeper in the dashboard; which Shopify mechanism holds them is the tech design's | A picks screen in the admin panel — a second store of product data with its own screen, sync and permissions |
| Q2 | What makes a card similar, and in what order? | Same world, then same language, then same collectible type; newest first among equals; never the card itself; sold-out cards left out of the similar picks | Language after type — a Japanese and an English card are different markets to a collector |
| Q3 | Does customers-also-bought ship now? | No — phase two, its own change once orders exist | Shipping the rule now hidden until it has signal — a section nobody has seen cannot be tested or told broken; seeding it by hand — curation, not a rule |
| Q4 | One rail or one per source, and how many cards? | One rail, up to 6, the picks first in their order then similar cards to fill, unlabelled, shown from one card | One rail per source — labels a distinction no collector acts on; hiding a one-card rail — a chosen pick is a stock keeper's deliberate act |
| Q5 | Does the rail sell? | No — a rail card opens the card's page; the rail carries no cart control | Adding from the rail — the listing tile sells, so the rail block must be able to turn that control off |
| Q6 | Where does the rail show? | The product page only | The cart drawer and checkout — a conversion experiment for after the store has traffic |
| Q7 | What moves if this works? | Share of product-page sessions that open a second card from the rail, and their add-to-cart rate; unmeasured until instrumented | A launch target — the store is not public and nothing can be measured for months |
| Q8 | How fresh are the picks on the page? | Within the product page's own minute — the page reads the shop live behind a minute's cache, and the rail makes no new promise | Citing the listing mirror's 10 s and 5 min windows — the product page does not read the mirror |
| Q9 | What is out? | The non-goals above | Ruling out Shopify's `productRecommendations` outright — it may be how the picks are read; only ranking the similar cards by it is out |
| Q10 | Extend the redesign or open a new change? | A new change, `depends_on: redesign-store-product-detail-page`, carrying its own delta on `grade10-site/store/product-page` for the rail's place | Extending the redesign — mid-build, and its scope is the card's own presentation |
| Q11 | What does a card tagged with no world show? | Similar cards by whichever of the three facts it does carry; none carried, no similar cards - decided by the round | A ❓ on the page — the rule follows from Q2 and needs no new fact |
| Q12 | Is the rail in the page's response or added after? | In the response, before any script runs - decided by the round | Loaded after — the page moves when the rail appears, and "no empty space" is a promise the response keeps and a script does not |
| Q13 | What is the rail headed? | **You may also like** - decided by the round | Customers also like — implies orders the store does not have |
| Q14 | Does a sold-out card's own page show the rail? | Yes - decided by the round | Hiding it — a collector who cannot buy this card is the one most worth a next card |
| Q15 | Is this now or after launch? | Now — the picks are a stock keeper's work and can be loaded before the store opens | After launch — leaves the stock keeper's picks unseen until traffic exists |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
