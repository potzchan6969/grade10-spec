# shared/ui/auction-listing Test Cases

**Status:** pending-review · 0/2

## Background

* The catalogue tile `AuctionLotCard` is a preview part, not a `@grade10/ui` export: it renders under Auction / Display / Screens / Auction List in the preview workbench, and its `locale` and `timeZone` props are settable in the Controls panel.

## g10.shared-auction-listing.US1: The listing surface's rendering contract

**Walked by:** nobody on their own - a component contract; the journeys live in `grade10-site/auction/listing-page`, which composes the blocks

**As an** application composing the shared bid panel,
**I want** custom maximum entry to respect the supplied currency ceiling,
**so that** the collector reviews a usable amount before committing.

<!-- trace:case id=g10.shared-auction-listing.TC-pz8 rev=2 covers=g10.shared-auction-listing.SC-9gi,g10.shared-auction-listing.SC-tzc,g10.shared-auction-listing.SC-as2 -->
### g10.shared-auction-listing.US1-TC55-2: A catalogue tile close follows the viewer zone

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
* **Trace:** Bid history

**Pre-conditions:**

* The same close instant is rendered on a closed `AuctionLotCard` once with `Asia/Hong_Kong` and once with `America/New_York`.

**Steps:**

1. Read each tile's close line.

**Expected Results:**

* The two clock values differ.
* The Hong Kong line names `HKT`.
* The New York line names `EDT` and does not contain `HKT`.

<!-- trace:case id=g10.shared-auction-listing.TC-n6b rev=2 covers=g10.shared-auction-listing.SC-as2,g10.shared-auction-listing.SC-9gi,g10.shared-auction-listing.SC-tzc,g10.shared-auction-listing.SC-acp -->
### g10.shared-auction-listing.US1-TC57-2: A tile's close line takes the supplied locale and zone together

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** compatibility
* **Suites:** regression
* **Layer:** unit
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** Bid history

**Pre-conditions:**

* The preview workbench renders a closed `AuctionLotCard` closing at 2027-09-01T12:00:00Z with locale zh-Hant and time zone <viewer zone>.

**Test data:**

| Viewer zone | Local time | Zone name |
| --- | --- | --- |
| Asia/Tokyo | 21:00 | GMT+9 |
| America/New_York | 08:00 | EDT |

**Steps:**

1. Read the close line on the tile.

**Expected Results:**

* The clock reads <local time>, not Hong Kong's 20:00.
* The line names <zone name>, in English though the locale is zh-Hant, and not HKT.

## Settled

## Reconciliation

**Run:** no blind pass - a carrier repoint: `AuctionCard` is removed and the tile deadline requirement moves to `AuctionLotCard`, the tile the catalogue draws. The two tile cases were revised in place; no case joins or leaves.

| Case or scenario | Disposition | Where it went / why |
| --- | --- | --- |
| US1-TC55 | Revised as US1-TC55-2, rev 2 | Its carrier is now a closed `AuctionLotCard`; the expected zone names are unchanged |
| US1-TC57 | Revised as US1-TC57-2, rev 2 | Its deciding test `auction-card.test.ts` was deleted with the component; the case turns manual on the preview workbench tile, same rows and results |
