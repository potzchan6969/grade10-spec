# grade10-site/site/crawlable-pages Test Cases

**Status:** pending-review · 0/2
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (seo):** grade10-site-site-crawlable-pages-SC-01, grade10-site-site-crawlable-pages-SC-02, grade10-site-site-crawlable-pages-SC-03, grade10-site-site-crawlable-pages-SC-04, grade10-site-site-crawlable-pages-SC-05, grade10-site-site-crawlable-pages-SC-06, grade10-site-site-crawlable-pages-SC-07, grade10-site-site-crawlable-pages-SC-08, grade10-site-site-crawlable-pages-SC-09, grade10-site-site-crawlable-pages-SC-10, grade10-site-site-crawlable-pages-SC-11, grade10-site-site-crawlable-pages-SC-16, grade10-site-site-crawlable-pages-SC-17, grade10-site-site-crawlable-pages-SC-18, grade10-site-site-crawlable-pages-SC-19, grade10-site-site-crawlable-pages-SC-20, grade10-site-site-crawlable-pages-SC-21, grade10-site-site-crawlable-pages-SC-22, grade10-site-site-crawlable-pages-SC-24 - what a fetch with no script reads, the names and previews it carries, the sitemap and robots, and the one address a crawler keeps per thing

## g10.site-crawlable-pages.US1: Collector reads a public surface before scripts run

**As a** collector,
**I want** a public address to answer with its title, description, headline,
and static copy in the first response,
**so that** I can read the surface immediately and still have it once scripts
make the page interactive.

## g10.site-crawlable-pages.US2: Collector tells one surface from another by name

**As a** collector,
**I want** every public surface to carry its own title and meta description,
and the document title to follow an in-page navigation,
**so that** the surface I am on is named distinctly from every other, even
after a navigation with no page load.

## g10.site-crawlable-pages.US3: Preview fetcher unfurls a shared link

**As a** preview fetcher,
**I want** Open Graph title, description, and URL readable without executing
scripts,
**so that** a shared link unfurls as the surface it points at.

## g10.site-crawlable-pages.US4: Crawler discovers every public address

**As a** crawler,
**I want** a robots.txt naming a sitemap that is read from the catalogue when
it is fetched,
**so that** I fetch every public address the site answers, and none it would
refuse.

## g10.site-crawlable-pages.US5: Collector opens an address the site may not hold

**As a** collector,
**I want** an address to answer with its true status — the deepest surface
naming it, or a 404 that still shows me the not-found surface,
**so that** I land on the surface that owns the address and am never told
nothing is wrong when the site holds no such thing.

<!-- trace:case id=g10.site-crawlable-pages.TC-5lf rev=1 covers=g10.site-crawlable-pages.SC-1bc,g10.site-crawlable-pages.SC-wdx,g10.site-crawlable-pages.SC-in9,g10.site-crawlable-pages.SC-zo0 -->
### g10.site-crawlable-pages.US5-TC3: An address the site holds nothing at answers 404 and still shows the not-found page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-05

**Pre-conditions:**

* A collector opens `<address>` on the Grade10 site.

**Test data:**

| `<address>` |
| --- |
| an address beneath a surface that names one thing, naming a thing the site does not hold |
| an address under no surface the site answers |

**Steps:**

1. Open it, and read the response's status and the page.

**Expected Results:**

* The status is 404, and the page shows the site's not-found surface.

---

## g10.site-crawlable-pages.US6: Crawler holds one page per thing

**As a** crawler,
**I want** each item, each narrowing and each seller to answer at one address,
**so that** I hold one page for each thing the site sells or names, rather than
several that say almost the same.

## g10.site-crawlable-pages.US7: Collector opens a link the site has replaced

**As a** collector,
**I want** an address the site no longer uses to send me to the one that
replaced it,
**so that** a bookmark or an old link still opens what I saved, in one step.

<!-- trace:case id=g10.site-crawlable-pages.TC-vkr rev=1 -->
### g10.site-crawlable-pages.US7-TC1: An address the site has replaced opens the page that replaced it

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-07

**Pre-conditions:**

* `<replaced address>` is an address the site has replaced, saved as a bookmark.

**Steps:**

1. Open the bookmark, and read the response's status and the address shown.

**Expected Results:**

* It answers 301 naming the replacing address, which opens with 200, showing what was saved.
