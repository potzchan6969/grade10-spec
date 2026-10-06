# shared/dates-and-times Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-06, tcs-rules r4

## shared-dates-and-times-US1: Collector and document clocks

**Walked by:** nobody on their own — a format every surface that shows a date inherits; the journeys live in the capabilities that render one

**As a** collector,
**I want** clocks on the site to follow my zone and documents to name GMT+8,
**so that** a listing close and a letter never disagree on the label by accident.

<!-- trace:case id=g10.shared-dates-and-times.TC-aa8 rev=1 covers=g10.shared-dates-and-times.SC-q9t,g10.shared-dates-and-times.SC-4ud,g10.shared-dates-and-times.SC-nes,g10.shared-dates-and-times.SC-jjm,g10.shared-dates-and-times.SC-h8g,g10.shared-dates-and-times.SC-upj,g10.shared-dates-and-times.SC-uu8 -->
### shared-dates-and-times-US1-TC12-1: Auction page close follows the viewer

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* A listing is open for bids.
* Two viewers supply `Asia/Hong_Kong` and `America/New_York`.

**Steps:**

1. Render the close time on the auction page for each viewer.

**Expected Results:**

* Each rendering uses that viewer's local clock.
* Each names that viewer's short zone.
* The New York rendering is not suffixed `HKT`.

<!-- trace:case id=g10.shared-dates-and-times.TC-iko rev=1 covers=g10.shared-dates-and-times.SC-ec5,g10.shared-dates-and-times.SC-ufo -->
### shared-dates-and-times-US1-TC15-1: An auction email states GMT+8

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Sent messages

**Pre-conditions:**

* An auction email carries a close time.

**Steps:**

1. Render the message.

**Expected Results:**

* The time is stated in Asia/Hong_Kong.
* The rendering names `GMT+8`.

<!-- trace:case id=g10.shared-dates-and-times.TC-pbx rev=1 covers=g10.shared-dates-and-times.SC-q9t,g10.shared-dates-and-times.SC-4ud,g10.shared-dates-and-times.SC-nes,g10.shared-dates-and-times.SC-jjm,g10.shared-dates-and-times.SC-h8g,g10.shared-dates-and-times.SC-upj,g10.shared-dates-and-times.SC-uu8 -->
### shared-dates-and-times-US1-TC23-1: Two zones read different collector clocks

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* The same instant is rendered as a local moment for `Asia/Hong_Kong` and `America/New_York`.

**Steps:**

1. Read both strings.

**Expected Results:**

* The clock values differ.
* Neither string contains `UTC` or `HKT`.

<!-- trace:case id=g10.shared-dates-and-times.TC-r8d rev=1 covers=g10.shared-dates-and-times.SC-q9t,g10.shared-dates-and-times.SC-4ud,g10.shared-dates-and-times.SC-nes,g10.shared-dates-and-times.SC-jjm,g10.shared-dates-and-times.SC-h8g,g10.shared-dates-and-times.SC-upj,g10.shared-dates-and-times.SC-uu8 -->
### shared-dates-and-times-US1-TC29-1: Two collectors read different collector clocks

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation
* **Trace:** Stated zones

**Pre-conditions:**

* The same instant is rendered as a collector deadline for `Asia/Hong_Kong` and `America/New_York`.

**Steps:**

1. Read both strings.

**Expected Results:**

* The clock values differ.
* The Hong Kong string names `HKT`.
* The New York string names `EDT` and does not contain `HKT`.

## Reconciliation

**Run:** QA2, 2026-10-06, for change `align-collector-times-to-local-zone`. Collector clocks follow the viewer; documents name GMT+8.

| Finding | Disposition |
| --- | --- |
| Auction page close follows the viewer | **Folded in:** `shared-dates-and-times-SC-12` / US1-TC12-1 |
| Email names GMT+8 | **Folded in:** `shared-dates-and-times-SC-15` / US1-TC15-1 |
| Two zones read different collector clocks | **Folded in:** `shared-dates-and-times-SC-23` / US1-TC23-1, `SC-29` / US1-TC29-1 |
