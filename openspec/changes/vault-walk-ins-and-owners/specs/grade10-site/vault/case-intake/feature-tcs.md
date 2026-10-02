# grade10-site/vault/case-intake Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-01, tcs-rules r4

## grade10-site-vault-case-intake-US6: Collector sends a request staff opened for them at the counter

**As a** collector whose request staff opened at the counter,
**I want** to sign in on my own phone, read the request and the photos back,
and tick that I have read the collection statement before I send it,
**so that** nothing happens to my item on a request I have not seen, and a
request typed under the wrong address is never emailed.

### grade10-site-vault-case-intake-US6-TC1-1: The collector signs in, finds the draft staff opened and sends it

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened a walk-in draft `<case_1>` for `<walk-in email>`, financed, 500000 HKD minor units, with title Charizard 1st Edition and two of staff's photographs; nobody has signed in to that account yet.
* The collection statement is written at version `<statement version>`.
* customer(collector) holds `<walk-in email>`'s mailbox, on their own phone, signed out, at `grade10.com/vault`.

**Steps:**

1. Ask for a sign-in link for `<walk-in email>` in the sign-in dialog.
2. Open the link from the mailbox.
3. Read the case list.
4. Open `<case_1>` from its card.
5. Continue to the Review step and read what it reads back.
6. Tick the collection statement and click Send it in.
7. As admin(staff, holds vault:read), open the queue's Needs staff view on <grade10 admin vault queue url>.

**Expected Results:**

* Step 3 lists `<case_1>` as a draft, reading that staff opened it at the counter.
* Step 4 opens the wizard on the draft, as any draft reopens.
* Step 5 reads back the title, the amount and both of staff's photographs.
* Step 6 sends the request: it reads submitted, the statement's `<statement version>` kept with the send, and the page offers to book a visit.
* Step 7 lists `<case_1>`; it has left the Drafts view.

### grade10-site-vault-case-intake-US6-TC2-1: The collector changes staff's facts and photographs before sending

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in at `grade10.com/vault` and holds walk-in draft `<case_1>`, opened by staff with title Charizard 1st Edition, 500000 HKD minor units, and two of staff's photographs.

**Steps:**

1. Open `<case_1>` from the case list.
2. Remove one of staff's photographs and attach one of the collector's own.
3. On the Describe step, change the title to Charizard 1st Edition PSA 9 and the amount to 300000 HKD minor units.
4. On the Review step, tick the collection statement and click Send it in.
5. As admin(staff, holds vault:read), open `<case_1>` on <grade10 admin vault case url>.

**Expected Results:**

* Step 4 reads back the new title, 300000 HKD minor units, staff's remaining photograph and the collector's own.
* Step 5 shows the request as the collector sent it, not as staff typed it.
* Nothing was emailed to the collector before step 4's send.

### grade10-site-vault-case-intake-US6-TC3-1: The statement shown at the counter does not stand in for the collector's tick

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in and on the Review step of walk-in draft `<case_1>`, whose open kept the statement shown at the counter; the tick is unticked.

**Steps:**

1. Click Send it in without ticking the statement.

**Expected Results:**

* Send it in is refused with a line under the tick.
* `<case_1>` stays a draft.

### grade10-site-vault-case-intake-US6-TC4-1: A walk-in draft fills the collector's draft cap

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in and on the case list at `grade10.com/vault`, holding the unsent drafts in the row.

**Test data:**

| Unsent drafts held | Start a request |
| --- | --- |
| one walk-in draft and one of their own | opens the wizard |
| one walk-in draft and two of their own | refused with the draft-limit message |
| three walk-in drafts | refused with the draft-limit message |

**Steps:**

1. Click Start a request.

**Expected Results:**

* The outcome matches the row; a refusal opens no new draft.

### grade10-site-vault-case-intake-US6-TC5-1: A walk-in draft is not another collector's to read

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` under `<walk-in email>`'s account, with two of staff's photographs.
* customer(collector) is signed in at `grade10.com/vault` under a different account.

**Steps:**

1. Read the case list.
2. Open `grade10.com/vault/cases/<case_1 id>`.
3. Open the address of one of `<case_1>`'s photographs.

**Expected Results:**

* Step 1 does not list `<case_1>`.
* Step 2 reads the not-found page.
* Step 3 is refused; the photograph is not served.

### grade10-site-vault-case-intake-US6-TC6-1: Nothing is valued, booked or emailed on a draft staff opened until it is sent

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* Staff opened walk-in draft `<case_1>` for `<walk-in email>`, a mailbox the tester reads, with one of staff's photographs.
* customer(collector) holding `<walk-in email>` is signed in at `grade10.com/vault`.
* admin(staff, holds vault:operate and vault:approve) has `<case_1>`'s page open on <grade10 admin vault case url>.

**Steps:**

1. As staff, read the acts `<case_1>`'s page offers.
2. As the collector, read `<case_1>` on the case list and open it.
3. Wait <mail delivery window> and read `<walk-in email>`'s inbox.

**Expected Results:**

* Step 1 offers Cancel, and nothing to value and no visit to book.
* Step 2 offers no visit to book.
* Step 3 holds no message about `<case_1>`.

### grade10-site-vault-case-intake-US6-TC7-1: The collector removes a photograph before the send and never after

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
* **Trace:** grade10-site-vault-case-intake-US-06

**Pre-conditions:**

* customer(collector) is signed in on <grade10 site url>.
* `<case_1>` is a draft staff opened for them at the counter, carrying staff's photographs `<photo_a>` and `<photo_b>`; `<case_2>` is a request they sent, carrying two photographs.

**Steps:**

1. Open `<case_1>` and remove `<photo_a>`.
2. Open `<case_2>` and try to remove one of its photographs.

**Expected Results:**

* Step 1 leaves `<case_1>` carrying `<photo_b>` alone, and `<photo_a>` is no longer served.
* Step 2 is refused by name, and `<case_2>` still carries both photographs.
* `<case_1>` carries no contact number until the collector adds one.

## Reconciliation

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
| `grade10-site-vault-case-intake-SC-38` | Case added | `grade10-site-vault-case-intake-US6-TC7-1`'s second step |
