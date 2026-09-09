# Tasks

Group 1 is the words, in **grade10-spec**, and reaches the site through a
submodule bump — group 3 names those keys, so it lands first. Group 2 is the
catalogue reads and group 3 the surface that draws them; group 3 needs group
2's landed code. Design decisions, and why a collection and a facet cannot both
be in force: [`tech-design.md`](tech-design.md). Frames, exports and states:
[`ui-design.md`](ui-design.md) — no component, variant or token is missing, so
`packages/` carries none of this.

## 1. Words for the facets (grade10-spec) (owner: @sean)

- [x] 1.1 Name the two facet groups in the shared store catalog, in every language the site answers, so the sidebar has a heading for each group the catalogue returns
- [x] 1.2 Name the invitation that opens a capped group, in every language, so *A long facet group is capped* (`SC-16`) has words for it
- [x] 1.3 Add the short names of the three utility links beside the full ones the footer's help column already carries, in every language, the way the legal bar already shortens its two
- [x] 1.4 Retire the collection group's name and the popularity order's two words, which no surface asks for once the panel is facets and the menu is what the catalogue answers
- [x] 1.5 Verify: `pnpm run test`, `pnpm run typecheck`, `pnpm run lint`

## 2. Catalogue reads (grade10) (owner: @sean)

The storefront's catalogue data layer, verified against fixtures rather than a
running worker. Passes no scenario on its own — it is what group 3 draws.

- [x] 2.1 Build the canonical query — parameters in name order, facet values deduped and sorted, free text folded, default page size omitted — and read it back off an address, so one narrowing has one spelling from the address to the cache key
- [x] 2.2 Add the facet taxonomy read to the catalogue reads, keyed on the narrowing alone and never on the cursor, the page size or the order, so paging and re-ordering do not refetch a taxonomy that describes the set
- [x] 2.3 Carry the whole query — free text, order and both facets — on the products read, so narrowing, searching and ordering are answers about the catalogue rather than about a loaded page
- [x] 2.4 Make the fixture procedure client answer the taxonomy with counts and narrow, search and order its products the way the backend does, so every scenario in group 3 is decidable without a worker
- [x] 2.5 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The listing surface (grade10) (owner: @sean)

Needs group 1's keys and group 2's reads landed.

- [x] 3.1 Draw the sidebar from the catalogue's taxonomy, one group per facet in the catalogue's order with its count beside every choice, so *The panel is the catalogue's facets* (`SC-10`) passes
- [x] 3.2 Put the facets in force into the address and take the page's own filter state out, so *A facet narrowing is linkable* (`SC-11`) passes
- [x] 3.3 Settle the taxonomy as ready-and-empty rather than as an empty state, keeping search and the sort menu, so *A shop with no facets configured* (`SC-12`) passes
- [x] 3.4 Send the order and the free text to the catalogue and put both in the address, replacing the entry while the collector types and pushing one when it settles, so *An order covers the whole catalogue* (`SC-13`) and *Free text covers the whole catalogue* (`SC-14`) pass
- [x] 3.5 Offer only the orders the catalogue answers, with none in force at rest, so *The menu offers only answerable orders* (`SC-15`) passes
- [x] 3.6 Choose the collection read only for an address naming a collection and nothing else, so *An address opens the listing narrowed* (`SC-03`), *No collection named* (`SC-04`), *A collection the catalogue has nothing for* (`SC-05`) and *An address carrying both* (`SC-09`) pass
- [x] 3.7 Name the collection in force among the applied narrowings, dismissible, and drop it whenever a facet, free text or an order is applied, so *Narrowing in the page is linkable* (`SC-06`), *Back undoes a narrowing* (`SC-07`) and *The collection in force can be dismissed* (`SC-08`) pass
- [x] 3.8 Cap the worlds at five with the invitation that opens the group, and offer the collectible types whole, so *A long facet group is capped* (`SC-16`) passes
- [x] 3.9 Name the three utility links where the site's other chrome links are named, each with no destination yet, and draw the row against the placeholder the site already gives a link it owes, so the links become real addresses as the pages land
- [x] 3.10 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`
- [x] 3.11 Open the body on the browse block, as the frame does, and hold the listing's served copy to the floor every public document is held to — the surface names itself in the document's head
- [x] 3.12 Hold the panel and the grid through a narrowing rather than emptying both on every tick, and keep every group the catalogue names once a query is in force, so *A narrowing that starves the catalogue* (`SC-17`) passes

## 4. The manual (grade10-spec) (owner: @sean)

- [x] 4.1 Rewrite the product listing page's shape and its URL list for a listing narrowed by facets, with a collection as a way in rather than a filter, and record on its decisions why one narrowing is in force at a time
- [x] 4.2 Verify: `pnpm check:manual`

