# Tasks: A store front door

Group 1 lands in grade10-spec and group 2 bumps the submodule onto it — until
that bump, nothing in grade10 can name the new copy. Groups 3 and 4 both need
group 2's surface table and depend on nothing in each other: group 3's tiles
and browse-all links point at the listing's address with a collection named on
it, and reach an unscoped listing until group 4 lands.

## 1. What the front door says (grade10-spec) (owner: @sean)

- [ ] 1.1 Add a shared `storeHome` namespace in every language the platform speaks — the hero's headline, its copy, both hero button labels, browse-all, the collections heading, and the loading and retry lines — so `The front door answers whole` and `A failed read can be retried` have words to render.
- [ ] 1.2 Add the hero's eyebrow to each brand's own catalog, grade10 and zzz, in every language that brand speaks, keeping `resolution.test.ts` green — every key is answered for every brand.
- [ ] 1.3 Add a head entry for the browse listing's address and rewrite the store's to describe a front door, so `The store and the listing are two surfaces` passes.
- [ ] 1.4 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test` in grade10-spec, then open a PR and push it — group 2 bumps onto the merged SHA.

## 2. The listing's own address (grade10)

Starts with the submodule bump onto group 1.

- [ ] 2.1 Bump `external/grade10-spec` onto group 1 and give the browse listing its own prerendered row in the surface table, in every language, so `The listing answers at its address` and `The listing is offered to crawlers` pass with the build's public-pages check green.
- [ ] 2.2 Point the chrome at both surfaces — the nav's store destination at the front door, the footer's all-collections at the listing — and mark the store as the surface being viewed on each, making `The listing is still the store`, `The chrome reaches the front door` and `The chrome reaches every collection` pass.
- [ ] 2.3 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and both addresses read off a build.

## 3. The front door (grade10)

Needs group 2's surface table. Assemble against
`apps/preview/src/pages/store-home-page.stories.tsx` in grade10-spec — same
blocks, same order, same spacing.

- [ ] 3.1 Export the hero image from frame `4171:9051`, import it into the page, and render the hero at the store's address so `The front door answers whole` and `The hero does not wait` pass with the served document carrying the headline and copy.
- [ ] 3.2 Wire the hero's two ways on, making `The hero reaches the catalogue` and `The hero reaches the auction` pass.
- [ ] 3.3 State which collections the front door offers, in what order and which takes the large cell, and render the bento from the catalogue's own names — `The grid names the catalogue's collections`, `A collection the shop no longer carries`, `The large cell is never empty` and `A tile opens its collection`.
- [ ] 3.4 Render the merchandised row from the collection the table names, titled as the catalogue names it — `The row is the collection's first cards`, `A card opens its own page`, `The row reaches the rest of the collection` and `Nothing to merchandise`.
- [ ] 3.5 Give both sections their in-flight and failed states, making `A section says it is loading` and `A failed read can be retried` pass.
- [ ] 3.6 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and the front door read off a build with no script running.

## 4. Narrowing the listing from its address (grade10)

Needs group 2's surface table.

- [ ] 4.1 Read the collection to narrow to out of the address on the listing, making `An address opens the listing narrowed`, `No collection named` and `A collection the catalogue has nothing for` pass.
- [ ] 4.2 Write a narrowing made in the page back to the address as a new history entry, making `Narrowing in the page is linkable` and `Back undoes a narrowing` pass, with every existing listing test still green.
- [ ] 4.3 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.

## 5. Delivery and review (grade10)

- [ ] 5.1 Deploy to staging and confirm against the preview: the store address answers with the front door, a tile opens the listing narrowed to its collection, the merchandised row is the shop's, and a shared link to a narrowed listing opens narrowed.
- [ ] 5.2 Review the front door beside frame `4171:9023` and the preview story with design, and record any layout gap as its own change rather than absorbing it here.
