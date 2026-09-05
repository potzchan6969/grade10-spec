## Context

What the identity store already is, and what a hosted check has to fit into.
Motivation is the proposal; the requirements are the three delta specs.

- **The store is a worker nothing public reaches** — `grade10-e-kyc-service`,
  its own `ekyc` schema, its own R2 bucket, an hourly cron. No `routes`, and no
  `ServiceId` in `packages/app-env`, so the gateway cannot forward to it at all
- **Two tables and a purge queue** — `kyc_verifications` (one per check, keyed
  to the person), `kyc_case_bindings` (primary key `(product, case_ref)`, one
  identity per case), `kyc_capture_purges` (bytes still owed a delete)
- **Reached only over `KYC_SERVICE`** — a class factory mints one entrypoint
  per product, and that binding is what says which product a caller speaks for
- **The vault keeps a reference, never a copy** —
  `vault_cases.identity_verification_id` and `identity_bound_at`;
  `identity_release_pending_at` is the erasure debt
- **`recordCaseKyc` is already two-phase** — the RPC runs with no transaction
  open, then a short transaction takes the case row's lock, re-judges the
  case, voids any packet still out, and writes the reference; every id the
  locked row does not claim goes to the `identity_discards` outbox
- **doc-sign is the precedent for a library's tables** — `@grade10/doc-sign-backend`
  publishes a table factory and the vault instantiates it into its own
  schema, so a seal and the case event that records it commit in one
  transaction. The hosted check follows the same shape
- **doc-sign is the precedent for a token surface** — the ceremony mounts at
  `/api/sign` on the vault worker with no session middleware, and a 256-bit
  base64url secret whose digest is stored

## Goals / Non-Goals

Goals:

- **The store owns the vendor and the record** — the API key, the signing
  secret, the adapter, the verification row an approval produces, and the
  erasure of the vendor's copies
- **The product owns the check** — its row lives in the product's own
  database, so the case lock that judges a verdict decides the check in the
  same transaction: nothing is cached, leased across workers, or acknowledged
  back
- **One settle path** — the vendor's callback and the read-back list reach the
  same code, and neither reads the callback's body as fact
- **A deployment with no provider configured behaves as it does today** — the
  counter is unchanged and no case is stranded

Non-Goals:

- **No route on the e-kyc worker** — the collector's surface and the
  provider's callback mount on the vault
- **No vendor name in `packages/e-kyc/contracts`** — the provider is a port in
  the backend
- **No second erasure clock of Grade10's own** — a check that never became an
  identity is the vendor's standing window's to erase
- **No device binding of the invitation** — the vendor's session hands a
  check from one device to another; a Grade10 cookie only refused the phone
  the check had moved to

## Decisions

### The check is the product's row, from a factory the store publishes

- `@grade10/e-kyc-backend/checks` exports `createIdentityCheckTables(schema)`,
  the transition table, the queries over those tables, the invitation secret
  and its digest, and the view projections. The vault instantiates the table
  into `vault` as `identity_checks` and drizzle generates the migration there.
- The queries take `(db, tables)` rather than closing over a port, exactly as
  `voidOpenPackets(tx, SIGN_TABLES, …)` does. The flow — raise, start, settle,
  withdraw, the two work lists, the three routes — is the vault's, because
  every fact it needs is the case's: the email, the gate, the lock, the packet.
- **Transitions are data.** `CHECK_TRANSITIONS` is the spec's own "moves to"
  table, and `transition(tx, tables, id, to, set)` derives the guard from it,
  so a flow cannot invent a move and a settle racing a withdraw discards what
  it built rather than resurrecting a check somebody ended.
- Alternatives rejected:
  - A `kyc_checks` table in the store — every mechanism that bridged the two
    databases (a cross-worker lease, a staged verification id, an
    acknowledgment RPC, a cached state on the case with its own repair lane)
    existed only because the row and the lock were apart.
  - Columns on `kyc_verifications` — a check that expires, is withdrawn or is
    declined never becomes a verification, so it would have no row to live on.

### The store answers five hosted calls, and decides nothing about the case

| Method | Does |
| --- | --- |
| `raiseHosted({ idempotencyKey, personRef, invitationTtlMs, checkTtlMs })` | One create at the vendor, with the vendor's one-time link and its expiry windows minted in the same call; answers `{ reference, accountRef, hostedUrl }` |
| `resumeHosted(reference)` | A fresh one-time link, or null once the vendor no longer serves the check — the caller ends it |
| `settleHosted({ reference, caseRef, userId, raisedBy, at })` | Reads the check back, mirrors the vendor's status onto Grade10's states, and on an approval Grade10 accepts inserts the verification and binds it to the case; answers the state, the findings, and the record |
| `receiveVerdict({ rawBody, headers })` | Proves the signature and answers the reference the delivery names, or null |
| `redactHosted({ kind, ref })` | Queues an erasure of the vendor's inquiry or account |

- **`settleHosted` is idempotent on the reference.** A verification already
  holding `(provider, provider_ref)` — a unique index on `kyc_verifications` —
  is bound again without being judged again: the refusals ran when it was
  made, and a retry after the document expired must not decline a record
  already on file. The insert is `ON CONFLICT DO NOTHING` and reads the
  winner back.
- **Refusals before the fetch.** Age and validity are judged off the read-back
  before a byte of the document image is fetched; a declined collector's
  document never reaches the bucket. Whatever the vendor answered that the
  store cannot act on — a document class with no column, an approval missing a
  field, an image the bucket may not hold — is a `declined` answer with the
  reason, never a retry.
- **Nothing in a delivery's body is read as fact.** The route forwards the
  raw body and headers; the store proves the signature and answers only the
  reference; the vault settles by reading the vendor back.

### The vendor's words stop in the adapter

- One file, `provider/hosted.ts`, knows the vendor's field names and status
  vocabulary. Statuses mirror onto the stored states one to one: `created` →
  invited, `pending` → started, `completed` and `needs_review` → submitted,
  `approved` → approved, `declined` and `failed` → declined, `expired` →
  expired.
- **Approval is the vendor's `approved`**, which its template's workflow
  emits. `completed` is the collector being done, not a pass; a template with
  no workflow leaves every check submitted, which the stalled reading shows
  within a day. The deployment checklist requires an observed approval before
  a deployment is enabled.
- **Findings are the vendor's names, verbatim**, with only the outcome reduced
  to `passed` or `failed`; a check the template did not run is absent, and
  the vendor's reasons and metadata never cross because they carry extracted
  personal data. The console labels the handful an operator reads and shows
  the raw name for the rest. Findings are read off the verification that
  decided the check — the one that passed on an approval, the latest
  otherwise — so a blurry first attempt does not outlive its retry.
- The document image is the front photo of the deciding government-id
  verification, served pre-signed from the vendor's files host; the API key
  is sent only to the API host.
- Erasure is `DELETE` on the inquiry or the account; a 404 is done.
- The signature header is parsed as whitespace-separated sets, each with its
  own timestamp, so a secret rotation proves under either secret.

### The vendor's clocks run first; the vault's are the fallback

- The raise passes the invitation window and the started window to the
  vendor as its own expiry intervals, so `inquiry.expired` is the normal path.
- The vault's `expires_at` is those windows plus a grace hour, so its expiry
  list only ever fires where the callback was lost. A started check is read
  back once before it expires: the collector may have finished and the
  callback been lost. A submitted check is never expired by the clock the
  collector holds; the read-back list expires it once the vendor has left it
  undecided for the abandon window.
- **Stalled is derived**, from `submitted_at` and the stall window, wherever a
  check is shown. No stored state, no stall sweep.
- **Continue on a vendor-expired check is an expiry.** `resumeHosted` answers
  null, the vault expires the row, the collector is told to ask again. The
  vendor's resume call is never used: a new one is a new check.

### Both public surfaces mount on the vault worker

- `/vault/api/identity/*`, beside the signing ceremony's `/api/sign`. The
  collector's page is an SPA route at `/vault/verify`, reading the secret from
  the URL fragment and sending it in a header. No path parameter, no cookie.
- The callback proves through the store, resolves the reference to the
  vault's own row, and settles in `waitUntil` after answering 204 — for any
  proven delivery, so the sender learns nothing about which references exist.
- No redirect back from the vendor: the ceremony ends on the vendor's own
  completion screen, and a return would land on a page that no longer holds
  the fragment.

### The settle lands under the case lock, and the check row moves with it

- `settleHostedCheck` calls `settleHosted`, then `bindToCase` — the same
  locked transaction the counter uses. Inside it, before anything else is
  written, the check row moves to approved with the verification id and the
  findings; zero rows means it was withdrawn while the verdict was landing, and
  the verdict binds nothing.
- **The refusal chain gains one arm**: a case that bound an identity after the
  check was raised keeps what staff recorded, and the verdict's record is
  discarded through the `identity_discards` outbox as any refused landing is.
  A refused landing writes the check declined, with the case's own refusal as
  the reason, in the same transaction.
- On the written path the outbox also takes what the column named before,
  where it differs from the new record — closing a crash between the store's
  rebind and the vault's commit that orphaned the first displaced record.
- A counter record, in the same lock, ends any hosted check still out, and
  refuses to stand over a declined one without a reason; the reason lands in
  the `kyc_recorded` event's details. One procedure, `admin.recordKyc`, with
  an optional reason: a second procedure separated nobody.

### Erasure

- A released hosted record's purge queues the inquiry's erasure in the same
  transaction, in `kyc_provider_redactions` — an outbox keyed
  `(provider, kind, ref)` that outlives the verification row. The store's
  hourly cron drains it; a vendor that refuses is recorded with its reason and
  reported, so a person acts rather than the drain looping.
- Erasing a person withdraws their live check, clears what every check of
  theirs holds — the invitation digest, the findings, the reason — and queues
  the vendor's whole account, which cascades to every inquiry of theirs.
- A check that ended without a record is left to the vendor's standing window,
  which Compliance sets with the vendor and the deployment checklist records.
  The vendor offers no way to read the window back.

### What the case screen reads

- `admin.detail` computes the identity state from the case row and its last
  check — the derived standing, whether an identity is bound, when, and
  whether the bound record came from an approved check or the counter. One
  database, one read, no cache.
- `admin.caseIdentity`, under `kyc:read`, answers the record, its findings,
  and the last check's view with its decline reason and findings.

## Database Schema

### `ekyc.kyc_verifications`

| Change | Meaning |
| --- | --- |
| `+ provider_findings jsonb` | `[{ name, outcome }]`, the vendor's check names verbatim; null for a counter check |
| `+ UNIQUE (provider, provider_ref) WHERE provider_ref IS NOT NULL` | A reference produces one record however many settles race for it |

### `ekyc.kyc_provider_redactions` — new

| Column | Type | Meaning |
| --- | --- | --- |
| `provider` | `text` | `hosted` |
| `kind` | `text` | `inquiry` or `account` |
| `ref` | `text` | The vendor's identifier |
| `queued_at` | `timestamptz(3)` | Drain order, oldest first |
| `refused_reason` | `text` | Set when the vendor refused; the row then waits for a person |

Primary key `(provider, kind, ref)`.

### `vault.identity_checks` — new, from the store's factory

| Column | Type | Meaning |
| --- | --- | --- |
| `id` | `uuid` | Also the idempotency key the vendor is raised with |
| `case_ref` | `text` | The case |
| `state` | `text` | `invited`, `started`, `submitted`, `approved`, `declined`, `expired`, `withdrawn` |
| `provider` | `text` | `hosted` |
| `provider_ref` | `text` | The vendor's inquiry |
| `provider_account_ref` | `text` | The vendor's account for the person; what erasure commands away |
| `invitation_hash` | `text` | `sha256` of the 256-bit secret |
| `verification_id` | `uuid` | The store's record an approval produced; no FK, other database |
| `raised_by` | `text` | Who asked — an operator, or the booking's actor |
| `decline_reason` | `text` | The vendor's, Grade10's, or the case's own refusal |
| `findings` | `jsonb` | The vendor's findings on a declined check, where no record holds them |
| `invited_at`, `started_at`, `submitted_at`, `decided_at` | `timestamptz(3)` | |
| `expires_at` | `timestamptz(3)` | The earlier of the invitation's window and, once started, the check's — plus the grace |
| `settle_due_at` | `timestamptz(3)` | When a submitted check is next read back; also its lease |
| `settle_attempts` | `integer` | The backoff's counter, and the ceiling that reports to an operator |

| Kind | Definition | Why |
| --- | --- | --- |
| Unique | `(case_ref) WHERE state IN ('invited','started','submitted')` | One live check per case, as a constraint |
| Unique | `(provider, provider_ref) WHERE provider_ref IS NOT NULL` | A verdict resolves to one row |
| Unique | `(invitation_hash)` | A secret opens one check |
| Index | `(settle_due_at) WHERE state = 'submitted'` | The read-back list |
| Index | `(expires_at) WHERE state IN ('invited','started')` | The expiry list |
| Index | `(case_ref, invited_at DESC)` | The case's last check |
| Check | the state vocabulary; `decided_at` set exactly on approved and declined; `verification_id` only on approved; `started_at` never on invited; `submitted_at` never on invited or started | |

`vault_cases` carries no cached check state: the standing is computed from the
row above at read time.

## Service Interfaces

- **Store** — the five calls above, on the per-product entrypoint, beside the
  counter's `record`, `bind`, `forCase`, `latestForUser`, `captureForCase`,
  `releaseCaseBinding`, `restoreCaseBinding`, `discardUnboundVerification`.
  Failure codes: `VERIFICATION_NOT_FOUND`, `IDENTITY_UNDERAGE`,
  `IDENTITY_DOCUMENT_EXPIRED`, `PROVIDER_UNREACHABLE`, `SIGNATURE_INVALID`.
- **Vault flow** — `raiseIdentityCheck` (gate → reuse → insert on the partial
  index → `raiseHosted` with the row id → write the reference and account →
  mail; a raise or a send that fails withdraws the row and reports),
  `inviteOnBooking` (what a customer's or an operator's booking calls, off the
  customer's response path), `openIdentityCheck`, `startIdentityCheck`,
  `settleIdentityCheck` (answers the row's state afterwards, or null where the
  vendor could not be reached and the row backs off), `withdrawIdentityCheck`.
- **Work lists**, on the vault's fast lane: `identityChecks` (submitted rows
  due a read-back, leased rather than row-locked so the settle's case lock
  cannot deadlock with a counter record) and `identityCheckExpiry`.
- **Routes**: `POST /api/identity/verdicts`, `GET /api/identity/invitation`,
  `POST /api/identity/invitation/start`. A refusal carries a code and one
  message.

## Contracts

- `@grade10/e-kyc-contracts`: `KycFinding = { name, outcome }`; seven stored
  states and `stalled` as a view state; `KycCheckView` with `findings` and no
  override; the five hosted methods; five failure codes.
- `@grade10/vault-contracts`: `admin.recordKyc` takes an optional
  `overrideReason`; no `admin.recordKycOverride`; no device-conflict refusal.
- `@grade10/app-env`: `identityCheckConfig` (API base, pinned API version,
  template) and `identityCheckWindows` (invitation 14 d, check 24 h, stall
  24 h, abandon 7 d, grace 1 h — the last three provisional, `TBC` with
  Product).

## Risks / Trade-offs

- **[The template runs no decision workflow]** → every check reads stalled
  within a day and nobody is verified. The checklist requires an observed
  `inquiry.approved` in the sandbox before a deployment is enabled.
- **[A callback is lost]** → the read-back list settles a submitted check on
  its lease; the expiry list reads a started check back once before expiring
  it.
- **[The vendor cannot be reached at settle]** → the row backs off,
  exponentially and capped at the stall window; past the ceiling it is
  reported to an operator.
- **[The invitation is mailed, so whoever reads the mailbox first can walk the
  check]** → the counter is the control: an operator sees the bound identity's
  name beside the person at the visit.
- **[Two settles run for one reference]** → the store's unique index makes one
  record; the check row's guarded transition makes one decision.

## Migration Plan

1. **Two migrations, one per database**, both additive: in `ekyc` the
   findings column, the reference index and the redaction outbox; in `vault`
   the `identity_checks` table.
2. **Deploy dark** — with no provider secret set nothing is raised, every case
   reads `None`, and the counter path is byte-for-byte what it is today.
3. **Configure the vendor** — template with a decision workflow, the API key,
   the webhook URL and secret, the pinned API version, and the retention
   window set with the vendor and recorded in the checklist.
4. **Sandbox walk-through** — one real document end to end; an
   `inquiry.approved` delivery observed; a released record's inquiry
   confirmed erased.
5. **Enable per environment**, staging first. Rollback is removing the
   provider secret and withdrawing every live check.

## Open Questions

- ❓ **The provider template per document type** — configuration, once
  Compliance names the documents and issuing countries.
- ❓ **The vendor's check names** — read off the sandbox and recorded into the
  adapter's fixtures and the console's labels.
