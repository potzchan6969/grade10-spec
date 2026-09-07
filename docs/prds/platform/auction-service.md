---
title: Auction Service
order: 1
---

One auction backend (`apps/backend/grade10/auction`) runs every auction for all storefronts: a product unit is auctioned once, the grade10 site and the zzz storefront display the same live auction, and their users bid against each other. Admins manage the catalog and post-auction fulfillment. Payment is a Stripe authorization hold per bid, captured from the winner. Builds on [Account Data](/platform/account-data) (data ownership) and [Multi-Product Assembly](/platform/multi-product) (the isolation this service is the recorded exception to).

## Sharing and trust

### One shared auction, hard-bounded sharing

- Crosses brands: the auction event, bid amounts, and per-auction pseudonyms
- Never crosses: identity, sessions, cookies, trusted origins, and money
- Bidder identity is `(storefront, userId)`; each storefront backend is the identity oracle for its own users

### The entrypoint pins the storefront

- Each storefront backend reaches the service through its own named entrypoint, so speaking for another brand is structurally impossible, not merely against convention
- Bids flow browser → storefront backend (session resolved there, per account-data.md) → RPC with `{ userId, email }`
- The email rides along as a snapshot on every call and is stored on the bidder row; the service never calls another brand's auth to resolve identity
- The erasure procedures only run when an admin calls them to erase that snapshot

### The contract lives in code

- `packages/grade10-auction/contracts` holds the binding contract: `registerBidder` (returns a SetupIntent client secret), `placeBid`, `watchListing`, `unwatchListing`, `readWatch`, `readListing`, `listMyBids`, `listMyWatches`, `readMyBid`, `claimDuePushNotifications`
- The three signed-in reads are not on the anonymous surface: what a bidder may know about themselves — that their card was declined, which pseudonym is theirs — is exactly what the pseudonyms keep from everyone else
- `AuctionService implements AuctionServiceApi` keeps the contract honest: RPC is duck-typed, so a renamed method breaks the auction backend's own build rather than only production
- No argument names a storefront: the entrypoint pins it, so the shape cannot express speaking for another brand

### Surfaces

| Surface | Consumer | Trust |
| --- | --- | --- |
| RPC `Grade10AuctionService` and `ZzzAuctionService` | that storefront's backend | service binding to a named entrypoint; storefront pinned server-side |
| `GET /api/public/listings/:id` — listing state | storefront frontends | none; edge-cached, uncredentialed CORS |
| `GET /api/public/listings` — the browse page, filtered and keyset-paged | storefront frontends | none; edge-cached |
| `GET /api/public/auctions` and `/auctions/:id` — sales and one sale's listings | storefront frontends | none; edge-cached |
| `GET /api/public/categories` — visible taxonomies and their categories | storefront frontends | none; edge-cached |
| `GET /api/public/listing-media/:size/*` — named sizes `card`, `detail`, `thumb`, `zoom` (Images transform when the scan exceeds that size's ceiling) | browsers | none; immutable, outside every purge prefix |
| tRPC `/api/trpc` and the byte routes under `/api/admin/*` | the grade10 admin panel's auction section | own `AUTH_SERVICE` → grade10-auth |
| `POST /webhooks/stripe/<storefront>` | Stripe, live and test | signature per storefront × mode |
| cron, every five minutes | Cloudflare trigger | — |

- Both store backends declare the `AUCTION_SERVICE` binding — grade10-store to `Grade10AuctionService`, zzz-store to `ZzzAuctionService` — and expose it to signed-in buyers as their tRPC `auction` router
- The auction declares no binding back: a cycle is something wrangler refuses on a fresh account, so anything the storefront must do for the auction is pulled by the storefront's own cron
- The grade10 API gateway routes the anonymous public GETs
- `packages/app-env` knows `auction` as a service of grade10, not as a site of its own: mail links a listing and its alert settings onto the brand's store site, because that is where a listing is browsed
- Auction moderation lives as a section in the merged grade10 admin panel (`apps/admin/grade10`), authenticating against grade10-auth
- zzz browsers never talk to this worker except through the anonymous public reads

### Money stays per brand

- Each storefront brings its own Stripe account; a bidder's customer, holds, and the winner's capture live in the account of the storefront they bid through
- Amounts are integer minor units plus an ISO 4217 code; one currency per listing, no FX

## Money invariants

### The listing row lock is the only serializer

- Every money transition — bid insert, promote, re-auth swap, close, cancel — runs in one Postgres transaction holding `SELECT … FOR UPDATE` on the listing row
- A hold row changes state only inside one of those transactions, never ahead of the lock
- No Durable Objects: state that must be consistent lives in one store with one lock, not two

### At most one live hold per listing — the current top bid's

- Every other hold is released the moment its bid is outbid
- This is the whole answer to Stripe's ~7-day hold cap: only the top hold can age, and one sweep re-authorizes it when it nears expiry

### A hold is never dropped before its replacement is confirmed

- Promotion releases the previous top only after the new hold is confirmed capturable
- A failed hold never disturbs the standing top

### Side effects derive from row state; the sweep is the guarantee

- Work lists are state predicates (holds in `release_due`, settlements in `capture_due`, …), run by a five-minute cron sweep
- No task queue, no outbox — repair reads destination state (the at-least-once rule in account-data.md)
- Failures back off on the row (`attempts`, `next_attempt_at`)
- A permanent failure parks in a state named for it, counted and retryable by an admin — never in a date far enough out to hide it

### Webhooks accelerate, never gatekeep

- Hold success is observed from the synchronous confirm, the Stripe webhook, and the reconciliation sweep; all three funnel into one idempotent, lock-serialized `recordHoldCapturable`
- Losing every observer still converges: every Stripe call carries a deterministic idempotency key and can be safely re-issued within Stripe's ~24-hour replay window
- Past the replay window, the intent metadata is the recovery index

### Ends means ends

- A bid wins only if its hold is confirmed before `ends_at`; `recordHoldCapturable` guards on the clock, not on sweep timing, so the outcome never depends on when the cron ran
- The extension (applied at bid insert, under the lock) is what gives a last-minute hold time to confirm
- `snipe_window_seconds` is the trigger and `extension_seconds` is the reach: a bid landing that close to the end moves `ends_at` to now plus the reach, so a short window can buy a long tail
- Omitted at create, both default to 1800 seconds (30 minutes); both zero together means extension off
- Every late bid extends again — the tail is continuous — until `scheduled_ends_at + extension_cap_seconds`, which truncates rather than rejects, so a cap below the reach is how you spell a hard final deadline
- Listing state carries the extension policy (`snipe_window_seconds`, `extension_seconds`, optional `extension_cap_seconds`) and the latest the listing could possibly close, so a countdown can say why it moved rather than jumping unexplained
- The window narrows and never widens; row checks keep it inside the reach and keep an armed listing from carrying a cap of zero — either shape would accept late bids and silently never extend
- Only the extension moves a live listing's clock; an admin can reschedule a `draft` and nothing else

## Public reads and cache

### Public reads are anonymous, edge-cached, pseudonymous

- Every browse read is a plain GET published with `edgeCache()` — `max-age=5` plus 55 seconds of `stale-while-revalidate` — so a listing going viral costs one query per five seconds
- One listing carries `listing:<id>`; the listing list carries `listings:index`; the sales list carries `auctions:index`; a sale's page carries its own `auction:<id>` as well as the listing list tag, because a listing writer cannot know which sale page embeds its summary
- Listing state carries the extension policy and the latest the listing could possibly close, so a countdown can say why it moved rather than jumping unexplained
- It publishes less than the rows hold: a `draft` or `canceled` listing reads as not found, `lost_hold` publishes as an ordinary `lost`, and `unsold` folds to `closed` unless the listing chose to expose its reserve state
- A listing publishes on its own clock, so it can be live under a sale still in `draft`. It lists, and reads with no sale at all — naming the sale is what the draft status is keeping back. The taxonomy `public` flag reads the same way on every anonymous surface: an internal one is absent from the listing payload and is not a browse filter, not merely missing from the taxonomy list
- The list payload is its own shape — id, title, listing label, status, close, currency, top amount, minimum next, the sale it belongs to, one front image — built by batched queries, because the full state costs five and carries the bid ledger
- That ledger is a window, not the history: a listing's bids grow for as long as it runs, and this is the hottest read in the service. The published floor comes from the same highest-live-pending query the write path uses, never from the window — a run of losing bids priced above it would push that bid off the page and advertise an amount `placeBid` refuses
- Filters are orthogonal (sale, category, status) and paging is keyset: `ending_soon` and `newest`, with a cursor that names the row it stopped on. A cursor from another ordering is a named 400, never a silent empty page
- Only taxonomies flagged `public` are listed, so a taxonomy an admin adds for their own bookkeeping is not a storefront filter until someone says it is
- Displays show "Bidder N", never who — a zzz user's identity must not leak to grade10 viewers
- A sandbox listing is refused outside development, by the same branch on every list as on the single-listing read, or it would be hidden on its own page and listed on the one in front of it

### Purge handles are derived, never spelled twice

- Routes are declared relative to the API gateway prefix `createWorkerApp` mounts them under, so a browser and the cache see `/auction/api/public/…` while the route says `/api/public/…`
- Every purge used to name the declared path, which matched nothing that was ever cached — no error, no metric, just a page stale until its TTL ran out. Both forms now derive from the one service id in `src/publicSurface.ts`, and a test pins the derived value

### Tags first, prefixes only when rows cannot be named

- Every admin mutation purges tags: the listing's own and the lists it appears on, and both sales when a listing moves between them. A test drives every mutation the router exposes and pins what it drops, including the ones that owe nothing
- `auctions.update` is the one catalogue writer that also purges the browse prefixes: every listing under the sale carries its title, and a sale of a thousand listings cannot be spelled out as tags
- A bid purges too — the listing's tag, the listing list, and the sale's page — scheduled the moment the transaction commits and before the Stripe confirm, because an accepted bid has already moved the floor and any extension of `ends_at`
- Stripe webhooks and any sweep pass that moved a row purge the prefixes alone: a work list reports how many rows it moved, not which
- Listing media sit outside every prefix on purpose: the key is the hash of the bytes and the response is `immutable` for a year, so a cached one can never be wrong and a sweep that dropped them would re-fetch every asset on the site every five minutes

### A purge never fails the work that earned it

- The row is committed first and the purge runs behind it on `waitUntil`, with the short TTL as the backstop

## Data model

Own Postgres database (`grade10_auction` in the shared `stg-/prd-grade10` Neon project), pg schema `auction`, reached over Hyperdrive like every app database. Shape — columns, types, keys — lives in `src/db/schema/`, one file per table; this table states what each one means.

| Table | Role |
| --- | --- |
| products | the unit itself: status only — title, copy, category and media belong to the listing, so relisting cannot rewrite a closed listing's record |
| auctions | the sale event: identity and policy only — no clock, no pricing, and no money path reads it |
| auction_listings | the listing: copy, pricing, clock, snipe policy, and the current top; its row lock is the money path's serializer |
| category_taxonomies | a way of classifying listings — data, not vocabulary, so a new one is an insert; `public` decides whether anonymous browsing sees it at all, internal by default |
| categories | a taxonomy's labels |
| auction_listing_categories | one category per taxonomy per listing; its composite key stops the denormalized taxonomy lying |
| auction_listing_media | a listing's gallery media (images and video): content-addressed, dimensions untrusted / null for video |
| bidders | who bids, per storefront: email snapshot and the Stripe ids saved in that storefront's own account |
| bids | every bid, with its pseudonym, state, one stamp per mail it can owe, and its notification ladder |
| bidder_watches | who hears about a listing — a bid records one and `watchListing`/`unwatchListing` manage one without bidding, so "watched it or bid on it" is one predicate; purged on erasure, a watch is not a money record |
| payment_holds | one row per Stripe authorization attempt — the mirror the money invariants read |
| payment_settlements | the winner's capture: state, retry ladder, and a stamp for each of the two mails it can owe |
| fulfillments | post-sale delivery: address, and the proof documents attached to it — a content-addressed key plus the SHA-256 this service computed over the bytes it stored |
| listing_post_sale_logs | post-sale timeline of one listing: outcomes and operator comments, append-only |
| stripe_webhook_events | webhook dedupe ledger, pruned after 30 days |
| storage_cursors | how far the orphan walk has read through each bucket, so a pass killed by the invocation budget resumes instead of re-reading the head |
| audit_logs | standard `@grade10/postgres/audit` chain |

### Three tables owe messages, and carry the same columns for it

- `bids`, `payment_settlements` and `bidder_watches` each carry one `*_notified_at` stamp per message they can owe, the four mail-ladder columns (`notify_attempts`, `notify_next_attempt_at`, `notify_parked_at`, `notify_parked_reason`) and one `push_notified_at`
- A stamp per owed mail, not one per row and not one per state: a bid is top, then outbid, then lost at close, and each of those is its own message with its own stamp. `outbid` and `lost` each owe an invitation while the listing runs and a final message once it has stopped, so a mail list is named by the state *and* the liveness, and the claim filters on both — a list keyed to the state alone stamps the invitation's column for the closing message, and the bidder hears one of the two and never the other
- One push stamp for all of them, because a push says where the row stands now rather than replaying what it has been
- A parked row is indexed by a partial index on `notify_parked_at`, so the admin listing of what gave up costs no scan of the healthy rows

### States

```
sale:        draft → published
             (canceled from draft or published)
listing:         draft → published → closed → settled
             published → unsold  (a top bid under the reserve)
             (canceled from draft or published)
bid:         pending → top | lost | lost_hold | canceled
             top → won | outbid | lost | lost_hold | canceled
hold:        creating → held | failed | release_due
             held → release_due | capturing
             release_due → released | release_failed
             release_failed → release_due  (admin retry)
             release_failed → released     (cancel webhook)
             capturing → captured | held | release_due
settlement:  capture_due → captured | capture_failed
             capture_failed → capture_due  (admin retry)
fulfillment: created → paid → shipped → received  (canceled)
```

- `top → lost` is the reserve miss: the listing closes `unsold`, the winning bid ends like any other losing bid, and nobody is charged
- `top → canceled` is an admin cancelling the listing out from under a standing bid

### Two R2 buckets, because they are different secrets

- `AUCTION_LISTING_ASSETS` holds listing media (images and video): immutable and content-addressed — the key is the SHA-256 of the bytes, so re-uploading the same bytes is idempotent and the object can be cached forever. Bucket names are `grade10-auction-listing-assets-{dev,staging,production}`.
- The public GET path is `/api/public/listing-media/:size/*` with named sizes `card`, `detail`, `thumb`, and `zoom`. When the stored scan exceeds that size's edge ceiling, the Workers `IMAGES` binding shrinks it with `width` and `fit: "scale-down"`; a scan that already fits is returned as stored.
- `PROOF_DOCUMENTS` carries a buyer's address and a courier's signature and never sits behind a public cache
- One helper mints every key and one pattern validates every read of one, so a route whose own regex drifted from the minting rule cannot answer 404 for objects that exist
- The public payload publishes a path under `/api/public/listing-media/`, never an absolute URL — the public hostname is still an open decision
- A proof comes back through the admin route instead, `no-store` and scoped to the listing that lists the key: the bucket holds every buyer's address, so nothing serves an object by a bare key

### Objects outlive rows

- Deleting a row is never permission to delete the object: keys are shared, so two listings photographed from one scan name the same bytes
- An upload writes the object first and the row second — an object with no row is an orphan the orphaned-objects work list reclaims a day later, while a row pointing at nothing is a broken image on a live listing
- That sweep walks storage and asks the database which keys anyone still points at, which is why it covers proof documents too

### A sale is a collection, not an aggregate root

- Cancelling one marks the event in its own transaction, releases that lock, then cancels each listing under the listing's own lock
- The two locks are never held together: a listing transaction reaching up to write its parent would take the locks in the opposite order from every money path
- Whatever the batch does not reach, the canceled-sale work list finishes

### `payment_holds` mirrors Stripe

- One row per PaymentIntent ever created, never a queue — a re-auth (two intents for one bid, briefly) is representable, and every sweep can enumerate exactly which intents are still open
- The Stripe idempotency key derives from the row — `hold:<bid_id>:<seq>` — so a crashed call re-issued later returns the same intent instead of double-holding a card
- Every intent is created with `holdId`, `bidId`, and `seq` metadata, because Stripe replays a key for only ~24 hours — the key accelerates recovery, the metadata guarantees it
- `payment_intent_id` is null only until the create call answers
- No path releases, reconciles, or captures a hold without first resolving its intent: the recorded id, else re-issue by key, else a metadata search on `holdId` scoped to the bidder's customer — a new intent is minted only when that search returns empty
- A capture that finds the intent already succeeded records `captured`; a cancel that finds it already dead records `released`

## Bid and hold lifecycle

### Placing a bid, in one transaction under the listing row lock

- Listing `published` and `starts_at ≤ now < ends_at` — publishing lists a scheduled listing; the clock opens it
- Bidder registered (customer plus saved payment method for the listing's mode), not banned, not deleted
- No `pending` bid by this bidder on this listing already (a partial unique index) — confirm or fail before bidding again
- Currency matches
- Amount at least the floor plus `min_increment`, where the floor is the highest of the recorded `top_amount` and every live `pending` bid (`starting_price` alone accepts the first)
- Insert bid `pending`, a watch, and hold `creating`; inside the snipe window, extend `ends_at` to now plus `extension_seconds`, bounded by the listing's extension cap
- Commit, then — never under the lock — create and confirm the manual-capture, off-session PaymentIntent in the bidder's storefront account
- Validating against pending bids makes accepted amounts strictly increasing, so no two bids ever tie
- The one-pending-bid guard bounds how much unconfirmed money one bidder can pin the floor with
- A declined hold counts `auction.hold.declined`, which is what a ban would be decided on

### `recordHoldCapturable` is the single choke point

- All three observers of `hold`-purpose intents call it (a `reauth` confirm routes to the swap instead)
- One transaction: lock the listing row, then move the hold `creating → held`, stamping the intent id and `expires_at` (the charge's `capture_before`)
- A hold no longer `creating` was resolved by another lock holder while the confirm was in flight — the id is still recorded, the state stays, and the `release_due` work list finishes it
- With the hold `held`, the guards:

| Guard | On failure |
| --- | --- |
| bid still `pending` | hold → `release_due`; the bid keeps whatever state resolved it |
| listing `published` and `now < ends_at` | bid → `lost_hold`, hold → `release_due` |
| amount above the recorded `top_amount` | bid → `lost`, hold → `release_due` |

- On success: previous top bid → `outbid` with all its holds in `creating` or `held` → `release_due`; the bid → `top`; `current_top_bid_id` and `top_amount` updated
- The commit ends the request: the release list cancels the outbid intent on the next pass, and the notification list sends the outbid mail

### The races this closes

- **Both observers missed** (confirm timed out and the webhook lost): the reconciliation sweep finds holds in `creating` older than two minutes, re-issues the create with the same idempotency key (returning the existing intent), and routes the outcome through `recordHoldCapturable` or `lost_hold` — correctness never waits on Stripe's delivery
- **Two holds confirm concurrently**: serialized by the row lock; the amount guard decides; ties cannot happen (strictly increasing)
- **Re-auth racing a new bid**: outbidding marks the old top's in-flight re-auth `release_due` too; when that re-auth confirms, its "bid still `top`" guard fails and the fresh intent is released, not adopted
- **Capture racing a re-auth**: after close the bid is `won`, not `top`, so the re-auth work list no longer selects it; an in-flight re-auth falls to the same swap guard
- **Admin cancel racing everything**: cancel runs under the same lock (allowed from `draft` and `published` only, moving live bids to `canceled` and releasing every active hold); every later confirm hits the "listing `published`" guard
- **A hold confirming against close, outbid, or cancel**: whichever transaction locks the listing first wins; the loser's move from `creating` fails, so a hold marked `release_due` under the lock can never come back `held` — the late confirm only records the intent id for the release work list
- **Overlapping sweeps**: the money lists claim their rows first (`UPDATE … SET next_attempt_at = now() + backoff WHERE key IN (SELECT … due … LIMIT n FOR UPDATE SKIP LOCKED) RETURNING …`); the UPDATE matches on the key alone, so that lock is the whole of the exclusion — without it a second session blocked on the row rechecks a predicate still true in its own snapshot and claims it again. The money is safe either way (every Stripe call behind a claim is idempotent by key), but a double claim spends one of the attempts the give-up ladders count. The listing-scoped lists hold the listing row lock instead, which serves the same purpose

### Re-authorization keeps the top hold alive

- A top hold within 48 hours of its expiry gets a fresh intent (purpose `reauth`, next seq) confirmed off-session
- The swap runs under the lock guarded by "bid still `top`", releasing whichever intent lost
- If re-auth fails, the top demotes to `lost_hold` with a staff metric and a bidder email — on the first decline, with no ladder anywhere on that path
- Demotion clears `current_top_bid_id` but never `top_amount`, so the floor does not regress
- Outbid bidders are not silently re-held — reviving them is an open product decision

### Close, by sweep, under the lock

- Listings `published` with `now ≥ ends_at`: remaining `pending` bids → `lost`, their holds → `release_due`
- A top bid that clears the reserve: the bid → `won` and a settlement is written `capture_due` (keyed on the listing — re-running is a no-op)
- A top bid under the reserve: the listing closes `unsold`, the bid → `lost`, its holds are released, and nobody owes anything
- No top bid at all: the listing closes as a no-sale
- A captured settlement then moves the listing to `settled`

### Capture asks fresh every attempt

- The key is `capture:<listing_id>:<attempt>` against the winner's storefront account — one key per attempt, because Stripe replays a key's first answer for ~24 hours and a constant key would read back the first decline forever instead of asking again
- A declined capture returns the hold to `held` for the next attempt; after five attempts the settlement parks in `capture_failed`, which `retryCapture` is the way out of
- A capture that throws is not one of those attempts — the outcome is unknown and the money may already be taken, so the row stays due behind its backoff and the same key asks again, which is what turns a capture Stripe already made into `already_captured`
- The admin retry is `capture_failed → capture_due` and never rewinds `attempts`, so each call buys one genuine attempt
- The window a parked settlement has left is bounded and watched: the winning hold carries its `expires_at`, the expiry sweep fires a closing-window metric as it nears, and an authorization found already dead sends the hold to `release_due`
- Offering the unit to the runner-up (a fresh off-session intent on their saved card) stays manual until product decides otherwise

### Release gives up the same way

- After ten attempts the hold parks in `release_failed` and `retryRelease` is the way back
- Parking is about the record, not the money — Stripe voids the authorization at its own cap regardless, and a cancel webhook arriving then closes the parked hold out to `released`

## Sweeps

One `scheduled()` handler on a five-minute cron, each pass idempotent, the cron handler the only caller.

| Work list | Action | Permanent failure | File | Lane |
| --- | --- | --- | --- | --- |
| listings `published` past `ends_at` | close and settle | — (transactional) | `sweeps/close.ts` | fast |
| payment_settlements `capture_due` | capture → `captured`, listing → `settled` | `capture_failed`, admin retry | `sweeps/capture.ts` | fast |
| holds `release_due` | resolve intent by key if unrecorded, cancel → `released` | `release_failed`, admin retry; the hold also dies at Stripe's cap | `sweeps/release.ts` | fast |
| holds `creating` older than 2 min | reconcile via idempotent re-create | release, and `lost_hold` or a demoted top, after ~30 min | `sweeps/reconcile.ts` | fast |
| top bids with hold `expires_at` within 48 h | re-auth swap | demote top, notify, metric | `sweeps/reauth.ts` | slow |
| `held` holds past `expires_at` off the top | → `release_due`; closing-window metric while a parked settlement's hold nears | metric | `sweeps/expire.ts` | slow |
| listings `draft`/`published` under a `canceled` sale | cancel under the listing's own lock, releasing its holds | metric | `sweeps/canceledSales.ts` | slow |
| bids and payment_settlements whose state owes a message | send the mail that state earns, stamp | parks on the row after eight attempts; at-least-once | `sweeps/notifications.ts` | fast |
| bidder_watches on listings closing within the hour | one rendering per listing for up to 50 addresses, stamp per batch | parks on the row after eight attempts; at-least-once | `sweeps/endingSoon.ts` | fast |
| objects under an area's own folder, older than a day, that nothing references, resumed from the stored key | delete from the bucket | metric | `sweeps/orphanedObjects.ts` | slow |
| stripe_webhook_events older than 30 days | prune | — | `sweeps/claim.ts` | slow |

### The order is a contract

- `WORK_LISTS` in `sweeps/pass.ts` is the order's only home and a test pins it; this table groups by purpose, not sequence
- Close precedes capture so a winner is charged in the pass that closed the listing
- Capture precedes release so a winner's authorization is never cancelled out from under it, and precedes notifications so the winner's mail goes with the money
- Everything that routes a hold to release runs after release, which is why an expiry or a reconcile give-up takes a second pass to finish
- Ending-soon reminders come last of the mail because they are the only mail that may be dropped: a pass short of time costs a reminder, never a receipt
- Held erasures are retried before the log walk that parks them, so an entry deferred on this pass is not read again on it — and release has already run, which is what can clear one
- Inside the notification list the same rule sets the order: the two settlement lists run before the bid lists, because one budget covers every kind and a closing sale puts hundreds of losing bidders in front of a handful of winners
- The lane column is a tag, not a schedule; splitting the cron is a wrangler change to make deliberately, and tagging keeps it from arriving as a silent reordering

### Reminders anchor to `scheduled_ends_at`

- That timestamp never moves, so an extension cannot re-arm a reminder already sent
- A listing that has stopped taking bids is stamped and not sent — a reminder arriving after the close is not a late email, it is a false statement sent to everyone watching
- A listing's watchers cost one subrequest per batch of 50, not one each: per recipient, a popular listing would exhaust the worker's allowance in its first percent

### Eight kinds of mail, one per thing that happened

| Mail | Sent for | Audience |
| --- | --- | --- |
| outbid | a bid in `outbid` or `lost` while the listing still takes bids | reachable |
| now-top | a bid promoted to `top` | not deleted |
| hold-failed | a bid in `lost_hold` while the listing still takes bids | reachable |
| lost-at-close | the same two bid states once the listing has stopped | not deleted |
| listing-canceled | a bid in `canceled` | not deleted |
| winner | a settlement `captured` | not deleted |
| capture-failed | a settlement `capture_failed` | not deleted |
| ending-soon | a watch on a listing closing within the hour | reachable |

- Nine bodies of copy for the eight kinds: lost-at-close splits by whether the reader was the highest bid on a listing that missed its reserve, which is a different thing to be told than being outbid
- Reachable means neither banned nor deleted, and it is the audience for the mail that invites a bidder back — bid again, fix your card, this closes soon. A ban takes them out of the candidates rather than stamping them, so lifting one brings the row back
- The rest state a fact, and a ban does not make a fact untrue; only a deleted bidder is skipped
- Which mail a row earns is decided at send time from the listing's state, not written into the row: the same claim that used to be stamped and dropped in silence — a bid outbid on a listing that has since closed — now says the listing is over, and says which way
- Reserve-missed is derived the same way: the listing is `unsold` and the reader's own amount is the listing's `top_amount`. No new bid state, no new column
- Cancel mail goes to bidders only; a watcher who never bid hears nothing about a listing being called off

### The mail ladder is per owed mail

- Each list claims its rows the way the money lists do, counting its own `notify_attempts`: 30 seconds doubling to an hour, eight attempts, then the row parks with a bounded reason — never the provider's message, which usually quotes the address it rejected
- A parked row belongs to nobody until `notifications.retry` hands it back, and that door rewinds the count so the row gets the whole ladder again — unlike a capture retry, whose idempotency key is built from the count
- Every writer that moves a row into a state owing a *different* message resets the ladder, the park and the push stamp along with the state. Without that, an address that bounced the now-top mail would leave the row parked, and the winner would never hear that their card was charged
- A row is sent and then stamped, so only a crash between the two repeats a message

### Mail is per storefront, and money in it is listing-scoped

- Copy and listing links follow the brand; there is no default catalog, so a missing storefront throws by name rather than sending one brand's words to another brand's bidders
- ZZZ has no entry because it runs no auction storefront — `BRAND_SERVICES` gives it no `auction` service, so no link could point anywhere
- The listing carries its top amount and currency, so one rendering serves fifty watchers; a reader's own amount rides a per-send argument and a kind that names it and was given none throws rather than printing a blank
- Amounts print through one minor-units formatter, which reads the currency's own fraction digits — so a JPY listing does not gain two decimal places
- Ending-soon is the only mail a reader can stop, so it is the only one that renders an unsubscribe link and a `List-Unsubscribe` header, both pointing at the storefront's `/profile/alerts` for that listing. Not one-click: the destination is a signed-in page
- Every auction email is English: nothing in this service records a bidder's language — not `bidders`, not the register input, not the published RPC contract
- A send that did not happen throws, because the stamp is the only memory that mail was owed — treating an unconfigured provider as success would lose the mail with no row left to repair

### Push is pulled by the storefront, at most once

- The auction has no binding to a store and must not grow one, so a push waits as row state until the storefront comes for it: each store's own five-minute cron calls `claimDuePushNotifications` over the binding it already has
- That cron is the push schedule. There is no work list for push on the auction's own sweep, and no count in `SweepCounts` for it
- The claim is the stamp — one UPDATE marks `push_notified_at` and returns the rows — so a pull that dies loses the event rather than replaying it. No attempts, no backoff, no park: a stale "you are winning" is worse than a missing one
- The stamp is its own, never shared with the mail ladder, so a parked mail cannot replay a push and a push outage cannot duplicate mail
- The event names the user, the listing, its title, close, top amount and currency — no address, no URL. Which brand the events belong to is the entrypoint the caller bound to, so zzz asking gets zzz's
- Delivery is the storefront's: it holds the subscriptions, its own VAPID keypair, and prunes an endpoint the push service reports gone. A brand with no keypair configured never opens the binding at all, which is how zzz is excluded without a branch naming it

### Two metrics per pass

- Both are per list, tagged `list:<count key>`, with the row count as the value
- `auction.sweep.rows` is the volume
- `auction.sweep.repair` is the alarm and covers reconcile, expire, canceled-sale listings and orphaned objects: their rows exist because an earlier committed step did not finish
- The other nine lists are the sweep's own scheduled work — closing at `ends_at` and pruning retention are non-zero on a healthy pass, and keying the alarm on "this pass did something" left it on forever

### Deletion defers to open money

- A deleted bidder's active bids resolve first, under the lock: `pending` bids → `canceled`, a standing top → `lost_hold`, their holds → `release_due` — the deletion request forfeits the bid
- A settlement not yet `captured`, a fulfillment not yet terminal, or a hold still open at Stripe defers that entry and counts `auction.deletion.blocked`: deletion never erases a debt, and a customer deleted ahead of its authorization strands it
- A refusal is reported, not queued: `erasure.status` names the settlement or hold that is in the way, and the admin who filed the request comes back once it clears. Nothing walks past anybody, because nothing walks
- Erasure follows account-data.md's retention classes: bids and payment_settlements anonymize rather than purge; bidder_watches are deleted outright because nothing keeps them
- The email snapshot survives until the fulfillment reaches `received` or `canceled`
- The Stripe customer is deleted only once no uncaptured intent references it

## Stripe

Two accounts — one per storefront: the receiver of the winner's payment is the brand the winner shopped at. The worker holds credentials for both, injected per storefront with no defaults, exactly as email config.

### Registration saves the card

- The storefront calls `registerBidder()`; the service creates the customer in that storefront's account and returns a SetupIntent client secret; the storefront page confirms the card with its own publishable key
- The saved method arrives through the `setup_intent.succeeded` webhook and is recorded on the bidder row — an off-session hold has to name a method, and which card a bidder is authorized against must be visible to the sweeps and to erasure, not only to Stripe

### Webhooks verify mode by signature

- One route per storefront, both modes on it
- Raw body first, signature tried against each mode's secret; the verifying secret is the mode, so a live-signed test event is a crossed config and is refused
- The event id is inserted into `stripe_webhook_events` (duplicate → 200 immediately), then dispatch: `payment_intent.amount_capturable_updated` → `recordHoldCapturable` for `hold` intents and the re-auth swap for `reauth` ones; `payment_intent.canceled` and `payment_intent.payment_failed` → their state transitions; everything else ignored
- The intent lookup is scoped by storefront and mode, so a secret pasted into the wrong config finds nothing rather than moving another brand's money
- The handler follows the raw-body-first shape of `packages/mixpanel/src/ingest.ts`

### The client seam is injectable

- `createStripePort(env, transport?)` takes an injectable transport, mirroring the mixpanel seam, so tests drive confirm failures, webhook replays, and poison responses without the network
- Everything Stripe answers is an outcome; anything else throws and leaves the row for the sweep that repairs it

## Testing and preview

- Staging runs both storefronts' Stripe accounts in test mode end to end
- Production preview: a listing created `sandbox` runs on the test-mode keys and test webhook endpoints, and the public read refuses it outside development — reachable only through the elevated admin surface, so the full lifecycle, capture included, is rehearsable in production with no real cards
- Locally, `/dev/setup` applies the migrations and seeds one sandbox listing live for thirty minutes with extension armed, under a seeded sale and category taxonomy; dev has no Stripe account, so the seed covers only what needs no money
- The pglite lane proves the guards, every work list and the committed migration SQL, faking Stripe through the transport seam. What it cannot prove is exclusion: one WASM Postgres is one session, so no two claims and no two lock holders ever contend there. The claim statements pin their emitted SQL instead, and the compare-and-set predicates every money write carries are unproven by construction — covering them needs a Postgres with two connections
- The workers lane drives the routes — CORS, the admin tier's path, the public read's cache headers, the webhook's signature refusals — and invokes the worker's `scheduled()` export, pinning that a pass that moved rows purges and one that did not, or threw, does not ([Testing Lanes](/platform/testing) lanes and honesty rules apply)

## Catalog, admin, fulfillment

### Admin operations are elevated

- Catalog, listing lifecycle and fulfillment go through `elevatedProcedure("auction:…")`, which carries the grant check and the 2FA rule
- Products, listings, media and scheduling are admin CRUD over tRPC; the routes carrying bytes — listing media in and out, a proof document in and out — reach the same procedures through a caller, so each shares the grant, the 2FA rule and the request context rather than keeping a second copy of all three
- Every elevated mutation appends to the hash-chained `audit_logs`, refusing to run at all without a sink; a query verifies the chain. What lands there is filtered per procedure — a reserve amount records as "set", an uploaded file as a byte count — because the chain is append-only and a secret written there cannot be taken back out
- The parked rows an operator has to act on are listable: holds in `release_failed`, and mail that gave up, each with the door back beside it

### Fulfillment tracks distribution

- After settlement the ladder is `created → paid → shipped → received`, plus `canceled`, and it only moves forward
- Every transition is an elevated mutation. A proof document is not part of one: it is uploaded on its own route, which hashes what it stored and records that key and digest on the row
- A step that also took a key and a digest from the caller was recording a claim about an object nobody had written and a checksum nothing had checked

### Bidder moderation is the service's own flag

- Auth bans do not cross brands, so the service keeps its own `banned` flag
- Bidding refuses a banned bidder, new watches are refused, and every mail that invites one back skips them
- `bidders.list` (paged, filterable to the banned) plus `ban` and `unban` are the whole surface, all three behind `auction:moderate`: the grant that may enumerate who bids is the grant that may stop one
- A ban leaves a standing bid alone — unwinding authorized money is cancelling the listing, and that costs more

### Grants split by what an action can cost

- `auction: ["read", "catalog", "operate", "reserve", "moderate", "settle"]` in `@grade10/auth-contracts`'s rbac vocabulary — split by cost, not by read/write
- `reserve` is the only grant exposing a seller's secret floor, and it is checked in every procedure that could name one: setting it, creating a listing, and opening a sale whose policy every listing inherits
- `settle` is the only one that moves money: capture retry, release retry, the hold listing they are called from, and cancelling a live listing or sale
- `moderate` is neither catalogue nor money and holds `bidders.list`, `bidders.ban` and `bidders.unban` alone
- `staff` holds `read`, `catalog` and `operate`; `admin` holds everything
- A test reads the grants off the built router, so a procedure added without one, or with a permission the vocabulary never declared, fails rather than quietly locking an admin out

## Code map

| Where | What |
| --- | --- |
| `packages/grade10-auction/contracts` | the binding contract, the public state shape, and `getAuctionService` |
| `packages/grade10-auth/contracts/src/rbac.ts` | the `auction` permission statement and the roles that hold it |
| `neondb/registry.sh` + README | the `stg-/prd-grade10` projects holding `grade10_auction` (the targets.sh declaration enrolls nightly backups) |
| `packages/grade10-auction/backend` | the service itself: schema, bidding, holds, sweeps, routers, the Hono app, `createAuctionWorker`, and the `./rpc` entrypoint factory |
| `apps/backend/grade10/auction` | the deployment: targets.sh, embedded migrations, wrangler with the cron trigger, Hyperdrive, both R2 buckets, and the storefront list handed to `createAuctionWorker` — plus both test lanes, `test/db/` on pglite and `test/worker/` on workerd |
| `packages/grade10-auction/frontend` | the `sales/auctions` feature slice the storefronts compose, as one `auctionModules` list |
| `packages/grade10-auction/demo` | the runnable use-case demo, `pnpm dev:auction-demo`, against fixtures |
| wrangler secrets | `STRIPE_SECRET_KEY_<STOREFRONT>`, `STRIPE_WEBHOOK_SECRET_<STOREFRONT>` per env, plus the test-mode pair in every env because `sandbox` is a column on the listing. `RESEND_API_KEY` is one key for the service; the address it sends from is the storefront's, from `senderAddress` in `packages/app-env` |
| `scripts/dev/services.mjs` | the dev ports; reached locally through the API gateway at `api.grade10.dev/auction` — no vhost of its own |
| `.github/workflows/deploy.yml` | `auction-service`, after `auth` and before `store-service` — the store binds this worker |
| root `package.json` | build, test, and deploy chains |

## Still to build

What is left is what a UI has to draw, plus the accounts nobody can provision from here.

- The storefront's auction pages — nothing in `apps/frontend` calls the store backends' `auction` router yet
- The admin panel's auction section
- The browser half of push: the service worker, the permission prompt, and the call to `push.subscribe`
- `/profile/alerts`, which every ending-soon mail already links to
- Image renditions: one original per gallery position is stored and served, and a thumbnail is a resize nobody has asked for yet
- The public hostname for the anonymous reads, and the accounts behind the rest — Resend, Neon, Stripe, and each brand's real VAPID keypair

## Q & A

- Why not an AuctionRoom DO with WebSocket fan-out?
  - A second stateful part whose broadcast duplicates what an edge-cached poll gives at any watcher count for free; the public GET is shaped so a broadcast layer could be added later without moving any state.
- Why not TaskScheduler for guaranteed side effects?
  - It gives up after six attempts (~3.5 h) and lives in a DO, which cannot reach Hyperdrive under the test harness; pairing it with the mandatory repair sweep means two delivery mechanisms for one job.
- Why not a pending-ops outbox table?
  - Queue bookkeeping; the state rows already are the work list.
- Why not one shared Stripe account?
  - Simpler keys, but it merges the brands' money — the sharing boundary is the event, never the receiver.
- Why is mail sent from here when push is pulled?
  - Mail needs no binding in either direction — the sender config is injected, so this worker can just send. Push needs the storefront's own origin and keypair, and the auction cannot call a storefront at all. The direction follows what each one needs, not a rule about events.
- Why not per-brand auction instances?
  - That auctions the same physical unit twice; the unit, not the brand, is the auctioned thing.
- Why no push channel abstraction in the auction?
  - Push belongs to the origin a browser subscribed to, which is the storefront's, never this worker's. The auction names which user to tell about which listing; the storefront holds the subscriptions and does the sending.
- Why does the storefront pull the push work instead of the auction pushing it?
  - A binding back would be a cycle wrangler refuses on a fresh account. Pulling also makes the brand split structural: a storefront that never calls gets nothing, with no branch naming it.
- Why two R2 buckets instead of one with prefixes?
  - The two hold different secrets, a prefix convention puts them one typo apart, and a bucket is the only boundary an R2 token scopes to.

## Open decisions

- A stepped increment ladder — flat `min_increment` until product asks.
- Auto-offer to the runner-up after `capture_failed`, and reviving outbid bidders when a top demotes — both re-hold a card that thought it was done; manual via admin until decided.
- A sanity cap on auction duration (re-auth makes it technically unbounded; ~30 days suggested).
- Whether one declined re-auth should forfeit a standing top bid. It does today, while the existing authorization may still have up to 48 hours left — a transient decline on a live card costs the lead. Every other money path retries behind a ladder; this one has none.
- What unparks a row whose owed message changed because the clock moved rather than because a writer touched it. The ladder and the park are one set of columns per row, reset by every writer that moves it into a state owing something different — but a listing closing moves no row, so a bid whose invitation mail parked on a bad address stays parked and is never told the listing ended. Either a writer at close, or a ladder per message; both cost more than the stamp split already landed.
- The production URL for the public auction API. A zzz page calls `api.grade10.com/auction` today, still naming grade10 in a zzz page's request; a neutral domain is the likely answer, decided with the first zzz integration.
- Refunds after capture: manual in the Stripe dashboard for v1.
- Product analytics: deferred; adopting it is the checklist in [Product Analytics](/platform/tracking) — a catalog, a tracker, and a product key in the tail worker's token map. No storage of its own.
- zzz integration timing: zzz-store already binds `ZzzAuctionService`, so what still lands together is zzz Stripe credentials, a zzz email catalog, and erasure — until then a zzz bidder's mail has no copy and parks.
- Erasing a zzz bidder is part of that launch, not a follow-up. Four things have to arrive with it, and the reason none of them is worth building first is that no zzz bidder can exist until the rest of the launch does:
  - a guard binding per storefront, since the worker is deployed once and `erasureCleared` refuses a brand that is not the auth worker's own
  - an erasure surface on its own entrypoint rather than on `AuctionServiceApi`, which grade10-store also binds — the entrypoint is what says which storefront a call speaks for, and it is also what keeps the capability off a worker that should not hold it
  - the operator carried as a principal, so auction appends the erasure to its own hash-chained `audit_logs` the way `elevatedProcedure` does for every other admin act. An RPC method writes nothing on its own, and an erasure with no record in the database it mutated is the gap `audit_logs` exists to close
  - auction's audit chain mounted on the zzz console, which today declares only `auth` and `store` — otherwise the record lands somewhere the erasing brand cannot read
- Until then the gap is declared in `check-erasure-consumers.mjs`, which fails the day a console row appears or anything binds zzz-auth.
