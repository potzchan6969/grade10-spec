---
title: Promo Codes
order: 4
---

A promo code takes money off a ticket order at checkout. An operator makes
it on the event's Promo codes tab; a buyer types it on Check Your Order —
[Buying Tickets](/p/grade10-site/ticketing/buying#promo-codes).

| Rule | Value |
| --- | --- |
| 🚧 A code's name | 3 to 20 letters and digits, unique on its event, typed in any case, shown in capitals |
| 🚧 Codes on one order | One |
| 🚧 Smallest total a code leaves | HK$4.00, Stripe's smallest charge, unless the code makes the whole order free |
| 🚧 Wrong codes before checkout waits | 10 in an hour from one browser, then 10 minutes |

## A Code

- 🚧 **Event** — a code belongs to one event and works on no other
- 🚧 **Discount** — one per code
  1. **% off** — 1 to 100, off the passes it covers
  2. **Amount off** — HKD off each ticket, or off the order
  3. **Free tickets** — a number of tickets free across every order, such
     as 4; the dearest tickets in an order go free first, and their Fast
     Pass days too unless the operator turns that off
- 🚧 **Today's price** — the discount comes off the price in force, early
  bird included
- 🚧 **Conditions** — all optional
  - **Passes** — every pass, or the ones chosen; Fast Pass days are
    discounted only where the operator says so
  - **Some tickets only** — for every 2 tickets, 1 gets the discount, the
    cheaper ones first; the numbers are the operator's
  - **Minimum** — a number of tickets of those passes, or an order amount
- 🚧 **Limits**
  - **Uses** — how many orders may use it, or no limit; a Free tickets code
    counts tickets instead
  - **Per email** — once, or up to a number of orders
  - **Who** — anyone with the code, or only a list of emails, checked
    against the buyer's email whether typed or signed in
- 🚧 **Dates** — starts now or at a time, and expires at a time, in HKT
- 🚧 **Share link** — the event's address with `?code=`, which fills the
  code in at checkout
- 🚧 **In words** — the editor reads the code back in a sentence and shows
  the line a buyer would see on a sample order
- 🚧 **One-time codes** — a batch of codes, each good for one order, with a
  prefix such as `PARTNER-7KQ2`, exported as a CSV for a partner

## Uses

- 🚧 **Held** — a use is held from the moment the buyer pays until the
  payment lands or the hold ends; the tab shows used, held and left
- 🚧 **Refunded orders** — keep their use
- 🚧 **Locked once used** — a used code keeps its name, discount and
  conditions; its dates and limits stay editable, and it can be paused,
  resumed or ended now
- 🚧 **The list** — each code with its discount in words, uses, per-email
  limit, expiry, status and the discount given, the sum across them
  above; Scheduled, Active, Paused, Used up, Expired and Ended early
- 🚧 **One code's uses** — the orders that used it, with the buyer's email,
  the discount and whether paid, held or refunded, exported as a CSV
- 🚧 **On the order** — every order shows its code and the discount

:::detail{title="Product decisions" for="pm"}
A show sells through partners, press and its own posts, and each wants a
price of its own without a pass of its own. A code gives that price to the
people who hold it, and the console shows what each code cost. Out of scope:
codes across events, two codes on one order, and codes that change a
pass's price on the event page before checkout.

| Measure | Counts |
| --- | --- |
| Orders with a code | Orders paid with a code, against all orders |
| Discount given | What every code took off, per code |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| One code an order | Decided | Codes never stack, so a buyer never needs to hunt for the best pair and the shop never pays for two. | Product |
| HK$4.00 floor | Decided | A code never leaves less than Stripe's smallest charge to pay; it stops at HK$4.00 rather than giving the order away. A code that frees the whole order skips Stripe and stays free. Decided 2026-10-30. | Product |
| Refunded use | Decided | A refunded order keeps its code use, so a refund can't be used to get a code back. Decided 2026-10-30. | Product |
| Locked once used | Decided | Every order that used a code got the same deal; changing the deal after would make the uses disagree. | Product |
| Points | Decided | A discounted order earns the programme's 1 point per HKD 10 on what was paid; a free one earns none. | Product |
| Wrong guesses | Decided | 10 wrong codes in an hour from one browser make checkout wait 10 minutes, so a Free tickets code can't be guessed. Decided 2026-10-30. | Product |
:::
