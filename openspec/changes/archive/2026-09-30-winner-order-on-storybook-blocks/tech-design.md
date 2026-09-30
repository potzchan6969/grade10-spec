## Overview

`AuctionWinnerOrder` is the preview's page body lifted into
`packages/ui/src/blocks/auction-order/`, with the same markup, classes and
motion. The preview page and the site page each map their own data into
it. Nothing on the server changes.

## Block

```ts
type AuctionWinnerOrderStep = "address" | "invoice" | "payment" | "shipping" | "completed";
type Action = { label: string; onPress: () => void };
/** A description keeps its line breaks and stacks under the title; role overrides the Alert's own. */
type Alert = { title: string; description?: string; status: "default" | "warning" | "success" | "error"; role?: "alert" | "status"; action?: Action };
/** A URL to follow, or a press the consumer handles. */
type Pdf = { href?: string; onOpen?: () => void; ariaLabel?: string };

type AuctionWinnerOrderProps = {
  copy: { orderProgress: string; orderSummary: string; invoice: string; invoicePdf: string; paymentMethod: string; view: string; winningBid: string; bank: string };
  title: string;
  badge: { label: string; variant: "default" | "warning" | "error" | "outline" };
  progress: {
    current: AuctionWinnerOrderStep | "done";
    steps: Record<AuctionWinnerOrderStep, { label: string; description?: string }>;
    tracking?: { code: string; href: string };
  } | null;
  /** The one alert under progress on a phone and under the lot from lg. */
  note?: { title: string; icon?: "hourglass" };
  lot: { title: string; winningBid: string; imageSrc?: string; href?: string; onOpen?: () => void; ariaLabel: string };
  alerts?: readonly Alert[];
  summary: {
    lines: readonly { label: string; value: string; muted?: boolean; tooltip?: string }[];
    total: { label: string; value: string; muted?: boolean } | null;
    invoicePdf?: Pdf;
    refund?: { title: string; onView?: () => void };
    alert?: Alert;
    /** loading spins the primary and disables both; disabled only disables. */
    pay?: Action & { loading?: boolean; disabled?: boolean; secondary?: Action; deadline?: string };
  };
  paymentMethod?: { kind: "card"; brand: OrderDetailsPaymentBrand; masked?: string } | { kind: "bank"; label: string; bankName?: string } | { kind: "text"; label: string };
  receipts?: readonly (Pdf & { label: string })[];
  delivery?: { label: string; value?: string; alert?: Alert; confirm?: Action & { deadline?: string } };
  billing?: { label: string; value: string };
};
```

- **Owns** the step states from `progress.current`, the first-paint reveal
  (`data-revealed` on its root, `data-slot="winner-order"`), the phone rail
  that centres the current step, and the note's reordering
- **Never** fetches, formats money or dates, or holds a dialog; a press is a
  callback, and a PDF or tracking link is the URL it is given
- **Splits** into two columns from `lg`, as the stories do; the site's own
  rebuild split at `xl`
- **Root** carries `data-slot="winner-order"` and `data-revealed`, which the
  stories' settle helper reads; the preview keeps `data-status` on its own
  wrapper

## Consumers

- **Preview** - `winner-order-page.tsx` keeps its chrome, status state, card
  checkout simulation, toasts and dialogs, and maps `WINNER_ORDER_CONTENTS`
  into the props; `winner-order.story-shared.ts` reads the block's root
- **Site** - `winnerOrderView(read, context)` in
  `apps/frontend/grade10/src/pages/auctions/winnerOrderView.ts` is a pure
  mapper; the page keeps its queries, mutations, refusals, checkout return,
  loading and error states and dialogs, and renders the block with no
  `className`
  - **Progress subtext** from `addressConfirmedAt`, `invoice.sentAt`, the paid
    time in `invoiceLog`, `fulfilment.dispatchedAt` and `deliveredAt`, as
    today
  - **Tracking href** - a search for the carrier and number, the one the
    page opens today
  - **Alerts** - Cancelled, suspension with Pay what is owed (which scrolls
    to `[data-slot="winner-order-sidebar"]`), a returned proof with the
    restarted deadline, the card checkout's return, a declined pay's message
  - **Dropped** - the "Amounts appear after you complete order setup" hint,
    which the design does not carry
- **Deleted** - the site's `WinnerOrderProgress`, `LotCard`, `OrderSidebar`,
  `SummaryRow` and the `AuctionOrderDetail` render; `AuctionOrderDetail`, its
  types and story in `@grade10/ui`

## Testing

| Layer | Proves |
| --- | --- |
| Block stories with play functions | Each state's parts, the step states, the reveal |
| Preview stories | Every existing Winner Order play function, unchanged but for the settle helper |
| `winnerOrderView.test.ts` | One case per order status and invoice status pair, the pay controls and alerts it yields |
| `AuctionWinnerOrderPage.test.tsx` | The page wires presses to its mutations and dialogs; the structure cases move to the mapper |
| E2E winner-order, refund, partial-payment, post-sale journeys | The journeys hold; tracking reads as the link; the evidence spec captures every state |

## Rollout

1. Store: the block, the preview on it, `AuctionOrderDetail` removed
2. Site: submodule bump, the page on the block, tests
