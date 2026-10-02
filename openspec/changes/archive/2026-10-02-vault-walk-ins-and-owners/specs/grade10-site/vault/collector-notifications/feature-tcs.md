# grade10-site/vault/collector-notifications Test Cases

**Status:** approved
**Reviewed:** 2026-10-02, tcs-rules r4

## grade10-site-vault-collector-notifications-US2: Collector hears about everything that happens to their case

**As a** collector,
**I want** a message for each thing that happens to my case, with a link
straight to it,
**so that** I never have to ask the shop what stage my item is at.

### grade10-site-vault-collector-notifications-US2-TC14-1: Cancelling a draft staff opened sends nothing, and a sent one is told as any case

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* `<case_1>` is a walk-in staff opened for `<walk-in email>`, a mailbox the tester reads, in the row's state.
* admin(staff, holds vault:operate) is on `<case_1>`'s page.
* `<mail delivery window>` is 5 minutes (assumed; any wait past the first send attempt).

**Test data:**

| `<case_1>` state | Message to `<walk-in email>` |
| --- | --- |
| an unsent draft | none |
| sent by its collector, now submitted | the cancelled email, linking `<case_1>` |

**Steps:**

1. Cancel `<case_1>` and confirm.
2. Wait <mail delivery window>.
3. Read `<walk-in email>`'s inbox.

**Expected Results:**

* The message matches the row.

### grade10-site-vault-collector-notifications-US2-TC15-1: A draft staff opened expires with no untouched email

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation
* **Trace:** grade10-site-vault-collector-notifications-US-02

**Pre-conditions:**

* The row's draft has gone untouched for 8 days, and its address is a mailbox the tester reads.
* `<mail delivery window>` is 5 minutes (assumed; any wait past the first send attempt).

**Test data:**

| Draft | Message on expiry |
| --- | --- |
| a draft staff opened at the counter | none |
| a draft the collector opened themselves | the untouched email |

**Steps:**

1. Let the draft clock's sweep run.
2. Wait <mail delivery window>.
3. Read the address's inbox.

**Expected Results:**

* The draft ends as expired.
* The message matches the row.

## Reconciliation

**Run:** the blind pass read only its bundle: the spec-to-tcs skill and the rulebook, the change's `proposal.md`, `decisions.md` with its `## Raised` table empty, `ui-design.md`, `openspec/config.yaml`'s context, the PRD pages Operator Console, Collector Page, Collector Pages, Case Lifecycle and Compliance and Readiness, and for each of the five capabilities its `## Purpose` and `## Feature set`, the change's `user-journeys.md` and, where one exists, the durable purpose, journeys and suite with its `## Settled` and without its `## Reconciliation`. It was denied every `## Requirements` section, `openspec/specs/` beyond the bundle, `openspec/changes/archive/`, `tech-design.md`, `tasks.md` and the store's `tcs-conventions.md`, so the house style was taken from the existing suites. It wrote two cases under one journey and raised no question for this capability; the scenario pass issued *An unsent walk-in that runs out tells nobody* and *A cancelled walk-in tells nobody* and carried *Every event is decided* and *Three endings, three messages* in its MODIFIED block.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `grade10-site-vault-collector-notifications-US2-TC14-1` | Joined | *A cancelled walk-in tells nobody* for the unsent draft; the sent one is *A walk-in the collector sent is cancelled as any case*, told as any cancelled case. The collector's own cancel of an unsent one is walked, silent, by `grade10-site-vault-case-lifecycle-US1-TC4-1` |
| `grade10-site-vault-collector-notifications-US2-TC15-1` | Joined | *An unsent walk-in that runs out tells nobody*; the collector's own draft keeps the untouched email *Three endings, three messages* names |

### Manual

| Manual | Why |
| --- | --- |
| `grade10-site-vault-collector-notifications-US2-TC14-1` | A person cancels both rows and reads the mailbox; the vault worker's walk-ins test decides nothing is owed for the unsent one |
| `grade10-site-vault-collector-notifications-US2-TC15-1` | The draft runs out seven days from its last touch; a person moves the clock or waits, and reads the mailbox |
