**Author:** @tangconst - 2026-09-10

## Why

A collector who knows a card's name, or the world they collect, still has to
type a full query and wait for the grid before they know whether the shop
carries it. The listing already narrows by free text in the address, but the
field offers no preview while they type and no chip when the words are in
force — so search feels weaker than the facet filters beside it.

Metric: share of listing sessions that commit a search or take a suggestion,
and time from first keystroke to a useful result (product open or narrowed
grid). Unmeasured today; first delivery sets the baseline.

## What Changes

- **Suggestions while typing** — the listing search field offers matching
  products and matching world or type filters as the collector types, at most
  five hits per group, over the whole catalogue
- **Empty and searching** — no match shows that nothing matched; while hits
  resolve the field shows it is searching; Enter still commits either way
- **Enter commits free text** — committing puts the words in the address and
  shows them as a dismissible chip with the other applied filters; the field
  clears for the next query
- **A product suggestion opens the product** — it is a jump, not a one-card
  filter; the field clears
- **A filter suggestion applies that facet** — same effect as picking it in
  the sidebar; the field clears; free text is not put in force
- **Shared listing search** — `ProductFilter` / `FilterPanel` /
  `ProductBrowse` accept supplied suggestion groups, a pending indication,
  and report draft change, commit, and suggestion selection; the application
  owns which hits to show and when to ask

## Non-Goals

- **Header or site-wide search** — auction has no search surface yet; the
  field stays on the store listing
- **Auction or cross-surface hits** in the suggestion panel
- **Typeahead that rewrites the address on every keystroke** — draft stays
  local until commit or selection
- **A global OpenSea-style search modal** with entity tabs or chain filters
- **Changing facet, collection, or sort rules** already on the listing
- **A fixed character threshold in the product** — when to fetch stays with
  the application

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `grade10-site/store/product-listing`: free-text search offers suggestions
  and commits as a chip among the applied narrowings
- `shared/ui/store-product-listing`: the listing search field displays
  supplied suggestions and reports draft, commit, and selection

## Impact

- **Grade10 site** — supplies suggestion hits from the catalogue (capped at
  five per group), shows searching while resolving, commits `q` on Enter,
  opens a product on product selection, applies facets on filter selection,
  clears the field after commit or pick, and supplies the free-text chip
  among applied filters
- **`@grade10/design-system`** — listing search composes the existing
  `Autocomplete` primitive (Search Input + Dropdown Menu); this change does
  not alter that primitive's contract
- **`@grade10/ui`** — `ProductFilter`, `FilterPanel`, and `ProductBrowse`
  gain suggestion props (including pending), callbacks, and public types
  `SearchSuggestion` and `SearchSuggestionGroup`
- **Storybook** — listing search fixtures for idle, typing, commit, empty,
  and pending suggestions
- **ZZZ** — unchanged unless it adopts the same props
- **Manual** —
  [`Product Listing · Search`](../../../docs/prds/products/grade10-site/store/product-listing.md#search)
  marks the outcomes

## Follow-on changes

- Header search once auction (or a true site-wide find) can answer it

## Open questions

- none

## References

- [Product Listing · Search](../../../docs/prds/products/grade10-site/store/product-listing.md#search)
