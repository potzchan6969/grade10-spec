# grade10-site/site/carried-surfaces Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-17, tcs-rules r3.0

## grade10-site-site-carried-surfaces-US1: Collector reads a site whose shop has not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a shop it cannot
serve me from,
**so that** I am never shown a price, a basket or a pay button for a shop
nobody is ready to sell me from.

### grade10-site-site-carried-surfaces-US1-TC1-1: Header names no store surface and carries no cart control

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

### grade10-site-site-carried-surfaces-US2-TC6-1: No store page code reaches the browser

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-site-carried-surfaces-US-02

**Pre-conditions:**

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Navigate to <grade10 public site url>.
2. Collect every script the site serves.
3. Search the collected scripts for the store surfaces and their addresses.

**Expected Results:**

* No collected script holds a store surface's page code.
* No collected script names a store address.

### grade10-site-site-carried-surfaces-US2-TC7-1: The preview host answers as the public site does

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

1. Fetch <grade10 store url> on <grade10 preview site url>.
2. Open <grade10 preview site url> in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2's header, footer and front door name no store surface.

### grade10-site-site-carried-surfaces-US2-TC8-1: A labs address is not held outside development

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

* The site under test is a build that carries the store surfaces and no labs
  surfaces.

**Steps:**

1. Fetch <a labs demonstration surface url> on <grade10 staging site url>.
2. Fetch <the unapproved refund draft url> on the same lane.

**Expected Results:**

* Both return status 404.
* Neither renders a demonstration surface or a draft.

---

## grade10-site-site-carried-surfaces-US3: Crawler is offered only the addresses the site answers

**As a** crawler,
**I want** the site to name only the addresses the build in front of me
answers,
**so that** I never index a page that answers not-found and never carry it
into a search result.

### grade10-site-site-carried-surfaces-US3-TC1-1: Sitemap names no store address

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

* The site under test is a build that carries no store surfaces.

**Steps:**

1. Fetch the sitemap on <grade10 public site url>.

**Expected Results:**

* No entry names the store, a collection, a card's page, the cart, the
  checkout or an order page.
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

### grade10-site-site-carried-surfaces-US3-TC4-1: Crawler files name the store where the build carries it

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

* The site under test is a build that carries the store surfaces.

**Steps:**

1. Fetch the sitemap on <grade10 staging site url>.
2. Fetch every store address the sitemap names.

**Expected Results:**

* The sitemap names the store and the collections under it.
* Every store address it names returns status 200.

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
  carry `grade10-site-site-carried-surfaces-SC-18`.
* **Folded in** — a store address under a language prefix is refused in that
  language (`US2-TC5-1`). No scenario stated it; the requirements now carry
  `grade10-site-site-carried-surfaces-SC-19`.
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
* **Uncovered anchors** — none. All four journeys carry cases, and every
  `## Feature set` root group is reached: "What a build carries" by
  `US2-TC7-1`, `US2-TC8-1` and `US4-TC1-1`, "An address nothing carries" by
  `US2`, "Nothing names an absent surface" by `US1` and `US3`, and "Where the
  shop is open" by `US4`.

## Settled

* The rule that nothing names an absent surface reaches everything a build
  renders — a page's own head and a link in a carried surface's body as much
  as the chrome, the front door and the crawler files.
* The two addresses the shop hands out for a product and a collection are this
  site's to answer, so a build that does not carry the store refuses them.
* A lane that carries no store takes no order, so no mail sent from it names a
  store address.
