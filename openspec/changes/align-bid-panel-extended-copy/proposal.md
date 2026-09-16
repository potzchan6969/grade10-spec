**Author:** @cursor - 2026-09-15

## Why

The bid panel's Time left tooltip still teaches the old rule: a bid in the
last extension *window* moves the close. Collectors who read it plan around a
snipe window that the product no longer uses. Active change
`revise-auction-extended-bidding` starts extended bidding at the scheduled
close and drops the window; that change deferred bid-panel explanation copy.
Until this contract moves, shared i18n and Storybook either lie or diverge from
durable `shared/ui/auction-listing`.

**Metric:** share of live-lot sessions where the Time left explanation matches
the listing's post-close duration rule (no window named).

**Acceptance signal:** on the bid panel, the Time left info tooltip and any
extended-bidding rules string name only the extension duration (and cap in
prose); when `extended` is on, the label is **Time left (extended)**.

## What Changes

- **Extension explanation copy** — consumer-supplied Time left explanation and
  extended-bidding rules name the listing's **extension duration** (and optional
  cap). They SHALL NOT name an extension window
- **Label when extended** — demo and catalog copy for the live timer while
  extended bidding is on reads **Time left (extended)**
- **Shared catalogs and Storybook** — `auctionListing.autoExtendedTooltip` /
  `extendedBiddingRules`, English helpers, and bid-panel stories follow that
  wording

## Non-Goals

- **Changing when extended bidding starts** — owned by
  `revise-auction-extended-bidding` (auction / auto-bidding / admin listing)
- **New bid-panel exports or layout** — still consumer-owned copy slots; no new
  component, variant, or Figma set
- **Collector "Extended" status badge** — lot status stays Active; operator
  queue label stays on that change
- **Notification or email body** — separate from this UI contract
- **Removing `windowSeconds` from demo policy helpers' extend-on-window
  simulation** — out of scope; copy only

## Capabilities

### New Capabilities

- none

### Modified Capabilities

- `shared/ui/auction-listing` — Extension explanation copy names duration (and
  cap), not window; Time left label when extended is **Time left (extended)**

## Impact

- `openspec/specs/shared/ui/auction-listing/spec.md` — MODIFY Extension
  explanation requirement / SC-14
- Manual page `docs/prds/products/shared/ui/auction-listing.md` — 🚧 Time left
  tooltip
- `@grade10/i18n` shared `auctionListing` catalogs (en, ko, zh-Hans, zh-Hant)
- `@grade10/ui` English helpers and `ListingAuctionBidCard` stories
- `apps/preview` bid-panel fixtures, countdown flow titles, enrollment docs
- Coordinates with `revise-auction-extended-bidding`: that change owns the
  close rule; this one owns the bid-panel explanation contract it deferred

## Follow-on changes

- Align live lot demo helpers so a bid extends only after the scheduled close
- Fold notification "extended bidding has started" to fire at scheduled close

## References

- [Listing Page Blocks · Extended Bidding Copy](../../../docs/prds/products/shared/ui/auction-listing.md#extended-bidding-copy)
- Active close-rule change: `revise-auction-extended-bidding`
