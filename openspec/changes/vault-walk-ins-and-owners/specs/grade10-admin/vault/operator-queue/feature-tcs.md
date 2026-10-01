# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-admin-vault-operator-queue-US2: Operator finds the case of the person at the counter

**As a** member of shop staff,
**I want** to find a case by the customer's number, address or case id,
**so that** somebody standing in front of me is served without my being able to walk the whole customer list.

### grade10-admin-vault-operator-queue-US2-TC7-1: Reading the queue leaves no audit entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/console.spec.ts`

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) is on <grade10 admin vault queue url>, the queue not narrowed to a collector, and no search has been run this session.

**Steps:**

1. Open a queue view and read its rows.
2. Read the case audit trail for the entries written since step 1.

**Expected Results:**

* No audit entry is written for the read.
* Only a search, or a list that names collectors or is narrowed to one, leaves a trail.

---

## grade10-admin-vault-operator-queue-US10: Operator opens a case for a customer at the counter

**As a** member of shop staff with a customer and their item in front of me,
**I want** to open the case myself from their email, the item and my own
photos,
**so that** a customer with no request on their phone is served on the spot,
and the draft waits for them to send it.

### grade10-admin-vault-operator-queue-US10-TC1-1: A walk-in for a new address opens a draft under a new account

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* No account exists for `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.new+<run id>@example.com` |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |
| Amount | 500000 (HKD, minor units) |
| Photos | two JPEG photographs, each under 20 MB |

**Steps:**

1. Click Open a walk-in in the queue's header.
2. Read the collection statement the form shows.
3. Fill in the email, category, title, description and amount from **Test data**.
4. Attach the two photographs.
5. Click Open case.
6. Open the Drafts view of the queue.

**Expected Results:**

* Step 5 opens the new draft on its own page, `admin.grade10.com/vault/cases/<case id>`.
* The draft is on the financed lane, in HKD, with the facts and two photographs from **Test data**.
* The draft offers Cancel, and nothing to value and no visit to book.
* The case header carries The collector's cases.
* Step 6 lists the draft as any draft reads there.
* The draft's collector reads as the handle of `<walk-in email>`; no name was asked for on the form.

### grade10-admin-vault-operator-queue-US10-TC2-1: A walk-in for an address nobody has signed in to opens under that account and renames nothing

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* `<account_1>`: an account for `<walk-in email>` that nobody has ever signed in to, carrying the name `<held name>`, with no vault case.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | the address of `<account_1>` |
| `<held name>` | Chan Tai Man |
| Category | Trading card |
| Title | Pikachu Illustrator |
| Description | Graded, slab intact. |
| Amount | none (storage lane) |
| Photos | one PNG photograph |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form from **Test data** and attach the photograph.
3. Click Open case.
4. Open `<account_1>`'s collector page from the draft's header.

**Expected Results:**

* Step 3 opens the draft on the storage lane.
* The draft belongs to `<account_1>`; no second account is created for `<walk-in email>`.
* `<account_1>` still carries the name `<held name>`.
* Step 4 lists the draft among `<account_1>`'s vault cases.

### grade10-admin-vault-operator-queue-US10-TC3-1: The statement is shown before the address and the open keeps its version

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, with the collection statement written at version `<statement version>`.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Read what the form shows before the email field.
3. Fill in the form for `<walk-in email>` with one photograph and click Open case.
4. Read the new draft's history on its page.

**Expected Results:**

* Step 2 shows the collection statement before the email can be typed.
* The draft records that the statement was shown at the counter, at `<statement version>`.
* The draft records no tick by the collector; the collector's own tick is still owed at the send.

### grade10-admin-vault-operator-queue-US10-TC4-1: Production refuses a walk-in while the collection statement is unwritten

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url> in production, with no collection statement text written.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<walk-in email>` with one photograph.
3. Click Open case.

**Expected Results:**

* The open is refused by name, saying the collection statement is not yet written.
* No draft is opened, and no account is created for `<walk-in email>`.
* Nothing is emailed to `<walk-in email>`.

### grade10-admin-vault-operator-queue-US10-TC5-1: Outside production an unwritten statement reads Being prepared and the walk-in opens

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url> in staging, with no collection statement text written.
* No account exists for `<walk-in email>`.

**Steps:**

1. Click Open a walk-in.
2. Read the statement the form shows.
3. Fill in the form for `<walk-in email>` with one photograph and click Open case.

**Expected Results:**

* Step 2 reads "Being prepared".
* Step 3 opens the draft on its own page.

### grade10-admin-vault-operator-queue-US10-TC6-1: A walk-in for an address someone has signed in to is refused

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* `<account_2>`: an account for `<signed-in email>` that its owner has signed in to at least once, carrying the name `<held name>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<signed-in email>` | the address of `<account_2>` |
| `<held name>` | Wong Siu Ming |
| Title | Blastoise Base Set |
| Photos | one JPEG photograph |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<signed-in email>` from **Test data** and attach the photograph.
3. Click Open case.

**Expected Results:**

* A notice says the address has signed in before, and that this customer sends the request from their own phone.
* The notice names nothing else about the account: not `<held name>`, not its cases.
* The form keeps the email, the facts and the photograph typed.
* No draft is opened under `<account_2>`, and nothing is emailed to `<signed-in email>`.

### grade10-admin-vault-operator-queue-US10-TC7-1: A walk-in counts against the account's three unsent drafts

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The account for `<walk-in email>` has nobody signed in to it and holds the unsent drafts in the row.

**Test data:**

| Unsent drafts already held | Outcome |
| --- | --- |
| two drafts staff opened | the draft opens; the account now holds three |
| three drafts staff opened | refused with the draft cap's refusal; no draft opens |
| three drafts, then one of them sent by its collector | the draft opens |

**Steps:**

1. Click Open a walk-in.
2. Fill in the form for `<walk-in email>` with one photograph.
3. Click Open case.

**Expected Results:**

* The outcome matches the row.
* A refusal reads as the cap's own refusal, not a walk-in refusal of its own.

### grade10-admin-vault-operator-queue-US10-TC8-1: Opening a walk-in emails nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, outside production, with the collection statement written.
* `<walk-in email>` is a mailbox the tester reads, with no account behind it.

**Steps:**

1. Open a walk-in for `<walk-in email>` with one photograph.
2. Wait <mail delivery window>.
3. Read `<walk-in email>`'s inbox.
4. Read the draft's page for a parked or owed message.

**Expected Results:**

* Step 3 finds no message about the case: no case, no reference, no sign-in link.
* Step 4 shows no message owed or parked for the draft.

### grade10-admin-vault-operator-queue-US10-TC9-1: Photos on the walk-in form count to ten and can be removed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>.

**Test data:**

| Field | Value |
| --- | --- |
| Photos | eleven JPEG photographs, each under 20 MB |

**Steps:**

1. Attach ten photographs.
2. Attach the eleventh.
3. Remove one photograph.

**Expected Results:**

* Step 1 shows the ten in the gallery, reading 10 of 10.
* Step 2 is refused at the limit; the gallery still holds ten.
* Step 3 leaves nine, reading 9 of 10.

### grade10-admin-vault-operator-queue-US10-TC10-1: The worker's refusal of a field reads beside that field

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* Every field but the row's is filled in validly, with one photograph.

**Test data:**

| Field | Value | Refused beside |
| --- | --- | --- |
| Email | `not-an-address` | Email |
| Title | 201 characters | Title |
| Description | 2,001 characters | Description |

**Steps:**

1. Enter the row's value.
2. Click Open case.

**Expected Results:**

* Open case is refused, the refusal in words beside the field in the row.
* The rest of the form keeps what was typed.
* No draft opens.

### grade10-admin-vault-operator-queue-US10-TC11-1: Opening holds the form and opens one draft

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form filled in validly for `<walk-in email>`, with no account behind it, and the open is held pending by a slowed response.

**Steps:**

1. Click Open case.
2. Click Open case again while the first is pending.
3. Let the response land.
4. Open the Drafts view.

**Expected Results:**

* Step 1 shows Open case pending and the form held.
* Step 2 sends nothing more.
* Step 4 lists one draft for `<walk-in email>`.

### grade10-admin-vault-operator-queue-US10-TC12-1: Only an operate holder can open a walk-in

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* The row's actor is on <grade10 admin vault queue url>, or calls the walk-in open directly where the row says so.

**Test data:**

| Actor | Open a walk-in shown | A direct walk-in call |
| --- | --- | --- |
| admin(staff, holds vault:operate) | yes | opens the draft |
| admin(admin) | yes | opens the draft |
| admin(treasurer, holds vault:read and vault:payout) | no | refused for the missing grant |
| admin(holds vault:read only) | no | refused for the missing grant |
| customer(collector), signed in on the site | no console | refused |
| signed out | the console's sign-in | refused |

**Steps:**

1. Read the queue's header.
2. Send a walk-in open for a fresh address with one photograph, by the console where shown, else by a direct call.

**Expected Results:**

* Step 1 matches the row's Open a walk-in shown.
* Step 2 matches the row's direct call; a refusal opens no draft and creates no account.

### grade10-admin-vault-operator-queue-US10-TC13-1: A walk-in opens with no photograph and the send still needs one

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on <grade10 admin vault queue url>, and no account answers to `tai.man@example.com`.

**Steps:**

1. Open a walk-in for `tai.man@example.com` with category Trading card, title `Charizard PSA 10` and no photograph.
2. As the customer, signed in at `tai.man@example.com`, open the draft and send it.

**Expected Results:**

* Step 1 opens the draft, and the form asked for no contact number.
* Step 2 is refused until the draft holds a photograph.

### grade10-admin-vault-operator-queue-US10-TC14-1: Staff photograph only an unsent draft staff opened

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate) holds a verified console session.
* `<case_1>` is a request its collector sent; `<case_2>` is an unsent draft staff opened.

**Steps:**

1. Attach a photograph to `<case_1>`.
2. Attach a photograph to `<case_2>`.

**Expected Results:**

* Step 1 is refused by name, and `<case_1>` is unchanged.
* Step 2 attaches the photograph to `<case_2>`.

---

## grade10-admin-vault-operator-queue-US11: Operator reads whose case it is by name

**As a** member of shop staff,
**I want** the queue and the held items to name each case's collector,
**so that** I can greet the customer and tell two customers' cases apart
without opening each one.

### grade10-admin-vault-operator-queue-US11-TC1-1: Queue and held-item rows name each case's collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds two cases in the row's list; `<collector_B>`, named Lee Ka Yan, holds one.

**Test data:**

| List |
| --- |
| the Needs staff view |
| the Held items tab |

**Steps:**

1. Open the row's list.
2. Read the collector on each of the three rows.

**Expected Results:**

* Both of `<collector_A>`'s rows read Chan Tai Man; `<collector_B>`'s reads Lee Ka Yan.
* Each name narrows the list to its collector, and a link beside it opens that collector's page.
* The rest of each row reads as before.

### grade10-admin-vault-operator-queue-US11-TC2-1: An account the walk-in created reads by its email handle until the customer names themselves

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* A walk-in draft sits under an account the walk-in created for `mei.ling.walkin@example.com`, nobody signed in to it yet.

**Steps:**

1. Open the Drafts view and read the draft's collector.
2. As the customer, sign in at `grade10.com/vault` with that address and set the account's name to Ho Mei Ling.
3. Reload the Drafts view and read the draft's collector.

**Expected Results:**

* Step 1 reads `mei.ling.walkin`.
* Step 3 reads Ho Mei Ling, with no change made on the case.

### grade10-admin-vault-operator-queue-US11-TC3-1: A name the account service cannot answer reads as unavailable and the list stands

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
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, the Needs staff view holding cases of several collectors.
* The account service fails to answer names.

**Steps:**

1. Open the Needs staff view.
2. Open the Held items tab.

**Expected Results:**

* Every row's collector reads the account's short id and "name unavailable".
* Every other field on every row reads as it does with names answered, and both lists load in full.
* Following a row's short id narrows the list to that collector and offers the link to their collector page.

### grade10-admin-vault-operator-queue-US11-TC4-1: A reader without the identity grant sees no collector column

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* The row's actor is on <grade10 admin vault queue url>, with cases of several collectors in the Needs staff view and the Held items tab.

**Test data:**

| Actor |
| --- |
| admin(treasurer, holds vault:read and vault:payout) |
| admin(holds vault:read only) |

**Steps:**

1. Open the Needs staff view.
2. Open the Held items tab.
3. Read each list's response in the browser's network panel.

**Expected Results:**

* Neither list carries a collector column, a name or a name link.
* Every other field reads as before this change.
* The read carries no collector name.

### grade10-admin-vault-operator-queue-US11-TC5-1: The collector-name read refuses a caller without the identity grant

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
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) holds a verified console session.
* `<case_1>` is a case of a collector with a name.

**Steps:**

1. Call the collector-name read for `<case_1>` directly.

**Expected Results:**

* The call is refused for the missing identity grant.
* No name comes back.

### grade10-admin-vault-operator-queue-US11-TC6-1: The overdue rows keep the reference and the contact, with no name

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and a live loan of a named collector is past its due date.

**Steps:**

1. Open the Overdue view.

**Expected Results:**

* The row names the case reference, the item and the contact the case holds.
* The row names no collector.

### grade10-admin-vault-operator-queue-US11-TC7-1: A list that names collectors is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-11

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and the Needs staff view holds cases of two named collectors.

**Steps:**

1. Open the Needs staff view.
2. Read the audit chain for entries written since step 1.

**Expected Results:**

* One entry records who read the names, when, and both collectors' ids.
* Neither collector's name nor email appears in any column of it.

---

## grade10-admin-vault-operator-queue-US12: Operator narrows the queue to one collector's cases

**As a** member of shop staff,
**I want** a collector's name to narrow the queue and the held items to that
collector,
**so that** I can see everything one customer has with us without being able
to search the customer list by name.

### grade10-admin-vault-operator-queue-US12-TC1-1: A collector's name narrows the list to that collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds two cases in the row's list; two other collectors hold one each.

**Test data:**

| List |
| --- |
| the Needs staff view |
| the Held items tab |

**Steps:**

1. Open the row's list.
2. Click Chan Tai Man on one of `<collector_A>`'s rows.
3. Read the list and the address bar.
4. Click the control that clears the collector.

**Expected Results:**

* Step 3 lists only `<collector_A>`'s two rows, with Chan Tai Man above them and a count of 2.
* The address carries `<collector_A>`'s user id.
* Step 4 lists all four rows again and the address no longer carries the collector.

### grade10-admin-vault-operator-queue-US12-TC2-1: A narrowed address opened afresh narrows the same way

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
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) holds `<narrowed url>`, the Needs staff view narrowed to `<collector_A>`, copied from a prior session.
* `<collector_A>` holds two cases in the Needs staff view.

**Steps:**

1. Open `<narrowed url>` in a new tab.

**Expected Results:**

* The view lists only `<collector_A>`'s two rows, with their name above them and a count of 2.

### grade10-admin-vault-operator-queue-US12-TC3-1: A collector with nothing in the narrowed list reads none

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_C>` holds one submitted case and no item in the vault.

**Steps:**

1. In the Needs staff view, click `<collector_C>`'s name.
2. Open the Held items tab narrowed to `<collector_C>`.

**Expected Results:**

* Step 2 says the collector holds no case in this list, with their name above and a count of 0.
* The control clearing the collector is still offered.

### grade10-admin-vault-operator-queue-US12-TC4-1: The queue offers no way to find a collector by name

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
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man, holds a case in the Needs staff view.

**Steps:**

1. Look for a field taking a collector or a name on the queue and the Held items tab.
2. Type `Chan Tai Man` into the queue's search and search.

**Expected Results:**

* Step 1 finds no field to type a collector into.
* Step 2 finds no case.

### grade10-admin-vault-operator-queue-US12-TC5-1: Reading one collector's cases is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and `<collector_A>` holds a case in the Needs staff view.

**Steps:**

1. Click `<collector_A>`'s name.
2. Read the audit chain for entries written since step 1.

**Expected Results:**

* One entry records who read `<collector_A>`'s cases, when, and `<collector_A>`'s id.
* No name or email appears in any column of it.

### grade10-admin-vault-operator-queue-US12-TC6-1: An address narrowed to nobody reads as a collector holding no case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.

**Test data:**

| Collector in the address |
| --- |
| a well-formed user id no account holds |
| `not-a-user-id` |

**Steps:**

1. Open the queue at an address narrowed to the row's collector.

**Expected Results:**

* Every cut says the collector holds no case in it, and every count reads none.

### grade10-admin-vault-operator-queue-US12-TC7-1: The Overdue view stays whole while the queue is narrowed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-12

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url> narrowed to `<collector_A>`.
* Loans of `<collector_A>` and `<collector_B>` are both past due.

**Steps:**

1. Open the Overdue view.
2. Search for `<collector_B>`'s phone number.

**Expected Results:**

* Step 1 lists both overdue loans, and no row names a collector.
* Step 2 finds `<collector_B>`'s case, and its result names no collector.

## Settled

- A typed address is matched to its account whatever its capitals and the spaces around it, so retyping a signed-in address never opens a second account beside it.
- An address someone has signed in to is one a sign-in has verified; a sign-in link asked for and never opened is not one.
- Opening a walk-in sends nothing to anybody, the account's creation included.
- A walk-in's photographs are held to the intake's photograph rules: at most ten JPEG, PNG or WebP photographs, each within 20 MB, their location stripped.
- The overdue rows keep the case reference and the contact and name nobody; the money book owns them and this change leaves them as they stand.
- The rows a treasurer reads with no collector column are the queue's, walked under the queue's own journey for the names.

## Reconciliation

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote 24 cases over three journeys and raised eleven questions for this capability; the scenario pass issued `grade10-admin-vault-operator-queue-SC-55` to `grade10-admin-vault-operator-queue-SC-73`, retired grade10-admin-vault-operator-queue-SC-20, and carried `grade10-admin-vault-operator-queue-SC-12` and `grade10-admin-vault-operator-queue-SC-13` in its MODIFIED block. Three scenarios were folded here, `grade10-admin-vault-operator-queue-SC-74` to `grade10-admin-vault-operator-queue-SC-76`.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-vault-operator-queue-US10-TC1-1` | Joined | `grade10-admin-vault-operator-queue-SC-55`, with the handle `grade10-admin-vault-operator-queue-SC-64` states; the header's link is `grade10-admin/console/collector-page`'s |
| `grade10-admin-vault-operator-queue-US10-TC2-1` | Joined | `grade10-admin-vault-operator-queue-SC-56` and `grade10-admin-vault-operator-queue-SC-65` |
| `grade10-admin-vault-operator-queue-US10-TC3-1` | Joined | `grade10-admin-vault-operator-queue-SC-58`; the collector's own tick is still owed at the send, `grade10-site-vault-case-intake-SC-34` |
| `grade10-admin-vault-operator-queue-US10-TC4-1` | Joined | `grade10-admin-vault-operator-queue-SC-59` |
| `grade10-admin-vault-operator-queue-US10-TC5-1` | Joined | `grade10-admin-vault-operator-queue-SC-60` |
| `grade10-admin-vault-operator-queue-US10-TC6-1` | Joined | `grade10-admin-vault-operator-queue-SC-57` |
| `grade10-admin-vault-operator-queue-US10-TC7-1` | Joined | `grade10-admin-vault-operator-queue-SC-61`; the row freeing a place on a send reads the cap requirement's own sentence in `grade10-site/vault/case-intake` |
| `grade10-admin-vault-operator-queue-US10-TC8-1` | Joined | `grade10-admin-vault-operator-queue-SC-55`, nothing emailed to anybody |
| `grade10-admin-vault-operator-queue-US10-TC9-1` | Folded | `grade10-admin-vault-operator-queue-SC-75`: the walk-in requirement holds the photographs to the intake's rules, Q37, and no scenario walked the limit |
| `grade10-admin-vault-operator-queue-US10-TC10-1` | Folded | `grade10-admin-vault-operator-queue-SC-76`: the requirement's refusal table refuses any fact the intake refuses and keeps the form, and no scenario walked it |
| `grade10-admin-vault-operator-queue-US10-TC11-1` | Joined | `grade10-admin-vault-operator-queue-SC-62` for the one draft; the pending form is the ui-design Opening row's, out of suite on the `WalkInDialog` story |
| `grade10-admin-vault-operator-queue-US10-TC12-1` | Joined | `grade10-admin-vault-operator-queue-SC-63`; the customer and signed-out rows read the console's own sign-in, unchanged |
| `grade10-admin-vault-operator-queue-US11-TC1-1` | Joined | `grade10-admin-vault-operator-queue-SC-66` and `grade10-admin-vault-operator-queue-SC-67`; the link beside the name is `grade10-admin-console-collector-page-SC-03` |
| `grade10-admin-vault-operator-queue-US11-TC2-1` | Joined | `grade10-admin-vault-operator-queue-SC-64` and `grade10-admin-vault-operator-queue-SC-68` |
| `grade10-admin-vault-operator-queue-US11-TC3-1` | Joined | `grade10-admin-vault-operator-queue-SC-69`, the short id narrowing and linking, Q41 |
| `grade10-admin-vault-operator-queue-US11-TC4-1` | Joined | `grade10-admin-vault-operator-queue-SC-70`; which journey owns it was settled as Q48 |
| `grade10-admin-vault-operator-queue-US11-TC5-1` | Joined | `grade10-admin-vault-operator-queue-SC-70`, the names refused by name |
| `grade10-admin-vault-operator-queue-US11-TC6-1` | Joined | the money book's durable requirement *The arrears list every live loan past its due date*, which names no collector and which this change leaves as it stands under Q3 |
| `grade10-admin-vault-operator-queue-US11-TC7-1` | Joined | `grade10-admin-vault-operator-queue-SC-81`; Q38 and Q55 record a page of names by ids, never names |
| `grade10-admin-vault-operator-queue-US12-TC1-1` | Joined | `grade10-admin-vault-operator-queue-SC-71` and `grade10-admin-vault-operator-queue-SC-72` |
| `grade10-admin-vault-operator-queue-US12-TC2-1` | Joined | `grade10-admin-vault-operator-queue-SC-72` |
| `grade10-admin-vault-operator-queue-US12-TC3-1` | Joined | `grade10-admin-vault-operator-queue-SC-73`: the held items narrowed to a collector holding none read as a cut holding none |
| `grade10-admin-vault-operator-queue-US12-TC4-1` | Joined | `grade10-admin-vault-operator-queue-SC-72` for no field to type a collector; a name finds no case by the durable search rule, exact on a contact and prefix on an id, Q5 |
| `grade10-admin-vault-operator-queue-US12-TC5-1` | Joined | `grade10-admin-vault-operator-queue-SC-82`, Q38 and Q55 |
| `grade10-admin-vault-operator-queue-SC-77` | Case added | `grade10-admin-vault-operator-queue-US12-TC6-1`, Q40 |
| `grade10-admin-vault-operator-queue-SC-78` | Case added | `grade10-admin-vault-operator-queue-US12-TC7-1`, Q39 |
| `grade10-admin-vault-operator-queue-SC-79` | Case added | `grade10-admin-vault-operator-queue-US10-TC13-1`, Q32 and Q54 |
| `grade10-admin-vault-operator-queue-SC-80` | Case added | `grade10-admin-vault-operator-queue-US10-TC14-1`: staff edit only an unsent draft staff opened, the rule the removed requirement held |
| `grade10-admin-vault-operator-queue-SC-09` | Modified | a list that names nobody records nothing; the durable `grade10-admin-vault-operator-queue-US2-TC7-1` still holds, its reader holding the vault read grant alone |
| `grade10-admin-vault-operator-queue-US2-TC7-1` | Modified at the acceptance review | its reader is now a treasurer on an unnarrowed queue, as `grade10-admin-vault-operator-queue-SC-09` reads, which shows no name, and its last line names the lists that do leave a trail |
| grade10-admin-vault-operator-queue-SC-20 | Retired | its requirement is removed for the walk-in, Q10; no case in the durable suite walked it, so none is deprecated |
| Raised: the fields and the photograph a walk-in needs to open | Settled | Q32; `grade10-admin-vault-operator-queue-SC-79` |
| Raised: an address in other capitals or with spaces | Settled, folded | Q33; `grade10-admin-vault-operator-queue-SC-74` walks a signed-in address retyped in capitals |
| Raised: what counts as signed in | Settled | Q34; no scenario beyond `grade10-admin-vault-operator-queue-SC-57` and `grade10-admin-vault-operator-queue-SC-56` |
| Raised: an email from the account's creation | Settled | Q35; `grade10-admin-vault-operator-queue-SC-55` already reads nothing emailed to anybody |
| Raised: how the statement shows it came first | Settled | Q36; `grade10-admin-vault-operator-queue-SC-58` |
| Raised: the walk-in's photograph limits | Settled, folded | Q37; `grade10-admin-vault-operator-queue-SC-75` |
| Raised: the audit entry for a named list | Settled | Q38 and Q55; `grade10-admin-vault-operator-queue-SC-81` and `grade10-admin-vault-operator-queue-SC-82` |
| Raised: how far the narrowing reaches | Settled | Q39; `grade10-admin-vault-operator-queue-SC-78` |
| Raised: a treasurer's or an unknown narrowed address | Settled | Q40; `grade10-admin-vault-operator-queue-SC-77` |
| Raised: the short id when a name is unavailable | Settled | Q41; `grade10-admin-vault-operator-queue-SC-69` |
| Raised: the collector page's control narrowing the queue | Settled | Q42; `grade10-admin-console-collector-page-SC-19` |
| Dev: no photograph needed to open a walk-in | Settled | Q32 |
| Dev: an audit entry for narrowing to one collector | Settled | Q38 |
| Dev: narrowing the Overdue view or search | Settled | Q39 |
| Dev: the short id's shape | Settled | Q50 |
| Design: Closed, Statement first, Empty, Opened, Signed-in address, Named, Name unavailable, Treasurer, Narrowed, Narrowed none | Closed on the row | `ui-design.md` names `grade10-admin-vault-operator-queue-SC-63`, `grade10-admin-vault-operator-queue-SC-58`, `grade10-admin-vault-operator-queue-SC-55`, `grade10-admin-vault-operator-queue-SC-57`, `grade10-admin-vault-operator-queue-SC-66`, `grade10-admin-vault-operator-queue-SC-69`, `grade10-admin-vault-operator-queue-SC-70`, `grade10-admin-vault-operator-queue-SC-71` and `grade10-admin-vault-operator-queue-SC-73` |
| Design: Photos added, Refused otherwise | Closed on the row | now `grade10-admin-vault-operator-queue-SC-75` and `grade10-admin-vault-operator-queue-SC-76`, the scenarios folded here |
