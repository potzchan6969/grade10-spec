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
| Q21 | When the picks cannot be read, does the rail still show similar cards? | Yes — similar cards fill the rail alone; only a product with no picks field at all reads as "no picks" - decided by the round | The whole rail absent — hides the similar cards for a failure that is not theirs |
| Q22 | When the store's copy of the catalogue is not held, do the picks show alone? | No — a pick's tile is drawn from that copy, so nothing can be shown; the card answers with no rail for that minute at that location - decided by the round | Reading the picks' tiles live from the shop — a second read on every cold request |
| Q23 | A card that is both a pick and a similar card? | Once, in its pick position - decided by the round | Twice — the rail would repeat a card |
| Q24 | More than six picks? | The picks past the sixth are not shown, and the stock keeper is told nothing; six is the rail's size, not the list's - decided by the round | Telling the stock keeper in Shopify — a surface this store does not own |
| Q25 | A pick the shop holds but no longer publishes? | Left out, as a pick the catalogue lost — the store's copy holds only what the shop publishes to it - decided by the round | Kept like a sold-out pick — its page would answer 404 |
| Q26 | Newest first — by what? | By when the card entered the store's catalogue, the order the listing already calls latest - decided by the round | The card's own release date — a fact the catalogue does not carry |
| Q27 | Does a card sharing two facts outrank one sharing only the first? | No — the order is strict: any card sharing the world ranks above every card that does not, whatever else it shares; two facts tie-break only among cards equal on the first - decided by the round | A score — two weak facts beating one strong one, which Q2 rules out |
| Q28 | Where do the two component widenings live? | As deltas on `shared/ui/store-home` and `shared/ui/store-product-listing`, the capabilities whose export contracts they change; cross-sell's export requirement names its own block and points at them - decided by the round | Stating the widened behaviour in cross-sell's own export requirement — a contract change recorded away from the contract |
| Q29 | Does a sold-out tile that opens contradict `activate-listing-tile-by-name`'s rule that a sold-out name stays inert? | Yes as both stand, and more than the row said: that change MODIFIES the tile requirement so that a sold-out tile's image and name both stay inert. The discriminator — inert where a cart handler is supplied, opens where none is — goes into that change's modified requirement, a round @htonyl takes as the owner of both the tile and the rail; group 1 lands first, and until the other change agrees, group 1 is the only place the guard exists | Reversing Q17 — an inert tile in a rail whose one purpose is to carry the collector on; a discriminator written only into SC-91's GIVEN — the paragraph above it is what an implementer reads |
| Q30 | Does the rail's `cards` prop keep the whole `ProductSummary`, four of whose fields (`inCart`, `cartCount`, `maxCartQuantity`, `remainingLabel`) the rail never draws? | Yes: the tech design's Contracts table names it unchanged as the block's prop type, `ProductList` takes the same shape, and task 4.3's page maps `related` to it once; the four fields the rail drops are named in the `cards` prop's doc | A non-exported `Pick` alias of the seven fields the rail draws — the type then refuses what the block ignores, at the cost of a second vocabulary for one tile |
| Q31 | Task 1.3 said the discriminator would be written into `activate-listing-tile-by-name`'s modified requirement before it is built; group 1 is built and it is written nowhere, so `SC-88` still states the rule the landed guard contradicts. Where does it land, and when? | As Q29 says: into that change's MODIFIED tile requirement with `SC-88`'s GIVEN gaining the cart handler, in a round @htonyl takes on that change before it has a `tasks.md`; task 1.3 reads "before that change is built", and this group carries the guard alone until then | A checkbox in this group editing the other change's delta — a build edits only its own change's artifacts |
| Q32 | An entry whose `createdAt` cannot be parsed sorts oldest in the listing and in the rail, silently: no counter, no line. Where is a bad stamp refused? | ❓ Recommended: in `projectionEntryOf`, which already throws on a product with no variant — the copy then reads `unreadable` and the held one stands, as the read already handles; @htonyl | A counter inside the sort; leaving the silent fallback |
| Q33 | The requirement says a card sharing a world comes before one sharing only a language; does a card sharing a world and a language come before a newer card sharing the world alone? The rule and its test say yes (the ordered triple); no scenario states it. | ❓ Recommended: a scenario of its own under "Similar cards fill the rail by what they share", pinning the ordered triple; @jeffffej0909 | Best-fact rank, or weights, both of which the design rejects |
| Q34 | Where the store's copy of the catalogue does not hold the card being read yet, the rail shows its picks alone and no similar card; the design's Failure table says so and no scenario does. Is that the collector's rule? | ❓ Recommended: a scenario under "Similar cards fill the rail by what they share" — the copy does not hold the card → its picks alone, as for a card sharing nothing — over folding it into SC-10, whose answer is no rail at all; @jeffffej0909 | No rail at all until the copy holds the card |
| Q35 | Does the rule carry the rail's six as a default, so the rule's own cases pin the number production uses? | Yes - decided by the round: `limit` defaults to `RELATED_RAIL_LIMIT` in the rule, citing the requirement; the compose passes none | Naming SC-04 and SC-27 a second time in 3.2 |
| Q36 | Is the shared triple carried as three booleans in order, or packed into one integer rank? | The triple - decided by the round: it reads as the requirement states the rule, and a fourth facet appends with no shift arithmetic | One integer rank, one allocation fewer per candidate |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| grade10-site/store/cross-sell | Blind pass: When the picks cannot be read, does the rail still show the similar cards, or is the whole rail absent? | Q21 |
| grade10-site/store/cross-sell | Blind pass: When the store's copy of the catalogue cannot be read for the similar cards, does the rail still show the picks alone? | Q22 |
| grade10-site/store/cross-sell | Blind pass: A card that is both a pick and a similar card: once, in its pick position, or twice? | Q23 |
| grade10-site/store/cross-sell | Blind pass: More than six picks: are the picks past the sixth dropped, and is the stock keeper told? | Q24 |
| grade10-site/store/cross-sell | Blind pass: A pick the catalogue still holds but no longer publishes: left out like a lost pick, or kept like a sold-out one? | Q25 |
| grade10-site/store/cross-sell | Blind pass: Newest first among equals: by when the card entered the store's catalogue, or by its release date? | Q26 |
| grade10-site/store/cross-sell | Blind pass: Is a card sharing two of the three facts ranked above a card sharing only the first? | Q27 |
| grade10-site/store/cross-sell | Blind pass: Narrow viewport: scroll, wrap, or fewer tiles, and does the cap hold there? | ❓ on the frame — `ui-design.md` Screens, awaited from @tangconst by 2026-09-24 |
| grade10-site/store/cross-sell | Scenario pass: the rail's export requirement states behaviour for `StoreSectionHeader` and `ProductCard`, whose contracts other capabilities own, while the proposal modified none. | Q28 |
| shared/ui/store-product-listing | Plan reader: `activate-listing-tile-by-name` adds `shared-ui-store-product-listing-SC-88` (sold out and an activation callback → the name stays inert), against this change's `shared-ui-store-product-listing-SC-91`. | Q29 |
| grade10-site/store/cross-sell | Build readers: the rail's `cards` accepts four `ProductSummary` fields it never draws. | Q30 |
| shared/ui/store-product-listing | Build readers: the discriminator task 1.3 promised to `activate-listing-tile-by-name` is written nowhere. | Q31 |
| grade10-site/store/cross-sell | Build readers: an unparseable `createdAt` sorts oldest silently. | Q32 |
| grade10-site/store/cross-sell | Build readers: nothing separates the ordered triple from a best-fact rank or weights. | Q33 |
| grade10-site/store/cross-sell | Build readers: the copy not holding the card is a collector-visible state with no scenario. | Q34 |
| grade10-site/store/cross-sell | Build readers: the six is the caller's, proved nowhere in production. | Q35 |
| grade10-site/store/cross-sell | Build readers: the triple as three booleans or one rank. | Q36 |
