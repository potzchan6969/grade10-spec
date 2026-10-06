# Technical Design

Collector formatters already take `locale` and `timeZone`. This change
threads `timeZone` onto `AuctionCard` and the listing Ends/Opens/Closed
helpers, and pins document clocks to `GMT+8`.

## Viewer zone

The consuming app already resolves a shipped locale. It SHALL pass the
viewer's IANA zone (typically `Intl.DateTimeFormat().resolvedOptions().timeZone`)
as `timeZone` on collector surfaces. Shared blocks do not read the machine
clock for the zone name.

`formatListingEnds`, `formatListingOpens`, and `formatListingClosed` take the
same `{ locale, timeZone }` object as `formatCollectorDeadline` and emit a
local moment plus the viewer's short zone name (`HKT`, `EDT`). Hong Kong
is named `HKT` even though Intl's short form is `GMT+8`.

## Documents

`InvoicePdf` / `ReceiptPdf` `formatDateTime` keeps `Asia/Hong_Kong` and
appends the literal `GMT+8`. Emails already do this; no template change.

## Tests

- Formatter unit tests for HK vs New York local moments, and PDF `GMT+8`.
- Bid-card Storybook story with `America/New_York`, asserting `EDT` not `HKT`.
- Winner Order / My Auctions Hong Kong fixtures keep `HKT`.
