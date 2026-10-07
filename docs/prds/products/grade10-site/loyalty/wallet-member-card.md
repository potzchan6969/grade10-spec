---
title: Member Card in a Wallet
spec: grade10-site/store/wallet-member-card
order: 8
---

## Wallets

| Wallet | Code | Identifies | Spends and collects | Offered |
| --- | --- | --- | --- | --- |
| Google | Made on the phone from a secret the pass holds · rotates · one use | Every visit, no signal needed | Yes | 🚧 Yes, once every Google step of [Setting Up](#detail-setting-up) is done |
| Apple | Made by Grade10 and printed into the pass · never changes | Every visit, no signal needed | No — the member opens the card on the site; fixed in code, not a switch | 🚧 Yes, once every Apple step of [Setting Up](#detail-setting-up) is done |

A pass is a rendering of the member card, never a second source of it. What
it solves is distribution: a code that has to be fetched cannot live on a lock
screen, and a card shop with a metal roof does not always have signal. Apple
gives a phone no way to make a code, so the Apple pass carries a durable one
and is made safe by what a session opened from it may not do. A photographed
Apple code identifies and moves nothing.

- **Apple's code never rotates** — a pass that stopped updating would stop
  identifying, a second window would rescue nobody because the horizon is the
  last successful fetch rather than the outage, and a boundary would make the
  whole fleet due at once; the exposure is bounded instead by the Apple
  session spending nothing
- **No NFC** — in either wallet: no certified reader at the counter, and Apple
  needs an entitlement besides
- **Nothing else on the pass** — no offers, stamps or messages
- **No pass for ZZZ** — it runs no till
- **A missing secret refuses loudly** — adding a pass on a wallet not fully
  configured names the missing secret, rather than issuing one nobody can
  read
- 🚧 **The launch check names what is missing** - `pnpm run secrets --check`
  fails, naming each missing secret, where `packages/app-env` records a
  wallet's issuer for the brand and environment and one of that wallet's
  secrets is unset. It reports no wallet secret missing wherever no issuer is
  recorded: a brand that issues no pass, and Grade10 before its issuer is
  recorded. Where the Apple issuer is recorded and the environment binds no
  `WALLET_APPLE_APNS` client certificate, it also expects
  `WALLET_APPLE_APNS_KEY` and the issuer's APNs key id, since a pass that
  cannot be pushed is never offered

## On the Pass

- **Shows** — the member's name, the tier they hold, and the points they can
  spend
- **Language** — the membership page's own words, in every language the site
  speaks; the phone picks, and a phone set to none of them reads the brand's
  default, English for Grade10
- **Apple note** — the pass says "Identifies you at the counter. Points are
  spent from this page.", so a pass that identifies and cannot spend never
  reads as broken

## Adding and Ending

- **Three states** — live, ended or erased; only a live pass identifies
  anybody
- **From `/membership`** — the member adds a pass from their own page
- 🚧 **The save action's look** - each wallet's own artwork: Apple's "Add to
  Apple Wallet" badge and Google's "Add to Google Wallet" button, as both
  vendors' brand guidelines expect
- **One per wallet** — added and ended independently of the other
- **A new pass replaces the old** — adding a second pass to a wallet already
  holding one ends the earlier pass first
- **Ending** — immediate; the vendor's own copy is discharged by the sweep
- **Removing it is not ending** — deleting the pass from the phone's wallet
  app changes nothing about the membership
- 🚧 **Operator ending** - for a member whose phone is gone. An operator
  holding `store:write` ends one wallet's pass from the member's record, which
  names the wallets the member holds, and confirms the wallet first. It ends
  at once, as the member's own does, and the member is sent no message. It
  ends the pass the wallet holds when the operator confirms, a pass the member
  added after the record opened included. The
  audit trail records who ended which wallet and when. An ending that finds no
  live pass ends nothing, the record says no pass was held, and the audit
  trail records the attempt as ending nothing. Without `store:write` the record
  names no wallet and offers no ending, and a request for either is refused. A
  record whose wallets cannot be read says so and offers no ending, never that
  the member holds none
- **Welcome message** — carries no save action, in either wallet
- **Erasure** — the row stays, armed and empty; the secret goes, so a device
  fetching the pass sees nobody. Google is told; Apple keeps no copy

## Staying Current

| Rule | Value |
| --- | --- |
| Lap | **Every 5 minutes** |
| Floor | **Every pass read at least once in 24 hours** |
| Order | **Changed passes first** — the sweep reads the programme's ledger and tier log and brings those passes forward — then each wallet's refresh, then what the vendor is owed |

- **A spend or an earn reaches the pass on the next lap**
- **A dormant pass** — read once a day, and sends nothing
- **An unrecorded change is still on time** — points expiring, a tier term
  ending or an invitation lapsing marks the pass due that instant, not on the
  daily floor
- **A burst of changes costs one update** — a pass is sent only when what it
  shows has moved
- **A lap that falls behind reports it** — how deep the backlog is, and how
  old its oldest pass is

:::detail{title="Setting Up" for="operator"}
Nobody can be offered a pass until the wallet's own account exists, and none
of it is same-day.

### Google

In this order, because each step needs the one above it:

1. *Operations* — **Create the issuer account** in the Google Pay & Wallet
   Console. It opens in Demo Mode, which issues only to accounts named on it,
   so the counter can be rehearsed before the public can save anything
2. *Operations* — **Complete the Business Profile and the payments profile**.
   Publishing access is refused without both, and the refusal names neither
3. *Operations* — **Request publishing access**. A Google review with no
   published turnaround: start it the day the issuer exists
4. *Design* — **Give the class its artwork and words**: the programme's logo,
   the issuer's name, the programme's name, and one background colour. A class
   with none of these is what a member sees on their lock screen
5. *Operations* — **Create the class** and carry it from draft through review
   to approved. A draft class issues to nobody real
6. *Engineering* — **Create the service account**, grant it the wallet issuer
   scope, and take its key as unencrypted PKCS#8. The workers refuse PKCS#1
   and an encrypted key by name
7. *Engineering* — **Set the two secrets** with `pnpm run secrets`:
   `WALLET_GOOGLE_SERVICE_ACCOUNT_KEY`, and `WALLET_PASS_KEY`, which seals
   every pass secret at rest
8. *Engineering* — **Record the issuer, the class and the service account** in
   `packages/app-env`. None of the three is a secret, and all three appear in
   every save link a member opens. Until the issuer and both secrets are set,
   no save action is drawn
9. *Design* - **Draw the save action as Google's own "Add to Google Wallet"
   button**, which Google's brand guidelines expect -
   [the save action's look](#adding-and-ending)

### Apple

Only `WALLET_PASS_KEY` is shared with Google: a brand carrying both wallets
seals both their secrets under the one key. In this order:

1. *Operations* — **Enrol in the Apple Developer Program** in the
   organisation's name. A pass type identifier belongs to a team, and the
   enrolment is the slow step: a D-U-N-S number and a legal-entity check,
   weeks rather than days
2. *Operations* — **Name the account's owner by role, not by person.** Only
   the Account Holder and Admins can create certificates, so a personal Apple
   ID here is a yearly rotation nobody can perform after a departure
3. *Operations* — **Register two pass type identifiers**, staging and
   production. Sharing one means a staging push updates a production member's
   pass, and pass pushes are production-only
4. *Design* — **Give the pass its artwork and words**: the icon and logo at
   every scale, the programme's name, and the background and label colours. A
   pass with none of these is what a member sees on their lock screen
5. *Engineering* — **Fix the pass web service's hostname before the first pass
   exists.** It is written into every pass and cannot be changed afterwards, so
   a pass issued against the wrong name can never be updated again
6. *Engineering* — **Take the certificate and its key**, converting the key to
   unencrypted PKCS#8, the only form these workers import, and keep both where
   they can be retrieved: Workers secrets are write-only and a lost key means
   starting over
7. *Engineering* — **Create the APNs key** for the same team, scoped to the
   pass type identifier, and record its key id. A team-scoped key pushes to
   every app under the team, and nothing here needs that. It never expires,
   and rotating it for another app takes the wallet down with it. A brand pushing by client certificate instead
   sets no key and binds `WALLET_APPLE_APNS` for mTLS; no deployment
   declares one
8. *Engineering* — **Set the secrets** with `pnpm run secrets`:
   `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_APPLE_APNS_KEY`,
   `WALLET_PASS_AUTH_KEY` — which derives every pass's authentication token —
   and `WALLET_PASS_KEY` only where Google has not already set it, never a new
   value once a pass exists. Then **record the pass type
   identifier, the team id, the APNs key id and the organisation name Wallet
   shows as the issuer** in `packages/app-env`. A certificate with no
   `WALLET_PASS_AUTH_KEY` draws no save action at all
9. *Engineering* — **Prove it on a physical iPhone.** The Simulator takes no
   push token, never registers, and never receives an update. Name whose phone,
   and where it lives. Two things only this settles: which credential a pass
   push takes — Apple documents the pass certificate, the shipped default is a
   key, and `TopicDisallowed` on the push counter decides it — and whether
   `apns-push-type: background` is right for a pass topic, which Apple pins to
   a bundle id and may drop silently on a mismatch. Push to the one enrolled
   device three ways — as shipped, with the header omitted, and over the
   certificate — and record which produces a list request, not which returns
   200
10. *Design* - **Draw the save action as Apple's own "Add to Apple Wallet"
    badge** - [the save action's look](#adding-and-ending). It is licensed
    only while the organisation is an Apple Developer Program member, and
    downloaded from the developer site under the Wallet Marketing Agreement

### Launch Check

- *Engineering* - **Run `pnpm run secrets --check`** against the deployed
  workers, after the last step for each wallet. It names what that wallet
  still lacks - [Wallets](#wallets)

### Standing Obligations

- **Request ceiling** — per issuer, not per pass: the refresh sweep and a
  member tapping Save draw on the same allowance, so a backlog must never
  starve somebody standing at a counter
- **Key format** — `WALLET_PASS_KEY` and `WALLET_PASS_AUTH_KEY` are each at
  least 32 random bytes, base64 (`openssl rand -base64 32`); a shorter one, or
  a phrase, is refused by name at the first read
- **`WALLET_PASS_KEY` rotation re-issues every pass** — nothing re-seals the
  rows, so a rotation is scheduled as the re-issue it is
- **`WALLET_PASS_AUTH_KEY`, the pass type identifier, the team id and the web
  service host never rotate** — each is written into every pass, so a change is
  a new pass for everybody. Apple forbids changing a pass's authentication
  token, and under a new key every phone is refused with 401, silently
- **Debts** — Google confirms an ending or an erasure, and the sweep names the
  debt until it does; Apple keeps no copy, so there is nothing to confirm
- **The Apple certificate expires yearly, silently** — passes already on phones
  keep scanning, because the code is durable and the counter reads the pass's
  own secret; what stops is signing
- **Every fetch and save then answers 503** — counted as
  `store.wallet.apple.{fetch,saved}{outcome:unsignable}`, while the pushes that
  woke those devices still answer 200. A 503 rather than a 401, because the
  device's token is good and a refusal that blames it is one a renewal may not
  undo
- **`store.wallet.apple.cert_days_left`** — the gauge to alarm on, reported on
  every lap that sweeps a wallet at all; a brand with a certificate but no APNs
  key sweeps nothing, so it reports nothing
- **`store.wallet.apple.cert_unreadable`** — counts a certificate that will not
  parse, and stops there rather than taking the other wallet's lap down with it
- **Renewal** — Engineering owns the calendar; renewing is the certificate, key
  and secrets steps run again against the same identifiers
- ❓ **A second brand issuing** - its own pass type identifiers and
  certificate, since a certificate is bound to its pass type identifier.
  Whether it enrols under the same Apple Developer team, and so shows the same
  organisation name, is Product's call

Pushes with no fetches is the signal to act on: APNs answers 200 for a device
that then does nothing, so which `store.wallet.apple.*` counter stops is what
names the fault.

| Counter | Means |
| --- | --- |
| `push{outcome:delivered}` climbing, `list` flat | The pass web service is unreachable, or its hostname is not the one written into the passes |
| `fetch{outcome:refused}` climbing | The `reason:` tag names it — `token` is a rotated `WALLET_PASS_AUTH_KEY`, `unconfigured` a missing `WALLET_PASS_KEY`, `pass_type` a deployment answering for passes that are not its own |
| `fetch{outcome:unsignable}` climbing | The certificate is past its expiry, or its key or artwork will not load |
| `push{outcome:refused}` or `push{outcome:gone}` | The topic, the provider key, or a dead device token. Which of the three is in the worker log, not on the tag; a wrong topic deletes every registration it touches |
| `list` quiet | Every refusal is the same 204, deliberately, so read it against the fetch rather than on its own |
:::

:::detail{title="Code map" for="engineer"}
- **Wallet service** —
  `packages/grade10-store/backend/src/services/wallet`
- **Sweeps** — `packages/grade10-store/backend/src/sweeps/wallet.ts`,
  `walletRefresh.ts`, `walletChanges.ts`, `walletExpiry.ts`
- **Pass building** — `packages/wallet-pass`
- **Secrets** — `packages/grade10-store/backend/src/secrets.ts`; the issuer,
  class and pass identifiers in `packages/app-env`
:::

:::detail{title="Product decisions" for="pm"}
A member at the counter is identified from the lock screen, with no sign-in
and no signal. A pass that still identifies somebody after the phone is gone
is a credential nobody can take back, so it ends at once, by the member or by
an operator.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Member | At the counter, no signal | Identified from the lock screen |
| Member | Phone gone, own page out of reach | The pass on it stops identifying them, and a new one is a tap away |
| Operator | A member asks for the lost phone's pass to be ended | Ends the wallet the member holds, without asking them to remember which |

**Not in scope.** NFC. Anything on the pass beyond the card. Spending or
collecting from an Apple pass. A save action in the welcome message. A pass
for ZZZ.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Passes saved | Passes saved per week, per wallet, once that wallet is enrolled | Product |

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Operator ending's grant | Decided | `store:write`, the grant that already shows any member's live till code from the same record. Ending a pass is less than handing out a code, and the member adds a new pass in a tap. Staff hold it, as well as admins | Product |
| Which pass an operator ends | Decided | One wallet per act, from the wallets the record names. A wallet the operator guessed ends nothing, while the real pass goes on identifying the member | Product |
| Reason for an operator ending | Decided | None typed. The cause is always the lost phone, the act moves no value, and the member adds a new pass in a tap | Product |
| Message to the member | Decided | None. The member asked for the ending, and their own page shows the wallet no longer held | Product |
| Ending on one's own record | Decided | Allowed. Their own page ends it anyway, and an ending widens nothing | Product |
:::
