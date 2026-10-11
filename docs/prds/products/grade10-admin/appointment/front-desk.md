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
| Walk-in ticket | W01, W02 and on, in the day's join order at one shop |

## Check In

A staff member checks a visitor in on arrival, so every arrival is one somebody saw.

- **Find** - by phone, email, name or visit code, typed into the Check in field; nothing is scanned, so the desk needs no scanner or camera
- **Wrong shop** - a visit booked at another shop offers Move here or Add as walk-in
- **Not today, cancelled or already in** - each says so and checks nobody in
- **Check in and call** - one act when a counter that runs the service is free

## Waiting

Everyone checked in and every walk-in waits in one list, in the order they will be served: first come, first placed.

- **Due time** - the booked start for a visitor in by the end of the hold; the join time for a walk-in; the check-in time for a visitor who arrives after the hold
- **Placement** - each person takes the earliest gap of their service's length on an open counter that runs it, so a walk-in never takes a booked visitor's time
- **Next** - one line names the free counter and who to call to it
- **Order** - the list and each walk-in's place on their ticket read the same; Call still takes anyone waiting

## Call

Call puts a waiting person at a counter, and the counter stays theirs until the visit closes.

- **Counter** - any open counter that runs the service; the visit keeps its booked time on record and holds the counter from the call
- **Overrun** - a visit past its end does not keep its counter busy; the next visit due there is called as usual
- **Not seen** - a called walk-in not seen in 10 minutes ends as Didn't come; a called booked visitor goes back to Waiting
- **Transfer** - records where the visit went and completes it; the intake runs on its own and holds no counter

## Walk-ins

A walk-in waits as an entry and becomes a visit when called, so every visit to a counter is counted.

- **Join** - a staff member adds the name, the service and, if the collector wishes, a phone or an email; a phone gets the ticket link on WhatsApp, an email gets it by email, and a walk-in with neither listens for their ticket number
- **Serve now** - a free counter seats the walk-in at once
- **You're next** - for a walk-in with a phone, one tap opens a WhatsApp message carrying their ticket link
- **Paused until** - one value per shop, closing time or until turned back on, set from The Day or Shop Setup
- **Last call** - a walk-in whose service no longer fits before closing is not placed: Add walk-in says so, and the wait page shows walk-ins closed for today
- **At closing** - walk-ins still waiting leave the line
- **Lost** - a walk-in who leaves the line before the call ends as Left, one called and not seen as Didn't come; both count as lost

## Late Arrivals

- **Within the hold** - the counter waits; a collector who said they are running late shows with their new time
- **After the hold** - the visit shows how late it is, and calling someone else to the counter releases it
- **Arriving after the hold** - checks in and waits from that moment
- **Never came** - the day's-end close records the visit as Missed

## Closing a Counter or the Shop

- **Close until** - a counter nobody can staff leaves the estimates and online booking until the time given; no visit is cancelled
- **Close early** - the whole shop from now, with one reason: every visit not yet called ends as cancelled by the shop and is emailed the reason and Pick another time; walk-ins still waiting leave the line

:::flow{title="A walk-in from the door to the counter"}
## *Collector* - **Asks at the counter**
Wants to hand in 8 cards for grading.
## *Staff* - **Adds them to Waiting**
Name, service and a phone; the screen shows ticket W03, the estimate about 10 to 20 min and Send on WhatsApp for the ticket link.
## *Collector* - **Follows the ticket**
The ticket link shows the place in line and the estimate as it moves.
## *Staff* - **Sends You're next**
The Next line names them; one tap opens the WhatsApp message.
## *Staff* - **Calls them to Counter 1**
The ticket turns to Counter 1; the visit starts there.
## *Staff* - **Sends the cards to grading**
The visit holds Counter 1 until grading saves the submission.
:::

:::detail{title="Product decisions" for="pm"}
A shop serves booked visitors and walk-ins at the same counters, so the desk has to see who has arrived, who waits and which counter frees next, and has to count both kinds of visit to know how many arrive on a booking. It does so without staff rosters, because a counter is what the diary can promise. Out of scope: a self check-in, a live connection per shop, automatic WhatsApp or SMS, a waitlist, seats and group sessions.

| Measure | Counts |
| --- | --- |
| Booked share | Visits that arrive on a booking against all visits, per service and shop |
| Missed | Booked visits nobody came to |
| Walk-in wait | Median and the slowest 1 in 10, per shop |
| Walk-ins lost | Walk-ins who ended as Left or Didn't come |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Where the desk lives | ❓ Open | Inside The Day on today, beside the grid; no separate screen. | Product |
| Check in | ❓ Open | Staff only; a collector's "I'm here" pings the desk and changes nothing. | Operations |
| Walk-ins in the diary | ❓ Open | Every walk-in becomes a visit when called, so booked share counts every visit. | Product |
| Transfer | Decided | Completes the visit at once; an intake is independent of the visit and never keeps a counter busy, even past the slot. | Product |
| Waiting order | Decided | Listed in the order people will be served, matching the place on a walk-in's ticket. | Product |
| Close early | ❓ Open | One staff act cancels the remaining visits; a closure alone still cancels nothing. | Operations |
| A visit inside a closure | ❓ Open | Closes as closed by the shop, never Missed, and sends nothing. | Operations |
| Changing an outcome | ❓ Open | Within 7 days, with a reason; never on a visit sent to grading or the vault. | Operations |
| Live updates | ❓ Open | Polling; no live connection per shop. | Engineering |
| WhatsApp | ❓ Open | Staff tap a prepared message; nothing sends by itself. | Operations |
| Not seen | ❓ Open | Staff press Didn't come once the 10 minutes pass; no visit ends by itself. | Operations |
| Close early and product visits | ❓ Open | A visit grading or the vault booked for itself stays booked; its product moves it. | Operations |
| You're next sent | ❓ Open | The Sent mark on a row is the phone's own; another staff phone does not see it. | Operations |
| No QR | Decided | No pass, ticket or poster carries a QR; staff find a visit by phone, email, name or code, and send the ticket link. | Product |
| Desk acts and Undo | ❓ Open | Check in, Call, Add walk-in and the closures apply at once with no Undo; a mark keeps its Undo. | Product |

The risk is a floor that stops pressing Call: the counters then read free while people are served, and the estimates drift. Design: [the Appointments page of the Admin Console Redesign canvas](https://claude.ai/artifact/VT2bj6voRA2Ps3G9wqivGd). Benchmarks: [Genius Bar and cal.com](/references/appointment-benchmarks).
:::
