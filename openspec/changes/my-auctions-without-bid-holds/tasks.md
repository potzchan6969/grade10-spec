# Tasks: Read an open listing as Leading or Outbid, say a loser was not charged, and drop the bid hold

## 1. The manual (grade10-spec) (owner: @ecchochan)

- [x] 1.1 On `docs/prds/products/grade10-site/auction/bidding.md`'s My Auctions, list Leading and Outbid as the open-lot Status and say a Didn't win row reads that the card was not charged, unmarked since the build shows it, and drop the hold from its Didn't win value, letters, users and decisions; drop the bid-time hold from `docs/prds/products/grade10-admin/auction/management.md`'s Payment source and from `docs/prds/platform/auction-service.md`
- [ ] 1.2 With the fold, drop from the durable account-record suite what the fold cannot: the Settled line and the Reconciliation row that keep the hold copy, the hold and Bid submitted wording of the earlier Reconciliation rows on a lone first bid, a pending bid and the open-window statuses, and `SC-3pi`, `SC-91l`, `SC-uvr` and `SC-dtm` from the covers of case markers `TC-hc2`, `TC-qo0` and `TC-5uz`
- [x] 1.3 Verify: `pnpm check:manual`, `pnpm run tcs:validate` and `pnpm run validate:changes my-auctions-without-bid-holds` in grade10-spec.

## 2. The build (grade10) (owner: @ecchochan)

grade10#773 and grade10#785 already build this contract; this group changes only test titles.

- [ ] 2.1 Confirm on grade10 `main` the tests that hold each scenario: `apps/backend/grade10/auction/test/db/accountRecord.spec.ts` and `apps/frontend/grade10/e2e/tests/auction/account-record.spec.ts` for a refused raise leaving Leading or Outbid (`grade10-site-auction-account-record-SC-69`) and a refused first bid adding no row (`grade10-site-auction-account-record-SC-70`); `apps/frontend/grade10/src/pages/auctions/AccountAuctionRecordPage.test.tsx` and `apps/frontend/grade10/e2e/tests/auction/live-room.spec.ts` for a lot lost at the close (`grade10-site-auction-account-record-SC-68`); `apps/backend/grade10/auction/test/db/admin/admin.spec.ts` for a called-off lot reading Didn't win, which the same row mapping words (`grade10-site-auction-account-record-SC-27`)
- [ ] 2.2 Retag the tests to what they walk: `accountRecord.spec.ts`'s refused raise to `grade10-site-auction-account-record-SC-69`; `account-record.spec.ts`'s refused leader raise to `-US2-TC4-1` and `-SC-69`, its refused Outbid raise to `-US2-TC4-1`, and its refused first bid to `-US2-TC5-1` and `-SC-70`
- [ ] 2.3 Verify: grade10 `main` CI green at the recorded commit.
