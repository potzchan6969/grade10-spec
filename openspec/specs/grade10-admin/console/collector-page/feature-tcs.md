# grade10-admin/console/collector-page Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4
**Out of suite:** `grade10-admin-console-collector-page-SC-07` — the vault worker's test of `admin.collectorCases` with the audit write failing; `grade10-admin-console-collector-page-SC-17` — the `CollectorPage` story with the header held pending, and its colocated test.

## grade10-admin-console-collector-page-US1: Operator opens a collector's page from their name

**As a** member of shop staff,
**I want** a collector's name to open one page holding who they are and
every vault case they hold,
**so that** I can answer a customer about all of their cases from one place.

### grade10-admin-console-collector-page-US1-TC1-1: A collector's name opens their page with who they are and every vault case

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>`, named Chan Tai Man at `tai.man@example.com`, holds three vault cases: one submitted, one vaulted, one cancelled, each touched on a different day.

**Steps:**

1. In the Needs staff view, click the link beside Chan Tai Man to their collector page.
2. Read the address, the nav and the header.
3. Read the vault cases section.
4. Click the first case row.

**Expected Results:**

* Step 1 opens `admin.grade10.com/vault/collectors/<collector_A user id>`, with the Vault entry marked in the nav.
* The header reads Chan Tai Man and `tai.man@example.com`.
* The vault cases section lists all three cases, each with its reference, item, status, lane and last touched, newest-touched first.
* Step 4 opens that case's own page.

### grade10-admin-console-collector-page-US1-TC2-1: Every route to a collector's page lands on the same page

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>.
* `<collector_A>` holds a vaulted case `<case_1>` with reference `<case_1 reference>`, phone `+852 9123 4567` and email `tai.man@example.com`.

**Test data:**

| Route |
| --- |
| the link beside the collector's name on `<case_1>`'s Held items row |
| The collector's cases in `<case_1>`'s header |
| The collector's cases in the header of the case an exact search for `tai.man@example.com` finds |
| The collector's cases in the header of the case an exact search for `+852 9123 4567` finds |
| The collector's cases in the header of the case a search for `<case_1 reference>` finds |

**Steps:**

1. Reach `<case_1>` or its row by the route in the row.
2. Follow the route's link.

**Expected Results:**

* The collector page for `<collector_A>` opens at `admin.grade10.com/vault/collectors/<collector_A user id>`.

### grade10-admin-console-collector-page-US1-TC3-1: Each opening of a collector's page is on the audit chain

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on <grade10 admin vault queue url>, and `<collector_A>` holds a vault case.
* admin(auditor, holds audit:read) is signed in to the console's audit trail.

**Steps:**

1. Open `<collector_A>`'s collector page.
2. Reload the page.
3. As admin(auditor), read the audit trail for entries since step 1 naming `<collector_A user id>`.

**Expected Results:**

* Steps 1 and 2 each leave a header-read entry and a cases-read entry naming the staff member, the time and `<collector_A user id>`.
* No entry holds `<collector_A>`'s name or email.

### grade10-admin-console-collector-page-US1-TC4-1: The vault cases section pages and says whether there is more

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is on `<collector_D>`'s collector page.
* `<collector_D>` holds `<page size>` plus one vault cases.

**Test data:**

| Field | Value |
| --- | --- |
| `<page size>` | 50, the console's page (Q43) |

**Steps:**

1. Read the vault cases section.
2. Load the next page.

**Expected Results:**

* Step 1 lists `<page size>` cases, newest-touched first, and says there is more.
* Step 2 adds the one remaining case, oldest-touched, and says there is no more.
* No case is listed twice.

### grade10-admin-console-collector-page-US1-TC5-1: A collector holding no vault case reads as such

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.
* `<account_E>`, named Lee Ka Yan, is an account that has never held a vault case.

**Steps:**

1. Open `admin.grade10.com/vault/collectors/<account_E user id>`.

**Expected Results:**

* The header shows `<account_E>`'s short id and says it holds no vault case.
* The vault cases section says the collector holds no vault case.

### grade10-admin-console-collector-page-US1-TC6-1: A name the account service cannot answer reads as unavailable and the cases still load

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console, and `<collector_A>` holds two vault cases.
* The account service fails to answer names.

**Steps:**

1. Open `<collector_A>`'s collector page.

**Expected Results:**

* The header reads `<collector_A>`'s short id and "name unavailable", and no email.
* The vault cases section lists both cases.

### grade10-admin-console-collector-page-US1-TC7-1: A section that fails shows its own error and retry while the other stands

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console, and `<collector_A>`, named Chan Tai Man, holds two vault cases.
* The read behind the row's failing section fails until the tester clicks its retry, then answers.

**Test data:**

| Failing section | Standing section reads |
| --- | --- |
| the vault cases section | the header, Chan Tai Man and their email |
| the header | the vault cases section, both cases |

**Steps:**

1. Open `<collector_A>`'s collector page.
2. Click the failing section's retry.

**Expected Results:**

* Step 1 shows the failing section's own error with a retry, and the standing section reads as the row says.
* Step 2 loads the failing section; the standing section is unchanged.

### grade10-admin-console-collector-page-US1-TC8-1: An id no account answers to says so

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.

**Test data:**

| User id |
| --- |
| a well-formed user id no account holds |
| `not-a-user-id` |

**Steps:**

1. Open `admin.grade10.com/vault/collectors/<user id>` with the row's id.

**Expected Results:**

* The page says nobody answers to that id.
* No header name, email or case is shown.

### grade10-admin-console-collector-page-US1-TC9-1: Only a vault read holder opens a collector's page

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
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* `<collector_A>`, named Chan Tai Man, holds a vault case.

**Test data:**

| Actor | Outcome |
| --- | --- |
| admin(admin) | the page opens with the name, email and cases |
| admin(holds a console grant but not vault:read) | refused; no name, email or case shown |
| customer(collector), `<collector_A>` themselves | no console; refused |
| signed out | the console's sign-in |

**Steps:**

1. As the row's actor, open `admin.grade10.com/vault/collectors/<collector_A user id>`.

**Expected Results:**

* The page matches the row's outcome.

### grade10-admin-console-collector-page-US1-TC10-1: A case no account holds offers no collector page

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
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.
* `<case_9>` is a case whose collector's account has been erased.

**Steps:**

1. Open `<case_9>`'s page.
2. Read its header.

**Expected Results:**

* The header carries no **The collector's cases** link.
* Nothing on the page links a collector's page.

### grade10-admin-console-collector-page-US1-TC11-1: The header opens the queue narrowed to the collector

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* `<collector_A>`, named Chan Tai Man, holds two submitted vault cases, `<case_1>` and `<case_2>`, neither with a visit booked.

**Test data:**

| Actor |
| --- |
| admin(staff, holds vault:read and kyc:read) |
| admin(treasurer, holds vault:read and vault:payout) |

**Steps:**

1. As the row's actor, open `<collector_A>`'s collector page.
2. Follow **Their cases on the queue** in the header.
3. Open the Needs staff view.

**Expected Results:**

* The queue opens on its landing view, narrowed to `<collector_A>`.
* Needs staff lists `<case_1>` and `<case_2>` and no other case.

### grade10-admin-console-collector-page-US1-TC12-1: Cases removed from the account or erased are not listed

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
* **Trace:** grade10-admin-console-collector-page-US-01

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.
* `<collector_A>` holds a released case `<case_1>`; a walk-in staff opened for them was cancelled by staff and removed; another case of theirs was erased.

**Steps:**

1. Open `<collector_A>`'s collector page.

**Expected Results:**

* The vault cases section lists `<case_1>` alone.

### grade10-admin-console-collector-page-US1-TC13-1: An account that never held a vault case is not named

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:read and kyc:read) is signed in to the console.
* `<account_B>`, named Lee Siu Ming at `siu.ming@example.com`, has never held a vault case.

**Steps:**

1. Open `admin.grade10.com/vault/collectors/<account_B user id>`.

**Expected Results:**

* The header shows `<account_B>`'s short id and says it holds no vault case.
* Neither `Lee Siu Ming` nor `siu.ming@example.com` is shown, and the header's read returns neither.

---

## grade10-admin-console-collector-page-US2: Treasurer reads a collector's cases without their name

**As a** treasurer,
**I want** the collector page to show the cases they hold,
**so that** I can follow a borrower's money across their cases without being
shown a name my role does not hold.

### grade10-admin-console-collector-page-US2-TC1-1: A treasurer reads the collector's cases under their short id and no name

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-console-collector-page-US-02

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/collectors.spec.ts`

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) is on the page of `<case_2>`, a live loan of `<collector_A>`, named Chan Tai Man at `tai.man@example.com`, who holds two vault cases.

**Steps:**

1. Click The collector's cases in the case header.
2. Read the header and the vault cases section.
3. Open `<case_2>` from the section.

**Expected Results:**

* Step 1 opens `admin.grade10.com/vault/collectors/<collector_A user id>`.
* The header reads `<collector_A>`'s short id; it carries no name and no email.
* The vault cases section lists both cases with reference, item, status, lane and last touched.
* Step 3's case page shows `tai.man@example.com` as its contact.

### grade10-admin-console-collector-page-US2-TC2-1: The header's name read refuses a caller without the identity grant

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** security
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-admin-console-collector-page-US-02

**Pre-conditions:**

* admin(treasurer, holds vault:read and vault:payout) holds a verified console session.
* `<collector_A>` is an account with a name and an email.

**Steps:**

1. Call the collector page's header read for `<collector_A>` directly.
2. Call the collector page's vault cases read for `<collector_A>` directly.

**Expected Results:**

* Step 1 is refused for the missing identity grant, and no name or email comes back.
* Step 2 answers with `<collector_A>`'s cases.

## Settled

- The vault cases section pages 50 at a time, as every console list does.
- A reader without the identity grant reads neither the name nor the email in the header; each case keeps its own contact.
- An account the service cannot read shows neither its name nor its email: both are one read of the account.
- The section lists every case at every status, a case removed from the account or erased excepted.
- Every opening is on the audit chain, whoever opens the page.

## Reconciliation

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote 11 cases over two journeys and raised seven questions for this capability; the scenario pass issued `grade10-admin-console-collector-page-SC-01` to `grade10-admin-console-collector-page-SC-17`. One scenario was folded here, `grade10-admin-console-collector-page-SC-18`, and one case added.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-admin-console-collector-page-US1-TC1-1` | Joined | `grade10-admin-console-collector-page-SC-01`, `grade10-admin-console-collector-page-SC-03`, `grade10-admin-console-collector-page-SC-08` and `grade10-admin-console-collector-page-SC-12` |
| `grade10-admin-console-collector-page-US1-TC2-1` | Joined | `grade10-admin-console-collector-page-SC-03` for the held row and the case header's link, as the requirement states it for every vault read holder; Q39 decided that a search result names no collector, so the three search rows reach the page through the found case's header |
| `grade10-admin-console-collector-page-US1-TC3-1` | Joined | `grade10-admin-console-collector-page-SC-06`; a reload is a second opening, and the header's read is recorded with the cases' (Q55) |
| `grade10-admin-console-collector-page-US1-TC4-1` | Joined | `grade10-admin-console-collector-page-SC-13`; the page size is 50, Q43 |
| `grade10-admin-console-collector-page-US1-TC5-1` | Joined | `grade10-admin-console-collector-page-SC-14`, with the header `grade10-admin-console-collector-page-SC-22` states for an account that never held a case; rewritten at review, as the header no longer names such an account |
| `grade10-admin-console-collector-page-US1-TC6-1` | Joined | `grade10-admin-console-collector-page-SC-10` |
| `grade10-admin-console-collector-page-US1-TC7-1` | Joined | `grade10-admin-console-collector-page-SC-16` for the cases row and `grade10-admin-console-collector-page-SC-20` for the header row, Q51 |
| `grade10-admin-console-collector-page-US1-TC8-1` | Joined | `grade10-admin-console-collector-page-SC-11`, the malformed id reading the same, Q40 |
| `grade10-admin-console-collector-page-US1-TC9-1` | Joined | `grade10-admin-console-collector-page-SC-02` |
| `grade10-admin-console-collector-page-US2-TC1-1` | Joined | `grade10-admin-console-collector-page-SC-04`, `grade10-admin-console-collector-page-SC-09` and `grade10-admin-console-collector-page-SC-15` |
| `grade10-admin-console-collector-page-US2-TC2-1` | Folded | `grade10-admin-console-collector-page-SC-18`: the header reads under the identity grant, Q2 and Q9, and no scenario walked the read itself being refused |
| `grade10-admin-console-collector-page-SC-05` | Case added | `grade10-admin-console-collector-page-US1-TC10-1` |
| `grade10-admin-console-collector-page-SC-19` | Case added | `grade10-admin-console-collector-page-US1-TC11-1`, Q42 |
| `grade10-admin-console-collector-page-SC-21` | Case added | `grade10-admin-console-collector-page-US1-TC12-1`, Q46 |
| `grade10-admin-console-collector-page-SC-22` | Case added | `grade10-admin-console-collector-page-US1-TC13-1`, Q52 |
| `grade10-admin-console-collector-page-SC-07` | Out of suite | the vault worker's test of `admin.collectorCases` with the audit write failing, task 7.1; a person cannot make the chain unwritable from the console; listed under the header |
| `grade10-admin-console-collector-page-SC-17` | Out of suite | the `CollectorPage` story with the header held pending and its colocated test, task 10.1 and the ui-design Loading row; listed under the header |
| Raised: the cases section's page size | Settled | Q43 |
| Raised: a treasurer's header and the email | Settled | Q44 |
| Raised: an unknown id told apart from an account holding no case | Settled | Q40 and Q52: an unknown or malformed id reads as nobody, an account that never held a case reads as holding none |
| Raised: the email when the name is unavailable | Settled | Q45 |
| Raised: which statuses the section lists | Settled | Q46; `grade10-admin-console-collector-page-SC-12` lists three statuses, a released case among them |
| Raised: a treasurer's opening on the audit chain | Settled | Q47; the requirement records every opening |
| Raised: which journey owns the treasurer's rows | Settled | Q48; walked by `grade10-admin-vault-operator-queue-US11-TC4-1` |
| Raised by this pass: the header when its read fails | Settled | Q51, `grade10-admin-console-collector-page-SC-20` |
| Design: Loading, Header, Header treasurer, Header unavailable, Vault cases, Vault cases none, Section failed, Unknown collector | Closed on the row | `ui-design.md` names `grade10-admin-console-collector-page-SC-17`, `grade10-admin-console-collector-page-SC-08`, `grade10-admin-console-collector-page-SC-09`, `grade10-admin-console-collector-page-SC-10`, `grade10-admin-console-collector-page-SC-12`, `grade10-admin-console-collector-page-SC-14`, `grade10-admin-console-collector-page-SC-16` and `grade10-admin-console-collector-page-SC-11` |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-admin-console-collector-page-US1-TC4-1` | Sixty seeded cases is a fixture, not a walk; the worker's test pages them, and a person reads the section's more line |
| `grade10-admin-console-collector-page-US1-TC6-1` | An account service that answers nothing for one account is not something the isolated stack can stand; the header's component test decides it |
| `grade10-admin-console-collector-page-US1-TC9-1` | Deferred at review: rows whose outcomes no rule states, and a console grant the tester has to choose |
| `grade10-admin-console-collector-page-US1-TC10-1` | Deferred at review: a case whose account was erased has no route by hand, and no test decides it yet |
| `grade10-admin-console-collector-page-US1-TC12-1` | Deferred at review: no route erases one case of a collector by hand, and no test decides it yet |
| `grade10-admin-console-collector-page-US2-TC2-1` | Layer api: the vault worker's test refuses the header's read without kyc:read |
