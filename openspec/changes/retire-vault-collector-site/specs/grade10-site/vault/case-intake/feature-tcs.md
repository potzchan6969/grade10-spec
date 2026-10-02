# grade10-site/vault/case-intake Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

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

---

## grade10-site-vault-case-intake-US4: Collector checks the request before sending it

**As a** collector on the last step of the wizard,
**I want** to read my request back, see what happens next, and tick that I
have read the collection statement,
**so that** I send what I meant and know what I agreed to.

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

## Settled

- **A stale statement version** - a send naming a version other than the one in force is refused by name and stays unsent (Q17)
- **A walk-in draft with no screen to send it** - it waits on its own clock and ends silently until the request screen ships (Q14)

## Reconciliation

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
