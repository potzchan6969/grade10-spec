# grade10-site/auction/listing-page Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-listing-page-US15: Collector tells Recent Bids rivals apart by avatar letter

**As a** collector,
**I want** each Recent Bids avatar on the lot to show that bidder's email
initial while the label stays Bidder N,
**so that** I can tell who bid what without reading a name or email.

<!-- trace:case id=g10.auction-listing-page.TC-ava rev=1 -->
### grade10-site-auction-listing-page-US15-TC1-1: Rival Recent Bids avatars show different email letters

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* `<listing_1>` is open in HKD.
* customer A(card linked, email `<email_ada>`) and customer B(card linked, email `<email_bob>`) each have an accepted public bid on `<listing_1>`.
* A collector is on the lot page for `<listing_1>` in English.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| email_bob | `bob@example.com` |

**Steps:**

1. Open Recent Bids on the lot page.
2. Find customer A's public row and customer B's public row.

**Expected Results:**

* Customer A's avatar shows `A`.
* Customer B's avatar shows `B`.
* Neither row shows an email or personal name.
* Readable labels stay listing pseudonyms or You, not an email-prefixed form.

<!-- trace:case id=g10.auction-listing-page.TC-avb rev=1 -->
### grade10-site-auction-listing-page-US15-TC2-1: The viewer row still uses the email letter under You

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-15

**Pre-conditions:**

* customer A(signed in, card linked, email `<email_ada>`) has an accepted public bid on open `<listing_2>` and is on that lot page.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |

**Steps:**

1. Open Recent Bids.
2. Find the row marked You.

**Expected Results:**

* The You row's avatar shows `A`.
* The row still shows the You badge.

## grade10-site-auction-listing-page-US12: Collector sees another bid on the lot without reloading

**As a** collector,
**I want** a bid placed on another page to show on mine with the new price and close, without a reload,
**so that** I bid against the price that stands.

<!-- trace:case id=g10.auction-listing-page.TC-avc rev=1 -->
### grade10-site-auction-listing-page-US12-TC9-1: A live bid arrives with its email avatar letter

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-page-US-12

**Pre-conditions:**

* collector A has `<listing_3>` open with a live line.
* customer B(card linked, email `<email_mike>`) can bid on `<listing_3>` from another session.

**Test data:**

| Field | Value |
| --- | --- |
| email_mike | `mike@example.com` |

**Steps:**

1. As collector A, watch Recent Bids.
2. As customer B, place an accepted public bid on `<listing_3>`.
3. As collector A, without reloading, find customer B's new Recent Bids row.

**Expected Results:**

* The new row appears without a reload.
* Its avatar shows `M`.
* Its readable label is a listing pseudonym, not an email.

## Reconciliation

**Run:** QA1 blind pass on frozen Feature set + journeys + proposal/decisions/ui-design + linked PRD sections; denied Requirements, tech-design, and archive. Domain: no new domain case (see bidding-history suite Run line). QA2 reconciled against Dev scenarios SC-52 and SC-53.

| Case | Disposition |
| --- | --- |
| `grade10-site-auction-listing-page-US15-TC1-1` | Folded — covered by `grade10-site-auction-listing-page-SC-52` |
| `grade10-site-auction-listing-page-US15-TC2-1` | Folded — covered by `grade10-site-auction-listing-page-SC-52` (viewer row clause) |
| `grade10-site-auction-listing-page-US12-TC9-1` | Folded — covered by `grade10-site-auction-listing-page-SC-53` |
| `grade10-site-auction-listing-page-SC-52` | Covered by `grade10-site-auction-listing-page-US15-TC1-1` and `US15-TC2-1` |
| `grade10-site-auction-listing-page-SC-53` | Covered by `grade10-site-auction-listing-page-US12-TC9-1` |
