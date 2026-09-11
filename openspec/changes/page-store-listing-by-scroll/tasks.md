# Tasks

Group 1 is the manual, in **grade10-spec**, and needs no submodule bump —
`@grade10/ui` does not move for this change. Group 2 is the page shape every
other group reads; groups 3 and 4 need its landed code and are otherwise
parallel, the frontend working against the fixture catalogue rather than a
running backend.

The walk already ships and only its cover is new work; the count is new on all
four read paths, and one of them changes engine to answer it. Which scenarios
are which, and why each path answers the total the way it does:
[`tech-design.md`](tech-design.md) — Context, Decisions.

## 1. The manual (grade10-spec)

- [ ] 1.1 Say on `docs/prds/products/grade10-site/store/product-listing.md` that the listing is read by scrolling — no page control, a walk that starts again on a new narrowing, and depth that never reaches the URL — and that the count above the grid is the whole narrowing's rather than the cards on screen
- [ ] 1.2 Record in that page's `Product decisions` block why the count is the catalogue's over the whole set, alongside the facet-count row that already says the same for the sidebar, and why a collector's scroll depth is deliberately not restored
- [ ] 1.3 Verify: `pnpm check:manual`

## 2. The catalogue's page shape (grade10) (owner: @sean)

- [ ] 2.1 Add `totalCount` to `productsPageSchema` alone, leaving the shared `page()` helper and the collections page as they are, and carry it on the catalog port's counted page and the store frontend's product page — `tech-design.md`, *The total rides the page it describes*
- [ ] 2.2 Answer `totalCount` from the fixture catalogue's paging helper, so a frontend suite renders a real count with no backend in the loop
- [ ] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The catalogue's count (grade10)

Needs group 2's page shape.

- [ ] 3.1 Select `totalCount` on the storefront search and carry it off the first answer of the offset walk, so a narrowed or ordered listing answers the size of its own set — *The count is the set, not what was read* (`SC-27`) and *The count follows the narrowing* (`SC-28`) on the native path
- [ ] 3.2 Answer the walk fallback's total from the length of the filtered set `browse` already holds, so `latest` and an unconfigured shop answer `SC-27` and `SC-28` without a second read
- [ ] 3.3 Answer the unnarrowed listing's total from a `first: 1` search selected beside the page on the same request, keeping the products connection as what lists the cards, and warn where the total comes back below the items already returned — `tech-design.md`, Risks
- [ ] 3.4 Count a collection's set by walking its pages for ids alone, bounded by its own ceiling of 20 pages of 250 so it refuses rather than degrades, so an address naming a collection answers `SC-27`
- [ ] 3.5 Take a query carrying free text to the walk for the cards, the count and the facet counts alike, behind one predicate both routes read, and refuse the search path loudly when it is reached against that decision — *A choice's count is the listing it opens* (`SC-30`); `tech-design.md`, *Free text walks*
- [ ] 3.6 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 4. The browse listing (grade10)

Needs group 2's page shape; the fixture catalogue stands in for group 3.

- [ ] 4.1 Render the count from the page's total rather than the cards loaded, held under the narrowing it describes and empty until that narrowing's first page answers, so *The count is the set, not what was read* (`SC-27`) and *The count follows the narrowing* (`SC-28`) pass
- [ ] 4.2 Cover the shipped walk — *The next cards arrive at the end* (`SC-22`), *The end of the set* (`SC-23`) and *A narrowing starts the walk again* (`SC-24`), the last for a facet, free text and an order as well as the collection case already held
- [ ] 4.3 Cover a fresh open of an address a walk was made at and a page the catalogue does not answer, so *Depth is not carried in the address* (`SC-25`) and *A page the catalogue does not answer* (`SC-26`) hold against the walk key and the resolved-grid rule they already rely on
- [ ] 4.4 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`
