# grade10-site/site/carried-surfaces Test Cases

**Status:** in-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

## grade10-site-site-carried-surfaces-US1: Collector reads a site whose shop has not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a shop it cannot
serve me from,
**so that** I am never shown a price, a basket or a pay button for a shop
nobody is ready to sell me from.

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

### grade10-site-site-carried-surfaces-US1-TC2-1: Footer carries no shop column and no store link

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

### grade10-site-site-carried-surfaces-US1-TC3-1: Front door offers no store button and no store card

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
* **Trace:** grade10-site-site-carried-surfaces-US-01

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Read every button and every card the front door holds.

**Expected Results:**

* The front door carries no store button.
* The front door carries no store card.
* Nothing on it opens a store address.

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

### grade10-site-site-carried-surfaces-US2-TC1-1: Every store address answers not-found with a 404

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

**Steps:**

1. Fetch `<store address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface, not a store surface.

### grade10-site-site-carried-surfaces-US2-TC2-1: An address beneath a store surface answers the same way

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

**Steps:**

1. Fetch `<nested store address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface.

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

### grade10-site-site-carried-surfaces-US2-TC7-2: The preview host answers as the public site does

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
* Step 2's header, footer and front door name no store, vault or booking
  surface.

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

### grade10-site-site-carried-surfaces-US3-TC1-2: Sitemap names no store, vault or booking address

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
  checkout, an order page, the vault, a case's page or booking a visit.
* Every entry names a surface the build carries.

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

### grade10-site-site-carried-surfaces-US3-TC4-2: Crawler files name the store, the vault and booking where the build carries them

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

* The sitemap names the store and the collections under it, and booking a
  visit.
* Every address it names for the three returns status 200.

---

## grade10-site-site-carried-surfaces-US4: Collector buys on the lane the shop is open on

**As a** collector,
**I want** every store surface to work unchanged where the shop is open,
**so that** hiding the shop on the public site costs nothing to the lanes it
is still sold on.

### grade10-site-site-carried-surfaces-US4-TC1-1: Every store address answers on a lane that carries the store

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

**Steps:**

1. Fetch `<store address>` on <grade10 staging site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 200.
* Step 2 renders that store surface, not the not-found surface.

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

## grade10-site-site-carried-surfaces-US5: Collector reads a site whose products have not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a product it cannot
serve me from,
**so that** I am never shown a case to open or a visit to book that nobody is
ready to honour.

### grade10-site-site-carried-surfaces-US5-TC1-1: Header names no withheld product and carries no cart control

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
* The header carries no cart control.

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

### grade10-site-site-carried-surfaces-US5-TC3-1: Front door offers no button and no card for any withheld product

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

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Read every button and every card the front door holds.

**Expected Results:**

* No button and no card names the store, the vault or booking a visit.
* The card row itself still renders, holding no card.
* The front door's headline still renders.
* Nothing on the front door opens a withheld address.

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

### grade10-site-site-carried-surfaces-US5-TC7-1: Surfaces carried on every lane are still named and still open

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

* The chrome names the auction, membership, join, sign-in, the terms and the
  privacy page.
* Each opens its own surface, not the not-found surface.

### grade10-site-site-carried-surfaces-US5-TC8-1: Preview host names no withheld product either

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
2. Read the header, the footer and the front door.

**Expected Results:**

* None of the three names the store, the vault or booking a visit.
* The header carries no cart control, and the front door's headline still
  renders.

### grade10-site-site-carried-surfaces-US5-TC9-1: Chrome names no withheld product under any language prefix

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
2. Read the header, the footer and the front door under each prefix.

**Expected Results:**

* No item, link, button or card under any <lang> names a store, vault or
  booking surface.
* Every chrome item under each <lang> opens a surface the build carries.

---

## grade10-site-site-carried-surfaces-US6: Collector opens a withheld product's address on the public site

**As a** collector,
**I want** a vault or booking address I typed, bookmarked or followed on the
public site to tell me the site does not hold it,
**so that** I learn the page is not there instead of waiting on one that will
never render.

### grade10-site-site-carried-surfaces-US6-TC1-1: Every withheld product address answers not-found with a 404

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

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Test data:**

| `<product>` | `<withheld address>` |
| --- | --- |
| Vault | The vault |
| Vault | A case's own page |
| Vault | The signing ceremony |
| Vault | The identity check |
| Booking | Booking a visit |
| Booking | The private link from a booking's mail |
| Booking | A collector's own visits |

**Steps:**

1. Fetch `<withheld address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface, not a `<product>` surface.

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

### grade10-site-site-carried-surfaces-US7-TC4-1: Account menu names the case and visit items on a carrying lane

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

* The site under test is <grade10 staging site url>, a build that carries the
  vault and booking surfaces.
* customer(signed in, holding an open vault case and a booked visit) is on
  <grade10 staging site url>.

**Steps:**

1. Open the account menu in the header.
2. Open the item for the collector's vault case.
3. Open the item for the collector's visits.

**Expected Results:**

* The menu names both items.
* Steps 2 and 3 each render their own surface, not the not-found surface.

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
**I want** every vault and booking surface to work unchanged where its
product is open,
**so that** hiding a product on the public site costs nothing to the lanes it
is still used on.

### grade10-site-site-carried-surfaces-US8-TC1-1: Every withheld product address answers on a carrying lane

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

* The site under test is <grade10 staging site url>, a build that carries all
  three waiting products' surfaces.
* customer(signed in, holding an open vault case and a booked visit) is on
  <grade10 staging site url>.

**Test data:**

| `<product>` | `<carried address>` |
| --- | --- |
| Vault | The vault |
| Vault | A case's own page |
| Vault | The signing ceremony |
| Vault | The identity check |
| Booking | Booking a visit |
| Booking | The private link from a booking's mail |
| Booking | A collector's own visits |

**Steps:**

1. Fetch `<carried address>` on <grade10 staging site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 200.
* Step 2 renders that `<product>` surface, not the not-found surface.

### grade10-site-site-carried-surfaces-US8-TC3-1: Collector opens a vault case and signs unchanged

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
  vault surfaces.
* customer(signed in, holding one vault case waiting for a signature) is on
  <grade10 staging site url>.

**Steps:**

1. Open <grade10 vault url>.
2. Open the case from the list.
3. Open <the vault signing url> with that case's token.

**Expected Results:**

* Each surface renders, and none is the not-found surface.
* The case page names the case.
* The signing ceremony offers the documents to sign.

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

### grade10-site-site-carried-surfaces-US8-TC5-1: Chrome and front door name every product on a carrying lane

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

* The site under test is <grade10 staging site url>, a build that carries all
  three waiting products' surfaces.
* customer(signed in) is on <grade10 staging site url>.

**Steps:**

1. Read the header, the footer and the front door.
2. Open the account menu in the header.
3. Open the vault from the header's navigation item.

**Expected Results:**

* The header names the store, the vault and booking a visit, and carries a
  cart control.
* The footer carries a shop column, and the front door carries a button and a
  card for each of the three.
* Step 3 renders the vault.

### grade10-site-site-carried-surfaces-US8-TC6-1: Opening one product leaves the other two shut

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

* The site under test is a build that carries none of the three waiting
  products' surfaces.

**Steps:**

1. Add that build's lane to the stated list of lanes that carry the vault.
2. Rebuild and deploy the site to that lane with no other edit.
3. Open <grade10 vault url> on that lane.
4. Fetch <grade10 store url> and <grade10 booking url> on the same lane.

**Expected Results:**

* Step 3 renders the vault, and the header, the footer and the front door
  name it.
* Step 4 returns status 404 for both.
* No surface outside the vault's set changed.

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

---

---

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
