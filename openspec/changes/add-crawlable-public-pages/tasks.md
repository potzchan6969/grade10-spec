# Tasks: Crawlable public pages

Every group lands in the grade10 repository; nothing here touches this one.
Group 1 is the whole served response — identity, the emitted documents, and
what a link preview reads. Groups 2 and 3 depend on it and on nothing in each
other.

## 1. Public pages served whole (owner: @sean)

- [x] 1.1 Move every browser-global read out of module scope and out of render, so a route module renders under the prerender build.
- [x] 1.2 Make `Each public surface names itself`, `Two surfaces, two names`, and `The title follows navigation` pass: each route module exports its own identity and derives its `meta` from it, so a public surface without one fails to compile.
- [x] 1.3 Make `The marketing page answers whole` and `A catalogue answers its identity` pass: the public addresses are prerendered, the framework emitting each surface's document from the real application, listings still arriving by script.
- [x] 1.4 Make `Scripts only add to the page` pass: the browser hydrates the served document, with every existing page-shell and navigation scenario green.
- [x] 1.5 Make `A preview fetcher reads the surface` pass: `og:title`, `og:description`, and `og:url` from the same identity.
- [ ] 1.6 Run the full check suite and a production build as this group's verification.

## 2. Crawler directory

- [ ] 2.1 Make `robots points at the sitemap` pass: robots.txt emitted per environment, permitting the public surfaces and naming the sitemap's absolute URL.
- [ ] 2.2 Make `The sitemap is exact` pass: the sitemap derives from the route modules' identities — every public surface, nothing else, absolute URLs of the serving environment.
- [ ] 2.3 Run typecheck, lint, and the app's test lane as this group's verification.

## 3. Honest statuses

- [ ] 3.1 Make `A nested address belongs to its surface` pass: serving matches an address through the application's own route config and answers a nested address with its surface's document and status 200.
- [ ] 3.2 Make `An unknown address is refused honestly` pass: status 404 with the shell, the not-found surface rendering as it already does.
- [ ] 3.3 Run the full check suite as this group's verification, and confirm the statuses against a deployed staging preview.
