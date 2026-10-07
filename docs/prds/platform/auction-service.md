---
title: Auction Service
order: 1
---

One auction backend (`apps/backend/grade10/auction`) runs every auction for all storefronts: a product unit is auctioned once, the grade10 site and the zzz storefront display the same live auction, and their users bid against each other. Admins manage the catalog and post-auction fulfillment. A bid holds no money on the bidder's card; 🚧 the winner pays an invoice by card checkout or bank transfer. Builds on [Account Data](/platform/account-data) (data ownership) and [Multi-Product Assembly](/platform/multi-product) (the isolation this service is the recorded exception to).

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
- The three signed-in reads are not on the anonymous surface: what a bidder may know about themselves - which pseudonym is theirs, where they stand - is exactly what the pseudonyms keep from everyone else
- `AuctionService implements AuctionServiceApi` keeps the contract honest: RPC is duck-typed, so a renamed method breaks the auction backend's own build rather than only production
- No argument names a storefront: the entrypoint pins it, so the shape cannot express speaking for another brand

### Surfaces

| Surface | Consumer | Trust |
| --- | --- | --- |
| RPC `Grade10AuctionService` and `ZzzAuctionService` | that storefront's backend | service binding to a named entrypoint; storefront pinned server-side |
| tRPC `public.listing`, `public.listings`, `public.auctions`, `public.auction`, `public.categories` and `featured.publicList` - a lot by slug, the keyset-paged browse, sales and one sale's lots, visible taxonomies, Featured | storefront frontends | none; answered `private, no-store`, never edge-cached |
| WebSocket `/api/public/live/lot/:id` and `/api/public/live/catalogue` - the lot and catalogue rooms under [Live lots](#live-lots) | storefront frontends | none; `Origin` checked against the storefronts |
| `GET /api/public/listing-media/:size/*` — named sizes `card`, `detail`, `thumb`, `zoom` (Images transform when the scan exceeds that size's ceiling) | browsers | none; immutable, never purged |
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

- Each storefront brings its own Stripe account; a bidder's customer, saved card, and the winner's payment live in the account of the storefront they bid through
- Amounts are integer minor units plus an ISO 4217 code; one currency per listing, no FX

## Money invariants

### The listing row lock is the only serializer

- Every bid transition - accept, close, cancel, an erasure's withdrawal - runs in one Postgres transaction holding `SELECT … FOR UPDATE` on the listing row
- No Durable Object holds auction state: state that must be consistent lives in one store with one lock, not two
- The lot rooms under [Live lots](#live-lots) relay committed state and keep time; they never decide

### Side effects derive from row state; the sweep is the guarantee

- Work lists are state predicates (listings past their close, bids owing a mail, …), run by a five-minute cron sweep
- No task queue, no outbox — repair reads destination state (the at-least-once rule in account-data.md)
- Failures back off on the row (`attempts`, `next_attempt_at`)
- A permanent failure parks in a state named for it, counted and retryable by an admin — never in a date far enough out to hide it

### Ends means ends

- `placeBid` judges a bid under the lock by the clock read after the lock, so the outcome never depends on when the cron ran
- Until `scheduled_ends_at` no bid moves the close; at it, a listing with an accepted bid enters extended bidding, and every accepted bid from then on sets `ends_at` to its own acceptance time plus `extension_seconds`
- Omitted at create, `extension_seconds` defaults to 1800 seconds (30 minutes); zero turns extended bidding off
- `scheduled_ends_at + extension_cap_seconds` truncates the tail rather than rejecting a bid, so a cap below the reach is how you spell a hard final deadline, and a cap of zero behaves as extension off
- A bid that does not move the public price (a bidder raising their own maximum) never extends
- A bid placed at exactly `scheduled_ends_at` is accepted on every listing, so the lot's first deadline is one millisecond after it
- Listing state carries the extension policy (`extension_seconds`, optional `extension_cap_seconds`) and the latest the listing could possibly close, so a countdown can say why it moved rather than jumping unexplained
- Only the extension moves a live listing's clock; an admin can reschedule a `draft` and nothing else
- Until the first extension is written, the late window ends at `scheduled_ends_at` plus the reach; after it, at `ends_at`. A cap of zero leaves none, so a bid after the effective close is refused however far the sweep lags

## Public reads and cache

### Public reads are anonymous, uncached, pseudonymous

- Every browse read is a `public.*` tRPC query behind the service's session tier, which answers `private, no-store`, so nothing on this surface is edge-cached and every read reaches Postgres
- A page that polls pays one database read per viewer per poll
- [Live lots](#live-lots) replaces polling: a page reads once and the rooms carry each change
- Listing state carries the extension policy and the latest the listing could possibly close, so a countdown can say why it moved rather than jumping unexplained
- It publishes less than the rows hold: a `draft` or `canceled` listing reads as not found, and a `canceled` bid - called off, or replaced by its bidder's raise - is left off the record
- A listing publishes on its own clock, so it can be live under a sale still in `draft`. It lists, and reads with no sale at all — naming the sale is what the draft status is keeping back. The taxonomy `public` flag reads the same way on every anonymous surface: an internal one is absent from the listing payload and is not a browse filter, not merely missing from the taxonomy list
- The list payload is its own shape — id, title, listing label, status, close, currency, top amount, minimum next, the sale it belongs to, one front image — built by batched queries, because the full state costs five and carries the bid ledger
- That ledger is a window, not the history: a listing's bids grow for as long as it runs, and this is the hottest read in the service. The published floor comes from the listing's `top_amount` through the same `bidFloor` the write path uses, never from the window
- Filters are orthogonal (sale, category, status) and paging is keyset: `ending_soon` and `newest`, with a cursor that names the row it stopped on. A cursor from another ordering is a named 400, never a silent empty page
- Only taxonomies flagged `public` are listed, so a taxonomy an admin adds for their own bookkeeping is not a storefront filter until someone says it is
- Displays show "Bidder N", never who — a zzz user's identity must not leak to grade10 viewers
- 🚧 **Public bid avatar letter** — a public bid avatar may show one letter from the bidder email local part; never the full email or a name
- A sandbox listing is refused outside development, by the same branch on every list as on the single-listing read, or it would be hidden on its own page and listed on the one in front of it

### Only listing media is cached

- Listing media is the one cached response: its key is the hash of the bytes and it is served `immutable` for a year, so a cached copy can never be wrong and nothing purges it
- The purge calls admin mutations still send reach no cached read and change nothing a reader sees
- A bid, the webhook and the sweep send none: the change signal under [Live lots](#live-lots) keeps an open page fresh

## Live lots

A lot's clock, price and result reach every open page within a second of the commit that decides them. Postgres still decides everything; a Durable Object per lot only relays what was committed and wakes the worker at the next deadline. The design record is [Auction · Live rooms](https://github.com/9gag/grade10/blob/main/docs/architecture/auction.md#live-rooms) in the application repository.

::image{src="assets/diagrams/auction-live-lot.svg" alt="How a lot page stays live, in three parts. A page joins: the page sends 3 time probes to the auction worker at the nearest edge and the fastest sets its clock, opens a socket to the lot room, the room reads the lot through the worker once for every page joining at once, and answers hello with the lot. A bid lands: the bidder places a bid through the storefront, the auction worker commits it under the listing lock and the version rises, the storefront answers the bidder, the worker tells the room the listing changed, the room reads the committed lot, sends every page the whole lot at its new version and sets its alarm to the lot's next deadline. The deadline passes: the room's alarm asks the worker to settle the lot, the worker extends or closes it under the lock and returns the lot, and the room sends Ended or Extended bidding and re-arms"}

### The room relays; it never decides

- One room per public lot and one for the catalogue: each holds WebSockets, one alarm, and in memory the last state it sent
- The room writes nothing and keeps no storage beyond its alarm: every read and every settle it asks for runs in the auction worker against Postgres, so losing a room loses nothing
- The worker signals the room after each commit that raised a lot's `version`; the signal is best effort, because the next change, a reconnect, a late touch and the cron all heal a lost one
- The room reads the committed lot back rather than being handed it, so no writer can send a wrong or out-of-order state
- Frames carry the whole lot and its `version`, never a diff; a page keeps the highest version it has seen, from a frame or from a read, so one lost frame is healed by the next
- A room only sends: a page's one message is a keepalive the platform answers without waking it, so an open page that nothing happens on costs nothing, and the database sees one read per change whatever the audience
- Connecting reads no database: the route checks the id's shape, the page's origin and a per-address rate limit, and the room's first read refuses a lot that is unknown, not public or sandbox
- A lot that stops being public (canceled, unpublished) is sent as gone, and its sockets close
- Rooms sit beside the database in Southeast Asia, and the catalogue room sends at most one frame a second

### One rule places a lot on its clock

- The bid guards, the close, every read and the browser all work out the phase from one function in `@grade10/auction-contracts`, and the catalogue's ordering uses one SQL fragment built beside it

| Lot | Phase | Countdown to | Takes a bid |
| --- | --- | --- | --- |
| before `starts_at` | upcoming | `starts_at` | no |
| from `starts_at` to `scheduled_ends_at`, the last instant included | open | `scheduled_ends_at` | yes |
| past `scheduled_ends_at`, before the written `ends_at` | extended | `ends_at` | yes |
| past its effective close, not yet closed | closing | none | no |
| closed or settled, or canceled after it was listed | ended | none | no |

- Readers use the stored row alone, so the catalogue's paging stays on its columns; only a writer holding the lock asks whether an accepted bid exists
- The room's alarm writes the first extension one millisecond after `scheduled_ends_at`, so the stored `ends_at` is the truth within a second; frames carry whether an accepted bid exists as a hint, so a page shows Extended bidding at the scheduled close without a flash of Closed
- A page never shows a result from its own clock: at the effective close it shows the existing Closed state with no result until the room brings the result or a later close; the closing phase is never a public status, which stays Upcoming, Active or Ended
- A new close resets the countdown at once

### Whoever reaches a due lot first settles it

- Settling is one idempotent function in its own transaction under the lock: it publishes, writes the first extension, or closes, whichever is due, and settling twice is a no-op
- The room's alarm calls it at the lot's next deadline; the alarm is a copy of that deadline, set again from every read the room makes, so a bid that extends the lot or an edit that moves it re-arms the room
- A read that finds a lot still closing two seconds past its deadline settles it after answering, skipping a lot another transaction holds, so a crowd queues nothing
- No bid settles inside its own transaction: it refuses a closing lot and hands it to the settle after answering, because a close that fails must not fail the bid that found it
- The five-minute cron still settles what nobody reached, and counts it as a repair, so the metric shows each time the room was not first
- No flag gates the rooms or their alarms, so a rollback is a code revert

### The page clock follows the server

- Countdowns read the server's time, not the device's: 3 probes to a stateless time route at the nearest edge set an offset on the browser's monotonic clock, accurate to half the fastest round trip
- The page probes again after sleep, a reconnect or a return to the tab, and a correction under a second never makes a countdown jump up
- One animation-frame loop drives every countdown on the page while it is visible and redraws a countdown only when its displayed value changes; nothing counts timer ticks, so nothing drifts
- A countdown rounds up, so it reads 0 only once the deadline has passed
- A countdown shows whole seconds only, a lot's last 10 seconds included, so no new countdown state is drawn

## Data model

Own Postgres database (`grade10_auction` in the shared `stg-/prd-grade10` Neon project), pg schema `auction`, reached over Hyperdrive like every app database. Shape — columns, types, keys — lives in `src/db/schema/`, one file per table; this table states what each one means.

| Table | Role |
| --- | --- |
| products | the unit itself: status only — title, copy, category and media belong to the listing, so relisting cannot rewrite a closed listing's record |
| auctions | the sale event: identity and policy only — no clock, no pricing, and no money path reads it |
| auction_listings | the listing: copy, pricing, clock, extension policy, the current top, and a `version` every change a page shows raises; its row lock is the money path's serializer |
| category_taxonomies | a way of classifying listings — data, not vocabulary, so a new one is an insert; `public` decides whether anonymous browsing sees it at all, internal by default |
| categories | a taxonomy's labels |
| auction_listing_categories | one category per taxonomy per listing; its composite key stops the denormalized taxonomy lying |
| auction_listing_media | a listing's gallery media (images and video): content-addressed, dimensions untrusted / null for video |
| bidders | who bids, per storefront: email snapshot and the Stripe ids saved in that storefront's own account |
| bids | every bid, with its pseudonym, state, one stamp per mail it can owe, and its notification ladder |
| bidder_watches | who hears about a listing — a bid records one and `watchListing`/`unwatchListing` manage one without bidding, so "watched it or bid on it" is one predicate; purged on erasure, a watch is not a money record |
| payment_settlements | the winner's capture: state, retry ladder, and a stamp for each of the two mails it can owe; only dev fixtures write it, and erasure reads it for open money |
| fulfillments | post-sale delivery: address, and the proof documents attached to it — a content-addressed key plus the SHA-256 this service computed over the bytes it stored |
| listing_post_sale_logs | post-sale timeline of one listing: outcomes and operator comments, append-only |
| stripe_webhook_events | webhook dedupe ledger, pruned after 30 days |
| storage_cursors | how far the orphan walk has read through each bucket, so a pass killed by the invocation budget resumes instead of re-reading the head |
| audit_logs | standard `@grade10/postgres/audit` chain |

### Three tables owe messages, and carry the same columns for it

- `bids`, `payment_settlements` and `bidder_watches` each carry one `*_notified_at` stamp per message they can owe, the four mail-ladder columns (`notify_attempts`, `notify_next_attempt_at`, `notify_parked_at`, `notify_parked_reason`) and one `push_notified_at`
- A stamp per owed mail, not one per row and not one per state: a bid is top, then outbid, then lost at close, and each of those is its own message with its own stamp. `outbid` owes an invitation while the listing runs and a final message once it has stopped, so a mail list is named by the state *and* the liveness, and the claim filters on both - a list keyed to the state alone stamps the invitation's column for the closing message, and the bidder hears one of the two and never the other
- One push stamp for all of them, because a push says where the row stands now rather than replaying what it has been
- A parked row is indexed by a partial index on `notify_parked_at`, so the admin listing of what gave up costs no scan of the healthy rows

### States

```
sale:        draft → published
             (canceled from draft or published)
listing:         draft → published → closed → settled
             (canceled from draft or published)
bid:         written top | outbid
             top → won | outbid | canceled
             outbid → canceled
settlement:  capture_due | captured | capture_failed | awaiting_wire  (dev fixtures only)
fulfillment: created → paid → shipped → received  (canceled)
```

- A bid is written only when it is accepted: a refused attempt writes no bid
- `→ canceled` is an admin cancelling the listing, an erasure withdrawing the bidder's maximum, or the bidder's own raise replacing their previous bid

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

## Bid lifecycle

### Placing a bid, in one transaction under the listing row lock

- Listing `published`, `starts_at ≤ now`, and the lot takes a bid by [the clock rule](#one-rule-places-a-lot-on-its-clock)
- Bidder registered (a customer for the listing's mode) with a card on file, not suspended, not banned, not deleted
- Currency matches
- A bid is the bidder's maximum, at most the currency's ceiling; a bidder's next bid on the listing has to raise their own maximum
- The maximum is at least the floor: the opening price, or one step of the currency's increment ladder above `top_amount`
- The maximum is judged against every standing maximum and written only if it stands: the highest maximum leads, priced one increment above the next one and never above itself, and `top_amount` and `current_top_bid_id` move in the same transaction
- An accepted bid records a watch and locks the card it was placed with to the listing
- No Stripe call is made at bid time: nothing is charged or held on the card

### A refused attempt places nothing

- `placeBid` answers with the refusal's code and logs `auction bid refused` once, with the lot and the code; the log is the operators' record, never the bidder's
- The refusal log also names the bidder, the maximum sent, and the floor or ceiling the refusal names
- It writes no bid, no standing and no history row, so the attempt shows only on the bid form that made it
- A refusal for a lot past its close hands the lot to the settle after answering

### The races this closes

- **Two bids at once**: serialized by the row lock; each is judged against what the one before it committed
- **Admin cancel racing a bid**: cancel runs under the same lock (allowed from `draft`, `created` and `published`, moving every live bid to `canceled`); a lot already past its close is the settle's, and every later bid hits the "listing `published`" guard
- **Overlapping sweeps**: the mail lists claim their rows first (`UPDATE … SET next_attempt_at = now() + backoff WHERE key IN (SELECT … due … LIMIT n FOR UPDATE SKIP LOCKED) RETURNING …`); the UPDATE matches on the key alone, so that lock is the whole of the exclusion - without it a second session blocked on the row rechecks a predicate still true in its own snapshot and claims it again, spending one of the attempts the give-up ladder counts and sending the mail twice. The listing-scoped lists hold the listing row lock instead, which serves the same purpose

### Close, by sweep, under the lock

- Listings `published` past their effective close: the top bid → `won`, the winner's order is issued with its won mail and setup reminders queued, and the listing → `closed`
- A listing that closes with no winner has its stock marked due for release
- Every bidder's standing moves with the close
- The sweep is the net: the lot room's alarm and a late read settle a lot first, as [Live lots](#live-lots) describes

## Sweeps

One `scheduled()` handler on a five-minute cron, each pass idempotent, the cron handler the only caller.

| Work list | Action | Permanent failure | File | Lane |
| --- | --- | --- | --- | --- |
| listings `published` past `ends_at` | close and settle | — (transactional) | `sweeps/close.ts` | fast |
| listings `draft`/`published` under a `canceled` sale | cancel under the listing's own lock | metric | `sweeps/canceledCampaigns.ts` | slow |
| bids and payment_settlements whose state owes a message | send the mail that state earns, stamp | parks on the row after eight attempts; at-least-once | `sweeps/notifications.ts` | fast |
| bidder_watches on listings closing within the hour | one rendering per listing for up to 50 addresses, stamp per batch | parks on the row after eight attempts; at-least-once | `sweeps/endingSoon.ts` | fast |
| objects under an area's own folder, older than a day, that nothing references, resumed from the stored key | delete from the bucket | metric | `sweeps/orphanedObjects.ts` | slow |
| stripe_webhook_events older than 30 days | prune | — | `sweeps/claim.ts` | slow |

### The order is a contract

- `WORK_LISTS` in `sweeps/pass.ts` is the order's only home and a test pins it; this table groups by purpose, not sequence
- Close precedes notifications so a close's mail goes out on the pass that closed the lot
- Ending-soon reminders come last of the mail because they are the only mail that may be dropped: a pass short of time costs a reminder, never a receipt
- Inside the notification list the same rule sets the order: the two settlement lists run before the bid lists, because one budget covers every kind and a closing sale puts hundreds of losing bidders in front of a handful of winners
- The lane column is a tag, not a schedule; splitting the cron is a wrangler change to make deliberately, and tagging keeps it from arriving as a silent reordering

### Reminders anchor to `scheduled_ends_at`

- That timestamp never moves, so an extension cannot re-arm a reminder already sent
- A listing that has stopped taking bids is stamped and not sent — a reminder arriving after the close is not a late email, it is a false statement sent to everyone watching
- A listing's watchers cost one subrequest per batch of 50, not one each: per recipient, a popular listing would exhaust the worker's allowance in its first percent

### One mail per thing that happened

| Mail | Sent for | Audience |
| --- | --- | --- |
| outbid | a bid in `outbid` while the listing still takes bids | reachable |
| now-top | a bid promoted to `top` | not deleted |
| lost-at-close | a bid in `outbid` once the listing has stopped | not deleted |
| listing-canceled | a bid in `canceled` | not deleted |
| winner | a settlement `captured` | not deleted |
| capture-failed | a settlement `capture_failed` | not deleted |
| ending-soon | a watch on a listing closing within the hour | reachable |

- Reachable means neither banned nor deleted, and it is the audience for the mail that invites a bidder back - bid again, this closes soon. A ban takes them out of the candidates rather than stamping them, so lifting one brings the row back
- The rest state a fact, and a ban does not make a fact untrue; only a deleted bidder is skipped
- Which mail a row earns is decided at send time from the listing's state, not written into the row: the same claim that used to be stamped and dropped in silence — a bid outbid on a listing that has since closed — now says the listing is over, and says which way
- Cancel mail goes to bidders only; a watcher who never bid hears nothing about a listing being called off

### The mail ladder is per owed mail

- Each list claims its rows as [the races](#the-races-this-closes) describe, counting its own `notify_attempts`: 30 seconds doubling to an hour, eight attempts, then the row parks with a bounded reason - never the provider's message, which usually quotes the address it rejected
- A parked row belongs to nobody until `notifications.retry` hands it back, and that door rewinds the count so the row gets the whole ladder again
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
- `auction.sweep.repair` is the alarm and covers canceled-sale listings, orphaned objects and the font check: their rows exist because an earlier committed step did not finish
- The other lists are the sweep's own scheduled work - closing at `ends_at` and pruning retention are non-zero on a healthy pass, and keying the alarm on "this pass did something" left it on forever

### Deletion defers to open money

- A deleted bidder's standing maximums on running lots are withdrawn first, under each listing's lock: their `top` and `outbid` bids → `canceled`, and the lead and price re-resolve from the maximums that remain - the deletion request forfeits the bid
- A settlement not yet `captured` or a fulfillment not yet terminal stops the erasure: deletion never erases a debt
- A refusal is reported, not queued: `erasure.status` names the settlement or fulfillment that is in the way, and the admin who filed the request comes back once it clears. Nothing walks past anybody, because nothing walks
- Erasure follows account-data.md's retention classes: bids and payment_settlements anonymize rather than purge; bidder_watches are deleted outright because nothing keeps them
- The email snapshot survives until the fulfillment reaches `received` or `canceled`
- The Stripe customer is deleted with the rest of the personal data, once nothing stops the erasure

## Stripe

Two accounts — one per storefront: the receiver of the winner's payment is the brand the winner shopped at. The worker holds credentials for both, injected per storefront with no defaults, exactly as email config.

### Registration saves the card

- The storefront calls `registerBidder()`; the service creates the customer in that storefront's account and returns a SetupIntent client secret; the storefront page confirms the card with its own publishable key
- The saved method arrives through the `setup_intent.succeeded` webhook and is recorded on the bidder row - a bid needs a card on file, and the card a bid locks to its listing must be visible to the service and to erasure, not only to Stripe

### Webhooks verify mode by signature

- One route per storefront, both modes on it
- Raw body first, signature tried against each mode's secret; the verifying secret is the mode, so a live-signed test event is a crossed config and is refused
- The event id is inserted into `stripe_webhook_events` (duplicate → 200 immediately), then dispatch: `setup_intent.succeeded` → the saved card; `checkout.session.completed` and `checkout.session.async_payment_succeeded` → the winner's invoice paid; `checkout.session.async_payment_failed` and `checkout.session.expired` → the checkout session closed; everything else ignored
- Every lookup is scoped by storefront and mode, so a secret pasted into the wrong config finds nothing rather than moving another brand's money
- The handler follows the raw-body-first shape of `packages/mixpanel/src/ingest.ts`

### The client seam is injectable

- `createStripePort(env, transport?)` takes an injectable transport, mirroring the mixpanel seam, so tests drive Stripe failures, webhook replays, and poison responses without the network
- Everything Stripe answers is an outcome; anything else throws and leaves the row for the sweep that repairs it

## Testing and preview

- Staging runs both storefronts' Stripe accounts in test mode end to end
- Production preview: a listing created `sandbox` runs on the test-mode keys and test webhook endpoints, and the public read refuses it outside development - reachable only through the elevated admin surface, so the full lifecycle is rehearsable in production with no real cards
- Locally, `/dev/setup` applies the migrations and seeds one sandbox listing live for thirty minutes with extension armed, under a seeded sale and category taxonomy; dev has no Stripe account, so the seed covers only what needs no money
- The pglite lane proves the guards, every work list and the committed migration SQL, faking Stripe through the transport seam. What it cannot prove is exclusion: one WASM Postgres is one session, so no two claims and no two lock holders ever contend there. The claim statements pin their emitted SQL instead, and the compare-and-set predicates every money write carries are unproven by construction — covering them needs a Postgres with two connections
- The workers lane drives the routes — CORS, the admin tier's path, the public read's cache headers, the webhook's signature refusals — and invokes the worker's `scheduled()` export, pinning that a pass that moved rows purges and one that did not, or threw, does not ([Testing Lanes](/platform/testing) lanes and honesty rules apply)

## Catalog, admin, fulfillment

### Admin operations are elevated

- Catalog, listing lifecycle and fulfillment go through `elevatedProcedure("auction:…")`, which carries the grant check and the 2FA rule
- Products, listings, media and scheduling are admin CRUD over tRPC; the routes carrying bytes — listing media in and out, a proof document in and out — reach the same procedures through a caller, so each shares the grant, the 2FA rule and the request context rather than keeping a second copy of all three
- Every elevated mutation appends to the hash-chained `audit_logs`, refusing to run at all without a sink; a query verifies the chain. What lands there is filtered per procedure — a reserve amount records as "set", an uploaded file as a byte count — because the chain is append-only and a secret written there cannot be taken back out
- The parked rows an operator has to act on are listable: mail that gave up, with the door back beside it

### Fulfillment tracks distribution

- After settlement the ladder is `created → paid → shipped → received`, plus `canceled`, and it only moves forward
- Every transition is an elevated mutation. A proof document is not part of one: it is uploaded on its own route, which hashes what it stored and records that key and digest on the row
- A step that also took a key and a digest from the caller was recording a claim about an object nobody had written and a checksum nothing had checked

### Bidder moderation is the service's own flag

- Auth bans do not cross brands, so the service keeps its own `banned` flag
- Bidding refuses a banned bidder, new watches are refused, and every mail that invites one back skips them
- `bidders.list` (paged, filterable to the banned) plus `ban` and `unban` are the whole surface, all three behind `auction:moderate`: the grant that may enumerate who bids is the grant that may stop one
- A ban leaves a standing bid alone; taking the bid away is cancelling the listing

### Grants split by what an action can cost

- `auction: ["read", "catalog", "operate", "reserve", "moderate", "settle", "payment", "shipment", "refund"]` in `@grade10/auth-contracts`'s rbac vocabulary — split by cost, not by read/write
- `reserve` is the only grant exposing a seller's secret floor, and it is checked in every procedure that could name one: setting it, creating a listing, and opening a sale whose policy every listing inherits
- `settle` holds cancelling a live listing or sale, which ends its sale for good
- `moderate` is neither catalogue nor money and holds `bidders.list`, `bidders.ban` and `bidders.unban` alone
- 🚧 `payment`, `shipment` and `refund` split the won order's work: invoicing and recording money, dispatch and delivery, the one refund
- `staff` holds `read`, `catalog` and `operate`; `admin` holds everything
- A test reads the grants off the built router, so a procedure added without one, or with a permission the vocabulary never declared, fails rather than quietly locking an admin out

## Code map

| Where | What |
| --- | --- |
| `packages/grade10-auction/contracts` | the binding contract, the public state shape, and `getAuctionService` |
| `packages/grade10-auth/contracts/src/rbac.ts` | the `auction` permission statement and the roles that hold it |
| `neondb/registry.sh` + README | the `stg-/prd-grade10` projects holding `grade10_auction` (the targets.sh declaration enrolls nightly backups) |
| `packages/grade10-auction/backend` | the service itself: schema, bidding, sweeps, routers, the Hono app, `createAuctionWorker`, and the `./rpc` entrypoint factory |
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

- Why a lot room when the service keeps no Durable Object state?
  - The room holds no fact: it relays what Postgres committed and keeps the alarm. The public reads answer `private, no-store`, so polling costs a database read per viewer, and a Worker alone cannot hold a socket.
- Why WebSockets and not server-sent events?
  - A room holding hibernated WebSockets is billed only while it handles a change, an alarm or a connect. An open event stream is an unfinished request, so the room could never hibernate while anyone watched and would be billed for every second a lot is live, and a Worker cannot share one upstream connection between viewers, so moving the stream into a Worker saves nothing.
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
- A sanity cap on auction duration (~30 days suggested).
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
