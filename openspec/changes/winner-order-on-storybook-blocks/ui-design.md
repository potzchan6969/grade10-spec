## Screens

### Winner Order

Storybook: `My Auctions/Winner Order/*` - every story renders
`AuctionWinnerOrder` inside the preview's chrome. The site renders the same
block inside its own.

## Components

| Export | Package | Role |
| --- | --- | --- |
| `AuctionWinnerOrder` | `@grade10/ui` | Title and badge, Order Progress, the lot card, alerts, the sidebar, the first-paint reveal |
| `Alert`, `Badge`, `Card`, `Step`, `Stepper`, `Link` | `@grade10/design-system` | Inside the block only |
| `PaymentMethodCard`, `OrderDetailsPaymentLogo` | `@grade10/ui` | The sidebar's payment method |

## States

| State | Shows | Anchor |
| --- | --- | --- |
| Any status | Header, lot card, sidebar; none of the old sections | `winner-order-SC-241` |
| Suspended with a pending invoice | Suspension alert with Pay what is owed under the lot | `winner-order-SC-240` |
| Preparing Invoice, Payment Verifying | The status note: under progress on a phone, under the lot from `lg` | **Out of suite:** placement only, held by the stories `PreparingInvoice` and `PaymentVerifying` |
| Cancelled, Refunded | No progress | durable `winner-order-SC-56` |
