---
title: Membership
spec: grade10-site/loyalty/programme
order: 6
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
  and a wrong one is revoked and re-attributed
- **Walk-in** — a paid till sale with no member and no customer on it is
  marked a walk-in by an operator, and stops asking for a link; a member who
  shows the receipt later can still be linked, and the link clears the mark
- **Earns as if theirs** — the earning is priced as it was when the money
  landed, and any refund since is replayed in order —
  [Points](/p/grade10-site/loyalty/points)

## Membership Page

| Section | Shows |
| --- | --- |
| Membership | A tier-skinned card — silver, gold or black — with the points to spend, what they pay at checkout, the run to keep or upgrade the tier where the tier has one, and the tier's earn rate. The whole card opens Tiers & Benefits ❓ |
| Your member pass | The tier's skin and the member's email, the QR a till scans, a countdown, and the actions that add the card to a phone wallet |
| Rewards | The catalog, priced in points, and what the balance affords. A reward that issues a coupon states what that coupon cannot be spent without — [Rewards](/p/grade10-site/loyalty/rewards) |
| Your coupons | Every coupon the member holds, what it takes off, its state, and when it ends. During a counter sale, one can be opened for the till to scan — [Rewards](/p/grade10-site/loyalty/rewards) |
| Spend on your basket | That points come off at checkout, and a link to checkout — no code is offered — [Paying with Points](/p/grade10-site/loyalty/paying-with-points) |
| Activity | The member's own ledger. Every line says where it came from — the counter, the online store, or the programme itself. Earned and topped-up points read apart, here and in the balance — [Top-ups](/p/grade10-site/loyalty/top-ups) |

- **No expiry line on the card** — the whole balance lapses on one shared
  inactivity date, never in parts, so a partial-expiry reminder has nothing
  to say here. ❓ Where the expiry date reads instead — the Tiers & Benefits
  page is being designed 🚧
- **Hong Kong time** — every date on the page reads in the programme's own
  time zone
- **Each section loads on its own** — a catalog that failed to load is no
  reason to hide a balance

❓ Whether "Points to spend" and the tier-progress labels are the launch
names.

::story{id="loyalty-membership-blocks-tiercard--gold" title="Tier, balance and progress"}

## Tiers & Benefits

Every rung of the programme on one surface — what each asks, what each pays,
where the member stands and how points work. Its own page: the breadcrumbs
name Home, Membership and Tiers & Benefits; a small viewport navigates to
it; ❓ whether a wide viewport hosts it as a Membership section instead is
the Membership page's composition, not drawn yet.

| Section | Shows |
| --- | --- |
| Tier ladder | A stepper of the rungs in climb order — earned rungs ticked, the held rung in progress, unearned rungs still to come — with a line of qualifying progress beneath where the member's own tier asks one. No stepper line reaches an invitation-only rung, and a member whose tier is held by invitation sees nothing beneath it ticked and no qualifying line |
| Tier cards | One card per rung — the tier name, its ask in the member's words, and its benefits behind checks. The held rung's card wears the primary border and its tint |
| How Points Work | The mechanics as icon rows — earn, pending, spend, expiry — stacked on a narrow viewport and paired on a wide one. The preview states the programme's own values: a point redeems a Hong Kong dollar, points arrive when the order completes, and the whole balance lapses after twelve months with no activity |

- **Reaches** — the `TierCard` on Membership links here whole, and it has
  its own navigation entry ❓
- **The expiry date's home** — the mechanics card states the lapse rule;
  ❓ where a member's own "how many points expire and the day they go"
  line reads is not drawn yet

::story{id="loyalty-membership-screens-tiers-benefits--default" title="Tiers & Benefits, a gold member"}

## Member Pass

| Rule | Value |
| --- | --- |
| Code | **One QR** — a till that cannot scan falls back to the member's email |
| Life | **10 minutes** |
| Uses | **Once** — a code the till already took is refused, saying where and when |

- **Email, not name** — no name is collected at registration, so the pass
  carries the member's account email under the tier badge
- **Its own page on a phone** — the pass is presented alone and the page
  holds a screen wake lock while it is up, so the phone cannot dim or lock
  mid-scan; a web page cannot raise screen brightness, so keeping the screen
  awake is the part that is feasible
- **A code swaps in and out** — a fresh code dips the square out of view,
  fading and easing down, and settles the new one in — a transition,
  never an abrupt swap, so a scanner never loses its square mid-read
- **A taken code just rotates** — a code the till accepts is answered by
  the next one arriving; the pass never freezes on a used surface, and
  the refusal a replayed code earns stays on the till
- **New code on demand** — the earlier code stays alive until it is used or
  lapses, and the countdown rotates it out before it does, so the pass
  never draws an expired code
- **Never stored** — the QR payload is answered once, and only its digest is
  kept
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
| Points bought | A points pack, paid by card — [Top-ups](/p/grade10-site/loyalty/top-ups) |
| Bought points taken back | A chargeback, or a refund made in Stripe's dashboard, on a pack |

- **Notified** — every identification the member did not show a code for —
  email, phone, the customer on the cart, an Apple pass — sends a notice at
  once

## Privacy

- **Hidden from the member** — an operator's reason, a retry key, a
  redemption's fulfilment outcome and attempts, who settled or reversed
  something, and stock counts. The operator console shows this as the
  redemption's own audit trail
- **No user id on the surface** — it reads the session
- **Identity lives elsewhere** — a member's identity lives in the identity
  system and never in the programme, which holds only an opaque user id, so a
  leak of the loyalty database exposes balances and identifiers, not people
- **Deleting the account ends the membership** — balance, tier progress
  and coupons end at once, a waiting collection is cancelled without a
  refund, an open or held top-up closes with nothing charged, and the ledger
  record survives for audit

:::callout{kind="note"}
The tier card has a design frame. The
other membership surfaces have no design frame, so their `@grade10/ui` blocks
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
