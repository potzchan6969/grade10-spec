---
title: Account
order: 1
---

What a collector needs before bidding: an account, a verified identity above
the bar, and a delivery address to confirm onto a won lot. Sign-in and the
identity check are the same across Grade10 — [Sign-In](/p/shared/auth/sign-in)
and [KYC](/p/grade10-site/account/kyc) hold their rules — so this chapter
states what the auction meets.

## Registration and Login

No password and no code: a sign-in link by email, or Google on a brand that
enables it.

| Rule | Value |
| --- | --- |
| Ways in | An emailed sign-in link, or a verified Google address where the brand enables Google |
| Registration | The first successful sign-in for an address creates the account; letter case never makes a second one |
| Resend | Off for **60 seconds** after each send; a new link replaces the one before it |
| Session | Every site of the brand, and no other brand's |

:::flow{title="Signing in"}
## *Collector* — **Asks for a link**
Types their email. Pressing again starts no second request, and asking again
within a minute is answered with a wait rather than a second message.
## *Grade10* — **Sends one link**
The newest email in the inbox is always the one that works.
## *Collector* — **Follows it**
A working unused link signs them in. A used, replaced or expired link creates
no session, and a toast says which — [Sign-In · Following the
Link](/p/shared/auth/sign-in#following-the-link).
:::

- **Where the auction asks** — the bid panel, a watch and My Auctions each
  offer sign-in to a signed-out viewer and return them where they were —
  [Bidding · Auction Panel](/p/grade10-site/auction/bidding#auction-panel)
- **Account page** — `grade10.com/profile`: the display name, the KYC card and
  the notification switches — [Account](/p/grade10-site/account)

## Verified Identity

- 🚧 **The bar** — a bid of **HKD 120,000** or more asks for a verified
  identity; below it, nothing is asked
- 🚧 **Checked once** — the collector verifies from their account page and is
  recognised wherever Grade10 asks: at a bid, a high-value checkout or a vault
  visit — [KYC](/p/grade10-site/account/kyc)
- 🚧 **Held, not refused** — a bid at or above the bar from an unverified
  collector is held at the storefront and told where to verify; no card hold
  is taken and the auction records nothing — [Bidding · Auction
  Logic](/p/grade10-site/auction/bidding#auction-logic)

## Delivery Address Management

The book is account-wide and shared across storefronts; a winner confirms one
address onto each order they win — [Post-Bidding · Winner
Order](/p/grade10-site/auction/post-bidding#winner-order).

| Rule | Value |
| --- | --- |
| Saved addresses | **5** named addresses per account |
| One-time address | Confirmed onto one order without being saved; offered even when the book is full |
| Default | The account default is pre-filled on an order, and still confirmed |
| Fields | The address form, its required fields marked — [the form](/p/grade10-site/auction/post-bidding#winner-order) |

- **Kept with the order** — the order keeps a snapshot, so editing the book
  later changes nothing on it, and an unpaid order's address cannot be
  archived
- ❓ **Managing the book** — where a collector adds, edits and removes a saved
  address outside an order, so a full book can be cleared before an address
  deadline; Product and Design confirm
- ❓ **Store checkout** — whether the store's checkout address and this book
  are one set; Product confirms
- ❓ **Postal code in Hong Kong** — the form requires one, and Hong Kong
  addresses have none; Product confirms whether it stays required everywhere

:::detail{title="Product decisions" for="pm"}
The auction reuses the account Grade10 already has. What it adds is the bar a
high bid must clear and the address book a winner confirms from, and the
book's own management is the one part nobody has specified.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Email paths | Decided | The sign-in link alone; the code is withdrawn — [Sign-In](/p/shared/auth/sign-in). | Product |
| Verified bidder | 🚧 In flight | A bid of HKD 120,000 or more needs a verified identity, checked once from the account and before the auction hears of the bid. | Product |
| Saved address cap | Decided | Five named addresses per account; at the cap a one-time address still settles an order, and saving waits until one is removed. | Product (@tangconst) |
| Managing the book | ❓ Open | No surface adds, edits or removes a saved address outside an order. | Product and design |
| Store checkout | ❓ Open | Whether the store's checkout address and this book are one set. | Product |
| Postal Code in Hong Kong | ❓ Open | Required on the form, while Hong Kong addresses have none. | Product |
:::
