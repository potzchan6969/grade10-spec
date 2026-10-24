# grade10-site/site/crawlable-pages Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-09-02, tcs-rules r1
**Out of suite (seo):** grade10-site-site-crawlable-pages-SC-01, grade10-site-site-crawlable-pages-SC-02, grade10-site-site-crawlable-pages-SC-03, grade10-site-site-crawlable-pages-SC-04, grade10-site-site-crawlable-pages-SC-05, grade10-site-site-crawlable-pages-SC-06, grade10-site-site-crawlable-pages-SC-07, grade10-site-site-crawlable-pages-SC-08, grade10-site-site-crawlable-pages-SC-09, grade10-site-site-crawlable-pages-SC-10, grade10-site-site-crawlable-pages-SC-11

## grade10-site-site-crawlable-pages-US1: Collector reads a public surface before scripts run

**As a** collector,
**I want** a public address to answer with its title, description, headline,
and static copy in the first response,
**so that** I can read the surface immediately and still have it once scripts
make the page interactive.

---

## grade10-site-site-crawlable-pages-US2: Collector tells one surface from another by name

**As a** collector,
**I want** every public surface to carry its own title and meta description,
and the document title to follow an in-page navigation,
**so that** the surface I am on is named distinctly from every other, even
after a navigation with no page load.

---

## grade10-site-site-crawlable-pages-US3: Preview fetcher unfurls a shared link

**As a** preview fetcher,
**I want** Open Graph title, description, and URL readable without executing
scripts,
**so that** a shared link unfurls as the surface it points at.

---

## grade10-site-site-crawlable-pages-US4: Crawler discovers every public address

**As a** crawler,
**I want** a robots.txt naming a sitemap that is read from the catalogue when
it is fetched,
**so that** I fetch every public address the site answers, and none it would
refuse.

---

## grade10-site-site-crawlable-pages-US5: Collector opens an address the site may not hold

**As a** collector,
**I want** an address to answer with its true status — the deepest surface
naming it, or a 404 that still shows me the not-found surface,
**so that** I land on the surface that owns the address and am never told
nothing is wrong when the site holds no such thing.

<!-- trace:case id=g10.site-crawlable-pages.TC-5lf rev=1 covers=g10.site-crawlable-pages.SC-1bc,g10.site-crawlable-pages.SC-wdx,g10.site-crawlable-pages.SC-in9,g10.site-crawlable-pages.SC-zo0 -->
### grade10-site-site-crawlable-pages-US5-TC3-1: Missing named thing answers 404 with not-found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-05

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address beneath a surface that names one thing the site does not hold>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 404.
* A collector opening it still sees the site's not-found surface.

<!-- trace:case id=g10.site-crawlable-pages.TC-2fd rev=1 covers=g10.site-crawlable-pages.SC-1bc,g10.site-crawlable-pages.SC-wdx,g10.site-crawlable-pages.SC-in9,g10.site-crawlable-pages.SC-zo0 -->
### grade10-site-site-crawlable-pages-US5-TC4-1: Unknown address answers 404 with not-found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-05

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the site answers>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 404.
* A collector opening it still sees the site's not-found surface.
