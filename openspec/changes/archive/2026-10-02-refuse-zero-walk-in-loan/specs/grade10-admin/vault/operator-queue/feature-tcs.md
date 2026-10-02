# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-admin-vault-operator-queue-US10: Operator opens a case for a customer at the counter

**As a** member of shop staff with a customer and their item in front of me,
**I want** to open the case myself from their email, the item and my own
photos,
**so that** a customer with no request on their phone is served on the spot,
and the draft waits for them to send it.

### grade10-admin-vault-operator-queue-US10-TC16-1: A loan of zero is refused beside the loan field before anything is sent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The form holds `<walk-in email>`, a valid category, title and description, and one photograph.
* A loan is chosen at the lane question, and the loan field is empty.
* No account exists for `<walk-in email>`.

**Test data:**

| `<zero amount>` | Left by |
| --- | --- |
| `0` | pressing Tab to the next field |
| `0.00` | clicking the Title field |

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.zero+<run id>@example.com` |
| `<smallest loan>` | `0.01`, HKD 0.01 (1 minor unit) |

**Steps:**

1. Click in the loan field and press Tab, leaving it empty.
2. Click in the loan field and type `<zero amount>`, one character at a time.
3. Leave the loan field as the row's Left by.
4. Try to click Open case.
5. Select the amount and delete it.
6. Type `<zero amount>` again.
7. Leave the loan field as the row's Left by.
8. Select the amount and type `<smallest loan>` over it, staying in the field.
9. Click Open case.

**Expected Results:**

* Step 1 shows no refusal beside the loan field; Open case stays disabled.
* Step 2 shows no loan-of-zero refusal while typing; Open case stays disabled.
* In the `0.00` row, `0.` shows the field's own `Not an amount in HKD.` until the next digit.
* Step 3 shows `A loan is more than zero. Ask the customer how much, or choose Storage only.` beside the loan field.
* The form's footer shows no refusal; the rest of the form keeps what was typed.
* Step 4 finds Open case disabled; nothing is sent and no draft opens.
* Step 5 clears the refusal; Open case stays disabled.
* Step 6 shows no loan-of-zero refusal until the field is left.
* Step 7 shows the refusal beside the loan field again.
* Step 8 clears it once `<smallest loan>` is whole; Open case becomes available.
* Step 9 opens the draft on its own page, financed, asking `<smallest loan>`.

### grade10-admin-vault-operator-queue-US10-TC17-1: Choosing Storage only sets a refused loan of zero aside

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The form holds `<walk-in email>`, a valid category, title and description, and one photograph.
* A loan is chosen, the loan field holds `0` and has been left, and the loan-of-zero refusal shows beside it.
* No account exists for `<walk-in email>`.

**Test data:**

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.storage+<run id>@example.com` |

**Steps:**

1. Choose Storage only at the lane question.
2. Choose the loan at the lane question again.
3. Click in the loan field, then click the Title field.
4. Choose Storage only again.
5. Click Open case.

**Expected Results:**

* Step 1 hides the loan field and its refusal; Open case becomes available.
* Step 2 shows the loan field holding zero, `0.00`, with no refusal beside it; Open case is disabled.
* Step 3 shows the refusal beside the loan field again.
* Step 5 opens the draft on its own page, storage only, asking no loan.

### grade10-admin-vault-operator-queue-US10-TC18-1: Text that is not an amount keeps the field's own refusal

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* The form holds a valid email address, category, title and description, and one photograph.
* A loan is chosen at the lane question, and the loan field is empty.

**Test data:**

| `<typed>` | Reading | The field's own words |
| --- | --- | --- |
| `-1` | a minus sign | `An amount, not a debit.` |
| `0.004` | below HKD's smallest unit, 0.4 of 1 minor unit | `At most 2 decimals in HKD.` |

**Steps:**

1. Type `<typed>` into the loan field.
2. Leave the loan field by clicking the Title field.
3. Try to click Open case.

**Expected Results:**

* Step 1 shows the row's own words beside the loan field as it is typed.
* Step 2 keeps the row's words; `A loan is more than zero. Ask the customer how much, or choose Storage only.` never shows.
* Step 3 finds Open case disabled; no draft opens.

---

## Settled

- A walk-in amount that is not more than zero is refused by the worker's own rule for the amount, read by the form, so the form and the worker never disagree on one.
- The refusal shows when staff leave the loan field, never while they type; it clears as soon as the amount meets the rule or is emptied, and shows again only when they next leave the field.
- While the amount fails the rule, Open case stays unavailable.
- An empty loan field is not refused: with a loan chosen, Open case stays unavailable until an amount is typed, and nothing shows beside the field.
- The refusal's words are the console's own, in English: `A loan is more than zero. Ask the customer how much, or choose Storage only.`
- When staff choose Storage only while the refusal shows, the loan field goes and Open case becomes available, since a storage case carries no amount; the amount is kept and the refusal is cleared, so choosing a loan again shows the amount with Open case disabled, and the refusal shows when staff next leave the field.
- A negative amount is not refused in the loan-of-zero words: the console's money field refuses a minus sign as it is typed, in its own words, and hands no amount on.
- An amount finer than the currency's smallest unit, such as `0.004` in HKD, is not read as zero: the money field refuses it as it is typed, in its own words, and never rounds it.

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read only the capability's `## Purpose` and `## Feature set` with the change's leaf, the US-10 journey, `proposal.md`, `decisions.md` with Q1 to Q7, the Operator Console and Collector Pages manual pages, and the durable suite's US10 section and `## Settled`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, the code and `openspec/changes/archive/`. It wrote `grade10-admin-vault-operator-queue-US10-TC16-1` and raised three questions, landed as Q8, Q9 and Q10. After it ran, Q11 moved case intake's rule to the lane requirement; these are non-anchor clarifications. QA2 read QA1's suites, both delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites of both capabilities, and grade10's `WalkInDialog.tsx` and its test, `MoneyField.tsx`, `parseMinorUnits` in `packages/utils/src/money.ts`, `positiveMinorAmount` and `intakeInputSchema` in `packages/vault/contracts/src/schemas.ts`, and `walk-in.spec.ts`. It is a statement, not proof.

- **Raised, answered** - all three rows: Q8, storage only chosen while the refusal shows, now `grade10-admin-vault-operator-queue-US10-TC17-1`; Q9, a minus sign, and Q10, an amount finer than HKD's minor unit, now the two rows of `grade10-admin-vault-operator-queue-US10-TC18-1`, the money field's own words and never the loan-of-zero refusal. The answers are in `## Settled`. Q10 was raised from case intake as well, and its suite records it there
- **Raised, escalated** - none
- **Raised, rejected** - none
- **Revised** - none
- **Joined** - `grade10-admin-vault-operator-queue-SC-96`, the refusal table's A loan of zero row and the Feature set's A loan of zero leaf into `grade10-admin-vault-operator-queue-US10-TC16-1`, with `grade10-admin-vault-operator-queue-US10-TC17-1` and `grade10-admin-vault-operator-queue-US10-TC18-1` beside it
- **Corrected** - `grade10-admin-vault-operator-queue-US10-TC16-1` read no refusal while `0.50` was typed, `0.` included. `MoneyField` refuses `0.` as it is typed, in its own words, until the next digit, so that step could not pass. The partial amount is dropped: the zero itself, typed one character at a time, shows no loan-of-zero refusal before the field is left, which is Q4's claim, and the `0.00` row names the field's own words at `0.`. Open case reads disabled rather than unavailable, as `grade10-admin-vault-operator-queue-US10-TC15-1` reads it
- **Added by QA2** - in `grade10-admin-vault-operator-queue-US10-TC16-1`, steps 6 to 8: a second zero shows nothing until the field is left again, and an amount more than zero clears the refusal with the field not left, both of which the refusal table's row states and the case read only by emptying the field; `grade10-admin-vault-operator-queue-US10-TC17-1` for Q8; `grade10-admin-vault-operator-queue-US10-TC18-1` for Q9 and Q10
- **Contradicted** - `grade10-admin-vault-operator-queue-US10-TC17-1`, QA2's own addition, read the refusal back at once when a loan is chosen again; a loan field built again is untouched, so the console draws no refusal until it is typed in or left, and a refusal drawn on the first keystroke would break Q4. Q8 now clears the refusal on a lane change and keeps the amount, and the case leaves the field to read it again. Otherwise every QA1 outcome agrees with the delta, `tech-design.md` and the worker's amount rule, but for the `0.` keystroke corrected above, which is the money field's standing behaviour and no scenario's
- **Uncovered anchors** - none: `grade10-admin-vault-operator-queue-SC-96` by `grade10-admin-vault-operator-queue-US10-TC16-1`, and the Feature set's new leaf by `grade10-admin-vault-operator-queue-US10-TC16-1`, `grade10-admin-vault-operator-queue-US10-TC17-1` and `grade10-admin-vault-operator-queue-US10-TC18-1`
