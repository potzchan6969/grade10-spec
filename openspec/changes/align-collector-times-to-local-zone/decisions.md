## Goals

- Collector in-app clocks follow the viewer's local zone.
- A named zone on those surfaces is the viewer's.
- Invoices, receipts, T&C, and emails always read GMT+8.

## Non-Goals

- Changing operator tables off UTC.
- Changing how a brand judges a calendar day (shop midnight stays the brand zone).
- Relative countdowns (`Ends in`).
- Rewording T&C last-updated dates that carry no clock.
- Moving appointment shop hours off the desk's zone as a booking constraint; only the words a collector reads convert.

## Decisions

| Q | Asked | Decided | Instead of |
| --- | --- | --- | --- |
| Q1 | Which zone do collector surfaces use? | The viewer's local zone, supplied as `timeZone` | Always HKT; always UTC |
| Q2 | If a collector surface names a zone, which name? | The viewer's short name at that instant (HKT, EDT) | The same HKT suffix for every reader; drop the suffix |
| Q3 | What do PDFs, T&C, and emails name? | GMT+8 on Asia/Hong_Kong | HKT; winner's own zone on the PDF |
| Q4 | Do mail and PDF share one label? | Yes, GMT+8 | HKT on paper, GMT+8 in mail |

## Raised

| Capability | Raised | Landed |
| --- | --- | --- |
| `shared/dates-and-times` | Machine zone vs stated zone | Q1 |
| `shared/dates-and-times` | HKT vs GMT+8 on documents | Q3 |
| `shared/ui/invoice-and-receipt-pdf` | Winner zone vs brand GMT+8 | Q3 |
