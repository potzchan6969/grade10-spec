# grade10-site/site/carried-surfaces Test Cases

**Status:** pending-review · 0/18
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (seo):** grade10-site-site-carried-surfaces-SC-14, grade10-site-site-carried-surfaces-SC-15, grade10-site-site-carried-surfaces-SC-32 - what a public build's sitemap and robots.txt name

## Background

* Each lane is a build carrying its own set of surfaces: production, `<public>`, preview and UAT carry the auction, sign-in, the terms and the privacy page and withhold the waiting products (the store with Store Locator, the vault's signing ceremony, booking a visit, the profile, membership and join, grading's counter signing) and the labs; staging and staging-2 carry them all, and development carries the labs.
* A withheld address answers status 404 with the site's not-found surface. Fetching an address reads its status without following a redirect.

## g10.site-carried-surfaces.US1: Collector reads a site whose shop has not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a shop it cannot
serve me from,
**so that** I am never shown a price, a basket or a pay button for a shop
nobody is ready to sell me from.

<!-- trace:case id=g10.site-carried-surfaces.TC-kv7 rev=2 covers=g10.site-carried-surfaces.SC-n1s,g10.site-carried-surfaces.SC-2fu,g10.site-carried-surfaces.SC-4cr,g10.site-carried-surfaces.SC-wjy -->
### g10.site-carried-surfaces.US1-TC2: A build carrying no store names no shop anywhere it renders

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-01

**Pre-conditions:**

* A build carries no store surface; one is made for the test carrying the front door without the store's set.

**Steps:**

1. On `<public>`, read the footer's columns and links, and collect every rendered link on each surface the build carries.
2. Fetch `<public>` with scripts off, and read its links and controls.
3. On the made build, read the front door's buttons and cards.

**Expected Results:**

* No shop column, no store link, no Store Locator link in the Help column; every link opens a surface the build carries.
* Step 2 holds no store link, no cart control and no store button.
* Step 3 holds no store button or card, nothing opening a store address.

---

## g10.site-carried-surfaces.US2: Collector opens a store address the public site does not hold

**As a** collector,
**I want** a store address I typed, bookmarked or followed on the public site
to tell me the site does not hold it,
**so that** I learn the page is not there instead of waiting on one that will
never render.

<!-- trace:case id=g10.site-carried-surfaces.TC-ynq rev=2 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w -->
### g10.site-carried-surfaces.US2-TC1: A store address on a public lane answers 404 and the not-found page, sending nowhere else

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* A `<collector>` on `<lane>` holds `<address>`.

**Test data:**

| `<lane>` | `<collector>` | `<address>` |
| --- | --- | --- |
| `<public>` | signed-out collector | the store, a collection, a card's page, the cart, the checkout, order history, an order's detail, Store Locator |
| `<public>` | signed-out collector | the addresses the shop hands out for a product and a collection |
| `<public>` | signed-out collector | an address beneath the store, a collection, a card's page, the cart, the checkout, order history or Store Locator |
| `<public>` | signed-out collector | the store under each language prefix the site answers |
| `<public>` | signed-in collector | the store and the checkout |
| preview | signed-out collector | the store, the vault and booking a visit |

**Steps:**

1. Fetch each `<address>`, then open it in the browser.

**Expected Results:**

* Each fetch answers 404 naming no address to follow; each page renders the not-found surface, in the prefix's language, the collector still signed in where they were.

<!-- trace:case id=g10.site-carried-surfaces.TC-heo rev=2 covers=g10.site-carried-surfaces.SC-um4,g10.site-carried-surfaces.SC-knk,g10.site-carried-surfaces.SC-8th,g10.site-carried-surfaces.SC-q1o,g10.site-carried-surfaces.SC-g3w,g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### g10.site-carried-surfaces.US2-TC8: The labs answer on development and staging, and nowhere the public reaches

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What a build carries

**Pre-conditions:**

* A labs demonstration surface, and the unapproved refund and shipping drafts, are built.

**Test data:**

| `<lane>` |
| --- |
| preview |
| `<public>` |

**Steps:**

1. Fetch and open each on `<lane>`.

**Expected Results:**

* Each answers 404, rendering no demonstration surface or draft.

---

## g10.site-carried-surfaces.US4: Collector buys on the lane the shop is open on

**As a** collector,
**I want** every store surface to work unchanged where the shop is open,
**so that** hiding the shop on the public site costs nothing to the lanes it
is still sold on.

<!-- trace:case id=g10.site-carried-surfaces.TC-weg rev=2 covers=g10.site-carried-surfaces.SC-hz5 -->
### g10.site-carried-surfaces.US4-TC1: Every store surface works unchanged where the shop is open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-04

**Pre-conditions:**

* A collector with a placed order is signed in on staging.

**Steps:**

1. Fetch and open the store, a collection, a card's page, the shop's product and collection addresses, the cart, the checkout, order history, an order's detail and Store Locator.
2. From a collection, open a card, add it to the cart, open the cart and the checkout.

**Expected Results:**

* Step 1 answers 200 and renders each store surface.
* Step 2 renders each surface, the cart holding the card and the checkout offering to pay.

---

## g10.site-carried-surfaces.US5: Collector reads a site whose products have not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a product it cannot
serve me from,
**so that** I am never shown a case to open or a visit to book that nobody is
ready to honour.

<!-- trace:case id=g10.site-carried-surfaces.TC-azq rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### g10.site-carried-surfaces.US5-TC1: A public build offers nothing leading to a waiting product

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* A collector opens `<lane>`, under each language prefix the site answers.

**Test data:**

| `<lane>` |
| --- |
| `<public>` |
| preview |
| UAT |
| a build made for the test carrying the front door and none of the waiting products |

**Steps:**

1. Read the header, the footer, and the front door where carried; collect every rendered link.
2. Fetch the page with scripts off, and read its links and controls.

**Expected Results:**

* No item, link, button or card names the store, Store Locator, the vault or booking a visit; no cart control and no shop column; every link opens a surface the build carries.
* The front door's headline renders, and its card row renders empty.
* Step 2 holds no such link, cart control or button.

<!-- trace:case id=g10.site-carried-surfaces.TC-18i rev=2 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### g10.site-carried-surfaces.US5-TC7: The surfaces every lane carries are still named and still open

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* A collector is on `<public>`.

**Steps:**

1. Open each surface the header and footer name.

**Expected Results:**

* They name the auction, sign-in, the terms and the privacy page, each opening its own surface.

<!-- trace:case id=g10.site-carried-surfaces.TC-f3d rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### g10.site-carried-surfaces.US5-TC12: Where the front door is withheld, the home address opens the auction

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* A collector holds the home address of `<lane>`.

**Test data:**

| `<lane>` |
| --- |
| UAT |
| preview |
| `<public>` |

**Steps:**

1. Fetch it, bare and under each language prefix; then open it.

**Expected Results:**

* Each fetch answers a redirect that is not permanent, to the auction in the language asked; the page renders the auction.

<!-- trace:case id=g10.site-carried-surfaces.TC-7fd rev=1 covers=g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### g10.site-carried-surfaces.US5-TC11: The collector's vault screens answer not-found and are linked nowhere, the signing ceremony alone answering

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-05

**Pre-conditions:**

* A signed-in collector holding an open case waiting for a signature is on `<lane>`, a build carrying the vault's set.

**Test data:**

| `<lane>` |
| --- |
| staging |
| development |

**Steps:**

1. Collect every link on the front door and the account page.
2. Fetch and open the signing ceremony with the case's token, the case list `/vault`, the request `/vault/new`, the case's page, the identity check `/vault/verify`, and Your data `/profile/data`.

**Expected Results:**

* Step 1 names none of those screens, and the account page offers no Your data button.
* Step 2 answers 200 with the ceremony for its token, and 404 with the not-found surface for every other.

---

## g10.site-carried-surfaces.US6: Collector opens a withheld product's address on the public site

**As a** collector,
**I want** a vault, booking, profile or membership address I typed,
bookmarked or followed on the public site to tell me the site does not hold
it,
**so that** I learn the page is not there instead of waiting on one that will
never render.

<!-- trace:case id=g10.site-carried-surfaces.TC-tvu rev=2 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd,g10.site-carried-surfaces.SC-50x,g10.site-carried-surfaces.SC-7os,g10.site-carried-surfaces.SC-r14,g10.site-carried-surfaces.SC-w1o,g10.site-carried-surfaces.SC-0lq,g10.site-carried-surfaces.SC-d8a,g10.site-carried-surfaces.SC-hx8,g10.site-carried-surfaces.SC-tfq,g10.site-carried-surfaces.SC-hn8,g10.site-carried-surfaces.SC-bpn,g10.site-carried-surfaces.SC-zf5 -->
### g10.site-carried-surfaces.US6-TC1: A withheld product's address on a public lane answers 404, naming nothing of it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* A `<who>` on `<lane>` holds `<address>`.

**Test data:**

| `<lane>` | `<who>` | `<address>` |
| --- | --- | --- |
| `<public>` | signed-out collector | the signing ceremony, the case list, the request, a case's page, the identity check, Your data |
| `<public>` | signed-out collector | booking a visit, a booking's private link, the collector's own visits |
| `<public>` | signed-out collector | addresses beneath the vault, a case's page, booking a visit and the own visits |
| `<public>` | signed-out collector | the vault and booking a visit under each language prefix |
| `<public>` | signed-in collector holding an open case and a booked visit | their case's address and their own visits |
| `<public>` | collector holding links minted on a carrying lane | a booking's private link, the signing ceremony with its token, the identity check |
| `<public>` | admin holding `vault:operate` | the vault, and the signing ceremony |
| UAT | signed-out collector | the store, Store Locator, the signing ceremony, booking a visit, the profile, membership, grading's counter signing, a labs surface |
| preview, `<public>` | signed-out collector | grading's counter signing |

**Steps:**

1. Fetch each `<address>`, then open it; read the not-found page's words and links.

**Expected Results:**

* Each answers 404 naming no address to follow, and renders the not-found surface, in the prefix's language, naming no case, visit, queue or collector, every link on it opening a surface the build carries; a signed-in collector stays signed in.

<!-- trace:case id=g10.site-carried-surfaces.TC-l4m rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### g10.site-carried-surfaces.US6-TC10: Browser history through a withheld address still renders not-found

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-06

**Pre-conditions:**

* A collector is on `<public>`'s front page.

**Steps:**

1. Open the vault's address from the address bar; press Back, then Forward.

**Expected Results:**

* The address renders not-found, Back the front page, Forward not-found again, never a blank or endless loading page.

<!-- trace:case id=g10.site-carried-surfaces.TC-q6f rev=1 covers=g10.site-carried-surfaces.SC-34s,g10.site-carried-surfaces.SC-5p3,g10.site-carried-surfaces.SC-lvd -->
### g10.site-carried-surfaces.US6-TC7: No request makes a running build carry more

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What a build carries

**Pre-conditions:**

* A public build carries no waiting product.

**Steps:**

1. Fetch the vault's address; then with a query asking the site to carry the vault; then ten times in a row.

**Expected Results:**

* Every response answers 404, rendering no vault surface, the answer never changing.

---

## g10.site-carried-surfaces.US7: Collector signed in on the public site opens the account menu

**As a** signed-in collector,
**I want** the account menu to name only the pages the site can open for me,
**so that** no item in it takes me to a page the site refuses.

<!-- trace:case id=g10.site-carried-surfaces.TC-lmp rev=1 covers=g10.site-carried-surfaces.SC-zcr -->
### g10.site-carried-surfaces.US7-TC1: The account menu on a public lane names no withheld page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* `<collector>` is signed in on `<lane>`.

**Test data:**

| `<lane>` | `<collector>` |
| --- | --- |
| `<public>` | a collector |
| `<public>` | a collector holding an open case and a booked visit |
| preview | a collector |

**Steps:**

1. Open the account menu, and read its items and the header's counts.

**Expected Results:**

* No item names an order, a vault case or a visit, and no count or badge names one; each item opens a surface the build carries.

<!-- trace:case id=g10.site-carried-surfaces.TC-0o1 rev=1 covers=g10.site-carried-surfaces.SC-zcr -->
### g10.site-carried-surfaces.US7-TC2: Every account menu item opens its own surface, the visits item where booking is carried

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-07

**Pre-conditions:**

* A collector holding an open case and a booked visit is signed in on `<lane>`.

**Test data:**

| `<lane>` | `<menu>` |
| --- | --- |
| `<public>` | the items the build carries |
| staging | the items, the collector's visits among them, and no vault case item |

**Steps:**

1. Open the account menu, and each item in turn.

**Expected Results:**

* It names `<menu>`; each renders its own surface, none answering 404.

---

## g10.site-carried-surfaces.US8: Collector uses a product on the lane it is open on

**As a** collector,
**I want** every vault, booking, profile and membership surface to work
unchanged where its product is open,
**so that** hiding a product on the public site costs nothing to the lanes it
is still used on.

<!-- trace:case id=g10.site-carried-surfaces.TC-n0x rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5,g10.site-carried-surfaces.SC-bpn -->
### g10.site-carried-surfaces.US8-TC1: Every waiting product answers where its lane carries it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* A signed-in collector holds a case and a grading submission waiting for a signature, and a booked visit, on `<lane>`.

**Test data:**

| `<lane>` | `<addresses>` |
| --- | --- |
| staging | the signing ceremony with its token, booking a visit, a booking's private link, the own visits |
| staging-2 | the home address answered by the front door, the store, Store Locator, the signing ceremony, booking a visit, the profile, membership, join, grading's counter signing, a labs surface |

**Steps:**

1. Fetch and open each of `<addresses>`.

**Expected Results:**

* Each answers 200 and renders its own surface, not the not-found surface nor the auction.

<!-- trace:case id=g10.site-carried-surfaces.TC-4e6 rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### g10.site-carried-surfaces.US8-TC3: Signing and booking work unchanged where they are carried

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* On staging, a collector's case waits for a signature at the shop's iPad; grading has a free slot.

**Steps:**

1. Open the signing ceremony with the case's token.
2. Book a grading visit with a name and an email, and open the private link from its mail.

**Expected Results:**

* Step 1 renders the ceremony, offering the case's documents to sign.
* Step 2 takes and confirms the booking; the link renders the visit, offering to move or cancel it.

<!-- trace:case id=g10.site-carried-surfaces.TC-81l rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### g10.site-carried-surfaces.US8-TC5: The chrome and the front door name each carried product on a carrying lane

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-site-carried-surfaces-US-08

**Pre-conditions:**

* A signed-in collector is on staging.

**Steps:**

1. Read the header, the footer and the front door; open booking a visit from the header.

**Expected Results:**

* The header names the store and booking a visit with a cart control, and no vault item; the footer carries a shop column; the front door a button and card for the store, none for booking or the vault; nothing opens a vault address; booking a visit renders.

<!-- trace:case id=g10.site-carried-surfaces.TC-o4j rev=2 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### g10.site-carried-surfaces.US8-TC6: A product opens for all its surfaces at once, the others staying shut

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Where a product is open

**Pre-conditions:**

* A build carries no waiting product; a case waiting for a signature holds a live token for its lane.

**Steps:**

1. Add the lane to the stated list carrying the vault, rebuild and deploy with no other edit.
2. Open the signing ceremony with the token; fetch the store, booking a visit, the profile and membership.

**Expected Results:**

* The ceremony renders; the four answer 404; nothing outside the vault's set changed.

<!-- trace:case id=g10.site-carried-surfaces.TC-2wv rev=1 covers=g10.site-carried-surfaces.SC-9vv,g10.site-carried-surfaces.SC-neg,g10.site-carried-surfaces.SC-k9w,g10.site-carried-surfaces.SC-hz5 -->
### g10.site-carried-surfaces.US8-TC7: Development and staging carry the labs

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What a build carries

**Pre-conditions:**

* A labs demonstration surface and the unapproved refund draft are built.

**Test data:**

| `<lane>` |
| --- |
| development |
| staging |

**Steps:**

1. Open both on `<lane>`.

**Expected Results:**

* Both render, not the not-found surface.

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

