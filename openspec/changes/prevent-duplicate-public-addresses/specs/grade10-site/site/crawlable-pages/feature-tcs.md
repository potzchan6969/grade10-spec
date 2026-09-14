# grade10-site/site/crawlable-pages Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-14, tcs-rules r3.0

## grade10-site-site-crawlable-pages-US6: Crawler holds one page per thing

**As a** crawler,
**I want** each item, each narrowing and each seller to answer at one address,
**so that** I hold one page for each thing the site sells or names, rather than
several that say almost the same.

### grade10-site-site-crawlable-pages-US6-TC1-1: An item answers at one address only

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* An item published to one sales channel.

**Steps:**

1. Fetch the sitemap and collect every address it names for that item.
2. Fetch each collected address.

**Expected Results:**

* One address per language the site answers the item in, and no other.
* Every collected address is an address of the channel the item was published to.
* Each fetch returns status 200 with that item's title and description.

### grade10-site-site-crawlable-pages-US6-TC2-1: Another channel does not answer the same item

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
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* An item published to one sales channel.

**Steps:**

1. Build the address another sales channel would answer that item at, from its
   own key for the item.
2. Fetch that address with scripts turned off.
3. Open that address in the browser.

**Expected Results:**

* Step 2 returns status 404.
* Step 3 shows the site's not-found surface, not the item and not a catalogue.

### grade10-site-site-crawlable-pages-US6-TC3-1: A narrowing has no path of its own

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* `<narrowing>` names something the channel holds.

**Test data:**

| `<narrowing>` |
| --- |
| A subcategory of the channel's top-level category |
| A brand the channel's items carry |
| A grade the channel's items carry |
| A year the channel's items carry |
| One seller's items |
| An order the results can be read in |

**Steps:**

1. Fetch the channel's address with `<narrowing>` nested under it as a path.

**Expected Results:**

* The response carries no narrowed reading of the channel.
* It answers as the deepest surface naming that address, per the capability's
  honest-status rule.

### grade10-site-site-crawlable-pages-US6-TC4-1: Two narrowings name one address to keep

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* A sales channel that narrows by more than one facet.

**Steps:**

1. Fetch the channel's address carrying one narrowing in its query, with
   scripts turned off.
2. Fetch the same address carrying a different narrowing in its query.
3. Read the canonical link and the `og:url` tag in each response.

**Expected Results:**

* Both responses carry the same canonical address and the same `og:url`.
* That address is the channel's own, with no query on it.

### grade10-site-site-crawlable-pages-US6-TC5-1: The sitemap names an item once and no narrowing

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
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* An item published to one sales channel.

**Steps:**

1. Fetch the sitemap.

**Expected Results:**

* The item is named at one address per language the site answers it in.
* No address of another sales channel names that item.
* No entry carries a query.

### grade10-site-site-crawlable-pages-US6-TC6-1: A channel holds no identity address of its own

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* A seller the site names at its shared address.

**Steps:**

1. Fetch that seller's identity address nested under a sales channel.
2. Fetch the seller's shared address.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 returns status 200 and names that seller.

### grade10-site-site-crawlable-pages-US6-TC7-1: Nothing the site serves names a replaced address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-crawlable-pages-US-06

**Pre-conditions:**

* An address the site has replaced.

**Steps:**

1. Fetch the sitemap.
2. Fetch each public surface and collect its rendered links, its canonical link
   and its `og:url` tag.

**Expected Results:**

* No sitemap entry names the replaced address.
* No rendered link, canonical link or `og:url` tag names it.

---

## grade10-site-site-crawlable-pages-US7: Collector opens a link the site has replaced

**As a** collector,
**I want** an address the site no longer uses to send me to the one that
replaced it,
**so that** a bookmark or an old link still opens what I saved, in one step.

### grade10-site-site-crawlable-pages-US7-TC1-1: A replaced address sends the reader on in one hop

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-crawlable-pages-US-07

**Pre-conditions:**

* An address the site has replaced, whose replacement the site answers.

**Steps:**

1. Fetch the replaced address without following redirects.
2. Fetch the address the response names.

**Expected Results:**

* Step 1 returns status 301 and names the address that replaced it.
* Step 2 returns status 200 and is not itself a redirect.
