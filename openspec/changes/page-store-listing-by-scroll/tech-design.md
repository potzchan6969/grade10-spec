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
- **Four paths answer a products page.** A facet, free text or an order in force goes to Shopify's `search`; `latest`, or a shop without the storefront filters configured, walks the catalogue and filters in memory; an unnarrowed listing reads the `products` connection; an address naming a collection reads that collection's products.

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
pages, answered on every page of it. The catalog port's `Page<T>` and the
store frontend's `Page<T>` gain the same field, and `toPage` reads it from the
connection.

- **Why the page and not a procedure of its own.** A `catalog.count` procedure is a second call per narrowing and a second cache entry that can disagree with the first, so a listing could render a count for a set it did not read. The page already carries the two other facts about the set it pages.
- **Only the products page.** A collections page is a navigation list nobody counts, so the shared `page()` helper stays as it is and `productsPageSchema` extends it rather than every page shape growing a field three of them cannot answer.
- **Rejected — deriving the total from the facet counts the sidebar already holds.** Summing one facet's choices counts a product carrying two worlds twice and a product carrying none not at all.
- **Rejected — `hasNextPage` plus a page index.** It answers "more follow", never "how many", which is the question the count exists to answer.

### Each read path answers the total its own way

| Path | In force | Total from |
| --- | --- | --- |
| `search` | a facet, free text or an order, with `sort` not `latest` | `search.totalCount`, taken from the first answer of the offset walk |
| the catalogue walk | `latest`, or a shop whose storefront filters are unconfigured | the length of the filtered set the walk already holds in memory |
| `products` | nothing in force | a second `search(query: "", first: 1)` issued beside the page read |
| `collection.products` | an address naming a collection | a count-only walk of that collection's pages |

- **Why the unnarrowed listing keeps the `products` connection.** Routing it through `search` would answer the total for free, and the sidebar counts prove an empty-query search lists the whole catalogue. It would also change what "the catalogue's own order" means, from the products connection's order to search relevance — a behaviour change under a requirement that says no order is in force at rest. One `first: 1` search beside the page read costs a round trip and changes nothing a collector sees.
- **Why a collection walks.** Storefront answers no total on a collection's products connection at `2026-07`, and no product filter narrows `search` to a collection. The count walk selects ids and nothing else, and the catalogue already accepts a whole-catalogue walk for `latest` at today's size.
- **Rejected — summing a collection's advertised filter counts.** Same double- and non-counting as the facet sum above, and it would make the count depend on the shop having configured Search & Discovery.
- **Rejected — a stored product count the store keeps its own copy of.** That is the webhook-fed projection `browse.ts` already names as the successor to walking, and it is the wrong size of decision to make for one number.

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
- **[A large collection walks every page for one number]** → The count walk selects ids alone and stops at `WALK_MAX_PAGES`, throwing rather than degrading quietly, which is the ceiling the catalogue already accepts for `latest`. A shop whose collections outgrow it needs the projection, not a longer walk.
- **[One more Shopify call on the unnarrowed listing]** → Issue it beside the page read rather than after it, so the listing waits on one round trip rather than two.
- **[A page that fails now also loses the total]** → The failed page answers nothing, so the count would blank while the cards already read stay listed. Hold the last total answered for the narrowing in hand, which is the same key the walk is already held under.

## Open Questions

None.
