# Tech design: Listing search suggestions

## Context

The listing already narrows by free text. `ProductListingPage` holds the typed
words in React state and a 300 ms settle timer writes them into the address as
`q`, so today typing *is* the narrowing. The catalogue answers two reads that
between them hold everything a suggestion panel needs — `listProducts` takes
free text and a page size, `listFilters` returns the world and collectible-type
taxonomy — and `@grade10/ui` already carries the suggestion props, the types
and the stories.

Behaviour: [`grade10-site/store/product-listing`](specs/grade10-site/store/product-listing/spec.md)
and [`shared/ui/store-product-listing`](specs/shared/ui/store-product-listing/spec.md).
Screens and the component inventory: [`ui-design.md`](ui-design.md).

## Goals / Non-Goals

- **Goal** — suggestions over the whole catalogue, a commit that puts free text
  in force as a chip, and a selection that opens a product or applies a facet.
- **Goal** — no new endpoint: every hit comes from a read the catalogue already
  answers.
- **Non-goal** — the proposal's list, unchanged. When to ask, and after how many
  characters, stays with the application.

## Decisions

### Product hits come from the products read, filter hits from the taxonomy

The spec governs what a group holds and what caps it. The implementation reads
both from the repository the listing already injects:

| Group | Read | Asked with |
| --- | --- | --- |
| Products | `CatalogRepository.listProducts` | the draft as `search`, `pageSize: 5`, no facets and no sort |
| Filters | `CatalogRepository.listFilters` | nothing — the unnarrowed taxonomy, matched against the draft in the browser and cut to five |

Dropping the facets from the products ask is what makes suggestions cover the
whole catalogue while choices are in force.

- **Rejected: a `/suggest` endpoint.** It would serve nothing the two reads do
  not already answer, and would be a third thing to keep consistent with them.
- **Rejected: `listFilters({ search: draft })`.** It counts the taxonomy over
  the set the draft narrows, so it answers *which facets do the matching
  products carry* — not *which facet is named for these words*, which is what
  the spec asks for and what the panel shows.

### Matching a facet name is domain logic, tested as a pure function

A `facetChoicesMatching(filters, draft)` in the catalog feature's
`domain/models/CatalogFilters.ts`, folded the way `CatalogQuery` already folds
free text so `Pokémon` typed reaches `pokemon` stored.

- **Rejected: matching inside the hook.** The fold is the same rule the address
  and the worker apply; it belongs beside them, where a unit test can hold it.

### The draft stops writing the address

The settle timer that writes `q` per pause is deleted. The address changes on a
commit and on a filter selection, and on nothing else — `grade10-site-store-product-listing-SC-31`.

- **Rejected: keeping the typeahead write and adding suggestions above it.**
  Two things would then narrow the listing from one field, and Back would still
  walk a word back a letter at a time.

The 300 ms constant survives, moved: it now paces the suggestion read rather
than `setParams`, so a draft in flight is one query key per settled draft.

### Pending reaches the field as its own prop

`ProductFilter` gains a pending indication and searching copy, passed through
`FilterPanel` and `ProductBrowse` — `shared-ui-store-product-listing-SC-74`.

- **Rejected: withholding the groups while the read is in flight.** Omitted
  groups already mean *keep the panel closed*, so a loading listing would be
  indistinguishable from one that supplies no suggestions at all.

### The free-text chip is one more applied filter

The committed words join `appliedFilters` under group id `search`, and
dismissal arrives through the existing `onFilterChange` alongside the
collection and the facets — `grade10-site-store-product-listing-SC-35`.

- **Rejected: a dedicated chip prop on `ProductListHeader`.** The surface
  already renders and dismisses applied filters; a second way to say the same
  thing is a second way for the panel and the chips to disagree.

## Risks / Trade-offs

- **A wide draft asks the catalogue on every pause** → the read is debounced by
  the settle constant and capped at `pageSize: 5`; react-query keys per settled
  draft, so a collector retyping a prefix is served from cache.
- **Two taxonomy reads now live at once — the panel's narrowed one and the
  suggestions' unnarrowed one** → they already canonicalise to different query
  keys through `filtersSearch`, so the panel's counts are untouched and no
  invalidation is shared.
- **Collectors used to see the grid narrow as they typed** → the words stay
  linkable and Back still undoes a narrowing; only the moment they land moves,
  and the chip makes the moment visible.

## Open Questions

None.
