---
title: In-Store
spec: grade10-store/membership
order: 2
---

Collectors who buy in the shop are anonymous guests. Nothing at the till can
say who they are, so their purchases earn no points, staff see no tier or
balance, and points cannot pay for anything face to face — in the channel that
carries the majority of card sales. The programme is live online and
attributes every order there; the gap is exactly the physical one.

Membership opens that channel. Staff attach a member to a sale at the point of
sale, the sale earns under the same programme rules the web store follows, and
the member's points pay at the counter the way they pay online. One programme,
two doors.

The rules themselves live with the loyalty capability — tier validity, the
earning order, points paying at HKD 1, expiry. This capability adds the
channel, not a second rulebook, which is why it lands after the programme
rules change it depends on.

## At the till

Staff never handle registration. They point at the counter QR and the customer
registers on their own phone; staff then attach that customer to the sale so it
earns. One rule decides every branch of the till's behaviour: **the sale is
happening whatever the programme thinks.** Nothing throws and nothing waits
forever — every unhappy answer lands staff in a state that says carry on with a
normal sale.

Identification opens a short server-side session bound to the shop, the member
and a ten-minute lifetime — never to the claimed staff label, which changes
mid-transaction when staff switch by PIN. The member never confirms on their own
device; a typed identification notifies them instantly as a receipt rather than a
gate. A miss says only "no member found", never distinguishing an unpaired
customer from one who does not exist.

:::flow{title="Points at the till"}
## Open the terminal
Staff tap the loyalty tile on the POS home screen and open the modal.

## Find the member
Scan the QR on their member card, type the eight-character short code printed
under it, or type the exact email on the account. A miss says only that no member
was found.

## Read their standing
The panel shows tier, balances, window progress, renewal and points-active-until
dates, recent activity, what they can afford, open codes and pending collections.

## Attach them to the sale
Staff set the customer on the cart through Shopify's own search. Spending stays
disabled until the cart's customer matches the paired one, and each unmet
condition says which one it is.

## Preview the spend
Tap "use max" or type an amount. The server computes the read-back and returns an
intent that pins it.

## Read it to the member
Spend N, pay HKD X, balance after Y, earns about Z. Staff read the confirm screen
facing the member and tap. A double-tap replays the same intent rather than
spending twice.

## Apply the discount
The redemption mints a single-use money-off code and the discount lands on the
cart, normally within the same tap. Past a server-side deadline it answers
"preparing" — the points are spent and safe, the code follows in under a minute.

## Undo, if they change their mind
Before tender, staff cancel. The cart discount is removed first and confirmed
gone, and only then does the gateway deactivate the code and credit the points
back.
:::

Physical rewards are collected the same way: the pending redemption shows the
reward, the points paid and the date; staff verify and confirm, and the staff
label lands in loyalty's record. A second till trying the same collection gets a
distinct refusal naming when and where it already happened.

:::callout{kind="warning"}
Two till capabilities are not what they look like. **Phone lookup is unshipped** —
both phone flags default off, it cannot be exercised against the test fakes, and
the vendor write ships in a later phase. And the **kill switches have no admin
surface**: the flags exist and are enforced, but nothing flips them from a UI, so
the thirty-second rehearsal flip has nothing to flip.
:::

:::detail{title="For engineers" for="engineer"}
The till authenticates the **shop**, not a person. Its principal sits outside the
human role table holding exactly identify, redeem-for and collect, so no human
role — admin included — can ever carry those grants. Staff and location ids ride
along as labels for the audit trail, never as authorization.
:::
