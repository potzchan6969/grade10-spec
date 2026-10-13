# grade10-site/auction/bidding-history Test Cases

**Status:** pending-review
**Drafts styled:** 2026-10-07, tcs-rules r4

## grade10-site-auction-bidding-history-US9: Collector sees public bid avatars without learning emails

**As a** collector,
**I want** each public bid avatar to show one letter from that bidder's email
without learning their email or name,
**so that** I can tell rivals apart on the public ledger while identity stays
behind the listing pseudonym.

<!-- trace:case id=g10.auction-bidding-history.TC-ava rev=1 -->
### grade10-site-auction-bidding-history-US9-TC1-1: Public ledger avatar matches the email local-part letter

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* `<listing_1>` is published with at least one counted public bid from a bidder whose email is `<email_ada>`.

**Test data:**

| Field | Value |
| --- | --- |
| email_ada | `ada@example.com` |
| expected_letter | `A` |

**Steps:**

1. Read the anonymous public listing response for `<listing_1>`.
2. Find the public bid row for that bidder.

**Expected Results:**

* The row's listing pseudonym is of the form Bidder N.
* The row's avatar character is `<expected_letter>`.
* The response body contains neither `<email_ada>` nor a personal display name for that bidder.

<!-- trace:case id=g10.auction-bidding-history.TC-avb rev=1 -->
### grade10-site-auction-bidding-history-US9-TC2-1: Erased or letterless email falls back to B

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-bidding-history-US-09

**Pre-conditions:**

* `<listing_2>` has a public bid whose bidder email was erased, and a public bid whose email local part has no letter or digit before `@`.

**Steps:**

1. Read the anonymous public listing response for `<listing_2>`.
2. Check each of those two public bid rows.

**Expected Results:**

* Each row's avatar character is `B`.
* Each row still shows a listing pseudonym of the form Bidder N.
* Neither row exposes an email.

## Reconciliation

**Run:** QA1 blind pass on frozen Feature set + journeys + proposal/decisions/ui-design + linked PRD sections; denied Requirements, tech-design, and archive. Domain suite: no new domain case — existing cases already assert listing-pseudonym naming; avatar letter is feature-owned on US-09/US-15. QA2 reconciled against Dev scenarios SC-52 and SC-53.

| Case | Disposition |
| --- | --- |
| `grade10-site-auction-bidding-history-US9-TC1-1` | Folded — covered by `grade10-site-auction-bidding-history-SC-52` |
| `grade10-site-auction-bidding-history-US9-TC2-1` | Folded — covered by `grade10-site-auction-bidding-history-SC-53` |
| `grade10-site-auction-bidding-history-SC-52` | Covered by `grade10-site-auction-bidding-history-US9-TC1-1` |
| `grade10-site-auction-bidding-history-SC-53` | Covered by `grade10-site-auction-bidding-history-US9-TC2-1` |
