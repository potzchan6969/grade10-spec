---
title: Store Location Test Cases
---

# grade10-site/store/store-locator Test Cases

**Drafts styled:** 2026-10-24, tcs-rules r7
**Capabilities:** grade10-site/store/store-locator

## Walk 1: Find the shop from the header

**Starting state:**

- customer on `<g10url>/store/collections`, in a wide desktop browser window, in the default language

### Route

1. Read the header's primary nav, then select Store Locator in it.
   - The link sits before Help and opens the page `g10.store-store-locator.TC6`
2. Read the address bar and the header.
   - A top-level address, Store Locator alone marked `g10.store-store-locator.TC3`
3. Read the page under Location & Hours.
   - The map, name, address and hours `g10.store-store-locator.TC1`
4. Select the map.
   - Google Maps opens in a new tab `g10.store-store-locator.TC2`

## store-locator#shop: Shop

<!-- trace:case id=g10.store-store-locator.TC-mgx rev=2 -->
### g10.store-store-locator.TC1: The page shows the shop's map, name, address and hours in the page's language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#shop/in-each-language, store-locator#shop/no-phone-no-holiday-hours, store-locator#the-page/location--hours

**Pre-conditions:**

* customer uses a browser with page scripts as the row says.

**Test data:**

| Language | Address | Scripts |
| --- | --- | --- |
| English | `<g10url>/store-locator` | on |
| English | `<g10url>/store-locator` | off |
| Traditional Chinese | `<g10url>/tc/store-locator` | on |
| Simplified Chinese | `<g10url>/sc/store-locator` | on |

**Steps:**

1. Open the row's address.
2. Read the page under Location & Hours.

**Expected Results:**

* Step 2: a map of the shop, Hong Kong Grade10 Store, 13 Pak Sha Road, Causeway Bay, Hong Kong, and 11am – 9pm for every day, UI matching store-store-locator-screens-store-locator--default.
* The name, address and hours read in the row's language, the hours in that language's own time format.
* No phone number and no holiday hours.

---

## store-locator#the-page: The Page

<!-- trace:case id=g10.store-store-locator.TC-nee rev=1 -->
### g10.store-store-locator.TC2: The map opens Google Maps for the shop in a new tab

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#the-page/map-opens-maps

**Pre-conditions:**

* customer is on `<g10url>/store-locator`, with the row's map.

**Test data:**

| Map |
| --- |
| Google's map loaded |
| Google's map blocked, UI matching store-store-locator-screens-store-locator--map-not-loaded |
| page scripts off |

**Steps:**

1. Read the map area.
2. Select the map.

**Expected Results:**

* Step 1 shows no separate Get directions control.
* Step 2 opens Google Maps at 13 Pak Sha Road, Causeway Bay, Hong Kong, in a new tab, and the page stays open.

<!-- trace:case id=g10.store-store-locator.TC-pnx rev=1 -->
### g10.store-store-locator.TC3: The address is top level, and the header marks Store Locator alone

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#the-page/url, store-locator#the-page/chrome-reaches-it

**Pre-conditions:**

* customer is on a site that carries the store.

**Test data:**

| Address |
| --- |
| `<g10url>/store-locator` |
| `<g10url>/tc/store-locator` |

**Steps:**

1. Open the row's address.
2. Read the address bar and the header.

**Expected Results:**

* The address stays the row's, outside `/store`.
* The header marks Store Locator as current; Store is not marked.

---

## store-locator#from-elsewhere: From Elsewhere

<!-- trace:case id=g10.store-store-locator.TC-j4m rev=2 -->
### g10.store-store-locator.TC6: The header, the footer and free pick-up lead to Store Locator

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#the-page/chrome-reaches-it, store-locator#from-elsewhere/free-pick-up-on-product-details

**Pre-conditions:**

* customer is on the row's page, on a site that carries the store.

**Test data:**

| Page | Link | Where it sits | Opens |
| --- | --- | --- | --- |
| `<g10url>/store/collections` | Store Locator in the header's primary nav | directly before Help, which ends the nav | `<g10url>/store-locator` |
| `<g10url>/store/collections` | Store Locator in the footer's Help column | first, ahead of Docs | `<g10url>/store-locator` |
| `<g10url>/tc/store/products/<pickup product>` | the store name in the free pick-up line | - | `<g10url>/tc/store-locator`, in the same tab, the name matching the page's |

**Steps:**

1. Read the row's link and where it sits.
2. Select it.

**Expected Results:**

* Step 1: the link sits where the row says.
* Step 2 opens the row's page.

---

## Ungrouped

### store-locator#the-page: The Page

<!-- trace:case id=g10.store-store-locator.TC-x9i rev=1 -->
#### g10.store-store-locator.TC4: At 375px wide the page scrolls only vertically

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#the-page/narrow-screens

**Pre-conditions:**

* customer uses a browser 375px wide.

**Steps:**

1. Open `<g10url>/store-locator`.
2. Scroll sideways, then down.

**Expected Results:**

* The page moves down only, never sideways, UI matching store-store-locator-screens-store-locator--narrow.
* The map, name, address and hours all show.

#### g10.store-store-locator.TC5: A shared link to Store Locator previews with the page's own title and description

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#the-page/document-identity

**Pre-conditions:**

* customer can paste a link into a chat app that shows link previews.

**Steps:**

1. Paste `<g10url>/store-locator` into the chat and read its preview.

**Expected Results:**

* The preview reads `Store Locator — Grade10` and `Where to find the Grade10 shop in Causeway Bay, Hong Kong, and when it is open.`, and no other page's title.

---

### store-locator#from-elsewhere: From Elsewhere

<!-- trace:case id=g10.store-store-locator.TC-36r rev=2 -->
#### g10.store-store-locator.TC7: Where the store is not carried, there is no Store Locator

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** store-locator#the-page/chrome-reaches-it, store-locator#from-elsewhere

**Pre-conditions:**

* customer is on the home page of a site that does not carry the store, such as production today.

**Steps:**

1. Read the header and the footer.
2. Open `/store-locator` on that site.

**Expected Results:**

* Step 1: no Store Locator link in either.
* Step 2 shows the site's not-found page.
