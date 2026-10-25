# grade10-admin/inventory/items Test Cases

**Status:** pending-review · 0/38
**Drafts styled:** 2026-10-25, tcs-rules r7
**Regenerated:** 2026-10-25, tcs-rules r7

**Out of suite (api):** grade10-admin-inventory-items-SC-72 - each act's audit entry, read by the routers' audit declaration tests, which no screen shows whole

## Background

* Items is `<items>`, `admin.grade10.com/inventory/items`, with three tabs: marked, every live item, retired; an item's page is `<item page>`. A collector's page is `admin.grade10.com/vault/collectors/<user id>`.
* Staff is admin(staff), holding `inventory:read`, `inventory:write` and `inventory:transfer`, unless a case says otherwise. The custodian and the lender each have a registered name on file. Collector A and collector B are named accounts; collector D's name the account service cannot answer.

## g10adm.inventory-items.US1: Operator finds an item and who owns it

**As a** member of shop staff asked about one object,
**I want** to find it by its title, by its grader and cert, by its item id or
by its owner's exact email, and read its owner by name, its facts and whether
a place marks it,
**so that** I can answer who has what without opening every case.

<!-- trace:case id=g10adm.inventory-items.TC-19a rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC1: Items opens on what the places mark, every live item and the retired ones a tab away

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* Item 1, a PSA 10 trading card of collector A, is marked by the vault on case 1; item 2, the custodian's watch, is marked by nothing; item 3 is retired as lost.

**Steps:**

1. Open `<items>` from Inventory's header, and read item 1's row.
2. Click the tab for every item, then the retired tab.
3. Click item 1's row, then the case link on its place row.

**Expected Results:**

* Step 1 opens on the marked tab listing item 1 alone, reading title, category, grader and cert, collector A by name and the vault as its place, with no last-edited column.
* Step 2 lists items 1 and 2 and not item 3, then item 3 alone, with lost as why.
* Step 3 opens item 1's page, with a back link, reading its facts, its owner by name, who edited it last and when, and a place row naming the vault, case 1's reference and status; the link opens case 1.

<!-- trace:case id=g10adm.inventory-items.TC-h30 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC3: One search finds an item by each key it reads, whatever the tab

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* Item 4, owned by collector B, carries PSA and cert AB4444, a title word and a description word no other item holds; staff is on the marked tab, item 4 not marked.

**Test data:**

| `<searched>` |
| --- |
| collector B's exact email |
| item 4's id |
| PSA AB4444 |
| ` psa ab4444 ` |
| the word in its title |
| the word in its description |

**Steps:**

1. Search `<searched>`.

**Expected Results:**

* Item 4 is listed, though no place marks it.

<!-- trace:case id=g10adm.inventory-items.TC-vz8 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC15: A search lists a retired match badged retired

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* "Rolex Submariner" is live and marked by nothing; "Submariner box" is retired as lost.

**Steps:**

1. On the marked tab, search submariner.

**Expected Results:**

* Both are listed, the box badged retired and the watch not.

<!-- trace:case id=g10adm.inventory-items.TC-w2x rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC4: Search never finds an owner by name or part of an email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* Item 4 is owned by collector B; no title or description holds collector B's name or email.

**Test data:**

| `<searched>` |
| --- |
| collector B's account name |
| the part of collector B's email before the @ |
| collector B's email with its last letter dropped |

**Steps:**

1. Search `<searched>` on the tab for every item.

**Expected Results:**

* No row is listed; the empty state names the search and offers to clear it.

<!-- trace:case id=g10adm.inventory-items.TC-gr3 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC5: The owner cell reads each kind of owner, and the read is recorded

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* Item 5 is owned by `<owner>`.

**Test data:**

| `<owner>` | `<cell reads>` |
| --- | --- |
| collector A | collector A's name, opening their collector page |
| collector D | collector D's short id and "name unavailable" |
| the custodian | the custodian's registered name |
| the lender | the lender's registered name |

**Steps:**

1. Read item 5's owner cell on the list, and click it.
2. Open item 5's page; as an auditor, read the audit log since.

**Expected Results:**

* The cell reads `<cell reads>` on both, every other row still loading.
* The log records who read item 5's owner.

<!-- trace:case id=g10adm.inventory-items.TC-42v rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC7: Owners that disagree are both shown, and the register's stands once the vault lets go

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* Staff holds `vault:operate`; case 7's packet is prepared and unsigned, its item 7 registered under collector A and not marked.

**Steps:**

1. On item 7's page, transfer it to collector B with a reason.
2. Have collector A sign case 7's packet, confirm it vaulted, and reload item 7.
3. Release case 7, and reload item 7.

**Expected Results:**

* Step 2 is not refused: item 7 reads marked by the vault on case 7, a warning showing the vault's owner, collector A, and the register's, collector B.
* Step 3 reads not marked, owned by collector B with no warning, the place row closed by the vault on the day with no reason, and no new move.

<!-- trace:case id=g10adm.inventory-items.TC-mkc rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC9: An empty tab, an empty search and a missing item say which

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
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* No item is retired.

**Test data:**

| `<opened>` | `<shows>` |
| --- | --- |
| the retired tab | an empty state naming the tab |
| `<item page>` for an id nobody issued | that no item has that id |

**Steps:**

1. Open `<opened>`.

**Expected Results:**

* It shows `<shows>`, the console's navigation still working.

<!-- trace:case id=g10adm.inventory-items.TC-kz9 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC10: Without the read grant Items and an item name it

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* A treasurer, holding no inventory grant, is signed in.

**Test data:**

| `<opened>` |
| --- |
| `<items>` |
| item 1's page |

**Steps:**

1. Open `<opened>`.

**Expected Results:**

* It is refused, naming `inventory:read`; no item, owner or fact shows.

<!-- trace:case id=g10adm.inventory-items.TC-b8u rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC11: A failed read stands alone and retries

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-01

**Pre-conditions:**

* `<failing>`.

**Test data:**

| `<failing>` | `<reads>` |
| --- | --- |
| the items read fails once | a pending state, then an error with a retry, which loads the marked tab |
| the vault does not answer for item 1's case | item 1's facts and owner, its place row naming the vault and the case, its status unavailable |
| item 1's moves fail once | the facts and owner standing, the moves' own error with a retry |

**Steps:**

1. Open `<items>` or item 1's page, and click any retry.

**Expected Results:**

* It reads `<reads>`.

<!-- trace:case id=g10adm.inventory-items.TC-t75 rev=1 covers=g10adm.inventory-items.SC-rsv,g10adm.inventory-items.SC-ujf,g10adm.inventory-items.SC-si1,g10adm.inventory-items.SC-dxk,g10adm.inventory-items.SC-cwd,g10adm.inventory-items.SC-cg2,g10adm.inventory-items.SC-tna,g10adm.inventory-items.SC-z8f,g10adm.inventory-items.SC-8em,g10adm.inventory-items.SC-3ic,g10adm.inventory-items.SC-ajw,g10adm.inventory-items.SC-k1r,g10adm.inventory-items.SC-g2i,g10adm.inventory-items.SC-ou0,g10adm.inventory-items.SC-fz5,g10adm.inventory-items.SC-oh4,g10adm.inventory-items.SC-9hc,g10adm.inventory-items.SC-du8 -->
### g10adm.inventory-items.US1-TC14: An item read from the register as its case runs to a forfeit, the lender taking it once

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Moving an item

**Pre-conditions:**

* Staff holding `staff` and `treasurer` is on case 14, a financed request of collector A for a card titled `<request title>`, naming no slab; nothing carries PSA AB1414.

**Steps:**

1. Click Start valuation naming PSA, 10 and AB1414, and follow the link to the item.
2. Take the case through offer, acceptance and identity; prepare documents and open the custody agreement.
3. Have collector A sign, confirm it vaulted, record the advance, and reload the item.
4. Move the case past its due date and the notice's cure date, forfeit it with a reason, and reload the item.
5. Search PSA AB1414.

**Expected Results:**

* Step 1 reads `<request title>`, trading card, PSA, 10, AB1414, owned by collector A, not marked, no move, offering Transfer and Retire.
* Step 2's agreement names the item by the register's title and category, with PSA, 10 and AB1414.
* Step 3 reads marked by the vault on case 14, offering no Transfer or Retire.
* Step 4 reads not marked, owned by the lender's registered name, its newest move from collector A to the lender, made by the vault on case 14.
* Step 5 lists that one item.

<!-- trace:case id=g10adm.inventory-items.TC-yi3 rev=1 -->
### g10adm.inventory-items.US1-TC16: A place row reads only what the vault has done

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
* **Trace:** Marks from places

**Pre-conditions:**

* `<item>`.

**Test data:**

| `<item>` | `<place row reads>` |
| --- | --- |
| the item of a case whose valuation started, not yet vaulted | not marked, Transfer and Retire offered |
| an item the vault released | closed by the vault on its day, with no reason |
| an item the vault unwound | closed by the vault on its day, with no reason |

**Steps:**

1. Open the item's page, and read its place row.

**Expected Results:**

* It reads `<place row reads>`.

<!-- trace:case id=g10adm.inventory-items.TC-lwb rev=1 -->
### g10adm.inventory-items.US1-TC17: The ZZZ console has no register

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** What an item says

**Pre-conditions:**

* An operator is signed in to the ZZZ console.

**Steps:**

1. Look for Items and for an item's page.

**Expected Results:**

* Neither is offered.

---

## g10adm.inventory-items.US2: Operator registers an item and corrects its facts

**As a** member of shop staff with an item no place has registered,
**I want** to add it under its owner, an account named by its exact email or
one of the company's entities, with its category, title, description, grader,
grade and cert, and to correct a fact later,
**so that** the register says what the item is, whoever brought it in.

<!-- trace:case id=g10adm.inventory-items.TC-xh1 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC1: A graded item is registered under an account by its exact email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* No live item carries PSA AB12345.

**Test data:**

| `<owner>` | `<field shows>` |
| --- | --- |
| collector A's exact email | collector A's name |
| collector D's exact email | collector D's short id and "name unavailable" |

**Steps:**

1. Click Register an item, and fill in trading card, Charizard Base Set Holo, a description, PSA, 10 and `  ab12345 `.
2. Type `<owner>` as the owner, and click Register.

**Expected Results:**

* Register is disabled until the owner is found, the field showing `<field shows>`.
* The new item opens on its page, reading the facts with the cert AB12345, the owner, who edited it last now, and that it has not changed owner.

<!-- trace:case id=g10adm.inventory-items.TC-z3b rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC2: An item with no grader carries no grade or cert, and the lender is never an owner

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* Staff opens Register an item.

**Test data:**

| `<category>` |
| --- |
| Watch |
| Bullion |

**Steps:**

1. Choose `<category>`, type a title and description, choose PSA and type a grade and cert, then clear the grader.
2. Open the company owners, choose the custodian, and click Register.

**Expected Results:**

* Grade and cert hide until a grader is chosen, and clear and hide again when it is cleared.
* The owners offer the custodian and not the lender; the item reads no grader, grade or cert, owned by the custodian's registered name.

<!-- trace:case id=g10adm.inventory-items.TC-sp2 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC3: The categories and graders are closed lists, an unlisted grader going in the description

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* Staff opens Register an item.

**Steps:**

1. Open the category and grader choices, and read the description's help.

**Expected Results:**

* Categories are exactly trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other; graders exactly PSA, BGS, CGC, SGC, TAG, PCGS, NGC, PMG and none, none typed by hand.
* The help says an unlisted grader, its grade and cert go in the description.

<!-- trace:case id=g10adm.inventory-items.TC-g23 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC4: A title or a description past its cap is refused, and at its cap is kept whole

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* Staff is in Register an item, with a category, no grader and the custodian chosen.

**Steps:**

1. Register with a 201-character title.
2. Register with a 2,001-character description.
3. Register with a 200-character title and a 2,000-character description.

**Expected Results:**

* Steps 1 and 2 are refused by name with their limits, 200 and 2,000, registering nothing.
* Step 3 registers both whole.

<!-- trace:case id=g10adm.inventory-items.TC-fyy rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC5: A grader and cert already on a live item is refused, on a register or an edit

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* Item 9, titled `<title 9>`, carries PSA AB12345; item 10 carries PSA AB777.

**Test data:**

| `<sent>` |
| --- |
| a new item registered with PSA AB12345 |
| a new item registered with PSA ` ab12345  ` |
| item 10 edited to cert AB12345 |

**Steps:**

1. Send `<sent>`, and click the refusal's link.

**Expected Results:**

* It is refused in the dialog: this grader and cert are already on `<title 9>`; the link opens item 9.
* No second item is registered, and item 10 still reads AB777.

<!-- trace:case id=g10adm.inventory-items.TC-nn1 rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC6: An email no account holds is not an owner

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
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* Staff is in Register an item with a category and title.

**Test data:**

| `<typed>` |
| --- |
| an email no account holds |
| collector A's email missing its last letter |

**Steps:**

1. Type `<typed>` as the owner, and read Register.

**Expected Results:**

* The field says no account has that email, and Register stays disabled.

<!-- trace:case id=g10adm.inventory-items.TC-okp rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC7: An edit shows who made it and when, and never changes the owner

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* Item 10, collector A's, carries PSA, 9 and AB777, last edited by another staff member.

**Steps:**

1. Click Edit, and read the owner.
2. Change the grade to 10 and the cert to ` ab778 `, and save.

**Expected Results:**

* Step 1 reads collector A as text, offering no way to change it.
* Step 2 reads 10 and AB778, still collector A's, edited last by this staff member now; the moves are unchanged.

<!-- trace:case id=g10adm.inventory-items.TC-4in rev=1 covers=g10adm.inventory-items.SC-gyp,g10adm.inventory-items.SC-v3t,g10adm.inventory-items.SC-9v8,g10adm.inventory-items.SC-ins,g10adm.inventory-items.SC-g7s,g10adm.inventory-items.SC-ro5,g10adm.inventory-items.SC-law,g10adm.inventory-items.SC-3l7,g10adm.inventory-items.SC-h7o,g10adm.inventory-items.SC-3gy,g10adm.inventory-items.SC-udb,g10adm.inventory-items.SC-qr6,g10adm.inventory-items.SC-o2j,g10adm.inventory-items.SC-x19 -->
### g10adm.inventory-items.US2-TC9: An operator who may only read changes nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-02

**Pre-conditions:**

* An operator holds `inventory:read`, not `inventory:write`; item 11's mark stands open on a case the vault released.

**Steps:**

1. Open `<items>` and item 11.
2. Send a register and an edit of item 11 directly.

**Expected Results:**

* Step 1 offers no Register an item, Edit, Retire or Close mark.
* Step 2's requests are refused by name, and nothing changes.

---

## g10adm.inventory-items.US3: Operator moves an item to its new owner

**As a** member of shop staff when an item no place marks changes hands,
**I want** to move it to an account named by its exact email or to the
custodian, never the lender, with a reason and a proof document where I have
one,
**so that** anyone can later read who moved it, when, why and on what proof.

<!-- trace:case id=g10adm.inventory-items.TC-vs9 rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### g10adm.inventory-items.US3-TC1: An item moves to its new owner with a reason and any proof, and the move reads back

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* Item 12, collector A's, is marked by nothing and has never moved.

**Test data:**

| `<to>` | `<proof>` | `<proof cell>` |
| --- | --- | --- |
| collector B's exact email | one 1 MB PDF | the PDF, to download |
| collector B's exact email | 2 PDF, 2 PNG and 1 JPG, each exactly 10 MB | the five files |
| collector B's exact email | one PDF, removed before sending | that no proof was given |
| the custodian, from the company owners | none | that no proof was given |

**Steps:**

1. Read the moves, and click Transfer.
2. Name `<to>`, type Sold privately at the counter, pick `<proof>`, and click Transfer.
3. As an auditor, read the audit log since.

**Expected Results:**

* Step 1 says it has not changed owner; the company owners offer the custodian and never the lender.
* Step 2 reads the new owner; the top move reads from collector A to them, this staff member, now, the reason, and `<proof cell>`.
* Step 3 records the move; no email went to either owner.

<!-- trace:case id=g10adm.inventory-items.TC-yi8 rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### g10adm.inventory-items.US3-TC3: Transfer waits for a new owner, other than the present one, and a reason

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
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* Item 27, collector B's, is marked by nothing; staff opens Transfer.

**Test data:**

| `<owner>` | `<reason>` |
| --- | --- |
| collector A's exact email | none |
| an email no account holds | Sold privately |
| none | Sold privately |
| collector B's exact email | Sold privately |

**Steps:**

1. Fill in `<owner>` and `<reason>`, and read Transfer.

**Expected Results:**

* Transfer stays disabled, and the owner is unchanged.

<!-- trace:case id=g10adm.inventory-items.TC-3wd rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### g10adm.inventory-items.US3-TC4: A proof outside the rule is refused under the picker

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* Staff is in Transfer with collector B's email and a reason.

**Test data:**

| `<picked>` | `<picker reads>` |
| --- | --- |
| six 1 MB PDFs | no way to add a sixth, five listed |
| a PDF of 10 MB and 1 byte | the file refused, not listed |
| a 1 MB GIF | the file refused, not listed |

**Steps:**

1. Pick `<picked>`.

**Expected Results:**

* The picker reads `<picker reads>`, saying up to 5 PDF, PNG or JPG files of at most 10 MB each; Transfer is still offered.

<!-- trace:case id=g10adm.inventory-items.TC-33b rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### g10adm.inventory-items.US3-TC6: An item whose owner was erased asks for a new title when it moves

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* Item 13's owner was erased; nothing marks it.

**Steps:**

1. Read the owner and title, and click Transfer.
2. Choose the custodian and a reason; then type the title Charizard 1999 Base Set, and transfer.

**Expected Results:**

* Step 1 reads the owner and title as erased, and the dialog asks for a title.
* Transfer stays disabled until the title is typed; the item then reads the custodian and the new title, its top move from erased to the custodian.

<!-- trace:case id=g10adm.inventory-items.TC-l1c rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### g10adm.inventory-items.US3-TC8: Opening a proof is recorded

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* Item 14's top move carries one proof.

**Steps:**

1. Click the proof; as an auditor, read the audit log since.

**Expected Results:**

* It downloads; the log records who opened it.

<!-- trace:case id=g10adm.inventory-items.TC-ef6 rev=1 covers=g10adm.inventory-items.SC-gar,g10adm.inventory-items.SC-b7n,g10adm.inventory-items.SC-mkf,g10adm.inventory-items.SC-xzd,g10adm.inventory-items.SC-xvg,g10adm.inventory-items.SC-rwm,g10adm.inventory-items.SC-t95,g10adm.inventory-items.SC-f1a,g10adm.inventory-items.SC-2fo,g10adm.inventory-items.SC-4y8,g10adm.inventory-items.SC-ssg -->
### g10adm.inventory-items.US3-TC9: Without the transfer grant there is no move and no proof

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-03

**Pre-conditions:**

* An operator holds `inventory:read` and `inventory:write`, not `inventory:transfer`; item 14's top move carries a proof.

**Steps:**

1. Open item 14.
2. Ask for the proof, and send a transfer, directly.

**Expected Results:**

* Step 1 offers no Transfer and no proof to open, the moves still reading.
* Step 2 is refused by name, returning no file and leaving the owner.

---

## g10adm.inventory-items.US4: Operator learns which place marks an item before moving it

**As a** member of shop staff asked to move an item,
**I want** the move refused while a place marks the item, naming the place,
**so that** I never move an item the vault is still keeping for its owner.

<!-- trace:case id=g10adm.inventory-items.TC-t2x rev=1 covers=g10adm.inventory-items.SC-4vp,g10adm.inventory-items.SC-91a -->
### g10adm.inventory-items.US4-TC1: A marked item offers no Transfer, naming its place

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-04

**Pre-conditions:**

* Item 1 is marked by the vault on case 1.

**Steps:**

1. Open item 1.
2. Send a transfer of it directly.

**Expected Results:**

* Step 1 offers no Transfer or Retire, a line naming the vault and case 1; Edit is still offered.
* Step 2 is refused, naming the vault; no move is recorded.

<!-- trace:case id=g10adm.inventory-items.TC-pf9 rev=1 covers=g10adm.inventory-items.SC-4vp,g10adm.inventory-items.SC-91a,g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### g10adm.inventory-items.US4-TC2: A mark landing under an open dialog refuses the transfer or the retire

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
* **Trace:** grade10-admin-inventory-items-US-04

**Pre-conditions:**

* Staff holding `vault:operate` has `<dialog>` open on item 7, unmarked when the page opened; case 7 names item 7, its packet signed.

**Test data:**

| `<dialog>` |
| --- |
| Transfer, filled with collector B and a reason |
| Retire, duplicate chosen |

**Steps:**

1. In a second tab, confirm case 7 vaulted.
2. Send the dialog.

**Expected Results:**

* It is refused, naming the vault and case 7; item 7 stays live and collector A's, with no new move.

---

## g10adm.inventory-items.US5: Operator retires a duplicate record

**As a** member of shop staff who finds one object registered twice,
**I want** to retire the extra record as a duplicate, and to retire an item
lost, destroyed or left the platform the same way,
**so that** each object has one live record and the history of the others
stays readable.

<!-- trace:case id=g10adm.inventory-items.TC-uih rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### g10adm.inventory-items.US5-TC1: An item retired for its reason reads only, keeping its history

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
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* Item 15 is marked by nothing and has one move.

**Test data:**

| `<reason>` |
| --- |
| Duplicate |
| Lost |
| Destroyed |
| Left the platform |

**Steps:**

1. Click Retire, choose `<reason>`, and retire it.
2. Open the retired tab.

**Expected Results:**

* Retire is disabled until a reason is chosen; the page reads retired with `<reason>` and when, offering no Edit, Transfer or Retire, its facts and move still reading.
* Step 2 lists it with `<reason>`.

<!-- trace:case id=g10adm.inventory-items.TC-jk7 rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### g10adm.inventory-items.US5-TC2: A retired item's grader and cert can name a new item

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* Item 16, retired as a duplicate, carries PSA AB555; no live item does.

**Steps:**

1. Register a new item with PSA AB555.

**Expected Results:**

* It is registered; item 16 still reads retired with its facts.

<!-- trace:case id=g10adm.inventory-items.TC-tin rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### g10adm.inventory-items.US5-TC3: A retired item is restored with a reason

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* Item 17, retired as lost, carries PSA AB600; no live item does.

**Steps:**

1. Click Restore, type a reason, and confirm.
2. As an auditor, read the restore entry.

**Expected Results:**

* It reads live with its facts and history, offering Edit, Transfer and Retire, and leaves the retired tab.
* The entry names item 17 and not the reason's text.

<!-- trace:case id=g10adm.inventory-items.TC-7ds rev=1 covers=g10adm.inventory-items.SC-b2c,g10adm.inventory-items.SC-uc3,g10adm.inventory-items.SC-ynw,g10adm.inventory-items.SC-b91,g10adm.inventory-items.SC-93o -->
### g10adm.inventory-items.US5-TC4: A restore onto a live slab is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-05

**Pre-conditions:**

* Item 16, retired, carries PSA AB555; item 18, titled `<title 18>`, live, carries the same.

**Steps:**

1. Restore item 16 with a reason.

**Expected Results:**

* It is refused, naming and linking `<title 18>`; item 16 stays retired.

---

## g10adm.inventory-items.US6: Operator closes a mark the vault no longer has

**As a** member of shop staff looking at an item the vault has let go of,
**I want** to close the mark that is still showing, with a reason,
**so that** the item reads as not marked and can be moved or retired.

<!-- trace:case id=g10adm.inventory-items.TC-cif rev=1 covers=g10adm.inventory-items.SC-t3v,g10adm.inventory-items.SC-iac,g10adm.inventory-items.SC-m22 -->
### g10adm.inventory-items.US6-TC1: A mark the vault let go of is closed by hand with a reason

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
* **Trace:** grade10-admin-inventory-items-US-06

**Pre-conditions:**

* Item 19 is still marked on case 19, which reads `<case reads>`, its word never reaching the register.

**Test data:**

| `<case reads>` |
| --- |
| Released |
| Unwound |
| Forfeited |
| Erased |

**Steps:**

1. Click Close mark, type a reason, and close it.

**Expected Results:**

* Close mark is disabled until a reason is typed; the place row then reads closed by hand, naming who, when and the reason; the item reads not marked, offering Transfer and Retire, and leaves the marked tab.

<!-- trace:case id=g10adm.inventory-items.TC-z4f rev=1 covers=g10adm.inventory-items.SC-t3v,g10adm.inventory-items.SC-iac,g10adm.inventory-items.SC-m22 -->
### g10adm.inventory-items.US6-TC2: A mark the vault still holds stays open

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
* **Trace:** grade10-admin-inventory-items-US-06

**Pre-conditions:**

* Item 1 is marked on case 1, which reads `<case reads>`.

**Test data:**

| `<case reads>` |
| --- |
| Vaulted |
| Active |
| Repaid, not yet released |
| Released, the vault not answering |

**Steps:**

1. Open item 1, and send a close of its mark directly with a reason.

**Expected Results:**

* No Close mark is offered; the close is refused by name, and item 1 still reads marked.

---

## g10adm.inventory-items.US8: Admin erases a collector who owns items

**As an** admin running an erasure,
**I want** the register to refuse while a place marks an item the person
owns, and otherwise to remove them from their items and moves while keeping
each item's grader, grade and cert,
**so that** the person is forgotten and the objects the house holds keep
their record.

<!-- trace:case id=g10adm.inventory-items.TC-bs3 rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### g10adm.inventory-items.US8-TC1: The person goes and the object stays, and a second run changes nothing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Erasure

**Pre-conditions:**

* An admin holding `user:delete` is on collector F's matured erasure checklist; collector F owns item 21, unmarked: trading card, PSA, 9, AB900, with a title and description.

**Steps:**

1. Run inventory's erasure, and open item 21.
2. Search PSA AB900, then collector F's exact email.
3. Run inventory's erasure again.

**Expected Results:**

* Step 1 reports nothing in its way and nothing remaining; the owner and title read erased, the description is empty, and trading card, PSA, 9 and AB900 still read.
* Step 2 finds item 21, then nothing.
* Step 3 answers with nothing left.

<!-- trace:case id=g10adm.inventory-items.TC-3ml rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### g10adm.inventory-items.US8-TC2: An erasure waits while the vault marks the person's item

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
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* An admin holding `user:delete` is on collector G's matured checklist; collector G owns `<marked>`.

**Test data:**

| `<marked>` |
| --- |
| item 22, marked on case 22 |
| item 22 on case 22, and item 23 on case 23 |

**Steps:**

1. Read inventory's entry, and run its erasure.

**Expected Results:**

* The entry shows a line per marked item, naming its id, the vault and its case; the run is refused, every item still reading collector G's, its title and description intact.

<!-- trace:case id=g10adm.inventory-items.TC-2rh rev=1 covers=g10adm.inventory-items.SC-p6v,g10adm.inventory-items.SC-xp1,g10adm.inventory-items.SC-x39,g10adm.inventory-items.SC-vig -->
### g10adm.inventory-items.US8-TC3: A move keeps its proof while the other party remains

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
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* An admin is on collector F's matured checklist; item 24 moved between collector F and `<other>` with a reason and a proof, `<days>` days ago.

**Test data:**

| `<other>` | `<days>` |
| --- | --- |
| collector B, a live account | 30 |
| the custodian | 30 |
| collector B | 2,556 |

**Steps:**

1. Run inventory's erasure, and read item 24's move.

**Expected Results:**

* Collector F's side reads erased and the reason is gone; the other side still reads, and the proof is kept to download; the checklist line reads nothing remaining.

<!-- trace:case id=g10adm.inventory-items.TC-etk rev=1 -->
### g10adm.inventory-items.US8-TC4: A move with an erased other party loses its proof

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-inventory-items-US-08

**Pre-conditions:**

* An admin is on collector F's matured checklist; item 24 moved 30 days ago between collector F and collector H, already erased, with a reason and a proof.

**Steps:**

1. Run inventory's erasure, and read the move.

**Expected Results:**

* Both sides read erased, the reason gone, and the proof cell reads proof removed.
