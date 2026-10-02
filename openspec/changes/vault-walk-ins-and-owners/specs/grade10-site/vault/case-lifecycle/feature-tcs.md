# grade10-site/vault/case-lifecycle Test Cases

**Status:** in-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-vault-case-lifecycle-US1: Collector calls off a request before the item is in the vault

**As a** collector,
**I want** to end my own request at any point before I hand the item over,
**so that** nothing is left open in my name and any visit I booked goes with
it.

### grade10-site-vault-case-lifecycle-US1-TC4-1: The collector cancels a draft staff opened for them

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-01

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, a mailbox the tester reads, with two of staff's photographs.
* customer(collector) holding `<walk-in email>` is signed in at `grade10.com/vault`.

**Test data:**

| Field | Value |
| --- | --- |
| `<mail delivery window>` | 5 minutes (assumed; any wait past the first send attempt) |

**Steps:**

1. Open `<case_1>` from the case list.
2. Cancel the request and confirm.
3. Read the case list.
4. Wait <mail delivery window> and read `<walk-in email>`'s inbox.

**Expected Results:**

* Step 2 ends `<case_1>` as cancelled.
* Step 3 lists `<case_1>` as a cancelled request.
* Step 4 holds no message about `<case_1>`.

---

## grade10-site-vault-case-lifecycle-US6: Operator opens a walk-in again under the right address

**As a** member of shop staff who typed a customer's address wrong,
**I want** to cancel the unsent draft and open it again under the right
address,
**so that** the customer can send it, and the account at the wrong address
is never emailed and keeps nothing of it.

### grade10-site-vault-case-lifecycle-US6-TC1-1: Staff cancel a mistyped walk-in and open it again under the right address

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** acceptance
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) is on the page of walk-in draft `<case_1>`, opened for `<wrong email>` with two of staff's photographs; nobody has signed in to that account.
* Neither `<wrong email>` nor `<right email>` has received any message.
* `<right email>` is a mailbox the tester reads.

**Test data:**

| Field | Value |
| --- | --- |
| `<wrong email>` | `taiman.chn@example.com` |
| `<right email>` | `taiman.chan@example.com` |

**Steps:**

1. Click Cancel on `<case_1>` and confirm.
2. Open a walk-in for `<right email>` with the same facts and photographs.
3. As customer(collector) holding `<right email>`, sign in at `grade10.com/vault` and read the case list.

**Expected Results:**

* Step 1 ends `<case_1>`, and `<case_1>`'s page reads cancelled.
* Step 2 opens a new draft, `<case_2>`, with a reference of its own, under `<right email>`'s account.
* Step 3 lists `<case_2>` as a draft staff opened at the counter, and does not list `<case_1>`.
* Nothing about `<case_1>` or `<case_2>` is emailed to `<wrong email>` or `<right email>`; `<right email>` receives only its sign-in link.

### grade10-site-vault-case-lifecycle-US6-TC2-1: The account at the wrong address keeps nothing of a cancelled walk-in

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** security
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<wrong email>`, with two of staff's photographs whose addresses the tester has noted; for the second row, someone has since signed in to that account without sending it.
* The tester noted `<wrong email>`'s collector page address and one of `<case_1>`'s photograph addresses before the cancel.
* admin(staff, holds vault:operate and kyc:read) has cancelled `<case_1>` from the console.

**Test data:**

| Signed in to `<wrong email>` before the cancel |
| --- |
| nobody |
| someone, who did not send it |

**Steps:**

1. As admin(staff), open the noted collector page address.
2. As customer(collector) holding `<wrong email>`, sign in at `grade10.com/vault` and read the case list.
3. As that customer, open the noted photograph address.
4. Start three new requests, leaving each as a draft.

**Expected Results:**

* Step 1 lists no vault case for the account.
* Step 1's page answers for the account, never that nobody answers to that id.
* Step 2 lists nothing: no draft and no cancelled case.
* Step 3 is refused; the photograph is not served.
* Step 4 opens three drafts; the cancelled walk-in takes none of the account's three.
* `<wrong email>`'s mailbox holds no message about `<case_1>`.
* The queue's Closed view lists `<case_1>` under its reference, its item reading as erased and no collector named.

### grade10-site-vault-case-lifecycle-US6-TC3-1: A walk-in nobody sends ends on the seven-day draft clock and leaves nothing on the account

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
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Pre-conditions:**

* Walk-in draft `<case_1>` was opened for `<walk-in email>` and nobody has touched it since, for the time in the row.
* admin(staff, holds vault:read and kyc:read) is signed in to the console.

**Test data:**

| Untouched for | `<case_1>` |
| --- | --- |
| 7 days less one hour | still a draft, in the Drafts view |
| 7 days and one sweep | ended as expired; no longer under the account |
| 8 days, the collector having changed its title on day 5 | still a draft, the edit having restarted its clock |

**Steps:**

1. Let the draft clock's sweep run.
2. Open the queue's Drafts view.
3. Open the collector page of `<walk-in email>`'s account.

**Expected Results:**

* `<case_1>` reads as the row says.
* An expired `<case_1>` is not listed on the collector page, and nothing is emailed to `<walk-in email>`.
* An expired `<case_1>` stays in the queue's Closed view under its reference, its item reading as erased and no collector named.

### grade10-site-vault-case-lifecycle-US6-TC4-1: A walk-in the collector already sent is cancelled like any case

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* customer(collector) sent walk-in `<case_1>`, carrying two photographs, from their own phone; it reads submitted.
* admin(staff, holds vault:operate) is on `<case_1>`'s page.

**Steps:**

1. Cancel `<case_1>` and confirm.
2. As the collector, read the case list at `grade10.com/vault`.
3. Open `<case_1>`.

**Expected Results:**

* Step 2 lists `<case_1>` as cancelled.
* Step 3 reads that staff called the request off, with its photographs still shown.

### grade10-site-vault-case-lifecycle-US6-TC5-1: Staff cancelling a walk-in the collector has just sent is refused by name

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
* **Trace:** grade10-site-vault-case-lifecycle-US-06

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate) has walk-in draft `<case_1>`'s page open, read while it was a draft.
* customer(collector) has since sent `<case_1>` from their own phone.

**Steps:**

1. Without reloading, click Cancel and confirm.

**Expected Results:**

* The cancel is refused by name, saying the case moved.
* `<case_1>` stays submitted, on the collector's list, with its photographs.

## Settled

- A draft staff opened runs out 7 days from its last touch, so a collector's edit restarts the clock; it stays a draft staff opened until it is sent, silent and removed from the account when it runs out.
- Staff's cancel of an unsent draft staff opened removes it and emails nobody, whoever has signed in to the account since it opened.
- A collector who read a draft staff opened and never sent it loses it from their list without a word when the clock ends it.

## Reconciliation

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote five cases over one journey and raised five questions for this capability, writing no case for the collector's own cancel; the scenario pass issued `grade10-site-vault-case-lifecycle-SC-41` to `grade10-site-vault-case-lifecycle-SC-44` and carried `grade10-site-vault-case-lifecycle-SC-09` and `grade10-site-vault-case-lifecycle-SC-10` in its MODIFIED block. Two scenarios were folded here, `grade10-site-vault-case-lifecycle-SC-45` and `grade10-site-vault-case-lifecycle-SC-46`, and one case added.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-case-lifecycle-US6-TC1-1` | Joined | `grade10-site-vault-case-lifecycle-SC-41` and `grade10-site-vault-case-lifecycle-SC-42` |
| `grade10-site-vault-case-lifecycle-US6-TC2-1` | Joined | `grade10-site-vault-case-lifecycle-SC-41`; the empty collector page is `grade10-admin/console/collector-page`'s rule that a removed case is not listed, and the freed places are the intake cap's |
| `grade10-site-vault-case-lifecycle-US6-TC3-1` | Joined | `grade10-site-vault-case-lifecycle-SC-43` and `grade10-site-vault-case-lifecycle-SC-47`; the expired case stays in the Closed view reading as erased, Q29 |
| `grade10-site-vault-case-lifecycle-US6-TC2-1` | Joined | `grade10-site-vault-case-lifecycle-SC-48` for the row someone signed in to, Q31 |
| `grade10-site-vault-case-lifecycle-US6-TC4-1` | Folded | `grade10-site-vault-case-lifecycle-SC-45`: the requirement ends a draft staff opened only while it is unsent, and no scenario walked the sent one cancelled, told and kept |
| `grade10-site-vault-case-lifecycle-US6-TC5-1` | Folded | `grade10-site-vault-case-lifecycle-SC-46`: the durable guarded-move rule refuses a move on any status change under its caller, and no scenario walked staff's cancel racing the collector's send. The tech design's `admin.cancel` now carries the status the page read |
| `grade10-site-vault-case-lifecycle-SC-44` | Case added | `grade10-site-vault-case-lifecycle-US1-TC4-1`, under the collector's own journey the scenario serves; Q28 keeps it on their list |
| Raised: the collector's own cancel of a draft staff opened | Settled | Q28; `grade10-site-vault-case-lifecycle-SC-44` |
| Raised: a walk-in that runs out at the right address | Settled | Q20, Q23 and Q29; `grade10-site-vault-case-lifecycle-SC-43` and `grade10-site-vault-case-lifecycle-SC-41` |
| Raised: the clock on a draft staff opened, and a collector's edit | Settled | Q30 |
| Raised: a sign-in to the wrong account before staff cancel | Settled | Q31; `grade10-site-vault-case-lifecycle-SC-41` removes it whoever has signed in |
| Raised: staff's queue after an unsent walk-in is cancelled | Settled | Q29; `grade10-site-vault-case-lifecycle-SC-41` |
| Dev: the collector's own photographs on a removed draft | Settled | Q49; every photograph on it is removed |
| Dev: a removed walk-in reading as erased on staff's Closed view | Settled | Q29 |
| Design: Cancelled for a typo, Cancelled before sending | Closed on the row | `ui-design.md` names `grade10-site-vault-case-lifecycle-SC-41` and `grade10-site-vault-case-lifecycle-SC-44`; the second row is Q28's |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-case-lifecycle-US1-TC4-1` | A person cancels a draft staff opened from the collector's side and reads the mailbox; the worker's test decides it stays listed |
| `grade10-site-vault-case-lifecycle-US6-TC3-1` | Deferred at review: a row the pre-condition contradicts, and the collector's own list is never read |
