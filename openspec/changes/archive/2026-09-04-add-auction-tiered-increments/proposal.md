# Tiered bid increments

**Author:** @jeffffej0909 - 2026-09-02

Product context: [Grade10 Auction](../../../docs/prds/products/grade10-site/auction/auction.md).

## Why

A single increment is too small once a lot becomes valuable and too large when
it opens. Operators currently have to predict the closing price while creating
the listing. That decision either slows a competitive lot or raises its entry
bar.

**Metric:** bids per lot that closes above ten times its starting price, and
the share of those lots that stall for more than an hour below the eventual
close. **Acceptance signal:** a lot opened at HKD 200 and closed at HKD 20,000
reaches the close in tens of bids, not hundreds.

## What Changes

- Grade10 owns one developer-managed increment schedule for each supported
  auction currency: USD, HKD, and JPY. There is no per-listing override or
  operator policy editor.
- The next bid uses the increment for the amount being beaten: the current
  public price for a manual bid, the starting price before the first bid, and
  the second-highest maximum during proxy resolution. A range includes its
  lower bound and excludes its next range's lower bound.
- Manual and proxy bids may be any whole amount at or above the resulting
  minimum. Proxy resolution still records one result, never intermediate bids.
- The admin currency control and the backend allow only USD, HKD, and JPY.
  An unsupported currency cannot be created, updated, or scheduled.
- The listing-level minimum increment is removed from storage, contracts,
  editor, fixtures, and bid calculations. Existing test bids and holds remain
  unchanged; subsequent calculations use the schedule.
- Bid shortcuts repeatedly apply the schedule. Collectors continue to see the
  next valid minimum, not the full policy table.

## Non-Goals

- Operator editing of schedules or future schedule-version policy. That is a
  separate capability.
- Currency support beyond USD, HKD, and JPY.
- Rewriting historical bids, holds, or audit records.
- A grid that requires bids to be exact multiples of an increment.
- A collector-facing ladder display.

## Capabilities

### New Capabilities

- `grade10-site/auction/bid-increments`: Grade10's three currency schedules,
  lookup rule, next minimum, and supported-currency policy.

### Modified Capabilities

- `grade10-site/auction/auto-bidding`: proxy resolution reads the applicable
  tier instead of a listing field.
- `grade10-admin/auction/listing`: listing creation and update remove the
  minimum-increment input and enforce the currency allowlist.

## Impact

| Consumer | Change |
| --- | --- |
| `apps/backend/grade10/auction` | Removes `min_increment`, migrates test listings, applies the schedules in manual and proxy bidding, and rejects unsupported currencies. |
| `@grade10/auction-contracts` | Removes the listing increment from write and read shapes where it is exposed. |
| `apps/admin/grade10` | Replaces free currency entry with USD/HKD/JPY selection and removes the minimum-increment control. |
| `apps/frontend/grade10` | Generates valid quick-bid suggestions by repeatedly applying the schedule. |
| Auction PRDs and manual | Replace the flat-increment policy with the shipped tier policy. |
