---
title: Door
order: 3
---

The door is a phone or a tablet pointed at each guest's QR code.

| Rule | Value |
| --- | --- |
| A door day starts at | 06:00, brand time |
| The same code read again within | 3 seconds is the same scan |

## A Scan

Every scan the service hears answers: one yes, or one of five reasons.

| Answer | Means |
| --- | --- |
| Admitted | the ticket's type, its order reference, the guest's name, and for a day pass the day |
| Not a ticket | the code is forged, damaged or unknown |
| Void | its order was refunded or cancelled |
| Wrong event | a real ticket, for another event |
| Not valid today | this door day is outside the ticket's days |
| Already admitted | let in earlier the same door day, or ever for a single-entry ticket, with when |

- **A show past midnight** — stays one door day, so a day pass scanned at
  23:50 and again at 00:10 is refused the second time
- **Two scanners at one gate** — the same ticket is let in once
- **No connection** ❓ — what the door shows when a scan cannot reach the
  service, and what staff do then; Design

## By Hand

- **Find** — by the order's six-character reference or the buyer's exact
  address, when a code will not read; it answers each ticket on the order
  with its type, the guest's name and its entries
- **Admit** — lets one of them in, answered as a scan is
- **The guest list** — every ticket with its entries, a page at a time

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useDoorScan`, `useDoorFind`, `useDoorAdmit` in `@grade10/ticketing-admin-frontend`
- **Door day and slots** — `doorDayOf`, `admissionSlotOf` in `@grade10/ticketing-contracts`
:::

:::detail{title="Product decisions" for="pm"}
The door is the one place a slow answer makes a queue in the street. Staff
need a clear yes or a reason they can say aloud, and a way in for a guest
whose phone has died. Out of scope: printed tickets and wristbands, and
re-entry on a single-entry ticket.

| Measure | Counts |
| --- | --- |
| Scan to answer | Seconds from a read to the answer on screen |
| Refusals | Scans refused, by reason |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Door day at 06:00 | Decided | A night that runs past midnight stays one day at the door. | Product |
| Outcome on screen | ❓ Open | Colour, sound and wording readable at arm's length. | Design |
| Offline door | ❓ Open | Whether the door admits without a connection, and on what trust. | Operations |
:::
