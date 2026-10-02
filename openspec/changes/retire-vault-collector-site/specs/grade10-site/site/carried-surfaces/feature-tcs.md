# grade10-site/site/carried-surfaces Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-site-carried-surfaces-US5: Collector reads a site whose products have not opened

**As a** collector,
**I want** the public site to offer nothing that leads to a product it cannot
serve me from,
**so that** I am never shown a case to open or a visit to book that nobody is
ready to honour.

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

---

## grade10-site-site-carried-surfaces-US6: Collector opens a withheld product's address on the public site

**As a** collector,
**I want** a vault or booking address I typed, bookmarked or followed on the
public site to tell me the site does not hold it,
**so that** I learn the page is not there instead of waiting on one that will
never render.

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
| Booking | Booking a visit |
| Booking | The private link from a booking's mail |
| Booking | A collector's own visits |

**Steps:**

1. Fetch `<withheld address>` on <grade10 public site url>.
2. Open the same address in the browser.

**Expected Results:**

* Step 1 returns status 404.
* Step 2 renders the not-found surface, not a `<product>` surface.

---

### grade10-site-site-carried-surfaces-US6-TC14-1: The collector's vault screens answer not-found on the public lanes

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

* The sites under test are <grade10 public site url> and <grade10 preview site url>.

**Test data:**

| `<vault screen address>` |
| --- |
| The case list, `/vault` |
| The request, `/vault/new` |
| A case's page, `/vault/cases/<case id>` |
| The identity check, `/vault/verify` |
| Your data, `/profile/data` |

**Steps:**

1. Fetch `<vault screen address>` on <grade10 public site url>.
2. Open the same address in the browser.
3. Fetch `<vault screen address>` on <grade10 preview site url>.

**Expected Results:**

* Steps 1 and 3 return status 404.
* Step 2 renders the not-found surface, not a vault surface.

---

## grade10-site-site-carried-surfaces-US7: Collector signed in on the public site opens the account menu

**As a** signed-in collector,
**I want** the account menu to name only the pages the site can open for me,
**so that** no item in it takes me to a page the site refuses.

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

---

## grade10-site-site-carried-surfaces-US8: Collector uses a product on the lane it is open on

**As a** collector,
**I want** every vault and booking surface to work unchanged where its
product is open,
**so that** hiding a product on the public site costs nothing to the lanes it
is still used on.

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

---

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

---

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

---

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

---

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

## Settled

- **The front door on a lane carrying the vault** - no vault button or card on any lane; the ceremony is reached by the link staff hand over (Q20)

## Reconciliation

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `apps/frontend/grade10/src/surfaces.ts` and `MarketingPage.tsx`. It is a statement, not proof.

- **Raised, folded into spec** - the collector's vault screens not found on every lane, from `grade10-site-site-carried-surfaces-US6-TC14-1` and `grade10-site-site-carried-surfaces-US8-TC9-1`, as `grade10-site-site-carried-surfaces-SC-40`; tasks 3.1, 3.2 and the tech design now cite `grade10-site-site-carried-surfaces-SC-22`, `-SC-26` and `-SC-40` in place of the store's and booking's scenarios
- **Raised, escalated** - the front door's vault card, landed as Q20
- **Raised, rejected** - none
- **Joined** - `grade10-site-site-carried-surfaces-SC-28` into `grade10-site-site-carried-surfaces-US6-TC1-2`; `grade10-site-site-carried-surfaces-SC-25` into `grade10-site-site-carried-surfaces-US8-TC3-2`
- **Corrected** - `grade10-site-site-carried-surfaces-US8-TC5-2` finds a button and card for the store alone on the front door; `grade10-site-site-carried-surfaces-US8-TC6-2` fetches the store, booking, the profile and membership, the four sets `grade10-site-site-carried-surfaces-SC-27` keeps shut, and no vault address; both count five waiting products
- **Added by QA2** - none
- **Contradicted** - none
- **Uncovered anchors** - none
