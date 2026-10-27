## 1. Reconcile the built service with the decisions (grade10)

- [x] 1.1 Record where a consignment is taken, the counter or a named event,
      and require the channel at intake; drop the online origin
      (`grade10-site-consignment-lifecycle-SC-01`,
      `grade10-site-consignment-lifecycle-SC-02`)
- [x] 1.2 Register only graded items, each with its market value
      (`grade10-site-consignment-lifecycle-SC-03`)
- [x] 1.3 Take a company under its registered office
      (`grade10-site-consignment-lifecycle-SC-04`,
      `grade10-site-consignment-lifecycle-SC-05`)
- [x] 1.4 Log each received store item in Shopify as a draft when the
      agreement seals, and publish that product on listing, in the
      consignment worker and the store
      (`grade10-site-consignment-lifecycle-SC-06`,
      `grade10-site-consignment-lifecycle-SC-07`)
- [x] 1.5 Carry a shipped return's courier and tracking
      (`grade10-site-consignment-lifecycle-SC-09`,
      `grade10-site-consignment-lifecycle-SC-10`)
- [x] 1.6 Print where it was taken, the consignor in law, the linked account,
      each item's market value and incentive on the agreement, and refuse an
      agreement while the incentive is unset
      (`grade10-site-consignment-documents-SC-01`,
      `grade10-site-consignment-documents-SC-02`)
- [x] 1.7 Owe the incentive from the seal, list it on the due list and record
      it once under the payout grant, never netted against a payout
      (`grade10-site-consignment-payout-SC-01`,
      `grade10-site-consignment-payout-SC-02`,
      `grade10-site-consignment-payout-SC-03`,
      `grade10-site-consignment-payout-SC-04`)
- [x] 1.8 Give the consignor's read each item's rate, estimated net and days
      left, and the incentive
      (`grade10-site-consignment-consignor-portal-SC-01`,
      `grade10-site-consignment-consignor-portal-SC-02`)
- [x] 1.9 The counter asks where, who in law and the market value; Payouts
      lists and records the incentive; the incentive is a setting
      (`grade10-admin-consignment-console-SC-01`,
      `grade10-admin-consignment-console-SC-02`,
      `grade10-admin-consignment-console-SC-03`)
- [x] 1.10 Verify: `pnpm run db:drizzle:generate`, `pnpm run check:migrations`,
      `pnpm --dir packages/api-docs run generate`, the typecheck, `biome check`,
      and the consignment, documents and store suites

## 2. The sale's paper (grade10)

- [ ] 2.1 Issue the settlement statement and the commission invoice at the
      sale, with the contact details for payment — blocked: the commission
      invoice composes `add-invoice-and-receipt-pdf-blocks`, still in flight,
      and both documents' wording is Finance's

## 3. The walk (grade10)

- [ ] 3.1 Walk the incentive from the seal to its record in
      `apps/frontend/grade10/e2e/tests/consignment/lifecycle.spec.ts`, beside
      the walks that already consign on each channel — written, not run:
      blocked: the isolated stack needs Docker, which this environment lacks - waived 2026-10-26 by @htonyl: CI checks are no longer needed; left unchecked and waived at archive by tasks_waived
