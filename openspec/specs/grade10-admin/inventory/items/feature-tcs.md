# grade10-admin/inventory/items Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4
**Out of suite:** grade10-admin-inventory-items-SC-05 - grade10's inventory service and repository tests, which find no product or stock row after a register act (tasks 3.1, 5.1); grade10-admin-inventory-items-SC-06 - the ZZZ panel's surface test in grade10's `apps/admin` (tasks 10.1, 10.2); grade10-admin-inventory-items-SC-15 - `ItemFactsDialog`'s component tests and `FormDialog`'s stories (task 10.1); grade10-admin-inventory-items-SC-20 - the repository test applying each case state twice and out of order (task 4.1); grade10-admin-inventory-items-SC-21 - `tell`'s service test; no console path opens two marks in this release (task 4.1); grade10-admin-inventory-items-SC-22 - `tell`'s service test for the race, and `ItemPanel`'s component test for the slab line (tasks 4.1, 10.1); grade10-admin-inventory-items-SC-37 - the transfer service test, which sees no message sent (tasks 5.1, 5.3); grade10-admin-inventory-items-SC-39 - the transfer service test of a second send (tasks 5.1, 5.3); grade10-admin-inventory-items-SC-56 - the list's keyset test over PGlite (tasks 3.1, 5.1); grade10-admin-inventory-items-SC-66 - the retention review's gauge test (tasks 6.1, 6.3); grade10-admin-inventory-items-SC-72 - the `items.*` routers' audit declaration tests, which find ids, owner kinds and the retire code and no email, term or reason text in each entry (tasks 5.1, 5.8)

## Background

* The brand is Grade10; the custodian and the lender each have a registered name on file.
* `<grade10 admin items url>` is `admin.grade10.com/inventory/items`; `<grade10 admin item page url>` is `admin.grade10.com/inventory/items/<item id>`.
* `<grade10 admin collector page url>` is `admin.grade10.com/vault/collectors/<user id>`.

## grade10-admin-inventory-items-US1: Operator finds an item and who owns it

**As a** member of shop staff asked about one object,
**I want** to find it by its title, by its grader and cert, by its item id or
by its owner's exact email, and read its owner by name, its facts and whether
a place marks it,
**so that** I can answer who has what without opening every case.

<!-- trace:case id=g10adm.inventory-items.TC-19a rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC1-1: Items opens on marked items and a row opens its item

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<item_1>` is marked by the vault on `<case_1>`; `<item_2>` is not marked.

**Test data:**

| Field | Value |
| --- | --- |
| `<item_1>` | Trading card, PSA, grade 10, cert `<cert_1>`, owned by `<collector A>`, last edited by a named staff member |
| `<item_2>` | Watch, no grader, owned by the custodian, never marked |
| `<case_1>` | A vaulted case of `<collector A>` |

**Steps:**

1. Navigate to <grade10 admin items url>.
2. Read the row of `<item_1>`.
3. Click the row of `<item_1>`.
4. Click the case link on the place row.

**Expected Results:**

* Items opens on the marked tab; `<item_1>` is listed and `<item_2>` is not.
* The row reads title, category, grader and cert, `<collector A>` by name, and the vault as the place.
* The list shows no last-edited column.
* Step 3 opens <grade10 admin item page url> for `<item_1>`, with a back link to Items.
* The page reads category, title, description, grader, grade, cert, the owner by name, and who edited it last and when.
* The place row names the vault, `<case_1>`'s reference and its status.
* Step 4 opens `<case_1>` on the vault console.

<!-- trace:case id=g10adm.inventory-items.TC-tp4 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC2-1: The all and retired tabs list what they name

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>.
* `<item_1>` is marked by the vault, `<item_2>` is not marked, and `<item_3>` is retired as lost.

**Test data:**

| Field | Value |
| --- | --- |
| `<item_1>` | A live item marked by the vault |
| `<item_2>` | A live item no place marks |
| `<item_3>` | An item retired as lost |

**Steps:**

1. Click the tab for every item.
2. Click the tab for retired items.

**Expected Results:**

* Step 1 lists `<item_1>` and `<item_2>`, marked and not marked alike, and not `<item_3>`.
* Step 2 lists `<item_3>` with lost as why it was retired, and neither live item.

<!-- trace:case id=g10adm.inventory-items.TC-h30 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC3-1: One search finds an item by each key it reads

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>, on the tab for every item.
* `<item_4>` is live and owned by `<collector B>`; no other item shares its title words, description words, grader and cert, or owner.

**Test data:**

| Search typed | Reads it as | `<item_4>` listed |
| --- | --- | --- |
| `<collector B>`'s exact email | owner's exact email | yes |
| `<item_4>`'s item id | item id | yes |
| PSA and `<cert_4>` | grader and cert | yes |
| psa and `<cert_4>` in lower case, with spaces around it | grader and cert | yes |
| A word only in `<item_4>`'s title | title or description | yes |
| A word only in `<item_4>`'s description | title or description | yes |

**Steps:**

1. Type the search from **Test data** into the search field.
2. Read the list.

**Expected Results:**

* The list holds `<item_4>` as the row says.

<!-- trace:case id=g10adm.inventory-items.TC-w2x rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC4-1: Search never finds an owner by name or part of an email

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>, on the tab for every item.
* `<item_4>` is owned by `<collector B>`; no item's title or description holds `<collector B>`'s name or email.

**Test data:**

| Search typed |
| --- |
| `<collector B>`'s account name |
| The part of `<collector B>`'s email before the @ |
| `<collector B>`'s email with its last letter dropped |

**Steps:**

1. Type the search from **Test data** into the search field.
2. Read the list.

**Expected Results:**

* No row is listed.
* The empty state names the search and offers a way to clear it.

<!-- trace:case id=g10adm.inventory-items.TC-gr3 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC5-1: The owner cell reads each kind of owner

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>, on the tab for every item.
* `<item_5>` is owned as the row of **Test data** says.

**Test data:**

| Owner of `<item_5>` | Owner cell reads | Click on the owner |
| --- | --- | --- |
| `<collector C>`, a named account | `<collector C>`'s account name | opens <grade10 admin collector page url> for `<collector C>` |
| `<collector D>`, whose name the account service cannot answer | `<collector D>`'s short id and "name unavailable" | nothing is required of it |
| The custodian | the custodian's registered name | nothing is required of it |
| The lender | the lender's registered name | nothing is required of it |

**Steps:**

1. Read the owner cell on the row of `<item_5>`.
2. Click the owner cell.
3. Navigate to <grade10 admin item page url> for `<item_5>`.

**Expected Results:**

* The owner cell reads as the row says, and every other row on the list still loads.
* Step 2 does as the row says.
* Step 3 opens the item and its owner cell reads the same.

<!-- trace:case id=g10adm.inventory-items.TC-udu rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC6-1: Reading an owner's name is recorded on the audit chain

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console and holds `kyc:read`.
* `<item_6>` is owned by `<collector C>`.

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_6>`.
2. Read the audit chain for the moment of step 1.

**Expected Results:**

* The page reads `<collector C>`'s name as the owner.
* The audit chain holds an entry for the name read, naming the staff member.

<!-- trace:case id=g10adm.inventory-items.TC-42v rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC7-1: An item whose owners disagree shows both to staff

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) holds `vault:operate` and `inventory:transfer` and is on <grade10 admin vault case page url> for `<case_7>`.
* `<case_7>`'s packet is prepared and not yet signed; its item `<item_7>` is registered under `<collector A>` and not marked.

**Steps:**

1. Open <grade10 admin item page url> for `<item_7>` in a second tab.
2. Transfer `<item_7>` to `<collector B>`'s exact email with a reason.
3. Have `<collector A>` sign `<case_7>`'s packet.
4. Confirm `<case_7>` vaulted with a shop.
5. Reload the page of `<item_7>`.

**Expected Results:**

* Step 4 is not refused; `<case_7>` reads vaulted.
* `<item_7>` reads marked by the vault on `<case_7>`.
* A warning shows the vault's owner, `<collector A>`, and the register's, `<collector B>`.

<!-- trace:case id=g10adm.inventory-items.TC-mkc rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC9-1: An empty tab and a missing item say so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* No item is retired.

**Test data:**

| Where | Shows |
| --- | --- |
| <grade10 admin items url>, the retired tab | an empty state naming the retired tab |
| <grade10 admin item page url> for an item id nobody issued | that no item has that id |

**Steps:**

1. Navigate to the place the row names.

**Expected Results:**

* The page shows what the row says, and the console's navigation still works.

<!-- trace:case id=g10adm.inventory-items.TC-kz9 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC10-1: Items and one item are refused without the inventory read

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(treasurer only) is signed in to the Grade10 console.
* `<item_1>` exists.

**Test data:**

| Where |
| --- |
| <grade10 admin items url> |
| <grade10 admin item page url> for `<item_1>` |

**Steps:**

1. Navigate to the place the row names.

**Expected Results:**

* The page is refused, naming `inventory:read`.
* No item, owner or fact is shown.

<!-- trace:case id=g10adm.inventory-items.TC-b8u rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC11-1: A failed read shows its error and retries

**Classification:**

* **Severity:** normal
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* The items read is mocked to fail once, then answer.

**Steps:**

1. Navigate to <grade10 admin items url>.
2. Click retry on the error.

**Expected Results:**

* Step 1 shows a pending state, then an error with a retry.
* Step 2 loads the marked tab.

<!-- trace:case id=g10adm.inventory-items.TC-ycw rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC12-1: The place row stands when the vault cannot be read

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<item_1>` is marked by the vault on `<case_1>`.
* The vault's read of `<case_1>` is mocked not to answer.

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_1>`.

**Expected Results:**

* The page opens with the item's facts and owner.
* The place row names the vault and `<case_1>`'s reference.
* The place row's status reads unavailable.

<!-- trace:case id=g10adm.inventory-items.TC-3hh rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC13-1: The register's owner stands once the vault releases the item

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) holds `vault:operate` and is signed in to the Grade10 console.
* `<item_7>` is owned by `<collector B>` in the register and marked by the vault on `<case_7>`, whose collector is `<collector A>`.
* `<case_7>` is vaulted on the storage lane, its release packet signed.

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_7>`.
2. Release `<case_7>` on the Custody tab of <grade10 admin vault case page url>.
3. Reload the page of `<item_7>`.

**Expected Results:**

* Step 1 shows a warning naming `<collector A>` as the vault's owner and `<collector B>` as the register's.
* Step 3 reads not marked and owned by `<collector B>`, with no warning.
* The place row reads closed by the vault on the day, with no reason.
* The moves section has no new move.

<!-- trace:case id=g10adm.inventory-items.TC-t75 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC14-1: An item read from the register as its case runs to a forfeit

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** release
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(holds `staff` and `treasurer`) is on <grade10 admin vault case page url> for `<case_14>`.
* `<case_14>` is a financed request submitted by `<collector A>` for a trading card titled `<request title>`, naming no slab; no item is linked to it.
* No item carries PSA and `<cert_14>`.

**Steps:**

1. Click Start valuation, naming PSA, grade 10 and `<cert_14>`.
2. Click the link to the item in the Case tab's item section.
3. Take `<case_14>` through its valuation, offer, acceptance and identity check.
4. Prepare documents and open the custody agreement.
5. Have `<collector A>` sign, then confirm `<case_14>` vaulted with a shop.
6. Record the advance, then reload the item's page.
7. Move `<case_14>` past its due date and past the cure date of a sent forfeiture notice.
8. Forfeit `<case_14>` with a reason.
9. Reload the item's page.
10. Search Items for PSA and `<cert_14>`.

**Expected Results:**

* Step 2 reads `<request title>`, trading card, PSA, 10 and `<cert_14>`, owned by `<collector A>`, not marked, with no move; Transfer and Retire are offered.
* Step 4's custody agreement names the item by the register's title and category, with PSA, 10 and `<cert_14>`.
* Step 6 reads marked by the vault on `<case_14>`; Transfer and Retire are not offered.
* Step 9 reads not marked and owned by the lender's registered name.
* Its newest move reads from `<collector A>` to the lender, made by the vault on `<case_14>`.
* Step 10 lists that one item.

<!-- trace:case id=g10adm.inventory-items.TC-vz8 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### grade10-admin-inventory-items-US1-TC15-1: A search from the marked tab reads every item

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>, on the marked tab.
* `<item_25>` is titled "Rolex Submariner" and no place marks it; `<item_26>` is titled "Submariner box" and is retired as lost.

**Steps:**

1. Type `submariner` into the search field.
2. Read the list.

**Expected Results:**

* `<item_25>` and `<item_26>` are both listed.
* `<item_26>` is badged retired; `<item_25>` is not.

---

## grade10-admin-inventory-items-US2: Operator registers an item and corrects its facts

**As a** member of shop staff with an item no place has registered,
**I want** to add it under its owner, an account named by its exact email or
one of the company's entities, with its category, title, description, grader,
grade and cert, and to correct a fact later,
**so that** the register says what the item is, whoever brought it in.

<!-- trace:case id=g10adm.inventory-items.TC-xh1 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC1-1: A graded item is registered under an account by exact email

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>.
* No live item carries PSA and `AB12345`.

**Test data:**

| Field | Value |
| --- | --- |
| Category | Trading card |
| Title | Charizard Base Set Holo |
| Description | Brought to the counter by the owner |
| Grader | PSA |
| Grade | 10 |
| Cert typed | `  ab12345 ` |
| Owner | `<collector A>`'s exact email |

**Steps:**

1. Click Register an item in the header.
2. Fill in category, title, description, grader, grade and cert from **Test data**.
3. Type the owner's email into the owner field.
4. Click Register.

**Expected Results:**

* Register is disabled until step 3 finds the account.
* Step 3 shows `<collector A>`'s name under the owner field.
* The new item opens on its own page.
* The page reads the facts from **Test data**, the cert as `AB12345`.
* The owner reads `<collector A>` by name; who edited it last is this staff member, now.
* The moves section says the item has not changed owner.

<!-- trace:case id=g10adm.inventory-items.TC-z3b rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC2-1: An item with no grader carries no grade or cert

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>.

**Test data:**

| Category | Owner chosen |
| --- | --- |
| Watch | The custodian |
| Bullion | The custodian |

**Steps:**

1. Click Register an item in the header.
2. Choose the category from **Test data** and type a title and a description.
3. Choose PSA as grader, then type a grade and a cert.
4. Clear the grader.
5. Choose the owner from **Test data** among the company's entities.
6. Click Register.

**Expected Results:**

* The register dialog opens with grade and cert hidden.
* Step 3 shows grade and cert.
* Step 4 hides grade and cert.
* Step 5 offers the custodian and not the lender.
* The new item reads no grader, no grade and no cert, owned by the entity's registered name.

<!-- trace:case id=g10adm.inventory-items.TC-sp2 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC3-1: The lists of categories and graders are closed

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>.

**Steps:**

1. Click Register an item in the header.
2. Open the category choice.
3. Open the grader choice.
4. Read the description field's help.

**Expected Results:**

* Step 2 offers exactly trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other.
* Step 3 offers exactly PSA, BGS, CGC, SGC, TAG, PCGS, NGC and PMG, and none.
* No field takes a grader typed by hand.
* The description's help says a grader not listed, its grade and cert go in the description.

<!-- trace:case id=g10adm.inventory-items.TC-g23 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC4-1: Title and description at their limits

Runs once per row of **Test data**.

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is in the register dialog opened from <grade10 admin items url>, with category, no grader and the custodian as owner chosen.

**Test data:**

| Title length | Description length | Outcome |
| --- | --- | --- |
| 200 characters | 2,000 characters | registered, both stored whole |
| 201 characters | 10 characters | refused, the title's limit of 200 named |
| 10 characters | 2,001 characters | refused, the description's limit of 2,000 named |

**Steps:**

1. Type a title and a description of the lengths in **Test data**.
2. Click Register.

**Expected Results:**

* The outcome is the row's; a refusal registers no item.

<!-- trace:case id=g10adm.inventory-items.TC-fyy rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC5-1: A grader and cert already on a live item is refused

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>.
* `<item_9>` is live, titled `<title_9>`, carrying PSA and `AB12345`.

**Test data:**

| Grader | Cert typed |
| --- | --- |
| PSA | `AB12345` |
| PSA | ` ab12345  ` |

**Steps:**

1. Click Register an item in the header.
2. Fill in a category, title, an owner, the grader and the cert from **Test data**.
3. Click Register.
4. Click the link in the refusal.

**Expected Results:**

* Step 3 is refused in the dialog: these grader and cert are already on `<title_9>`.
* No second item is registered.
* Step 4 opens the page of `<item_9>`.

<!-- trace:case id=g10adm.inventory-items.TC-nn1 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC6-1: The owner field takes only an email an account holds

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is in the register dialog opened from <grade10 admin items url>, with a category and a title filled in.

**Test data:**

| Email typed | Owner field shows | Register |
| --- | --- | --- |
| An email no account holds | no account has that email | disabled |
| `<collector A>`'s email missing its last letter | no account has that email | disabled |
| `<collector D>`'s email, whose name the account service cannot answer | `<collector D>`'s short id and "name unavailable" | enabled |

**Steps:**

1. Type the email from **Test data** into the owner field.
2. Read the owner field and Register.

**Expected Results:**

* The owner field and Register read as the row says.

<!-- trace:case id=g10adm.inventory-items.TC-okp rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC7-1: Editing an item's facts keeps its owner and records the edit

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_10>`, last edited by another staff member.
* `<item_10>` is live, owned by `<collector A>`, carrying PSA, grade 9 and `AB777`.

**Steps:**

1. Click Edit.
2. Read the owner in the dialog.
3. Change the grade to 10 and the cert to ` ab778 `.
4. Save.

**Expected Results:**

* Step 2 reads `<collector A>` as text; the dialog offers no way to change the owner.
* The page reads grade 10 and cert `AB778`, still owned by `<collector A>`.
* Who edited it last is this staff member, now.
* The moves section is unchanged.

<!-- trace:case id=g10adm.inventory-items.TC-o9h rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC8-1: An edit to a grader and cert another live item holds is refused

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_10>`, carrying PSA and `AB777`.
* `<item_9>` is live, titled `<title_9>`, carrying PSA and `AB12345`.

**Steps:**

1. Click Edit.
2. Change the cert to `AB12345`.
3. Save.

**Expected Results:**

* Step 3 is refused in the dialog: these grader and cert are already on `<title_9>`, with a link to it.
* `<item_10>` still reads `AB777`.

<!-- trace:case id=g10adm.inventory-items.TC-4in rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### grade10-admin-inventory-items-US2-TC9-1: Without the inventory write the register reads only

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* admin(holds `inventory:read` and not `inventory:write`) is signed in to the Grade10 console.
* `<item_11>`'s vault mark is still open on `<case_11>`, which the vault has released, so Close mark is offered to a holder of `inventory:write`.

**Steps:**

1. Navigate to <grade10 admin items url>.
2. Navigate to <grade10 admin item page url> for `<item_11>`.
3. Send a register request and an edit request for `<item_11>` straight to the register.

**Expected Results:**

* Step 1 offers no Register an item.
* Step 2 offers no Edit, Retire or Close mark.
* Step 3's requests are refused and nothing changes.

---

## grade10-admin-inventory-items-US3: Operator moves an item to its new owner

**As a** member of shop staff when an item no place marks changes hands,
**I want** to move it to an account named by its exact email or to the
custodian, never the lender, with a reason and a proof document where I have
one,
**so that** anyone can later read who moved it, when, why and on what proof.

<!-- trace:case id=g10adm.inventory-items.TC-vs9 rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC1-1: An item moves to an account with a reason and a proof

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_12>`.
* `<item_12>` is owned by `<collector A>`, no place marks it, and it has never moved.

**Test data:**

| Field | Value |
| --- | --- |
| New owner | `<collector B>`'s exact email |
| Reason | Sold privately at the counter |
| Proof | One PDF of 1 MB |

**Steps:**

1. Read the moves section.
2. Click Transfer.
3. Type the new owner, the reason, and pick the proof from **Test data**.
4. Click Transfer in the dialog.
5. Read the audit log for the moment of step 4.

**Expected Results:**

* Step 1 says the item has not changed owner.
* Transfer in the dialog is disabled until the owner is found and a reason is typed.
* The picked proof shows its name with a Remove control.
* The page reads `<collector B>` as owner.
* The top move reads from `<collector A>`, to `<collector B>`, this staff member, now, the reason, and the proof to download.
* The audit log records the move.

<!-- trace:case id=g10adm.inventory-items.TC-pir rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC2-1: An item moves to the custodian with no proof

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
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_12>`, owned by `<collector A>`, no place marking it.

**Steps:**

1. Click Transfer.
2. Open the choice of company entities.
3. Choose the custodian and type a reason.
4. Click Transfer in the dialog.

**Expected Results:**

* Step 2 offers the custodian and never the lender.
* The page reads the custodian's registered name as owner.
* The top move's proof cell says no proof was given.

<!-- trace:case id=g10adm.inventory-items.TC-yi8 rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC3-1: A move needs a found owner and a reason

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
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is in the transfer dialog on <grade10 admin item page url> for `<item_12>`, no place marking it.

**Test data:**

| New owner typed | Reason typed |
| --- | --- |
| `<collector B>`'s exact email | none |
| An email no account holds | Sold privately |
| none | Sold privately |

**Steps:**

1. Fill in the new owner and the reason from **Test data**.
2. Read Transfer in the dialog.

**Expected Results:**

* Transfer stays disabled and the owner is unchanged.

<!-- trace:case id=g10adm.inventory-items.TC-3wd rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC4-1: A proof is up to 5 PDF, PNG or JPG files of 10 MB each

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
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is in the transfer dialog on <grade10 admin item page url> for `<item_12>`, with `<collector B>`'s exact email and a reason typed.

**Test data:**

| Files picked | Outcome |
| --- | --- |
| 5 files: 2 PDF, 2 PNG, 1 JPG, each exactly 10 MB | accepted; the move lists 5 proofs |
| 6 PDF files of 1 MB | at five the picker offers no way to add a sixth; five stay listed |
| 1 PDF of 10 MB and 1 byte | refused under the picker |
| 1 GIF of 1 MB | refused under the picker |

**Steps:**

1. Pick the files from **Test data**.
2. Click Transfer in the dialog.

**Expected Results:**

* An accepted row moves the item with every file as its proof.
* The six-file row offers no way to pick a sixth file; five stay listed.
* A refused row names its file under the picker and does not list it; Transfer stays offered.

<!-- trace:case id=g10adm.inventory-items.TC-46a rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC5-1: A proof removed before the move is not kept

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is in the transfer dialog on <grade10 admin item page url> for `<item_12>`, with `<collector B>`'s exact email and a reason typed.

**Steps:**

1. Pick one PDF as proof.
2. Click Remove beside its name.
3. Click Transfer in the dialog.

**Expected Results:**

* Step 2 leaves no file under the picker.
* The top move's proof cell says no proof was given.

<!-- trace:case id=g10adm.inventory-items.TC-33b rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC6-1: An item whose owner was erased moves the same way

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
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_13>`.
* `<item_13>`'s owner was erased; no place marks it.

**Steps:**

1. Read the owner and the title.
2. Click Transfer.
3. Choose the custodian and type a reason.
4. Type the title `Charizard 1999 Base Set`.
5. Click Transfer in the dialog.

**Expected Results:**

* Step 1 reads the owner as erased and the title as erased; Transfer is offered.
* Step 2 asks for a title; after step 3 Transfer is still disabled, and after step 4 it is enabled.
* The page reads the custodian as owner and `Charizard 1999 Base Set` as the title.
* The top move reads from erased to the custodian.

<!-- trace:case id=g10adm.inventory-items.TC-4ou rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC7-1: A move never names the lender

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
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) holds `inventory:transfer`.
* `<item_12>` is owned by `<collector A>`; no place marks it.

**Steps:**

1. Send a transfer of `<item_12>` naming the lender, with a reason, straight to the register.
2. Read `<item_12>`.

**Expected Results:**

* Step 1 is refused.
* `<item_12>` is still owned by `<collector A>`, with no new move.

<!-- trace:case id=g10adm.inventory-items.TC-l1c rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC8-1: Opening a proof is recorded on the audit log

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_14>`, whose top move carries one proof.

**Steps:**

1. Click the proof on the top move.
2. Read the audit log for the moment of step 1.

**Expected Results:**

* The proof downloads.
* The audit log records the opening and who opened it.

<!-- trace:case id=g10adm.inventory-items.TC-ef6 rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC9-1: Without the transfer grant there is no move and no proof

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
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(holds `inventory:read` and `inventory:write`, not `inventory:transfer`) is signed in to the Grade10 console.
* `<item_14>` is not marked and its top move carries one proof.

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_14>`.
2. Request the proof of the top move straight from the register.
3. Send a transfer of `<item_14>` straight to the register.

**Expected Results:**

* Step 1 offers no Transfer and no proof to open; the moves still read.
* Step 2 is refused and returns no file.
* Step 3 is refused and the owner is unchanged.

<!-- trace:case id=g10adm.inventory-items.TC-h7f rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### grade10-admin-inventory-items-US3-TC10-1: Transfer stays disabled while the new owner is the present one

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
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_27>`.
* `<item_27>` is owned by `<collector B>` and no place marks it.

**Steps:**

1. Click Transfer.
2. Type `<collector B>`'s email as the new owner and type a reason.
3. Replace the owner with `<collector A>`'s email.

**Expected Results:**

* After step 2 Transfer is disabled.
* After step 3 Transfer is enabled.

---

## grade10-admin-inventory-items-US4: Operator learns which place marks an item before moving it

**As a** member of shop staff asked to move an item,
**I want** the move refused while a place marks the item, naming the place,
**so that** I never move an item the vault is still keeping for its owner.

<!-- trace:case id=g10adm.inventory-items.TC-t2x rev=1 covers=g10adm.inventory-items.SC-4vp,g10adm.inventory-items.SC-91a -->
### grade10-admin-inventory-items-US4-TC1-1: A marked item offers no transfer and names its place

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-04

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<item_1>` is marked by the vault on `<case_1>`.

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_1>`.
2. Send a transfer of `<item_1>` straight to the register.

**Expected Results:**

* Step 1 offers no Transfer and no Retire; a line names the vault and `<case_1>`.
* Step 2 is refused, naming the vault.
* The owner is unchanged and no move is recorded.

<!-- trace:case id=g10adm.inventory-items.TC-pf9 rev=1 covers=g10adm.inventory-items.SC-4vp,g10adm.inventory-items.SC-91a -->
### grade10-admin-inventory-items-US4-TC2-1: A mark that lands after the page opened refuses the transfer

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
* **Trace:** grade10-admin-inventory-items-US-04

**Pre-conditions:**

* admin(staff) holds `vault:operate` and is on <grade10 admin item page url> for `<item_7>`, owned by `<collector A>` and not marked.
* `<case_7>` names `<item_7>`, and its packet is signed.

**Steps:**

1. Click Transfer and fill in `<collector B>`'s exact email and a reason.
2. In a second tab, confirm `<case_7>` vaulted with a shop.
3. Click Transfer in the dialog.

**Expected Results:**

* Step 3 is refused with an error naming the vault.
* `<item_7>` is still owned by `<collector A>`, with no new move.

---

## grade10-admin-inventory-items-US5: Operator retires a duplicate record

**As a** member of shop staff who finds one object registered twice,
**I want** to retire the extra record as a duplicate, and to retire an item
lost, destroyed or left the platform the same way,
**so that** each object has one live record and the history of the others
stays readable.

<!-- trace:case id=g10adm.inventory-items.TC-uih rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### grade10-admin-inventory-items-US5-TC1-1: An item retired for each reason reads only and keeps its history

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_15>`.
* `<item_15>` is not marked and has one move.

**Test data:**

| Reason chosen |
| --- |
| Duplicate |
| Lost |
| Destroyed |
| Left the platform |

**Steps:**

1. Click Retire.
2. Choose the reason from **Test data**.
3. Click Retire in the dialog.
4. Navigate to the retired tab of <grade10 admin items url>.

**Expected Results:**

* The dialog offers the four reasons, and Retire is disabled until one is chosen.
* `<item_15>`'s page reads retired, with the reason and when.
* It offers no Edit, Transfer or Retire; its facts and its move still read.
* Step 4 lists `<item_15>` with the reason.

<!-- trace:case id=g10adm.inventory-items.TC-jk7 rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### grade10-admin-inventory-items-US5-TC2-1: A retired item's grader and cert can name a new item

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
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* admin(staff) is on <grade10 admin items url>.
* `<item_16>` is retired as a duplicate, carrying PSA and `AB555`; no live item carries them.

**Steps:**

1. Click Register an item in the header.
2. Fill in a category, a title, an owner, PSA and `AB555`.
3. Click Register.

**Expected Results:**

* A new item is registered carrying PSA and `AB555`.
* `<item_16>` still reads retired with the same facts.

<!-- trace:case id=g10adm.inventory-items.TC-tin rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### grade10-admin-inventory-items-US5-TC3-1: A retired item is restored with a reason

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
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_17>`.
* `<item_17>` is retired as lost, carrying PSA and `AB600`; no live item carries them.

**Steps:**

1. Click Restore.
2. Type a reason.
3. Confirm the restore.

**Expected Results:**

* `<item_17>` reads live and offers Edit, Transfer and Retire.
* It leaves the retired tab of Items.
* The audit log's restore entry names `<item_17>` and does not carry the reason's text.

<!-- trace:case id=g10adm.inventory-items.TC-7ds rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### grade10-admin-inventory-items-US5-TC4-1: A restore is refused while a live item holds its cert

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_16>`, retired as a duplicate, carrying PSA and `AB555`.
* `<item_18>` is live, titled `<title_18>`, carrying PSA and `AB555`.

**Steps:**

1. Click Restore.
2. Type a reason.
3. Confirm the restore.

**Expected Results:**

* Step 3 is refused, naming `<title_18>`.
* `<item_16>` still reads retired.

<!-- trace:case id=g10adm.inventory-items.TC-af8 rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### grade10-admin-inventory-items-US5-TC5-1: A mark that lands after the page opened refuses the retire

**Classification:**

* **Severity:** critical
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* admin(staff) holds `vault:operate` and is on <grade10 admin item page url> for `<item_7>`, not marked.
* `<case_7>` names `<item_7>`, and its packet is signed.

**Steps:**

1. Click Retire and choose duplicate.
2. In a second tab, confirm `<case_7>` vaulted with a shop.
3. Click Retire in the dialog.

**Expected Results:**

* Step 3 is refused with an error naming the vault.
* `<item_7>` is still live.

---

## grade10-admin-inventory-items-US6: Operator closes a mark the vault no longer has

**As a** member of shop staff looking at an item the vault has let go of,
**I want** to close the mark that is still showing, with a reason,
**so that** the item reads as not marked and can be moved or retired.

<!-- trace:case id=g10adm.inventory-items.TC-cif rev=1 covers=g10adm.inventory-items.SC-t3v,g10adm.inventory-items.SC-iac,g10adm.inventory-items.SC-m22 -->
### grade10-admin-inventory-items-US6-TC1-1: A mark the vault let go of is closed with a reason

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
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-06

**Pre-conditions:**

* admin(staff) is on <grade10 admin item page url> for `<item_19>`.
* `<item_19>` is still marked by the vault on `<case_19>`, whose closing word never reached the register.

**Test data:**

| `<case_19>` reads |
| --- |
| Released |
| Unwound |
| Forfeited |
| Erased |

**Steps:**

1. Click Close mark on the place row.
2. Type a reason.
3. Click Close mark in the dialog.

**Expected Results:**

* Close mark in the dialog is disabled until a reason is typed.
* The place row reads closed by hand, naming this staff member, when and the reason.
* `<item_19>` reads not marked and offers Transfer and Retire.
* `<item_19>` leaves the marked tab of Items.

<!-- trace:case id=g10adm.inventory-items.TC-z4f rev=1 covers=g10adm.inventory-items.SC-t3v,g10adm.inventory-items.SC-iac,g10adm.inventory-items.SC-m22 -->
### grade10-admin-inventory-items-US6-TC2-1: Close mark is not offered while the vault still holds the item

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
* **Trace:** grade10-admin-inventory-items-US-06

**Pre-conditions:**

* admin(staff) is signed in to the Grade10 console.
* `<item_1>` is marked by the vault on `<case_1>`, which reads as the row says.

**Test data:**

| `<case_1>` reads |
| --- |
| Vaulted |
| Active |
| Repaid, not yet released |
| Released, the vault mocked not to answer |

**Steps:**

1. Navigate to <grade10 admin item page url> for `<item_1>`.
2. Send a close of the mark straight to the register, with a reason.

**Expected Results:**

* Step 1 offers no Close mark on the place row.
* Step 2 is refused and `<item_1>` still reads marked.

<!-- trace:case id=g10adm.inventory-items.TC-c47 rev=1 covers=g10adm.inventory-items.SC-t3v,g10adm.inventory-items.SC-iac,g10adm.inventory-items.SC-m22 -->
### grade10-admin-inventory-items-US6-TC3-1: A later word from the vault does not reopen a closed mark

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
* **Trace:** grade10-admin-inventory-items-US-06

**Pre-conditions:**

* `<item_19>`'s mark on `<case_19>` was closed by hand; `<case_19>` reads released.
* The vault's word marking `<item_19>` for `<case_19>` is held back and not yet delivered.

**Steps:**

1. Deliver the vault's held-back word for `<case_19>` to the register.
2. Read `<item_19>`.

**Expected Results:**

* `<item_19>` reads not marked; the place row still reads closed by hand.

<!-- trace:case id=g10adm.inventory-items.TC-l43 rev=1 covers=g10adm.inventory-items.SC-t3v,g10adm.inventory-items.SC-iac,g10adm.inventory-items.SC-m22 -->
### grade10-admin-inventory-items-US6-TC4-1: A hand close on a forfeited case moves the item to the lender once

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** integration
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-06

**Pre-conditions:**

* admin(staff) holds `inventory:write`.
* `<item_19>` is owned by `<collector A>`, and its mark on `<case_19>` is open.
* `<case_19>` reads forfeited, and the vault's word ending the mark, naming the lender, is held back and not yet delivered.

**Steps:**

1. Close the mark on `<case_19>` with a reason.
2. Navigate to <grade10 admin item page url> for `<item_19>`.
3. Deliver the vault's held-back word for `<case_19>` to the register.
4. Reload the page.

**Expected Results:**

* Step 2's place row reads closed by hand, naming who closed it.
* `<item_19>` reads owned by the lender's registered name.
* Its newest move reads from `<collector A>` to the lender, made by the vault on `<case_19>`.
* Step 4 reads the same: the mark closed by hand and one move to the lender.

---

## grade10-admin-inventory-items-US8: Admin erases a collector who owns items

**As an** admin running an erasure,
**I want** the register to refuse while a place marks an item the person
owns, and otherwise to remove them from their items and moves while keeping
each item's grader, grade and cert,
**so that** the person is forgotten and the objects the house holds keep
their record.

<!-- trace:case id=g10adm.inventory-items.TC-bs3 rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### grade10-admin-inventory-items-US8-TC1-1: An owner's items lose the person and keep the object

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* admin(holds `user:delete`) is on the erasure checklist for `<collector F>`, whose request has matured.
* `<collector F>` owns `<item_21>`, not marked: trading card, PSA, grade 9, `AB900`, with a title and a description.

**Steps:**

1. Run inventory's erasure.
2. Navigate to <grade10 admin item page url> for `<item_21>`.
3. Search Items for PSA and `AB900`.
4. Search Items for `<collector F>`'s exact email.

**Expected Results:**

* Inventory reports nothing in its way and nothing remaining.
* The owner reads as erased; the title reads as erased; the description is empty.
* Category trading card, PSA, grade 9 and `AB900` still read.
* Step 3 finds `<item_21>`; step 4 finds nothing.

<!-- trace:case id=g10adm.inventory-items.TC-3ml rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### grade10-admin-inventory-items-US8-TC2-1: Erasure is refused while a place marks the person's item

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
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* admin(holds `user:delete`) is on the erasure checklist for `<collector G>`, whose request has matured.
* `<collector G>` owns the items in **Test data**, each marked by the vault on its own case.

**Test data:**

| Marked items `<collector G>` owns | Lines on inventory's checklist entry |
| --- | --- |
| `<item_22>` on `<case_22>` | 1 |
| `<item_22>` on `<case_22>`, `<item_23>` on `<case_23>` | 2 |

**Steps:**

1. Read inventory's entry on the checklist.
2. Run inventory's erasure.

**Expected Results:**

* Step 1 shows a line per marked item, naming its item id, the vault and its case.
* Step 2 is refused; every item still reads `<collector G>` as owner, title and description intact.

<!-- trace:case id=g10adm.inventory-items.TC-2rh rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### grade10-admin-inventory-items-US8-TC3-1: A move loses the person's side and keeps the proof while the other party remains

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* admin(holds `user:delete`) is on the erasure checklist for `<collector F>`, whose request has matured.
* `<item_24>` moved between `<collector F>` and the other party in **Test data**, with a reason and a proof, the number of days in **Test data** ago.

**Test data:**

| Other party | Days since the move | Proof cell after the erasure |
| --- | --- | --- |
| `<collector B>`, a live account | 30 | the proof, to download |
| The custodian | 30 | the proof, to download |
| `<collector H>`, already erased | 30 | proof removed |
| `<collector B>`, a live account | 2,556 | the proof, to download |

**Steps:**

1. Run inventory's erasure.
2. Navigate to <grade10 admin item page url> for `<item_24>`.
3. Read the move.

**Expected Results:**

* `<collector F>`'s side of the move reads as erased, and the reason is gone.
* The other party's side still reads.
* The proof cell reads as the row says.
* Step 1's inventory line reads nothing remaining, whether or not the proof is kept.

<!-- trace:case id=g10adm.inventory-items.TC-zdn rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### grade10-admin-inventory-items-US8-TC4-1: Running the erasure a second time changes nothing

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
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* admin(holds `user:delete`) is on the erasure checklist for `<collector F>`, whose inventory erasure has already run.

**Steps:**

1. Run inventory's erasure again.
2. Read `<item_21>`.

**Expected Results:**

* Step 1 reports nothing in its way and nothing remaining.
* `<item_21>` reads as it did after the first run.

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journeys, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Items, Inventory, Collector Page, Roles and Account Data PRD pages, and `shared/auth/domain-tcs.md`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md`, `ui-design.md` whole, the PRD pages and the six sibling deltas of this change. It is a statement, not proof.

- **Folded** - `grade10-admin-inventory-items-US1-TC1-1` into `grade10-admin-inventory-items-SC-50`, `grade10-admin-inventory-items-SC-12` and `grade10-admin-inventory-items-SC-25`; `grade10-admin-inventory-items-US1-TC2-1` into `grade10-admin-inventory-items-SC-51`; `grade10-admin-inventory-items-US1-TC3-1` into `grade10-admin-inventory-items-SC-52`, `grade10-admin-inventory-items-SC-53` and `grade10-admin-inventory-items-SC-54`; `grade10-admin-inventory-items-US1-TC4-1` into `grade10-admin-inventory-items-SC-54` and `grade10-admin-inventory-items-SC-55`; `grade10-admin-inventory-items-US1-TC5-1` into `grade10-admin-inventory-items-SC-16`, `grade10-admin-inventory-items-SC-17` and `grade10-admin-inventory-items-SC-18`; `grade10-admin-inventory-items-US1-TC6-1` into `grade10-admin-inventory-items-SC-16`; `grade10-admin-inventory-items-US1-TC7-1` into `grade10-admin-inventory-items-SC-27`; `grade10-admin-inventory-items-US1-TC9-1` into `grade10-admin-inventory-items-SC-55` and `grade10-admin-inventory-items-SC-57`; `grade10-admin-inventory-items-US1-TC10-1` into `grade10-admin-inventory-items-SC-58` and `grade10-admin-inventory-items-SC-68`; `grade10-admin-inventory-items-US1-TC11-1` into `grade10-admin-inventory-items-SC-59`; `grade10-admin-inventory-items-US2-TC1-1` into `grade10-admin-inventory-items-SC-01`, `grade10-admin-inventory-items-SC-10` and `grade10-admin-inventory-items-SC-38`; `grade10-admin-inventory-items-US2-TC2-1` into `grade10-admin-inventory-items-SC-02` and `grade10-admin-inventory-items-SC-19`; `grade10-admin-inventory-items-US2-TC3-1` into `grade10-admin-inventory-items-SC-03`; `grade10-admin-inventory-items-US2-TC4-1` into `grade10-admin-inventory-items-SC-04`; `grade10-admin-inventory-items-US2-TC5-1` into `grade10-admin-inventory-items-SC-07`; `grade10-admin-inventory-items-US2-TC6-1` into `grade10-admin-inventory-items-SC-11` and `grade10-admin-inventory-items-SC-69`; `grade10-admin-inventory-items-US2-TC7-1` into `grade10-admin-inventory-items-SC-12` and `grade10-admin-inventory-items-SC-13`; `grade10-admin-inventory-items-US2-TC8-1` into `grade10-admin-inventory-items-SC-08`; `grade10-admin-inventory-items-US2-TC9-1` into `grade10-admin-inventory-items-SC-14`; `grade10-admin-inventory-items-US3-TC1-1` into `grade10-admin-inventory-items-SC-33`, `grade10-admin-inventory-items-SC-36` and `grade10-admin-inventory-items-SC-38`; `grade10-admin-inventory-items-US3-TC2-1` into `grade10-admin-inventory-items-SC-34` and `grade10-admin-inventory-items-SC-19`; `grade10-admin-inventory-items-US3-TC3-1` into `grade10-admin-inventory-items-SC-35` and `grade10-admin-inventory-items-SC-11`; `grade10-admin-inventory-items-US3-TC4-1` into `grade10-admin-inventory-items-SC-36`; `grade10-admin-inventory-items-US3-TC5-1` into `grade10-admin-inventory-items-SC-36` and `grade10-admin-inventory-items-SC-34`; `grade10-admin-inventory-items-US3-TC6-1` into `grade10-admin-inventory-items-SC-64`; `grade10-admin-inventory-items-US3-TC7-1` into `grade10-admin-inventory-items-SC-19`; `grade10-admin-inventory-items-US3-TC8-1` into `grade10-admin-inventory-items-SC-44`; `grade10-admin-inventory-items-US3-TC9-1` into `grade10-admin-inventory-items-SC-45`; `grade10-admin-inventory-items-US4-TC1-1` into `grade10-admin-inventory-items-SC-40`; `grade10-admin-inventory-items-US4-TC2-1` into `grade10-admin-inventory-items-SC-41`; `grade10-admin-inventory-items-US5-TC1-1` into `grade10-admin-inventory-items-SC-46`; `grade10-admin-inventory-items-US5-TC2-1` into `grade10-admin-inventory-items-SC-09`; `grade10-admin-inventory-items-US5-TC3-1` into `grade10-admin-inventory-items-SC-48`; `grade10-admin-inventory-items-US5-TC4-1` into `grade10-admin-inventory-items-SC-49`; `grade10-admin-inventory-items-US5-TC5-1` into `grade10-admin-inventory-items-SC-47`; `grade10-admin-inventory-items-US6-TC1-1` into `grade10-admin-inventory-items-SC-28`; `grade10-admin-inventory-items-US6-TC2-1` into `grade10-admin-inventory-items-SC-29`; `grade10-admin-inventory-items-US6-TC3-1` into `grade10-admin-inventory-items-SC-30`; `grade10-admin-inventory-items-US8-TC1-1` into `grade10-admin-inventory-items-SC-64`; `grade10-admin-inventory-items-US8-TC2-1` into `grade10-admin-inventory-items-SC-63`; `grade10-admin-inventory-items-US8-TC3-1` into `grade10-admin-inventory-items-SC-65`; `grade10-admin-inventory-items-US8-TC4-1` into `grade10-admin-inventory-items-SC-67`
- **Contradicted, case corrected** - `grade10-admin-inventory-items-US2-TC2-1` offered and registered under the lender; Q14, Q28 and the Items page keep the lender to a forfeit, so its second row names the custodian and the design's owner field drops the lender on Register. `grade10-admin-inventory-items-US8-TC3-1` removed a proof 2,556 days old at the erasure; Q34 flags it for review and deletes nothing by the clock, so the row keeps the proof, and the Account Data page's row now says flagged rather than deleted. `grade10-admin-inventory-items-US2-TC9-1` asked for an item both not marked and offering Close mark; its mark is now open on a released case
- **Contradicted, spec corrected** - none
- **Folded into the spec** - the cert typed in lower case or with spaces, which `grade10-admin-inventory-items-US1-TC3-1` gains as a row and `grade10-admin-inventory-items-SC-53` as a search, as Q48; Edit offered on a marked item, which `grade10-admin-inventory-items-SC-40` now states, as Q22; the register's ten categories on the register dialog, which `grade10-admin-inventory-items-SC-03` now states, as Q4; the owners settling once the mark closes, Q51, as `grade10-admin-inventory-items-SC-70`
- **Added by QA2** - `grade10-admin-inventory-items-US1-TC12-1` for `grade10-admin-inventory-items-SC-26`, the place row with the vault down; `grade10-admin-inventory-items-US1-TC13-1` for `grade10-admin-inventory-items-SC-70`, also reaching `grade10-admin-inventory-items-SC-23`'s neutral close; `grade10-admin-inventory-items-US1-TC14-1`, the proposal's whole path from the register's side - registered at the valuation, named on the custody agreement, marked at vaulting, moved to the lender at the forfeit - reaching `grade10-admin-inventory-items-SC-24` and `grade10-admin-inventory-items-SC-42`; `grade10-admin-inventory-items-US6-TC4-1` for `grade10-admin-inventory-items-SC-43`; `grade10-admin-inventory-items-US6-TC2-1` gains a row for `grade10-admin-inventory-items-SC-29`'s close sent while the vault cannot be asked
- **Raised, answered by the round** - a cert typed in lower case (Q48); read-only states no role reaches (Q45: stated per grant, so `grade10-admin-inventory-items-US2-TC9-1`, `grade10-admin-inventory-items-US3-TC9-1` run with a test operator given that grant set); a forfeit's move on the item and the audit log (Q46); the 2,555-day limit (Q34); a transfer to the present owner (Q49); a restore and a hand close on the audit log (Q50); editing while marked (Q22); which owner stands after release (Q51); and the scenario pass's own: grade and cert with every grader (Q54), proof retention (Q34), the lender on Register (Q14)
- **Raised, answered by the owner** - Q55, the All tab lists live items only, which `grade10-admin-inventory-items-US1-TC2-1` and `grade10-admin-inventory-items-SC-51` now assert; Q53, Close mark on a forfeited case moves the item to the lender, which `grade10-admin-inventory-items-US6-TC4-1` walks; Q52, no fill of the register, so `grade10-admin-inventory-items-US1-TC8-1` and the fill's requirement are removed
- **Round 4** - `grade10-admin-inventory-items-SC-71`, a search over every item whatever the tab, gets `grade10-admin-inventory-items-US1-TC15-1`; `grade10-admin-inventory-items-SC-72`, an act's audit entry by its ids, is out of suite; `grade10-admin-inventory-items-SC-73`, a title on a move from an erased owner, is reached by `grade10-admin-inventory-items-US3-TC6-1`; `grade10-admin-inventory-items-SC-74`, a kept proof not left remaining, by `grade10-admin-inventory-items-US8-TC3-1`; `grade10-admin-inventory-items-SC-75`, Transfer disabled for the present owner, gets `grade10-admin-inventory-items-US3-TC10-1`, its retry half held by `TransferItemDialog`'s component test (task 10.1); `grade10-admin-inventory-items-SC-43` now reads Q53's recommendation and `grade10-admin-inventory-items-US6-TC4-1` walks it; `grade10-admin-inventory-items-SC-48`'s reason stays on the item and `grade10-admin-inventory-items-US5-TC3-1` reads the audit entry without it
- **Rejected** - none
- **Moved** - the collector page's Items section, its journey and its four cases, to `grade10-admin/console/collector-page` once `vault-walk-ins-and-owners` published it
- **Uncovered anchors** - none: each of US-01 to US-06 and US-08 has cases, every Feature set group is reached by a case or by **Out of suite**, and no domain suite sits above this capability
