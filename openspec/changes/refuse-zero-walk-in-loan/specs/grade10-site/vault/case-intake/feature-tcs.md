# grade10-site/vault/case-intake Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-02, tcs-rules r4

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

### grade10-site-vault-case-intake-US1-TC25-1: A loan of zero is refused on the Describe step

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

### grade10-site-vault-case-intake-US1-TC26-1: The intake refuses a financing amount that is not more than zero

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
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* `customer(collector)` holds a signed-in session on Grade10, with fewer than three unsent drafts.

**Test data:**

| `<financing amount>` | Reading |
| --- | --- |
| `0` | zero minor units, HKD 0.00 |
| `-1` | one minor unit below zero |

| Field | Value |
| --- | --- |
| Currency | HKD |
| `<smallest loan>` | `1`, one minor unit, HKD 0.01 |
| Category | Trading card |
| Title | Charizard 1st Edition |
| Description | Near-mint, unopened sleeve since grading. |

**Steps:**

1. Open a request from **Test data** with financing amount `<financing amount>`.
2. Read the API response.
3. Open the same request with financing amount `<smallest loan>`.
4. Read the API response.

**Expected Results:**

* Step 2 refuses the request as a bad request naming the financing amount.
* After step 2, no case is opened on either lane.
* Step 4 opens the request on the financed lane, asking `<smallest loan>`.

---

## Settled

- A financing amount is an integer count of minor units, more than zero; storage is asked for by leaving the amount out, never by an amount of zero.
- The collector's wizard keeps its own refusal words, in the collector's four languages; they already name both ways on, an amount or storage only.
- An amount finer than the currency's smallest unit is never rounded to zero: the wizard's loan field does not take it, as it does not take a zero.

## Reconciliation

**Run:** QA2, 2026-10-02. QA1's blind pass read only the capability's `## Purpose` and `## Feature set` with the change's leaf, the US-01 journey, `proposal.md`, `decisions.md` with Q1 to Q7, the Collector Pages and Operator Console manual pages, and the durable suite's US1 section and `## Settled`; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md`, the code and `openspec/changes/archive/`. It wrote `grade10-site-vault-case-intake-US1-TC25-1` and `grade10-site-vault-case-intake-US1-TC26-1`, and raised one question with the operator queue, landed as Q10. After it ran, Q11 moved the rule from the facts table to the lane requirement, where `grade10-site-vault-case-intake-SC-42` sits; these are non-anchor clarifications. QA2 read QA1's suites, both delta specs, `decisions.md`, `tech-design.md`, `tasks.md`, the durable specs and suites of both capabilities, and grade10's `RequestWizard.tsx`, `refusalOfDetails` in `details.ts`, `requestModule.test.ts`, `intakeInputSchema` and `positiveMinorAmount` in `packages/vault/contracts/src/schemas.ts`, `schemas.test.ts`, the cases router's `create` and `request.spec.ts`. It is a statement, not proof.

- **Raised, answered** - Q10, raised with the operator queue: an amount finer than the currency's smallest unit is never rounded to zero. Q10 decides the console's money field; the wizard's loan field does not take such an amount at all, as it takes no zero, and `## Settled` carries that for this suite. The operator queue's suite records the console's rows
- **Raised, escalated** - none
- **Raised, rejected** - none
- **Revised** - none
- **Joined** - `grade10-site-vault-case-intake-SC-42`, the lane requirement's more-than-zero rule and the Feature set's A loan of more than zero leaf into `grade10-site-vault-case-intake-US1-TC25-1` on the wizard and `grade10-site-vault-case-intake-US1-TC26-1` at the worker
- **Corrected** - `grade10-site-vault-case-intake-US1-TC25-1` typed a zero the wizard's loan field never takes: the field stays empty, and Continue is refused because a loan is chosen with no amount, in the words of `financingNotPositive`. Step 3 now reads the empty field. Its result said the refusal names both ways on, a phrase the conventions keep out of a case; it reads the refusal asking how much, or for storage only. No draft on the collector's list needed a step to look; it reads the Describe step held and nothing sent. `grade10-site-vault-case-intake-US1-TC26-1` read only that the amount is refused; `grade10-site-vault-case-intake-SC-42` refuses by name, so step 2 reads the bad-request answer naming the financing amount
- **Added by QA2** - `grade10-site-vault-case-intake-US1-TC25-1` steps 5 and 6: storage only from the refused step moves on, as the refusal says and the leaf states, storage asked for by leaving the amount out
- **Contradicted** - none: both QA1 cases agree with the lane requirement and the worker's `positiveMinorAmount`
- **Uncovered anchors** - none: `grade10-site-vault-case-intake-SC-42` by `grade10-site-vault-case-intake-US1-TC25-1` and `grade10-site-vault-case-intake-US1-TC26-1`; the Feature set's new leaf by the same two and, for storage asked for by leaving the amount out, the durable `grade10-site-vault-case-intake-US1-TC2-1`. `grade10-site-vault-case-intake-SC-05` and `grade10-site-vault-case-intake-SC-06` stand unchanged under the rewritten requirement, by the durable `grade10-site-vault-case-intake-US1-TC1-1` and `grade10-site-vault-case-intake-US1-TC2-1`
