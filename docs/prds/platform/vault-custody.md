---
title: Vault Custody
order: 2
---

A customer submits an item online, books a visit to a physical store, staff value it and sign documents with them on an in-store iPad, and the item is vaulted until its obligations are settled. One backend (`apps/backend/grade10/vault`) runs the case from intake to release; bookings live in `apps/backend/grade10/appointment` and verified identities in `apps/backend/grade10/e-kyc`, and booking, signing and identity are generic packages the vault composes. Builds on [Account Data](/platform/account-data) (data ownership and deletion), [Admin Access Control](/platform/admin-access) (the elevated ladder and the audit chain), and [Multi-Product Assembly](/platform/multi-product) (why a brand assembles services instead of forking them). The core: **`cases/transitions.ts` is the only writer of a case status, a booking is a relationship rather than a status, and no money moves in v1 without a person recording that it did.**

## Two products

### Vault is custody; financing is an attachment on a case

- Intake asks whether the customer wants a loan against the item, and `financingRequestedMinor` is nullable — null means storage-only.
- A storage-only case skips the offer, payout, and repayment lane entirely, and still records a valuation because custody and insurance need one.
- Storage is free in v1, so nothing is owed on a storage-only case and release asks anyway, through the one guard that will hold fees when they exist.

### `grade10-finance` is a different product, not this one's lending half

- Finance is a separate service with its own database and worker, deployed from day one as a minimal but honest shell; which product it carries is undecided (❓ — the owner's notes describe a loan against graded cards, which the vault's financed lane already runs).
- It shares the generic packages (booking, signing) and nothing else: no vault code, no vault tables, no shared case.
- The identity store is built for finance to share too — it lists `finance` as a product — but nothing in finance verifies anybody yet, so no entrypoint is minted for it and no binding is declared. The reuse is enabled, not wired.
- The pawn loan on a vault case belongs to the vault product because its collateral is the item the vault itself holds.

## The case

### One case is one item

- A unique index on the case's items enforces it; a customer arriving with three items leaves with three cases.
- The visit is booked on the lead case and staff open the sibling cases in store.
- Relaxing the policy is dropping that one index, with no data migration behind it.

### `cases/transitions.ts` is the only writer of a case status

- Every move is a guarded `UPDATE … WHERE status IN (from…) RETURNING`, and zero rows is a named conflict, never a silent no-op.
- Every domain write appends a `case_events` row in the same transaction — transitions and non-transitions alike, so a case's history has no gaps to explain.
- That event's details column carries references, masks, and hashes only: it bypasses the secret redaction every other audit path gets, so raw personal data written there cannot be taken back out.

### Two lanes share one machine

```
draft → submitted → under_valuation → [offer_made →] accepted → signing → vaulted → [active → repaid →] released
terminal: declined | cancelled | expired | forfeited
```

- The bracketed statuses exist only when financing was requested; a storage-only case goes `under_valuation → accepted` and later `vaulted → released` directly.
- Lane membership is a transition guard read off the case, not a second set of statuses.
- There is no `overdue` status: overdue is `computeDue` and a clock, and a status would be a cached answer that can be wrong.

| Transition | Who | Guard |
| --- | --- | --- |
| `draft → submitted` | customer | at least one photo; the loan amount is optional and its absence is the storage-only lane |
| `submitted → under_valuation` | staff `vault:operate` | a booked visit or a walk-in; marks the booking completed if there is one |
| `under_valuation → offer_made` | staff `vault:approve` | financed lane; a valuation is recorded first |
| `offer_made → offer_made` | staff `vault:approve` | counter-offer: supersede the open offer and insert the new one in one transaction |
| `offer_made → under_valuation` | staff `vault:approve` | dispute; supersedes the open offer in the same transaction |
| `offer_made → accepted` | staff `vault:operate` | the open offer has not passed its expiry |
| `under_valuation → accepted` | staff `vault:operate` | storage-only lane; custody terms agreed with no offer |
| `under_valuation → declined` | staff `vault:approve` | the item is refused; nothing has been signed |
| `accepted → signing` | staff `vault:operate` | a verification is bound to the case, its subject is an adult and their document has not expired; opens one packet — the custody agreement always, the loan agreement second when financed |
| `signing → vaulted` | staff `vault:operate` | an executed packet holding every document the lane requires, and nothing still open; writes custody |
| `vaulted → active` | treasurer `vault:payout` | financed lane; the transfer already happened and is being recorded |
| `active → repaid` | treasurer `vault:payout` | recorded repayments satisfy `computeDue` at the recording clock |
| `repaid → released`, `vaulted → released` | staff `vault:operate` | nothing outstanding, no packet open, and an executed packet holding the release document; closes custody |
| `active → forfeited` | staff `vault:approve` | past due and the loan was paid out; manual, financed lane only; closes custody, and the item settles what was owed |
| `draft → expired`, `submitted → expired` | sweep | untouched past its window, and for a submitted case only after confirming it holds no live booking |
| `accepted → cancelled`, `signing → cancelled` | staff `vault:operate`, or the packet-expiry sweep | the sweep cancels only a case with no path left to `vaulted` — no ceremony open and no executed packet covering the lane — because `cancelled` is terminal |
| `vaulted → cancelled` | staff `vault:operate` | no payout has been recorded; runs the release machinery, because an item leaves custody exactly one way — but signs no release document, because the custody is being undone rather than discharged, and there is no receipt for an agreement that is being called off |

### An unwind stops where the money starts

- Nothing unwinds past `active`: once a payout is recorded, the way out is repayment or forfeiture, never a status rewind.
- A customer picking up a storage-only item books a pickup on the vaulted case, which the live-booking rule permits because the intake booking is already completed.

### Every deadline is enforced when it is read, not when it is swept

- Accepting an offer checks its expiry, every ceremony route checks its token and packet on each request, and booking refuses a slot in the past.
- The sweeps exist for liveness — they make the stored state agree with the clock — and no refusal depends on when a cron last ran.

## Booking

### A booking is a relationship, not a case status

- There is no `appointment_booked` status, because a status here would summarize rows living in another service's database.
- The case caches the booking reference, its time, and its location for display; the appointment service is the source of truth and a repair list fixes the cache rather than trusting it.
- Walk-ins fall out for free: a case with no booking still moves `submitted → under_valuation`.

### Every booking mutation flows through a vault procedure

- The vault worker is the only caller that changes a case's booking: booking, rescheduling, cancelling, and recording an outcome all go through vault procedures over the binding. The admin panel reaches the appointment service only to read and to run the diary itself — locations, rules, exceptions, and a day's bookings — and moves no case's visit there.
- An outcome names the booking it judges. The vault holds a cached copy of somebody else's diary, so a call keyed on the case alone would close whichever visit is live now, including one the customer moved while the cache was stale.
- No call names a product: the named entrypoint the caller bound to is its identity, so speaking for another product is not expressible.
- The remote call runs outside any vault transaction, and the guarded transition plus the cache write then commit together.
- Nothing is ended on the cache alone: expiring a submitted case and recording a no-show both ask the diary first and repair the cache where the two disagree. With no diary to ask, nothing is ended at all — a case whose booking cannot be ruled out is left where it is.
- Repair lists close the gap the two databases leave from both sides: a terminal case still holding a future booking is cancelled idempotently until it sticks, and a case whose cache was lost between the remote call and the local write is found among recently touched cases and refilled from the diary.
- Every diary refusal folds into one vault code, `BOOKING_UNAVAILABLE`, so a customer screen cannot tell a slot that filled from one that is already in the past — the copy says to pick another time, and separating them would mean carrying the appointment service's own codes through the vault's vocabulary.

### The appointment service holds availability for a location, not the registry of locations

- A location id is brand-level vocabulary; this service stores rules, exceptions, and bookings against that id and claims no ownership of what a store is.
- Availability is derived from rules on every read, never materialized, and a booking pins concrete timestamps that the booking path re-derives before it inserts.
- One lazily created claim row per location and slot start is the serializer, and no path takes an advisory lock, which Cloudflare documents as unsupported over Hyperdrive.
- An instant the schedule does not offer is refused before that row is written, so a client-supplied timestamp cannot leave a lock row behind; capacity is still re-derived under the lock, which is what makes it a limit rather than a suggestion.
- A claim row is dropped only once its slot is well past and no booking references it. A row for a slot still ahead is what other callers queue on, and deleting one would let a cancel race a booking for the seat it just freed.

## Signing

### The ceremony is ours, running on Workers

- `pdf-lib` fills and stamps, `pdfjs-dist` renders the review, `signature_pad` captures the signature, and the sealed PDF plus its digest and audit trail land in R2 and Postgres.
- There is no runtime provider port: an external e-signature provider inverts the flow with a hosted ceremony and webhooks, so the seam for one is the package boundary and the template contract, not an interface nobody can implement today.
- A template owns the document it renders and the boxes a signature lands in, and it types the case data it needs, so adding a document is a template, not a change to the ceremony.

### The token lives in the URL fragment and nowhere else

- The mint screen hands out `/vault/sign#<token>` as a link and a QR code, because a fragment never reaches a server, a tail worker, Workers Logs, or a `Referer` header — a token in the path would ship a live token to the logging pipeline on every refusal.
- The signing page reads the fragment and sends the token in a request header to API paths that carry no token themselves, under `Referrer-Policy: no-referrer`.
- Tokens are 256-bit random, stored only as their digest, short-lived, single-use, and consumed inside the seal transaction.
- Every id a mint call names is proved in words first: the packet is on the case, the signer is on that packet, and an id that could not name a row at all is refused before a statement is built. The composite foreign key through `packet_id` stays the backstop, but a constraint refuses in SQL — and SQL is what an operator would have been shown, statement and parameters included, with the token digest just hashed into them.

### First use binds a token to one browser

- The first ceremony request sets an httpOnly, `SameSite=Strict` cookie, and a later request that does not match is refused and recorded as a token conflict.
- Each page the signer views and the consent they give is recorded as an event carrying the request's address and user agent, as evidence of what they saw — the refusal ladder at seal time is what enforces it.

### Identity is another service's record, bound to the case

- The verified record lives in `grade10-e-kyc-service`. What a case holds is a reference to it, `identity_verification_id`, and nothing more: no name, no birth date, no document number is stored here.
- Like signing, identity has no runtime provider port: a hosted KYC provider inverts the flow with its own ceremony and webhooks, so the seam for one is the e-kyc package boundary — the manual check is a derivation `recordVerification` performs itself, not an adapter.
- Recording runs in two phases, because the store is another worker. The RPC happens first with no transaction open; a short transaction then takes the case row's lock, re-judges the case, voids any packet still out — its documents were rendered from the record the rebind replaces, and nothing on a packet names a verification — and writes the reference beside the event. Re-recording rebinds rather than duplicating — a case binds exactly one verification — so a retry converges on one binding instead of leaving a second photograph behind.
- Recording is gated, on both reads of the case row, because a rebind purges what it displaces. It is allowed at the pre-custody statuses only (`KYC_RECORDABLE_STATUSES`): post-custody there is nothing left to record for — a release packet reads the binding the executed agreement already holds. A case with sealed evidence refuses `IDENTITY_SEALED` at any status: the recorded identity is what the legal hold names. And an erased case takes no new personal data at all — a binding made after erasure would sit outside the machinery that erases, retained forever on a held case and silently released on a purged one.
- Every name a template prints is the verified legal name, read over the binding at render time. There is no free-text customer name to type: the name on the paper is the name on the document somebody checked, or the document is not written.
- The gate on preparing documents reads the reference off the locked case row, so it stays inside the transaction while the record itself is read outside one. A verification rebound while a preparation was rendering refuses that preparation — the paper names a person the case no longer says it is about.
- The seal ladder checks again rather than trusting the earlier gate, and the certificate page names the verified person — name, document type, masked number, who verified it and when — so the sealed PDF proves who was in the room.

### Custody checks the document; release does not

- Preparing a custody packet refuses `IDENTITY_UNDERAGE` when the subject is not an adult at the preparing clock and `IDENTITY_DOCUMENT_EXPIRED` when the document has lapsed by then. The store runs the same two the moment a verification is bound to a case, so an operator hears it at the counter rather than three screens later; a case can sit weeks between the counter and the paperwork, which is why it is asked twice.
- Preparing a release packet checks neither, deliberately. Entering an agreement requires a person who may enter one and a currently valid document; discharging one does not, and refusing to give somebody their own property back because their passport lapsed while we held it would be wrong.

### One packet is one signing session

- The signing unit is a packet: an ordered set of documents prepared, reviewed, signed and sealed as one thing, bound by a manifest digest fixed before anybody signs. A financed customer signs the custody agreement and the loan agreement in one ceremony at the counter — one QR code, one consent per document, one certificate per document naming the set, one audit anchor over all of it.
- What the set holds comes from the case's lane, in one table read by both the preparation that renders it and the guard that refuses to vault without it. Whether that is one combined PDF or two separate ones is a template decision at the call site, not a shape the schema forces.
- Preparation is two phases. The documents are rendered and stored with no transaction open — a case row's lock held across N PDF renders and N bucket round trips is exactly what "no network call inside a database transaction" forbids, and content-addressed keys make the render re-runnable. One short transaction then takes the case row's lock, re-checks the identity gate and the facts the paper was written from, moves the case, voids whatever was already out and inserts the packet, its documents and its signers together. A throw anywhere leaves the case exactly where it was, and the lock still leaves a case holding exactly one live packet.
- Objects a refused preparation leaves behind are the orphan sweep's ordinary work: a rendered source nothing committed is in the swept area, and it is reclaimed after the day of grace.
- The name a party signs under is one column on their signer row, not one per document, so a packet cannot record two names for one execution. The first mark claims it; a later submission under a different name is refused with `SIGNER_NAME_MISMATCH`.
- The release receipt is a packet of its own — a separate visit weeks later is a separate execution.
- A re-prepare voids the case's live packet and kills its tokens, because a stale packet stuck in signing would deadlock the completed-packet precondition for vaulting. Closing takes the whole set: there is no way to withdraw one document and leave the rest signable.

### The seal is one guarded transaction, anchored in the audit chain

- The ladder refuses in order: token live, packet current, signer's turn, the name this party has been signing under, the document named is in this packet and not already marked, a verification on file, the typed name is the verified person's, every page of that document viewed, consent given.
- Two name rungs answer two questions. `SIGNER_NAME_MISMATCH` asks whether this party signed under one name throughout the execution; `IDENTITY_NAME_MISMATCH` asks whether that name is the verified person's. The second folds both names through the one normalization rule in `@grade10/utils/names`, so caps, double spaces and full-width spellings are the same name — and it runs only against the signer whose role the host named as the record's subject, because refusing a witness for not being the customer would be nonsense.
- The sealer re-hashes the source bytes it fetched and refuses unless they match the digest recorded at prepare time, stamps signature, name, and an injected clock's timestamp, appends the certificate page, hashes the result, and stores it.
- The seal is all-or-nothing over the set: one document whose bytes no longer match refuses the whole packet. The last mark then flips the signer, consumes the token, completes the packet, stores every document's sealed key and digest, and appends one sealed entry — case reference, manifest digest, and every document's source and sealed digest in order — to the hash-chained audit log, which puts the executed set's fingerprint inside the tamper-evident chain and every offsite backup of it.
- Which mark is the last is settled inside that transaction, never before it: the packet row is updated first, so two marks in flight serialize on the row they share, and the set is then counted from the marks the table holds. The count a request took before it rendered anything is a guess — bytes have to exist before the sealing transaction opens — so a mark that finds itself last restarts down the sealing path instead of committing a half answer.
- A second attempt racing the first loses on the guarded update and orphans its object, which the orphan sweep reclaims; the alternative was two rows claiming one packet.
- Executed is those two records agreeing, never the status on its own: the packet says `completed` and every document in it carries the key, the digest and the instant one transaction wrote. Every guard resting custody or money on signed paper asks both — a status is one column anybody with a connection can write, and the sealed key beside it is the sealing transaction's own evidence.
- Anyone can check a document they hold against the digest through a public verification route, and downloading an identity capture appends its own audit entry.
- A sealed packet is re-checked from scratch at `GET /api/cases/:caseId/packets/:packetId/verify`: the manifest is derived again from the documents, every stored file is hashed against the digest recorded for it, the `docSign.sealed` audit entry is compared with the rows it describes, and that one entry's link into the chain is re-derived from four rows — the entry, the one before it, the one after it, and a probe for whether the chain runs on past it at all — because an anchor matching the rows proves nothing if a restore rewrote both. The probe is what makes the successor owed: that successor records what the anchor used to be, so a forger has to drop it, and without the probe the drop would read as a head. Four rows and not the chain: a walk from genesis costs one hash per operator action the service has ever recorded and grows for as long as the product runs, and a case owner calls this route, so whether the chain as a whole still holds is an operator's question and `audit.verify` is where it is asked. The read that finds the anchor asks for a fixed window of the case's newest sealed entries, and a case carrying more than the window is refused rather than told its packet was never anchored — a window that stopped short cannot tell that from an anchor further back. The window bounds the rows and `idx_audit_logs_anchor` on `(action, subject_id, seq DESC)` bounds the work, serving exactly that predicate and order.
- Bounded is bounded, and two forgeries clear it: an anchor at the end of a chain truncated to end there, which the head each append witnesses outside the database is what catches; and an anchor rewritten together with the row after it, so that row records what the anchor now says — two rows, not the tail, because the next row to contradict it sits one past this window and `audit.verify` is what reads that far.
- A row that kept a digest and lost the key naming its bytes is a finding, not a leg that quietly does not run: an empty findings list means every leg ran. Nothing is cached and no verdict is stored — a stored answer is the thing the route exists to replace. No leg is gated on the packet's status either: whether a set was executed is read off the seal on its documents, and the status is one more thing checked against it — a packet still reading `ready` whose documents carry seals is reported rather than skipped. The case owner reaches it, and an operator with `vault:read`, because the workings disclose digests and titles and no identity.

## Storage

### Two buckets, because they hold two different secrets

| Bucket | Holds | Served |
| --- | --- | --- |
| `ITEM_PHOTOS` | what the customer photographed at intake | staff surfaces and the owner, `no-store` |
| `DOCUMENTS` | rendered sources, sealed PDFs, signature images, and the Unicode font the sealer loads for CJK names | through the case, never by bare key |

- A prefix convention would put a customer's item photos one typo from their sealed agreements, and a bucket is the only boundary an R2 token scopes to.
- The photograph of an identity document is in neither: it lives in the identity store's own bucket, and this worker holds no key to one. The audited download route stays here — the download is about a vault case and `kyc:read` is a grant on this product — and fetches the bytes over the binding, which answers only for a case this product itself has bound.
- Keys are content-addressed, one helper mints every key under a named storage area, and one function answers which keys rows still point at — that answer covers document sources, sealed documents, and signature images together.
- The areas are what the orphan sweep walks, so an object nothing references is found by the same rule in every bucket.
- The font is an asset in the documents bucket outside every swept area, loaded at seal time and never bundled, so a Chinese name renders instead of throwing.
- Every photo read — operator and owner alike — lands in the append-only `photo_reads` ledger before the bytes are served, and an insert that fails refuses the read; erasure redacts the customer's own reads and keeps the staff ones, which are the audited thing.
- Personal data in photo metadata, including location, is kept and visible to staff only in v1.

### Objects outlive rows

- An upload writes the object first and the row second, so a failure leaves an orphan the sweep reclaims a day later rather than a broken image on a live case.
- Deleting a row is never permission to delete an object, because two rows can name the same bytes.

### Uploads cap on what arrived, not on what was claimed

- The route rejects early on a declared length, then buffers and enforces the real byte length, because the content-addressed key needs a digest over the whole body and buffering is therefore unavoidable.
- The allowlist is raster image types only and never SVG, nothing decodes an image inside the Worker, and responses carry `no-store` with content-type sniffing off.
- Volume is bounded by state rather than by a rate limiter: a per-case photo cap counted under the case row lock the route already takes, and a cap on how many draft cases one person may hold open.

## Money

### `computeDue` is the one authority for what is owed

- Every screen, guard, and sweep that names an amount owed calls it with a clock; nothing derives interest a second time.
- Amounts are integer minor units, and the currency lives on the case alone — money child rows carry none, so a case whose payout and repayment disagree about currency is not expressible. It must be a currency the platform can price, refused at intake rather than by the renderer that cannot format it.
- What is owed follows the money that moved, never the terms agreed: a case with no payout owes nothing, which is what leaves the unwind open to it, and a forfeited case owes nothing because the item settled it.
- Interest is one rounding of one exact figure. A daily rate taken off an already-rounded term would carry that rounding into every overdue day, and rounding is half-up, so the drift would only ever run toward the lender.

### Accrual stops at the instant the loan settled, and never restarts

- The settlement instant is replayed from the repayment rows: the recording that first covered the balance, judged at its own clock reading. It is the same arithmetic `recordRepayment` did when it decided that recording settled the loan, so the two cannot disagree.
- Not a column and not the `repaid` event. A status is one row anybody with a connection can write, and a case walked into `repaid` by hand would then read as a loan somebody paid; the money is the fact.
- So a customer who pays a late loan in full and collects the item a week later owes what they owed the day they paid. Without that, release refuses over interest nobody owes and `recordRepayment` refuses to take it — the only exit left is forfeiting their own property.

### A due date is the end of the day the agreement prints

- The loan agreement prints a date, so the offer's `due_at` is that date's last millisecond: interest and forfeiture begin at its midnight, not at the time of day the offer happened to be written.
- That also puts the one instant the balance steps on a boundary a customer can be told and the paper already names, so a payoff figure quoted at the counter stays payable for the rest of the day.

### An offer is immutable once accepted, and a renewal is an appended row

- A counter-offer supersedes the open offer and inserts a new one in the same transaction, which is what the one-open-offer rule demands.
- Renewal appends the same way a person would, so automating it later writes rows the schema already has.

### Release asks one function whether anything is outstanding

- `outstandingObligations(case, asOf)` adds the financing due through `computeDue` to whatever fees the case owes, of which there are none in v1, and release refuses while anything is left.
- Introducing storage fees is a fee schedule behind that function and fee rows beside it — never a new status and never a change to the state machine.

### Every money operation in v1 is recorded by a person

- Payout, repayment, and settlement are elevated, audited actions taken by a `vault:payout` holder after the bank transfer happened; the offer's terms are set by staff under `vault:approve`.
- Each is reconciled against what was written down: a principal may not exceed the valuation it cites, a payout must be the accepted offer's principal, and a repayment may not exceed the balance. Different terms are another offer somebody records, not a looser guard.
- The loan ≤ valuation bound is enforced on both writes that could break it. A valuation written under the offer already on the table is refused, because one signing set would otherwise print that valuation on one page and a larger loan on the next; withdrawing the offer is the way down.
- A payout reads its evidence again under the case row's lock rather than inheriting it from `vaulted`: the executed packet holding the documents the lane requires, the item still in custody, and the accepted offer whose principal it must equal. A status is one column anybody with a connection can write, and a disbursement has to stay provable long after the person who recorded it has gone.
- A repayment carries an idempotency key, unique on the case, and it comes from the caller: the audit append runs after the resolver has committed and fails the request loudly, so an operator can be shown an error for money that is already recorded, and the retry must not record it twice. A key the server minted would be a different key on every retry, which is no protection at all.
- A repayment also names the balance the caller was quoting. Where the two disagree the money is refused by name, never recorded as a partial payment nobody meant to make — a customer told a payoff figure either pays it or hears why it changed.
- The three seams automation will land on need no new schema: the one due calculation, the append-only offers, and the money procedures a future payout provider would call the way the store's payment port wraps its provider.
- That provider port is deliberately not built before the first real provider, because an interface with no implementation encodes a guess.

## Permissions

### Grants split by what an action can cost

| Grant | Covers | Held by |
| --- | --- | --- |
| `vault:read` | seeing cases, items, documents, and what is owed | staff, treasurer, admin |
| `vault:operate` | running the flow: valuation start, acceptance, document prepare and mint, vaulting, release, unwinds | staff, admin |
| `vault:approve` | what a loan costs: valuations, offers, declines, forfeiture | staff, admin |
| `vault:payout` | money moving: payouts, repayments, settlement | treasurer, admin |
| `appointment:read`, `appointment:manage` | the booking surfaces | staff, admin |

- Staff and treasurer are disjoint on money, so a payout takes two people, and `admin` holds everything as it does everywhere.
- `treasurer` reaches the local dev sign-in widget with no further wiring, because that widget lists whatever roles the shared vocabulary declares.
- The admin panel's payout tab lives inside case detail and is gated on `vault:payout`, so the split is visible in the panel rather than only in a refusal.

### An elevated mutation naming personal data selects what it audits

- The audit chain records raw input by default and the shared redaction does not know about identity numbers, phone numbers, or bank references, so each such procedure ships a selector that names what may be written.
- A test walks the router and fails any elevated mutation whose input schema names one of those fields without a selector, because the chain is append-only and a secret in it cannot be removed.

## Retention and erasure

Erasure is an admin calling `erasure.erase`, which asks auth's guard first, as every service does.

### What was signed is kept under a hold; what was not is purged

| Class | On account deletion |
| --- | --- |
| A case nobody signed (draft, declined, cancelled, expired) | purge personal data, photos, what the customer wrote about the item, release the identity binding, and what the ceremony holds of the person: the name typed on the signer row, the address and device it was driven from, the drawn marks, and the rendered PDF their name was printed down |
| A signed case, financed or storage-only | keep the sealed documents and the identity binding under a named legal hold — and with them what the agreement is evidence about: the item photos (collateral-condition evidence under the same hold), the customer's own item title and description, and staff notes. What goes is the person around the agreement: contact details, the decline reason, and their id in the history |
| A case that finished after custody but carries no executed packet | should not exist — the vaulting guard wants one. Keeps the data, under `custody_closed` rather than `signed_documents`, so a retention nobody can explain is not recorded as an agreement |
| Bookings | anonymize: the person is unlinked, the occupancy stays so past availability still adds up |

- The legal hold is what makes the exception reviewable: sealed documents and the identity behind them are evidence of an agreement, and erasing them would erase the record of a debt that existed. On a held case the binding is the hold — it is what keeps the store's record and its capture alive, and the named hold on the case row is where an operator reads why.
- What enforces keeping is the sealed-evidence check, never the column: `legal_hold` is the operator-readable reason, CHECK-constrained to the two names `erasure/eraseUser.ts` writes, and the retention review sweep only flags what is past a set window — deleting anything on expiry is a second decision once legal sets the per-class values.
- Staff notes — on a valuation, on a custody movement — are working notes about the item and never about the person: no contact details, no identity numbers, nothing the customer said about themselves. That convention is what lets a held case keep them; a purge closes them to NULL anyway, through the one erasable column each table's append-only guard leaves open.
- The identity is erased across a service boundary, so a purge takes three steps: one transaction does every local erasure, stamping `identity_release_pending_at` as the debt it leaves; `releaseCaseBinding` drops the binding; and a second short transaction clears the column and the stamp together. The store purges the record and deletes its capture off a durable purge queue, so a bucket call that fails keeps the release failing until the bytes are actually gone. A case still carrying the stamp is an unfinished erasure — the resume list keys on it rather than on the column, which is null in exactly the orphan state the unconditional release exists to reach — and finds it whether or not the recording ever wrote the column, because the case's `user_id` is gone and a second erasure from the console can no longer name it.
- The typed legal name lives in one column, `sign_signers.full_name`, which is why a purge can reach it: one execution by one party is one name, and the column is mutable and carries no append-only trigger for exactly this. The purge overwrites it with a marker rather than nulling it — null is what a party who never typed anything carries, and an erasure nobody can tell happened is not one. A signed case keeps it — the name is stamped on the sealed page and printed on the certificate, and a hold that kept the agreement without the party who executed it would keep no record at all.
- The class is read off the evidence, never off the status alone: `cancelled` is reachable from `signing` and from `vaulted`, so what decides is whether a packet on the case was executed. Both halves of that decision are taken under the case row's lock, from the row as it is inside the erasing transaction — the candidate list is read outside one, and purging on the older word could gut a draft that has since been submitted.
- `sign_events` carries the same address and device, and its rows stay: the trail is append-only evidence. Its trigger lets exactly two columns be closed — `ip` and `user_agent`, to null and nothing else — and the purge closes them on every packet of the case. A sealed case's trail keeps both, because the certificate froze them at seal time and the hold keeps it. Nothing writes a customer's account id there — the download route records which side of the counter asked, not who — because that is a fact erasure could never come back for.

## Packages

| Package | Owns | Never knows |
| --- | --- | --- |
| `packages/appointment` | locations' availability rules, slot derivation, bookings, and their outcomes, plus its own worker | what a case is — the case reference is an opaque string |
| `packages/doc-sign` | packets, their documents, signers, tokens, signatures, sign events, templates, the ceremony routes, and both the signer's ceremony and the operator's mint surface | which product it signs for; it is a library with no worker and no database of its own |
| `packages/e-kyc` | the identity store: the verified record and its per-product case bindings, the vocabulary, masking and hashing, the adult and expiry predicates, the per-product entrypoints, and the worker that owns the database and the capture bucket | anything about vaults, loans, or cases — a case reference is an opaque string |
| `packages/vault` | the case, its transitions, valuation, custody, money, documents, uploads, notifications, sweeps, and the customer-facing slices | how a slot is derived or how a PDF is sealed |
| `packages/grade10-finance` | the finance shell's own contracts and worker, reserved for a product the owner has not yet defined | the vault's tables, cases, and money |

### A generic package never learns what a case is

- The booking, signing and identity packages take an opaque reference and give it back, so the vault can change what a case means without touching any of them.
- doc-sign ships table factories the host worker instantiates into its own database, which is what lets a seal and its case event commit in one transaction.
- doc-sign also owns its tables' data lifecycle: `eraseCeremonyPersonalData` knows which columns hold the person and `claimedDocumentKeys` which columns claim bytes, so the vault's erasure and its documents storage area delegate to them rather than restating the columns — the vault keeps only its own decisions: which cases are erasable, and which area is swept. The full host contract is written on doc-sign's `types/ports.ts`.
- e-kyc went the other way and owns a database, a bucket and a worker, because the record belongs to the person rather than to one product's case. Tables instantiated into the vault's database could only ever be read by the vault.

### Vault admin is in-app pages, not an `admin-frontend` package

- That package exists to share one product's admin across brands' panels, and the vault runs in one brand's panel only.

### Vault email copy lives in the package until the shared catalog can hold it

- The copy sits in the vault backend as one English catalog with no fallback to another brand's words, the way the auction's does.
- Its real home is the shared translation catalog in the specification repository, so moving it is a pull request there plus a submodule bump here.

### WhatsApp in v1 is a deep link, not an integration

- The case stores the customer's phone number and the admin panel renders a `wa.me` link from it; the conversation happens in the operator's own client.
- Automated messages have a notification channel port behind them with an email adapter today.

## Where it lives

| Where | What |
| --- | --- |
| `packages/vault/{contracts,backend,frontend,admin-frontend}` | the case vocabulary and wire schemas, the service, and both sides' feature slices — customer-facing and operator-facing |
| `packages/appointment/{contracts,backend}` | the booking contract and the service, including its named per-product entrypoints |
| `packages/doc-sign/{contracts,backend,frontend}` | the packet model, the tables and routes, and the ceremony UI |
| `packages/e-kyc/{contracts,backend}` | the verified record, its case bindings, and the store's worker |
| `packages/grade10-finance/{contracts,backend}` | the finance shell's scaffold |
| `apps/backend/grade10/{vault,appointment,e-kyc,finance}` | the deployments: migrations, buckets, cron triggers, Hyperdrive, and the bindings between them. `e-kyc` has no route and no `ServiceId` — every caller reaches it over `KYC_SERVICE` |
| `apps/frontend/grade10/src/pages/vault` | the request wizard, a customer's cases, booking, and the signing page |
| `apps/admin/grade10/src/pages/{vault,appointments}` | the route shells that mount the panels; the case panels, the payout tab and the `wa.me` link builder live in `packages/vault/admin-frontend` |
| `packages/grade10-auth/contracts/src/schemas.ts` | the `vault` and `appointment` statements and the roles that hold them |
| `neondb/registry.sh` | the four databases and their nightly backups; the vault and the identity store are Neon projects of their own |

## Q & A

- Why sign documents ourselves instead of buying an e-signature provider?
  - The ceremony happens on our own iPad in our own store, and a hosted provider would move the flow, the branding, and the evidence off our infrastructure for a signature we already know how to seal and hash.
- Why is there no signing provider port then?
  - A provider inverts the flow with its own hosted pages and webhooks, so an interface shaped around our ceremony would not fit one; the package boundary and the template contract are the seam that would.
- Why is a booking not a case status?
  - The booking lives in another service's database, and a status would be a copy of it that can be wrong; keeping it a relationship also gives walk-ins a path with no special case.
- Why does the token ride in the URL fragment?
  - A fragment never reaches a server, so a live token cannot land in a log line or a `Referer` header the way a path segment would.
- Why one item per case?
  - Money, documents, and custody all attach to one thing; a case holding three items would need every one of them to carry a share, and the policy is one index if that ever changes.
- Why is every money operation recorded by a person in v1?
  - The transfers are real bank transfers made by staff, and a system that claimed to execute them would be recording an intention as a fact.
- Why does verified identity get its own worker and database instead of tables in the vault?
  - The record is about a person, not about a case. A second product needing the same person verified would otherwise have to photograph their passport again, and a table living in the vault's database could only ever be read by the vault. Moving it also put the legal names, birth dates and document photographs of every customer behind a credential nothing else holds.
- Does finance reuse a verification the vault recorded today?
  - No. The store serves any product that binds it, and finance is in its vocabulary, but no entrypoint is minted for finance and no binding is declared — a dead export is a binding somebody can wire to nothing. The reuse is one entrypoint and one wrangler entry away, and it has not been made.
- Why keep `accepted` as its own status?
  - Agreeing terms and signing paper are separate moments in the store, and collapsing them later costs no schema change.
- Why does the vault own the pawn loan rather than the finance product?
  - Its collateral is the item in the vault's own custody, so splitting them would put one agreement across two services and two databases.

## Open

- The legal retention period per jurisdiction, decided before the first production case.
- The storage fee schedule, if storage stops being free — the release guard is already the place it lands.
- Whether photo metadata keeps its location data once any of it is shown outside a staff surface.
- Finance's own flow, cases, and documents, which start with its first real feature.
