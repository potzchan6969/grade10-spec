# grade10-site/loyalty/programme Membership surface Test Cases

**Status:** pending-review · 0/1
**Drafts styled:** 2026-10-28, tcs-rules r7

## Reconciliation

**Run:** no blind pass — a removal: `TierCard` drops its Benefits affordance
(`href`, `onClick`, `copy.benefits`), so the restated requirement carries the
same scenario set with `grade10-site-loyalty-programme-SC-257` retitled to
assert the card is never interactive. No other clause moves.

- **Retitled** — `grade10-site-loyalty-programme-SC-257` now asserts
  nothing on the card is interactive, the footer holding the earn line
  alone; `g10.loyalty-programme.US4-TC26` covers it.
- **Owed to the durable suite** — `g10.loyalty-programme.US4-TC21` and
  `g10.loyalty-programme.US4-TC24` still read the Benefits control and the
  Tiers & Benefits hop; they go `deprecated` at the next suite refresh.

## Walk 1: Read the tier card on Membership

Starting state:

* customer(member) is signed in and opens `<loyalty>`.

Shared test data:

| Field | Value |
| --- | --- |
| loyalty | The member's Membership page, Overview tab |

### Route

1. Read the tier card on `<loyalty>`.
   * The card shows the tier's skin, the balance, what the balance pays,
   the qualifying progress, and the earn line — and nothing on it is a
   link or a button. `g10.loyalty-programme.US4-TC26`

## Background

* The tier card is a statement of standing; the rail carries the page's
  sections, Tiers & Benefits among them.

---

## g10.loyalty-programme.US04: Member reads two counts and redeems from one surface

**As a** member,
**I want** my tier, balance, and activity on one surface, in the programme's dates,
**so that** I can join, redeem, and never see the operator's reasons behind an entry.

<!-- trace:case id=g10.loyalty-programme.TC-m4k rev=1 covers=g10.loyalty-programme.SC-6xz -->
### g10.loyalty-programme.US4-TC26: The tier card carries no link or button

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-loyalty-programme-US-04

**Pre-conditions:**

* customer(member) is signed in and `<loyalty>` is open on the Overview tab.

**Steps:**

1. Press anywhere on the tier card.

**Expected results:**

* Nothing navigates and nothing opens; the card holds only the tier's
  skin, balance, worth, qualifying progress, and earn line.
