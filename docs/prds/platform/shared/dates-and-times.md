---
title: Dates and Times
spec: shared/dates-and-times
order: 2
---

Every date the platform holds is an instant — a single point in time with no
zone of its own. What a person reads depends on the surface.

## Collector Surfaces

- 🚧 **Viewer local** — a clock on a collector page uses the viewer's own
  zone, supplied as the page's `timeZone`, and so does the day of a deadline
  that shows only a day, except on a shop-clock page, or where the surface's own
  spec fixes its zone, which it keeps
- 🚧 **Every deadline named** - a deadline on a collector page that shows a
  clock names the viewer's zone, a closed lot's close time too, never a pinned
  HKT for every reader, except on a shop-clock page; a deadline that shows only
  a day reads that day in the viewer's zone and names no zone
- 🚧 **Zone names** - HKT in Hong Kong, otherwise the zone's short name in US
  English (EDT, EST and PDT in North America), and the offset in English (GMT+9,
  GMT+5:30) where US English has none, whatever language the page reads in; a
  zone at zero offset reads GMT
- **Relative remaining** — Ends in and Opens in carry no zone
- **Activity** — recent rows are a short relative label; older rows are a
  local moment with no zone suffix
- 🚧 **First paint** - until the browser reports its zone, a deadline may read
  UTC named GMT, then it switches to the viewer's zone
- **Shop's clock** - a page that books or confirms a visit, or a vault or
  signing page, keeps the shop's clock whatever zone the viewer is in; no rule
  here sets how it names that zone, and a collector's vault timeline stamps
  stay UTC
  ([Booking Blocks](/p/shared/ui/appointment-booking),
  [Collector Pages](/p/grade10-site/vault/collector-pages))

## Documents and Messages

- 🚧 **GMT+8** - invoices, the application's invoice page included, receipts,
  terms, and every message the platform sends state Asia/Hong_Kong and name
  GMT+8, the same for every viewer and recipient; a document's date words stay
  English whatever language it is written in
- 🚧 **Grading letters** - the footer reads "Dates and times are Hong Kong time
  (GMT+8)." ([What the Collector Hears](/p/grade10-site/grading/messages))
- 🚧 **Vault letters** - the footer reads "Dates and times are in Hong Kong time
  (GMT+8)." ([Collector Pages](/p/grade10-site/vault/collector-pages#messages))
- **A day with no clock** - a calendar day in a message names no zone; the day
  is the brand's

## Other Surfaces

Operator tables, admin surfaces and the records a machine reads - an export,
the audit trail - state Coordinated Universal Time, except an admin surface
whose own spec keeps a shop's clock.

- 🚧 **Auction order operators** - the Orders worklist, the order page with its
  timeline and invoice log, and the send and reissue dialog's payment deadline
  state Hong Kong time labelled GMT+8, not UTC; other operator tables stay UTC.
  The order timeline and invoice log are not the audit trail, which stays UTC

A calendar day the business judges - a
contract date, a due date, a "today" queue, an age, a document's expiry, a
report's month - stays on the brand's zone for every reader. The day a
collector page shows for a deadline is not judged this way: it reads in the
viewer's zone, unless the surface's own spec fixes its zone, as the loyalty
programme's expiry days do
([Profile](/p/grade10-site/loyalty/profile)). Ordering and punctuation are
the platform's, not the browser's. A date that is not a valid instant, or a
zone the platform does not recognise, stops the render.

A calendar day an operator types into a filter becomes the instants that day
opens and closes on the surface's own clock.

::changes{spec="shared/dates-and-times"}

:::detail{title="Product decisions" for="pm"}
A collector in Seoul and one in Hong Kong were reading different suffixes for
the same instant - UTC on a tile, HKT on My Auctions - and a document, a mail
and a grading letter each named Hong Kong time a different way.

**Not in scope.** Operator UTC tables, except the auction order surfaces. Brand-day judgements (shop midnight).
Relative countdowns. Moving a shop-clock page onto the viewer's zone. Naming
the shop's zone on those pages. A document date's arrangement and month words.
Naming a shop's own zone in a message for a shop outside Hong Kong: every
message states GMT+8.

**Decisions.**

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Collector clock | Decided | Viewer's local zone | Product |
| Named zone on collector UI | Decided | Viewer's short name at that instant (HKT, EDT), on every deadline that shows a clock, a closed lot's too; a deadline with only a day reads that day in the viewer's zone and names none, and a local moment or an older activity row names none | Product |
| Shop-clock pages | Decided | The shop's clock, not the viewer's, on a page that books or confirms a visit and on the vault and signing pages; how they name the zone is left out | Product |
| A zone with no US English short name | Decided | Its offset in English (GMT+9, GMT+5:30, GMT-2:30), whatever the language; a zone at zero offset reads GMT | Product |
| PDFs, T&C, emails | Decided | Asia/Hong_Kong labelled GMT+8 | Product |
| The application's invoice page | Decided | Asia/Hong_Kong labelled GMT+8 like the PDF, not the viewer's zone | Product |
| Every sent message | Decided | GMT+8, grading letters included; a day with no clock names no zone | Product |
| A zone the platform does not recognise | Decided | The render stops and names it | Product |
| Auction order operator surfaces | Decided | The Orders worklist, the order page with its timeline and invoice log, and the send and reissue dialog's payment deadline state Asia/Hong_Kong, labelled GMT+8 (Hong Kong time), not UTC; every other operator table stays UTC | Planning owner |
| An admin surface on a shop's clock | Decided | The vault console and the appointments diary read on the shop's clock, because staff at a counter tell collectors times on it; every other admin surface states UTC | Product |
| Records a machine reads | Decided | An export and the audit trail stay UTC whatever the surface they come from reads, so a record joins across shops on one zone | Product |
| First paint | Decided | A deadline may read UTC named GMT until the browser's zone is known, then it switches | Product |
:::
