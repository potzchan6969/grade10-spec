# grade10-site/site/carried-surfaces Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## grade10-site-site-carried-surfaces-US1: Collector reads a site whose shop has not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a shop it cannot
serve me from,
**so that** I am never shown a price, a basket or a pay button for a shop
nobody is ready to sell me from.

<!-- trace:case id=g10.site-carried-surfaces.TC-0tx rev=1 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr -->
### grade10-site-site-carried-surfaces-US1-TC1-1: Header names no store surface and carries no cart control

**Deprecated:** superseded by `US5-TC1-1` and `US5-TC7-1`, which read the same
chrome for all three waiting products rather than the store alone.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
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
2. Read every item the header holds.

**Expected Results:**

* No header item names the store, a collection, a card's page, the cart, the
  checkout or an order page.
* The header carries no cart control.

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

<!-- trace:case id=g10.site-carried-surfaces.TC-sc7 rev=2 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr,g10.site-carried-surfaces.SC-wjy -->
### grade10-site-site-carried-surfaces-US1-TC3-2: Front door offers no store button and no store card

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
* **Trace:** grade10-site-site-carried-surfaces-US-01

**Pre-conditions:**

* The site under test is a build made with the front door carried and the
  store's set withheld. No lane is made this way, so the build is made for
  the test.

**Steps:**

1. Navigate to the front door on <url of the build under test>.
2. Read every button and every card the front door holds.

**Expected Results:**

* The front door carries no store button.
* The front door carries no store card.
* Nothing on it opens a store address.

<!-- trace:case id=g10.site-carried-surfaces.TC-cvr rev=1 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr -->
### grade10-site-site-carried-surfaces-US1-TC4-1: No rendered link on the site names a store address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-01

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Collect every rendered link on each surface the build carries.
3. Read the address each collected link names.

**Expected Results:**

* No collected link names a store address.
* Every collected link opens a surface the build carries.

<!-- trace:case id=g10.site-carried-surfaces.TC-pu0 rev=1 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr -->
### grade10-site-site-carried-surfaces-US1-TC5-1: Surfaces carried on every lane are still named

**Deprecated:** superseded by `US5-TC1-1` and `US5-TC7-1` — the vault and
booking wait beside the store now, so a build carrying none of the store's
surfaces no longer keeps them open the way this case asserted.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
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
2. Open each surface the header and the footer name.

**Expected Results:**

* The chrome still names the auction, the vault, booking a visit, membership,
  join and the profile.
* Each opens its own surface, not the not-found surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-25r rev=1 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr -->
### grade10-site-site-carried-surfaces-US1-TC6-1: Nothing names the store before scripts run

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-01

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.
* Scripts are turned off in the browser.

**Steps:**

1. Fetch <grade10 public site url> with scripts turned off.
2. Read every link and control the response holds.

**Expected Results:**

* No link in the response names a store address.
* The response holds no cart control and no store button.

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

<!-- trace:case id=g10.site-carried-surfaces.TC-uoa rev=1 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC3-1: A store address sends the collector nowhere else

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Fetch <grade10 store url> on <grade10 public site url> without following
   redirects.
2. Fetch the cart's address on the same lane without following redirects.

**Expected Results:**

* Both responses return status 404.
* Neither names an address to follow.

<!-- trace:case id=g10.site-carried-surfaces.TC-lq8 rev=1 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC4-1: A signed-in collector meets the same answer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.
* A collector is signed in on <grade10 public site url>.

**Steps:**

1. Open <grade10 store url>.
2. Open the checkout's address on the same lane.

**Expected Results:**

* Both render the not-found surface and answer with status 404.
* The collector is still signed in.

<!-- trace:case id=g10.site-carried-surfaces.TC-tqp rev=1 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC5-1: A store address answers not-found under every language prefix

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Fetch <grade10 store url> under each <lang> prefix the site answers.
2. Open one of those addresses in the browser.

**Expected Results:**

* Every fetch returns status 404.
* Step 2 renders the not-found surface in that language.

<!-- trace:case id=g10.site-carried-surfaces.TC-5mi rev=3 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC7-3: The preview host answers as the public site does

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

* The site under test is <grade10 preview site url>.

**Steps:**

1. Fetch <grade10 store url>, <grade10 vault url> and <grade10 booking url> on
   <grade10 preview site url>.
2. Open <grade10 preview site url> in the browser.

**Expected Results:**

* Step 1 returns status 404 for all three.
* Step 2 sends the collector on to the auction.
* The auction's header and footer name no store, vault or booking surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-heo rev=2 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### grade10-site-site-carried-surfaces-US2-TC8-2: A labs address is not held on preview or production

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is <grade10 preview site url>, then <grade10 public
  site url>.

**Steps:**

1. Fetch <a labs demonstration surface url> and <the unapproved refund draft
   url> on <grade10 preview site url>.
2. Fetch the same two addresses on <grade10 public site url>.

**Expected Results:**

* Every fetch in both steps returns status 404.
* Neither renders a demonstration surface or a draft on either lane.

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

<!-- trace:case id=g10.site-carried-surfaces.TC-1i5 rev=1 covers=g10.site-carried-surfaces.SC-k78,g10.site-carried-surfaces.SC-ujp,g10.site-carried-surfaces.SC-qxv -->
### grade10-site-site-carried-surfaces-US3-TC2-1: robots.txt names no store address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-03

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Fetch robots.txt on <grade10 public site url>.
2. Read every address it names.

**Expected Results:**

* No line names a store address.
* Every sitemap it names answers with status 200.

<!-- trace:case id=g10.site-carried-surfaces.TC-v00 rev=1 covers=g10.site-carried-surfaces.SC-k78,g10.site-carried-surfaces.SC-ujp,g10.site-carried-surfaces.SC-qxv -->
### grade10-site-site-carried-surfaces-US3-TC3-1: Every address the crawler files name answers

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-03

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Fetch the sitemap and robots.txt on <grade10 public site url>.
2. Fetch every address the two files name.

**Expected Results:**

* Every fetch returns status 200.
* No fetch renders the not-found surface.

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

<!-- trace:case id=g10.site-carried-surfaces.TC-wk5 rev=1 covers=g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US4-TC2-1: Collector reaches the checkout from a collection unchanged

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
* **Trace:** grade10-site-site-carried-surfaces-US-04

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.
* A collector is signed in on <grade10 staging site url>.
* The collector is on <a collection url>.

**Steps:**

1. Open a card's page from the collection.
2. Add the card to the cart.
3. Open the cart.
4. Open the checkout from the cart.

**Expected Results:**

* Each surface renders, and none is the not-found surface.
* The cart holds the card.
* The checkout offers to pay.

<!-- trace:case id=g10.site-carried-surfaces.TC-rjw rev=1 covers=none -->
### grade10-site-site-carried-surfaces-US4-TC3-1: Chrome and front door name the store on a carrying lane

**Deprecated:** superseded by `US8-TC5-1`, which reads the same chrome and
front door for all three waiting products on a carrying lane.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-04

**Pre-conditions:**

* The site under test is a build that carries the store surfaces.

**Steps:**

1. Navigate to <grade10 staging site url>.
2. Read the header, the footer and the front door.
3. Open the store from the header's navigation item.

**Expected Results:**

* The header names the store and carries a cart control.
* The footer carries a shop column, and the front door carries a store button
  and a store card.
* Step 3 renders the store.

<!-- trace:case id=g10.site-carried-surfaces.TC-y8k rev=1 covers=g10.site-carried-surfaces.SC-8tm,g10.site-carried-surfaces.SC-3r5 -->
### grade10-site-site-carried-surfaces-US4-TC4-1: Opening the store on a lane moves one stated line

**Deprecated:** superseded by `US8-TC6-1`, which proves the same one-line
opening for the vault and shows the other two waiting products stay shut.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-04

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Add that build's lane to the one stated list of lanes that carry the store.
2. Rebuild and deploy the site to that lane with no other edit.
3. Navigate to <grade10 store url> on that lane.
4. Fetch the sitemap on the same lane.

**Expected Results:**

* Step 3 renders the store, and the header, the footer and the front door name
  it.
* Step 4's sitemap names the store addresses.
* No surface outside the store's set changed.

---

## grade10-site-site-carried-surfaces-US5: Collector reads a site whose products have not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a product it cannot
serve me from,
**so that** I am never shown a case to open or a visit to book that nobody is
ready to honour.

<!-- trace:case id=g10.site-carried-surfaces.TC-azq rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
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

<!-- trace:case id=g10.site-carried-surfaces.TC-8km rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq -->
### grade10-site-site-carried-surfaces-US5-TC2-1: Footer carries no shop column and no withheld product link

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
2. Read every column and every link the footer holds.

**Expected Results:**

* The footer carries no shop column.
* No footer link names a store, vault or booking address.

<!-- trace:case id=g10.site-carried-surfaces.TC-04y rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### grade10-site-site-carried-surfaces-US5-TC3-2: Front door offers no button and no card for any withheld product

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build made with the front door carried and none
  of the store's, the vault's or booking's sets. No lane is made this way, so
  the build is made for the test.

**Steps:**

1. Navigate to the front door on <url of the build under test>.
2. Read every button and every card the front door holds.

**Expected Results:**

* No button and no card names the store, the vault or booking a visit.
* The card row itself still renders, holding no card.
* The front door's headline still renders.
* Nothing on the front door opens a withheld address.

<!-- trace:case id=g10.site-carried-surfaces.TC-g2n rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq -->
### grade10-site-site-carried-surfaces-US5-TC4-1: No rendered link on the site names a withheld address

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Collect every rendered link on each surface the build carries.
3. Read the address each collected link names.

**Expected Results:**

* No collected link names a store, vault or booking address.
* Every collected link opens a surface the build carries.

<!-- trace:case id=g10.site-carried-surfaces.TC-u8n rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq -->
### grade10-site-site-carried-surfaces-US5-TC5-1: A carried page's head names no withheld address

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Fetch <grade10 public site url>.
2. Read every address the response's head names.
3. Fetch a second surface the build carries and read the same.

**Expected Results:**

* No canonical, alternate-language or sharing address in either head names a
  store, vault or booking surface.
* Every address the two heads name returns status 200.

<!-- trace:case id=g10.site-carried-surfaces.TC-pwi rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq -->
### grade10-site-site-carried-surfaces-US5-TC6-1: Nothing names a withheld product before scripts run

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* Scripts are turned off in the browser.

**Steps:**

1. Fetch <grade10 public site url> with scripts turned off.
2. Read every link and every control the response holds.

**Expected Results:**

* No link in the response names a store, vault or booking address.
* The response holds no cart control and no button for a withheld product.

<!-- trace:case id=g10.site-carried-surfaces.TC-18i rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### grade10-site-site-carried-surfaces-US5-TC7-2: Surfaces carried on every lane are still named and still open

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Open each surface the header and the footer name.

**Expected Results:**

* The chrome names the auction, sign-in, the terms and the privacy page.
* Each opens its own surface, not the not-found surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-x0h rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### grade10-site-site-carried-surfaces-US5-TC8-2: Preview host names no withheld product either

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is <grade10 preview site url>.

**Steps:**

1. Navigate to <grade10 preview site url>.
2. Read the header and the footer.

**Expected Results:**

* Step 1 sends the collector on to the auction.
* Neither the header nor the footer names the store, the vault or booking a
  visit.
* The header carries no cart control.

<!-- trace:case id=g10.site-carried-surfaces.TC-v80 rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### grade10-site-site-carried-surfaces-US5-TC9-2: Chrome names no withheld product under any language prefix

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Navigate to <grade10 public site url> under each <lang> prefix the site
   answers.
2. Read the header and the footer under each prefix.

**Expected Results:**

* No item or link under any <lang> names a store, vault or booking surface.
* Every chrome item under each <lang> opens a surface the build carries.

<!-- trace:case id=g10.site-carried-surfaces.TC-7fd rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq -->
### grade10-site-site-carried-surfaces-US5-TC11-1: No lane links a collector vault screen

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

* The sites under test are <grade10 staging site url> and <grade10 development site url>, builds that carry the vault's set.
* customer(signed in, holding an open vault case) is on the lane under test.

**Steps:**

1. Navigate to the front door, then to the account page.
2. Collect every rendered link on each surface the build carries.
3. Read the address each collected link names.

**Expected Results:**

* No collected link names the case list, the request, a case's page, the identity check or Your data.
* The account page offers no Your data button.
* Every collected link opens a surface the build carries.

<!-- trace:case id=g10.site-carried-surfaces.TC-f3d rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### grade10-site-site-carried-surfaces-US5-TC12-1: The home address sends a collector on to the auction where the front door is withheld

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The site under test is a build that withholds the front door.

**Test data:**

| `<lane url>` |
| --- |
| <grade10 uat site url> |
| <grade10 preview site url> |
| <grade10 public site url> |

**Steps:**

1. Fetch the home address on `<lane url>` without following redirects.
2. Fetch the home address under each <lang> prefix the site answers, without
   following redirects.
3. Open the home address on `<lane url>` in the browser.

**Expected Results:**

* Steps 1 and 2 answer with a redirect that is not permanent, to the auction's
  address in the language asked for.
* Step 3 renders the auction.

<!-- trace:case id=g10.site-carried-surfaces.TC-mgf rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### grade10-site-site-carried-surfaces-US5-TC13-1: UAT withholds every waiting product, as production does

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
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* The sites under test are builds made for uat, preview and production.

**Test data:**

| `<lane url>` | `<withheld address>` |
| --- | --- |
| <grade10 uat site url> | The store |
| <grade10 uat site url> | Store Locator |
| <grade10 uat site url> | The signing ceremony |
| <grade10 uat site url> | Booking a visit |
| <grade10 uat site url> | The profile |
| <grade10 uat site url> | The membership page |
| <grade10 uat site url> | Grading's counter signing |
| <grade10 uat site url> | A labs demonstration surface |
| <grade10 preview site url> | Grading's counter signing |
| <grade10 public site url> | Grading's counter signing |

**Steps:**

1. Fetch `<withheld address>` on `<lane url>`.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface.

---

## grade10-site-site-carried-surfaces-US6: Collector opens a withheld product's address on the public site

**As a** collector,
**I want** a vault or booking address I typed, bookmarked or followed on the
public site to tell me the site does not hold it,
**so that** I learn the page is not there instead of waiting on one that will
never render.

<!-- trace:case id=g10.site-carried-surfaces.TC-tvu rev=2 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC1-2: Every withheld product address answers not-found with a 404

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
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the five waiting products' surfaces.

**Test data:**

| `<product>` | `<withheld address>` |
| --- | --- |
| Vault | The signing ceremony |
| Vault | The case list, `/vault` |
| Vault | The request, `/vault/new` |
| Vault | A case's page, `/vault/cases/<case id>` |
| Vault | The identity check, `/vault/verify` |
| Vault | Your data, `/profile/data` |
| Booking | Booking a visit |
| Booking | The private link from a booking's mail |
| Booking | A collector's own visits |

**Steps:**

1. Fetch `<withheld address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface, not a `<product>` surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-nse rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC2-1: An address beneath a withheld surface answers the same way

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
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Test data:**

| `<nested withheld address>` |
| --- |
| An address beneath the vault |
| An address beneath a case's page |
| An address beneath booking a visit |
| An address beneath a collector's own visits |

**Steps:**

1. Fetch `<nested withheld address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-tmt rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC3-1: A withheld address sends the collector nowhere else

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Fetch <grade10 vault url> on <grade10 public site url> without following
   redirects.
2. Fetch <grade10 booking url> on the same lane without following redirects.

**Expected Results:**

* Both responses return status 404.
* Neither names an address to follow.

<!-- trace:case id=g10.site-carried-surfaces.TC-g1t rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC4-1: A signed-in collector with records meets the same answer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* customer(signed in, holding an open vault case and a booked visit) is on
  <grade10 public site url>.

**Steps:**

1. Open the collector's vault case address.
2. Open the collector's own visits address on the same lane.

**Expected Results:**

* Both render the not-found surface and answer with status 404.
* Neither names the case or the visit.
* The collector is still signed in.

<!-- trace:case id=g10.site-carried-surfaces.TC-z5h rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC5-1: A withheld address answers not-found under every language prefix

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Fetch <grade10 vault url> and <grade10 booking url> under each <lang>
   prefix the site answers.
2. Open one of those addresses in the browser.

**Expected Results:**

* Every fetch returns status 404.
* Step 2 renders the not-found surface in that language.

<!-- trace:case id=g10.site-carried-surfaces.TC-b1p rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC6-1: A mailed private link is not honoured on the public site

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* <a booking's private link> and <the vault signing url> were minted on a lane
  that carries their products.

**Steps:**

1. Open <a booking's private link> on <grade10 public site url>.
2. Open <the vault signing url> with its token on the same lane.
3. Open <the identity check url> on the same lane.

**Expected Results:**

* All three render the not-found surface and answer with status 404.
* None names the visit, the case or the collector.

<!-- trace:case id=g10.site-carried-surfaces.TC-q6f rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC7-1: No request opens an address the build was made without

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Fetch <grade10 vault url> on <grade10 public site url>.
2. Fetch the same address with a query string asking the site to carry the
   vault.
3. Fetch the same address ten times in a row.

**Expected Results:**

* Every response returns status 404.
* No response renders a vault surface.
* The answer never changes between requests.

<!-- trace:case id=g10.site-carried-surfaces.TC-c07 rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC8-1: An operator on the public site meets the same answer

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* admin(holds vault:operate) is signed in on <grade10 public site url>.

**Steps:**

1. Open <grade10 vault url>.
2. Open <the vault signing url> on the same lane.

**Expected Results:**

* Both render the not-found surface and answer with status 404.
* Neither names a case or a queue.
* No grant the operator holds changes the answer.

<!-- trace:case id=g10.site-carried-surfaces.TC-v42 rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC9-1: A labs address is not held on the public lanes

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries no labs surfaces.

**Steps:**

1. Fetch <a labs demonstration surface url> on <grade10 public site url>.
2. Fetch <the unapproved refund draft url> on the same lane.
3. Fetch <the unapproved shipping draft url> on the same lane.

**Expected Results:**

* All three return status 404.
* None renders a demonstration surface or a draft.

<!-- trace:case id=g10.site-carried-surfaces.TC-l4m rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC10-1: Browser history through a withheld address still renders not-found

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
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* customer is on <grade10 public site url>.

**Steps:**

1. Type <grade10 vault url> into the address bar and open it.
2. Use the browser's back button.
3. Use the browser's forward button.

**Expected Results:**

* Step 1 renders the not-found surface.
* Step 2 renders the front door.
* Step 3 renders the not-found surface again, not a blank page and not a
  loading state that never resolves.

<!-- trace:case id=g10.site-carried-surfaces.TC-f6a rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### grade10-site-site-carried-surfaces-US6-TC11-1: The not-found surface names no withheld product

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
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Open <grade10 vault url> on <grade10 public site url>.
2. Read every word and every link the not-found surface holds.

**Expected Results:**

* Nothing on it names the vault, a case or a visit.
* Every link on it opens a surface the build carries.

---

## grade10-site-site-carried-surfaces-US7: Collector signed in on the public site opens the account menu

**As a** signed-in collector,
**I want** the account menu to name only the pages the site can open for me,
**so that** no item in it takes me to a page the site refuses.

<!-- trace:case id=g10.site-carried-surfaces.TC-lmp rev=1 covers=g10.site-carried-surfaces.SC-zcr -->
### grade10-site-site-carried-surfaces-US7-TC1-1: Account menu names no withheld product page

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* customer(signed in) is on <grade10 public site url>.

**Steps:**

1. Open the account menu in the header.
2. Read every item it holds.

**Expected Results:**

* No item names an order, a vault case or a visit.
* The menu names the profile, the membership page, the auctions item and
  sign-out.

<!-- trace:case id=g10.site-carried-surfaces.TC-0o1 rev=1 covers=g10.site-carried-surfaces.SC-zcr -->
### grade10-site-site-carried-surfaces-US7-TC2-1: Every account menu item opens its own surface

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
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* customer(signed in) is on <grade10 public site url>.

**Steps:**

1. Open the account menu in the header.
2. Open each item it holds in turn.

**Expected Results:**

* Each item renders its own surface, not the not-found surface.
* No item answers with status 404.

<!-- trace:case id=g10.site-carried-surfaces.TC-rzw rev=1 covers=g10.site-carried-surfaces.SC-zcr -->
### grade10-site-site-carried-surfaces-US7-TC3-1: A collector holding withheld records sees no item for them

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
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* The site under test is a build that carries none of the three waiting
  products' surfaces.
* customer(signed in, holding an open vault case and a booked visit) is on
  <grade10 public site url>.

**Steps:**

1. Open the account menu in the header.
2. Read every item and every count it holds.

**Expected Results:**

* No item names a case or a visit.
* No count or badge in the header names one either.

<!-- trace:case id=g10.site-carried-surfaces.TC-2nb rev=2 covers=g10.site-carried-surfaces.SC-zcr -->
### grade10-site-site-carried-surfaces-US7-TC4-2: Account menu names the visits item and no vault case item on a carrying lane

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
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* The site under test is <grade10 staging site url>, a build that carries the vault and booking surfaces.
* customer(signed in, holding an open vault case and a booked visit) is on <grade10 staging site url>.

**Steps:**

1. Open the account menu in the header.
2. Read every item it holds.
3. Open the item for the collector's visits.

**Expected Results:**

* Step 2 names the collector's visits, and no item names a vault case.
* Step 3 renders the collector's own visits, not the not-found surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-xs2 rev=1 covers=g10.site-carried-surfaces.SC-zcr -->
### grade10-site-site-carried-surfaces-US7-TC5-1: Account menu on the preview host names no withheld product

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* customer(signed in) is on <grade10 preview site url>.

**Steps:**

1. Open the account menu in the header.
2. Read every item it holds.

**Expected Results:**

* No item names an order, a vault case or a visit.
* Every item opens a surface the build carries.

---

## grade10-site-site-carried-surfaces-US8: Collector uses a product on the lane it is open on

**As a** collector,
**I want** every vault, booking, profile and membership surface to work
unchanged where its product is open,
**so that** hiding a product on the public site costs nothing to the lanes it
is still used on.

<!-- trace:case id=g10.site-carried-surfaces.TC-n0x rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC1-2: Every withheld product address answers on a carrying lane

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is <grade10 staging site url>, a build that carries all five waiting products' surfaces.
* customer(signed in, holding a vault case waiting for a signature and a booked visit) is on <grade10 staging site url>.

**Test data:**

| `<product>` | `<carried address>` |
| --- | --- |
| Vault | The signing ceremony, with that case's token |
| Booking | Booking a visit |
| Booking | The private link from a booking's mail |
| Booking | A collector's own visits |

**Steps:**

1. Fetch `<carried address>` on <grade10 staging site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 200.
* Step 2 renders that `<product>` surface, not the not-found surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-4e6 rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC3-2: Collector opens the signing ceremony and signs unchanged

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is <grade10 staging site url>, a build that carries the vault surfaces.
* customer(holding one vault case waiting for a signature) is at the shop's iPad on <grade10 staging site url>.

**Steps:**

1. Open <the vault signing url> with that case's token.

**Expected Results:**

* The signing ceremony renders, not the not-found surface.
* It offers the case's documents to sign.

<!-- trace:case id=g10.site-carried-surfaces.TC-jor rev=1 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC4-1: Collector books a visit and opens the private link unchanged

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is <grade10 staging site url>, a build that carries the
  booking surfaces.
* The grading service has at least one free slot.

**Steps:**

1. Open <grade10 booking url>.
2. Book a grading visit with a name and an email.
3. Open <a booking's private link> from the booking's mail.

**Expected Results:**

* Step 2 takes the booking and confirms it.
* Step 3 renders the visit, not the not-found surface.
* The private link offers to move or cancel the visit.

<!-- trace:case id=g10.site-carried-surfaces.TC-81l rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC5-2: Chrome and front door name every carried product on a carrying lane

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is <grade10 staging site url>, a build that carries all five waiting products' surfaces.
* customer(signed in) is on <grade10 staging site url>.

**Steps:**

1. Read the header, the footer and the front door.
2. Open booking a visit from the header's navigation item.

**Expected Results:**

* The header names the store and booking a visit, carries a cart control, and holds no vault item.
* The footer carries a shop column, and the front door carries a button and a card for the store, and none for booking or the vault.
* Nothing in the header, the footer or the front door opens a vault address.
* Step 2 renders booking a visit.

<!-- trace:case id=g10.site-carried-surfaces.TC-o4j rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC6-2: Opening one product leaves the other two shut

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is a build that carries none of the five waiting products' surfaces.
* A vault case waiting for a signature holds a live signing token for that lane.

**Steps:**

1. Add that build's lane to the stated list of lanes that carry the vault.
2. Rebuild and deploy the site to that lane with no other edit.
3. Open <the vault signing url> with that case's token on that lane.
4. Fetch <grade10 store url>, <grade10 booking url>, <grade10 profile url> and <grade10 membership url> on the same lane.

**Expected Results:**

* Step 3 renders the signing ceremony.
* Step 4 returns status 404 for all four.
* No surface outside the vault's set changed.

<!-- trace:case id=g10.site-carried-surfaces.TC-2wv rev=1 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC7-1: Development and staging both carry the labs

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is <grade10 development site url> and <grade10 staging
  site url>, builds that carry the labs surfaces.

**Steps:**

1. Open <a labs demonstration surface url> on <grade10 development site url>.
2. Open <the unapproved refund draft url> on the same lane.
3. Open the same two addresses on <grade10 staging site url>.

**Expected Results:**

* Steps 1 and 2 render the demonstration surface and the draft.
* Step 3 renders the same two, not the not-found surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-5a1 rev=1 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### grade10-site-site-carried-surfaces-US8-TC9-1: On a lane that carries the vault, only the signing ceremony answers

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The sites under test are <grade10 staging site url> and <grade10 development site url>, builds that carry the vault's set.
* customer(signed in, holding a vault case waiting for a signature) is on the lane under test.

**Test data:**

| `<vault address>` | Status | Renders |
| --- | --- | --- |
| The signing ceremony, `/vault/sign` with that case's token | 200 | The signing ceremony |
| The case list, `/vault` | 404 | The not-found surface |
| The request, `/vault/new` | 404 | The not-found surface |
| The collector's case page, `/vault/cases/<case id>` | 404 | The not-found surface |
| The identity check, `/vault/verify` | 404 | The not-found surface |
| Your data, `/profile/data` | 404 | The not-found surface |

**Steps:**

1. Fetch `<vault address>` on the lane under test.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns the row's status.
* Step 2 renders what the row names.

<!-- trace:case id=g10.site-carried-surfaces.TC-62m rev=1 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5,g10.site-carried-surfaces.SC-bpn -->
### grade10-site-site-carried-surfaces-US8-TC10-1: Staging-2 carries every waiting product, as staging does

Runs once per row of **Test data**.

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
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* The site under test is <grade10 staging-2 site url>, a build that carries
  every waiting product, the front door and the labs.
* customer(signed in, holding a vault case and a grading submission waiting
  for a signature, and a booked visit) is on <grade10 staging-2 site url>.

**Test data:**

| `<carried address>` |
| --- |
| The home address, answered by the front door |
| The store |
| Store Locator |
| The signing ceremony, with that case's token |
| Booking a visit |
| The profile |
| The membership page |
| The join page |
| Grading's counter signing, with that submission's token |
| A labs demonstration surface |

**Steps:**

1. Fetch `<carried address>` on <grade10 staging-2 site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 200.
* Step 2 renders that surface, not the not-found surface and not the auction.

---

## Settled

* The rule that nothing names an absent surface reaches everything a build
  renders — a page's own head and a link in a carried surface's body as much
  as the chrome, the front door and the crawler files.
* The two addresses the shop hands out for a product and a collection are this
  site's to answer, so a build that does not carry the store refuses them.
* A lane that carries no store takes no order, so no mail sent from it names a
  store address.
* What a build holds for an uncarried surface is its address and its page, and
  those alone. The code behind it may still ride in the bundle: the storefront
  publishes the shop's features and the account's as one list, and the
  account's serve surfaces every lane carries. Asked and settled — do not
  raise it again as a gap in the requirement.
* The front door's card row renders empty rather than being removed from the
  page when none of the three waiting products is carried; the header's
  navigation, the footer and the account menu always keep a non-product item
  and never reach that case.
* Booking's set, including the private link from its mail, waits whole; a
  booking already taken on a public lane is a follow-on change's problem, not
  this one's.
* The account menu's per-item gate is a site-level outcome this capability
  states; no `@grade10/ui` contract is held to it.
* The vault's vanity domain keeps redirecting to the vault's address while the
  vault is withheld, landing on the not-found surface like any other route
  into it.
* The auction is not gated by this capability: it carries on every lane, and
  no store, vault or booking surface depends on it or on each other.
* The labs are carried on development and staging, not on preview or
  production — widened from development alone (Q27).
* A return address a sign-in flow lands a collector on is refused the same way
  any other route into an uncarried surface is — the refusal does not depend
  on how the address was reached.
* Whether `/membership` and `/join` are ever named in a sitemap, robots.txt,
  the header, the footer or the front door is answered no, independent of any
  gate: both are `session`-kind surfaces, which are never part of
  `PUBLIC_SURFACES` to begin with. The same holds for the profile and every
  other session-kind surface this capability withholds.
* Whether a withheld product's own inner content (a member's balance, a vault
  case's detail) is this capability's to test is answered no: carried
  surfaces owns only whether an address exists and answers, never what a
  product shows once carried — that is each product's own capability.
- **The front door on a lane carrying the vault** - no vault button or card on any lane; the ceremony is reached by the link staff hand over (Q20)

## Reconciliation

**Run:** blind feature pass, 2026-09-17, written before the requirements.
Read: this capability's `## Purpose` and `## Feature set`, its
`user-journeys.md`, the change's `decisions.md` with its `## Raised` table,
`docs/prds/products/grade10-site/site/carried-surfaces.md`,
`docs/prds/products/grade10-site/store/index.md`, and `openspec/config.yaml`'s
`context`. Denied: every `## Requirements` section, `openspec/specs/` beyond
the two sections above, `openspec/changes/archive/`, and this change's
`proposal.md`, which the caller held back — no case is typed `acceptance` in
consequence. The capability has no `ui-design.md` and no earlier suite.

**Blind through authoring; the requirements were exposed afterwards.** Every
case was written and on disk before the scenario pass's `## ADDED Requirements`
reached the writing agent, which the harness pasted in unasked while the two
passes ran together; the only edits after that were two rewraps of lines the
pass had already written. The independence this run bought is real for the
cases themselves and unverifiable for anything after the write, so the run is
recorded as leaked rather than clean, and the next pass on this capability
starts from `## Settled` rather than from this file's claim.

* **Folded in** — a collector holding a session meets the same refusal and
  keeps the session (`US2-TC4-1`). No scenario stated it; the requirements now
  carry it.
* **Folded in** — a store address under a language prefix is refused in that
  language (`US2-TC5-1`). No scenario stated it; the requirements now carry
  it.
* **Raised, answered** — whether a served page's canonical link and `og:url`
  tag are held to "nothing names an absent surface", which the feature set
  states as the header, the footer, the front door and the crawler files.
  Answered as Q9 in `decisions.md`: the rule reaches everything the build
  renders, so the list is where the rule is met and not its limit. No case
  asserts either tag, because neither is written for a surface no build holds.
* **Raised, answered** — whether a link in a carried surface's own body, such
  as an auction or a membership page pointing at the shop, is held to the same
  rule as the chrome. Answered as Q9: it is. `US1-TC4-1` sweeps every rendered
  link and stands as written.
* **Raised, answered** — which host issues the two addresses the shop hands
  out for a product and a collection, and so whether a public build answers
  them at all. Answered as Q10 in `decisions.md`: this site answers them, and
  they are in the store set, so a public build refuses them. `US2-TC1-1` and
  `US4-TC1-1` stand as written.
* **Raised, answered** — what happens to a store address already sent to a
  collector in mail, such as an order confirmation's link to order detail.
  Answered as Q11 in `decisions.md`: a lane that carries no store takes no
  order, so no mail from it names a store address. No case covers it, and
  none is owed.
* **Withdrawn after the readings** — `US2-TC6-1`, which asserted that no
  script a public build serves holds a store surface's page code. The
  requirement it read was narrowed to the address and the page once the
  implementation showed the storefront publishes the shop's features and the
  account's in one list, and the account's serve surfaces every lane carries.
  Its id is retired rather than reused. Landed as Q12 in `decisions.md`.
* **Uncovered anchors** — none. All four journeys carry cases, and every
  `## Feature set` root group is reached: "What a build carries" by
  `US2-TC7-1`, `US2-TC8-1` and `US4-TC1-1`, "An address nothing carries" by
  `US2`, "Nothing names an absent surface" by `US1` and `US3`, and "Where the
  shop is open" by `US4`.

**Run:** blind feature pass, 2026-09-17, on the four new journeys
(`US-05` to `US-08`) this change adds, written when the auction was still
proposed as one of the gated products. Read: the isolated bundle the caller
assembled — `## Purpose` and `## Feature set` from the change's `spec.md`
outline, `user-journeys.md` for both the new and the existing journeys,
`proposal.md`, `decisions.md` with its `## Raised` table, the durable
`feature-tcs.md` with `## Reconciliation` stripped, and the linked PRD pages
for the site, the store, the auction, the vault and appointments. Denied:
every `## Requirements` section, `openspec/specs/` beyond the outline, and
`openspec/changes/archive/`. The change has no `ui-design.md`.

Written independently of the scenario pass on this same run: neither reader
saw the other's file, and both were dispatched from the same anchors at once.

**Landed after the run: Q26 removed the auction from the gate entirely** — it
carries on every lane and is not one of the waiting products. Every finding
below is restated against the three-product scope (the store, the vault and
booking); where a finding turned on the auction specifically, its resolution
is noted.

* **Folded in** — the store's own withheld-address refusal already covers a
  session, a language prefix and a redirect; this pass's `US6-TC4-1`,
  `US6-TC5-1` and `US6-TC3-1` extend the existing coverage to the vault and
  booking rather than restating it, and no new rule was found.
* **Raised, answered** — a chrome region that would hold several products'
  items can end up holding none. Landed as Q21 in `decisions.md`: only the
  front door's card row can genuinely reach zero, since the header's
  navigation, the footer and the account menu always keep a non-product item.
  The row renders empty rather than being removed. `US5-TC3-1` gains a line
  asserting the row itself still renders; `US5-TC1-1` and `US5-TC2-1` already
  read as "no item names …" rather than "the header is absent", so they stand
  as written.
* **Raised, answered** — whether a booking already taken on a public lane
  before this change ships needs its own wind-down, the way Q16 settled for
  the vault. Landed as Q20 in `decisions.md`: a follow-on change covers
  whoever already holds a booking; this change ships as written, and
  booking's set — including its own private link — waits whole like the
  vault's.
* **Raised, answered** — whether the account menu's per-item gate belongs to
  this capability or to `shared/ui/site-chrome`, which specifies the account
  control and not the items inside its menu. This was originally raised about
  the auctions item; Q26 removed that item from the gate entirely, and the
  same question stands for the vault case and visit items the menu still
  gates. Landed as Q22 in `decisions.md`: the site-level outcome alone, no
  component named. `US7-TC1-1` and `US7-TC2-1` stand as written.
* **Raised, answered** — whether the vault's vanity domain, which redirects to
  the vault's own address, should stop redirecting while the vault is
  withheld. Landed as Q23 in `decisions.md`: it keeps redirecting, and lands
  on the not-found surface like any other route into a withheld product. No
  case covers the vanity domain itself; it is a redirect this capability does
  not carry.
* **Raised, rejected** — whether a carried product's own surface can depend on
  a withheld one. Originally framed around the auction's winner order and the
  store's checkout; with the auction out of scope, the live question is
  whether the store, the vault or booking depend on each other. Landed as Q24
  in `decisions.md`: no Feature set names such a dependency for any pair.
* **Raised, answered** — a return address a sign-in flow lands a collector on
  after they authenticate could name a withheld surface. Landed as Q25 in
  `decisions.md`: no new rule, since sign-in is carried on every lane and once
  it returns the collector to that address, the address is refused by "An
  address of an uncarried surface is not found" like any other route into it
  — the requirement is already worded to not depend on how the address was
  reached.
* **Raised, out of scope** — an operator console link into a product's public
  page on a lane that does not carry it. Out of this capability's Non-Goals,
  which already exclude the operator console; no case or requirement covers
  it.
* **Uncovered anchors** — none. Both new `## Feature set` root groups this
  change adds are reached: "What a build carries" by `US5-TC7-1`, `US6-TC7-1`,
  `US6-TC9-1`, `US8-TC1-1` and `US8-TC6-1`; "Where a product is open" by
  `US8-TC5-1`. Every one of `US-05` to `US-08` carries cases.
* **Dropped after Q26** — `US8-TC2-1` originally proved the auction's own
  surfaces (a lot, the watchlist, a bid) unchanged where carried. The auction
  is no longer gated by this capability at all, so nothing here needs to
  prove it unchanged; its journey `US-08` now covers only the vault and
  booking, and its id is retired rather than reused. `US7-TC4-1` originally
  proved the account menu's auctions item reappears on a carrying lane;
  rewritten in place to prove the same for the case and visit items, the two
  that remain gated.
* **Existing cases this change moves** — flagged for whoever archives this
  change to apply to the durable `feature-tcs.md` alongside the spec fold,
  since the durable suite still describes today's shop-only behaviour and
  editing it now would describe a rule not yet true:
  - `US1-TC1-1` and `US1-TC5-1` are superseded by `US5-TC1-1` and
    `US5-TC7-1`, which read the same chrome for the three waiting products
    rather than the store alone; deprecate them at fold.
  - `US4-TC3-1` and `US4-TC4-1` are superseded by `US8-TC4-1` and
    `US8-TC5-1` for the same reason on a carrying lane; deprecate them at
    fold.
  - `US2-TC7-1`, `US3-TC1-1` and `US3-TC4-1` are the only cases verifying the
    preview host's refusal and the sitemap's negative and positive crawl
    directory; none of `US5` to `US8` restates their claim for the vault and
    booking, since neither this change's journeys nor its requirements
    reissue a crawler or preview journey of their own. Rewrite them in place
    (`<v>` 2) at fold rather than deprecating: broaden `US2-TC7-1`'s test data
    to the store, the vault and booking, and `US3-TC1-1` and `US3-TC4-1` to
    name the vault and booking beside the store. None needs the auction,
    which the crawler already lists unconditionally.
  - `US2-TC8-1` asserts a labs address is not held on staging, which Q27
    reverses: rewrite in place (`<v>` 2) to fetch on preview and production
    instead, the two lanes that still refuse the labs; `US8-TC7-1` in this
    change's own suite proves the positive case on development and staging.

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `apps/frontend/grade10/src/surfaces.ts` and `MarketingPage.tsx`. It is a statement, not proof.

- **Raised, folded into spec** - the collector's vault screens not found on every lane, from `US6-TC14-1` and `grade10-site-site-carried-surfaces-US8-TC9-1`, as `grade10-site-site-carried-surfaces-SC-40`; tasks 3.1, 3.2 and the tech design now cite `grade10-site-site-carried-surfaces-SC-22`, `-SC-26` and `-SC-40` in place of the store's and booking's scenarios
- **Raised, escalated** - the front door's vault card, landed as Q20
- **Raised, rejected** - none
- **Carried into a bump** - `US6-TC14-1`, the collector's vault screens on the public lanes, leaves the delta: its five addresses are rows of `grade10-site-site-carried-surfaces-US6-TC1-2`, and `grade10-site-site-carried-surfaces-US8-TC9-1` holds them on the lanes that carry the vault
- **New ids kept** - `grade10-site-site-carried-surfaces-US5-TC11-1`, no link to a collector vault screen on a carrying lane; `grade10-site-site-carried-surfaces-US8-TC9-1`, the ceremony alone answering there
- **Joined** - `grade10-site-site-carried-surfaces-SC-28` and `-SC-40` into `grade10-site-site-carried-surfaces-US6-TC1-2`; `grade10-site-site-carried-surfaces-SC-25` into `grade10-site-site-carried-surfaces-US8-TC3-2`
- **Corrected** - `grade10-site-site-carried-surfaces-US8-TC5-2` finds a button and card for the store alone on the front door; `grade10-site-site-carried-surfaces-US8-TC6-2` fetches the store, booking, the profile and membership, the four sets `grade10-site-site-carried-surfaces-SC-27` keeps shut, and no vault address; both count five waiting products
- **Added by QA2** - none
- **Contradicted** - none
- **Uncovered anchors** - none

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite and the durable one it extends, the delta `spec.md` with its scenarios, `tech-design.md`, `decisions.md`, `tasks.md` and the Carried Surfaces and Store Locator pages. The blind pass recorded no Run line of its own and raised nothing on this capability. Later QA2 runs rechecked every disposition after the accept review's edits. The last, 2026-10-07, followed the accept review's finding that the added requirement stated the store's set beside an unchanged table without it: the delta now republishes "Each waiting product waits for its own launch" with Store Locator's row and the lanes the Carried Surfaces page and the build have, and the front door scenarios of "Nothing in a build names a surface it does not carry" and the count in "Where a product is carried it behaves as it is specified to". That run moved the anchors - the What a build carries leaves - and was not repeated in isolated QA1 and Dev contexts: the cases below were drafted from those leaves and the page before the new scenarios, by the same session that then wrote the scenarios.

- **Folded** - `grade10-site-site-carried-surfaces-SC-41`, Store Locator waiting with the store, across the cases this change extends: not found on a build without the store (`grade10-site-site-carried-surfaces-US2-TC1-2`, `grade10-site-site-carried-surfaces-US2-TC2-2`), named in neither the header (`grade10-site-site-carried-surfaces-US5-TC1-2`) nor the footer (`grade10-site-site-carried-surfaces-US1-TC2-2`) and absent from the sitemap (`grade10-site-site-carried-surfaces-US3-TC1-3`); answered and listed on a build with it (`grade10-site-site-carried-surfaces-US4-TC1-2`, `grade10-site-site-carried-surfaces-US3-TC4-3`). Its header and footer on a carrying build are the Store Locator suite's `grade10-site-store-store-locator-US1-TC4-1` and `grade10-site-store-store-locator-US1-TC5-1`
- **Folded** - the lanes: the home address sending a collector on to the auction where the front door is withheld (`grade10-site-site-carried-surfaces-SC-42`) is `grade10-site-site-carried-surfaces-US5-TC12-1`; uat withholding what production withholds and staging-2 carrying what staging carries (`grade10-site-site-carried-surfaces-SC-43`) are `grade10-site-site-carried-surfaces-US5-TC13-1` and `grade10-site-site-carried-surfaces-US8-TC10-1`; grading waiting on those lanes (`grade10-site-site-carried-surfaces-SC-44`) is a row of each
- **Contradicted, then corrected** - five durable cases read the front door on a public build, which now sends the collector on to the auction. `grade10-site-site-carried-surfaces-US1-TC3-2` and `grade10-site-site-carried-surfaces-US5-TC3-2` read the front door on a build made for the test with the front door carried and the products withheld, as `grade10-site-site-carried-surfaces-SC-13` and `grade10-site-site-carried-surfaces-SC-33` now state; `grade10-site-site-carried-surfaces-US2-TC7-3`, `grade10-site-site-carried-surfaces-US5-TC8-2` and `grade10-site-site-carried-surfaces-US5-TC9-2` read the header and the footer only. `grade10-site-site-carried-surfaces-US5-TC7-2` drops membership and join, which the public lanes withhold
- **Revisions moved** - each case whose verified behaviour changed takes the next revision and stays draft: `US1-TC2`, `US1-TC3`, `US2-TC1`, `US2-TC2`, `US4-TC1`, `US5-TC1`, `US5-TC3`, `US5-TC7`, `US5-TC8` and `US5-TC9` to 2, `US2-TC7`, `US3-TC1` and `US3-TC4` to 3. Their trace markers move with them at the fold
- **Trace by journey** - each case's `covers` names the scenarios serving its journey: the `US1` and `US3` cases add `grade10-site-site-carried-surfaces-SC-41`, the `US5` cases add `grade10-site-site-carried-surfaces-SC-42` to `grade10-site-site-carried-surfaces-SC-44`, and `grade10-site-site-carried-surfaces-US8-TC10-1` adds `grade10-site-site-carried-surfaces-SC-43`. `grade10-site-site-carried-surfaces-US2-TC1-2`, `grade10-site-site-carried-surfaces-US2-TC2-2`, `grade10-site-site-carried-surfaces-US4-TC1-2` and `grade10-site-site-carried-surfaces-US5-TC1-2` verify parts of `grade10-site-site-carried-surfaces-SC-41` from journeys it does not serve, and the fold names them here only. The durable cases this change does not carry keep their markers; no gate compares a durable case's `covers` with its journeys
- **Uncovered anchors** - none: every What a build carries leaf this change widens or adds is reached by the cases above
