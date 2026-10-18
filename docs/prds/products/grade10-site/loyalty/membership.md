---
title: Membership
order: 6
reviewed: 2026-10-06
---

An account is a member. The membership is run from `/membership`; the
collector's name, bio and email are shown on
[the account profile](/p/grade10-site/account/profile).

## Behind the Account

| Record | System | Holds | Made |
| --- | --- | --- | --- |
| Account | The identity system | Name, email, sign-in | At registration |
| Account profile | The store | The name chosen for the shop, bio, mobile number | The first time the store writes for the account |
| Member | The programme | An opaque user id, the ledger, the tier | With the account |
| Shopify customer | The shop | The same opaque key in a customer metafield, never the account id | Paired behind the account, once the email is verified |

🚧 **Avatar** — the account profile also holds the avatar a collector chooses
for the shop — [Profile](/p/grade10-site/account/profile)

:::flow{title="From registration to a paired member" id="registration-to-paired-member"}
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

❓ **Joining** — the spec makes the member at the first activity recorded,
and asks a member with no join date to join. Product confirms.

## Purchases Before the Account

A sale rung up at the till as a guest is not lost: it earns once it has an
owner. An order placed through the site's guest checkout gets its owner from the
account whose proven email it was placed under: at payment when that account
exists, otherwise when a sign-in proves that email, by the magic link to it or
a Google account under it -
[Checkout](/p/grade10-site/store/checkout#guest-checkout).

🚧 **No points** - a site guest order earns nothing, joined or not.

- **Customer on the sale** — a guest who gave the shop their email has a
  Shopify customer; when an account with that verified email is paired to
  it, the sale is attributed on the next pass and its points land
- **By an operator** — a sale with no customer, or the wrong one, is
  attributed by hand with the evidence recorded; one claim lives at a time,
  and a second is refused, naming the holder
- **Revoked** — takes back the points the claim granted; the sale can be
  attributed again
- **Amount not known** — a sale not yet priced is refused attribution,
  never guessed
- **Walk-in** — a paid till sale with no member and no customer on it is
  marked a walk-in by an operator, and stops asking for a link; a member who
  shows the receipt later can still be linked, and the link clears the mark
- **Earns as if theirs** — the earning is priced as it was when the money
  landed, and any refund since is replayed in order —
  [Points](/p/grade10-site/loyalty/points)

:::example{title="A till sale attributed after a refund" id="attribution-replays-refund" tier="Gold"}
- Gengar single $139

| Step | Event | Points | Balance |
| --- | --- | --- | --- |
| Earns | attributed, 13 pts × 1.2, priced as when the money landed | +15 | 15 |
| Refunds | $39 refunded before the attribution, replayed | −4 | 11 |

The refund came first, and is replayed after the earn, in the order it happened.
:::

## Membership Page

| Section | Shows |
| --- | --- |
| Membership | 🚧 A tier-skinned card — silver, gold or black — with the points to spend, what they pay at checkout, the run to keep or upgrade the tier where the tier has one, and the tier's earn rate. The whole card opens Tier & Benefits |
| Your member pass | 🚧 The tier's skin and the member's email, the QR a till scans, the short code beneath it, a countdown, and the actions that add the card to a phone wallet |
| Rewards | The catalog, priced in points, and what the balance affords. A reward that issues a coupon states what that coupon cannot be spent without — [Rewards](/p/grade10-site/loyalty/rewards) |
| Your coupons | Every coupon the member holds, what it takes off, its state, and when it ends. During a counter sale, one can be opened for the till to scan — [Rewards](/p/grade10-site/loyalty/rewards) |
| Spend on your basket | That points come off at checkout, and a link to checkout — no code is offered — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) |
| Activity | The member's own ledger. Every line says where it came from — the counter, the online store, or the programme itself |

::story{id="loyalty-membership-screens-membership--default" title="The membership page"}

- 🎨 **Tier & Benefits** — the page the whole card opens; it has no design yet
- 🚧 **No expiry line on the card** — the whole balance lapses on one shared
  inactivity date, never in parts, so a partial-expiry reminder has nothing
  to say here
- ❓ **Where the expiry date reads** — the Tier & Benefits page is being
  designed. Product confirms
- ❓ **Expiry line on the page** — the spec keeps one line here: the points
  and the day, warning inside the last 30 days, none at 0 points. Product
  confirms
- ❓ **Tier period end** — the spec shows the day it ends; the new card does
  not. Product confirms
- **Two counts** — the points that count toward the tier and the points to
  spend are two figures, never one total
- **The programme's balance** — a sale the programme has not yet taken is
  not in it
- **Hong Kong time** — every date on the page reads in the programme's own
  time zone
- 🎨 **Each section loads on its own** — a catalog that failed to load is no
  reason to hide a balance
- **A pass in a wallet** — the page names the wallet the card is carried in,
  with that pass's ending beside it —
  [Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card)

::story{id="loyalty-membership-screens-membership--pass-added" title="The card in a wallet"}

❓ Whether "Points to spend" and the tier-progress labels are the launch
names.

::story{id="loyalty-membership-blocks-tiercard--gold" title="Tier, balance and progress"}

## Member Pass

| Rule | Value |
| --- | --- |
| Code | **One QR and one 8-letter short code**, both for the same record |
| Life | **10 minutes** |
| Uses | **Once** — whichever a till takes first; the other is refused and says where and when |
| Wrong codes | **10 in 5 minutes** pause code entry for that shop |

- 🚧 **Email, not name** — no name is collected at registration, so the pass
  carries the member's account email under the tier badge
- 🚧 **Its own page on a phone** — the pass is presented alone and the page
  holds a screen wake lock while it is up, so the phone cannot dim or lock
  mid-scan; a web page cannot raise screen brightness, so keeping the screen
  awake is the part that is feasible

::story{id="loyalty-membership-screens-member-pass--default" title="The pass on its own page"}

- 🚧 **A code swaps in and out** — a fresh code dips the square out of view,
  fading and easing down, and settles the new pair in; the short code and
  its label never move, so a scanner never loses its square mid-read

::story{id="loyalty-membership-blocks-memberpass--code-rotates" title="A new code swaps in"}

- 🚧 **A taken code just rotates** — a code the till accepts is answered by
  the next one arriving; the pass never freezes on a used surface, and
  the refusal a replayed code earns stays on the till
- **New code on demand** — the earlier code stays alive until it is used or
  expires, so reopening the page in the queue does not end a code the member
  has just read out
- **Out of time** — a code past its 10 minutes dims, the pass says so, and
  Refresh stays offered

::story{id="loyalty-membership-blocks-memberpass--expired" title="A code out of time"}

- **Never stored** — the QR payload is answered once, and only its digest is
  kept
- **Letters only** — no digits, and none of I, L, O or U
- **Card code history** — kept only to power the refusal above, naming
  where and when a till already took a code; there is no member or
  operator surface for it

The pass's drop-shadow and the silver badge's slate-300 are the design's
own values, not semantic bindings — slate-300 is a foundational colour
token, deliberately unbound to a semantic rung.

The same pass can be added to a phone wallet —
[Member Card in a Wallet](/p/grade10-site/loyalty/wallet-member-card).

::story{id="loyalty-membership-blocks-memberpass--default" title="The member pass"}

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

::story{id="loyalty-membership-blocks-activitylist--channel-is-named" title="The member's activity"}

- 🎨 **Notified** — every identification the member did not show a code for —
  email, phone, the customer on the cart, an Apple pass — sends a notice at
  once
- **Archived reward** — an entry for a reward since archived still names it

## Privacy

- **Hidden from the member** — an operator's reason, a retry key, a
  redemption's fulfilment outcome and attempts, who settled or reversed
  something, stock counts, and the tier and money arithmetic an entry was
  priced from. The operator console shows this as the
  redemption's own audit trail
- **No user id on the surface** — it reads the session
- **Identity lives elsewhere** — a member's identity lives in the identity
  system and never in the programme, which holds only an opaque user id, so a
  leak of the loyalty database exposes balances and identifiers, not people
- **Deleting the account ends the membership** — balance, tier progress
  and coupons end at once, a waiting collection is cancelled without a
  refund, and the ledger record survives for audit; the Shopify customer is
  erased — [Shopify Integration](/p/grade10-site/loyalty/shopify-integration)

:::callout{kind="note"}
The tier card's Figma frame lives in Grade10-DS-2026 (node 7141:2000). The
other membership surfaces have no Figma frame, so their `@grade10/ui` blocks
and stories remain the visual record.
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

:::detail{title="Open work" for="engineer"}
- [ ] **Member pass on the workbench** - walk the pass alone at a phone width: the code counting down, Refresh swapping in a new square and short code, and the screen held awake; blocked on a person walking it - QA
- [ ] **Tier card on the workbench** - walk each skin, silver and gold with the retention run, black with the crown, and none; the whole card opens Tier & Benefits, and the gold member's page shows no expiry line; blocked on a person walking it - QA
:::
