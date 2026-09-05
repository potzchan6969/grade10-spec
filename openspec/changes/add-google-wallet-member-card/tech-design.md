# Phone wallet member card — technical design

How the wallet pass lands on the till gateway that already exists. The
motivation is in [`proposal.md`](proposal.md); this holds the choices an
engineer would otherwise have to make twice.

## Context

- **The card is untouched** — `pos_handles` still mints a single-use code per
  presentation, the typed fallback keeps its alphabet and its per-shop pause,
  and the till's arms, session and capability table stay as they are
- **A pass carries its own code** — Google regenerates the barcode on the phone
  from a secret held in the pass object, so nothing is fetched at the counter
  and nothing expires while a member queues
- **The store worker already sweeps** — `*/5 * * * *`, four isolated passes,
  each reported whatever the others did
- **Balance and tier are queries, not columns** — both resolve against the
  instant asked, so a lot reaching its expiry and a tier term ending change what
  a member sees with no row written anywhere

## Decisions

### The pass is its own identification arm

- **`pass` joins the five arms**, but what it may do is the wallet's, not the
  arm's. A code the member's own phone made for one period identifies, spends
  and collects, as a scanned card does. A code the programme printed into the
  pass identifies and nothing else, with no switch that could widen it
- **Only one of them proves the member's device was present** — a rotating code
  is made on that device from a secret only it and the programme hold, so it
  belongs beside `qr` and `code`. A durable code proves the pass reached a
  phone once and nothing about who holds it now, so every scan of one notifies
  the member
- **Why an arm and not a payload shape** — the arm is the dimension the session
  row, every audit row and every `store.pos.*` metric already carry, so counting
  arrivals by pass is free. Routing inside `qr` would leave the wallet's share
  unmeasurable, which is the mistake this change exists to avoid
- **It is not throttled**, for the reason `qr` is not: a rotating code is
  unguessable, bound to a period and dead once used, and a durable one is a
  128-bit proof. The per-pass guess cap holds the rotating code alone — on a
  durable one it would buy no bits and would let anybody who photographed a
  barcode pause the member's own card

### The payload names itself, its pass, and its period

Two schemes, because the two wallets carry different codes. The prefix names
which, so a reader knows how to parse before it looks anything up — and so a
rotating code retyped under the durable prefix is refused by shape.

- **`G10P.<pass>.<period>.<code>`** — four fields, the rotating code Google's
  device derives
- **`G10A.<pass>.<proof>`** — three fields, the durable code the programme
  prints into an Apple pass. The pass row is the only authority on which
  scheme it carries

- **`G10P.`** — a counter scanning goods is discarded before any lookup, so an
  ordinary barcode never reaches the gateway or a metric
- **`<pass>`** — which pass to verify against, so the secret is found in one
  indexed read; opaque, carrying no member fact, and never the member's own
  code
- **`<period>`** — the counter the code was made for, so verification checks
  three candidates rather than searching a window
- **`<code>`** — the digits the device derived

Google's `valuePattern` takes literal text beside its substitutions, so the
whole payload is expressible in the object.

### Single use is a conditional update, not a check

- **A use moves `last_period` forward** on the pass — the update is the
  guarantee, the way the guarded claim is for a presentation
- **Zero rows back is the refusal**, so two tills scanning one screen at the
  same instant open exactly one session between them
- **Monotonic, not per-period** — the window is three periods wide, so a ledger
  keyed on the period would let a photograph of the code before last spend after
  the member's own scan. Only ever forward closes that
- **No second table**, and nothing that grows per scan: what a session was
  opened by is already on the session row, under provenance `pass`

### The secret is encrypted, because it must be recoverable

- **Three readers need it back**, so a one-way digest cannot serve: the
  counter verifying a presented code, the sweep deriving an Apple pass's
  barcode, and every device fetch that rebuilds one. Issuing needs none of
  them — a re-issue mints a fresh secret — so the argument is the readers,
  not the mint
- **AES-GCM under one worker secret**, held in the store worker's secret list
  beside the POS app's
- **Rejected: deriving it from a member key.** The programme would still hold
  the deriving key in the same worker, so it buys nothing over encryption and
  costs a second thing to rotate

### Currency is a sweep over a digest, and the row schedules itself

- **The pass row stamps its own next due instant** from what the last read
  returned — the earlier of the tier term's end and the balance's expiry, both
  of which the programme's summary already answers
- **A kick on write** marks a member's passes due inside the transaction that
  changed them; failure is logged, never thrown, because the sweep is the
  guarantee and the kick only accelerates it
- **A digest decides whether anything is sent** — everything the pass shows,
  hashed, so
  a re-read that finds nothing moved costs no wallet call, and a burst inside
  one interval costs one update by construction
- **A 24-hour floor** catches a bug in either arm
- **Rejected: events.** No event exists for the two most common changes
- **Rejected: a blind interval sweep.** Every pass re-read every interval is
  work proportional to holders rather than to change, and its honest deadline is
  a full lap rather than the interval

### Ending a pass is a state flip

The row stays. It is what lets the object be expired at Google afterwards, what
erasure walks, and what stops a pass reference being reissued.

### The list cursor advances, and cannot be made to advance in commit order

A device asks what changed since a tag it echoes back, and that tag is a
sequence. Postgres hands out a sequence value before the transaction commits,
so two writers can commit out of order and a device that lists in between
records the higher tag and never hears about the lower one.

Left as it is, on purpose. Every allocation that could lose an update is inline
in its own statement, so the window is one statement's commit latency, and it
needs a device holding two passes that both move inside it. The pass self-heals
on its next change. Every correct fix — a transaction-id cursor, an
advisory-locked counter — costs a migration and a reader rewritten to tolerate
duplicates, which is more than the exposure.

What the cursor cannot be replaced by is `updated_at`: an HTTP date carries one
second, and two writes inside one second are indistinguishable. That is why the
conditional pass fetch was removed rather than repaired, and why the sequence
stays.

## Database schema

Four new tables in the store's schema, and one sequence. Both brands'
migrations create them; only a brand with a till fills them, which is what
`pos_handles` already does. The three beyond `pos_passes` exist for Apple
alone, whose devices pull rather than being pushed to, so we hold who asked.

```
account (auth)
   └── pos_passes             one per pass a member holds
        └── pos_pass_registrations   which device holds which pass
             └── pos_pass_devices    where to wake each device
pos_pass_push_tokens          the APNs credential, one row per key
```

### `pos_passes`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `text` | no | — | primary key; the pass reference in the payload and the wallet object's id |
| `user_id` | `text` | no | — | the member |
| `platform` | `text` | no | — | `google` or `apple`; a CHECK rendered from the list, so a third is a migration and a decision |
| `secret_ciphertext` | `text` | no | — | the secret both schemes run over, AES-GCM |
| `secret_nonce` | `text` | no | — | its nonce |
| `state` | `text` | no | `'live'` | `live`, `ended`, `erased`; a CHECK |
| `rendered_digest` | `text` | yes | — | everything last sent, hashed; null until the first send |
| `rendered_at` | `timestamptz` | yes | — | when they were read |
| `due_at` | `timestamptz` | no | `now()` | when to read again — the sweep's only ordering |
| `attempts` | `integer` | no | `0` | rungs spent on the current failure |
| `next_attempt_at` | `timestamptz` | yes | — | the backoff's own instant |
| `last_error` | `text` | yes | — | what the wallet last said |
| `created_at` | `timestamptz` | no | `now()` | |
| `ended_at` | `timestamptz` | yes | — | set once, with `state` |

- **Keys and indexes** — `uq_pos_passes_live_member` on `(user_id, platform)`
  where `state = 'live'`, so a member holds at most one live pass per wallet;
  `idx_pos_passes_due` on `(due_at)` where `state = 'live'`, the sweep's only
  scan
- **CHECK `ck_pos_passes_ended`** — `(state = 'live') = (ended_at is null)`, so a
  row cannot claim to be live and carry an ending
- **`last_period`** — the single-use guarantee, a conditional update rather
  than a read. Monotonic, so a photograph of the code before last cannot spend
  behind the member's own scan while both are inside the window
- **`idx_pos_passes_expiry_owed`** on `(next_attempt_at) where state <> 'live'`
  — the expiry arm's scan. A non-live row with an attempt stamped is a copy the
  vendor still holds, so the debt needs no column of its own
- **Authoritative** — the secret, the state, and the digest. What a pass shows
  is read from the programme at send time; the digest is what decides whether
  it moved, and the rendered fields beside it are what a device's own fetch is
  answered from
- **`pos_pass_cursor`** — how far the sweep has read the programme's change
  logs. No row is the seeding case: a first lap is told today's high-water mark
  rather than replaying a programme's whole history onto passes the daily floor
  already covers

## Service interfaces

All of it lives beside the till gateway's other writes, in `services/pos`.

| Function | In | Out |
| --- | --- | --- |
| `issuePass` | member | the pass reference and the secret its phone will use |
| `verifyPassCode` | the scanned payload | the member and the period, or `expired`, `used`, `paused`, `not_found` |
| `spendPassCode` | the pass, the period | whether this caller is the one that spent it |
| `endLivePasses` | member | the rows it ended, each now owing the vendor a call |
| `erasePasses` | member | the rows it stripped, each now owing the vendor a call |
| `runWalletRefresh` | the sweep's dependencies | what it read, sent and skipped |
| `runWalletExpiry` | the sweep's dependencies | what it filed away, and what is still owed |

### `verifyPassCode` — the hot path

1. **Shape first** — a payload without the prefix returns `not_found` before any
   read, so a scanned product never becomes a lookup
2. **The period the payload names**, against the server's, before any secret is
   touched
3. **One indexed read** on the pass reference; a row not `live` answers
   `not_found`, never why
4. **A guess cap** — ten wrong codes in five minutes and the pass stops
   answering. The code is six digits and the reference travels in cleartext in
   every barcode, so the cap is what stands between a photographed reference and
   an offline search
5. **Candidate periods** — the claim's neighbourhood intersected with the
   server's, so a device that names a period cannot widen the window; verified
   against the decrypted secret in constant time, none matching answers
   `expired`
6. **The spend, inside the session's own transaction**, beside the guarded
   handle claim: `last_period` moves only forward, and zero rows back answers
   `used`

The spend is last for the reason the guarded claim is: a presentation is never
burned by a failure downstream of it, so a programme that could not be read
leaves the member's next scan working.

### `runWalletRefresh` — one lap

0. **Pull** the members the programme recorded a change for since the cursor,
   and bring their passes forward — before the claim, so a change lands in this
   lap rather than the next
1. **Claim** the due rows oldest first, `for update skip locked`, counting the
   attempt and pushing the next one out one rung
2. **Read** the facts for the claimed batch in one call to the programme —
   `memberStanding`, not the counter's panel, under a grant that carries
   nothing else
3. **Digest** them; equal, stamp `rendered_at` and the next `due_at` and send
   nothing
4. **Send** the difference to the wallet, then stamp
5. **A crash between claim and stamp** leaves the row due, so the next lap
   re-reads and re-sends — the wallet is last-writer-wins on a pass's contents,
   so sending twice is a wake-up, not a fault

## Contracts

- **`membership.walletPass`** — a mutation, because it writes the pass row;
  answers the address that saves it
- **`membership.endWalletPass`** — a mutation on the member's own pass
- **The till's identify input gains `passCode`**, the fifth field beside
  `qrToken`, `shortCode`, `email`, `phone` and `customerId`
- **An operator gains `endWalletPass`** under the permission an elevated act
  requires

Nothing else on the wire changes.

## The Apple pass

### Its code is durable, and the arm is what makes that safe

PassKit has no rotating barcode and no prospect of one: `barcodes[].message` is
a fixed string, `semantics` and `relevantDates` only decide when a pass
surfaces, and NFC's message is static too. A pass changes only by fetching a
new one over the network — and Wallet **throttles a pass that updates too
often and disables its automatic updates**, which a member may also switch off
per pass. So code freshness is not ours to control, and a design resting on it
would be dishonest for some share of the fleet.

The consequence that decides everything: **a code's lifetime and a member's
offline window are one number.** Shorten the code's life and you refuse a
member whose phone has not caught up — at a counter, which is where the pass
exists to work.

So the code is durable, exactly as the reversed non-goal feared, and the fear is
answered by removing the right rather than by claiming freshness. An Apple
session reads the panel; it spends nothing and collects nothing. `collect` is
excluded deliberately and is the sharper of the two — `markCollected` hands over
a reward the member has already paid points for, and the pending collections
arrive in the identify answer itself, so leaving it would make theft self-serve
in one round trip.

### The payload names its scheme, and the scheme is checked against the row

Apple's payload is `G10A.<reference>.<mac>` — three fields, where
`mac = base64url(HMAC(passSecret, reference)[0..16])`. A pure function of the
row's id and its secret, so it never moves, and a reference leaked from a log or
a support screenshot is still not a credential.

The prefix selects **the parse and only the parse**. The verification policy
comes from the row's `platform` after the lookup, and a payload whose scheme
disagrees with its row is refused. Without that rule the two schemes are
interchangeable — both call the same `passCodeFor`, so a photographed Google
payload retyped under the other prefix would skip the clock gate and replay
forever, since `lastPeriod` only advances on real spends.

Google keeps its cheap pre-lookup clock gate: the prefix makes the scheme
unambiguous, so nothing is given up.

### `spendPassCode` is not called for an Apple pass

Its monotonic guard is the single-use guarantee, and a durable code presents the
same value every visit — so calling it would refuse the member's second scan
ever. Apple is off that path by construction, not by a flag.

### The pass web service ships now, because `webServiceURL` is or-never

A pass with no `webServiceURL` can never be updated, and there is no channel to
deliver the fix over. But with a durable code nothing about the service is
safety-critical: it carries display freshness, so APNs down for a day is a stale
card rather than exposure.

Five endpoints, and their **auth is asymmetric**: register, unregister and
get-pass carry `Authorization: ApplePass`; the list endpoint and `/v1/log` carry
none — the list spans passes with different tokens, so the device library
identifier is the only shared secret it has. Requiring a token there makes
Wallet 401 at the list step and never reach the pass fetch, while APNs keeps
answering 200.

`passesUpdatedSince` is our own opaque tag, so it is drawn from one Postgres
sequence: `greatest(pass.updated_seq, registration.created_seq)`. A timestamp
loses ties, a per-pass counter cannot be maxed, and a max over pass rows alone
hides a pass a device has only just registered.

### `authenticationToken` is derived, because it can never be rotated

Apple permits updating anything on a pass **except** the authentication token
and the serial number. So it is derived rather than stored —
`HMAC(WALLET_PASS_AUTH_KEY, "apple-pass-v1:" + passTypeId + ":" + serial)` —
which leaves no second source of truth, nothing extra for erasure to clear, and
no way for a staging token to authenticate a production pass. The remedy for a
suspected leak is to end the pass and issue a new serial.

### Signing is ours, and it is proven

A `.pkpass` is a ZIP carrying `pass.json`, images, a **SHA-1** `manifest.json`
and a detached PKCS#7/CMS signature over it. Workers' WebCrypto has no CMS, and
node-forge and pkijs are both hostile to the runtime, so the DER is built here —
about 180 lines, WebCrypto only, verified against `openssl cms -verify`,
tamper-detecting, with the WWDR intermediate embedded as Apple requires. The ZIP
is store-only at about 70 lines; deflate would be equally valid, and this is a
choice rather than a format rule.

### Transport: token auth first, and the seam is a `Fetcher`

Apple documents pushing with the certificate that signed the pass; Apple's token
docs say a team key covers every topic in a team; nothing states which governs a
pass type id. So build the `.p8` path first — it is one secret — and keep the
certificate path as the fallback, which needs an mTLS binding in every
environment block of every brand.

The seam is a **`Fetcher`**, not a function: Cloudflare's mTLS binding exposes
`fetch(request) => Promise<Response>`, which is global `fetch`'s own signature,
so the whole credential difference is one field plus one optional header.

The provider JWT lives in a one-row table with a guarded update and a module
cache in front, because APNs refuses a token minted more than once per twenty
minutes and the store cron ticks every five.

## Risks / Trade-offs

- **[Publishing access is not granted before the counter opens]** → the port
  answers nothing until the issuer is recorded and its key is set, and the
  member's surface asks before it offers, so a brand carries the code with the
  action undrawn and turns it on the day the class is approved
- **[A member's phone clock drifts]** → one period either side of the server's,
  so a **60-second** period accepts a three-minute window. The payload names the
  period its phone made the code for, which spares two HMACs — but the accepted
  set is intersected with the server's own, so a named period buys tolerance and
  never widens it
- **[The wallet's request ceiling starves interactive saves]** → the lap cap
  and the cron's interval together hold the sweep well under any issuer's
  allowance, and one access token is held for its hour rather than minted per
  call, so a member saving a pass is never behind a tier review's backlog
- **[A tier review makes every pass due at one instant]** → the claim is capped
  per lap and ordered oldest-due-first, so the backlog drains across laps rather
  than one lap trying to carry it; depth and age are reported beside each other
  the way the programme's other backlogs are
- **[A leaked secret makes codes indefinitely]** → ending a pass is one action
  for the member and one audited act for an operator, and the secret reaches
  nothing but the wallet object
- **[An ended pass still renders on a phone]** → the till refuses its codes from
  the instant the state flips, so what the phone shows is cosmetic

## Migration plan

- **Two new tables**, created empty. No destructive statement, no backfill
- **The session's provenance CHECK widens** to accept `pass` — a widening never
  rejects a row that already exists, so the new constraint is added and the old
  dropped in one migration, and the old values stay accepted forever because
  sessions recorded under them must remain readable
- **No contract step.** Nothing is dropped by this change

## Open questions

- ❓ Whether a member may hold more than one live pass at a time. The schema
  admits one per wallet today; lifting it is an index change and no requirement
  moves
- ❓ Whether the sweep's batch cap and its limiter belong in the brand registry
  rather than in code, once a second brand carries passes
