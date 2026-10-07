**Author:** @tangconst - 2026-10-06

Product context: [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md), [Invoice and Receipt PDF Blocks](../../../docs/prds/products/shared/ui/invoice-and-receipt-pdf.md), [Listing Page Blocks](../../../docs/prds/products/shared/ui/auction-listing.md#bid-history).

## Why

Collector surfaces mix UTC suffixes, hardcoded HKT, and viewer-local clocks.
A deadline that reads HKT on My Auctions and UTC on a catalogue tile is two
times for one instant. Documents that print `HKT` disagree with the GMT+8 the
platform states, the application's auction emails and invoice page print `UTC`,
a grading letter says Hong Kong time without the offset, and a vault letter says
Hong Kong Standard Time.

**Metric:** every collector deadline this change names reads the viewer's zone
and, where it shows a clock, names it (`HKT`, `EDT`, or an offset such as `GMT+9`), and every document
and sent message it names, the invoice page and the grading and vault letters
included, states `GMT+8` (target: 100% of those surfaces). Part of the store half
is built and checked in Storybook (group 2 is open: the closed block names no
zone in the code today); the application has taken none of it, so the
metric is met only when the application surfaces in Impact pass the same
checks.

## What Changes

- **BREAKING - collector clocks** - in-app dates use the viewer's local zone,
  and every collector deadline that shows a clock names it, a closed lot's close
  time included. The name is the zone's short name in US English: HKT in Hong
  Kong, EDT in New York, and the offset in English (`GMT+9` for Seoul) where US
  English has no short name; a zone at zero offset reads GMT. A deadline that
  shows only a day reads that day in the viewer's zone and names no zone, and a
  local moment or an older activity row names none. A page that books or
  confirms a visit, or a vault or signing page, keeps the shop's clock instead of
  the viewer's; how those pages name the zone is left out (decisions Q27). Until
  the browser reports the viewer's zone a deadline may read UTC named GMT, then
  it switches. A zone the platform does not recognise stops the render.
- **BREAKING - documents and messages** - invoices (the application's invoice
  page included), receipts, T&C, and every sent message state Asia/Hong_Kong as
  **GMT+8**, never HKT or UTC. A grading letter's footer reads "Dates and times
  are Hong Kong time (GMT+8)." and a vault letter's reads "Dates and times are
  in Hong Kong time (GMT+8)." A date with no clock names no zone, and a
  document's date words stay English under any copy language.
- Shared listing tiles and collector fixtures format from instants with
  `timeZone`, matching the lot bid card, whose closed block now names the zone.
- The application takes the store bump, then moves its catalogue tile, My
  Auctions and Winner Order onto the viewer's zone and the store's zone names,
  and states its invoice page, auction emails, grading letters and vault
  letters in GMT+8. Shop-clock pages (appointment booking, drop-off, vault case
  deadlines, signing) move nowhere: they keep the shop's clock, and how they
  name the zone is left out (decisions Q27).

## Non-Goals

See [Non-Goals](decisions.md#non-goals).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `shared/dates-and-times` - collector local zone, every deadline named by its
  US English short name or an English offset, a shop-clock page kept on the
  shop's clock, unrecognised zones refused; messages and documents labelled
  GMT+8, the invoice page and the grading and vault letters included; admin
  surfaces and the records a machine reads state UTC, except an admin surface
  whose own spec keeps a shop's clock, as the vault console and the
  appointments diary do (decisions Q30).
- `shared/ui/invoice-and-receipt-pdf` - PDF dates end in GMT+8, in English
  under any copy language.
- `shared/ui/auction-listing` - catalogue tile close lines and the bid card's
  closed block take `timeZone` and name the viewer's zone where they show a
  clock; a supplied display text replaces a bid row's formatted time.

## Impact

- Store: `@grade10/ui` formatters, `AuctionCard`, the lot bid card's closed
  block, PDF `formatDateTime`, Storybook fixtures and play asserts, and the
  grading letter template and the vault letter fixture in `apps/emails`.
- Application: `grade10` pins the store at `2608abf84`, behind store main, which
  lacks the viewer-zone formatters, so nothing here reaches it until
  `external/grade10-spec` is bumped. The bump changes `AuctionCard` and the
  `formatListing*` arguments and puts a zone name on `formatCollectorDeadline`,
  so its typecheck fixes land in the same pull request.
- Application surfaces that print another zone today: the auction emails
  (`UTC`), the grading and vault letter footers (no `GMT+8`), the catalogue tile
  (`GMT+8`), My Auctions (`GMT+8` and `UTC`), Winner Order and the invoice page
  (`UTC`). Consuming apps do not all pass the viewer's `timeZone` today; the
  catalogue tile, My Auctions and Winner Order must pass it, and the invoice
  page must pass the brand zone.
- A grading letter's shop-hours line is not changed here: it is a weekly
  schedule, not the date or the time of an event, and keeps its own wording, the
  shop's long zone name `Hong Kong Standard Time`, beside the footer's `GMT+8`
  line (decisions Q28).
- A surface whose own spec fixes its zone keeps it, so the loyalty programme's
  expiry days stay on the programme's zone and nothing here moves them
  (decisions Q29).
- Mail for a shop outside Hong Kong is not changed here: every message states
  Asia/Hong_Kong as GMT+8 (decisions Q24). `add-multi-store-appointments` owes
  a delta on the message requirement for such mail; it holds none yet.
- The admin surface exception is carried here for
  `read-vault-console-on-shop-clock`, which depends on it and builds the vault
  console's clock; no task here moves an admin surface (decisions Q30).
- No domain impact: the two `shared/ui` capabilities are component contracts
  that no journey walks, so no path crosses them.
- No platform impact: no capability here is walked by a journey, so no path
  crosses products.

## Open Questions

- The arrangement and month words of a document date (decisions Q14), the
  tile's own words and a Chinese month that reads as a bare number (decisions
  Q15), and how the booking, drop-off, vault and signing pages name the shop's
  zone (decisions Q27) are left out of this change. Owner: the product manager
  (@tangconst).

**Archive:** @tangconst after implementation verification.

## References

- [Dates and Times](../../../docs/prds/platform/shared/dates-and-times.md)
- [Invoice and Receipt PDF Blocks](../../../docs/prds/products/shared/ui/invoice-and-receipt-pdf.md)
- [Listing Page Blocks · Bid History](../../../docs/prds/products/shared/ui/auction-listing.md#bid-history)
- [What the Collector Hears · Messages](../../../docs/prds/products/grade10-site/grading/messages.md#messages)
- [Collector Pages · Messages](../../../docs/prds/products/grade10-site/vault/collector-pages.md#messages)
- [Documents and Signing](../../../docs/prds/products/grade10-site/vault/documents-and-signing.md)
- [Booking Blocks](../../../docs/prds/products/shared/ui/appointment-booking.md)
