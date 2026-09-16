## Screens

### My Auctions

Figma frame: [Auction Watchlist · 6507:5463](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6507-5463&m=dev).
The existing Storybook assembly is `Pages/My Auctions Page / Post-auction` in
`apps/preview/src/pages/my-auctions.stories.tsx` on `origin/main`. The three
tab shell is page composition around that existing one-table frame; it does
not change the `AuctionRecord` table contract.

### My Auction Orders

No dedicated Figma frame or current Storybook story is recorded for this new
surface. The implementing application supplies the page frame and adds its
Storybook coverage. The page composes the new `@grade10/ui` auction-order
blocks named below.

### Winner Order

Figma frame: [Order Details · 4835:1654](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1654&m=dev).
Current Storybook evidence is the preview-only `My Auctions/Winner Order`
stories under `apps/preview/src/pages/winner-order.*.stories.tsx` on
`origin/main`: Settlement, Payment, Delivery and Closed. The preview page is
not itself the shared component contract.

## Components

### My Auctions

- **Existing:** `AuctionRecord` remains the one-table body, with
  `AuctionRecordRow` and `AuctionRecordEmpty` composed inside it.
- **Existing:** `Tabs`, `TabsList`, `TabsTrigger` and `TabsContent` from
  `@grade10/design-system` provide the in-place Active, Upcoming and Ended
  panels. `AuctionRecordTabs` is an existing deprecated two-tab compatibility
  export and is not used for this assembly.
- **Existing:** `AuctionRecordRow` accepts `emailAlertsDisabled` and the
  application-supplied `viewOrder` row entry point.

### My Auction Orders

- **New shared blocks:** `AuctionOrderList`, `AuctionOrderRow`,
  `AuctionOrderEmpty`, `AuctionOrderDetail` and `AuctionAddressForm` in
  `packages/ui/src/blocks/auction-order/`. Their props and copy types are
  the exports named by
  [`shared/ui/auction-order`](specs/shared/ui/auction-order/spec.md).
- **Existing primitives:** `Card`, `Badge`, `Button`, `Link`, `Text`,
  `EmptyState`, `Table`, `TableRow`, `TableCell`, `Input`, `Select` and
  `Alert`, as applicable to the block's composition.

### Winner Order

- **New shared blocks:** `AuctionOrderDetail` and `AuctionAddressForm`; the
  same exports are reused by the list route where applicable.
- **Existing primitives:** `Breadcrumbs`, `Card`, `Alert`, `Stepper`, `Step`,
  `Text`, `Button`, `Link` and form primitives. The authenticated route owns
  the read model, payment state and callbacks; the blocks only render supplied
  data and report user actions.

## States

### My Auctions

| State | Source scenario |
| --- | --- |
| Active is selected on entry; rows are partitioned by bidding window | `grade10-site-auction-account-record-SC-49`, `SC-53` |
| Upcoming and Ended panels contain only their window's rows; a listing moves after reload | `grade10-site-auction-account-record-SC-50` |
| A panel with no rows shows its no-lots state, not an error | `grade10-site-auction-account-record-SC-51` |
| Ended Email alerts control is visibly disabled and reports no change | `grade10-site-auction-account-record-SC-52` |
| The title count covers all three panels; a Won row offers the order entry point | `grade10-site-auction-account-record-SC-54`, `SC-55` |

Loading and failed-read presentation are not changed by this delta; the route
keeps its existing application treatment because no change scenario defines a
new visual state for them.

### My Auction Orders

| State | Source scenario |
| --- | --- |
| Filled rows show the supplied lot, auction, bid, derived status, View lot and one next action | `grade10-site-auction-auction-orders-SC-01`, `SC-05`–`SC-09` |
| Awaiting Address and Pending Payment rows are ordered before settled rows; newest close wins within each band | `grade10-site-auction-auction-orders-SC-03`, `SC-04` |
| An expired invoice still reads Pending Payment and keeps Pay Invoice | `grade10-site-auction-auction-orders-SC-07` |
| Empty list offers My Auctions and is not an error | `grade10-site-auction-auction-orders-SC-10` |
| Failed read offers retry and is not rendered as empty | `grade10-site-auction-auction-orders-SC-11` |

The list's loading treatment remains application-owned because no loading
scenario is added here.

### Winner Order

| State | Source scenario |
| --- | --- |
| Four sections are ordered and the timeline shows each returned reached time | `winner-order-SC-53`, `SC-66`, `SC-68` |
| Preparing Invoice shows the confirmed address with no invoice or payment action | `winner-order-SC-45` |
| Empty required fields show field errors; optional fields and any phone format are accepted as specified | `winner-order-SC-46`–`SC-48` |
| Pending Payment shows the full invoice, confirmed address and Pay Now; an expired invoice remains payable | `winner-order-SC-44`, `SC-49` |
| Timed-out, abandoned or cancelled sessions say payment was not completed and keep Pay Now; the next attempt starts fresh | `winner-order-SC-49`, `SC-50` |
| A completed hosted session reads Confirming payment until the authenticated read model returns invoice `paid`; then the order reads Processing | `winner-order-SC-51`, `SC-52` |

The route's loading treatment is unchanged and has no new scenario in this
change.
