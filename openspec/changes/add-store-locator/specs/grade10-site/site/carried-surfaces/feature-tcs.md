# grade10-site/site/carried-surfaces Test Cases

**Status:** pending-review · 0/16
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

## grade10-site-site-carried-surfaces-US8: Collector uses a product on the lane it is open on

**As a** collector,
**I want** every vault, booking, profile and membership surface to work
unchanged where its product is open,
**so that** hiding a product on the public site costs nothing to the lanes it
is still used on.

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

## Reconciliation

**Run:** QA2 reconciliation, 2026-10-06, in a fresh context. Read: this suite and the durable one it extends, the delta `spec.md` with its scenarios, `tech-design.md`, `decisions.md`, `tasks.md` and the Carried Surfaces and Store Locator pages. The blind pass recorded no Run line of its own and raised nothing on this capability. Later QA2 runs rechecked every disposition after the accept review's edits. The last, 2026-10-07, followed the accept review's finding that the added requirement stated the store's set beside an unchanged table without it: the delta now republishes "Each waiting product waits for its own launch" with Store Locator's row and the lanes the Carried Surfaces page and the build have, and the front door scenarios of "Nothing in a build names a surface it does not carry" and the count in "Where a product is carried it behaves as it is specified to". That run moved the anchors - the What a build carries leaves - and was not repeated in isolated QA1 and Dev contexts: the cases below were drafted from those leaves and the page before the new scenarios, by the same session that then wrote the scenarios.

- **Folded** - `grade10-site-site-carried-surfaces-SC-41`, Store Locator waiting with the store, across the cases this change extends: not found on a build without the store (`grade10-site-site-carried-surfaces-US2-TC1-2`, `grade10-site-site-carried-surfaces-US2-TC2-2`), named in neither the header (`grade10-site-site-carried-surfaces-US5-TC1-2`) nor the footer (`grade10-site-site-carried-surfaces-US1-TC2-2`) and absent from the sitemap (`grade10-site-site-carried-surfaces-US3-TC1-3`); answered and listed on a build with it (`grade10-site-site-carried-surfaces-US4-TC1-2`, `grade10-site-site-carried-surfaces-US3-TC4-3`). Its header and footer on a carrying build are the Store Locator suite's `grade10-site-store-store-locator-US1-TC4-1` and `grade10-site-store-store-locator-US1-TC5-1`
- **Folded** - the lanes: the home address sending a collector on to the auction where the front door is withheld (`grade10-site-site-carried-surfaces-SC-42`) is `grade10-site-site-carried-surfaces-US5-TC12-1`; uat withholding what production withholds and staging-2 carrying what staging carries (`grade10-site-site-carried-surfaces-SC-43`) are `grade10-site-site-carried-surfaces-US5-TC13-1` and `grade10-site-site-carried-surfaces-US8-TC10-1`; grading waiting on those lanes (`grade10-site-site-carried-surfaces-SC-44`) is a row of each
- **Contradicted, then corrected** - five durable cases read the front door on a public build, which now sends the collector on to the auction. `grade10-site-site-carried-surfaces-US1-TC3-2` and `grade10-site-site-carried-surfaces-US5-TC3-2` read the front door on a build made for the test with the front door carried and the products withheld, as `grade10-site-site-carried-surfaces-SC-13` and `grade10-site-site-carried-surfaces-SC-33` now state; `grade10-site-site-carried-surfaces-US2-TC7-3`, `grade10-site-site-carried-surfaces-US5-TC8-2` and `grade10-site-site-carried-surfaces-US5-TC9-2` read the header and the footer only. `grade10-site-site-carried-surfaces-US5-TC7-2` drops membership and join, which the public lanes withhold
- **Revisions moved** - each case whose verified behaviour changed takes the next revision and stays draft: `US1-TC2`, `US1-TC3`, `US2-TC1`, `US2-TC2`, `US4-TC1`, `US5-TC1`, `US5-TC3`, `US5-TC7`, `US5-TC8` and `US5-TC9` to 2, `US2-TC7`, `US3-TC1` and `US3-TC4` to 3. Their trace markers move with them at the fold
- **Trace by journey** - each case's `covers` names the scenarios serving its journey: the `US1` and `US3` cases add `grade10-site-site-carried-surfaces-SC-41`, the `US5` cases add `grade10-site-site-carried-surfaces-SC-42` to `grade10-site-site-carried-surfaces-SC-44`, and `grade10-site-site-carried-surfaces-US8-TC10-1` adds `grade10-site-site-carried-surfaces-SC-43`. `grade10-site-site-carried-surfaces-US2-TC1-2`, `grade10-site-site-carried-surfaces-US2-TC2-2`, `grade10-site-site-carried-surfaces-US4-TC1-2` and `grade10-site-site-carried-surfaces-US5-TC1-2` verify parts of `grade10-site-site-carried-surfaces-SC-41` from journeys it does not serve, and the fold names them here only. The durable cases this change does not carry keep their markers; no gate compares a durable case's `covers` with its journeys
- **Uncovered anchors** - none: every What a build carries leaf this change widens or adds is reached by the cases above
