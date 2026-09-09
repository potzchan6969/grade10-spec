---
title: Profile
spec: grade10-site/loyalty/programme
order: 6
---

A member runs their whole membership from one page at `/membership`: what they
hold, what they can spend it on, the rewards and codes they own, their own
history, and the card a till reads. Every section reads for itself, so a reward
catalog that failed to load is no reason to hide a balance.

## Joining

A member joins at `/join`, signed in. Grade10 asks for a mobile number as part
of joining — the number travels with the request, so a refused number enrols
nobody. One request enrols the member in the programme and seeds their Shopify
customer pairing behind the account; neither step waits on Shopify. A second
tap replays the first, so joining is safe to retry.
Someone whose purchases were recorded before they joined is invited to join
and shown the points already waiting.

## Membership page

| Section | What it shows |
| --- | --- |
| Summary | Tier, points to spend, points earned this year against the next threshold, when the tier renews, and when the points stay active until |
| Your member card | The QR the till scans, the short code beneath it, a countdown, and the actions that add the card to a phone wallet |
| Reward shop | The live catalog, priced in points, with what the balance affords |
| Spend on your basket | Points against the current basket — an offer of a code, or a pointer to checkout where the shop takes points there |
| Your rewards | Every coupon they hold, in full, with what it takes off and when it expires |
| Activity | The member's own ledger, each spend saying what became of what it bought |

Every date reads in the programme's own time zone.

::story{id="loyalty-membership-membershipsummary--default" title="Tier, balance and progress"}

## Member card

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

The same card, in Google Wallet or Apple Wallet, so it opens from a lock screen
instead of a sign-in.

- **Beside the code** — the member's name, the tier they hold, and the points
  they can spend, following their standing without them opening anything
- **In the phone's language** — the words beside them are the membership
  page's own, in every language the site speaks; the phone picks, and one set
  to none of them reads English
- **Google's code** — made on the phone itself, so it is scannable where there
  is no signal, changes on its own rather than being fetched, and identifies
  once
- **Apple's code** — made by Grade10 and printed into the pass, because Apple
  has no way for a phone to make one. So it never changes, and it scans on
  every visit whatever the signal
- **What an Apple pass may do** — identify, and nothing else. It cannot spend
  points and cannot collect a reward, because a code that never changes is a
  code anybody who photographs it keeps. A member doing either opens the card
  on the site, exactly as they do today
- **Holding both** — one pass per wallet, each ended on its own
- **Ending one** — the member ends a pass whenever they like and adds another.
  Ending it *for* somebody who has lost the phone is an operator act nobody can
  perform yet

:::detail{title="Standing up the wallet" for="operator"}
Nobody can be offered a pass until the wallet's own account exists, and none of it is
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
   scope, and take its key as unencrypted PKCS#8. The workers refuse PKCS#1 and
   an encrypted key by name rather than as an opaque import error
7. *Engineering* — **Set the two secrets** with `pnpm run secrets`:
   `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY`, and `WALLET_PASS_KEY`, which is this
   platform's own and seals every pass secret at rest
8. *Engineering* — **Record the issuer, the class and the service account** in
   `packages/app-env` — none of the three is a secret, and all three appear in
   every save link a member opens. Half a configuration offers nothing: the
   member's surface asks whether a wallet exists before it offers anything, so
   until the issuer and the key are both set no save action is drawn

**Apple**, in this order. Only `WALLET_PASS_KEY` is shared with Google — a
brand carrying both wallets seals both their secrets under the one key:

1. *Operations* — **Enrol in the Apple Developer Program** in the organisation's
   name. A pass type identifier belongs to a team, and the enrolment is the slow
   step: a D-U-N-S number and a legal-entity check, weeks rather than days
2. *Operations* — **Name the account's owner by role, not by person.** Only the
   Account Holder and Admins can create certificates, so a personal Apple ID
   here is a yearly rotation nobody can perform after a departure
3. *Operations* — **Register two pass type identifiers**, staging and
   production. Sharing one means a staging push updates a production member's
   pass, and there is no sandbox to separate them: pass pushes are
   production-only
4. *Design* — **Give the pass its artwork and words**: the icon and logo at
   every scale, the programme's name, and the background and label colours.
   A pass with none of these is what a member sees on their lock screen
5. *Engineering* — **Fix the pass web service's hostname before the first pass
   exists.** It is written into every pass and cannot be changed afterwards, so
   a pass issued against the wrong name can never be updated again
6. *Engineering* — **Take the certificate and its key**, converting the key to
   unencrypted PKCS#8 — the only form these workers import, and the one they
   refuse anything else by name — and keep both where they can be retrieved,
   because Workers secrets are write-only and a lost key means starting over
7. *Engineering* — **Create the APNs key** for the same team and record its key
   id. It never expires, and it is team-wide: rotating it for another app takes
   the wallet down as collateral. A brand pushing by client certificate instead
   sets no key and binds `WALLET_APPLE_APNS` for mTLS
8. *Engineering* — **Set the secrets** with `pnpm run secrets`:
   `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_APPLE_APNS_KEY`,
   `WALLET_PASS_AUTH_KEY` — which derives every pass's authentication token —
   and `WALLET_PASS_KEY`, shared with Google. Then **record the pass type
   identifier, the team id, the APNs key id and the organisation name Wallet
   shows as the issuer** in `packages/app-env`. Half a configuration offers
   nothing, the same way Google's does: a certificate with no
   `WALLET_PASS_AUTH_KEY` draws no save action at all
9. *Engineering* — **Prove it on a physical iPhone.** The Simulator takes no
   push token, never registers, and never receives an update. Name whose phone,
   and where it lives

**Standing obligations.**

- **The request ceiling is per issuer, not per pass** — the refresh sweep and a
  member tapping Save draw on the same allowance, so a backlog must never be
  allowed to starve somebody standing at a counter
- **Rotating `WALLET_PASS_KEY` invalidates every pass** — nothing re-seals the
  rows today, so a rotation is a re-issue for every member who holds one. The
  key must be at least 32 random bytes, base64 — `openssl rand -base64 32`.
  A shorter one, or a phrase, is refused by name at the first read rather than
  digested silently, and the same rule holds `WALLET_PASS_AUTH_KEY`.
  Engineering owns the rotation, scheduled as the re-issue it is
- **A pass Google cannot be told about stays owed** — the sweep carries two
  arms and reports both: what is stale, and what a member's ending or erasure
  still owes the vendor. Depth and age go together, and the age is the one to
  alarm on. An erasure names the debt until Google confirms it
- **An Apple erasure has nobody to confirm it** — Apple keeps no copy, so the
  debt is discharged by the pass identifying nobody and the devices it reached
  being forgotten. Nothing is left owed, because there is nothing left to ask
- **The Apple certificate expires yearly, and its expiry is silent** — passes
  already on phones keep scanning, because the code is durable and the counter
  reads the pass's own secret. What stops is signing: every device fetch and
  every member's save answer 503, counted as
  `store.wallet.apple.{fetch,saved}{outcome:unsignable}`, while the pushes that
  woke those devices still answer 200. A 503 rather than a 401, because the
  device's token is perfectly good and a refusal that blames it is one a renewal
  may not undo. The remaining life is on the
  `store.wallet.apple.cert_days_left` gauge on every lap that sweeps a wallet
  at all — a brand with a certificate but no APNs key sweeps nothing, so it
  reports nothing. A certificate that will not parse counts
  `store.wallet.apple.cert_unreadable` instead, and stops there rather than
  taking the other wallet's lap down with it. Engineering owns the calendar:
  the gauge is the alarm, and renewal is the certificate, key and secrets
  steps of standing the wallet up, run again against the same identifiers
- **Pushes with no fetches is the alarm worth waking somebody for** — APNs
  answers 200 for a device that then does nothing, so it is which
  `store.wallet.apple.*` counter stops that names the fault:
  - **`push{outcome:delivered}` climbing, `list` flat** — the pass web service
    is unreachable, or its hostname is not the one written into the passes
  - **`fetch{outcome:refused}` climbing** — the `reason:` tag names it:
    `token` is a rotated `WALLET_PASS_AUTH_KEY`, `unconfigured` a missing
    `WALLET_PASS_KEY`, `pass_type` a deployment answering for passes that are
    not its own
  - **`fetch{outcome:unsignable}` climbing** — the certificate is past its own
    expiry, or its key or artwork will not load, and every fetch answers 503. A
    pass served and then discarded by the phone is a broken chain instead
  - **`push{outcome:refused}` or `{outcome:gone}`** — the topic, the provider
    key, or a dead device token. Which of the three is in the worker log, not
    on the tag: an APNs reason is not a closed set, so tagging with it would
    be unbounded. A wrong topic deletes every registration it touches, after
    which the pushes stop too
  - **The list is the one that stays quiet** — its refusals are all the same
    204, deliberately, so a scanner cannot tell an unknown device from a
    foreign pass type. Read it against the fetch rather than on its own
- **`WALLET_PASS_AUTH_KEY` has no rotation** — Apple forbids ever changing a
  pass's authentication token, and the token is derived from this key, so a new
  one locks every phone out of the four addresses its pass comes back to.
  Registering, updating and fetching all 401, silently. The only remedy the
  format leaves is a new serial for everybody
- **The pass type identifier, the team id and the web service host have no
  rotation either** — each is written into every pass and changing one strands
  every pass issued. There is only a re-issue for everybody
:::

## Histories

A member's activity is their own ledger, in their own words, with the
operator's reason, retry keys and the pricing behind an entry kept out of view.

| Entry | Meaning |
| --- | --- |
| Points earned | A purchase, or a campaign grant |
| Points spent | A reward redeemed |
| Points put toward a purchase | Points paid against a bill |
| Points expired | The balance lapsed |
| Points added, Points taken off | An operator's correction |
| Points revoked | A refund's claw-back |
| Points returned | A reversed redemption, or a cancelled or refunded sale that points paid for |

Beside it sit the redemptions — each with its outcome — and the card's own
history: the last twenty presentations and, for each one a till took, where
and when. An identification the member did not present for, by email at the
counter, notifies them the moment it happens.

## Privacy

An operator's reason, a retry key, the fulfilment attempts behind a code, who
settled or reversed something, stock counts, and anyone else's anything. The
member's surface takes no user id; it reads the session. A member's identity
lives in the identity system and never in the programme, which holds only an
opaque user id.

:::callout{kind="warning"}
Two things decided for this surface are built and offered to nobody, and five
are not built.

- **The Google pass** — the pass, its rotating code, the counter that reads it
  and the sweep that keeps it current are built, and offered to nobody: the
  issuer account, its class and its key do not exist yet
- **The Apple pass** — built, and offered to nobody: the Developer Program
  enrolment, the pass type identifiers and the signing certificate do not
  exist yet. The artwork shipped is placeholder squares in the card's own
  background colour, which Design owes before the first pass reaches anybody
- **A spend reaching the pass** — nothing wakes the sweep when a member's
  standing moves, so a counter spend reaches a pass on the daily floor rather
  than inside the five minutes this page promises. It costs a Google pass a
  stale balance, and an Apple pass the same: durability protects the scan,
  never the facts, and only the facts a pass shows wait on this
- **Ending a pass for a member** — an operator cannot end a pass for somebody
  who lost their phone
- **The welcome message** — carries no save action, for either wallet
  (`add-google-wallet-member-card`)
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

:::detail{title="Code map" for="engineer"}
The page is `apps/frontend/grade10/src/pages/membership` composing the
`@grade10/ui` blocks over `@grade10/loyalty-frontend`'s feature slices —
`member`, `offer`, `rewards`, `spending` — installed through the app's DI
container. Joining calls the store worker's `membership.join`, not loyalty's
`me.enroll` directly, so enrolment and pairing land together. The card is the
store's too: `membership.presentCard` mints a `pos_handles` row, storing only
the QR token's digest, and `membership.presentations` reads the history. The
wallet rides the same slice: `membership.addWalletPass` mints a `wallet_passes`
row whose code secret is sealed under the worker's own key, the till spends a
rotating code by advancing the pass's own `last_period` in one guarded update —
no second table, and nothing that grows per scan — and the
store worker's cron keeps every pass current from a digest of what it last
sent. The loyalty `me.*` surface answers summary, history, redemptions, redeem,
quote, undo and enrol, all off the session.
:::

:::detail{title="Product decisions" for="pm"}
A member at the counter unlocks their phone, signs in, opens the membership
page and reads a code against a countdown with a queue behind them. The problem
is distribution rather than the code: a code that has to be fetched cannot live
on a lock screen, and a card shop with a metal roof does not always have signal.

Apple was ruled out once, on the ground that a pass there would mean a permanent
code. That ground is accepted rather than argued away — Apple genuinely has no
way for a phone to make a code, and Wallet disables automatic updates for a pass
that refreshes too often, so freshness is not ours to control. What changed is
the answer: the code stays durable, and it is made safe by what a session opened
from it may not do.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Member with an iPhone | At the counter, no signal | Scans from the lock screen and is identified, every visit. |
| Member spending points | Wants a reward at the till | Opens the card on the site; the Apple pass identifies but never spends. |
| Someone holding a photograph of a pass | At a counter | Is identified as that member and can move nothing. |
| Member carrying both wallets | Ends one | Keeps the other. |

**Not in scope.** Spending or collecting from an Apple pass — both stay behind a
switch that is off. NFC at the counter, in either wallet: no certified reader,
and Apple needs an entitlement besides. Offers, stamps or messages on a pass. A
pass for ZZZ, which runs no till. Any change to the card on the site.

**Measurement.** Share of counter identifications made from a pass, by wallet.
Identifications that expire or replay before staff scan them, which a Google
pass drives to zero. Apple identifications followed by a spend on the site's
card in the same visit — what the durable code costs a member, and the number
that would reopen this decision.

**Settled: the code does not rotate.** Rotating the proof on a slow window —
say thirty days, accepting the current and previous — would bound a
photographed barcode instead of leaving it good for the life of the pass, and
the machinery exists: the digest already covers the barcode, so a rotation
costs one push. It is not worth it, for three reasons worth recording so the
question is not re-derived. A pass that stops updating today shows a stale
balance; under rotation it **stops identifying**, and every reason a device
stops updating — automatic updates switched off, no re-registration after a
restore, Apple throttling the pass — becomes a dead card the member discovers
at a counter. The horizon is set by the last successful fetch rather than by
the outage, so a second window does not rescue an offline member, it only
chooses which thirty days they lose. And a boundary makes the whole fleet due
inside one floor period, which is the opposite of a sweep whose cost is
proportional to change. What does bound the same blast radius, at no such
cost: trim the Apple session's panel, since a session that cannot collect has
no use for a redemption id.

**Owed at enrolment.** Two things nothing here can settle without a real
device and a real Developer Program account:

- **Which credential a pass push takes** — Apple documents the pass
  certificate; the shipped default is a team-scoped key. `TopicDisallowed` on
  the push counter is the signal that decides it
- **Whether `apns-push-type: background` is right for a pass topic** — Apple
  pins that value to a bundle id, and documents that a mismatch may be dropped
  silently. Push to one enrolled device three ways — as shipped, with the
  header omitted, and over the certificate — and record which produces a list
  request, not which returns 200

Create the APNs key **topic-specific**, scoped to the pass type identifier: a
team-scoped one pushes to every app under the team, and nothing needs that.

**Risk.** An Apple pass that identifies but cannot spend is a worse pass than
Google's, and a member who does not know that reads it as broken. So the
surface says what the Apple pass is for rather than offering two
identical-looking buttons: *"Identifies you at the counter. Points are spent
from this page."*
:::
