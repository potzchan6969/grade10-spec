# grade10-admin/vault/operator-queue Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-admin-vault-operator-queue-US10: Operator opens a case for a customer at the counter

**As a** member of shop staff with a customer and their item in front of me,
**I want** to open the case myself from their email, the item and my own
photos,
**so that** a customer with no request on their phone is served on the spot,
and the draft waits for them to send it.

### grade10-admin-vault-operator-queue-US10-TC9-2: Photos on the walk-in form stop at the limit of ten and can be removed

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/walk-in.spec.ts`

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>.

**Test data:**

| Field | Value |
| --- | --- |
| Photos | ten JPEG photographs, each under 20 MB |

**Steps:**

1. Attach the ten photographs.
2. Look in the gallery for a way to add another photograph.
3. Remove one photograph.

**Expected Results:**

* Step 1 shows the ten in the gallery, reading 10 of 10.
* Step 2 finds no way to add another; the gallery still holds ten.
* Step 3 leaves nine, reading 9 of 10, and a way to add one returns.

### grade10-admin-vault-operator-queue-US10-TC15-1: A malformed address is refused beside the email field before anything is sent

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** acceptance
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-admin-vault-operator-queue-US-10

**Pre-conditions:**

* admin(staff, holds vault:operate and kyc:read) has the walk-in form open on <grade10 admin vault queue url>, outside production, with the collection statement written.
* Every field but the email is filled in validly, with one photograph.
* No account exists for `<walk-in email>`.

**Test data:**

| `<malformed address>` | What is wrong | Left by |
| --- | --- | --- |
| `mei.chan@example` | no ending after the domain | pressing Tab to the next field |
| `walkin.example.com` | no @ | pressing Tab to the next field |
| `@example.com` | nothing before the @ | clicking the Title field |
| `walkin@` | nothing after the @ | pressing Tab to the next field |

| Field | Value |
| --- | --- |
| `<walk-in email>` | `walkin.fixed+<run id>@example.com` |

**Steps:**

1. Click in the email field and press Tab, leaving it empty.
2. Click in the email field and type `<malformed address>`, one character at a time.
3. Leave the email field as the row's Left by.
4. Try to click Open case.
5. Select the address in the email field and type `<walk-in email>` over it.
6. Click Open case.

**Expected Results:**

* Step 1 shows no refusal beside the email field; Open case stays disabled.
* Step 2 shows no refusal while the address is typed.
* Step 3 shows a refusal in words beside the email field, saying it is not an email address.
* The form's footer shows no refusal; the rest of the form keeps what was typed.
* Step 4 finds Open case disabled; no draft opens.
* Step 5 clears the refusal once the address is whole, the field not yet left, and Open case becomes available.
* Step 6 opens the draft for `<walk-in email>` on its own page.

## Settled

- An empty address is not refused as not an email address: Open case stays unavailable until one is typed, and nothing shows beside the field.
- A malformed address is refused once staff leave the field, never while they type, and the refusal clears as soon as the address meets the worker's rule or is emptied, while they retype it, and shows again only when they next leave the field.
- While the address is refused, Open case stays unavailable, as it does for a title past its limit.
- At ten photographs the walk-in form offers no way to add another, rather than refusing an eleventh by name.

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read only the capability's `## Purpose` and `## Feature set` with the change's leaves, the US-10 journey, `proposal.md`, `decisions.md` as it stood before Q3 was clarified and Q6 and Q7 were added, the Operator Console page's walk-in lines, the durable suite's US10 section and `## Settled`, and the two rulebooks; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, the code and `openspec/changes/archive/`. It revised `grade10-admin-vault-operator-queue-US10-TC9-1` into `grade10-admin-vault-operator-queue-US10-TC9-2`, wrote `grade10-admin-vault-operator-queue-US10-TC15-1`, and raised three questions. After it ran, Q3 was clarified to hold Open case while the refusal stands, and Q6 and Q7 were added from its questions; these are non-anchor clarifications. QA2 read QA1's suite, the delta spec, `decisions.md`, `tech-design.md`, `tasks.md`, the durable spec and suite, and grade10's `WalkInDialog.tsx` and its test, `FormDialog.tsx`, `vocabulary.tsx`, `EMAIL_PATTERN` in `packages/utils/src/schema.ts` and `walk-in.spec.ts`. It is a statement, not proof.

- **Raised, answered** - all three rows, landed as Q6, Q7 and Q3: an empty address is not refused and Open case waits for one, now `grade10-admin-vault-operator-queue-US10-TC15-1` step 1; the refusal clears while staff retype, now step 5, which read the clearing only after Tab; Open case stays unavailable while the refusal stands, now step 4
- **Raised, escalated** - none
- **Raised, rejected** - none
- **Revised** - `grade10-admin-vault-operator-queue-US10-TC9-2` replaces `grade10-admin-vault-operator-queue-US10-TC9-1` for the revised `grade10-admin-vault-operator-queue-SC-75`: ten photographs and no way to add an eleventh, where the old case attached an eleventh and read a refusal (Q5). It keeps its walk; tasks 3.1 re-keys the walk's test to it
- **Joined** - `grade10-admin-vault-operator-queue-SC-95` and the refusal table's Not an email address row into `grade10-admin-vault-operator-queue-US10-TC15-1`
- **Corrected** - `grade10-admin-vault-operator-queue-US10-TC15-1`'s `@example.com` row left the field by clicking Open case, and a step clicked it to send nothing. Under Q3 Open case is disabled while the address is refused, and whether a click on a disabled button leaves the field differs by browser. The row now leaves by clicking the Title field, and step 4 tries the click and reads the button disabled. The pre-condition and result about no account for the malformed address are dropped: nothing can be sent
- **Added by QA2** - the row `mei.chan@example`, the address `grade10-admin-vault-operator-queue-SC-95` names, which the three QA1 rows did not reach; step 1, the empty address left by Tab, for Q6
- **Contradicted** - none: every QA1 outcome agrees with the delta, `tech-design.md` and the worker's address rule
- **Uncovered anchors** - none: `grade10-admin-vault-operator-queue-SC-75` by `grade10-admin-vault-operator-queue-US10-TC9-2`, `grade10-admin-vault-operator-queue-SC-95` by `grade10-admin-vault-operator-queue-US10-TC15-1`, and the Feature set's two new leaves by the same two cases
