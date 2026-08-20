# Tasks: Product pages

Every group lands in grade10; nothing here touches grade10-spec, except the
last group, which removes a workaround this change leaves behind.

Group 1 is what makes an address renderable at all — until it lands there is
nowhere for a card's page to be served from. Groups 2 and 3 depend on it and
on nothing in each other.

## 1. Surfaces the worker renders (grade10) (owner: @sean)

- [x] 1.1 Split the surface table into what the build writes and what is rendered, and make `serveAddress` answer which document an address has or none, keeping `A nested address belongs to its surface` and `An unknown address is refused honestly` green.
- [x] 1.2 Build the application for the server so the worker starts: bundled whole, React's web renderer, and a base for the module URL `@grade10/ui` resolves a fixture against — each only when building, with the dev server still rendering in Node.
- [x] 1.3 Render an address with no document in the worker, restating the status for an address no surface owns, and give each render its own react-query cache.
- [x] 1.4 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`, and every address shape answered by `wrangler dev` over that build.

## 2. A card's page (grade10, @grade10/store-frontend) (owner: @sean)

- [x] 2.0 Give one product its own slice, publishing the read a caller that is not a component makes — the same repository `useProduct` resolves — and hand every `pnpm dev` service the CAs this repo generates so a server-side read can reach the local proxy.
- [x] 2.1 Make `A card answers whole` pass: a product surface at `/store/products/<handle>` whose loader reads the card through that read, rendering its name, its variants, their prices and its description before any script runs.
- [x] 2.2 Make `Two cards, two pages` pass: the head derives from what the read answered, so each card carries its own title, description and `og:url`.
- [x] 2.3 Make `A handle the catalogue has nothing for` and `A card added to the catalogue answers` pass: the loader refuses an unknown handle with a 404 the surface renders as the site's not-found page.
- [x] 2.4 Make `A surface refuses an address of its own` pass, with the crawlable-pages scenarios it sits beside still green.
- [x] 2.5 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and both statuses read off `wrangler dev` over a build.

## 3. Reaching a card (grade10) (owner: @sean)

- [x] 3.1 Make `A card is opened from the grid` and `The sitemap names no pattern` pass: a tile opens the card's own address, and what the build cannot enumerate is left out of the sitemap rather than written as a pattern.
- [x] 3.2 Teach the build's public-pages check that only a written surface has a file to read, holding a rendered surface to the same rules where it can be rendered.
- [x] 3.3 Verification: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, `pnpm run build`.

## 4. Confirm on staging (grade10) (owner: @sean)

- [x] 4.1 Deploy to staging and confirm against the preview: a card answers whole, an unknown slug answers 404, and a shared card link unfurls as that card.

## 5. Remove the workaround (grade10-spec)

Depends on nothing; the application works without it.

- [ ] 5.1 Import the product card's skeleton fixture image instead of resolving it against `import.meta.url`, so a server bundle of any application carries no module-URL read.
- [ ] 5.2 Bump the submodule in grade10 and drop the `import.meta.url` define from the web app's build.
