# UI: auction email notifications

The collector-facing surface of this change is six email messages. Operators
also get a send log. Nothing renders in the site shell, and no `@grade10/ui`
or design-system export changes.

## Screens

**No Figma frame exists for these messages or the send log yet.** A message a
collector reads is a designed surface and needs one, the same as a page does;
`tasks.md` carries producing the send-log frame in the operator group.
Until a letter frame exists, the layout's source of truth is the existing
auction letter used by every kind today.

| Message | Frame | Audience |
| --- | --- | --- |
| Bidding opens in 24 hours | *to be produced* | Watchers |
| Bidding has opened | *to be produced* | Watchers |
| Bidding closes in 24 hours | *to be produced* | Watchers and bidders |
| Extended bidding has started | *to be produced* | Watchers and bidders |
| A lot you bid on received a new bid | *to be produced* | Bidders, excluding the one who bid |
| You have been outbid | *to be produced* | The collector who stopped leading |

One template family, six messages. A single frame set covering the shared
header, lot block, and footer is enough if it carries all six bodies.

| Screen | Frame | What is on it |
| --- | --- | --- |
| Admin send log | *to be produced* | Rows of type, sent-to email, listing, and Sent At. Filter by user email. No message body. |

## Components

None. Mail is rendered by `@grade10/email` and shares nothing with the site's
component packages. The send log is an admin assembly from existing
primitives (`Input`, `Text`, table layout).

`@grade10/i18n` is **not** involved: these messages are English regardless of
the reader's locale, per `money-amounts`.

## States

An email has no interaction states. What varies between one send and the next
is content, and each variation is tied to the scenario that defines it.

| Variation | Scenario |
| --- | --- |
| A lot whose close has moved past its scheduled close | `grade10-site-auction-notifications-SC-08` — the warning states the scheduled close |
| Start letter, listing + start instant, unsubscribe | `grade10-site-auction-notifications-SC-05`, `grade10-site-auction-notifications-SC-19` |
| Has-started letter, unsubscribe | `grade10-site-auction-notifications-SC-07` |
| Close-in-24h letter; unsubscribe only if they never bid | `grade10-site-auction-notifications-SC-08`; `grade10-site-auction-notifications-SC-03` for a participant who unwatched |
| Extended-bidding letter; unsubscribe only if they never bid | `grade10-site-auction-notifications-SC-09` |
| Outbid letter, own amount + new lead, no unsubscribe | `grade10-site-auction-notifications-SC-12`, `grade10-site-auction-notifications-SC-20` |
| New-bid letter, listing, no unsubscribe | `grade10-site-auction-notifications-SC-11` |
| Same heading / body / button / footer on two kinds | `grade10-site-auction-notifications-SC-18` |
| A recipient enrolled by both watching and bidding | `grade10-site-auction-notifications-SC-02` — one message |
| The send log filtered to one collector | `grade10-site-auction-notifications-SC-26` |
| A log row for a sent message | `grade10-site-auction-notifications-SC-25` — type, email, listing, Sent At; no body |
| No letter | `grade10-site-auction-notifications-SC-04`, `grade10-site-auction-notifications-SC-15`, `grade10-site-auction-notifications-SC-23`, `grade10-site-auction-notifications-SC-27`, `grade10-site-auction-notifications-SC-28` |

Every message states the lot it concerns. None recommends another lot, per the
proposal's non-goal on marketing mail.
