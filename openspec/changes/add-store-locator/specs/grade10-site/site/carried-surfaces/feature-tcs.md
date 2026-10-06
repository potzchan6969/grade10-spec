# grade10-site/site/carried-surfaces Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-site-carried-surfaces-US1: Collector reads a site whose shop has not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a shop it cannot
serve me from,
**so that** I am never shown a price, a basket or a pay button for a shop
nobody is ready to sell me from.

<!-- trace:case id=g10.site-carried-surfaces.TC-kv7 rev=2 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr,g10.site-carried-surfaces.SC-wjy -->
### grade10-site-site-carried-surfaces-US1-TC2-2: Footer carries no shop column and no store link

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-01

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Read every column and every link the footer holds.

**Expected Results:**

* The footer carries no shop column.
* No footer link names a store address.
* The Help column holds no Store Locator link.

---

## grade10-site-site-carried-surfaces-US2: Collector opens a store address the public site does not hold

**As a** collector,
**I want** a store address I typed, bookmarked or followed on the public site
to tell me the site does not hold it,
**so that** I learn the page is not there instead of waiting on one that will
never render.

<!-- trace:case id=g10.site-carried-surfaces.TC-ynq rev=2 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC1-2: Every store address answers not-found with a 404

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Test data:**

| `<store address>` |
| --- |
| The store |
| A collection under the store |
| A card's own page |
| The address the shop hands out for a product |
| The address the shop hands out for a collection |
| The cart |
| The checkout |
| A collector's order history |
| A collector's order detail |
| Store Locator |

**Steps:**

1. Fetch `<store address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface, not a store surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-0x1 rev=2 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC2-2: An address beneath a store surface answers the same way

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Test data:**

| `<nested store address>` |
| --- |
| An address beneath the store |
| An address beneath a collection |
| An address beneath a card's page |
| An address beneath the cart |
| An address beneath the checkout |
| An address beneath a collector's order history |
| An address beneath Store Locator |

**Steps:**

1. Fetch `<nested store address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface.

---

## grade10-site-site-carried-surfaces-US3: Crawler is offered only the addresses the site answers

**As a** crawler,
**I want** the site to name only the addresses the build in front of me
answers,
**so that** I never index a page that answers not-found and never carry it
into a search result.

<!-- trace:case id=g10.site-carried-surfaces.TC-xjk rev=3 covers=g10.site-carried-surfaces.SC-k78,g10.site-carried-surfaces.SC-ujp,g10.site-carried-surfaces.SC-qxv,g10.site-carried-surfaces.SC-wjy -->
### grade10-site-site-carried-surfaces-US3-TC1-3: Sitemap names no store, vault or booking address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-03

**Pre-conditions:**

* The site under test is a build that carries none of the store's, the
  vault's or booking's surfaces.

**Steps:**

1. Fetch the sitemap on <grade10 public site url>.

**Expected Results:**

* No entry names the store, a collection, a card's page, the cart, the
  checkout, an order page, Store Locator, the vault, a case's page or booking
  a visit.
* Every entry names a surface the build carries.

<!-- trace:case id=g10.site-carried-surfaces.TC-24a rev=3 covers=g10.site-carried-surfaces.SC-k78,g10.site-carried-surfaces.SC-ujp,g10.site-carried-surfaces.SC-qxv,g10.site-carried-surfaces.SC-wjy -->
### grade10-site-site-carried-surfaces-US3-TC4-3: Crawler files name the store, the vault and booking where the build carries them

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-03

**Pre-conditions:**

* The site under test is a build that carries the store's, the vault's and
  booking's surfaces.

**Steps:**

1. Fetch the sitemap on <grade10 staging site url>.
2. Fetch every store, vault and booking address the sitemap names.

**Expected Results:**

* The sitemap names the store and the collections under it, Store Locator,
  and booking a visit.
* Every address it names for the three returns status 200.

---

## grade10-site-site-carried-surfaces-US4: Collector buys on the lane the shop is open on

**As a** collector,
**I want** every store surface to work unchanged where the shop is open,
**so that** hiding the shop on the public site costs nothing to the lanes it
is still sold on.

<!-- trace:case id=g10.site-carried-surfaces.TC-weg rev=2 covers=g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US4-TC1-2: Every store address answers on a lane that carries the store

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-04

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* A collector is signed in with at least one placed order.

**Test data:**

| `<store address>` |
| --- |
| The store |
| A collection under the store |
| A card's own page |
| The address the shop hands out for a product |
| The address the shop hands out for a collection |
| The cart |
| The checkout |
| A collector's order history |
| A collector's order detail |
| Store Locator |

**Steps:**

1. Fetch `<store address>` on <grade10 staging site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 200.
* Step 2 renders that store surface, not the not-found surface.

---

## grade10-site-site-carried-surfaces-US5: Collector reads a site whose products have not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a product it cannot
serve me from,
**so that** I am never shown a case to open or a visit to book that nobody is
ready to honour.

<!-- trace:case id=g10.site-carried-surfaces.TC-azq rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq -->
### grade10-site-site-carried-surfaces-US5-TC1-2: Header names no withheld product and carries no cart control

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Read every item and every control the header holds.

**Expected Results:**

* No header item names the store, the vault or booking a visit.
* No header item names Store Locator.
* The header carries no cart control.

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite and the durable one it extends, the delta `spec.md` with its scenarios, `tech-design.md`, `decisions.md`, `tasks.md` and the Carried Surfaces and Store Locator pages. The blind pass recorded no Run line of its own and raised nothing on this capability. A second QA2 run, 2026-10-06 in a fresh context after the accept review's edits, read the same set and the application repository's footer and sitemap, and checked each disposition below against the current scenarios.

- **Folded** — `grade10-site-site-carried-surfaces-SC-41`, Store Locator waiting with the store, across the cases this change extends: not found on a build without the store (`grade10-site-site-carried-surfaces-US2-TC1-2`, `grade10-site-site-carried-surfaces-US2-TC2-2`), named in neither the header (`grade10-site-site-carried-surfaces-US5-TC1-2`) nor the footer (`grade10-site-site-carried-surfaces-US1-TC2-2`) and absent from the sitemap (`grade10-site-site-carried-surfaces-US3-TC1-3`); answered and listed on a build with it (`grade10-site-site-carried-surfaces-US4-TC1-2`, `grade10-site-site-carried-surfaces-US3-TC4-3`). Its header and footer on a carrying build are the Store Locator suite's `grade10-site-store-store-locator-US1-TC4-1` and `grade10-site-store-store-locator-US1-TC5-1`
- **Revisions moved** — each of the seven cases gained Store Locator in what it verifies, so each takes the next revision and stays draft: `US1-TC2`, `US2-TC1`, `US2-TC2`, `US4-TC1` and `US5-TC1` to 2, `US3-TC1` and `US3-TC4` to 3. Their trace markers move with them at the fold
- **Contradicted** — none
- **Uncovered anchors** — none: the What a build carries leaf this change widens is reached by the cases above
