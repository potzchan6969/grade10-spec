# shared/ui/invoice-and-receipt-pdf Test Cases

**Status:** pending-review
**Drafts styled:** 2026-09-23, tcs-rules r3

## shared-ui-invoice-and-receipt-pdf-US1: Invoice and Receipt PDF component contract

**Walked by:** nobody on their own — a component contract; the journeys live in `grade10-site/auction/winner-order`, which composes the block behind the Invoice PDF control (`winner-order-SC-57`, `winner-order-SC-109`) and the Receipt PDF control (`winner-order-SC-67`)

**As a** customer,
**I want** the Invoice and Receipt PDFs I open from Winner Order to show every line and address Grade10 already committed to, from one shared component,
**so that** the document I read or download matches what the order page told me, however the page that composes it is built.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-8la rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-i53,g10.shared-invoice-and-receipt-pdf.SC-2d5,g10.shared-invoice-and-receipt-pdf.SC-ca8,g10.shared-invoice-and-receipt-pdf.SC-0s1,g10.shared-invoice-and-receipt-pdf.SC-t8t,g10.shared-invoice-and-receipt-pdf.SC-1sf -->
### shared-ui-invoice-and-receipt-pdf-US1-TC49-1: Each document date ends in GMT+8 across a Hong Kong midnight

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** acceptance
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Presentation-only contract

**Pre-conditions:**

* The machine clock is set to America/New_York.
* <document> is rendered with the <date row> date supplied as <date supplied>, every other prop supplied normally.

**Test data:**

| Document | Date row | Date supplied | Hong Kong day | Hong Kong month | Hong Kong year | Hong Kong clock |
| --- | --- | --- | --- | --- | --- | --- |
| `InvoicePdf` | sent-at | 2026-09-08T16:00:00Z, Hong Kong midnight | 9 | September | 2026 | 00:00 |
| `InvoicePdf` | payment deadline | 2026-09-08T15:59:00Z, one minute before Hong Kong midnight | 8 | September | 2026 | 23:59 |
| `InvoicePdf` | payment deadline | 2026-09-08T16:00:00Z, Hong Kong midnight | 9 | September | 2026 | 00:00 |
| `ReceiptPdf` | date paid | 2026-09-08T16:00:00Z, Hong Kong midnight | 9 | September | 2026 | 00:00 |

**Steps:**

1. Render <document> with the row's date.
2. Read the <date row> row.

**Expected Results:**

* The row shows the day <Hong Kong day>, the month <Hong Kong month> named in English and the year <Hong Kong year>, in the renderer's own arrangement, and the clock <Hong Kong clock>.
* The row ends in `GMT+8`.
* The row does not contain `HKT`.

<!-- trace:case id=g10.shared-invoice-and-receipt-pdf.TC-ckd rev=1 covers=g10.shared-invoice-and-receipt-pdf.SC-i53,g10.shared-invoice-and-receipt-pdf.SC-2d5,g10.shared-invoice-and-receipt-pdf.SC-ca8,g10.shared-invoice-and-receipt-pdf.SC-0s1,g10.shared-invoice-and-receipt-pdf.SC-t8t,g10.shared-invoice-and-receipt-pdf.SC-1sf -->
### shared-ui-invoice-and-receipt-pdf-US1-TC50-1: The GMT+8 suffix stays under non-English copy

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Presentation-only contract

**Pre-conditions:**

* `InvoicePdf` and `ReceiptPdf` are each rendered with a `copy` argument in <copy language>, with the sent-at date and the date paid supplied as 2026-09-01T12:00:00Z.

**Test data:**

| Copy language |
| --- |
| en |
| zh-Hant |

**Steps:**

1. Render `InvoicePdf` and `ReceiptPdf` with the pre-conditions.
2. Read the sent-at row on the invoice.
3. Read the date paid row on the receipt.

**Expected Results:**

* Step 2: the row shows the Hong Kong day 1, the month September named in English and the year 2026, in the renderer's own arrangement, and the clock 20:00.
* Step 3: the row shows the Hong Kong day 1, the month September named in English and the year 2026, in the renderer's own arrangement, and the clock 20:00.
* Steps 2 and 3: each row ends in `GMT+8`, not translated, dropped or replaced by an abbreviation.

## Settled

- The documents' date rows are the invoice's sent-at date and payment deadline and the receipt's date paid.
- A date that is not a valid instant stops the render on a document as it does on every surface.
- A document's date words are English and `GMT+8` prints as written under any copy language; neither is a label read from the copy.
- A document date's arrangement and month words are not asserted: the cases check the Hong Kong day, the clock and `GMT+8`, and the platform's deadline shape on documents is a later decision.

## Reconciliation

**Run:** QA2 re-run, 2026-10-06, for change `align-collector-times-to-local-zone`, in a fresh context, after the final accept-review's blocker was fixed in the `shared/dates-and-times` delta (a scenario narrowed, decisions Q20 and Q21, the tech design, the tasks and the PRD pages aligned with it) and after decisions Q28, which the planning owner settled by default and the human has not yet answered (a grading letter's shop-hours line keeps its own wording, a recorded non-goal). No new blind reading ran, and QA1 and Dev were not run again: no anchor changed after they read them, so both readings stand. It joined three readings on the anchors: QA1's blind cases from the first run, Dev's delta `spec.md`, `tech-design.md` and `tasks.md` as the editor revised them, and the human's answers (decisions Q5 to Q27, with the Q28 default) as the editor applied them to the proposal, the specs, the design, the tasks, the suites and the PRD pages. QA1, as its run recorded, read the rulebook, the `spec-to-tcs` skill, `writing.md`, `test-traceability.md` and `tcs-conventions.md`, and a bundle of the change's `proposal.md`, `decisions.md` with `## Raised`, `openspec/config.yaml`'s `context`, each capability's `## Purpose` and `## Feature set`, its `user-journeys.md`, its PRD page and the durable suite with its `## Reconciliation` stripped; it was denied every `## Requirements` section and scenario, `tech-design.md`, `tasks.md`, every other suite, application code and every validator. Dev, as its run recorded, was denied every `feature-tcs.md`, every domain suite, every reconciliation and QA1's output. This pass was not blind and wrote no case. It read the planning skill and the rulebooks whole (`specs-to-test-cases.md`, `tcs-conventions.md`, `test-traceability.md`, `writing.md`, `task-ownership.md`), the change's artifacts, the durable spec and suite this change folds into, the touched PRD pages as a diff against `HEAD`, the store's `pdf-document.ts` and its tests and, read-only, the application's invoice page and date formatter. It re-derived the dates the cases state (the Hong Kong day, month and clock across the midnight rows) from Node's `Intl` and found them as written. It ran `pnpm run tcs:validate` on this scope, plain and with `--strict`, with no findings; `pnpm run trace validate` on the working tree and on a clean `git archive HEAD` export, where the only new issues are delta-against-durable duplicate-id pairs, none of them in this capability, and the six unresolved-reference issues the `HEAD` export reports against the durable cases of the date leaf are gone, since the delta carries the scenario id they cover; `openspec validate --strict`; `pnpm check:manual`, with no failures and no warning naming this change; `accept-preflight`; a fold of all three deltas in a scratch copy of the store, read against the durable files (every kept marker byte-identical but for revision 2 on `shared-dates-and-times-SC-11` to `shared-dates-and-times-SC-14`, every durable heading verbatim, `tcs:validate --require-suites` clean on the folded copy); and the store's node-lane tests for the formatter, PDF and `AuctionCard` files (39 pass) and the `@grade10/ui` type check. It ran none of the application's tests and did not run the story lane. It changed this line and no other in this file. No domain, product or platform suite sits above this capability (the proposal records no domain and no platform impact), so no scenario is covered at domain. It is a statement, not proof.

| Finding | Disposition |
| --- | --- |
| TC49: payment deadline and date paid end in `GMT+8` across a Hong Kong midnight | **Agreed:** `shared-ui-invoice-and-receipt-pdf-SC-43` (an invoice's meta row) and `shared-ui-invoice-and-receipt-pdf-SC-54` (a receipt's date paid). **Added rows and retyped:** the invoice's sent-at date joined, so the case reaches every date row the documents draw (the proposal's "100% of the surfaces this change names"), and it takes the acceptance type from `shared/dates-and-times` TC6, dropped there. It overlaps durable `shared-ui-invoice-and-receipt-pdf-US1-TC41-1`, which reads the sent-at row at no stated boundary; kept, for the receipt and the midnight boundary TC41 never reads |
| TC50: the `GMT+8` suffix stays, and the date reads the same, under non-English copy | **Unblocked:** the human answered (decisions Q9, see Settled). **Folded in:** `shared-ui-invoice-and-receipt-pdf-SC-55`, which the case now covers. The built renderer prints the date in English and `GMT+8` in every language, so no code moves. **Restyled:** the results assert the Hong Kong day, the English month, the clock and the suffix, never an arrangement (decisions Q14) |
| `shared-ui-invoice-and-receipt-pdf-SC-54`: a receipt's date paid | **Agreed:** `shared-ui-invoice-and-receipt-pdf-US1-TC49-1` carries its row; no durable case reads a receipt's date |
| Raised: which dates appear on the documents besides sent-at, payment deadline and date paid | **Rejected:** the Feature set's meta rows list them, and the renderers draw no other date |
| Raised: what a document shows when a date is omitted or not a valid instant | **Rejected:** the three dates are required `Date` props, and the platform's invalid-instant rule stops the render; the built formatter throws on an invalid date |
| Raised: whether the `GMT+8` suffix is the renderer's or the copy's, and whether the date's words follow the copy | **Landed:** decisions Q9. The requirement now says the date's words are English and `GMT+8` prints as written under any copy language, so it is not a label the copy supplies |
| Raised: what shape a document date takes | **Landed:** decisions Q14, left out of this change. The built date reads `September 2, 2026, 00:30 GMT+8`, a draft winner-order case reads `2026-09-10 20:00 GMT+8` and the store's sample emails read `17 Sep 2026, 21:00 GMT+8`; the cases here assert the day, the clock and the suffix, never the arrangement |
| Raised: does a date with no clock name `GMT+8` on a document | **Landed:** decisions Q12. The documents' date rows all carry a clock, so nothing here moves; the message rule holds the clause |
| Raised: winner zone versus the brand's GMT+8 (first run) | **Landed:** decisions Q3. The requirement says every document date is the Hong Kong day and clock followed by `GMT+8`, whatever zone the winner is in. **Cases:** `shared-ui-invoice-and-receipt-pdf-US1-TC49-1` and `shared-ui-invoice-and-receipt-pdf-US1-TC50-1`; the machine's zone is set to America/New_York in the first |
| Second re-run: TC49 and TC50 wrote the date as `9 September 2026` and `1 September 2026`, an arrangement decisions Q14 left open (the renderer prints `September 9, 2026, 00:00 GMT+8`) | **Restyled:** the data and results give the day, the month in English, the year and the clock as components, in the renderer's own arrangement. Ids, revisions and markers kept |
| Second re-run: the delta repeated the capability's Feature set leaf for dates, with a clause the leaf did not hold | **Removed:** the delta's leaf. A leaf that differs from the durable one by a clause and carries no label folds in as a second bullet, so the durable leaf stays the only one and the English-words clause is the requirement's. The delta keeps the root group line `Presentation-only contract` and no leaf under it: the cases trace that group and the validator reads a case's anchor from the delta spec beside the suite; the fold adds nothing for a group with no leaf |
| Contradictions between QA1's cases and Dev's scenarios | **Contradicted:** none |
| `shared-ui-invoice-and-receipt-pdf-SC-43`: the six durable cases that cover the Presentation-only contract name `g10.shared-invoice-and-receipt-pdf.SC-i53`, an id no scenario issued | **Restored:** the date scenario carries `SC-i53` again, the id the migration of the suite's traces gave it (the four scenarios of that group are the four ids the six cases cover), in place of the new marker QA2 first allocated. The cases here cover it, and the six durable cases resolve it |
| tech-design.md decision 5 (derive the label from the document zone) | **Joined:** the rendered text does not change, so no scenario moves; `shared-ui-invoice-and-receipt-pdf-SC-43` and `shared-ui-invoice-and-receipt-pdf-SC-54` hold the unchanged output |
| Third re-run: the fold would take this file's `2026-10-06, tcs-rules r4` over the durable suite's `2026-09-23, tcs-rules r3` | **Kept at r3:** decisions Q26. The header reads `2026-09-23, tcs-rules r3`, so the fold leaves the durable stamp and `pnpm run tcs:stale` keeps listing the suite's untouched drafts; the two cases here, written under r4, sit under that stamp until the suite is regenerated |

**Uncovered anchors:** none for the date leaf of `Presentation-only contract`.

### Manual

| Manual | Why |
| --- | --- |
| `shared-ui-invoice-and-receipt-pdf-US1-TC50-1` | A person renders both documents with a Traditional Chinese `copy` argument and reads the date rows, to be walked in task 5.1's walk; the invoice and receipt stories carry English copy only and no test reads a non-English document yet |
