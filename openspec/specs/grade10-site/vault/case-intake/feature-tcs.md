# grade10-site/vault/case-intake Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## Background

`customer(collector)` is signed in and `<grade10 vault url>` is reachable in
every case below unless a pre-condition states otherwise. Every amount is
entered in the brand's own currency; Grade10's is HKD.

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

<!-- trace:case id=g10.vault-case-intake.TC-hwu rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC1-2: A financed request opened, photographed and sent reads submitted

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Field | Value |
| --- | --- |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |
| WhatsApp number | +852 9123 4567 |
| Amount requested | 500000 (HKD, minor units) |
| `<photo_1>` | A JPEG photograph, 20 MB or less |

**Steps:**

1. Open a request with the facts and the amount from **Test data**.
2. Attach `<photo_1>` to it.
3. Send it, naming the collection statement version in force.
4. Ask for the collector's own read of the request.

**Expected Results:**

* Steps 1, 2 and 3 are accepted.
* Step 4 reads the request as submitted, in the financed lane, asking 500000 HKD minor units.

<!-- trace:case id=g10.vault-case-intake.TC-pfx rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC2-2: A request with no amount opens in the storage lane

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Field | Value |
| --- | --- |
| Category | Coin |
| Title | 1oz Britannia |
| Description | Graded, capsule intact. |
| Amount requested | none |
| `<photo_1>` | A JPEG photograph, 20 MB or less |

**Steps:**

1. Open a request with the facts from **Test data** and no amount.
2. Attach `<photo_1>` to it.
3. Send it, naming the collection statement version in force.
4. Ask for the collector's own read of the request.

**Expected Results:**

* Step 4 reads the request as submitted, in the storage lane, with no offer to answer.

<!-- trace:case id=g10.vault-case-intake.TC-5ym rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC3-2: A request at the caps or as a comic opens as written

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Category | Title | Description |
| --- | --- | --- |
| Trading card | 200 characters, exactly the cap | 2,000 characters, exactly the cap |
| Comic | `Amazing Fantasy #15` | None |

**Steps:**

1. Open a request with the row's category, title and description, in HKD.
2. Ask for the collector's own read of the request.

**Expected Results:**

* Step 1 opens the request.
* Step 2 carries the row's category, title and description as written.

<!-- trace:case id=g10.vault-case-intake.TC-9wo rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC4-2: A title, description or category past its rule refuses the request

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Fact past its rule | Value |
| --- | --- |
| Title | 201 characters, one past the cap |
| Description | 2,001 characters, one past the cap |
| Category | `toy`, outside the register's ten |

**Steps:**

1. Ask for the collector's own cases.
2. Open a request whose facts are valid but for the row's.
3. Ask for the collector's own cases again.

**Expected Results:**

* Step 2 is refused by name.
* Step 3 lists the same cases as step 1, and no new one.

<!-- trace:case id=g10.vault-case-intake.TC-puf rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC5-2: Ten photographs at the size cap all attach

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, no photographs attached yet.

**Test data:**

| Field | Value |
| --- | --- |
| Photographs | ten different JPEG files, each exactly 20,971,520 bytes (20 MB) |

**Steps:**

1. Attach the ten photographs from **Test data** to `<case_1>`, one at a time.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Each attachment in step 1 is accepted.
* Step 2 carries all ten photographs.

<!-- trace:case id=g10.vault-case-intake.TC-3vw rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC6-2: An eleventh photograph is refused at the limit

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete, ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| `<photo_11>` | A JPEG photograph, 20 MB or less |

**Steps:**

1. Attach `<photo_11>` to `<case_1>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 carries ten photographs.

<!-- trace:case id=g10.vault-case-intake.TC-hqv rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC7-2: A photograph past 20 MB is refused

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| Photograph | A JPEG of 20,971,521 bytes, one past 20 MB |

**Steps:**

1. Attach the photograph from **Test data** to `<case_1>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 carries the photographs `<case_1>` held before step 1, and no more.

<!-- trace:case id=g10.vault-case-intake.TC-c1c rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC8-2: A file that is not a photograph is refused

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| File | A PDF |

**Steps:**

1. Attach the file from **Test data** to `<case_1>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 carries the photographs `<case_1>` held before step 1, and no more.

<!-- trace:case id=g10.vault-case-intake.TC-50g rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC9-2: An empty file is refused

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete, fewer than ten photographs attached.

**Test data:**

| Field | Value |
| --- | --- |
| File | A zero-byte JPEG |

**Steps:**

1. Attach the file from **Test data** to `<case_1>`.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 carries the photographs `<case_1>` held before step 1, and no more.

<!-- trace:case id=g10.vault-case-intake.TC-9dx rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC10-2: A send with no photograph is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete, no photograph attached.

**Steps:**

1. Send `<case_1>`, naming the collection statement version in force.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 still reads `<case_1>` as a draft.

<!-- trace:case id=g10.vault-case-intake.TC-qdr rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC11-2: Location metadata is stripped from an uploaded photograph

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft.

**Test data:**

| Field | Value |
| --- | --- |
| Photograph | a JPEG carrying GPS location metadata |

**Steps:**

1. Attach the photograph from **Test data** to `<case_1>`.
2. Fetch the stored photograph from the address `<case_1>`'s read gives for it.

**Expected Results:**

* The stored photograph carries no location metadata.

<!-- trace:case id=g10.vault-case-intake.TC-pj7 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC12-1: A photograph is refused to a collector who does not own the case

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector A)` has a case with a photograph attached.
* `customer(collector B)` is signed in on a different account.

**Steps:**

1. `customer(collector B)` requests `customer(collector A)`'s photograph directly.

**Expected Results:**

* The request is refused; the photograph is not returned.

<!-- trace:case id=g10.vault-case-intake.TC-y87 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC13-1: Viewing a photograph is recorded on the read trail

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` has a case with a photograph attached.

**Steps:**

1. `customer(collector)` opens the photograph.

**Expected Results:**

* A read of the photograph is recorded, naming who read it and when.

<!-- trace:case id=g10.vault-case-intake.TC-csj rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC14-2: A fourth unsent request is refused at the draft cap

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds three unsent requests.

**Steps:**

1. Open a request with the required item facts.
2. Ask for the collector's own cases.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 lists the same three unsent requests, and no fourth.

<!-- trace:case id=g10.vault-case-intake.TC-olr rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC15-2: A request left unsent is listed unsent and still takes an edit and a photograph

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | Charizard 1st Edition |
| `<new title>` | Charizard 1st Edition PSA 9 |
| `<photo_1>` | A JPEG photograph, 20 MB or less |

**Steps:**

1. Open a request titled `<title>`, and send nothing.
2. Ask for the collector's own cases.
3. Change the request's title to `<new title>`.
4. Attach `<photo_1>` to it.
5. Ask for the collector's own read of the request.

**Expected Results:**

* Step 2 lists the request as unsent.
* Steps 3 and 4 are accepted.
* Step 5 carries `<new title>` and `<photo_1>`, still unsent.

<!-- trace:case id=g10.vault-case-intake.TC-sfb rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC16-2: A second send of a request already sent is refused

**Classification:**

* **Severity:** major
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is a request the collector has already sent.

**Steps:**

1. Ask for the collector's own cases.
2. Send `<case_1>` again, naming the collection statement version in force.
3. Ask for the collector's own cases again.

**Expected Results:**

* Step 2 is refused by name.
* Step 3 lists the same cases as step 1, `<case_1>` still submitted, and no second case.

<!-- trace:case id=g10.vault-case-intake.TC-o9n rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC17-2: A WhatsApp number typed differently stores one canonical value

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Field | Value |
| --- | --- |
| WhatsApp number, typed | +852 9123 4567 |
| WhatsApp number, typed | 85291234567 |
| WhatsApp number, typed | ９１２３ ４５６７ |

**Steps:**

1. Open a request with the required item facts and the row's WhatsApp number.
2. Ask for the collector's own read of the request.

**Expected Results:**

* Every row stores the same canonical E.164 number against the case.

<!-- trace:case id=g10.vault-case-intake.TC-p1m rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC18-2: An invalid WhatsApp number refuses the request

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Test data:**

| Field | Value |
| --- | --- |
| WhatsApp number | `123-abc` |

**Steps:**

1. Ask for the collector's own cases.
2. Open a request with the required item facts and the number from **Test data**.
3. Ask for the collector's own cases again.

**Expected Results:**

* Step 2 is refused by name.
* Step 3 lists the same cases as step 1, and no new one.

<!-- trace:case id=g10.vault-case-intake.TC-msq rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC19-2: A request with no WhatsApp number opens

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds fewer than three unsent requests.

**Steps:**

1. Open a request with the required item facts and no WhatsApp number.
2. Ask for the collector's own read of the request.

**Expected Results:**

* Step 1 opens the request.
* Step 2 carries no contact number.

<!-- trace:case id=g10.vault-case-intake.TC-1aq rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC20-1: A case always opens in the brand's own currency

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` has an open request on Grade10.

**Steps:**

1. Send the request with an amount, naming a currency other than HKD.

**Expected Results:**

* The request is refused; the case is never opened in the other currency.

<!-- trace:case id=g10.vault-case-intake.TC-ep5 rev=1 covers=g10.vault-case-intake.SC-nkl,g10.vault-case-intake.SC-90o,g10.vault-case-intake.SC-s1j -->
### grade10-site-vault-case-intake-US1-TC21-1: A photograph offered after the request is sent is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `Opening a request`

**Pre-conditions:**

* `customer(collector)` has sent a request in, and the case carries one photograph.

**Steps:**

1. Offer a further photograph against the sent case.

**Expected Results:**

* The photograph is refused by name; the case still carries one photograph and nothing is stored.

<!-- trace:case id=g10.vault-case-intake.TC-tr4 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC22-1: The wizard offers the register's ten categories in each language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in on <grade10 vault url> in the language of the row, with no unsent draft.

**Test data:**

| Language |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Start a new request.
2. Open the category choice on the Describe step.
3. Choose comic and fill in a title and a description.
4. Click Continue.

**Expected Results:**

* Step 2 offers ten categories: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other.
* Every category reads in the row's language, none as a raw key.
* Step 4 moves to the Photograph step with comic kept as the category.

<!-- trace:case id=g10.vault-case-intake.TC-pjg rev=2 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC23-2: A draft staff opened with a known slab takes only photo and description edits

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* Staff opened `<draft_1>` for the collector at the counter with `<item_1>`, a slab the register holds under this collector: trading card, PSA, grade 10, `AB12345`.
* admin(staff, holds vault:read) can open `<item_1>` in the console's item register.

**Steps:**

1. Ask for the collector's own read of `<draft_1>`.
2. Change the description of `<draft_1>`.
3. Add one photograph to `<draft_1>`.
4. Send `<draft_1>`, naming the statement version in force.
5. As staff, open `<item_1>` in the item register.

**Expected Results:**

* Step 1 reads the category and the title as the register holds them.
* Steps 2, 3 and 4 are accepted; the request is submitted carrying the new description and the added photograph.
* Step 5 still reads trading card, PSA, grade 10 and `AB12345`, its description unchanged.

<!-- trace:case id=g10.vault-case-intake.TC-yxv rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC24-1: An edit to a linked draft's category or title is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in.
* Staff opened `<draft_1>` for the collector at the counter with `<item_1>`, a slab the register holds under this collector: trading card titled `<title_1>`.

**Steps:**

1. Send an edit of `<draft_1>` changing its category to comic, straight to the vault worker.
2. Send an edit of `<draft_1>` changing its title, straight to the vault worker.
3. Read `<draft_1>`.

**Expected Results:**

* Steps 1 and 2 are each refused by name.
* `<draft_1>` still reads trading card and `<title_1>`.

<!-- trace:case id=g10.vault-case-intake.TC-8xk rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC25-1: A loan of zero is refused on the Describe step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` is on the Describe step of a new request, `<grade10 vault url>`.

**Test data:**

| `<zero amount>` |
| --- |
| `0` |
| `0.00` |

| Field | Value |
| --- | --- |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |

**Steps:**

1. Fill in the category, title and description from **Test data**.
2. Choose a loan at the lane question.
3. Type `<zero amount>` into the loan field.
4. Click Continue.
5. Choose storage only at the lane question.
6. Click Continue.

**Expected Results:**

* Step 3 leaves the loan field empty, no amount read back under it.
* Step 4 shows the refusal asking how much, or for storage only.
* After step 4 the Describe step stays open, and nothing is sent.
* The category, title and description keep what was typed.
* Step 6 moves on to the Photograph step.

<!-- trace:case id=g10.vault-case-intake.TC-dy2 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC26-1: The intake refuses a financing amount that is not more than zero

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` holds a signed-in session on Grade10, with fewer than three unsent drafts.

**Test data:**

| `<financing amount>` | Reading |
| --- | --- |
| `0` | zero minor units, HKD 0.00 |
| `-1` | one minor unit below zero |

| Field | Value |
| --- | --- |
| Currency | HKD |
| `<smallest loan>` | `1`, one minor unit, HKD 0.01 |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |

**Steps:**

1. Open a request from **Test data** with financing amount `<financing amount>`.
2. Read the API response.
3. Open the same request with financing amount `<smallest loan>`.
4. Read the API response.

**Expected Results:**

* Step 2 refuses the request as a bad request naming the financing amount.
* After step 2, no case is opened on either lane.
* Step 4 opens the request on the financed lane, asking `<smallest loan>`.

---

## grade10-site-vault-case-intake-US4: Collector checks the request before sending it

**As a** collector on the last step of the wizard,
**I want** to read my request back, see what happens next, and tick that I
have read the collection statement,
**so that** I send what I meant and know what I agreed to.

<!-- trace:case id=g10.vault-case-intake.TC-yjd rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC1-2: The send carries the collector's word on the statement and keeps its version

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts and one photograph complete.
* The collection statement stands at `<statement version>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<statement version>` | The version the vault offers at the send; outside production with no wording set, the unwritten version |

**Steps:**

1. Ask for the collection statement the vault offers at the send.
2. Send `<case_1>`, giving the collector's word that they read `<statement version>`.
3. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 names `<statement version>`, with its words, or none where no wording is set.
* Step 2 is accepted.
* Step 3 reads `<case_1>` as submitted, its history keeping `<statement version>` on the send.

<!-- trace:case id=g10.vault-case-intake.TC-xwe rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC2-2: A draft reads back whole, and each fact changes until the send

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, financed, carrying the facts and the two photographs in **Test data**.

**Test data:**

| Field | Value |
| --- | --- |
| `<category>` | One of the register's ten categories |
| `<title>` | Charizard 1st Edition |
| `<description>` | Any text of 2,000 characters or fewer |
| `<contact number>` | +852 9123 4567, read back in its one stored form |
| `<amount>` | 500000 HKD minor units |
| `<photo_1>`, `<photo_2>` | Two JPEG photographs, each 20 MB or less |
| `<new title>` | Charizard 1st Edition PSA 9 |

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Read the API response.
3. Change the title of `<case_1>` to `<new title>`.
4. Ask for the collector's own read of `<case_1>` again.

**Expected Results:**

* Step 2 returns `<category>`, `<title>`, `<description>`, `<contact number>` and `<amount>`, and both `<photo_1>` and `<photo_2>`.
* Step 3 is accepted.
* Step 4 returns `<new title>`; every other fact and both photographs are unchanged.
* `<case_1>` is still a draft.

<!-- trace:case id=g10.vault-case-intake.TC-5j6 rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC3-1: The review step names what happens next

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete.

**Steps:**

1. Read the What happens next block.

**Expected Results:**

* Three items are listed, naming what the shop does with the request.

<!-- trace:case id=g10.vault-case-intake.TC-0my rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC4-2: A send without the collector's word on the statement is refused

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts and one photograph complete.
* The collection statement in force stands at `unwritten`, the version Grade10's vault answers while Legal's wording is unset.

**Test data:**

| The send names |
| --- |
| No version of the statement |
| `v1`, a version other than the one in force |

**Steps:**

1. Send `<case_1>`, naming the row's version.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 still reads `<case_1>` as a draft.

<!-- trace:case id=g10.vault-case-intake.TC-ye6 rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC5-1: The statement reads "Being prepared" outside production

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step outside production, Legal's statement text not yet supplied.

**Steps:**

1. Click the statement link.
2. Return, tick the statement, and click Send it in.

**Expected Results:**

* The linked page reads "Being prepared".
* The request still sends.

<!-- trace:case id=g10.vault-case-intake.TC-k5u rev=2 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC6-2: A send is refused in production while the statement wording is unset

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The environment is production, and Legal's collection statement wording is unset.
* `<case_1>` is the collector's unsent draft, its item facts and one photograph complete.

**Steps:**

1. Send `<case_1>`, giving the collector's word on the collection statement.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 still reads `<case_1>` as a draft.

<!-- trace:case id=g10.vault-case-intake.TC-ue8 rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC7-1: Finish later from the review step saves without sending

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement ticked.

**Steps:**

1. Click Finish later.

**Expected Results:**

* The request is not sent.
* It is listed as an unsent request on the collector's own list.

<!-- trace:case id=g10.vault-case-intake.TC-y3j rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC11-1: A request already sent takes no change to its facts

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_2>` is a request the collector sent, titled `<title>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<title>` | Charizard 1st Edition |
| `<new title>` | Charizard 1st Edition PSA 9 |

**Steps:**

1. Change the title of `<case_2>` to `<new title>`.
2. Ask for the collector's own read of `<case_2>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 still returns `<title>`.

---

## grade10-site-vault-case-intake-US5: Collector gets a reference they can say and type

**As a** collector,
**I want** a short reference for my case,
**so that** I can read it out at the counter and type it as the transfer
reference at my bank.

<!-- trace:case id=g10.vault-case-intake.TC-xis rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC1-2: Sending a request answers its six-character reference, and every read names it

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete and one photograph attached.

**Steps:**

1. Send `<case_1>`, naming the collection statement version in force.
2. Read the reference in the API response.
3. Ask for the collector's own cases.
4. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 2 reads six characters, drawn only from digits and capitals without 0, O, 1, I and L.
* Steps 3 and 4 name the same reference, and key `<case_1>` by its id.

<!-- trace:case id=g10.vault-case-intake.TC-iik rev=1 covers=g10.vault-case-intake.SC-1y5,g10.vault-case-intake.SC-0q4,g10.vault-case-intake.SC-3s9 -->
### grade10-site-vault-case-intake-US5-TC2-1: A reference draw that collides is redrawn

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `The case reference`

**Pre-conditions:**

* Grade10 already has an open case whose reference matches the next value the draw would otherwise produce.

**Steps:**

1. Send in a new request on Grade10.

**Expected Results:**

* The new case's reference does not match the existing case's; the draw was redrawn rather than shared.

<!-- trace:case id=g10.vault-case-intake.TC-bie rev=1 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC3-1: A reference is unique per brand, not across brands

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* Grade10 already has an open case whose reference matches the next value ZZZ's draw would otherwise produce.

**Steps:**

1. Send in a new request on the ZZZ site, `<zzz-site vault url>`.

**Expected Results:**

* The ZZZ case is issued that reference; the clash with Grade10's case is not checked across brands.

<!-- trace:case id=g10.vault-case-intake.TC-jem rev=1 covers=g10.vault-case-intake.SC-1y5,g10.vault-case-intake.SC-0q4,g10.vault-case-intake.SC-3s9 -->
### grade10-site-vault-case-intake-US5-TC4-1: A reference is never reused, even after its case ends

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** `The case reference`

**Pre-conditions:**

* A Grade10 case that has since ended holds a known reference.

**Steps:**

1. Send in a new request on Grade10 after the earlier case has ended.

**Expected Results:**

* The new case's reference never matches the ended case's reference.

<!-- trace:case id=g10.vault-case-intake.TC-yga rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC5-2: The letter on the send names the reference and links by the case id

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete and one photograph attached.
* `<collector email>` is its mailbox, which the tester reads.

**Steps:**

1. Send `<case_1>`, naming the collection statement version in force.
2. Read the reference and the id in the API response.
3. Open the letter the send brought to `<collector email>`.

**Expected Results:**

* Step 3's letter carries the reference step 2 read.
* Its link to the case names the case's id, never its reference.

<!-- trace:case id=g10.vault-case-intake.TC-d4v rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC6-2: A second item opens a second request with its own reference

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is a request for one item the collector has just sent, carrying `<reference_1>`.

**Steps:**

1. Open a request for another item.
2. Ask for the collector's own cases.

**Expected Results:**

* Step 1 opens a new request carrying a reference other than `<reference_1>`.
* Step 2 lists both; `<case_1>` still carries `<reference_1>` and reads submitted.

<!-- trace:case id=g10.vault-case-intake.TC-zqt rev=1 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC7-1: Not now opens the case that was just sent

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` has just sent a request and is on the Sent step.

**Steps:**

1. Click Not now.

**Expected Results:**

* The case opens at its own address instead of starting a visit booking.

<!-- trace:case id=g10.vault-case-intake.TC-5kp rev=2 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC8-2: An unsent request already carries the reference it keeps

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is the collector's unsent draft, its item facts complete and one photograph attached, never sent.

**Steps:**

1. Ask for the collector's own read of `<case_1>`.
2. Send `<case_1>`, naming the collection statement version in force.
3. Read the reference in the API response.

**Expected Results:**

* Step 1 carries a six-character reference of the alphabet before any send.
* Step 3 reads the reference step 1 carried.

---

## grade10-site-vault-case-intake-US6: Collector sends a request staff opened for them at the counter

**As a** collector whose request staff opened at the counter,
**I want** to sign in on my own phone, read the request and the photos back,
and tick that I have read the collection statement before I send it,
**so that** nothing happens to my item on a request I have not seen, and a
request typed under the wrong address is never emailed.

<!-- trace:case id=g10.vault-case-intake.TC-69j rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC1-2: The collector finds the draft staff opened and sends it as their own act

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, financed, 500000 HKD minor units, titled Charizard 1st Edition, with two of staff's photographs.
* customer(collector) holds a session on `<walk-in email>`'s account on <grade10 site url> and acts through the vault's API, with no site page.
* The collection statement stands at `<statement version>`.
* `<slot_1>` at `<shop_1>` is a free slot of the vault's visit.

**Test data:**

| Field | Value |
| --- | --- |
| `<statement version>` | The version the vault offers at the send; outside production with no wording set, the unwritten version |

**Steps:**

1. Ask for the collector's own cases.
2. Ask for the collector's own read of `<case_1>`.
3. Send `<case_1>`, giving the collector's word that they read `<statement version>`.
4. Ask for the collector's own read of `<case_1>` again.
5. Book `<slot_1>` at `<shop_1>` for `<case_1>`.
6. As admin(staff, holds vault:read), open the queue's Needs staff view on <grade10 admin vault queue url>.

**Expected Results:**

* Step 1 lists `<case_1>` as a draft, marked as opened at the counter.
* Step 2 carries the title, the amount and both of staff's photographs.
* Step 3 is accepted.
* Step 4 reads `<case_1>` as submitted, its history keeping `<statement version>` on the send.
* Step 5 is accepted.
* Step 6 lists `<case_1>`; it has left the Drafts view.

<!-- trace:case id=g10.vault-case-intake.TC-re9 rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC2-2: A draft staff opened is among the collector's cases and changes like their own

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, financed, with staff's photographs `<photo_a>` and `<photo_b>`.
* customer(collector) holds a session on `<walk-in email>`'s account on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds `<photo_c>`, a JPEG photograph of their own, 20 MB or less.

**Test data:**

| Field | Value |
| --- | --- |
| `<contact number>` | +852 9123 4567 |

**Steps:**

1. Ask for the collector's own cases.
2. Ask for the collector's own read of `<case_1>`.
3. Change the description of `<case_1>`, and give it `<contact number>`.
4. Remove `<photo_a>` from `<case_1>`.
5. Add `<photo_c>` to `<case_1>`.
6. Ask for the collector's own read of `<case_1>` again.

**Expected Results:**

* Step 1 lists `<case_1>` as a draft, marked as opened at the counter.
* Step 2 carries staff's facts, `<photo_a>` and `<photo_b>`, and no contact number.
* Steps 3, 4 and 5 are accepted.
* Step 6 returns the new description, `<contact number>`, `<photo_b>` and `<photo_c>`, and not `<photo_a>`.
* `<case_1>` is still a draft opened at the counter.

<!-- trace:case id=g10.vault-case-intake.TC-9fk rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC3-2: The statement shown at the counter does not stand for the collector's word

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, with one of staff's photographs; its open kept the statement shown at the counter.
* customer(collector) holds a session on `<walk-in email>`'s account on <grade10 site url> and acts through the vault's API, with no site page.

**Steps:**

1. Send `<case_1>` without the collector's word on the collection statement.
2. Ask for the collector's own read of `<case_1>`.

**Expected Results:**

* Step 1 is refused by name.
* Step 2 still reads `<case_1>` as a draft opened at the counter.

<!-- trace:case id=g10.vault-case-intake.TC-77a rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC4-2: A walk-in draft fills the collector's draft cap

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* The collector holds the unsent drafts in the row.

**Test data:**

| Unsent drafts held | Opening another request |
| --- | --- |
| One walk-in draft and one of their own | Opens a new draft |
| One walk-in draft and two of their own | Refused by name |
| Three walk-in drafts | Refused by name |

**Steps:**

1. Open a request with the required item facts, in the storage lane.
2. Ask for the collector's own cases.

**Expected Results:**

* Step 1's outcome matches the row.
* After a refusal, step 2 lists the drafts in the row and no new one.

<!-- trace:case id=g10.vault-case-intake.TC-x77 rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC5-2: A draft staff opened is in no other collector's read

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` under `<walk-in email>`'s account, with two of staff's photographs.
* customer(collector) holds a session on another account on <grade10 site url> and acts through the vault's API, with no site page.
* The tester holds `<photo_1 address>`, the address `<case_1>`'s staff case page loads its first photograph from.

**Steps:**

1. Ask for the collector's own cases.
2. Ask for the collector's own read of `<case_1>` by its id.
3. Open `<photo_1 address>` under the same session.

**Expected Results:**

* Step 1 does not list `<case_1>`.
* Step 2 is refused, and the response carries none of `<case_1>`'s facts.
* Step 3 is refused; the photograph is not served.

<!-- trace:case id=g10.vault-case-intake.TC-nxn rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC6-2: Nothing is valued, booked or emailed on a draft staff opened until it is sent

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, a mailbox the tester reads, with one of staff's photographs.
* customer(collector) holding `<walk-in email>` holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<slot_1>` at `<shop_1>` is a free slot of the vault's visit.
* admin(staff, holds vault:operate and vault:approve) has `<case_1>`'s page open on <grade10 admin vault case url>.

**Test data:**

| Field | Value |
| --- | --- |
| `<mail delivery window>` | 5 minutes (assumed; any wait past the first send attempt) |

**Steps:**

1. As staff, read the acts `<case_1>`'s page offers.
2. As the collector, book `<slot_1>` at `<shop_1>` for `<case_1>`.
3. Wait `<mail delivery window>` and read `<walk-in email>`'s inbox.

**Expected Results:**

* Step 1 offers Cancel, and nothing to value and no visit to book.
* Step 2 is refused by name, and `<case_1>` holds no visit.
* Step 3 holds no message about `<case_1>`.

<!-- trace:case id=g10.vault-case-intake.TC-clw rev=2 covers=g10.vault-case-intake.SC-5hl,g10.vault-case-intake.SC-v4u,g10.vault-case-intake.SC-y75,g10.vault-case-intake.SC-yz2,g10.vault-case-intake.SC-myj -->
### grade10-site-vault-case-intake-US6-TC7-2: The collector removes a photograph before the send and never after

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) holds a session on <grade10 site url> and acts through the vault's API, with no site page.
* `<case_1>` is a draft staff opened for them at the counter, carrying staff's photographs `<photo_a>` and `<photo_b>`, and no contact number.
* `<case_2>` is a request they sent, carrying two photographs.

**Steps:**

1. Ask for the collector's own read of `<case_1>`, and note the address it gives `<photo_a>`.
2. Remove `<photo_a>` from `<case_1>`.
3. Ask for the collector's own read of `<case_1>` again.
4. Open the address noted at step 1, under the same session.
5. Remove one photograph from `<case_2>`.
6. Ask for the collector's own read of `<case_2>`.

**Expected Results:**

* Step 3 carries `<photo_b>` alone, and no contact number.
* Step 4 is refused; `<photo_a>` is no longer served.
* Step 5 is refused by name.
* Step 6 still carries both photographs.

---

## Settled

- The Photograph step's empty refusal catches a zero-byte file, refused the way anything that is not a JPEG, PNG or WebP is refused.
- The 20 MB cap bounds each photograph; nothing bounds the ten together but the count of ten.
- The conflict on Send it in is the case-lifecycle guard — the draft moved between the session reading it and the send landing — so the send is refused by name and no second case opens.
- Whether the Describe step's amount field names the brand's currency is the product manager's to confirm; the recommendation is that it does, and the refusal of any other currency stands either way.
- Which typed forms of a number are one is decided on `docs/prds/products/grade10-site/vault/collector-pages.md`: spacing, `+852` or `00852`, the bare local number, full-width digits and `852` before a local number store as one.
- Taken at landing: a send is refused in production while no collection statement wording is set; outside production it goes through.
- A financing amount is an integer count of minor units, more than zero; storage is asked for by leaving the amount out, never by an amount of zero.
- The collector's wizard keeps its own refusal words, in the collector's four languages; they already name both ways on, an amount or storage only.
- An amount finer than the currency's smallest unit is never rounded to zero: the wizard's loan field does not take it, as it does not take a zero.
- **A stale statement version** - a send naming a version other than the one in force is refused by name and stays unsent (Q17)
- **A walk-in draft with no screen to send it** - it waits on its own clock and ends silently until the request screen ships (Q14)

## Reconciliation

**Run:** 2026-09-22, change `complete-vault-collector-flow`, capability
`grade10-site/vault/case-intake`. The blind pass read an isolated bundle: this
capability's `## Purpose` and `## Feature set` outline, its `user-journeys.md`,
the change's `proposal.md` and `decisions.md` — `## Raised` included — its
`ui-design.md` with the state dispositions stripped, and the PRD pages the
proposal links. Denied: every `## Requirements` section, `openspec/specs/`
beyond the two outline sections, `openspec/changes/archive/`, and
`tech-design.md`. The scenario pass read the same anchors and the durable
requirements, and neither pass saw the other's file before this join.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1`, `US1-TC2-1` | Covered | `grade10-site-vault-case-intake-SC-05`, `grade10-site-vault-case-intake-SC-06`, `grade10-site-vault-case-intake-SC-13`, `grade10-site-vault-case-intake-SC-14`, `grade10-site-vault-case-intake-SC-15`, `grade10-site-vault-case-intake-SC-17` — the two lanes walked end to end |
| `US1-TC3-1`, `US1-TC4-1` | Folded | `grade10-site-vault-case-intake-SC-24` and `grade10-site-vault-case-intake-SC-25`. The durable requirement `A request states one item, in the brand's own currency` tables the 200 and 2,000 character caps and no scenario stated them; the change now opens that requirement in a MODIFIED block and the two scenarios land there |
| `US1-TC5-1`, `US1-TC7-1` | Folded; question landed | `grade10-site-vault-case-intake-SC-28` and `grade10-site-vault-case-intake-SC-29`, in a MODIFIED block on the photograph requirement, which now names the cap in bytes, 20,971,520, so the bound cannot move with a rounded megabyte. Whether the cap also bounds the ten together landed as Q57 — it does not |
| `US1-TC6-1` | Covered | `grade10-site-vault-case-intake-SC-08` |
| `US1-TC8-1` | Covered | `grade10-site-vault-case-intake-SC-09` |
| `US1-TC9-1` | Covered; question landed | A zero-byte JPEG is not one of the three image types, so `grade10-site-vault-case-intake-SC-09` refuses it by name; the blind pass's question about what the empty refusal catches landed as Q57 |
| `US1-TC10-1` | Covered | `grade10-site-vault-case-intake-SC-13` |
| `US1-TC11-1` | Covered | `grade10-site-vault-case-intake-SC-11` |
| `US1-TC12-1` | Covered | `grade10-site-vault-case-intake-SC-12` |
| `US1-TC13-1` | Folded | `grade10-site-vault-case-intake-SC-30`, in a MODIFIED block on `A photograph is stored without its location and read under a trail`, which states the ledger and had no scenario for a recorded read |
| `US1-TC14-1` | Covered | `grade10-site-vault-case-intake-SC-07` |
| `US1-TC15-1` | Covered | `grade10-site-vault-case-intake-SC-01` |
| `US1-TC16-1` | Covered by another capability | `grade10-site-vault-case-lifecycle-SC-04` — a case that moved under the caller is refused by name; the blind pass's question about what produces `request.caseConflict` landed as Q58, and the design's Moved on state closes on that same scenario |
| `US1-TC17-1`, `US1-TC19-1` | Covered; question escalated | `grade10-site-vault-case-intake-SC-04` stores one canonical number however it was typed, and the number is optional by the requirement's table; which typed forms count as one person is decided on `collector-pages.md` |
| `US1-TC18-1` | Folded | `grade10-site-vault-case-intake-SC-26`. The requirement now says a number the brand's plan cannot read is refused by name, as the worker already refuses it; which typed forms count as one person is decided on `collector-pages.md` |
| `US1-TC20-1` | Covered; question landed | `grade10-site-vault-case-intake-SC-03`; whether the amount field shows the brand's currency to the collector landed as Q56 |
| `US4-TC1-1`, `US4-TC2-1`, `US4-TC3-1` | Covered | `grade10-site-vault-case-intake-SC-15`, `grade10-site-vault-case-intake-SC-17` |
| `US4-TC4-1` | Covered | `grade10-site-vault-case-intake-SC-16` |
| `US4-TC5-1` | Covered | `grade10-site-vault-case-intake-SC-18`, now outside production alone |
| `US4-TC6-1` | Covered; restored to `draft`, id kept | `grade10-site-vault-case-intake-SC-31`. Deprecated at the round as a misreading of Q8 and Q17; at landing the owner took the production refusal, so `decisions.md` Q8 now reads as this case does and the case comes back unchanged |
| `US4-TC7-1` | Covered, trimmed | `grade10-site-vault-case-intake-SC-01` — a request left unsent is listed unsent on the collector's own list. The draft also claimed the tick survives the save, which nothing states; `grade10-site-vault-case-intake-SC-17` records the version at the send, so that result left the case |
| `US5-TC1-1` | Covered | `grade10-site-vault-case-intake-SC-19`, `grade10-site-vault-case-intake-SC-23`; the reference is drawn when the request is opened, so what the case reads at the send is the reference the draft already carried. The letter that carries it is `grade10-site/vault/collector-notifications`', and its suite walks it |
| `US5-TC2-1`, `US5-TC4-1`, `US5-TC5-1` | Covered, retraced | `grade10-site-vault-case-intake-SC-20`, `grade10-site-vault-case-intake-SC-21`, `grade10-site-vault-case-intake-SC-22`; each case now traces `The case reference`, the group those scenarios serve, in place of the journey — one anchor per case, and US-05 keeps its own cases |
| `US5-TC3-1` | Retired; `deprecated`, id kept | Its within-brand half is `US5-TC2-1` on `grade10-site-vault-case-intake-SC-20`. Its cross-brand half cannot be walked: Grade10 alone runs a vault, and each brand's vault is its own database, so no second brand's reference exists to clash with |
| `US5-TC6-1` | Folded | `grade10-site-vault-case-intake-SC-27`. One request per item is the durable requirement's last line and no scenario stated it; the several-items block on the Sent step is the design's |
| `US5-TC7-1` | Covered | `grade10-site-vault-case-intake-SC-22` — Not now opens the case at its id-based address |
| `grade10-site-vault-case-intake-SC-02` | Case added | `US1-TC21-1`, tracing `Opening a request`, the group the scenario serves |
| `grade10-site-vault-case-intake-SC-19` | Case added | `US5-TC8-1` — no case read the reference before the request was sent |

**Uncovered anchors:** none.

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote five cases over one journey and raised no question for this capability; the scenario pass issued `grade10-site-vault-case-intake-SC-32` to `grade10-site-vault-case-intake-SC-36` and carried `grade10-site-vault-case-intake-SC-07` in its MODIFIED block. One case was added here.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-case-intake-US6-TC1-1` | Joined | `grade10-site-vault-case-intake-SC-32` and `grade10-site-vault-case-intake-SC-34` |
| `grade10-site-vault-case-intake-US6-TC2-1` | Joined | `grade10-site-vault-case-intake-SC-33`, and `grade10-site-vault-case-intake-SC-35` for nothing emailed before the send |
| `grade10-site-vault-case-intake-US6-TC3-1` | Joined | the durable statement rule the send keeps; `grade10-site-vault-case-intake-SC-34` sends only with the collector's tick, and the counter's version stands in for none |
| `grade10-site-vault-case-intake-US6-TC4-1` | Joined | `grade10-site-vault-case-intake-SC-36` and `grade10-site-vault-case-intake-SC-07` |
| `grade10-site-vault-case-intake-US6-TC5-1` | Joined | the durable rules this change leaves as they stand: another collector's case reads not found, and a photograph is served to its owner and staff alone |
| `grade10-site-vault-case-intake-SC-35` | Case added | `grade10-site-vault-case-intake-US6-TC6-1` |
| `grade10-site-vault-case-intake-SC-37` | Case added | `grade10-site-vault-case-intake-US6-TC7-1`, Q19 and Q53: removal on any unsent draft of the collector's own |
| `grade10-site-vault-case-intake-SC-38` | Case added | `grade10-site-vault-case-intake-US6-TC7-1`'s fourth step |

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journey, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Collector Pages and Items PRD pages, and the durable case-intake suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md` and the operator-queue delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-case-intake-US1-TC22-1` into `grade10-site-vault-case-intake-SC-39`; `grade10-site-vault-case-intake-US1-TC23-1` into `grade10-site-vault-case-intake-SC-40`, gaining the register's description left unchanged as Q47
- **Patched, not re-run** - `grade10-site-vault-case-intake-US1-TC23-1` tried the grader, grade and cert on the collector's Describe step, which carries no such field; it now tries the category and the title, the two `grade10-site-vault-case-intake-SC-40` reads from the register
- **Added by QA2** - `grade10-site-vault-case-intake-US1-TC24-1` for `grade10-site-vault-case-intake-SC-41`, the worker's refusal, which the blind case reached only through the interface
- **Raised, answered by the round** - the customer's description edit on a linked draft changes the request alone (Q47, `grade10-site-vault-case-intake-SC-40`)
- **Raised, escalated** - none
- **Round 4** - `grade10-site-vault-case-intake-SC-40` and `grade10-site-vault-case-intake-SC-41` hold only for a slab the register holds under the customer at the counter, the one the walk-in form fills; `grade10-site-vault-case-intake-US1-TC23-1` and `grade10-site-vault-case-intake-US1-TC24-1` now say so
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-01 has a case for each of the three scenarios; the modified requirement's other scenarios keep their durable cases

**Run:** QA2, 2026-10-02. QA1's blind pass read only the capability's `## Purpose` and `## Feature set` with the change's leaf, the US-01 journey, `proposal.md`, `decisions.md` with Q1 to Q7, the Collector Pages and Operator Console manual pages, and the durable suite's US1 section and `## Settled`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, the code and `openspec/changes/archive/`. It wrote `grade10-site-vault-case-intake-US1-TC25-1` and `grade10-site-vault-case-intake-US1-TC26-1`, and raised one question with the operator queue, landed as Q10. After it ran, Q11 moved the rule from the facts table to the lane requirement, where `grade10-site-vault-case-intake-SC-42` sits; these are non-anchor clarifications. QA2 read QA1's suites, both delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites of both capabilities, and grade10's `RequestWizard.tsx`, `refusalOfDetails` in `details.ts`, `requestModule.test.ts`, `intakeInputSchema` and `positiveMinorAmount` in `packages/vault/contracts/src/schemas.ts`, `schemas.test.ts`, the cases router's `create` and `request.spec.ts`. It is a statement, not proof.

- **Raised, answered** - Q10, raised with the operator queue: an amount finer than the currency's smallest unit is never rounded to zero. Q10 decides the console's money field; the wizard's loan field does not take such an amount at all, as it takes no zero, and `## Settled` carries that for this suite. The operator queue's suite records the console's rows
- **Raised, escalated** - none
- **Raised, rejected** - none
- **Revised** - none
- **Joined** - `grade10-site-vault-case-intake-SC-42`, the lane requirement's more-than-zero rule and the Feature set's A loan of more than zero leaf into `grade10-site-vault-case-intake-US1-TC25-1` on the wizard and `grade10-site-vault-case-intake-US1-TC26-1` at the worker
- **Corrected** - `grade10-site-vault-case-intake-US1-TC25-1` typed a zero the wizard's loan field never takes: the field stays empty, and Continue is refused because a loan is chosen with no amount, in the words of `financingNotPositive`. Step 3 now reads the empty field. Its result said the refusal names both ways on, a phrase the conventions keep out of a case; it reads the refusal asking how much, or for storage only. No draft on the collector's list needed a step to look; it reads the Describe step held and nothing sent. `grade10-site-vault-case-intake-US1-TC26-1` read only that the amount is refused; `grade10-site-vault-case-intake-SC-42` refuses by name, so step 2 reads the bad-request answer naming the financing amount
- **Added by QA2** - `grade10-site-vault-case-intake-US1-TC25-1` steps 5 and 6: storage only from the refused step moves on, as the refusal says and the leaf states, storage asked for by leaving the amount out
- **Contradicted** - none: both QA1 cases agree with the lane requirement and the worker's `positiveMinorAmount`
- **Uncovered anchors** - none: `grade10-site-vault-case-intake-SC-42` by `grade10-site-vault-case-intake-US1-TC25-1` and `grade10-site-vault-case-intake-US1-TC26-1`; the Feature set's new leaf by the same two and, for storage asked for by leaving the amount out, the durable `grade10-site-vault-case-intake-US1-TC2-1`. `grade10-site-vault-case-intake-SC-05` and `grade10-site-vault-case-intake-SC-06` stand unchanged under the rewritten requirement, by the durable `grade10-site-vault-case-intake-US1-TC1-1` and `grade10-site-vault-case-intake-US1-TC2-1`

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts`, `cases/intake.ts`, `legalCopy.ts` and the intake tests. It is a statement, not proof.

- **Raised, folded into spec** - a sent request takes no edit to its facts, from `grade10-site-vault-case-intake-US4-TC11-1`, as `grade10-site-vault-case-intake-SC-43` under the request requirement, cited in task 2.2
- **Raised, escalated** - a send naming a stale statement version, landed as Q17, refused by name
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run walked the wizard, the case list or the case page: `grade10-site-vault-case-intake-US1-TC1-2`, `grade10-site-vault-case-intake-US1-TC2-2`, `grade10-site-vault-case-intake-US1-TC3-2`, `grade10-site-vault-case-intake-US1-TC4-2`, `grade10-site-vault-case-intake-US1-TC5-2`, `grade10-site-vault-case-intake-US1-TC6-2`, `grade10-site-vault-case-intake-US1-TC7-2`, `grade10-site-vault-case-intake-US1-TC8-2`, `grade10-site-vault-case-intake-US1-TC9-2`, `grade10-site-vault-case-intake-US1-TC10-2`, `grade10-site-vault-case-intake-US1-TC11-2`, `grade10-site-vault-case-intake-US1-TC14-2`, `grade10-site-vault-case-intake-US1-TC15-2`, `grade10-site-vault-case-intake-US1-TC16-2`, `grade10-site-vault-case-intake-US1-TC17-2`, `grade10-site-vault-case-intake-US1-TC18-2`, `grade10-site-vault-case-intake-US1-TC19-2`, `grade10-site-vault-case-intake-US4-TC1-2`, `grade10-site-vault-case-intake-US4-TC2-2`, `grade10-site-vault-case-intake-US4-TC4-2`, `grade10-site-vault-case-intake-US4-TC6-2`, `grade10-site-vault-case-intake-US5-TC1-2`, `grade10-site-vault-case-intake-US5-TC5-2`, `grade10-site-vault-case-intake-US5-TC6-2`, `grade10-site-vault-case-intake-US5-TC8-2`, `grade10-site-vault-case-intake-US6-TC1-2`, `grade10-site-vault-case-intake-US6-TC2-2`, `grade10-site-vault-case-intake-US6-TC3-2`, `grade10-site-vault-case-intake-US6-TC4-2`, `grade10-site-vault-case-intake-US6-TC5-2`, `grade10-site-vault-case-intake-US6-TC6-2`, `grade10-site-vault-case-intake-US6-TC7-2`; `grade10-site-vault-case-intake-US1-TC23-2` drops the try-a-change step a screen held and reads the register in the console
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-case-intake-US1-TC22-1`, `grade10-site-vault-case-intake-US1-TC25-1`, `grade10-site-vault-case-intake-US4-TC3-1`, `grade10-site-vault-case-intake-US4-TC5-1`, `grade10-site-vault-case-intake-US4-TC7-1`, `grade10-site-vault-case-intake-US5-TC7-1`; the worker's refusal of a zero loan stays with `grade10-site-vault-case-intake-US1-TC26-1`, and an unsent request with `grade10-site-vault-case-intake-US1-TC15-2`
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US1-TC27-1` into `grade10-site-vault-case-intake-US1-TC3-2`; `US1-TC28-1` into `grade10-site-vault-case-intake-US1-TC4-2` and `grade10-site-vault-case-intake-US1-TC18-2`; `US1-TC29-1` into `grade10-site-vault-case-intake-US1-TC15-2`; `US4-TC8-1` into `grade10-site-vault-case-intake-US4-TC2-2`; `US4-TC9-1` into `grade10-site-vault-case-intake-US4-TC1-2`; `US4-TC10-1` into `grade10-site-vault-case-intake-US4-TC4-2`; `US4-TC12-1` into `grade10-site-vault-case-intake-US4-TC6-2`; `US5-TC9-1` into `grade10-site-vault-case-intake-US5-TC1-2` and `grade10-site-vault-case-intake-US5-TC5-2`; `US5-TC10-1` into `grade10-site-vault-case-intake-US5-TC6-2`; `US6-TC8-1` into `grade10-site-vault-case-intake-US6-TC2-2`; `US6-TC9-1` into `grade10-site-vault-case-intake-US6-TC1-2`; `US6-TC10-1` into `grade10-site-vault-case-intake-US6-TC3-2`; `US6-TC11-1` into `grade10-site-vault-case-intake-US6-TC5-2`
- **Joined** - `grade10-site-vault-case-intake-SC-15` into `grade10-site-vault-case-intake-US4-TC2-2`; `grade10-site-vault-case-intake-SC-16`, `-SC-17`, `-SC-18` into `grade10-site-vault-case-intake-US4-TC1-2` and `grade10-site-vault-case-intake-US4-TC4-2`; `grade10-site-vault-case-intake-SC-31` into `grade10-site-vault-case-intake-US4-TC6-2`; `grade10-site-vault-case-intake-SC-19` to `-SC-23` into `grade10-site-vault-case-intake-US5-TC1-2` and `grade10-site-vault-case-intake-US5-TC5-2`; `grade10-site-vault-case-intake-SC-24` into `grade10-site-vault-case-intake-US1-TC3-2`; `grade10-site-vault-case-intake-SC-25`, `-SC-26` into `grade10-site-vault-case-intake-US1-TC4-2` and `grade10-site-vault-case-intake-US1-TC18-2`; `grade10-site-vault-case-intake-SC-27` into `grade10-site-vault-case-intake-US5-TC6-2`; `grade10-site-vault-case-intake-SC-01` into `grade10-site-vault-case-intake-US1-TC15-2`; `grade10-site-vault-case-intake-SC-32` to `-SC-35` into `grade10-site-vault-case-intake-US6-TC1-2` to `grade10-site-vault-case-intake-US6-TC7-2`
- **Contradicted** - none
- **Uncovered anchors** - none: every journey this delta serves has a case; `grade10-site-vault-case-intake-SC-39` is the contracts' schema test (task 2.2)
- **Automated cases re-versioned** - `grade10-site-vault-case-intake-US1-TC1-2`, `grade10-site-vault-case-intake-US1-TC2-2`, `grade10-site-vault-case-intake-US1-TC6-2`, `grade10-site-vault-case-intake-US1-TC7-2`, `grade10-site-vault-case-intake-US1-TC8-2`, `grade10-site-vault-case-intake-US1-TC9-2`, `grade10-site-vault-case-intake-US1-TC14-2`, `grade10-site-vault-case-intake-US1-TC16-2`, `grade10-site-vault-case-intake-US4-TC1-2`, `grade10-site-vault-case-intake-US5-TC8-2`, `grade10-site-vault-case-intake-US6-TC1-2`, `grade10-site-vault-case-intake-US6-TC3-2`, `grade10-site-vault-case-intake-US6-TC4-2`, `grade10-site-vault-case-intake-US6-TC5-2`, `grade10-site-vault-case-intake-US6-TC6-2` were decided by `request.spec.ts` or `walk-in.spec.ts` at `-1`; each is `manual` until task 4.4 retitles its API walk and flips it

### Manual

| Manual | Why |
| --- | --- |
| `US1-TC1-1` | The financed walk is driven once on a phone, because the photograph step is a camera and a file picker before it is a request |
| `US4-TC1-1` | Whether the step reads the request back as the collector wrote it is a person's reading, not an assertion |
| `US4-TC2-1` | Edit per block and the way back is walked, so the rest of the request is seen to survive it |
| `US4-TC3-1` | The What happens next wording is read for what it promises the shop will do |
| `US4-TC5-1` | The statement page is opened outside production to read the being-prepared wording |
| `US5-TC1-1` | The reference is read aloud from the Sent step and the card — legibility is the point of the alphabet |
| `US5-TC6-1` | Start another request is walked to see the case just sent left where it was |
| `grade10-site-vault-case-intake-US6-TC2-1` | A person changes staff's facts and photographs before the send; the walk-in walk sends them as staff typed them |
| `grade10-site-vault-case-intake-US6-TC7-1` | The walk proves the removal and that a sent request keeps its photographs; a person reads the refusal's words |
