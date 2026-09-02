# grade10-site/crawlable-pages Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-02, tcs-rules r1

## crawlable-pages-US1: Collector reads a public surface before scripts run

**As a** collector,
**I want** a public address to answer with its title, description, headline,
and static copy in the first response,
**so that** I can read the surface immediately and still have it once scripts
make the page interactive.

### crawlable-pages-US1-TC1-1: Marketing page answers whole before scripts run

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-01

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check the rendered page.
3. Check the page source.

**Expected Results:**

* Response HTML contains the marketing page's title, meta description, headline, and static copy.
* URL contains <lang>.

### crawlable-pages-US1-TC2-1: Catalogue answers its identity before scripts run

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-01

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <grade10 store url>.
2. Check the page source.
3. Navigate to <grade10 auction url> with JavaScript still disabled and check the page source.

**Expected Results:**

* Each response HTML contains that surface's title, meta description, headline, and static copy.
* Listings themselves may be absent until scripts run.

### crawlable-pages-US1-TC3-1: Scripts only add to the served surface

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-01

**Pre-conditions:**
A public surface is served with its content in the HTML.

**Steps:**

1. Navigate to <grade10 marketing url> with JavaScript enabled.
2. Wait until scripts finish loading.
3. Check the surface on screen.

**Expected Results:**

* The same surface is on screen with its served content still present.
* Every interactive behavior the surface specifies works.

---

## crawlable-pages-US2: Collector tells one surface from another by name

**As a** collector,
**I want** every public surface to carry its own title and meta description,
and the document title to follow an in-page navigation,
**so that** the surface I am on is named distinctly from every other, even
after a navigation with no page load.

### crawlable-pages-US2-TC1-1: Two public surfaces carry two names

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-02

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <grade10 marketing url> and note title and meta description.
2. Navigate to <grade10 store url> and note the same two.

**Expected Results:**

* Titles differ.
* Meta descriptions differ.

### crawlable-pages-US2-TC2-1: Document title follows in-page navigation

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-02

**Pre-conditions:**
A collector is on one public surface.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Follow an in-app link to <grade10 store url> without a page load.
3. Check the document title.

**Expected Results:**

* The document title becomes the destination's.

---

## crawlable-pages-US3: Preview fetcher unfurls a shared link

**As a** preview fetcher,
**I want** Open Graph title, description, and URL readable without executing
scripts,
**so that** a shared link unfurls as the surface it points at.

### crawlable-pages-US3-TC1-1: Shared public link unfurls without scripts

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-03

**Pre-conditions:**
JavaScript disabled in the browser.

**Steps:**

1. Navigate to <grade10 marketing url>.
2. Check the page source for Open Graph tags.

**Expected Results:**

* Response HTML carries `og:title`, `og:description`, and `og:url` naming that surface and its canonical address.

---

## crawlable-pages-US4: Crawler discovers every public address

**As a** crawler,
**I want** a robots.txt naming a sitemap that is read from the catalogue when
it is fetched,
**so that** I fetch every public address the site answers, and none it would
refuse.

### crawlable-pages-US4-TC1-1: robots.txt permits public surfaces and names the sitemap

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-04

**Pre-conditions:**
None.

**Steps:**

1. Fetch <grade10 robots txt url>.

**Expected Results:**

* It permits crawling the public surfaces.
* It names the sitemap's absolute URL.

### crawlable-pages-US4-TC2-1: Sitemap lists public addresses and no session-gated ones

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-04

**Pre-conditions:**
None.

**Steps:**

1. Fetch <grade10 sitemap url>.
2. Check every entry.

**Expected Results:**

* It lists every public surface the build writes a document for, and every card and lot the catalogue holds, each as an absolute URL of the serving environment.
* Neither the profile nor sign-in appears.
* Every entry is an address a collector can fetch, with no unfilled parameter in place of a card or a lot.

### crawlable-pages-US4-TC3-1: Catalogue-gained card appears in the sitemap without a deploy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-04

**Pre-conditions:**
A card the catalogue did not hold when the site was built is now in the catalogue.

**Steps:**

1. Fetch <grade10 sitemap url> after the catalogue gains that card.

**Expected Results:**

* That card's address appears, with no deploy in between.

### crawlable-pages-US4-TC4-1: Every listed sitemap address answers 200

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-04

**Pre-conditions:**
None.

**Steps:**

1. Fetch <grade10 sitemap url>.
2. Fetch each address the sitemap names.

**Expected Results:**

* Each response has status 200.

---

## crawlable-pages-US5: Collector opens an address the site may not hold

**As a** collector,
**I want** an address to answer with its true status — the deepest surface
naming it, or a 404 that still shows me the not-found surface,
**so that** I land on the surface that owns the address and am never told
nothing is wrong when the site holds no such thing.

### crawlable-pages-US5-TC1-1: Nested store address answers as the store

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-05

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address beneath the store that no surface of its own names>.
2. Check the response status and identity.

**Expected Results:**

* Response status is 200.
* The response carries the store's identity.

### crawlable-pages-US5-TC2-1: Nested lot address answers as that lot

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** crawlable-pages-US-05

**Pre-conditions:**
The catalogue publishes <a published lot>.

**Steps:**

1. Navigate to <a published lot url>.
2. Check the response status and identity.

**Expected Results:**

* Response status is 200.
* The response carries that lot's identity, not the auction's.

### crawlable-pages-US5-TC3-1: Missing named thing answers 404 with not-found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-05

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address beneath a surface that names one thing the site does not hold>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 404.
* A collector opening it still sees the site's not-found surface.

### crawlable-pages-US5-TC4-1: Unknown address answers 404 with not-found

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** crawlable-pages-US-05

**Pre-conditions:**
None.

**Steps:**

1. Navigate to <an address under no surface the site answers>.
2. Check the response status and the rendered page.

**Expected Results:**

* Response status is 404.
* A collector opening it still sees the site's not-found surface.
