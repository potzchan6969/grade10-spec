# Tasks

Group 1 is the manual, in **grade10-spec**, and needs no submodule bump —
`@grade10/ui` does not move for this change, and its Storybook fixtures already
offer latest, lowest price and highest price with latest at rest. Group 2 is the
contract the collection work reads. Group 4 depends on nothing and can be
claimed beside any of them; groups 3 and 5 need group 2's landed contract and
are otherwise parallel, the page working against the fixture catalogue rather
than a running worker.

Where the resting order is decided and why a collection keeps the order chosen
in it: [`tech-design.md`](tech-design.md) — Decisions.

## 1. The manual (grade10-spec) (owner: @sean)

- [x] 1.1 Say on `docs/prds/products/grade10-site/store/product-listing.md` that the listing opens ordered by latest product with the trigger naming that order, and that a collection opens the same way and stays in force when a collector orders it
- [x] 1.2 Correct the rows the decision moves in that page's `Product decisions` block — `No popularity order`, which says the catalogue's own order stands at rest, and `One narrowing at a time`, which counts an order among the acts that leave a collection behind — and drop ordering from the `Not in scope` line that rules out ordering and searching inside a collection
- [x] 1.3 Verify: `pnpm check:manual`

## 2. The collection read's order (grade10) (owner: @sean)

- [x] 2.1 Add an optional `sort` to the collection procedure's input in `packages/grade10-store/contracts`, and to the Shopify catalog port's collection arguments as the sort key and direction the products connection takes — the contract groups 3 and 5 both read (`SC-39`, `SC-40`)
- [x] 2.2 Answer that order in the fixture catalogue's `getCatalogCollection`, so a page suite renders an ordered collection with no worker in the loop
- [x] 2.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 3. The collection's order in the worker (grade10) (owner: @sean)

Needs group 2's contract.

- [x] 3.1 Send the order as `sortKey` and `reverse` on the products connection of `GET_COLLECTION_BY_HANDLE`, by the mapping in `tech-design.md`, *An order rides the collection read* — so *A collection opens on the resting order* (`SC-39`) and *An order holds the collection it was chosen in* (`SC-40`) are answered by the catalogue and not by the page
- [x] 3.2 Carry the order through the store worker's `catalog.collection` procedure, leaving the count walk as it is — a count describes the set, not its order — and keep `COLLECTION_DEFAULT` as what a caller asking for no order gets
- [x] 3.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run test:backend`

## 4. The listing at rest (grade10) (owner: @sean)

- [x] 4.1 Resolve an address naming no order to the resting order where the listing's address is read, and leave that order out again where one is written, so *At rest the order is latest* (`SC-29`) passes and a link carries only what departs from rest
- [x] 4.2 Supply the trigger and the menu from the order in force — `Sort by` followed by the active option's label, that option marked in the menu, and only the three orders the catalogue can answer offered — so *The menu offers only answerable orders* (`SC-15`) holds with an order resting
- [x] 4.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`

## 5. The collection's order in the page (grade10) (owner: @sean)

Needs group 2's contract; the fixture catalogue stands in for group 3.

- [x] 5.1 Keep the collection in force when an order is chosen in it or carried in the address beside it, and pass the order to the collection read, so *A collection opens on the resting order* (`SC-39`) and *An order holds the collection it was chosen in* (`SC-40`) pass
- [x] 5.2 Hold the two scenarios the delta narrows — a facet or free text still leaves the collection behind (`SC-06`), and an address carrying a collection beside either still renders the query (`SC-09`)
- [x] 5.3 Verify: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`
