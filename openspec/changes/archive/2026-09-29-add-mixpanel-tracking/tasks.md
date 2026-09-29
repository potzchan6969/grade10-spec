## 1. Manual and architecture (grade10-spec)

- [x] 1.1 Keep the Mixpanel Events and Analytics pages' 🚧 lines and engineer
      code-map links accurate against the landed modules (catalog, `/api/track`,
      tracking architecture doc) (owner: @rita-liu)
- [x] 1.2 Point Product Analytics at the same architecture path once device
      rotation, server `$device_id`, geo IP, and user profiles land
      (owner: @rita-liu)
- [x] 1.3 Verify: `pnpm check:manual` (owner: @rita-liu)
      — Mixpanel proposal `#user-profile` link resolves; remaining
      `check:manual` failures are other in-flight changes on the store

## 2. Mixpanel library (grade10)

Shared foundation. Store, auction, vault, and loyalty groups depend on this
landing; they do not depend on each other.

- [x] 2.1 Stamp collector `ip` on Mixpanel `/import` and never as an event
      property (`grade10-site-analytics-SC-38`, `SC-39`)
- [x] 2.2 Add engage user-profile writes with `$ip` or `0`
      (`grade10-site-analytics-SC-25`, `SC-26`, `SC-27`, `SC-37`, `SC-40`)
- [x] 2.3 Rotate the browser device id on demand so session end can start a
      new device (`grade10-site-analytics-SC-34`, `SC-41`)
- [x] 2.4 Map session roles to Audience `collector` \| `staff` for identified
      events (`grade10-site-analytics-SC-01`, `SC-04`)
- [x] 2.5 Verify: package tests for import IP, engage, device reset, and
      Audience; `pnpm run typecheck` in `packages/mixpanel`

## 3. Store catalog, ingest, and commerce emits (grade10)

Needs group 2. Frontend group 4 consumes the client catalog export from this
group.

- [x] 3.1 Expand the store client/server catalog to the Grade10 names and
      properties; move Checkout Started to the server catalog; keep oracle
      samples total for grade10 and zzz (`grade10-site-analytics-SC-10`,
      `SC-11`, `SC-12`, `SC-13`, `SC-35`, `SC-44`, `SC-45`)
- [x] 3.2 Reject server names and forged user ids on `/api/track`; stamp
      session identity, Audience, and collector IP
      (`grade10-site-analytics-SC-01`, `SC-02`, `SC-03`, `SC-04`, `SC-38`)
- [x] 3.3 Persist the browser device id at accepted checkout; emit Checkout
      Started and keep `$device_id` on web Order Paid and other continuing
      server emits (`grade10-site-analytics-SC-14`, `SC-16`, `SC-36`,
      `SC-42`, `SC-43`)
- [x] 3.4 Enrich Order Paid with Member, Tier, Points Earned, Points Spent;
      keep ownerless on the order device and never resend or merge on claim
      (`grade10-site-analytics-SC-05`, `SC-06`, `SC-15`, `SC-33`)
- [x] 3.5 Emit Account Created once when the store first knows a user id;
      never from the identity worker (`grade10-site-analytics-SC-07`,
      `SC-08`, `SC-09`)
- [x] 3.6 Write user-profile snapshot fields the store owns (Audience,
      Member, Tier, Created) on change
      (`grade10-site-analytics-SC-25`, `SC-27`, `SC-37`)
- [x] 3.7 Verify: `installMixpanelCapture` worker tests for the scenarios
      above; `pnpm run typecheck` and store worker tracking specs
      (owner: @rita-liu)

## 4. Storefront tracking client (grade10) (owner: @rita-liu)

Needs group 3's client catalog export. Claimable beside groups 5–7.

- [x] 4.1 Bind `createTrackingClient` in the Grade10 SPA and fire Page
      Viewed (including in-page navigation, UTM, Initial Referrer), Product
      Viewed with Source, Product Added, Cart Opened, and Lot Viewed
      (`grade10-site-analytics-SC-12`, `SC-13`, `SC-17`, `SC-21`, `SC-35`,
      `SC-44`, `SC-45`)
- [x] 4.2 Reset the device on sign-out and session expiry
      (`grade10-site-analytics-SC-34`, `SC-41`)
- [x] 4.3 Verify: SPA / DI tests with injected fetch; no emit from
      `@grade10/ui`; `pnpm run typecheck`

## 5. Auction Mixpanel emits (grade10) (owner: @rita-liu)

Needs group 2. Own catalog slice + Grade10 project token. Claimable beside
groups 3, 6, and 7 once the library lands; Lot Viewed is covered by group 4.

- [x] 5.1 Emit Card Linked, Bid Placed (accepted maximum only), Lot Watched
      (explicit watch only), Bidder Outbid, Auction Won, and Invoice Paid
      (never hold capture) with domain time and insert id
      (`grade10-site-analytics-SC-18`, `SC-19`, `SC-20`, `SC-21`, `SC-31`,
      `SC-32`)
- [x] 5.2 Carry `$device_id` and collector IP when the emit continues a
      browser visit (`grade10-site-analytics-SC-39`, `SC-43`)
- [x] 5.3 Verify: auction worker capture tests; empty token no-op;
      `pnpm run typecheck`

## 6. Vault Mixpanel emits (grade10) (owner: @rita-liu)

Needs group 2. Claimable beside groups 5 and 7.

- [x] 6.1 Emit Vault Case Submitted, Visit Booked, Offer Made / Accepted /
      Declined, Payout Recorded, and Identity Bound as funnel joins, not the
      finance ledger (`grade10-site-analytics-SC-24`)
- [x] 6.2 Carry user or device identity and collector IP when known
      (`grade10-site-analytics-SC-01`, `SC-02`, `SC-39`)
- [x] 6.3 Verify: vault worker capture tests; empty token no-op;
      `pnpm run typecheck`

## 7. Loyalty Mixpanel emits (grade10) (owner: @rita-liu)

Needs group 2. Claimable beside groups 5 and 6. Order Paid enrichment stays
in group 3.

- [x] 7.1 Emit Reward Redeemed, Pass Added, and Member Identified (success
      only) beside those writes (`grade10-site-analytics-SC-22`, `SC-23`)
- [x] 7.2 Update Wallet Pass and related profile fields on engage when the
      pass or membership fact changes (`grade10-site-analytics-SC-25`)
- [x] 7.3 Verify: capture tests at the emit sites; empty token no-op;
      `pnpm run typecheck`

## 8. Refusals and project checklist (grade10)

After emitting groups are in review. Can land last.

- [x] 8.1 Confirm admin consoles and the identity worker send nothing;
      events and profiles carry no email, name, phone, or stored IP
      (`grade10-site-analytics-SC-28`, `SC-29`, `SC-09`) (owner: @rita-liu)
- [x] 8.2 Confirm ZZZ is not required to emit storefront events; shared
      library and oracle maps stay the groundwork only
      (`grade10-site-analytics-SC-30`)
      — ZZZ store keeps oracle/catalog groundwork; Grade10 emits are not
        required of ZZZ (owner: @rita-liu)
- [x] 8.3 Document Simplified ID Merge and per-environment Grade10 tokens
      on the tracking architecture page; staging checklist before the first
      real event
- [x] 8.4 Verify: refusal tests + architecture doc review; empty local
      token still no-ops (owner: @rita-liu)

## Archive disposition

Change is archive-ready once Grade10 `feat/add-mixpanel-tracking` merges and
deploys with staging Simplified ID Merge + tokens set. Leftover: remove 🚧
marks on Analytics / Mixpanel Events / Product Analytics at archive fold;
open Legal questions (consent gate, Mixpanel erasure) stay ❓ and are out of
this change.
