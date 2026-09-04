---
title: Profile
spec: grade10-site/loyalty/programme
order: 5
---

A member runs their whole membership from one page at `/membership`: what they
hold, what they can spend it on, what is waiting for them at the counter, the
codes they own, their own history, and the card a till reads
([[grade10-site-loyalty-programme-SC-62]], [[grade10-site-loyalty-programme-SC-63]], [[grade10-site-loyalty-programme-SC-64]]). Every section
reads for itself, so a menu that failed to load is no reason to hide a
balance.

## Joining

A member joins at `/join`, signed in. Grade10 asks for a mobile number as part
of joining — the number travels with the request, so a refused number enrols
nobody. One request enrols the member in the programme and seeds their Shopify
customer pairing behind the account; neither step waits on Shopify. A second
tap replays the first, so joining is safe to retry ([[grade10-site-loyalty-programme-SC-02]]).
Someone whose purchases were recorded before they joined is invited to join
and shown the points already waiting ([[grade10-site-loyalty-programme-SC-01]]).

## The membership page

| Section | What it shows |
| --- | --- |
| Summary | Tier, points to spend, points earned this year against the next threshold, when the tier renews, and when the points stay active until |
| Your member card | The QR the till scans, the short code beneath it, a countdown, and the action that adds the card to Google Wallet |
| Rewards | The live menu, priced in points, with what the balance affords |
| Spend on your basket | Points against the current basket — an offer of a code, or a pointer to checkout where the shop takes points there |
| Waiting at the counter | Collect-in-store rewards with their deadline; a closed window says so |
| Your codes | Every money-off code in full, with value, expiry, and the undo |
| Activity | The member's own ledger, each spend saying what became of what it bought |

Every date reads in the programme's own time zone.

::story{id="loyalty-membership-membershipsummary--default" title="Tier, balance and progress"}

## The member card

The card is how a member proves they are standing at the till. Each
presentation is one QR and one eight-character short code backing the same
record: it lives ten minutes, and whichever of the two a till takes first
consumes it — the other is refused, naming where and when the first was used.
The card renews on demand, and an earlier presentation stays alive until it is
used or expires, so reopening the page mid-queue does not kill the code a
member just read out. The QR's payload is answered once and never stored; a
leaked database cannot replay it.

The short code exists for a camera that will not read a dim screen. Its
alphabet has no digits and none of I, L, O or U, so nothing typed is
confusable, and ten failed attempts in five minutes pause code entry for that
shop.

::story{id="loyalty-membership-membercard--default" title="The member card"}

::story{id="loyalty-membership-membercard--already-used" title="A code a till has taken"}

## In a phone wallet

The same card, added to Google Wallet, so it opens from a lock screen instead
of a sign-in.

- **The code** — made on the phone itself, so a pass is scannable where there is
  no signal, and it changes on its own rather than being fetched
- **Beside it** — the member's name, the tier they hold, and the points they can
  spend, following their standing without them opening anything
- **Ending one** — the member ends a pass whenever they like and adds another;
  an operator ends it for a member who has lost the phone
- **Apple Wallet** — not offered. Apple has no rotating code, so an Apple pass
  would mean carrying one permanent code, which is a different decision

:::detail{title="Standing up the wallet" for="operator"}
Nobody can be offered a pass until Google says so, and none of it is
same-day. In this order, because each step needs the one above it:

1. *Operations* — **Create the issuer account** in the Google Pay & Wallet
   Console. It opens in Demo Mode, which issues only to accounts named on it,
   so the counter can be rehearsed long before the public can save anything
2. *Operations* — **Complete the Business Profile and the payments profile**.
   Publishing access is refused without both, and the refusal names neither
3. *Operations* — **Request publishing access**. A Google review with no
   published turnaround — start it the day the issuer exists, not the week the
   shop opens
4. *Design* — **Give the class its artwork and words**: the programme's logo,
   the issuer's name, the programme's name, and one background colour. A class
   with none of these is what a member sees on their lock screen
5. *Operations* — **Create the class** and carry it from draft through review
   to approved. A draft class issues to nobody real
6. *Engineering* — **Create the service account**, grant it the wallet issuer
   scope, and take its key as PKCS#8. Anything else needs ciphers the workers
   do not carry
7. *Engineering* — **Set the two secrets** with `pnpm run secrets`:
   `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY`, and `WALLET_PASS_KEY`, which is this
   platform's own and seals every pass secret at rest
8. *Engineering* — **Set the three ids** as variables:
   `WALLET_GOOGLE_ISSUER_ID`, `WALLET_GOOGLE_CLASS_ID`,
   `WALLET_GOOGLE_SERVICE_ACCOUNT_EMAIL`. Half a configuration offers nothing:
   the save action is hidden until all five are set

**Standing obligations.**

- **The request ceiling is per issuer, not per pass** — the refresh sweep and a
  member tapping Save draw on the same allowance, so a backlog must never be
  allowed to starve somebody standing at a counter
- **Rotating `WALLET_PASS_KEY` invalidates every pass** — nothing re-seals the
  rows today, so a rotation is a re-issue for every member who holds one ❓ who
  owns that runbook
- **A pass Google cannot be told about stays owed** — the sweep counts its
  backlog's depth and its age together, and the age is the one to alarm on
:::

## Histories

A member's activity is their own ledger, in their own words, with the
operator's reason, retry keys and the pricing behind an entry kept out of view
([[grade10-site-loyalty-programme-SC-59]], [[grade10-site-loyalty-programme-SC-60]]).

| Entry | Meaning |
| --- | --- |
| Points earned | A purchase, or a campaign grant |
| Points spent | A reward redeemed |
| Points put toward a purchase | Points paid against a bill |
| Points expired | The balance lapsed |
| Points added, Points taken off | An operator's correction |
| Points revoked | A refund's claw-back |
| Points returned | A reversal |

Beside it sit the redemptions — each with its outcome — and the card's own
history: the last twenty presentations and, for each one a till took, where
and when. An identification the member did not present for, by email at the
counter, notifies them the moment it happens.

## What a member never sees

An operator's reason, a retry key, the fulfilment attempts behind a code, who
settled or reversed something, stock counts, and anyone else's anything. The
member's surface takes no user id; it reads the session. A member's identity
lives in the identity system and never in the programme, which holds only an
opaque user id.

:::callout{kind="warning"}
Two things decided for this surface are not built, and one is built but not
switched on.

- **The wallet pass** — built, and offered to nobody: the issuer account, its
  class and its keys do not exist yet, so the save action stays hidden until
  operations stands them up
- **The welcome bonus** — the deployed programme grants none
  (`revise-loyalty-programme-rules`)
- **Account deletion** — the ledger has no account-deletion pass
  (`revise-loyalty-programme-rules`)
:::

:::callout{kind="note"}
No Figma frame exists for any membership surface. The `@grade10/ui` blocks —
`MembershipSummary`, `MemberCard`, `RewardMenu`, `CouponList`,
`PendingCollectionList` and `ActivityList` — and their stories are the visual
record.
:::

## Journeys

::journeys{id="grade10-site/loyalty/programme"}

::cases{id="grade10-site/loyalty/programme"}

:::detail{title="For engineers" for="engineer"}
The page is `apps/frontend/grade10/src/pages/membership` composing the
`@grade10/ui` blocks over `@grade10/loyalty-frontend`'s feature slices —
`member`, `offer`, `rewards`, `spending` — installed through the app's DI
container. Joining calls the store worker's `membership.join`, not loyalty's
`me.enroll` directly, so enrolment and pairing land together. The card is the
store's too: `membership.presentCard` mints a `pos_handles` row, storing only
the QR token's digest, and `membership.presentations` reads the history. The
wallet rides the same slice: `membership.addWalletPass` mints a `pos_passes`
row whose rotating secret is sealed under the worker's own key, the till spends
one of its codes by inserting `(pass, period)` under a unique index, and the
store worker's cron keeps every pass current from a digest of what it last
sent. The loyalty `me.*` surface answers summary, history, redemptions, redeem,
quote, undo and enrol, all off the session.
:::
