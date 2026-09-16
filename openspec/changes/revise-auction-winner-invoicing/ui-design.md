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
| Expired Address | `My Auctions/Winner Order/Settlement` → Expired Address |
| Preparing Invoice | `My Auctions/Winner Order/Settlement` → Preparing Invoice |
| Pending Payment | `My Auctions/Winner Order/Payment` → Pending Payment |
| Expired invoice (Pending Payment) | `My Auctions/Winner Order/Payment` → Expired Invoice |
| Processing | `My Auctions/Winner Order/Delivery` → Processing |
| Shipped | `My Auctions/Winner Order/Delivery` → Shipped |
| Delivered | `My Auctions/Winner Order/Delivery` → Delivered |
| Cancelled | `My Auctions/Winner Order/Closed` → Cancelled |
| Refunded | `My Auctions/Winner Order/Closed` → Refunded |

Progress presentation (Address → Invoice → Payment → Shipped → Completed) is
composed on every non-Cancelled / non-Refunded story. Step subtext carries
day-only dates (Payment while due reads “Pay by …”; Address while awaiting
reads “Confirm by …”); descriptions wrap so five columns do not overflow.
Invoice and Receipt PDF controls sit on one row under the order total (PDF
icon + label), once each document exists.

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
- Progress stepper — presentation only; not a second status enum; step
  descriptions hold day-only milestone dates. `Step` description wraps
  (`text-balance`, no nowrap).
- Invoice PDF control — secondary link with PDF icon + “Invoice”; gated on
  sent invoice lines.
- Receipt PDF control — secondary link with PDF icon + “Receipt” on the same
  row; gated on payment received (Processing onward, plus Refunded).
- Fee line tooltips — design-system `Tooltip` + info icon on Buyer’s Premium,
  Shipping & Handling, and Payment Processing Fee.
- Overdue / expired alert — carries Contact Us; address overdue reads
  “Missed address deadline: {date}”; hides Confirm when address deadline
  passed; hides Pay when invoice expired.
- Design-system `Button`, `Alert`, `Breadcrumbs` as composed today.

### My Auctions

- `AuctionRecord` / `AuctionRecordRow` from `@grade10/ui` — table contract
  also owned with `redesign-my-auctions-table`. This change adds View order on
  Won and calm Won detail; whichever archives later must carry both.
- No new primitive or token.

## States

### Winner Order

| State | Spec scenarios / Storybook |
| --- | --- |
| Address / Invoice / Payment / Shipped / Completed progress with day-only dates | `winner-order-SC-54`, `winner-order-SC-55`, `winner-order-SC-66`; Settlement / Payment / Delivery stories |
| Address deadline under Confirm (48h from lot close) | `winner-order-SC-70`; Settlement → Awaiting Address |
| Expired Address: hide Confirm; Contact Us in alert | `winner-order-SC-71`; Settlement → Expired Address |
| Invoice never `expired` while address still open | `winner-order-SC-32` |
| No stepper when Cancelled / Refunded | `winner-order-SC-56` |
| Card Pay while `pending`; absolute deadline datetime from send + 7 days | `winner-order-SC-31`, `winner-order-SC-35` |
| Expired invoice: hide Pay; Contact Us in alert | `winner-order-SC-37` |
| Invoice PDF after send; hidden before send and Cancelled | `winner-order-SC-57`, `winner-order-SC-64`, `winner-order-SC-65` |
| Receipt PDF after payment | `winner-order-SC-67`, `winner-order-SC-68`; Delivery + Closed / Refunded |
| Optional Insurance omitted; Payment Processing Fee + fee tooltips | `winner-order-SC-39`, `winner-order-SC-69` |
| Refunded keeps invoice + receipt PDF when invoice existed | Storybook Closed / Refunded |

### My Auctions

| State | Spec scenarios |
| --- | --- |
| View order on every Won standing | `grade10-site-auction-account-record-SC-56` |
| No View order on Didn’t win | `grade10-site-auction-account-record-SC-57` |
| Expired Won: Pending Payment, View order, no row contact | `grade10-site-auction-account-record-SC-22` |
| Calm Won: no secondary helpers | `grade10-site-auction-account-record-SC-58` |
| Didn’t win hold being-released / released | Durable / redesign hold scenarios |

## Gaps for grade10-spec

| Missing | Kind | Notes |
| --- | --- | --- |
| Shared Winner Order export naming | Delivery planning | Confirm when the page leaves preview-only Storybook. |
