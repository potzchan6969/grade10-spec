# Tasks

## 1. Auction policy and copy (grade10-spec)

- [x] 1.1 Add ceiling refusal copy to every supported `auctionListing` locale and add the `ceiling` bidding-history failure label for SC-09, SC-10, and SC-11.
- [x] 1.2 Update the Bid Increments product page to describe the delivered currency ceilings and the refusal behavior for SC-08, SC-09, SC-10, and SC-11.
- Verification: run the store catalog and manual-page checks for the changed locale keys and product page.

## 2. Auction persistence (grade10)

- [x] 2.1 Update the bid-action failure-code database constraint and embedded migration list to admit `ceiling` refusal events for SC-09, SC-10, and SC-11.
- Verification: run the migration consistency check and the auction schema test.

## 3. Shared auction contracts (grade10)

- [x] 3.1 Add the fixed USD, HKD, and JPY minor-unit ceiling lookup beside bid increments and export it for backend and storefront consumers, covering SC-08 through SC-11.
- [x] 3.2 Extend the bid outcome contract with `AMOUNT_TOO_HIGH`, `ceilingMinor`, and the `ceiling` history failure code while preserving existing outcome compatibility for SC-08 through SC-11.
- Verification: run the auction-contracts type check and contract-focused tests.

## 4. Auction bid service (grade10)

- [x] 4.1 Enforce the requested maximum and the derived next minimum against the listing currency ceiling inside the locked `placeBid` transaction; accept equality, leave state unchanged on refusal, and record the `ceiling` refusal event for SC-08 through SC-11.
- [x] 4.2 Add backend coverage for manual bids, automatic maxima, equality at each ceiling, and an exhausted listing whose next increment would exceed its ceiling for SC-08 through SC-11.
- Verification: run the targeted auction backend bidding test lane and inspect the failure output for the refusal side effects.

## 5. Storefront bid panel (grade10)

- [x] 5.1 Filter quick-bid suggestions at the shared currency ceiling and expose no further bid action when the next minimum exceeds it for SC-08 and SC-11.
- [x] 5.2 Map `AMOUNT_TOO_HIGH` to localized, currency-formatted ceiling copy in the listing and payment authorization flows, covering SC-09 and SC-10.
- [x] 5.3 Update the fixture client and frontend tests for accepted equality, rejected above-ceiling amounts, and capped suggestions for SC-08 through SC-11.
- Verification: run the targeted auction frontend tests and the repository type check.
