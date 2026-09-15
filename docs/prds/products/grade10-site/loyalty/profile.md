---
title: Profile
spec: grade10-site/loyalty/programme
order: 6
---

An account is a member. The membership is run from `/membership`; the
account itself, its name, email and mobile number, is on
[the account profile](/p/grade10-site/account/profile).

## Behind the Account

| Record | System | Holds | Made |
| --- | --- | --- | --- |
| Account | The identity system | Name, email, mobile number, sign-in | At registration |
| Member | The programme | An opaque user id, the ledger, the tier | With the account |
| Shopify customer | The shop | The same opaque key in a customer metafield, never the account id | Paired behind the account, once the email is verified |

:::flow{title="From registration to a paired member"}
## *Member* — **Registers**
The member creates an account. Nothing else is asked.

## *Account* — **Account made**
The identity system holds who they are; the programme never does.

## *Loyalty* — **Member made**
One member record per account, keyed on the opaque user id, with an empty
ledger and the entry tier.

## *Store* — **Shopify customer paired**
The store seeds the pairing and converges it in the background: nothing waits
on Shopify, and nothing is written to the shop until the email is verified —
[Shopify Integration](/p/grade10-site/loyalty/shopify-integration)
:::

:::callout{kind="warning" author="@ecchochan" date="2026-09-10"}
The join page at `/join`, its mobile number form and the join request are
removed from the product. The code still carries them and is to be removed.
:::

## Purchases Before the Account

A sale made as a guest is not lost: it earns once it has an owner.

- **Customer on the sale** — a guest who gave the shop their email has a
  Shopify customer; when an account with that verified email is paired to
  it, the sale is attributed on the next pass and its points land
- **By an operator** — a sale with no customer, or the wrong one, is
  attributed by hand with the evidence recorded; one claim lives at a time,
  and a wrong one is revoked and re-attributed
- **Earns as if theirs** — the earning is priced as it was when the money
  landed, and any refund since is replayed in order —
  [Points](/p/grade10-site/loyalty/points)

## Membership Page

| Section | Shows |
| --- | --- |
| Membership | Tier · points to spend · points earned this year toward the next tier · tier renews · points active until · expiring soon |
| Your member card | The QR a till scans, the short code beneath it, a countdown, and the actions that add the card to a phone wallet |
| Rewards | The catalog, priced in points, and what the balance affords. A reward that issues a coupon states what that coupon cannot be spent without — [Rewards](/p/grade10-site/loyalty/rewards) |
| Your coupons | Every coupon the member holds, what it takes off, its state, and when it ends. During a counter sale, one can be opened for the till to scan — [Rewards](/p/grade10-site/loyalty/rewards) |
| Spend on your basket | That points come off at checkout, and a link to checkout — no code is offered — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) |
| Activity | The member's own ledger. Every line says where it came from — the counter, the online store, or the programme itself |

- **One expiry line** — the Membership section names how many points
  expire and the day they go, on one line, and warns inside the last 30 days
- **Hong Kong time** — every date on the page reads in the programme's own
  time zone
- **Each section loads on its own** — a catalog that failed to load is no
  reason to hide a balance

❓ Whether "Points to spend" and "Points earned this year" are the launch
names.

::story{id="loyalty-membership-membershipsummary--default" title="Tier, balance and progress"}

## Member Card

| Rule | Value |
| --- | --- |
| Code | **One QR and one 8-letter short code**, both for the same record |
| Life | **10 minutes** |
| Uses | **Once** — whichever a till takes first; the other is refused and says where and when |
| Wrong codes | **10 in 5 minutes** pause code entry for that shop |

- **New code on demand** — the earlier code stays alive until it is used or
  expires, so reopening the page in the queue does not end a code the member
  has just read out
- **Never stored** — the QR payload is answered once, and only its digest is
  kept
- **Letters only** — no digits, and none of I, L, O or U

The same card can be added to a phone wallet —
[Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card).

::story{id="loyalty-membership-membercard--default" title="The member card"}

::story{id="loyalty-membership-membercard--already-used" title="A code a till has taken"}

## Histories

| Entry | Meaning |
| --- | --- |
| Points earned | A purchase, or a campaign grant |
| Points spent | A reward redeemed |
| Points put toward a purchase | Points paid against a bill |
| Points expired | The balance lapsed |
| Points added | An operator's correction, upward |
| Points taken off | An operator's correction, downward |
| Points revoked | A refund's claw-back |
| Points returned | A reversed redemption, or a cancelled or refunded sale that points paid for |

- **Card history** `TBC` — the last 20 codes, and where and when a till
  took each; served, and no surface shows it
- **Redemption outcomes** `TBC` — served, and no surface shows it
- **Notified** — every identification the member did not show a code for —
  email, phone, the customer on the cart, an Apple pass — sends a notice at
  once

## Privacy

- **Hidden from the member** — an operator's reason, a retry key, the
  fulfilment attempts behind a code, who settled or reversed something, and
  stock counts
- **No user id on the surface** — it reads the session
- **Identity lives elsewhere** — a member's identity lives in the identity
  system and never in the programme, which holds only an opaque user id, so a
  leak of the loyalty database exposes balances and identifiers, not people
- **Deleting the account ends the membership** — balance, tier progress
  and coupons end at once, a waiting collection is cancelled without a
  refund, and the ledger record survives for audit

:::callout{kind="note"}
No Figma frame exists for any membership surface, so the `@grade10/ui` blocks
and their stories are the visual record.
:::

:::detail{title="Code map" for="engineer"}
- **Page** — `apps/frontend/grade10/src/pages/membership`
- **Feature slices** — `@grade10/loyalty-frontend`'s `member`, `offer` and
  `rewards`
- **Enrolment, the card and the wallet** — the store worker's `membership`
  router, `packages/grade10-store/backend/src/trpc/routers/membership.ts`:
  `join`, `presentCard`, `presentations`, `addWalletPass`
- **The card** — `packages/grade10-store/backend/src/services/pos/identity`
- **Member data** — the loyalty worker's `me` router,
  `packages/loyalty/backend/src/trpc/routers/me.ts`
- **Design record** —
  [loyalty architecture](https://github.com/9gag/grade10/blob/main/docs/architecture/loyalty.md)
:::
