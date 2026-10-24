# shared/ui/auction-listing Test Cases

**Status:** pending-review · 0/11
**Drafts styled:** 2026-10-24, tcs-rules r7
**Regenerated:** 2026-10-24, tcs-rules r7

**Out of suite (unit):** shared-ui-auction-listing-SC-03, shared-ui-auction-listing-SC-04, shared-ui-auction-listing-SC-08, shared-ui-auction-listing-SC-14, shared-ui-auction-listing-SC-57

**Out of suite (non-GUI):** shared-ui-auction-listing-SC-01, shared-ui-auction-listing-SC-02

## Background

* The blocks are read where Grade10 composes them: a listing's page on the Grade10 site of the environment under test, its bid panel showing Set maximum to a collector who holds no maximum and Raise to one who leads.
* A listing near the ceiling is set up in the admin console with a starting price at the stated amount; every amount is in whole USD. The custom maximum ceiling is USD10,000,000, and the increment from USD1,500,000 is USD100,000.

## g10.shared-auction-listing.US1: The listing surface's rendering contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared bid panel,
**I want** the panel to never offer an amount the supplied currency ceiling refuses,
**so that** the collector reads the limit instead of a broken raise form.

<!-- trace:case id=g10.shared-auction-listing.TC-jr1 rev=3 covers=g10.shared-auction-listing.SC-z2x,g10.shared-auction-listing.SC-qdv -->
### g10.shared-auction-listing.US1-TC22: An oversized replacement of the draft becomes the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) is on an open listing's page in `<mode>`, with 500 typed in the custom maximum.

**Test data:**

| `<mode>` | `<entry>` |
| --- | --- |
| Set maximum | Paste 10000001 over the selected draft |
| Set maximum | Drop the dragged text 10000001 onto the selected draft |
| Raise | Paste 10000001 over the selected draft |

**Steps:**

1. Select the draft and replace it by `<entry>`.
2. Read the draft and the amount the panel reviews.

**Expected Results:**

* The draft reads 10000000, the ceiling, and the reviewed amount agrees.
* No message about the ceiling shows.

<!-- trace:case id=g10.shared-auction-listing.TC-bfp rev=3 covers=g10.shared-auction-listing.SC-y2e -->
### g10.shared-auction-listing.US1-TC23: An oversized pasted amount with cents is cleaned, then capped

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) is on an open listing's page with Set maximum, 500 typed in the custom maximum.

**Test data:**

| `<paste>` |
| --- |
| 10000001.99 |
| 999999999999999999999999999999.99 |

**Steps:**

1. Select the draft and paste `<paste>`.
2. Read the draft and the reviewed amount.

**Expected Results:**

* The cents are dropped without rounding, and the draft reads 10000000.
* The reviewed amount agrees, and no message about the ceiling shows.

<!-- trace:case id=g10.shared-auction-listing.TC-hsy rev=3 covers=g10.shared-auction-listing.SC-xxl -->
### g10.shared-auction-listing.US1-TC24: A Raise draft at the ceiling keeps it against a typed digit and a paste

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) leads an open listing with a maximum below 500, and is on its page with Raise, 10000000 typed in the custom maximum.

**Steps:**

1. Type 1 at the end of the draft and read it.
2. Select the draft, paste 10000001 and read it.
3. Set the draft to 500, put the caret at its end, paste 10000001 without selecting, and read the draft and reviewed amount.

**Expected Results:**

* Step 1 still reads 10000000.
* Steps 2 and 3 read 10000000, and the reviewed amount agrees each time.
* No message about the ceiling shows.

<!-- trace:case id=g10.shared-auction-listing.TC-ftm rev=3 covers=g10.shared-auction-listing.SC-z2x -->
### g10.shared-auction-listing.US1-TC25: A ceiling correction shows no too-large or invalid-amount message

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) is on an open listing's page in `<mode>`, whose minimum next bid is at or below 60500, with 60500 typed in the custom maximum and no message beside the field.

**Test data:**

| `<mode>` |
| --- |
| Set maximum |
| Raise |

**Steps:**

1. Select the draft, paste 10000001, and read the field and the messages around it.

**Expected Results:**

* The draft reads 10000000, and the reviewed amount agrees.
* No maximum-bid, invalid-amount or below-minimum message shows.

<!-- trace:case id=g10.shared-auction-listing.TC-g02 rev=3 covers=g10.shared-auction-listing.SC-6n7 -->
### g10.shared-auction-listing.US1-TC26: A paste at the ceiling with cents commits the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/shared/ui/auction-listing/custom-maximum-ceiling.spec.ts`

**Pre-conditions:**

* customer(signed in, card linked) is on an open listing's page in `<mode>`, with 500 typed in the custom maximum.

**Test data:**

| `<mode>` |
| --- |
| Set maximum |
| Raise |

**Steps:**

1. Select the draft and paste 10000000.99.
2. Read the draft and the reviewed amount, then confirm the maximum.
3. Read Your maximum.

**Expected Results:**

* Step 2: the cents are dropped without rounding, and both read 10000000.
* Step 3 reads USD10,000,000.

<!-- trace:case id=g10.shared-auction-listing.TC-dej rev=2 covers=g10.shared-auction-listing.SC-huw -->
### g10.shared-auction-listing.US1-TC59: A quick bid past the ceiling is offered at the ceiling

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* customer(signed in, card linked) leads an open listing with maximum `<maximum>`, and is on its page with Raise.

**Test data:**

| `<maximum>` | `<chips>` |
| --- | --- |
| USD9,850,000 | USD9,950,000; USD10,000,000, the 2× and 4× chips merged at the limit |
| USD9,750,000 | USD9,850,000; USD9,950,000; USD10,000,000, the 4× chip at the limit |

**Steps:**

1. Read each quick-bid chip's amount and caption.
2. Select the chip at USD10,000,000 and confirm.
3. Read Your maximum.

**Expected Results:**

* Step 1 shows `<chips>`, none above USD10,000,000.
* The chip at the ceiling is captioned as the auction's limit; every other chip keeps its step and caption.
* Step 3 reads USD10,000,000.

<!-- trace:case id=g10.shared-auction-listing.TC-w4r rev=2 covers=g10.shared-auction-listing.SC-atq -->
### g10.shared-auction-listing.US1-TC60: Chips capped onto the same amount merge to one

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Quick bids

**Pre-conditions:**

* customer(signed in, card linked) leads an open listing with maximum `<maximum>`, and is on its page with Raise.

**Test data:**

| Field | Value |
| --- | --- |
| `<maximum>` | USD9,950,000 (range: 9900001–9999999 whole dollars, so every step passes the ceiling) |

**Steps:**

1. Read the quick-bid chips.
2. Select the chip and confirm, then read Your maximum.

**Expected Results:**

* Step 1 shows one chip, USD10,000,000, captioned as the limit.
* Step 2 reads USD10,000,000.

<!-- trace:case id=g10.shared-auction-listing.TC-9rx rev=2 covers=g10.shared-auction-listing.SC-v6g,g10.shared-auction-listing.SC-1mi -->
### g10.shared-auction-listing.US1-TC61: A leader with no amount left below the ceiling sees the entry collapse

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Ceiling reached

**Pre-conditions:**

* customer(signed in, card linked) leads an open listing with maximum `<maximum>` at current bid `<current bid>`, and is on its page.

**Test data:**

| `<maximum>` | `<current bid>` | `<why no amount is left>` |
| --- | --- | --- |
| USD10,000,000 | USD1,200 | The raise floor, the maximum plus USD1, is past the ceiling |
| USD9,999,950 | USD9,999,950 | The minimum next bid, USD10,099,950, is past the ceiling |

**Steps:**

1. Read the raise area of the bid panel.

**Expected Results:**

* No quick-bid chip, custom maximum field or bid action shows.
* A status row leads with Max `<maximum>`, its Info tooltip explaining the private maximum, and one line that the auction accepts no higher amount; no line explains how to raise.
* The buyer-fee line still shows.

<!-- trace:case id=g10.shared-auction-listing.TC-5dh rev=2 covers=g10.shared-auction-listing.SC-cfl -->
### g10.shared-auction-listing.US1-TC62: A listing priced past the ceiling offers no entry

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Ceiling reached

**Pre-conditions:**

* customer(signed in, card linked) holds no maximum on an open listing whose current bid is `<current bid>`, and is on its page.

**Test data:**

| Field | Value |
| --- | --- |
| `<current bid>` | USD9,950,000 (range: 9900001–9999999 whole dollars, so the minimum next bid passes the ceiling) |

**Steps:**

1. Read the bid panel's entry area.

**Expected Results:**

* No quick-bid chip, custom maximum field or bid action shows.
* A status row names USD10,000,000 and says bidding has reached the highest amount the auction accepts.
* The buyer-fee line still shows.

<!-- trace:case id=g10.shared-auction-listing.TC-swf rev=2 covers=g10.shared-auction-listing.SC-rnz -->
### g10.shared-auction-listing.US1-TC63: The ceiling collapse outranks the card setup lock

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Ceiling reached

**Pre-conditions:**

* customer(signed in) leads an open listing with a maximum of USD10,000,000, and their card on file has since been removed, so the panel asks for a card; customer is on the listing's page.

**Steps:**

1. Read the bid panel's entry area.

**Expected Results:**

* The collapsed status row shows; the disabled chips, custom field and link-card action do not.

<!-- trace:case id=g10.shared-auction-listing.TC-oem rev=1 covers=g10.shared-auction-listing.SC-2wv -->
### g10.shared-auction-listing.US1-TC64: A digit added at the ceiling is capped by paste and dropped by typing

Runs once per row of **Test data**.

**Classification:**

* **Severity:** minor
* **Priority:** low
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Custom maximum ceiling

**Pre-conditions:**

* customer(signed in, card linked) is on an open listing's page in `<mode>`, with 10000000 typed in the custom maximum and the caret at its end.

**Test data:**

| `<mode>` |
| --- |
| Set maximum |
| Raise |

**Steps:**

1. Paste 1 at the end and read the draft.
2. Set the draft to 10000000 again, type 1 at the end and read the draft.

**Expected Results:**

* Step 1 reads 10000000, the ceiling.
* Step 2 reads 10000000, the draft before the digit.
* No message about the ceiling shows.

## Settled

- A lost standing on the bid card is the Did not win badge alone; that the card was not charged is said on My Auctions, never on the listing's card.
- Winner is a primary crown after the amount on a closed sold listing, not a Winner badge.
- Equal-maximum rows below the leader use the Info tip in the amount's tone, with earlier-leads copy.
- No new badge size or footnote under Recent bids.
- Wide enough means the gallery can place a left rail beside the main frame; the threshold stays in code.
- A stacked gallery of several images hides the rail; previous, next and the progress remain, with no other strip under the stage.
- A one-image gallery shows no rail or previous and next; an empty gallery shows no item or previous and next.
- A catalogue tile's Ends, Opens and Closed lines all name the viewer's zone.
- The bid card carries a dated collector deadline beside its countdown, and its closed block names the viewer's zone after a close time that shows a clock; a close shown as a day alone names none.
- An older bid row's time carries no zone name; a supplied display text replaces only the formatted time.
- Activity time reads relative below seven days and as a local moment from seven days.
- A zone name on a tile or a bid card is English in every language: the zone's short name in US English, HKT for Hong Kong, and an offset where US English has none.
- The tile's Ends, Opens and Closed words stay English in every language.
- The custom maximum ceiling is USD10,000,000 whole dollars; the HKD and JPY ceilings are retired.
- An appended typed digit above the ceiling keeps the valid draft; an oversized paste or replacement becomes the ceiling after whole-dollar cleaning.
- A ceiling correction shows no maximum-bid or invalid-amount message; Set maximum and Raise share the rule.
- Chips step 1×, 2× and 4× the increment, from the committed maximum for a leader and from the current bid otherwise; a leader's typed floor is the maximum plus USD1 and is not chip 1.
- Magnification happens in place under a pointer-following lens; there is no magnifier button or zoom dialog, and a touch pointer raises nothing.
- The lens takes the consumer's zoom name, with optional instructions, as its accessible name; the magnified copy stays hidden from assistive technology.
