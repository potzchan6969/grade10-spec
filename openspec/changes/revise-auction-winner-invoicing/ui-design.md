# UI design

Storybook on PR #436 (`cursor/post-auction-storybook-5381`) is the layout
source of truth for Winner Order and the My Auctions post-close rows this
change extends. Figma auction frames remain historical reference only where a
Storybook story exists.

Behaviour stays in the capability specs. This file maps surfaces, exports, and
states — it does not restate requirements.

## Screens

### Winner Order

| Surface | Storybook (SoT) |
| --- | --- |
| Awaiting Address | `My Auctions/Winner Order/Settlement` → Awaiting Address |
| Preparing Invoice | `My Auctions/Winner Order/Settlement` → Preparing Invoice |
| Pending Payment | `My Auctions/Winner Order/Payment` → Pending Payment |
| Expired invoice (Pending Payment) | `My Auctions/Winner Order/Payment` → Expired Invoice |
| Processing | `My Auctions/Winner Order/Delivery` → Processing |
| Shipped | `My Auctions/Winner Order/Delivery` → Shipped |
| Delivered | `My Auctions/Winner Order/Delivery` → Delivered |
| Cancelled | `My Auctions/Winner Order/Closed` → Cancelled |
| Refunded | `My Auctions/Winner Order/Closed` → Refunded |

Progress presentation (Address → Invoice → Payment → Shipped → Completed) is
composed on every non-Cancelled / non-Refunded story. Invoice PDF control sits
with the order summary once lines exist.

### My Auctions

| Surface | Storybook (SoT) |
| --- | --- |
| Post-close Won / Didn’t win table | `My Auctions/My Auctions` → Post-auction standing |
| Page composition | `Pages/My Auctions Page` → Post-auction |

Won rows: standing badge + View order only. Didn’t win: hold being-released /
released copy retained.

## Components

### Winner Order

- Winner Order page compound under `@grade10/ui` (Storybook assemblies on #436;
  confirm export names when delivery plans the shared block — none new are
  required beyond reshaping the existing winner-order surface).
- Progress stepper — presentation only; not a second status enum.
- Invoice PDF control — outline button with document icon; gated on sent
  invoice lines.
- Overdue / expired alert — carries Contact Us; hides Pay when expired
  (`winner-order-SC-37`).
- Design-system `Button`, `Alert`, `Breadcrumbs` as composed today.

### My Auctions

- `AuctionRecord` / `AuctionRecordRow` from `@grade10/ui` — table contract
  also owned with `redesign-my-auctions-table`. This change adds View order on
  Won and calm Won detail; whichever archives later must carry both.
- No new primitive or token.

## States

### Winner Order

| State | Spec scenarios |
| --- | --- |
| Address / Invoice / Payment / Shipped / Completed progress | `winner-order-SC-54`, `winner-order-SC-55` |
| No stepper when Cancelled / Refunded | `winner-order-SC-56` |
| Card Pay while `pending`; absolute deadline datetime | `winner-order-SC-31`, `winner-order-SC-35` |
| Expired: hide Pay; Contact Us in alert | `winner-order-SC-37` |
| Invoice PDF after send; hidden before send and Cancelled | `winner-order-SC-57`, `winner-order-SC-64`, `winner-order-SC-65` |
| Refunded keeps PDF when invoice existed | Storybook Closed / Refunded; product decision on Winner Order PRD |

### My Auctions

| State | Spec scenarios |
| --- | --- |
| View order on every Won standing | `account-record-SC-49` |
| No View order on Didn’t win | `account-record-SC-50` |
| Expired Won: Pending Payment, View order, no row contact | `account-record-SC-22` |
| Calm Won: no secondary helpers | `account-record-SC-51` |
| Didn’t win hold being-released / released | Durable / redesign hold scenarios |

## Gaps for grade10-spec

| Missing | Kind | Notes |
| --- | --- | --- |
| None required for this extension | — | Progress, PDF control, Contact Us, and View order compose from existing primitives. Shared Winner Order export naming is confirmed at delivery planning. |
