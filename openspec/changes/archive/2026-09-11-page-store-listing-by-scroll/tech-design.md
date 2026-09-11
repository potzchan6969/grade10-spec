# Tech design

## Context

See `proposal.md` — Why. The requirements are the delta beside it.

The walk already ships. An engineer should know before planning a session that
one of the two requirements is cover over shipped behaviour and the other is a
number that four read paths have to learn to answer:

| Scenario | Today |
| --- | --- |
| `SC-22` The next cards arrive at the end | Ships — a sentinel 200px above the list end reports once per result set, and the page appends. Covered by *appends the next catalog page when more products load* |
| `SC-23` The end of the set | Ships — no further page means no sentinel and nothing drawn. No test |
| `SC-24` A narrowing starts the walk again | Ships — the walk is held under the narrowing it pages and read back under that key. Covered for the collection case only |
| `SC-25` Depth is not carried in the address | Ships — the walk is view state and never written to the address. Back is covered; a fresh open of a walked address is not |
| `SC-26` A page the catalogue does not answer | Ships — a later failure leaves the grid resolved and keeps the set askable. No test |
| `SC-27` The count is the set, not what was read | **New** — the listing renders the number of cards loaded |
| `SC-28` The count follows the narrowing | **New** — same number |

What the catalogue answers today, and what it does not:

- **A products page is `items`, `hasNextPage`, `endCursor`** — cursor paging, no size. Every path below answers that shape.
- **The list header already refuses to derive a count** — `shared-ui-store-product-listing-SC-39`. It renders the string the site supplies, so the whole change is which number the site puts in it.
- **Four paths answer a products page.** A facet or an order in force goes to Shopify's `search`; free text, `latest`, or a shop without the storefront filters configured, walks the catalogue and filters in memory; an unnarrowed listing reads the `products` connection; an address naming a collection reads that collection's products.

## Goals / Non-Goals

**Goals**

- One number, answered by the catalogue over the set it pages, never counted from a page
- Every products page carries its own size, so a consumer never makes a second call to say what it is showing
- The shipped walk covered by the scenarios that now govern it

**Non-Goals**

- Any change to how a page of cards is read, ordered or narrowed
- A count on the collections list, the front door's merchandised row, or the product page
- Restoring a collector's scroll depth — `proposal.md`, Non-Goals

## Decisions

### The total rides the page it describes

`productsPageSchema` gains `totalCount: Int` — the size of the set the page
pages, answered on every page of it. The catalog port answers a `CountedPage`
wherever it can state one, leaving `Page` as it is, and the store frontend's
product page carries the same field.

- **Why the page and not a procedure of its own.** A `catalog.count` procedure is a second call per narrowing and a second cache entry that can disagree with the first, so a listing could render a count for a set it did not read. The page already carries the two other facts about the set it pages.
- **Only the products page.** A collections page is a navigation list nobody counts, so the shared `page()` helper stays as it is and `productsPageSchema` extends it rather than every page shape growing a field three of them cannot answer. The port draws the same line with a second type rather than a field on `Page`, so a page that cannot state a count cannot be asked for one.
- **Rejected — deriving the total from the facet counts the sidebar already holds.** Summing one facet's choices counts a product carrying two worlds twice and a product carrying none not at all.
- **Rejected — `hasNextPage` plus a page index.** It answers "more follow", never "how many", which is the question the count exists to answer.

### Each read path answers the total its own way

| Path | In force | Total from |
| --- | --- | --- |
| `search` | a facet or an order, no free text, `sort` not `latest` | `search.totalCount`, taken from the first answer of the offset walk |
| the catalogue walk | free text, `latest`, or a shop whose storefront filters are unconfigured | the length of the filtered set the walk already holds in memory |
| `products` | nothing in force | `search(query: "", first: 1)` selected beside the page on the same request |
| `collection.products` | an address naming a collection | a count-only walk of that collection's pages |

- **Why the unnarrowed listing keeps the `products` connection.** Routing it through `search` would answer the total for free, and the sidebar counts prove an empty-query search lists the whole catalogue. It would also change what "the catalogue's own order" means, from the products connection's order to search relevance — a behaviour change under a requirement that says no order is in force at rest. The `first: 1` search is a second root field on the same request, so the count changes nothing a collector sees and costs no round trip.
- **Why a collection walks.** Storefront answers no total on a collection's products connection at `2026-07`, and no product filter narrows `search` to a collection. The count walk selects ids and nothing else, and the catalogue already accepts a whole-catalogue walk for `latest` at today's size.
- **Rejected — summing a collection's advertised filter counts.** Same double- and non-counting as the facet sum above, and it would make the count depend on the shop having configured Search & Discovery.
- **Rejected — a stored product count the store keeps its own copy of.** That is the webhook-fed projection `browse.ts` already names as the successor to walking, and it is the wrong size of decision to make for one number.

### Free text walks, so one engine answers every number on the listing

Shopify advertises a count behind each facet choice on the same answer the
search returns, and the panel reads them. Under a free-text query those counts
describe a relevance-narrowed subset rather than the set the same answer's
`totalCount` returns. Measured on the development shop, 2026-09-10:

| Search text | Advertised behind the Pokemon world | Products carrying it that came back |
| --- | --- | --- |
| none | 195 | 195 |
| `pokemon` | 4 | 195 |
| `card` | 2 | 111 |
| `charizard` | 20 | 185 |

The count above the grid and the counts in the panel sit on one screen, so a
query carrying free text takes the walk for both, and a choice's count is the
size of the listing choosing it opens. One predicate decides which engine
answers, read by the products route and the filters route alike; the search
path refuses loudly when it is reached against that decision.

- **Why not search for the grid and the walk for the panel.** Two engines, two sets: search matches description, tags and vendor, the walk matches the folded title. The number above the grid and the number behind the tick that produced it would still disagree, by less.
- **Rejected — counting each choice with its own `search` total.** Exact, and one Shopify request per choice: the worlds facet alone would issue tens of them per sidebar.
- **Rejected — leaving it and saying so on the manual page.** The two numbers are three centimetres apart on the same screen. A reader who sees `194` above `20` learns not to trust either.

### The header says nothing until a page has arrived

The count is the page's, so before the first page of a narrowing answers there
is no number to say. The header takes an empty count until then, not a zero.
Once one has answered, the total is held under the narrowing it describes —
the key the walk is already held under — so a later page in flight, or one
that fails, leaves the number where it was.

- **Why not zero.** `0 products` is a claim the catalogue never made, and it sits above a grid of skeletons already marked busy — the surface would be saying the narrowing found nothing at the moment it is still looking.
- **Rejected — carrying the previous narrowing's total through the load.** It states the old set's size over the new set's skeletons, which is the failure this change exists to end.

## Risks / Trade-offs

- **[`search.totalCount` and the `products` connection count different sets]** → On the unnarrowed listing the grid and its count come from two queries, so a storefront indexing lag would show a number that disagrees with what is listed. Log a warning where the total comes back below the number of items already returned — the only form the lag takes that the site can observe — and let the number stand, since a page of cards is worth more than a suppressed count.
- **[A large collection walks every page for one number]** → The count walk selects ids alone and stops at its own ceiling of 20 pages of 250 — the 5,000 products `WALK_MAX_PAGES` allows the catalogue walk, held in the package that issues the query — throwing rather than degrading quietly. A shop whose collections outgrow it needs the projection, not a longer walk.
- **[One more Shopify call on the unnarrowed listing]** → Select the count as a second root field on the same request rather than issuing a second one, so the listing waits on one round trip and the count costs none.
- **[A word in the box finds fewer cards than it did]** → Free text matched description, tags and vendor through Shopify's index and now matches the folded title. On the development shop `q=pokemon` matched 256 of 286 products through search and 196 through the fold, so a search narrows more than it did. Taken deliberately, so the panel's counts and the count above the grid describe one set.
- **[Every distinct search term walks the catalogue]** → Once per cold cache entry, the ceiling `browse.ts` already names for `latest`. The search box settles for 300ms before the address takes a word, so it is one walk per term rather than one per keystroke.
- **[The written document says no number, and loses static copy with it]** → The browse listing's document is written before any catalogue read answers, so it carries the panel's controls and no count — 38 characters where every public surface is held to 40. It was clearing that floor on the `0 products` this change forbids. The listing is held to its own floor instead, read by the build check and the render test alike, so the guarantee still says what it claims for every other surface. What the listing should say at rest, with no catalogue in hand, is its own question.
- **[A page that fails now also loses the total]** → The failed page answers nothing, so the count would blank while the cards already read stay listed. Hold the last total answered for the narrowing in hand, which is the same key the walk is already held under.

## Open Questions

None.
