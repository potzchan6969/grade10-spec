# grade10-site/vault/case-intake Test Cases

**Status:** retired
**Out of suite (api):** grade10-site-vault-case-intake-SC-20, grade10-site-vault-case-intake-SC-21, grade10-site-vault-case-intake-SC-30

## Background

`customer(collector)` is signed in and `<grade10 vault url>` is reachable in
every case below unless a pre-condition states otherwise. Every amount is
entered in the brand's own currency; Grade10's is HKD.

## grade10-site-vault-case-intake-US1: Collector sends in a card they want cash against

**As a** collector,
**I want** to describe and photograph one card and say how much I want to
borrow against it,
**so that** the shop can value it and offer me terms before I carry it in.

<!-- trace:case id=g10.vault-case-intake.TC-tr4 rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC22-1: The wizard offers the register's ten categories in each language

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-vault-case-intake-US-01

**Pre-conditions:**

* customer(collector) is signed in on <grade10 vault url> in the language of the row, with no unsent draft.

**Test data:**

| Language |
| --- |
| English |
| Traditional Chinese |
| Simplified Chinese |
| Korean |

**Steps:**

1. Start a new request.
2. Open the category choice on the Describe step.
3. Choose comic and fill in a title and a description.
4. Click Continue.

**Expected Results:**

* Step 2 offers ten categories: trading card, comic, coin, banknote, stamp, bullion, watch, jewellery, memorabilia and other.
* Every category reads in the row's language, none as a raw key.
* Step 4 moves to the Photograph step with comic kept as the category.

<!-- trace:case id=g10.vault-case-intake.TC-8xk rev=1 covers=g10.vault-case-intake.SC-gfr,g10.vault-case-intake.SC-fyh,g10.vault-case-intake.SC-6s8,g10.vault-case-intake.SC-u3j,g10.vault-case-intake.SC-jdq,g10.vault-case-intake.SC-jgo,g10.vault-case-intake.SC-9u2,g10.vault-case-intake.SC-a99,g10.vault-case-intake.SC-y95,g10.vault-case-intake.SC-64e,g10.vault-case-intake.SC-vq4,g10.vault-case-intake.SC-nui,g10.vault-case-intake.SC-c2q -->
### grade10-site-vault-case-intake-US1-TC25-1: A loan of zero is refused on the Describe step

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
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

---

## grade10-site-vault-case-intake-US4: Collector checks the request before sending it

**As a** collector on the last step of the wizard,
**I want** to read my request back, see what happens next, and tick that I
have read the collection statement,
**so that** I send what I meant and know what I agreed to.

<!-- trace:case id=g10.vault-case-intake.TC-5j6 rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC3-1: The review step names what happens next

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete.

**Steps:**

1. Read the What happens next block.

**Expected Results:**

* Three items are listed, naming what the shop does with the request.

<!-- trace:case id=g10.vault-case-intake.TC-ye6 rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC5-1: The statement reads "Being prepared" outside production

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-vault-case-intake-US-04

**Pre-conditions:**

* `customer(collector)` is on the Review step outside production, Legal's statement text not yet supplied.

**Steps:**

1. Click the statement link.
2. Return, tick the statement, and click Send it in.

**Expected Results:**

* The linked page reads "Being prepared".
* The request still sends.

<!-- trace:case id=g10.vault-case-intake.TC-ue8 rev=1 covers=g10.vault-case-intake.SC-v7o,g10.vault-case-intake.SC-lmj,g10.vault-case-intake.SC-cda,g10.vault-case-intake.SC-fei,g10.vault-case-intake.SC-mzh,g10.vault-case-intake.SC-slr -->
### grade10-site-vault-case-intake-US4-TC7-1: Finish later from the review step saves without sending

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-04

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` is on the Review step of a draft with its item facts and one photograph complete, statement ticked.

**Steps:**

1. Click Finish later.

**Expected Results:**

* The request is not sent.
* It is listed as an unsent request on the collector's own list.

---

## grade10-site-vault-case-intake-US5: Collector gets a reference they can say and type

**As a** collector,
**I want** a short reference for my case,
**so that** I can read it out at the counter and type it as the transfer
reference at my bank.

<!-- trace:case id=g10.vault-case-intake.TC-zqt rev=1 covers=g10.vault-case-intake.SC-93o,g10.vault-case-intake.SC-u8f,g10.vault-case-intake.SC-3h1 -->
### grade10-site-vault-case-intake-US5-TC7-1: Not now opens the case that was just sent

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-vault-case-intake-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/vault/request.spec.ts`

**Pre-conditions:**

* `customer(collector)` has just sent a request and is on the Sent step.

**Steps:**

1. Click Not now.

**Expected Results:**

* The case opens at its own address instead of starting a visit booking.

---

## grade10-site-vault-case-intake-US6: Collector sends a request staff opened for them at the counter

**As a** collector whose request staff opened at the counter,
**I want** to sign in on my own phone, read the request and the photos back,
and tick that I have read the collection statement before I send it,
**so that** nothing happens to my item on a request I have not seen, and a
request typed under the wrong address is never emailed.

---

## Settled

- The Photograph step's empty refusal catches a zero-byte file, refused the way anything that is not a JPEG, PNG or WebP is refused.
- The 20 MB cap bounds each photograph; nothing bounds the ten together but the count of ten.
- The conflict on Send it in is the case-lifecycle guard — the draft moved between the session reading it and the send landing — so the send is refused by name and no second case opens.
- Whether the Describe step's amount field names the brand's currency is the product manager's to confirm; the recommendation is that it does, and the refusal of any other currency stands either way.
- Which typed forms of a number are one is decided on `docs/prds/products/grade10-site/vault/collector-pages.md`: spacing, `+852` or `00852`, the bare local number, full-width digits and `852` before a local number store as one.
- Taken at landing: a send is refused in production while no collection statement wording is set; outside production it goes through.
- A financing amount is an integer count of minor units, more than zero; storage is asked for by leaving the amount out, never by an amount of zero.
- The collector's wizard keeps its own refusal words, in the collector's four languages; they already name both ways on, an amount or storage only.
- An amount finer than the currency's smallest unit is never rounded to zero: the wizard's loan field does not take it, as it does not take a zero.
- **A stale statement version** - a send naming a version other than the one in force is refused by name and stays unsent (Q17)
- **A walk-in draft with no screen to send it** - it waits on its own clock and ends silently until the request screen ships (Q14)

## Reconciliation

**Run:** 2026-09-22, change `complete-vault-collector-flow`, capability
`grade10-site/vault/case-intake`. The blind pass read an isolated bundle: this
capability's `## Purpose` and `## Feature set` outline, its `user-journeys.md`,
the change's `proposal.md` and `decisions.md` — `## Raised` included — its
`ui-design.md` with the state dispositions stripped, and the PRD pages the
proposal links. Denied: every `## Requirements` section, `openspec/specs/`
beyond the two outline sections, `openspec/changes/archive/`, and
`tech-design.md`. The scenario pass read the same anchors and the durable
requirements, and neither pass saw the other's file before this join.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| `US1-TC1-1`, `US1-TC2-1` | Covered | `grade10-site-vault-case-intake-SC-05`, `grade10-site-vault-case-intake-SC-06`, `grade10-site-vault-case-intake-SC-13`, `grade10-site-vault-case-intake-SC-14`, `grade10-site-vault-case-intake-SC-15`, `grade10-site-vault-case-intake-SC-17` — the two lanes walked end to end |
| `US1-TC3-1`, `US1-TC4-1` | Folded | `grade10-site-vault-case-intake-SC-24` and `grade10-site-vault-case-intake-SC-25`. The durable requirement `A request states one item, in the brand's own currency` tables the 200 and 2,000 character caps and no scenario stated them; the change now opens that requirement in a MODIFIED block and the two scenarios land there |
| `US1-TC5-1`, `US1-TC7-1` | Folded; question landed | `grade10-site-vault-case-intake-SC-28` and `grade10-site-vault-case-intake-SC-29`, in a MODIFIED block on the photograph requirement, which now names the cap in bytes, 20,971,520, so the bound cannot move with a rounded megabyte. Whether the cap also bounds the ten together landed as Q57 — it does not |
| `US1-TC6-1` | Covered | `grade10-site-vault-case-intake-SC-08` |
| `US1-TC8-1` | Covered | `grade10-site-vault-case-intake-SC-09` |
| `US1-TC9-1` | Covered; question landed | A zero-byte JPEG is not one of the three image types, so `grade10-site-vault-case-intake-SC-09` refuses it by name; the blind pass's question about what the empty refusal catches landed as Q57 |
| `US1-TC10-1` | Covered | `grade10-site-vault-case-intake-SC-13` |
| `US1-TC11-1` | Covered | `grade10-site-vault-case-intake-SC-11` |
| `US1-TC12-1` | Covered | `grade10-site-vault-case-intake-SC-12` |
| `US1-TC13-1` | Folded | `grade10-site-vault-case-intake-SC-30`, in a MODIFIED block on `A photograph is stored without its location and read under a trail`, which states the ledger and had no scenario for a recorded read |
| `US1-TC14-1` | Covered | `grade10-site-vault-case-intake-SC-07` |
| `US1-TC15-1` | Covered | `grade10-site-vault-case-intake-SC-01` |
| `US1-TC16-1` | Covered by another capability | `grade10-site-vault-case-lifecycle-SC-04` — a case that moved under the caller is refused by name; the blind pass's question about what produces `request.caseConflict` landed as Q58, and the design's Moved on state closes on that same scenario |
| `US1-TC17-1`, `US1-TC19-1` | Covered; question escalated | `grade10-site-vault-case-intake-SC-04` stores one canonical number however it was typed, and the number is optional by the requirement's table; which typed forms count as one person is decided on `collector-pages.md` |
| `US1-TC18-1` | Folded | `grade10-site-vault-case-intake-SC-26`. The requirement now says a number the brand's plan cannot read is refused by name, as the worker already refuses it; which typed forms count as one person is decided on `collector-pages.md` |
| `US1-TC20-1` | Covered; question landed | `grade10-site-vault-case-intake-SC-03`; whether the amount field shows the brand's currency to the collector landed as Q56 |
| `US4-TC1-1`, `US4-TC2-1`, `US4-TC3-1` | Covered | `grade10-site-vault-case-intake-SC-15`, `grade10-site-vault-case-intake-SC-17` |
| `US4-TC4-1` | Covered | `grade10-site-vault-case-intake-SC-16` |
| `US4-TC5-1` | Covered | `grade10-site-vault-case-intake-SC-18`, now outside production alone |
| `US4-TC6-1` | Covered; restored to `draft`, id kept | `grade10-site-vault-case-intake-SC-31`. Deprecated at the round as a misreading of Q8 and Q17; at landing the owner took the production refusal, so `decisions.md` Q8 now reads as this case does and the case comes back unchanged |
| `US4-TC7-1` | Covered, trimmed | `grade10-site-vault-case-intake-SC-01` — a request left unsent is listed unsent on the collector's own list. The draft also claimed the tick survives the save, which nothing states; `grade10-site-vault-case-intake-SC-17` records the version at the send, so that result left the case |
| `US5-TC1-1` | Covered | `grade10-site-vault-case-intake-SC-19`, `grade10-site-vault-case-intake-SC-23`; the reference is drawn when the request is opened, so what the case reads at the send is the reference the draft already carried. The letter that carries it is `grade10-site/vault/collector-notifications`', and its suite walks it |
| `US5-TC2-1`, `US5-TC4-1`, `US5-TC5-1` | Covered, retraced | `grade10-site-vault-case-intake-SC-20`, `grade10-site-vault-case-intake-SC-21`, `grade10-site-vault-case-intake-SC-22`; each case now traces `The case reference`, the group those scenarios serve, in place of the journey — one anchor per case, and US-05 keeps its own cases |
| `US5-TC3-1` | Retired; `deprecated`, id kept | Its within-brand half is `US5-TC2-1` on `grade10-site-vault-case-intake-SC-20`. Its cross-brand half cannot be walked: Grade10 alone runs a vault, and each brand's vault is its own database, so no second brand's reference exists to clash with |
| `US5-TC6-1` | Folded | `grade10-site-vault-case-intake-SC-27`. One request per item is the durable requirement's last line and no scenario stated it; the several-items block on the Sent step is the design's |
| `US5-TC7-1` | Covered | `grade10-site-vault-case-intake-SC-22` — Not now opens the case at its id-based address |
| `grade10-site-vault-case-intake-SC-02` | Case added | `US1-TC21-1`, tracing `Opening a request`, the group the scenario serves |
| `grade10-site-vault-case-intake-SC-19` | Case added | `US5-TC8-1` — no case read the reference before the request was sent |

**Uncovered anchors:** none.

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
| `grade10-site-vault-case-intake-SC-38` | Case added | `grade10-site-vault-case-intake-US6-TC7-1`'s fourth step |

**Run:** QA2, 2026-10-02. QA1's blind pass read the Feature set, the journey, the proposal, `decisions.md` with its empty `## Raised`, `ui-design.md` with its anchors stripped, the Collector Pages and Items PRD pages, and the durable case-intake suite for id continuity with its Reconciliation stripped; it was denied every `## Requirements` section, `tech-design.md`, `tasks.md` and the code. QA2 read QA1's suite and questions, the delta spec, `tech-design.md`, `tasks.md` and the operator-queue delta. It is a statement, not proof.

- **Folded** - `grade10-site-vault-case-intake-US1-TC22-1` into `grade10-site-vault-case-intake-SC-39`; `grade10-site-vault-case-intake-US1-TC23-1` into `grade10-site-vault-case-intake-SC-40`, gaining the register's description left unchanged as Q47
- **Patched, not re-run** - `grade10-site-vault-case-intake-US1-TC23-1` tried the grader, grade and cert on the collector's Describe step, which carries no such field; it now tries the category and the title, the two `grade10-site-vault-case-intake-SC-40` reads from the register
- **Added by QA2** - `grade10-site-vault-case-intake-US1-TC24-1` for `grade10-site-vault-case-intake-SC-41`, the worker's refusal, which the blind case reached only through the interface
- **Raised, answered by the round** - the customer's description edit on a linked draft changes the request alone (Q47, `grade10-site-vault-case-intake-SC-40`)
- **Raised, escalated** - none
- **Round 4** - `grade10-site-vault-case-intake-SC-40` and `grade10-site-vault-case-intake-SC-41` hold only for a slab the register holds under the customer at the counter, the one the walk-in form fills; `grade10-site-vault-case-intake-US1-TC23-1` and `grade10-site-vault-case-intake-US1-TC24-1` now say so
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none: US-01 has a case for each of the three scenarios; the modified requirement's other scenarios keep their durable cases

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

**Run:** QA2, 2026-10-02, for change `retire-vault-collector-site`. QA1's blind pass read the Feature set, the journeys, `decisions.md` through Q15, the proposal and the durable suite; it was denied every requirement. QA2 read both suites, this delta, `tech-design.md`, `tasks.md` and the worker they name: `trpc/routers/cases.ts`, `cases/intake.ts`, `legalCopy.ts` and the intake tests. It is a statement, not proof.

- **Raised, folded into spec** - a sent request takes no edit to its facts, from `grade10-site-vault-case-intake-US4-TC11-1`, as `grade10-site-vault-case-intake-SC-43` under the request requirement, cited in task 2.2
- **Raised, escalated** - a send naming a stale statement version, landed as Q17, refused by name
- **Raised, rejected** - none
- **Re-versioned to the API** - every case whose behaviour the worker keeps and whose run walked the wizard, the case list or the case page: `grade10-site-vault-case-intake-US1-TC1-2`, `grade10-site-vault-case-intake-US1-TC2-2`, `grade10-site-vault-case-intake-US1-TC3-2`, `grade10-site-vault-case-intake-US1-TC4-2`, `grade10-site-vault-case-intake-US1-TC5-2`, `grade10-site-vault-case-intake-US1-TC6-2`, `grade10-site-vault-case-intake-US1-TC7-2`, `grade10-site-vault-case-intake-US1-TC8-2`, `grade10-site-vault-case-intake-US1-TC9-2`, `grade10-site-vault-case-intake-US1-TC10-2`, `grade10-site-vault-case-intake-US1-TC11-2`, `grade10-site-vault-case-intake-US1-TC14-2`, `grade10-site-vault-case-intake-US1-TC15-2`, `grade10-site-vault-case-intake-US1-TC16-2`, `grade10-site-vault-case-intake-US1-TC17-2`, `grade10-site-vault-case-intake-US1-TC18-2`, `grade10-site-vault-case-intake-US1-TC19-2`, `grade10-site-vault-case-intake-US4-TC1-2`, `grade10-site-vault-case-intake-US4-TC2-2`, `grade10-site-vault-case-intake-US4-TC4-2`, `grade10-site-vault-case-intake-US4-TC6-2`, `grade10-site-vault-case-intake-US5-TC1-2`, `grade10-site-vault-case-intake-US5-TC5-2`, `grade10-site-vault-case-intake-US5-TC6-2`, `grade10-site-vault-case-intake-US5-TC8-2`, `grade10-site-vault-case-intake-US6-TC1-2`, `grade10-site-vault-case-intake-US6-TC2-2`, `grade10-site-vault-case-intake-US6-TC3-2`, `grade10-site-vault-case-intake-US6-TC4-2`, `grade10-site-vault-case-intake-US6-TC5-2`, `grade10-site-vault-case-intake-US6-TC6-2`, `grade10-site-vault-case-intake-US6-TC7-2`; `grade10-site-vault-case-intake-US1-TC23-2` drops the try-a-change step a screen held and reads the register in the console
- **Deprecated** - the cases whose subject is a removed screen: `grade10-site-vault-case-intake-US1-TC22-1`, `grade10-site-vault-case-intake-US1-TC25-1`, `grade10-site-vault-case-intake-US4-TC3-1`, `grade10-site-vault-case-intake-US4-TC5-1`, `grade10-site-vault-case-intake-US4-TC7-1`, `grade10-site-vault-case-intake-US5-TC7-1`; the worker's refusal of a zero loan stays with `grade10-site-vault-case-intake-US1-TC26-1`, and an unsent request with `grade10-site-vault-case-intake-US1-TC15-2`
- **Carried into a bump** - QA1's new ids that re-covered an earlier case leave the delta: `US1-TC27-1` into `grade10-site-vault-case-intake-US1-TC3-2`; `US1-TC28-1` into `grade10-site-vault-case-intake-US1-TC4-2` and `grade10-site-vault-case-intake-US1-TC18-2`; `US1-TC29-1` into `grade10-site-vault-case-intake-US1-TC15-2`; `US4-TC8-1` into `grade10-site-vault-case-intake-US4-TC2-2`; `US4-TC9-1` into `grade10-site-vault-case-intake-US4-TC1-2`; `US4-TC10-1` into `grade10-site-vault-case-intake-US4-TC4-2`; `US4-TC12-1` into `grade10-site-vault-case-intake-US4-TC6-2`; `US5-TC9-1` into `grade10-site-vault-case-intake-US5-TC1-2` and `grade10-site-vault-case-intake-US5-TC5-2`; `US5-TC10-1` into `grade10-site-vault-case-intake-US5-TC6-2`; `US6-TC8-1` into `grade10-site-vault-case-intake-US6-TC2-2`; `US6-TC9-1` into `grade10-site-vault-case-intake-US6-TC1-2`; `US6-TC10-1` into `grade10-site-vault-case-intake-US6-TC3-2`; `US6-TC11-1` into `grade10-site-vault-case-intake-US6-TC5-2`
- **Joined** - `grade10-site-vault-case-intake-SC-15` into `grade10-site-vault-case-intake-US4-TC2-2`; `grade10-site-vault-case-intake-SC-16`, `-SC-17`, `-SC-18` into `grade10-site-vault-case-intake-US4-TC1-2` and `grade10-site-vault-case-intake-US4-TC4-2`; `grade10-site-vault-case-intake-SC-31` into `grade10-site-vault-case-intake-US4-TC6-2`; `grade10-site-vault-case-intake-SC-19` to `-SC-23` into `grade10-site-vault-case-intake-US5-TC1-2` and `grade10-site-vault-case-intake-US5-TC5-2`; `grade10-site-vault-case-intake-SC-24` into `grade10-site-vault-case-intake-US1-TC3-2`; `grade10-site-vault-case-intake-SC-25`, `-SC-26` into `grade10-site-vault-case-intake-US1-TC4-2` and `grade10-site-vault-case-intake-US1-TC18-2`; `grade10-site-vault-case-intake-SC-27` into `grade10-site-vault-case-intake-US5-TC6-2`; `grade10-site-vault-case-intake-SC-01` into `grade10-site-vault-case-intake-US1-TC15-2`; `grade10-site-vault-case-intake-SC-32` to `-SC-35` into `grade10-site-vault-case-intake-US6-TC1-2` to `grade10-site-vault-case-intake-US6-TC7-2`
- **Contradicted** - none
- **Uncovered anchors** - none: every journey this delta serves has a case; `grade10-site-vault-case-intake-SC-39` is the contracts' schema test (task 2.2)
- **Automated cases re-versioned** - `grade10-site-vault-case-intake-US1-TC1-2`, `grade10-site-vault-case-intake-US1-TC2-2`, `grade10-site-vault-case-intake-US1-TC6-2`, `grade10-site-vault-case-intake-US1-TC7-2`, `grade10-site-vault-case-intake-US1-TC8-2`, `grade10-site-vault-case-intake-US1-TC9-2`, `grade10-site-vault-case-intake-US1-TC14-2`, `grade10-site-vault-case-intake-US1-TC16-2`, `grade10-site-vault-case-intake-US4-TC1-2`, `grade10-site-vault-case-intake-US5-TC8-2`, `grade10-site-vault-case-intake-US6-TC1-2`, `grade10-site-vault-case-intake-US6-TC3-2`, `grade10-site-vault-case-intake-US6-TC4-2`, `grade10-site-vault-case-intake-US6-TC5-2`, `grade10-site-vault-case-intake-US6-TC6-2` were decided by `request.spec.ts` or `walk-in.spec.ts` at `-1`; each is `manual` until task 4.4 retitles its API walk and flips it

**Run:** QA2, 2026-10-07, for change `print-case-reference-on-vault-paper`. QA1's blind pass read the Feature set, US-05, the proposal, `decisions.md` through Q7 and the durable suite with its Reconciliation stripped; it was denied every requirement. QA2 read this suite, the delta and `tech-design.md`. It is a statement, not proof.

- **Covered** - `grade10-site-vault-case-intake-US5-TC9-1` by `grade10-site-vault-case-intake-SC-19`: the requirement's *Issued with the case* names no opener, so a draft staff opened is one more case opened, and the case adds no rule
- **Carried unchanged** - `grade10-site-vault-case-intake-SC-19` to `grade10-site-vault-case-intake-SC-23` keep their durable cases under US5; the modified *Where it is read* names the signed paper, whose outcome is `grade10-site/vault/documents-and-signing`'s and is walked there and by `grade10-site-vault-e2e-US1-TC1-1`
- **Rejected** - none
- **Contradicted** - none
- **Uncovered anchors** - none

### Manual

| Manual | Why |
| --- | --- |
| `US1-TC1-1` | The financed walk is driven once on a phone, because the photograph step is a camera and a file picker before it is a request |
| `US4-TC1-1` | Whether the step reads the request back as the collector wrote it is a person's reading, not an assertion |
| `US4-TC2-1` | Edit per block and the way back is walked, so the rest of the request is seen to survive it |
| `US4-TC3-1` | The What happens next wording is read for what it promises the shop will do |
| `US4-TC5-1` | The statement page is opened outside production to read the being-prepared wording |
| `US5-TC1-1` | The reference is read aloud from the Sent step and the card — legibility is the point of the alphabet |
| `US5-TC6-1` | Start another request is walked to see the case just sent left where it was |
| `grade10-site-vault-case-intake-US6-TC2-1` | A person changes staff's facts and photographs before the send; the walk-in walk sends them as staff typed them |
| `grade10-site-vault-case-intake-US6-TC7-1` | The walk proves the removal and that a sent request keeps its photographs; a person reads the refusal's words |
