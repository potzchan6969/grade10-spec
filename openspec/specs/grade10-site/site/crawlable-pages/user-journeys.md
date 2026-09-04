## User journeys

### grade10-site-site-crawlable-pages-US-01: Collector reads a public surface before scripts run

**As a** collector,
**I want** a public address to answer with its title, description, headline,
and static copy in the first response,
**so that** I can read the surface immediately and still have it once scripts
make the page interactive.

**Accepted by:**

- `grade10-site-site-crawlable-pages-SC-01` — The marketing page answers whole
- `grade10-site-site-crawlable-pages-SC-02` — A catalogue answers its identity
- `grade10-site-site-crawlable-pages-SC-03` — Scripts only add to the page

### grade10-site-site-crawlable-pages-US-02: Collector tells one surface from another by name

**As a** collector,
**I want** every public surface to carry its own title and meta description,
and the document title to follow an in-page navigation,
**so that** the surface I am on is named distinctly from every other, even
after a navigation with no page load.

**Accepted by:**

- `grade10-site-site-crawlable-pages-SC-04` — Two surfaces, two names
- `grade10-site-site-crawlable-pages-SC-05` — The title follows navigation

### grade10-site-site-crawlable-pages-US-03: Preview fetcher unfurls a shared link

**As a** preview fetcher,
**I want** Open Graph title, description, and URL readable without executing
scripts,
**so that** a shared link unfurls as the surface it points at.

**Accepted by:**

- `grade10-site-site-crawlable-pages-SC-06` — A preview fetcher reads the surface

### grade10-site-site-crawlable-pages-US-04: Crawler discovers every public address

**As a** crawler,
**I want** a robots.txt naming a sitemap that is read from the catalogue when
it is fetched,
**so that** I fetch every public address the site answers, and none it would
refuse.

**Accepted by:**

- `grade10-site-site-crawlable-pages-SC-07` — robots points at the sitemap
- `grade10-site-site-crawlable-pages-SC-08` — The sitemap is exact
- `grade10-site-site-crawlable-pages-SC-09` — The sitemap names no pattern
- `grade10-site-site-crawlable-pages-SC-10` — The catalogue decides what is listed
- `grade10-site-site-crawlable-pages-SC-11` — Every listed address answers

### grade10-site-site-crawlable-pages-US-05: Collector opens an address the site may not hold

**As a** collector,
**I want** an address to answer with its true status — the deepest surface
naming it, or a 404 that still shows me the not-found surface,
**so that** I land on the surface that owns the address and am never told
nothing is wrong when the site holds no such thing.

**Accepted by:**

- `grade10-site-site-crawlable-pages-SC-12` — A nested address belongs to its surface
- `grade10-site-site-crawlable-pages-SC-13` — A nested surface answers for itself
- `grade10-site-site-crawlable-pages-SC-14` — A surface refuses an address of its own
- `grade10-site-site-crawlable-pages-SC-15` — An unknown address is refused honestly
