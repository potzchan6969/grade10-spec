---
title: Store Landing Test Cases
---

# grade10-site/store/home Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/home

## Background

* `<first collection>` and `<second collection>` have known names, handles and distinct products.

## Walk 1: Read the shop window

**Starting state:**

- customer on `<g10url>/store`, scripts on; the catalogue has answered [`<first collection>`, `<second collection>`]; `<displayed product>`, `<sold-out product>` and `<marked-down product>` are in the first collection and in the merchandised row, by the recipe "Put a card in the Main Page's merchandised row"

**Shared test data:**

| Field | Value |
| --- | --- |
| `<displayed product>` | for sale, with no earlier price |
| `<sold-out product>` | nothing for sale, by the recipe "Sell a card out" |
| `<marked-down product>` | for sale, marked down from a higher earlier price |

### Route

1. Read the collection grid from first tile to last.
   - Both collections, once each, in order `g10.store-home.TC3`
2. Read every card in the merchandised row.
   - Only the first collection's products `g10.store-home.TC5`
3. Read the three products' cards.
   - Sold out, and the earlier price beside the marked-down one `g10.store-home.TC6`
4. Look for a cart control on the cards, then select `<displayed product>`.
   - None; its own page opens `g10.store-home.TC7`

## home: Main Page

<!-- trace:case id=g10.store-home.TC-w79 rev=1 -->
### g10.store-home.TC3: The grid shows every collection once, in catalogue order

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* The catalogue returns the row's collections, with distinct names and handles.

**Test data:**

| Collections returned |
| --- |
| [`<first collection>`] |
| [`<first collection>`, `<second collection>`] - two stands for many, not a display limit |

**Steps:**

1. Open `<g10url>/store` and wait for the grid.
2. Read the tiles from first to last.

**Expected Results:**

* One tile per returned collection, in the order returned, UI matching store-home-blocks-storecollectiongrid--default.
* Each section's heading shows its title alone, with no browse-all link beside it.

<!-- trace:case id=g10.store-home.TC-q4t rev=1 -->
### g10.store-home.TC5: The row shows cards from the collection the shop lists first

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* The catalogue returns two collections with disjoint products, in the row's order.

**Test data:**

| Listed first | Listed second |
| --- | --- |
| Collection A | Collection B |
| Collection B | Collection A |

**Steps:**

1. Open `<g10url>/store` and read every card in the merchandised row.

**Expected Results:**

* Every card belongs to the collection listed first; none only in the second shows.

<!-- trace:case id=g10.store-home.TC-l20 rev=1 -->
### g10.store-home.TC6: Each card says sold out, and shows its earlier price where marked down

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* `<status product>` is in the merchandised row, by the recipe "Put a card in the Main Page's merchandised row", in the row's state.

**Test data:**

| `<status product>` | Card |
| --- | --- |
| for sale, no earlier price | not sold out; one price |
| nothing for sale, by the recipe "Sell a card out" | sold out |
| for sale, marked down from a higher earlier price | not sold out; the earlier price beside the current one |
| nothing for sale, and marked down | sold out; the earlier price beside the current one |

**Steps:**

1. Open `<g10url>/store` and read `<status product>`'s card.

**Expected Results:**

* The row's card, said the way the browse listing says it.

<!-- trace:case id=g10.store-home.TC-egn rev=1 -->
### g10.store-home.TC7: A card opens the product's own page and offers no cart

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* `<displayed product>` is in the merchandised row, in the row's state.

**Test data:**

| `<displayed product>` |
| --- |
| for sale |
| sold out, by the recipe "Sell a card out" |

**Steps:**

1. Open `<g10url>/store` and look for a cart control on every merchandised card.
2. Select `<displayed product>`'s card.

**Expected Results:**

* Step 1 finds none.
* Step 2 opens `<displayed product>`'s own page.

---

## Ungrouped

### home: Main Page

<!-- trace:case id=g10.store-home.TC-5i5 rev=2 -->
#### g10.store-home.TC1: The hero shows before any script runs, whatever the catalogue does

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* customer uses a browser with page scripts off; the catalogue read is in the row's state.

**Test data:**

| Catalogue |
| --- |
| answers with collections and products |
| held pending while the page arrives |
| fails |

**Steps:**

1. Open `<g10url>/store`.

**Expected Results:**

* The hero shows its label, headline, copy, image and both ways on, as the hero in UI matching store-home-screens-store-home--default.

<!-- trace:case id=g10.store-landing.TC-0gm rev=2 -->
#### g10.store-home.TC2: A store link people already hold lands on the Main Page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* customer is signed out on a site that carries the store, such as staging.

**Test data:**

| Link held |
| --- |
| `<g10url>/store`, as a bookmark or a shared link |
| ❓ an earlier store address - the Main Page PRD does not name which still land here |

**Steps:**

1. Open the row's link.

**Expected Results:**

* The Main Page shows, its hero first, and the address bar reads `<g10url>/store`.

<!-- trace:case id=g10.store-home.TC-usm rev=1 -->
#### g10.store-home.TC4: A collection added in the shop arrives on the grid with no deploy

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* The catalogue publishes `<existing collection>`; `<new collection>` is ready and not yet published; the site deployment stays fixed throughout.
* admin can open the shop's admin.

**Steps:**

1. Open `<g10url>/store` and read the grid.
2. Publish `<new collection>` in the shop's admin, wait 60 seconds, then reload `<g10url>/store`.

**Expected Results:**

* Step 1 shows `<existing collection>` and no `<new collection>`.
* Step 2 shows one tile for `<new collection>`, in the shop's updated order.

<!-- trace:case id=g10.store-home.TC-aw0 rev=1 -->
#### g10.store-home.TC8: A catalogue section says it is loading until the catalogue answers

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home

**Pre-conditions:**

* The row's catalogue read is held pending until the tester releases it.

**Test data:**

| Section | Content once released |
| --- | --- |
| the collection grid | two collections, in catalogue order |
| the merchandised row | the first collection's products |

**Steps:**

1. Open `<g10url>/store` and read the row's section.
2. Release the read.

**Expected Results:**

* Step 1 shows the section loading.
* Step 2 shows the row's content, and no longer loading.

<!-- trace:case id=g10.store-home.TC-9ds rev=2 -->
#### g10.store-home.TC9: A failed section says so, and retry fills it without reloading the page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** home

**Pre-conditions:**

* The row's first catalogue read fails; the next one answers.

**Test data:**

| Section | Content after retry |
| --- | --- |
| the collection grid | two collections, in catalogue order |
| the merchandised row | the first collection's products |

**Steps:**

1. Open `<g10url>/store`, scroll to the row's section and read it.
2. Select its retry control.

**Expected Results:**

* Step 1: the section says it could not be read, with a retry control.
* Step 2: the row's content replaces the failure; the page does not reload, and stays scrolled where it was.

<!-- trace:case id=g10.store-home.TC-05u rev=1 -->
#### g10.store-home.TC10: A section with nothing to show is absent, with no heading

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* The catalogue answers the row's empty content.

**Test data:**

| Section | Catalogue answers |
| --- | --- |
| the collection grid | no collections |
| the merchandised row | a first collection with no products |

**Steps:**

1. Open `<g10url>/store` and wait for the catalogue.

**Expected Results:**

* The section is absent: no heading, and nothing loading or failed.

<!-- trace:case id=g10.store-landing.TC-n1y rev=2 -->
#### g10.store-home.TC11: Where the store is not public, its address is the not-found page

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** home

**Pre-conditions:**

* customer is signed out on a site where the store is not public, such as production today.

**Steps:**

1. Open `/store` on that site.

**Expected Results:**

* The site's not-found page shows.
