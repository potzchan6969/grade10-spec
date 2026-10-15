## Context

The proposal holds the motive. This file holds how the work lands.

- **One block, one store** — `AuctionWinnerOrder` in `packages/ui` renders the
  summary from props. `grade10` composes it on the Winner Order page;
  `apps/preview` holds the fixtures and stories.
- **Subtext already exists** — `summary.lines[].subtext` renders a muted line
  under a row's value, and `grade10` supplies each HKD line's USD amount
  through it today. `summary.total.subtext` is the same optional shape.
- **A link text reads lighter** — two `Link`-as-button `size="sm"` controls
  separated by a `|`, `aria-pressed` on the picked one, sit in the heading row
  quieter than a framed segmented control.
- **Presentation state is the block's** — the contract lets a block hold
  React state for presentation and forbids it browser storage, so the picked
  view lives and dies with the mount.

## Goals / Non-Goals

**Goals:**

- The HKD summary reads like the invoice — one amount per line, one total —
  with the lot's USD figures a switch away.
- A `subtext` keeps rendering under its value wherever no toggle is supplied,
  so nothing else that uses it changes.

**Non-Goals:**

- A currency-switching primitive beyond the two `Link` controls; the swap is
  row rendering in the block.
- Remembering the picked view, or a per-line control.

## Decisions

The specs govern the rules. These rows record how they are built.

### Where the control lives

- **Spec governs** — `shared/ui/auction-order`, "The winner order takes the
  settlement choice, payment choices, two totals and one rail's bank
  details".
- **One prop** — `summary.currencyToggle` carries `primary` and `secondary`
  labels and an optional `ariaLabel`. `OrderSummary` keeps the picked view,
  renders a two-option link text (`primary | secondary`) beside the heading
  only when the prop is supplied and a line or the total carries a `subtext`,
  and renders each row's `subtext` as its value on the secondary view.
- **Subtext is the swap data** — a row's `subtext` is its amount in the
  secondary currency. With the toggle supplied, a `subtext` never renders as
  a second line; without it, `subtext` renders under the value as before.
- **Rejected: a show/hide disclosure** — the collapsed recap kept two
  currencies' worth of amounts one tap from a read that mixes both; the swap
  keeps one currency on screen.
- **Rejected: new per-line fields** — `subtext` already carries the second
  amount; a parallel `altValue` duplicates it.

### What the app supplies

- **Spec governs** — `grade10-site/auction/winner-order`, "The Order Summary
  reads the settlement currency, with USD beneath each HKD line".
- **`grade10` supplies the toggle for an HKD order** — `primary`/`secondary`
  from `setup.currency` (`HKD`, `USD`) in `auctionOrders`, each line's USD
  amount through `subtext` as today, and the USD total through
  `summary.total.subtext`. A USD order, a pre-invoice summary and every other
  consumer supply no toggle and render as before.
- **No new catalog keys** — the labels reuse `setup.currency.usd` /
  `setup.currency.hkd`, already in every language the catalogs hold.
