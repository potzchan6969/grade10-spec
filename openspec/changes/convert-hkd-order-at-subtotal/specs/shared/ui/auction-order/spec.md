# shared/ui/auction-order Specification

## Feature set

- **Order detail**
  - Subtotal and fee rows: `AuctionWinnerOrder` renders `summary.subtotal` under the lines and `summary.feeLines` under it, each between its own separators, then the total
  - Subtotal note: the Subtotal row carries the conversion note the application supplies
  - Summary unchanged without them: a summary with neither prop renders as before
