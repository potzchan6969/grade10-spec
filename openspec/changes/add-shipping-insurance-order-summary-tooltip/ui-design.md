## Screens

### Winner Order — Order Summary

Layout SoT: Storybook under `My Auctions/Winner Order/` —

- pre-invoice TBD fees: `my-auctions-winner-order-setup--awaiting-setup`,
  `my-auctions-winner-order-setup--preparing-invoice`
- post-invoice with Insurance: `my-auctions-winner-order-payment--pending-payment`,
  `my-auctions-winner-order-payment--pending-payment-bank-transfer`

No new Figma frame — Order Summary already lists fee rows with an Info
tooltip trigger; Insurance joins that pattern.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` | `@grade10/design-system` | Brief fee tip beside the row label (`overlays/tooltip`) |
| `Info` | `@grade10/design-system` (icon) | Tooltip trigger on Insurance, matching Buyer’s Premium / Shipping & Handling / Payment Processing Fee |
| Page-local `SummaryRow` / `OrderSidebar` | `apps/preview` Winner Order assembly | Iterates invoice lines; optional `tooltip` on a line |

Nothing missing in this repository for the tip pattern. No new `@grade10/ui`
export — shared store-order sidebar is not this surface; Winner Order owns its
summary composition.

**Copy work for `tasks.md`:** preview fixtures hold
`LINE_TOOLTIPS.shippingInsurance` as stand-in English. When `grade10-site`
wires Winner Order, answer the Insurance tip in `@grade10/i18n` in every
language of its layer — no existing auction/order key covers it today.

## States

### Winner Order — Order Summary

| State | Shows | Anchor |
| --- | --- | --- |
| Pre-invoice fees | Insurance row present, value TBD (muted), Info tip with `0.9% of the order value during transit.` | `winner-order-SC-171` |
| Invoice with Insurance | Insurance row with a money value and the same Info tip | `winner-order-SC-169` |
| Invoice without Insurance | No Insurance row; other fee tips unchanged | `winner-order-SC-170` |
