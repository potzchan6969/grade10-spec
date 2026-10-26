# shared/ui/store-cart Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-27, tcs-rules r7

## Background

* `<storybook>` is the shared UI Storybook's Store Cart area. The
  `Store/Cart/Blocks/PromoTicket` stories accept the supplied title, detail,
  code, applicability, detail emphasis and action props.

## shared.ui-store-cart.US22: Shopper sees public codes in the picker

**As a** shopper,
**I want** the promo-code picker to list the public codes the consumer passes in their own section,
**so that** I can pick a code open to everyone beside whatever codes are mine.

<!-- trace:case id=g10.shared-store-cart.TC-97c rev=1 covers=g10.shared-store-cart.SC-n0y,g10.shared-store-cart.SC-rt4,g10.shared-store-cart.SC-p5j -->
### shared.ui-store-cart.US22-TC1: Promo tickets keep supplied detail emphasis separate from the title

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** shared.ui-store-cart.US22

**Pre-conditions:**

* The matching `PromoTicket` story is available at `<storybook>` and can be
  supplied the row's title, expiry/conditions detail, code, applicability,
  refusal reason, detail emphasis and action.

**Test data:**

| State | `detailEmphasis` | Applicability and action |
| --- | --- | --- |
| applicable near-expiry ticket | `true` | applicable, Apply action supplied |
| applicable plain ticket | `false`, then omitted | applicable, Apply action supplied |
| public inapplicable near-expiry ticket | `true` | muted and inapplicable, refusal supplied, no action |

**Steps:**

1. Open the matching `PromoTicket` story at `<storybook>` with the row's
   props.
2. Read the title, detail, code, refusal reason and action slots, and inspect
   the ticket order and the detail's classes.
3. Activate Apply where the row supplies it and inspect the callback record.

**Expected Results:**

* The near-expiry applicable row keeps the supplied discount title, expiry or
  conditions detail, code, Apply action, callback and position; only the
  existing detail slot has the emphasis treatment.
* The plain row remains plain for both false and omitted values; the shared
  ticket does not infer emphasis from the displayed text or a clock, and all
  supplied slots remain unchanged.
* The public inapplicable row remains muted with its refusal reason and no
  Apply action, while its supplied expiry detail alone receives the emphasis;
  title, detail text, code and position remain unchanged.

## Reconciliation

**Run:** 2026-10-27. The initial QA1 Store pass produced the Grade10 PRD
cases; acceptance preflight then exposed that this shared delta also owes a
feature suite. QA2 added this single Storybook case as the missing shared
contract coverage and reconciled it against `SC70`–`SC72` without changing
the product decision or adding copy.

| Case | Disposition |
| --- | --- |
| `shared.ui-store-cart.US22-TC1` | Retain as a draft Storybook case. Its three rows cover the emphasized applicable ticket, plain false/omitted values, and a public inapplicable muted ticket. It fully asserts `g10.shared-store-cart.SC70`, `SC71` and `SC72`; no application or backend behavior is claimed. |

| Source in `spec.md` | Complete asserting case |
| --- | --- |
| `g10.shared-store-cart.SC70` | `shared.ui-store-cart.US22-TC1` |
| `g10.shared-store-cart.SC71` | `shared.ui-store-cart.US22-TC1` |
| `g10.shared-store-cart.SC72` | `shared.ui-store-cart.US22-TC1` |

- **Anchor coverage** - The one case traces the existing `US22` journey and
  exercises the shared Storybook contract; the Grade10 cart cases remain the
  application-level walk.
- **Uncovered scenarios** - None.
- **Decisions** - No new decision; the shared component renders a supplied
  boolean and does not own the 14-day clock or wording.
- **Ownership** - The shared UI group supplies the Storybook props and
  renderer checks; Grade10 owns expiry derivation and the cart walk.
- **Lifecycle** - The case remains draft/manual; no execution or human review
  credit is claimed.

### Manual

| Manual | Why |
| --- | --- |
| `shared.ui-store-cart.US22-TC1` | To be walked in the controlled shared UI Storybook after the shared contract and Grade10 mapper land. |
