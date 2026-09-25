## Screens

### Winner Order — Order Summary

Layout SoT: Storybook under `My Auctions/Winner Order/` — Tax already ships
on the page assembly (between Insurance and Payment Processing Fee; tip on
hover, not auto-open):

- pre-invoice TBD: `my-auctions-winner-order-setup--awaiting-setup`,
  `my-auctions-winner-order-setup--preparing-invoice`
- post-invoice with Tax: `my-auctions-winner-order-payment--pending-payment`,
  `my-auctions-winner-order-payment--pending-payment-bank-transfer`

No new Figma frame — Order Summary already lists fee rows with an Info
tooltip trigger; Tax joins that pattern. The page omits Subtotal; invoice
and receipt keep it.

### Winner Order — Invoice and Receipt PDFs

Layout SoT: Storybook —

- with Tax: `my-auctions-winner-order-pdf-invoice--default`,
  `my-auctions-winner-order-pdf-invoice--with-tax`,
  `my-auctions-winner-order-pdf-receipt--default`,
  `my-auctions-winner-order-pdf-receipt--with-tax`

Tax is an ordinary charge `lineItems` row between Insurance and Subtotal
when supplied. Absence is omitting the row, not a zero amount. No dedicated
without-Tax PDF story; product state still applies when the operator sends
none.

### Operator quote and reissue (admin)

No Storybook page assembly for the post-sale quote or reissue form in
`apps/preview` yet. Layout remains with the admin Post-Sale surfaces under
[Auction Management · Payment](../../../docs/prds/products/grade10-admin/auction/management.md#payment).
Flag a Tax amount field beside Insurance for `tasks.md` when that form is
drawn or converted.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `Tooltip`, `TooltipContent`, `TooltipProvider`, `TooltipTrigger` | `@grade10/design-system` | Brief tip beside the Tax row label (`overlays/tooltip`) |
| `Info` | `@grade10/design-system` (icon) | Tooltip trigger on Tax, same pattern as Insurance |
| Page-local `SummaryRow` / `OrderSidebar` | `apps/preview` Winner Order assembly | Iterates invoice lines; optional `tooltip` on a line — Tax already wired |
| `InvoicePdf` / `ReceiptPdf` | `@grade10/ui` | Charge lines via `lineItems`; Tax is an ordinary charge row when present — no new export |

Nothing missing in this repository for the Order Summary tip pattern, Tax
preview fixtures, or PDF charge rows. No new `@grade10/ui` export for Order
Summary.

**Missing — copy for `tasks.md`:** preview fixtures already hold
`LINE_TOOLTIPS.tax` as stand-in English (`Set by Grade10 for where your order
ships. Some orders have none.`). When `grade10-site` wires Winner Order,
answer that tip in `@grade10/i18n` in every language of its layer.

**Missing — admin surface:** optional Tax amount on the operator quote and
reissue forms (above zero when set, refused at zero). No preview story owns
that field yet.

## States

### Winner Order — Order Summary

| State | Shows | Anchor |
| --- | --- | --- |
| Pre-invoice fees | Tax row present, value TBD (muted), Info tip with the Tax copy | `winner-order-US-01` |
| Invoice with Tax | Tax row with a money value and the same Info tip, between Insurance and Payment Processing Fee | `winner-order-US-01` |
| Invoice without Tax | No Tax row; other fee tips unchanged | `winner-order-US-01` |

### Winner Order — Invoice and Receipt PDFs

| State | Shows | Anchor |
| --- | --- | --- |
| PDF with Tax | Tax charge line between Insurance and Subtotal | `winner-order-US-01` |
| PDF without Tax | No Tax charge line | `winner-order-US-01` |

### Operator quote and reissue

| State | Shows | Anchor |
| --- | --- | --- |
| Quote with Tax | Optional Tax amount entered, above zero | `post-sale-US-05` |
| Quote without Tax | Tax field empty; send proceeds without a Tax line on the invoice | `post-sale-US-05` |
| Tax of zero refused | Entering zero is refused (same shape as Insurance) | `post-sale-US-05` |
