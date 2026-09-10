---
title: Member Card in a Wallet
spec: grade10-site/store/wallet-member-card
order: 8
---

## Wallets

| Wallet | Code | Identifies | Spends and collects | Offered |
| --- | --- | --- | --- | --- |
| Google | Made on the phone from a secret the pass holds · rotates · one use | Every visit, no signal needed | Yes | 🚧 Issuer account, class and key pending |
| Apple | Made by Grade10 and printed into the pass · never changes | Every visit, no signal needed | No — the member opens the card on the site; fixed in code, not a switch | 🚧 Developer Program, pass type identifiers, certificate and artwork pending |

A pass is a rendering of the member card, never a second source of it. A
photographed Apple code identifies and moves nothing.

## On the Pass

- **Shows** — the member's name, the tier they hold, and the points they can
  spend
- **Language** — the membership page's own words, in every language the site
  speaks; the phone picks, and a phone set to none of them reads the brand's
  default, English for Grade10
- **Apple note** — the pass says "Identifies you at the counter. Points are
  spent from this page."

## Adding and Ending

- **From `/membership`** — the member adds a pass from their own page
- **One per wallet** — added and ended independently of the other
- **Ending** — immediate; the vendor's own copy is discharged by the sweep
- 🚧 **Operator ending** — for a member who has lost their phone; no console
  surface yet
- 🚧 **Welcome message** — carries no save action, in either wallet
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
   every save link a member opens. Until the issuer and the key are both set,
   no save action is drawn

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
7. *Engineering* — **Create the APNs key** for the same team and record its key
   id. It never expires, and it is team-wide: rotating it for another app takes
   the wallet down with it. 🚧 A brand pushing by client certificate instead
   sets no key and binds `WALLET_APPLE_APNS` for mTLS, which no deployment
   declares yet
8. *Engineering* — **Set the secrets** with `pnpm run secrets`:
   `WALLET_APPLE_PASS_CERT`, `WALLET_APPLE_PASS_KEY`, `WALLET_APPLE_APNS_KEY`,
   `WALLET_PASS_AUTH_KEY` — which derives every pass's authentication token —
   and `WALLET_PASS_KEY`, shared with Google. Then **record the pass type
   identifier, the team id, the APNs key id and the organisation name Wallet
   shows as the issuer** in `packages/app-env`. A certificate with no
   `WALLET_PASS_AUTH_KEY` draws no save action at all
9. *Engineering* — **Prove it on a physical iPhone.** The Simulator takes no
   push token, never registers, and never receives an update. Name whose phone,
   and where it lives

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
A member at the counter unlocks their phone, signs in, opens the membership
page and reads a code against a countdown with a queue behind them. The
problem is distribution rather than the code: a code that has to be fetched
cannot live on a lock screen, and a card shop with a metal roof does not
always have signal. Apple has no way for a phone to make a code, so the Apple
pass carries a durable one and is made safe by what a session opened from it
may not do.

| User | Situation | Desired outcome |
| --- | --- | --- |
| Member with an iPhone | At the counter, no signal | Scans from the lock screen and is identified, every visit |
| Member spending points | Wants a reward at the till | Opens the card on the site; the Apple pass identifies but never spends |
| Someone holding a photograph of a pass | At a counter | Is identified as that member and can move nothing |
| Member carrying both wallets | Ends one | Keeps the other |

**Not in scope.** Spending or collecting from an Apple pass — both are fixed
off in code, not behind a switch. NFC at the counter, in either wallet: no
certified reader, and Apple needs an entitlement besides. Offers, stamps or
messages on a pass. A pass for ZZZ, which runs no till. Any change to the card
on the site.

**Measurement.**

| Signal | Definition | Owner |
| --- | --- | --- |
| Share by wallet | Counter identifications made from a pass, against every counter identification, split Google against Apple | Product |
| Expired or replayed | Identifications that expire or replay before staff scan them; a Google pass drives this to zero | Product |
| Spend after an Apple identification | Apple identifications followed by a spend on the site's card in the same visit — the number that would reopen this decision | Product |

**The code does not rotate.** Rotating the proof on a slow window would bound
a photographed barcode, and the machinery exists: the digest already covers
the barcode, so a rotation costs one push. It is not taken, for three reasons:

- **A pass that stops updating would stop identifying** — today it shows a
  stale balance. Every reason a device stops updating — automatic updates
  switched off, no re-registration after a restore, Apple throttling the pass
  — would become a dead card the member finds at a counter
- **A second window rescues nobody** — the horizon is the last successful
  fetch rather than the outage, so it only chooses which days an offline
  member loses
- **A boundary makes the whole fleet due at once** — the opposite of a sweep
  whose cost is proportional to change

What bounds the same exposure at no such cost: trim the Apple session's panel,
since a session that cannot collect has no use for a redemption id.

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

The push key is created topic-specific, scoped to the pass type identifier: a
team-scoped key pushes to every app under the team, and nothing here needs
that.

**Risk.** An Apple pass that identifies but cannot spend reads as broken to a
member who was not told, so the surface says what it is for rather than
offering two identical-looking buttons.

| Item | Status | Decision | Owner |
| --- | --- | --- | --- |
| Which wallets | Decided | Google and Apple, on their own terms; the port names neither | Product |
| Google's code | Decided | Made on the device from a secret the pass carries, so it scans with no signal | Product |
| Apple's code | Decided | Made by the programme and durable; made safe by identifying only — it spends nothing and collects nothing | Product |
| One pass per wallet | Decided | Adding or ending in one leaves the other untouched | Product |
| How current | Decided | One lap behind, and a lap refreshes before it settles the vendor's debt | Product |
| Ending | Decided | Immediate, and by the member. 🚧 An operator's console does not end one yet | Product |
| Erasure | Decided | The row stays armed and empty; the secret goes, so no further code identifies | Legal |
| A second brand issuing | ❓ Open | Nothing is brand-specific in the package; the first brand asking decides the certificate handling | Product |
:::
