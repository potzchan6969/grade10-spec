# Google Wallet member card — technical design

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

- **`pass` joins the five arms**, with the same rights as a scanned card:
  identifies, spends, collects, no switch of its own
- **It proves the member's device was present** — a code is made on that device
  from a secret only it and the programme hold, so it belongs beside `qr` and
  `code` among the arms that need no lookup notice
- **Why an arm and not a payload shape** — the arm is the dimension the session
  row, every audit row and every `store.pos.*` metric already carry, so counting
  arrivals by pass is free. Routing inside `qr` would leave the wallet's share
  unmeasurable, which is the mistake this change exists to avoid
- **It is not throttled**, for the reason `qr` is not: a code is unguessable,
  bound to a period, and dead once used

### The payload names itself, its pass, and its period

`G10P.<pass>.<period>.<code>` — four fields, in that order.

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

### Single use is an insert, not a check

- **A use is a row** in `pos_pass_uses`, unique on `(pass, period)` — the
  insert is the guarantee, the way the guarded claim is for a presentation
- **A duplicate insert is the refusal**, so two tills scanning one screen at the
  same instant open exactly one session between them
- **Three periods are candidates** — the named one and one either side — and the
  row is inserted for whichever verifies

### The secret is encrypted, because it must be recoverable

- **Google needs it twice** — in the object at mint, and again when a member
  ends a pass and adds another — so a one-way digest cannot serve
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
- **A digest decides whether anything is sent** — four rendered facts hashed, so
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

## Database schema

Two new tables in the store's schema. Both brands' migrations create them; only
a brand with a till fills them, which is what `pos_handles` already does.

```
account (auth)
   └── pos_passes         one per pass a member holds
          └── pos_pass_uses   one per code a till accepted
```

### `pos_passes`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `text` | no | — | primary key; the pass reference in the payload and the wallet object's id |
| `user_id` | `text` | no | — | the member |
| `platform` | `text` | no | — | `google`; a CHECK, so a second wallet is a migration and a decision |
| `secret_ciphertext` | `text` | no | — | the rotating code's secret, AES-GCM |
| `secret_nonce` | `text` | no | — | its nonce |
| `state` | `text` | no | `'live'` | `live`, `ended`, `erased`; a CHECK |
| `rendered_digest` | `text` | yes | — | the four facts last sent; null until the first send |
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
- **Authoritative** — the secret, the state, and the digest. Everything the pass
  shows is read from the programme at send time and stored only as that digest

### `pos_pass_uses`

| Column | Type | Null | Default | Notes |
| --- | --- | --- | --- | --- |
| `id` | `text` | no | — | primary key |
| `pass_id` | `text` | no | — | the pass whose code was accepted |
| `period` | `bigint` | no | — | the counter the code was made for |
| `at` | `timestamptz` | no | — | when the till took it |
| `session_id` | `text` | yes | — | the session it opened |

- **`uq_pos_pass_uses_period`** on `(pass_id, period)` — the single-use
  guarantee, enforced by the index rather than by a read
- **Append-only.** No column is ever updated

## Service interfaces

All of it lives beside the till gateway's other writes, under the directory
`check:libs` already pins.

| Function | In | Out |
| --- | --- | --- |
| `issueWalletPass` | member | the pass reference and the address that saves it |
| `verifyWalletCode` | the scanned payload, the instant | the member, or `expired`, `used`, `not_found` |
| `endWalletPass` | the pass, who ended it | the ended row, or a refusal it was already ended |
| `runWalletRefresh` | the sweep's dependencies | what it read, sent and skipped |
| `eraseWalletPasses` | member | what is still owed |

### `verifyWalletCode` — the hot path

1. **Shape first** — a payload without the prefix returns `not_found` before any
   read, so a scanned product never becomes a lookup
2. **One indexed read** on the pass reference; a row not `live` answers
   `not_found`, never why
3. **Three candidate periods** verified against the decrypted secret in constant
   time; none matching answers `expired`
4. **Insert the use** on `(pass, period)`; a unique violation answers `used`
5. **Then, and only then**, the session opens on the arm's capabilities

The insert precedes the session for the reason the guarded claim does: a throw
downstream of a consumed code would leave a member's code dead with no session
opened, which is also a plausible cover story for a replay.

### `runWalletRefresh` — one lap

1. **Claim** the due rows oldest first, `for update skip locked`, counting the
   attempt and pushing the next one out one rung
2. **Read** the four facts for the claimed batch in one call to the programme,
   capped so a lap stays inside one request's budget
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

## Risks / Trade-offs

- **[Publishing access is not granted before the counter opens]** → the save
  action sits behind the till's own flag registry, so a brand can carry the code
  with the action dark and turn it on the day the class is approved
- **[A member's phone clock drifts]** → one period either side of the named one,
  so a **60-second** period accepts a three-minute window; the payload names its
  period, so the tolerance is a constant and not a search
- **[The wallet's request ceiling starves interactive saves]** → the sweep holds
  its own limiter well under the issuer's ceiling, so a member saving a pass is
  never behind a tier review's backlog
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
