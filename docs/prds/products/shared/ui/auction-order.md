---
title: Auction Order Blocks
spec: shared/ui/auction-order
order: 10
reviewed: 2026-09-30
---

Blocks make a winner's auction order, composed by every application that
shows it: the Winner Order page body and the delivery address form. What an
order means is [Winner
Order](/p/grade10-site/auction/post-bidding#winner-order); this capability is the
component contract underneath it.

## The Blocks

- **Winner order** — the Winner Order page body from parts the
  application resolves: it derives the progress from the current step and
  knows no order status; it shows the selected payment method and, for a bank
  method, the one selected rail; Storybook and the site render it; 🚧 a
  two-option control in the Order Summary heading swaps every row's amount
  for its secondary amount when the application supplies one
- 🚧 **Bank details dialog** — shows the same single rail as the invoice, with
  its payment details and reference; no tabs or copy controls
- **Address form** — the fields [Winner
  Order](/p/grade10-site/auction/post-bidding#winner-order) names, Personal or
  Company, a country-aware phone (country and digits required; E.164 when
  parseable; unusual formats accepted; country starts empty; placeholder
  shows an example with calling code), Company Name only when Company,
  address line 2 and state optional, the required ones marked, an
  application-supplied error beside each field it names, and Confirm with
  the entered values or Cancel
- **Billing address** — a Same as delivery address box,
  ticked by default; unticked, a second address with the same fields. It
  follows the form, which first ships without one
- **On its own** — the address form renders alone

## Ownership

- **Every status, amount and string** belongs to the application and arrives
  through props
- **Reports, never acts** — a press is reported through its callback; the
  writes stay the application's

:::detail{title="Code map" for="engineer"}
- **Blocks** — `AuctionWinnerOrder` and `AuctionAddressForm`, in `packages/ui`
:::

:::detail{title="Test cases" for="qa"}
::cases{id="shared/ui/auction-order"}
:::

:::detail{title="Product decisions" for="pm"}
| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| What a block knows | Decided | A block takes parts the application has resolved — title, badge, the current step with its labels, lines and controls — and knows no order status. Chosen over taking an order status, which would put twelve statuses and two vocabularies inside a presentational block. | Design |
:::
