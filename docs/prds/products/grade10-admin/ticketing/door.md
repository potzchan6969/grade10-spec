---
title: Door
spec: grade10-admin/ticketing/door
order: 3
---

The door is a phone or a tablet pointed at each guest's QR code.

- 🚧 **The passcode door** — `/door` on the site, with no account: the
  event's passcode and the device's name, such as "Gate A phone 2", which
  every admission records
  - **Open** — from 09:00 on the first day to the event's end
  - **Changing the passcode** — in the console; signs every device out
  - **Wrong passcodes** — slowed after five tries
  - **What it can do** — scan, admit, use Fast Pass, and find by reference;
    never by email, never a refund or an edit
- 🚧 **The console's door** — the same for staff, also finding by email

| Rule | Value |
| --- | --- |
| A door day starts at | 06:00, brand time |
| The same code read again within | 3 seconds is the same scan |

## A Scan

Every scan the service hears answers: one yes, or one of the reasons below.

| Answer | Means |
| --- | --- |
| Admitted | the ticket's type, its order reference, the guest's name, and for a day pass the day |
| 🚧 Not checked | no answer within 4 seconds, or no connection: don't let them in yet |
| Not a ticket | the code is forged, damaged or unknown |
| Void | its order was refunded or cancelled |
| Wrong event | a real ticket, for another event |
| Not valid today | this door day is outside the ticket's days |
| 🚧 No entries left | replacing Already admitted on a later day: the ticket has been let in on as many days as it admits |
| Already admitted | let in earlier the same door day, or ever for a single-entry ticket, with when |

- 🚧 **Fast Pass** — one door, no lanes: a scan admits as it always does,
  and while the ticket has a Fast Pass use left the answer offers Use Fast
  Pass; staff choose it for a guest from the Fast Pass queue, and it spends
  one use on today's entry, never a second the same day
- 🚧 **Undo** — for 10 seconds on the device that admitted; taking back an
  entry gives back the Fast Pass it used
- 🚧 **Admitted** — shows the entries and Fast Pass uses the ticket has left
- **A show past midnight** — stays one door day, so a day pass scanned at
  23:50 and again at 00:10 is refused the second time
- **Two scanners at one gate** — the same ticket is let in once
- 🚧 **The printed list** — each door day's attendees as a CSV, names and
  references, for when the network fails

## By Hand

- **Find** — by the order's six-character reference or the buyer's exact
  address, when a code will not read; it answers each ticket on the order
  with its type, the guest's name and its entries
- **Admit** — lets one of them in, answered as a scan is
- 🚧 **Attendees** — renamed from the guest list: every ticket with its entries, a page at a time

:::detail{title="Code map" for="engineer"}
- **Hooks** — `useDoorScan`, `useDoorFind`, `useDoorAdmit` in `@grade10/ticketing-admin-frontend`
- **Door day and slots** — `doorDayOf`, `admissionSlotOf` in `@grade10/ticketing-contracts`
:::

:::detail{title="Product decisions" for="pm"}
The door is the one place a slow answer makes a queue in the street. Staff
need a clear yes or a reason they can say aloud, and a way in for a guest
whose phone has died. Out of scope: printed tickets, wristbands,
and re-entry on the same day.

| Measure | Counts |
| --- | --- |
| Scan to answer | Seconds from a read to the answer on screen |
| Refusals | Scans refused, by reason |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Door day at 06:00 | Decided | A night that runs past midnight stays one day at the door. | Product |
| Fast Pass at the door | Decided | One QR code per ticket, also on a two-day pass. Fast Pass is a number of uses staff choose to spend at the scan, not a lane a door is set to. | Product |
| A door without the console | Decided | Volunteers at a crowded gate need no staff account; a passcode per event, per-device names and finding by reference only keep a leaked passcode from reaching refunds or who bought. | Product |
| No wristbands | Decided | The service neither sets nor shows a wristband; a venue that hands them out does so by its own rule. | Product |
| Admit on scan | Decided | A scan admits at once, with Undo for 10 seconds, rather than asking staff to confirm each guest. | Product |
| Offline door | ❓ Open | Whether the door admits without a connection, and on what trust. | Operations |
:::
