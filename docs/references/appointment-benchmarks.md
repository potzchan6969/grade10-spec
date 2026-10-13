# Appointment Benchmarks

What Apple's Genius Bar, hybrid queue products and cal.com do for booked and walk-in visits, checked on 2026-10-08, and what the appointment design takes from each. [Front Desk](../prds/products/grade10-admin/appointment/front-desk.md), [Your Visit](../prds/products/grade10-site/appointment/visit.md) and [Book a Visit](../prds/products/grade10-site/appointment/booking.md) carry the decisions, each still open there.

## Genius Bar

- **Booking** - the problem first, then a store with a free time, a time in the store's zone, a phone number, Reserve now
- **Confirmation** - a case ID, Add to Calendar, Manage my reservations, a QR to show a Specialist, Add to Apple Wallet, what to bring
- **Changes** - reschedule or cancel from the Support app, the email's link, or the case ID with the account's last name
- **Arrival** - a Specialist scans the QR or the Wallet pass and logs the visit on an iPad; a Genius finds the visitor on the floor
- **Waiting** - a spoken estimate, then "you're next" on the staff iPad; the visitor sees no place in line
- **Walk-ins** - triaged on an iPad, served when a technician is free, texted to return and when a technician is ready (2015 reports)
- **Policies** - none published for a late arrival, a cancellation cut-off or a no-show
- **Pickup** - photo ID matching the name plus the order number or QR; fake IDs with forwarded QR codes collected orders in 2024 and 2025

Apple's booking pages do not render outside a browser, so the steps above join Apple's own pages with dated walkthroughs: [Genius Bar](https://www.apple.com/retail/geniusbar/), [Macworld](https://www.macworld.com/article/670653/how-to-book-an-appointment-at-an-apple-stores-genius-bar.html), [Loop Insight](https://www.loopinsight.com/2015/02/24/apple-to-overhaul-genius-bar-appointment-process/), [MacTrast](https://www.mactrast.com/2024/12/criminal-impersonators-claiming-macbooks-at-apple-stores-before-real-customers-arrive/).

## Queue Products

| Product | Join | Follow | Running late | Bookings and walk-ins |
| --- | --- | --- | --- | --- |
| [Waitwhile](https://help.waitwhile.com/en/articles/10134631-automation-how-to-move-bookings-to-the-waitlist) | link, QR, kiosk or staff | place in line and wait | Delayed, set by the visitor | a booking joins the line a set time before its start or on arrival, keeping its place; joins close when the wait passes closing |
| [Qmatic](https://qmatic.com/product-updates/delay-visit) | kiosk or staff | the wait clock starts at check-in | I need more time, 5 to 30 min; nobody is called until I'm here | Early and Late tags, minutes overdue, an alert at a walk-in limit |
| [Qminder](https://help.qminder.com/qminder-setup-options-how-to-start-serving-visitors-efficiently) | iPad kiosk, QR or staff | text messages | - | one line and one dashboard; reminders from 3 days to 1 hour ahead |
| [Appointedd](https://support.appointedd.com/en/articles/15899748-how-to-join-a-virtual-queue-customer-view) | Join the Queue | ticket, place, estimate; Joined, Waiting, Ready | Delay My Turn by 5, 10 or 15 min; Leave Queue with a reason | staff Serve, Skip, Remove, No Show and Complete; no fixed no-show timeout |

## cal.com

- **Fit** - booking rules, policies, messages and webhooks; no resource, check-in, queue, customer or walk-in model
- **Rules** - per event type: lengths, slot interval, buffers, minimum notice, future limit, frequency limits, an active-booking cap
- **Why not** - a troubleshooter says why a time is not offered
- **Questions** - typed fields with stable identifiers, URL prefill, phone-only identity; one label per question, in one language
- **Changes** - cancel and reschedule cut-offs, a reason required by role, staff reschedule past the rules
- **Messages** - before or after a booking, on a change and on a no-show; email, SMS and one fixed WhatsApp template
- **Language** - zh-TW per event type; a zh-HK browser falls back to English
- **Source** - the hosted product is closed since v6.4; the open repository, cal.diy, drops teams, workflows and insights ([help](https://cal.com/help/), [docs](https://cal.com/docs/))

## Taken

| From | Taken | Page |
| --- | --- | --- |
| Genius Bar | a pass with a QR and its code, shown at the counter | Your Visit |
| Genius Bar | one link to change or cancel, in every message | Your Visit |
| Genius Bar | services sized by the work: drop-offs by card count | Book a Visit |
| Pickups | the pass checks a visit in and releases nothing | Your Visit |
| Queue products | one Waiting order for booked visitors and walk-ins, by due time | Front Desk |
| Queue products | a hold after the start, then the visitor waits as a walk-in | Front Desk |
| Queue products | an estimate as a range; the place in line on the walk-in's ticket | Front Desk |
| Queue products | no walk-in placed once the service no longer fits before closing | Front Desk |
| cal.com | per-service notice, horizon, buffers and starts; one live visit per service | Book a Visit |
| cal.com | why a time is not offered, in the staff Book dialog | Front Desk |
| cal.com | typed questions in both languages, and prefill | Book a Visit |

## Left Out

The pages leave these out, each an open row there.

- **Wallet pass** - the pass lives on the visit page and in the day-before message
- **Self check-in** - no kiosk, geofence or "I'm here" that checks a visit in; every arrival is one staff saw
- **Waitlist** - a full day shows the earliest time at each shop and today's walk-in wait
- **Automatic SMS or WhatsApp** - staff tap two prepared WhatsApp messages
- **Seats and group sessions** - a counter serves one visit at a time
- **Payment and no-show fees** - the visit's cost is settled in the shop
- **An on-the-day reminder** - one reminder, at the service's lead
