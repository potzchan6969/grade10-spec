# Tasks: Card and lot addresses name their language

Every group lands in grade10; nothing here is work in grade10-spec, and there
is no `ui-design.md` because every screen, component and state this change touches
already exists unchanged. Group 1 is the seam — the split between "answers at
one address per locale" and "the build wrote a document" — and groups 2 and 3
both need it landed. Those two depend on nothing in each other.

## 1. Addresses and the route table (grade10) (owner: @sean)

- [x] 1.1 Split the address layer's one predicate in two — answers at one address per locale (now every public surface) and the build wrote a document (still only the prerendered ones) — deriving both from the surface table, so a surface added later inherits its prefixes by being public.
- [x] 1.2 Register the prefixed card and lot patterns ahead of the prefixed catalogue splat, making `A card answers under a prefix as itself` and `A lot answers under a prefix as itself` pass — today the splat answers those addresses with the catalogue's own page.
- [x] 1.3 Make the link builders for a card and a lot answer in a language, so `A prefixed catalogue opens a prefixed card` passes and the storefront grid, the auction catalogue and the serving lab all follow it without naming a path of their own.
- [x] 1.4 Hold `An unknown prefixed address is refused honestly` against the widened table: an address under a prefix no language claims still matches nothing, and a prefixed session-shaped address still answers 404.
- [x] 1.5 Run `pnpm run typecheck`, `pnpm run lint`, and `pnpm run test`.

## 2. Serving, language and heads (grade10) (owner: @sean)

- [x] 2.1 Stop the request's remembered locale deciding the language of a public document, so `A crawler reads an unprefixed address in the default locale` passes for a card and a lot and the unprefixed document is one set of bytes for every request; a session-shaped surface keeps reading it.
- [x] 2.2 Extend the after-hydration move to a remembered locale to every public surface, making `The memory redirects an unprefixed arrival` pass on a card as well as the marketing page, replacing the history entry rather than adding one.
- [x] 2.3 Give a card's and a lot's head the alternates of its own address and its own canonical, so `A variant declares its alternates` passes per card rather than only per catalogue page.
- [x] 2.4 Make `A prefixed address naming nothing is refused` pass: a prefixed address whose handle or id the catalogue has nothing for answers 404 with the not-found surface in that language, never the catalogue's page.
- [x] 2.5 Hold `The address wins over the memory` and `A prefixed visit stays in its language` across a card and a lot, alongside the catalogue surfaces they already cover.
- [x] 2.6 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 3. Catalogue enumeration and the rendered sitemap (grade10) (owner: @sean)

- [x] 3.1 Add the read that enumerates every card the catalogue holds, beside the catalog feature that owns it, paginating to the end and proven against fixtures with no running backend.
- [x] 3.2 Add the read that enumerates every lot of every auction, beside the auction feature that owns it, on the same terms.
- [x] 3.3 Answer the sitemap from the application rather than a file the build writes, listing every public surface the build writes a document for and every card and lot the catalogue holds — `The sitemap is exact` and `The sitemap names no pattern` — each once per locale, per `The sitemap lists every variant`.
- [x] 3.4 Make `The catalogue decides what is listed` pass: a card the catalogue gains appears with no deploy in between, and one it no longer holds stops appearing.
- [x] 3.5 Put a cache directive on the sitemap response, and assert its entry count against a threshold below what a crawler accepts, so crossing it fails a check rather than being silently ignored by a crawler.
- [x] 3.6 Keep `robots.txt` a file the build writes — nothing in it depends on the catalogue — and keep `robots points at the sitemap` passing against the rendered sitemap's address.
- [x] 3.7 Move the sitemap assertions out of the check that reads a build, which now has no file to read, to where the render can be run, and hold `Every listed address answers` there.
- [x] 3.8 Run `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.

## 4. Delivery and review (grade10) (owner: @sean)

- [x] 4.1 Confirm every scenario of the two capability deltas has a test behind it, and that `A Chinese address answers whole` still passes unchanged for the three catalogue surfaces.
- [x] 4.2 Run the full validation set: `pnpm run typecheck`, `pnpm run lint`, `pnpm run test`, and `pnpm run build`.
- [x] 4.3 Deploy to staging and read a prefixed card address, its alternates, and the sitemap off the deployed site.
- [x] 4.4 Archive the change once it is deployed to production.
