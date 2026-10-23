---
title: Store Location Test Cases
---

# grade10-site/store/store-locator Test Cases

**Status:** pending-review · 0/8
**Drafts styled:** 2026-10-22, tcs-rules r6

## Walk 1: Find the Shop from the Header

**Starting state:**

- customer is on `<store listing url>`, in a wide desktop browser window, in the default language.

**Shared test data:**

| Field | Value |
| --- | --- |
| `store listing url` | `<g10url>/store/collections` |
| `store locator url` | `<g10url>/store-locator` |

### Route

1. Read the header's primary nav, then click Store Locator in it.
   - Record the link's place before Help and the page it opens `g10.store-store-locator.US2-TC1`
2. Read the header's current mark and the address bar.
   - Record Store Locator alone marked, at a top-level address `g10.store-store-locator.US2-TC3`
3. Read the page under Location & Hours.
   - Record the map, name, address and hours `g10.store-store-locator.US1-TC1`
4. Click the map.
   - Record Google Maps opening in a new tab `g10.store-store-locator.US1-TC2`

## g10.store-store-locator.US1: Find the shop's address and hours

**As a** customer,
**I want** to see where Grade10's Hong Kong shop is and when it is open,
**so that** I can visit it or pick up an order.

<!-- trace:case id=g10.store-store-locator.TC-mgx rev=1 -->
### g10.store-store-locator.US1-TC1: The page shows the shop's map, name, address and hours

Runs once per row of **Test data**.

**Classification:**

* **Severity:** blocker
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, smoke, regression, prod
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-store-locator.US1

**Pre-conditions:**

* customer uses a browser with page JavaScript `<script state>`.

**Test data:**

| Partition | `<script state>` |
| --- | --- |
| Scripts run | Enabled. |
| No scripts | Disabled. |

**Steps:**

1. Navigate to `<store locator url>`.
2. Read the page under the Location & Hours heading.

**Expected Results:**

* Step 2 shows a map of the shop.
* Step 2 shows Hong Kong Grade10 Store.
* Step 2 shows 13 Pak Sha Road, Causeway Bay, Hong Kong.
* Step 2 shows 11am – 9pm for each day of the week.
* Step 2 shows no phone number and no holiday hours.

<!-- trace:case id=g10.store-store-locator.TC-nee rev=1 -->
### g10.store-store-locator.US1-TC2: The map opens Google Maps for the shop in a new tab

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** acceptance, regression, prod
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-store-locator.US1

**Pre-conditions:**

* customer is on `<store locator url>` with `<map state>`.

**Test data:**

| Partition | `<map state>` |
| --- | --- |
| Map loaded | Google's map loaded. |
| Map not loaded | Requests to Google's map blocked. |
| No scripts | Page JavaScript disabled. |

**Steps:**

1. Read the map area.
2. Click the map.
3. Read the new tab.

**Expected Results:**

* Step 1 shows no separate Get directions control.
* Step 2 opens a new tab and keeps the page.
* Step 3 shows Google Maps at 13 Pak Sha Road, Causeway Bay, Hong Kong.

---

## g10.store-store-locator.US2: Reach the shop's page from the site

**As a** customer,
**I want** the header and footer to lead me to the shop's page,
**so that** I find it from wherever I am on the site.

<!-- trace:case id=g10.store-store-locator.TC-j4m rev=1 -->
### g10.store-store-locator.US2-TC1: Header and footer lead to Store Locator, in their places

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-store-locator.US2

**Pre-conditions:**

* customer is on `<store listing url>`.

**Test data:**

| Partition | `<chrome>` | `<expected place>` |
| --- | --- | --- |
| Header | The header's primary nav. | Directly before Help, which ends the nav. |
| Footer | The footer's Help column. | First, ahead of Docs. |

**Steps:**

1. Read the Store Locator link in `<chrome>`.
2. Click it.

**Expected Results:**

* Step 1 shows the link at `<expected place>`.
* Step 2 opens `<store locator url>`.

<!-- trace:case id=g10.store-store-locator.TC-pnx rev=1 -->
### g10.store-store-locator.US2-TC3: The address is top level, and the header marks only Store Locator

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-store-locator.US2

**Pre-conditions:**

* customer is on a lane that carries the store, in `<lang>`.

**Test data:**

| Partition | `<lang>` |
| --- | --- |
| Default language | Nothing. |
| Traditional Chinese | `/tc`. |

**Steps:**

1. Navigate to `<lang>/store-locator`.
2. Read the address bar.
3. Read which header item is marked as current.

**Expected Results:**

* Step 2 reads `<lang>/store-locator`, outside `/store`.
* Step 3 marks Store Locator alone; Store is not marked.

---

## Ungrouped

### g10.store-store-locator.US1: Find the shop's address and hours

**As a** customer,
**I want** to see where Grade10's Hong Kong shop is and when it is open,
**so that** I can visit it or pick up an order.

<!-- trace:case id=g10.store-store-locator.TC-1on rev=1 -->
#### g10.store-store-locator.US1-TC3: Name, address and hours read in the page's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** g10.store-store-locator.US1

**Pre-conditions:**

* `<pickup product>` is available.

**Test data:**

| Partition | `<lang>` |
| --- | --- |
| English | Nothing. |
| Traditional Chinese | `/tc`. |
| Simplified Chinese | `/sc`. |

**Steps:**

1. Navigate to `<lang>/store-locator`.
2. Read the store name, address and hours.
3. Navigate to `<lang>/store/products/<pickup product handle>`.
4. Read the store name in the free pick-up line.

**Expected Results:**

* Step 2 shows the name, address and hours in `<lang>`'s language.
* Step 2's hours follow that language's own time format.
* Step 2's store name matches step 4's.

<!-- trace:case id=g10.store-store-locator.TC-x9i rev=1 -->
#### g10.store-store-locator.US1-TC4: At 375px wide the page scrolls only vertically

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-store-locator.US1

**Pre-conditions:**

* customer uses a browser 375px wide.

**Steps:**

1. Navigate to `<store locator url>`.
2. Scroll the page sideways and down.

**Expected Results:**

* Step 2 moves the page down only, never sideways.
* The map, name, address and hours all show.

---

### g10.store-store-locator.US2: Reach the shop's page from the site

**As a** customer,
**I want** the header and footer to lead me to the shop's page,
**so that** I find it from wherever I am on the site.

<!-- trace:case id=g10.store-store-locator.TC-36r rev=1 -->
#### g10.store-store-locator.US2-TC2: Store Locator waits with the store on lanes that do not carry it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression, prod
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** g10.store-store-locator.US2

**Pre-conditions:**

* customer is on `<lane>`'s home address.

**Test data:**

| Partition | `<lane>` | `<expected links>` | `<expected page>` |
| --- | --- | --- | --- |
| Store carried | Staging. | Store Locator in the header and footer. | The page, status 200. |
| Store not carried | Production, `grade10.com`. | No Store Locator in the header or footer. | The site's not-found page, status 404. |

**Steps:**

1. Read the header and the footer.
2. Navigate to `/store-locator` on `<lane>`.
3. Inspect the document response in browser developer tools.
4. Read `/sitemap.xml` on `<lane>`.

**Expected Results:**

* Step 1 shows `<expected links>`.
* Steps 2 and 3 show `<expected page>`.
* Step 4 lists `/store-locator` only where the store is carried.

---

### g10.store-store-locator.US3: Preview the shop's page from a link

**As a** customer,
**I want** a pasted Store Locator address to preview as the shop's page,
**so that** whoever I send it to knows what it is before opening it.

<!-- trace:case id=g10.store-store-locator.TC-dzc rev=1 -->
#### g10.store-store-locator.US3-TC1: The page has its own title, description and Open Graph tags

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** g10.store-store-locator.US3

**Pre-conditions:**

* The lane under test carries the store.

**Steps:**

1. Read the API response for `<store locator url>`, without running scripts.
2. Read the API response for `<store listing url>` the same way.
3. Read `/sitemap.xml`.

**Expected Results:**

* Step 1's title is `Store Locator — Grade10`.
* Step 1's meta description is `Where to find the Grade10 shop in Causeway Bay, Hong Kong, and when it is open.`
* Step 1 has Open Graph title and description tags.
* Step 1's title, description and Open Graph tags differ from step 2's.
* Step 3 lists `/store-locator`.
