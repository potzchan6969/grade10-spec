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
| Time passed | the time held until, Change time and Cancel until the slot ends, or book another time | 時間已過 |
| Missed | Book again | 已錯過 |
| Cancelled | who cancelled and the shop's reason, Book again | 你已取消, 門市已取消 |
| Shop closed | the closure's reason, Pick another time | 門市今天休息 |

## The Pass

- **On the pass** - who the visit is booked for, the service, the shop and the time, and the counter once called; no QR and no code
- **At the counter** - the collector gives their phone or email, and staff find the visit
- **Where** - the visit page on the day, and the day-before message
- **Not a key** - the pass checks a visit in and releases nothing; grading and the vault check who collects
- **Product visits** - a visit grading or the vault books for itself has no pass and no visit page

## Running Late

- **Until the end of the slot** - Change time and Cancel; Cancel asks a reason the collector may skip
- **Until the end of the hold** - Running late: the collector says about when they will arrive, and the desk sees the new time
- **After the hold** - Time passed: Change time and Cancel stay until the slot ends; after that, book another time. The visit stops counting as the live visit for its service
- **Typhoon** - Today and the day-before message say "Signal 8 or black rain: we close while it's up and email you."

## Messages

| Message | When |
| --- | --- |
| Confirmation | on booking, or once the payment arrives |
| Receipt | once a payment arrives, with the amount |
| Time released | when a checkout is left unpaid for 30 minutes |
| Reminder | at each lead the service sets, with the pass, Running late and the typhoon line |
| Moved | on a move |
| Cancelled | by the collector; by the shop, with the reason; shop closed, with Pick another time; with the refund where the service gives one |
| Refunded | once Stripe returns the payment |
| Thanks | 2 hours after the shop next opens, for a plain Completed visit, unless the service turns it off |
| We missed you | 2 hours after the shop next opens, for a Missed visit, unless the service turns it off; withdrawn when the outcome is corrected, never sent inside a closure |
| Running late? | WhatsApp, tapped by staff for a booked visitor past the start, with the visit link |

Every message is mail and carries Manage your visit; the WhatsApp rows are taps by staff, not messages the system sends. A visit sent to grading or the vault gets their mail instead of Thanks.

:::flow{title="A booked visit from the pass to the counter"}
## *Collector* - **Gets the day-before message**
The pass, how to get there, Running late and the typhoon line.
## *Collector* - **Shows the pass at the counter**
The visit page on the day opens on the pass.
## *Staff* - **Finds the visit**
By a phone, an email or a name. The visit is checked in; with a counter free, Check in and call seats them at once.
## *Collector* - **Waits**
The page shows Waiting and the estimate.
## *Staff* - **Calls them**
The page turns to Counter 1 is ready for you.
## *Staff* - **Closes the visit**
Completed, or sent to grading or the vault; the page says which.
:::

:::detail{title="Product decisions" for="pm"}
A collector who books once comes back to one link for everything about that visit, so the page answers what the shop would otherwise answer by phone: where to go, what to show, how long the wait is and what happened to the cards. Out of scope: walk-ins, a self check-in, a waitlist, automatic WhatsApp or SMS.

| Measure | Counts |
| --- | --- |
| Missed | Booked visits nobody came to, per service and shop |
| Changed by the collector | Visits moved or cancelled from the page against all moved or cancelled |
| Late and still served | Visits that said they were running late and arrived within the hold |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Changes | Decided | Move and cancel until the slot ends, unless checked in. | Product |
| One live visit per service | ❓ Open | Ignores visits past their hold, so a collector who missed their time books again; the visit they missed closes as Missed. | Product |
| Email is not identity | ❓ Open | Signed out, a second booking under a held address says the link went to that address and shows no time. | Product |
| Move to another shop | ❓ Open | Not offered; the collector cancels and books again. | Operations |
| Self check-in | ❓ Open | None; an "I'm here" on Running late only pings the desk. | Operations |
| Wallet pass | ❓ Open | None; the pass lives on the page and in the day-before message. | Product |
| No QR | Decided | The pass carries no QR; a phone or an email finds the visit, so neither the collector nor staff need a camera. | Product |
| No visit code | Decided | Nobody is shown a visit code; a phone, an email or a name finds the visit. The system still issues one, and a typed code still finds the visit, as a backup. | Product |
| After-visit mail | ❓ Open | Thanks and We missed you, 2 hours after the shop next opens. | Product |
| Manage link | ❓ Open | Derived from a server key, so every message can carry it while the record keeps only a hash. | Engineering |

The risk is a pass nobody opens; the desk finds the visit by name, phone or email. Design: [the Appointments page of the Admin Console Redesign canvas](https://claude.ai/artifact/VT2bj6voRA2Ps3G9wqivGd). Benchmarks: [Genius Bar and cal.com](/references/appointment-benchmarks). The desk's side: [Front Desk](/p/grade10-admin/appointment/front-desk).
:::
