# UI: lot-page watch alerts

Behavior: [listing-page delta](specs/grade10-site/auction/listing-page/spec.md),
[account-record delta](specs/grade10-site/auction/account-record/spec.md),
[`WatchButton` delta](specs/shared/ui/auction-record/spec.md). Layout for the
lot shell is unchanged; this change is the watch control states and the toasts
that confirm watch, unwatch, and first-bid bookmark.

## Screens

### Auction lot details — header watch control

- **Figma** — ❓ No dedicated lot-header / Watch frame is recorded in
  Grade10-DS-2026 for this change; compose on the existing lot page shell.
  Review in Storybook / preview until a frame is linked.
- **Capability** — `grade10-site/auction/listing-page`
- **Review surface** — [`Auction Listing/WatchButton`](../../../packages/ui/src/blocks/auction-record/watch-button.stories.tsx),
  [`Auction Listing/LotHeader`](../../../packages/ui/src/blocks/auction-listing/listing-lot-header.stories.tsx)

### Toast — watch / unwatch / first-bid alerts

- **Figma** — [Toast `6332:3644`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6332-3644)
  (action = nested secondary `Button` `sm`, same as My Auctions Unwatch /
  email-alerts toasts)
- **Capability** — listing-page + account-record (product wording); toast
  primitive is design-system
- **Review surface** — application-mounted `<Toast />` at root; My Auctions
  stories already exercise action + Undo

## Components

| Export | Role |
| --- | --- |
| `WatchButton` | Lot / catalogue watch control. Outline `Button` + Bell / BellSlash. Supports `locked` (Watching disabled, no press) and optional watch / unwatch confirmation copy with action label (View My Auctions / Undo), announced only after the application confirms `watched`. |
| `ListingLotHeader` | Lot page title row. Composes `WatchButton`; pass `watchLocked` when a bid stands. |
| `Toast` / `toast()` | Design-system overlay. Already supports `action`; no new primitive. Application mounts one `<Toast />` at root. |
| `Button` | Nested toast action (`sm`, secondary) per Toast Figma. |

**Missing / flagged for `tasks.md`**

| Missing | Kind | Where |
| --- | --- | --- |
| i18n watch / unwatch / bid-once toast strings in production catalogues | copy | `packages/i18n` / application |
| Once-per-lot bid toast persistence (account) | product | application — not Storybook |

No new design-system primitive or token. No new Figma component set.

## States

| Surface state | Spec scenarios |
| --- | --- |
| Not watching (no bid) — Watch control active | `grade10-site-auction-listing-page-SC-10`, `shared-ui-auction-record-SC-04` |
| Watching (no bid) — control shows Watching, still toggleable | `grade10-site-auction-listing-page-SC-10` (after watch) |
| Watch confirmed — toast “email alerts on” + **View My Auctions** | `grade10-site-auction-listing-page-SC-14`, `grade10-site-auction-account-record-SC-01`, `shared-ui-auction-record-SC-15` |
| Unwatch confirmed — toast + **Undo** | `grade10-site-auction-listing-page-SC-15`, `grade10-site-auction-account-record-SC-03` |
| Bid locks Watching — disabled Watching, no unwatch | `grade10-site-auction-listing-page-SC-13`, `grade10-site-auction-account-record-SC-13`, `shared-ui-auction-record-SC-14` |
| First bid bookmarks — alerts-on toast once | `grade10-site-auction-listing-page-SC-16`, `grade10-site-auction-account-record-SC-45`, `grade10-site-auction-account-record-SC-46` |
| Later visit after bid toast recorded — no toast | `grade10-site-auction-listing-page-SC-17` |
| Closed lot (sold or unsold) — no watch control | `grade10-site-auction-listing-page-SC-18` |
| Watch change in progress | `shared-ui-auction-record-SC-05` |
| Standing / close unchanged by watch | `grade10-site-auction-listing-page-SC-12` |
