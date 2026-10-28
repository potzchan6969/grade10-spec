---
title: Front Desk
order: 2
---

The Day, opened on today, is the shop's front desk: who is here, who waits, which counter is free, and the one act that seats the next person.

| Rule | Value |
| --- | --- |
| Hold | 15 minutes after a booked start, set per service |
| Called and not seen | 10 minutes |
| Estimate | the placed start rounded up to 5 minutes, shown with 10 minutes more |
| Refresh | every 10 seconds while the screen is open; a hidden tab checks once a minute |

## Check In

A staff member checks a visitor in on arrival, so every arrival is one somebody saw.

- **Find** - by phone, email or name, typed into the Check in field; nothing is scanned, so the desk needs no scanner or camera
- **Wrong shop** - a visit booked at another shop offers Move here
- **Not today, cancelled or already in** - each says so and checks nobody in
- **No booking** - staff book the visitor into a free time, then check them in
- **Check in and call** - one act when a counter that runs the service is free

## Waiting

Everyone checked in waits in one list, in the order they will be served: first come, first placed.

- **Due time** - the booked start for a visitor in by the end of the hold; the check-in time for a visitor who arrives after the hold
- **Placement** - each person takes the earliest gap of their service's length on an open counter that runs it, so a late visitor never takes another's booked time
- **Next** - one line names the free counter and who to call to it
- **Order** - Call still takes anyone waiting

## Call

Call puts a waiting person at a counter, and the counter stays theirs until the visit closes.

- **Counter** - any open counter that runs the service; the visit keeps its booked time on record and holds the counter from the call
- **Overrun** - a visit past its end does not keep its counter busy; the next visit due there is called as usual
- **Not seen** - a called visitor not seen in 10 minutes goes back to Waiting
- **Transfer** - records where the visit went and completes it; the intake runs on its own and holds no counter

## Late Arrivals

- **Within the hold** - the counter waits; a collector who said they are running late shows with their new time
- **After the hold** - the visit shows how late it is, and calling someone else to the counter releases it
- **Arriving after the hold** - checks in and waits from that moment
- **Never came** - the day's-end close records the visit as Missed

## Closing a Counter or the Shop

- **Close until** - a counter nobody can staff leaves the estimates and online booking until the time given; no visit is cancelled
- **Close early** - the whole shop from now, with one reason: every visit not yet called ends as cancelled by the shop and is emailed the reason and Pick another time

:::detail{title="Product decisions" for="pm"}
A shop serves booked visitors at its counters, so the desk has to see who has arrived, who waits and which counter frees next. It does so without staff rosters, because a counter is what the diary can promise. Out of scope: walk-ins, a self check-in, a live connection per shop, automatic WhatsApp or SMS, a waitlist, seats and group sessions.

| Measure | Counts |
| --- | --- |
| Missed | Booked visits nobody came to |
| Wait | From check-in to the call: median and the slowest 1 in 10, per shop |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the desk lives | ❓ Open | Inside The Day on today, beside the grid; no separate screen. | Product |
| Check in | ❓ Open | Staff only; a collector's "I'm here" pings the desk and changes nothing. | Operations |
| Walk-ins | Decided | Not offered: no collector joins a line at the door and staff add none. A visitor without a booking is booked by staff into a free time. The built walk-in path stays in the code, unused and shown to nobody. | Product |
| Transfer | Decided | Completes the visit at once; an intake is independent of the visit and never keeps a counter busy, even past the slot. | Product |
| Serving Queue | Decided | Listed in the order people will be served. | Product |
| Close early | ❓ Open | One staff act cancels the remaining visits; a closure alone still cancels nothing. | Operations |
| A visit inside a closure | ❓ Open | Closes as closed by the shop, never Missed, and sends nothing. | Operations |
| Changing an outcome | ❓ Open | Within 7 days, with a reason; never on a visit sent to grading or the vault. | Operations |
| Live updates | ❓ Open | Polling; no live connection per shop. | Engineering |
| WhatsApp | ❓ Open | Staff tap a prepared message; nothing sends by itself. | Operations |
| Not seen | ❓ Open | Staff press Didn't come once the 10 minutes pass; no visit ends by itself. | Operations |
| Close early and product visits | ❓ Open | A visit grading or the vault booked for itself stays booked; its product moves it. | Operations |
| No QR | Decided | No pass carries a QR; staff find a visit by phone, email or name. A visit code is shown nowhere; a typed one still finds the visit. | Product |
| Desk acts and Undo | ❓ Open | Check in, Call and the closures apply at once with no Undo; a mark keeps its Undo. | Product |

The risk is a floor that stops pressing Call: the counters then read free while people are served, and the estimates drift. Design: [the Appointments page of the Admin Console Redesign canvas](https://claude.ai/artifact/VT2bj6voRA2Ps3G9wqivGd). Benchmarks: [Genius Bar and cal.com](/references/appointment-benchmarks).
:::
