## Goals

- The site's Winner Order page body is the component its stories render.
- The four sections and `AuctionOrderDetail` go.

## Non-Goals

- **The dialogs** - setup, how to pay, payment proof, contact and refund stay
  the site's until a change per dialog gives the design's dialog a data seam
- **Chrome** - site header, breadcrumbs and footer stay each consumer's
- **Status words** - the badge and step labels stay each consumer's copy; the
  site keeps the order status vocabulary
- **The server** - the read already carries every field the page body shows

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | How does the site follow the design exactly? | It renders the design's page body from `@grade10/ui`, so a design change reaches the site on the next submodule bump | Fixing the ten differences in the site's copy, which drifts again on the next design change |
| Q2 | What does the block take? | The parts already resolved - title, badge, the current progress step with each step's label and subtext, the lot, the alerts, the summary lines, the pay controls, the payment method, receipts and addresses - with callbacks. It knows no order status | An order status, which would put twelve statuses and two vocabularies inside a presentational block |
| Q3 | Where do states the design never drew go? | Alerts under the lot, in the order the consumer supplies | A slot for any content, which lets the page rebuild the design beside it |
| Q4 | Are the dialogs part of this change? | No; one change each, after this one proves the adapter | Moving all five at once, when three of them hold their own address book, bank details or files |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `grade10-site/auction/winner-order` | Does the design's page replace the four sections or sit beside them? | Q1 |
| `shared/ui/auction-order` | Does the block decide what a status shows? | Q2 |
