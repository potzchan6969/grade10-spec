---
title: Your Visit
order: 2
---

The manage link opens one page per visit, and the page follows the visit from the booking to what happened at the counter.

| Phase | The page shows | 繁中 |
| --- | --- | --- |
| Booked | service, shop, time, what to bring, Change time, Cancel | 已預約 |
| Today | the pass, how to get there, Running late | 今天 |
| Checked in | Waiting and the estimate | 已報到 |
| Called | Counter 1 is ready for you | 請到 1 號櫃檯 |
| Completed | Book again | 已完成 |
| With grading | Your cards are with grading; grading's own mail follows | 卡牌已轉交評級 |
| With the vault | Your item is with the vault; the vault's own mail follows | 物品已轉交保險庫 |
| Time passed | the time held until, walk in and wait, or book another time | 時間已過 |
| Missed | Book again | 已錯過 |
| Cancelled | who cancelled and the shop's reason, Book again | 你已取消, 門市已取消 |
| Shop closed | the closure's reason, Pick another time | 門市今天休息 |

## The Pass

- **Visit code** - BK- and five characters on the listing-code scheme, so a code read aloud with O, I or L still finds the visit
- **On the pass** - the code as a QR and as text, the service, the shop and the time, and the counter once called
- **Where** - the visit page on the day, and the day-before message
- **Not a key** - the pass checks a visit in and releases nothing; grading and the vault check who collects
- **Product visits** - a visit grading or the vault books for itself has no pass and no visit page

## Running Late

- **Until the end of the slot** - Change time and Cancel; Cancel asks a reason the collector may skip
- **Until the end of the hold** - Running late: the collector says about when they will arrive, and the desk sees the new time
- **After the hold** - Time passed: walk in and wait, or book another time; the visit stops counting as the live visit for its service
- **Typhoon** - Today and the day-before message say "Signal 8 or black rain: we close while it's up and email you."

## Walk-in Ticket

- **Wait page** - the door poster's QR opens the shop's wait page: the walk-in wait for each service now, today's hours and Book a time; nobody joins from it
- **Ticket** - staff add the walk-in and show the ticket QR on their screen; the collector's phone follows the place in line and the estimate
- **Called** - the ticket turns to the counter; a walk-in not seen in 10 minutes leaves the line
- **Paused** - the wait page says walk-ins are paused, and until when

## Messages

| Message | When |
| --- | --- |
| Confirmation | on booking |
| Day before | at the service's reminder lead, with the pass, Running late and the typhoon line |
| Moved | on a move |
| Cancelled | by the collector; by the shop, with the reason; shop closed, with Pick another time |
| Thanks | 2 hours after the shop next opens, for a plain Completed visit |
| We missed you | 2 hours after the shop next opens, for a Missed visit; withdrawn when the outcome is corrected, never sent inside a closure |
| You're next | WhatsApp, tapped by staff when a walk-in with a phone is next, with the ticket link |
| Running late? | WhatsApp, tapped by staff for a booked visitor past the start, with the visit link |

Every message carries Manage your visit. A visit sent to grading or the vault gets their mail instead of Thanks.

:::flow{title="A booked visit from the pass to the counter"}
## *Collector* - **Gets the day-before message**
The pass, how to get there, Running late and the typhoon line.
## *Collector* - **Shows the pass at the counter**
The visit page on the day opens on the QR.
## *Staff* - **Scans it**
The visit is checked in; with a counter free, Check in and call seats them at once.
## *Collector* - **Waits**
The page shows Waiting and the estimate.
## *Staff* - **Calls them**
The page turns to Counter 1 is ready for you.
## *Staff* - **Closes the visit**
Completed, or sent to grading or the vault; the page says which.
:::

:::detail{title="Product decisions" for="pm"}
A collector who books once comes back to one link for everything about that visit, so the page answers what the shop would otherwise answer by phone: where to go, what to show, how long the wait is and what happened to the cards. Out of scope: payment, a self check-in, a waitlist, automatic WhatsApp or SMS.

| Measure | Counts |
| --- | --- |
| Missed | Booked visits nobody came to, per service and shop |
| Changed by the collector | Visits moved or cancelled from the page against all moved or cancelled |
| Late and still served | Visits that said they were running late and arrived within the hold |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Changes | Decided | Move and cancel until the slot ends, unless checked in. | Product |
| One live visit per service | ❓ Open | Ignores visits past their hold and walk-ins, so a collector who missed their time books again. | Product |
| Email is not identity | ❓ Open | Signed out, a second booking under a held address says the link went to that address and shows no time. | Product |
| Move to another shop | ❓ Open | Not offered; the collector cancels and books again. | Operations |
| Self check-in | ❓ Open | None; an "I'm here" on Running late only pings the desk. | Operations |
| Wallet pass | ❓ Open | None; the pass lives on the page and in the day-before message. | Product |
| After-visit mail | ❓ Open | Thanks and We missed you, 2 hours after the shop next opens. | Product |
| Manage link | ❓ Open | Derived from a server key, so every message can carry it while the record keeps only a hash. | Engineering |

The risk is a pass nobody opens; the desk finds the visit by name, code or phone. Design: [the Appointments page of the Admin Console Redesign canvas](https://claude.ai/artifact/VT2bj6voRA2Ps3G9wqivGd). Benchmarks: [Genius Bar and cal.com](/references/appointment-benchmarks). The desk's side: [Front Desk](/p/grade10-admin/appointment/front-desk).
:::
