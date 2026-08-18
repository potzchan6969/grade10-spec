# Tasks: Crawlable public pages

Every group lands in the grade10 repository; nothing here touches this one.
Group 1 is the shared interface — the identity table the other groups read.
Groups 2, 3, and 4 depend on it and on nothing in each other.

## 1. Route identity table

- [ ] 1.1 Make `Each public surface names itself` and `Two surfaces, two names` pass: extend the navigation route table with a typed title and description per surface, so a route without an identity fails to compile.
- [ ] 1.2 Make `The title follows navigation` pass: the document title follows the address, including a navigation the session forces.
- [ ] 1.3 Run typecheck, lint, and the app's test lane as this group's verification.

## 2. Public pages served whole

- [ ] 2.1 Move every browser-global read behind the routing seam so the application renders with a supplied address, per the design's one-seam decision.
- [ ] 2.2 Make `The marketing page answers whole` pass: the build renders the marketing surface through the real application and emits its HTML document with title, description, headline, and copy.
- [ ] 2.3 Make `A catalogue answers its identity` pass for the store and the auction, listings still arriving by script.
- [ ] 2.4 Make `Scripts only add to the page` pass: the browser hydrates the served document, every existing page-shell and navigation scenario stays green.
- [ ] 2.5 Make `A preview fetcher reads the surface` pass: Open Graph title, description, and URL emitted per surface from the identity table.
- [ ] 2.6 Run the full check suite and a production build as this group's verification.

## 3. Crawler directory

- [ ] 3.1 Make `robots points at the sitemap` pass: robots.txt emitted per environment, permitting the public surfaces and naming the sitemap's absolute URL.
- [ ] 3.2 Make `The sitemap is exact` pass: the sitemap derives from the identity table — every public surface, nothing else, absolute URLs of the serving environment.
- [ ] 3.3 Run typecheck, lint, and the app's test lane as this group's verification.

## 4. Honest statuses

- [ ] 4.1 Make `A nested address belongs to its surface` pass: serving resolves an address with the application's own route table and answers a nested address with its surface's document and status 200.
- [ ] 4.2 Make `An unknown address is refused honestly` pass: status 404 with the shell, the not-found surface rendering as it already does.
- [ ] 4.3 Run the full check suite as this group's verification, and confirm the statuses against a deployed staging preview.
