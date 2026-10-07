# grade10-site/store Cross-Feature E2E Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-store-e2e-US10: Collector goes from free pick-up to the shop on Google Maps

**As a** collector,
**I want** free pick-up on a card's page to take me to the shop's page and on
to Google Maps,
**so that** the shop I would pick up from is the one I find, in my own
language.

<!-- trace:case id=g10.store-domain.TC-frk rev=1 covers=g10.store-product-page.SC-21b,g10.store-product-page.SC-res,g10.store-store-locator.SC-ny2,g10.store-store-locator.SC-evn,g10.store-store-locator.SC-t9d,g10.store-store-locator.SC-iwa,g10.store-store-locator.SC-vb8,g10.store-store-locator.SC-la1,g10.store-store-locator.SC-ux5,g10.store-store-locator.SC-1zq,g10.store-store-locator.SC-l9w,g10.store-store-locator.SC-bfr,g10.store-store-locator.SC-gk9,g10.store-store-locator.SC-ca5,g10.store-store-locator.SC-91n,g10.store-store-locator.SC-w6y -->
### grade10-site-store-e2e-US10-TC1-1: Free pick-up leads to the same shop and on to Maps

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-store-product-page-US-10, grade10-site-store-store-locator-US-01, grade10-site-store-store-locator-US-02

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* `<product>` is any card with its one item for sale.

**Test data:**

| `<lang>` | `<language>` |
| --- | --- |
| (none) | English |
| /tc | Traditional Chinese |
| /sc | Simplified Chinese |

**Steps:**

1. Navigate to <grade10 product url> for `<product>` under `<lang>`.
2. Read the store name in the free pick-up claim.
3. Click the store name.
4. Read the store name under Location & Hours.
5. Click the map.
6. Switch to the new tab.

**Expected Results:**

* Step 2's store name reads in `<language>`.
* Step 3 opens Store Locator; URL contains `<lang>`.
* Step 4's store name is step 2's, word for word.
* Step 5 opens a new tab; the first tab stays on Store Locator.
* Step 6 shows Google Maps at 13 Pak Sha Road, Causeway Bay, Hong Kong.
