# grade10-site/vault/case-intake Test Cases

**Status:** pending-review · 0/29
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

## Background

* customer(collector) is signed in on `<g10url>`; the request wizard opens from the vault page and runs Describe, Photographs and Review; their own cases are listed on the vault page. Grade10's currency is HKD.
* Photographs are JPEG, PNG or HEIC, at most ten per request and 20,971,520 bytes each. A collector holds at most three unsent requests.
* A walk-in draft is one staff opened at the counter under the collector's account, read on the console case page by admin(holds `vault:operate`).

## Walk 1: Send in a card for a loan

Starting state:

- customer(collector) on the vault page, holding no unsent request.

Shared test data:

| Field | Value |
| --- | --- |
| card | Charizard 1999 Base Set, a trading card, HKD50,000.00 asked for |

### Route

1. Start a request, describe `<card>`, and add one photograph.
   - An unsent request, already carrying its six-character reference. `g10.vault-case-intake.US5-TC1`
2. Leave, and reopen it from the vault page.
   - Listed unsent, still taking an edit and a photograph. `g10.vault-case-intake.US1-TC15`
3. On Review, read it back, tick the collection statement, and send.
   - Read back as it will be sent; it goes submitted, keeping the statement's version, and a visit may be booked. `g10.vault-case-intake.US4-TC1`
4. Try to change its title.
   - Refused; the title stays as sent. `g10.vault-case-intake.US4-TC11`

## g10.vault-case-intake.US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

<!-- trace:case id=g10.vault-case-intake.TC-hwu rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC1: A request asking for a loan opens on the financed lane and, sent with a photograph, can book a visit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is on the vault page.

**Steps:**

1. Start a request, describe a trading card, ask for HKD50,000.00, and add one photograph.
2. Tick the statement on Review, and send.
3. Read the case.

**Expected Results:**

* Step 3 reads submitted, on the financed lane, the amount asked for shown, with a visit to book.

<!-- trace:case id=g10.vault-case-intake.TC-5ym rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC3: The wizard offers the register's ten categories in the site's language, and takes a title and description at their caps

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) reads the site in `<language>` and starts a request.

**Test data:**

| `<language>` | `<category>` | `<title>` | `<description>` |
| --- | --- | --- | --- |
| English | comic | 200 characters | 2,000 characters |
| Korean | trading card | a short title | none |

**Steps:**

1. Read the categories offered.
2. Choose `<category>`, enter `<title>` and `<description>`, and add a photograph.
3. Read the request back.

**Expected Results:**

* Step 1 offers trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other, in `<language>`.
* Step 3 carries the category, title and description as written.

<!-- trace:case id=g10.vault-case-intake.TC-9wo rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC4: A request is refused for a title, description, number or amount outside its rule

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is on the wizard's Describe step.

**Test data:**

| `<entered>` | `<refusal names>` |
| --- | --- |
| a title of 201 characters | the title's length |
| a description of 2,001 characters | the description's length |
| the contact number 123-abc | the number |
| a loan of HKD0.00 | the amount, which must be more than zero |

**Steps:**

1. Enter `<entered>`, every other field valid, and continue.

**Expected Results:**

* It is refused, naming `<refusal names>`; no request is opened.

<!-- trace:case id=g10.vault-case-intake.TC-olr rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC15: A request left unsent is listed as unsent and still takes an edit and a photograph

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) has started a request with one photograph and left the wizard.

**Steps:**

1. Read the vault page.
2. Open the request, change its title, and add a second photograph.

**Expected Results:**

* Step 1 lists it as an unsent request.
* Step 2 saves both.

<!-- trace:case id=g10.vault-case-intake.TC-puf rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC5: Ten photographs at the size cap all attach

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) has an unsent request with no photograph.

**Steps:**

1. Add ten different JPEGs of exactly 20,971,520 bytes each.

**Expected Results:**

* All ten are stored on the request.

<!-- trace:case id=g10.vault-case-intake.TC-9dx rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC10: A request with no photograph cannot be sent

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) has an unsent request with no photograph, on Review.

**Steps:**

1. Tick the statement, and send.

**Expected Results:**

* It is refused, naming the missing photograph; the request stays unsent.

<!-- trace:case id=g10.vault-case-intake.TC-y87 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC13: Opening a photograph is recorded before it is shown

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector)'s case carries a photograph.

**Steps:**

1. Open the photograph on the case.
2. As admin(holds `vault:operate`), read the case's read trail.

**Expected Results:**

* Step 1 shows it; step 2 names the collector and the moment it was opened.

<!-- trace:case id=g10.vault-case-intake.TC-pjg rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC23: A walk-in draft for a slab the register knows reads the register's facts and takes only photographs and a description

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* Staff opened a walk-in draft for a slab the register holds under this collector as a trading card titled Charizard 1999 Base Set, PSA 10.

**Steps:**

1. As the collector, open the draft on a phone.
2. Add a photograph and change the description, and save.

**Expected Results:**

* Step 1 reads the category, title, grader and grade as the register holds them, offering no edit to them.
* Step 2 saves both.

<!-- trace:case id=g10.vault-case-intake.TC-yxv rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US1-TC24: An edit to the register's facts on a walk-in draft is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* The collector has a walk-in draft for a slab the register holds, open in two tabs.

**Steps:**

1. In the tab opened before the slab was linked, change the category and title, and save.

**Expected Results:**

* It is refused, naming the register's facts; the draft keeps them.

---

## g10.vault-case-intake.US2: Collector sends in a card they only want kept safe

**As a** collector,
**I want** to send in a card without asking for a loan,
**so that** it is kept in a vault and I owe nothing for keeping it there.

<!-- trace:case id=g10.vault-case-intake.TC-pfx rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US2-TC1: A request asking for no loan opens on the storage lane, and no offer is ever made on it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-02

**Pre-conditions:**

* customer(collector) is on the vault page.

**Steps:**

1. Start a request, describe a coin, ask for no loan, add a photograph, and send it.
2. Read the case; as admin(holds `vault:approve`), open its console page.

**Expected Results:**

* Step 2: the case is submitted on the storage lane with no amount asked for, a visit may be booked, and the console offers no Make an offer.

---

## g10.vault-case-intake.US3: Collector photographs the item from their phone

**As a** collector,
**I want** to add photographs of the item from my phone and see anything the
vault will not take refused before I spend the upload,
**so that** the shop can prepare around what it can see and my photographs
carry nothing about where I live.

<!-- trace:case id=g10.vault-case-intake.TC-3vw rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US3-TC1: A photograph that is one too many, too large, empty or not an image is refused before upload

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
* **Trace:** grade10-site-vault-case-intake-US-03

**Pre-conditions:**

* customer(collector) has an unsent request carrying `<carrying>`.

**Test data:**

| `<carrying>` | `<offered>` | `<refusal names>` |
| --- | --- | --- |
| ten photographs | an eleventh JPEG | the limit of ten |
| one photograph | a JPEG of 20,971,521 bytes | the size cap |
| one photograph | an empty file | the file being empty |
| one photograph | a PDF | the three image types |

**Steps:**

1. Add `<offered>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; nothing is stored, and the request keeps what it carried.

<!-- trace:case id=g10.vault-case-intake.TC-qdr rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US3-TC2: A photograph is stored once, and without its location

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-03

**Pre-conditions:**

* customer(collector) has an unsent request with no photograph.

**Test data:**

| `<offered>` | `<request carries>` |
| --- | --- |
| a phone photograph carrying GPS coordinates | one photograph; downloaded, it carries no location |
| the same photograph, added twice | one photograph |

**Steps:**

1. Add `<offered>`, and read the request's photographs.

**Expected Results:**

* It carries `<request carries>`.

<!-- trace:case id=g10.vault-case-intake.TC-pj7 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US3-TC3: A photograph on another collector's case is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-03

**Pre-conditions:**

* Collector A is signed in; collector B's case carries a photograph whose address A has.

**Steps:**

1. As A, open that address.

**Expected Results:**

* It is refused, naming the case as not theirs; nothing is shown.

---

## g10.vault-case-intake.US4: Collector checks the request before sending it

**As a** collector on the last step of the wizard,
**I want** to read my request back, see what happens next, and tick that I
have read the collection statement,
**so that** I send what I meant and know what I agreed to.

<!-- trace:case id=g10.vault-case-intake.TC-xwe rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### g10.vault-case-intake.US4-TC2: Review reads the request back whole, and each fact can change until it is sent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) has a request with its facts and one photograph, on Review.

**Steps:**

1. Read Review.
2. Go back, change the title, and return to Review.

**Expected Results:**

* Step 1 reads the item facts, the amount asked for, the photograph and what happens next, as the send will carry them.
* Step 2 reads the new title.

<!-- trace:case id=g10.vault-case-intake.TC-yjd rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### g10.vault-case-intake.US4-TC1: The send carries the collector's tick on the statement and keeps that version

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) is on Review, a collection statement in force.

**Steps:**

1. Read the statement, tick it, and send.
2. As admin(holds `vault:operate`), read the case.

**Expected Results:**

* Step 1 submits the case; step 2 shows the statement's version kept with the send.

<!-- trace:case id=g10.vault-case-intake.TC-0my rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### g10.vault-case-intake.US4-TC4: A send without the tick on the statement in force is refused

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
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) is on Review, `<statement>`.

**Test data:**

| `<statement>` |
| --- |
| not ticked |
| ticked on a version since replaced, the page not reloaded |

**Steps:**

1. Send.

**Expected Results:**

* It is refused, naming the statement; the request stays unsent.

<!-- trace:case id=g10.vault-case-intake.TC-wet rev=1 -->
### g10.vault-case-intake.US4-TC5: Outside production a statement not yet written reads as being prepared and does not hold the send

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* Outside production, the brand has no collection statement wording; customer(collector) is on Review.

**Steps:**

1. Read the statement, tick it, and send.

**Expected Results:**

* The statement reads as being prepared, with no words; the send is taken, keeping its version.

<!-- trace:case id=g10.vault-case-intake.TC-k5u rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### g10.vault-case-intake.US4-TC6: In production a send is refused while the statement has no wording

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* In production, the brand has no collection statement wording; customer(collector) is on Review.

**Steps:**

1. Tick, and send.

**Expected Results:**

* It is refused, naming the statement; the request stays unsent.

<!-- trace:case id=g10.vault-case-intake.TC-y3j rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### g10.vault-case-intake.US4-TC11: A sent request takes no change to its facts and no second send

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
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) sent a request, open in a second tab not reloaded since.

**Test data:**

| `<attempt>` |
| --- |
| change its title, and save |
| send it again |

**Steps:**

1. In the second tab, `<attempt>`.

**Expected Results:**

* It is refused, naming the sent request; it keeps what it was sent with.

<!-- trace:case id=g10.vault-case-intake.TC-csj rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US4-TC21: A request is refused past three unsent, a walk-in counting, and a sent one takes no new photograph

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
* **Trace:** Opening a request

**Pre-conditions:**

* customer(collector) holds `<holding>`.

**Test data:**

| `<holding>` | `<attempt>` | `<refusal names>` |
| --- | --- | --- |
| three unsent requests of their own | start another | the limit of three unsent |
| two unsent of their own and one walk-in draft | start another | the limit of three unsent |
| a sent request, open in a tab not reloaded | add a photograph to it | the sent request |

**Steps:**

1. `<attempt>`.

**Expected Results:**

* It is refused, naming `<refusal names>`; nothing is opened or stored.

<!-- trace:case id=g10.vault-case-intake.TC-o9n rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### g10.vault-case-intake.US4-TC17: A contact number is stored one way however it is typed, and may be left out

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
* **Trace:** Describing the item

**Pre-conditions:**

* customer(collector) starts a request.

**Test data:**

| `<typed>` | `<stored>` |
| --- | --- |
| +852 9123 4567 | +85291234567 |
| 9123-4567 | +85291234567 |
| left empty | none |

**Steps:**

1. Enter `<typed>`, finish the request, and read it back; as admin(holds `vault:operate`), read the case.

**Expected Results:**

* The request opens; both read `<stored>`.

---

## g10.vault-case-intake.US5: Collector gets a reference they can say and type

**As a** collector,
**I want** a short reference for my case,
**so that** I can read it out at the counter and type it as the transfer
reference at my bank.

<!-- trace:case id=g10.vault-case-intake.TC-xis rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### g10.vault-case-intake.US5-TC1: A request carries its six-character reference from the start, and every read names the same one

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
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* `<opened by>` opens a request for the collector.

**Test data:**

| `<opened by>` |
| --- |
| the collector, on the wizard |
| staff, at the counter |

**Steps:**

1. Read the reference on the unsent request.
2. Send it; read the vault page, the case, and the send's answer.

**Expected Results:**

* Step 1 shows six characters from the reference alphabet.
* Step 2 names the same reference everywhere.

<!-- trace:case id=g10.vault-case-intake.TC-yga rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### g10.vault-case-intake.US5-TC5: The send's letter names the reference and links to the case by its address

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** The case reference

**Pre-conditions:**

* customer(collector) has just sent a request.

**Steps:**

1. Read the letter, and select its link.

**Expected Results:**

* It names the case's reference; the link opens the case at its own address, which carries the case's id and not the reference.

<!-- trace:case id=g10.vault-case-intake.TC-d4v rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### g10.vault-case-intake.US5-TC6: A second item is a second request with its own reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* customer(collector) has just sent a request.

**Steps:**

1. Start a request for another item, and read both.

**Expected Results:**

* The new request has a reference of its own; the sent one keeps its reference and status.

---

## g10.vault-case-intake.US6: Collector sends a request staff opened for them at the counter

**As a** collector whose request staff opened at the counter,
**I want** to sign in on my own phone, read the request and the photos back,
and tick that I have read the collection statement before I send it,
**so that** nothing happens to my item on a request I have not seen, and a
request typed under the wrong address is never emailed.

<!-- trace:case id=g10.vault-case-intake.TC-69j rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### g10.vault-case-intake.US6-TC1: The collector finds a walk-in draft among their cases, changes it like their own, and sends it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened a walk-in draft under the collector's account with two photographs.

**Steps:**

1. As the collector, sign in and read the vault page.
2. Open the draft, change its title, remove one of staff's photographs, and add one of their own.
3. On Review, tick the statement in force, and send.

**Expected Results:**

* Step 1 lists it as unsent, marked opened at the counter, with staff's two photographs.
* Step 2 saves the title and those two photographs.
* Step 3 submits it, keeping the statement's version, with a visit to book.

<!-- trace:case id=g10.vault-case-intake.TC-9fk rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### g10.vault-case-intake.US6-TC3: A statement shown at the counter does not stand for the collector's tick

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff showed the collector the statement at the counter while opening a walk-in draft.

**Steps:**

1. As the collector, open the draft's Review.

**Expected Results:**

* The statement is not ticked; the send waits for the collector's own tick.

<!-- trace:case id=g10.vault-case-intake.TC-nxn rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### g10.vault-case-intake.US6-TC6: Nothing is valued, booked or mailed on a walk-in draft until the collector sends it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* A walk-in draft is unsent.

**Steps:**

1. As admin(holds `vault:approve`), read its case; as the collector, read it and the inbox.

**Expected Results:**

* No valuation or offer is offered, no visit can be booked, and no letter has gone about it.

<!-- trace:case id=g10.vault-case-intake.TC-x77 rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### g10.vault-case-intake.US6-TC5: A walk-in draft shows on no other collector's account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened a walk-in draft under collector A's account.

**Steps:**

1. As collector B, read the vault page and open the draft's address.

**Expected Results:**

* It is not listed, and its address is refused as not theirs.

<!-- trace:case id=g10.vault-case-intake.TC-clw rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### g10.vault-case-intake.US6-TC7: A photograph can be removed before the send, and none after

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Photographs

**Pre-conditions:**

* customer(collector)'s request carries three photographs, `<state>`.

**Test data:**

| `<state>` | `<afterwards>` |
| --- | --- |
| unsent | two photographs; the removed one's address no longer opens |
| sent, the page not reloaded | refused, naming the sent request; all three stay |

**Steps:**

1. Remove one photograph.

**Expected Results:**

* It reads `<afterwards>`.
