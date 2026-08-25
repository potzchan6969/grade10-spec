# UI: auction email notifications

The collector-facing surface of this change is six email messages. Operators
also get a send log. Nothing renders in the site shell, and no `@grade10/ui`
or design-system export changes.

## Screens

**No Figma frame exists for these messages or the send log yet.** A message a
collector reads is a designed surface and needs one, the same as a page does;
`tasks.md` carries producing them in the rendering group. Message bodies are
not described in prose here, for the same reason a screen is not.

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

None. Mail is rendered by the email sending service and shares nothing with
the site's component packages. The send log is an admin assembly from existing
primitives (`Input`, `Text`, table layout).

`@grade10/i18n` is **not** involved: these messages are English regardless of
the reader's locale, per `money-amounts`.

## States

An email has no interaction states. What varies between one send and the next
is content, and each variation is tied to the scenario that defines it.

| Variation | Scenario |
| --- | --- |
| A lot whose close has moved past its scheduled close | *The closing warning uses the scheduled close* — the warning states the scheduled close; the message must not imply it is the final deadline |
| An amount in a currency with a different minor-unit exponent | `money-amounts` — English sent-message money shape |
| A close rendered in the message | `dates-and-times` — names its zone, same instant as the page |
| The outbid message's figures | *A collector is told they have been outbid* — current bid after the displacing bid, and the effective close |
| A recipient enrolled by both watching and bidding | *A watcher who also bids receives one copy* — one message, not a merged or repeated one |
| The send log filtered to one collector | *The send log is filterable by email* |
| A log row for a sent message | *The send log shows type, not content* — type, email, listing, Sent At; no body |

Every message states the lot it concerns. None recommends another lot, per the
proposal's non-goal on marketing mail.
