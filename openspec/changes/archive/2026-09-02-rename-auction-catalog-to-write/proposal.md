**Author:** @mason5991 - 2026-09-02

## Why

The auction grant that authors campaigns, categories, and listing catalogue
copy is named `auction:catalog`, while the store's matching grant is
`store:write`. Operators and engineers have to learn two names for the same
kind of permission, and the auction vocabulary's own comment still says the
split is "not by read/write" even though `read` already exists beside it.

**Metric:** auction write-shaped grants that share the `*:write` stem with
store — from zero of one (`auction:catalog`) to one of one (`auction:write`).
**Acceptance signal:** staff's fixed grant list names `auction:write`, every
elevated catalogue procedure checks that name, and `auction:catalog` is
absent from the live vocabulary.

## What Changes

- **Rename the grant.** `auction:catalog` becomes `auction:write` in the
  shared roles vocabulary and in every procedure and admin gate that checked
  it.
- **Keep the same holders.** `staff` (and therefore `admin`) still hold the
  grant; no other role gains or loses it.
- **Update the operator PRD callout** on listing management so the grants an
  operator is told about match the vocabulary.
- **BREAKING** for any client or fixture that still sends or asserts
  `auction:catalog` — the string is no longer a declared permission.

## Non-Goals

- **Changing what the grant covers.** Campaign open/create/update/publish,
  category taxonomy edits, and listing media / catalogue-field procedures
  stay behind this grant; floor work stays on `auction:operate` and money
  stays on `auction:settle`.
- **Renaming `loyalty:catalog`.** Loyalty's catalogue grant is a different
  product concern and stays.
- **Rewriting archived OpenSpec changes.** Past archives keep the grant name
  they shipped under.
- **UI redesign.** Admin surfaces keep the same controls; only the permission
  string and the `mayWrite` prop name move.

## Capabilities

### Modified Capabilities

- `shared/auth/roles`: staff's fixed grant list names `auction:write` instead
  of `auction:catalog`.

## Impact

- **`@grade10/auth-contracts`** — `PERMISSION_STATEMENTS.auction` and
  `ROLE_PERMISSIONS.staff` / `admin`.
- **Auction admin tRPC** — `campaigns`, `categories`, and listing media /
  catalogue procedures' `elevatedProcedure` grants.
- **Admin SPA** — `mayCatalog` → `mayWrite` on the campaigns panel; section
  grant checks.
- **Docs / PRD** — `docs/architecture/auction.md` and
  `docs/prds/products/grade10-admin/auction/listing.md`.

## Archived

Archived 2026-09-02 at the owner's direction as a retrospective of the
`auction:catalog` → `auction:write` rename. Grade10 implementation is on
PR https://github.com/9gag/grade10/pull/201 and was not yet deployed.
