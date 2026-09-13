# Shopify membership & POS

Plan for physical-store membership on top of what is built: the store's order
machine and the loyalty engine ([the commerce page](../prds/products/grade10-site/commerce/commerce.md)
and [the loyalty service page](../prds/platform/loyalty-service.md)), and the online checkout identity flow
(`shopify-checkout-identity.md`). The program itself — tiers, earn math,
expiry, in-store flows — is the owner's draft in
`grade10-loyalty-program.md`; this document owns how it lands: the
decisions, the delivery order, and the one open-decisions list. The POS
extension — a separate deliverable with its own deploy lane — is
`shopify-pos-extension.md`. The test plan proving the whole system
resilient — failure modes per part, the suites that catch them, and the
seven engine defects already confirmed — is
`shopify-membership-pos-testing.md`.

## Requirements

1. Members register themselves on the web — counter QR to the registration
   URL, Google One Tap or email OTP; staff never handle registration.
2. Every member is paired with a Shopify customer — see Pairing for what
   that guarantee honestly is.
3. A physical customer can buy as a guest, and the order can be attributed
   to a member later.
4. The in-store member ID is the member card's QR or the email address:
   staff attach the customer to the sale for earning, and pull up tier,
   balances, activity, and affordable redemptions on the loyalty
   terminal.
5. A Shopify POS UI extension is that loyalty terminal — lookup,
   staff-assisted spending with the member's confirmation, open codes,
   and physical-reward collection.
6. Points convert to a Shopify discount code — in the member's own portal
   session, or staff-assisted at the till after identification; either
   way the code applies natively at online checkout or the POS. The
   exchange rate is 1 point = HKD 1 (confirmed 2026-08).
7. Physical rewards redeem on the portal into a pending collection the
   staff complete at the till.

## Decisions

| Question | Decision |
| --- | --- |
| Exchange rate | **1 point = HKD 1, confirmed 2026-08** — `pointValueMinor: 100` in program config beside `minorUnitsPerPoint`. Earning stays 1 point per HKD 10 on eligible goods after discount, so spending points lowers the same order's earn — no earn-on-redeemed-value loop |
| Physical POS | Shopify POS with our own UI extension; Wave Commerce is the setup partner for Shopify POS, not a system to integrate |
| In-store member id | Three paths: a live QR from the member card — with its 8-character short code for cameras that won't read a dim screen, both one-time, proving the member's device is present — the email address typed by staff, where identity is claimed rather than proven, or (dark by default) the phone number, a second typed arm behind `pos_phone_identify` (off) with `pos_phone_spend` pinned off beside it. Every identification opens a short authorized terminal session stamped with its provenance (`qr` / `code` / `email` / `phone`) — identification alone authorizes, and the member never confirms on their own device. A typed identification notifies the member instantly (a receipt, never a gate) and discloses a profile, so every lookup is audited with the staff label, rate-limited from day one, and bounded to what the till needs |
| How points become a discount | One mint, three surfaces: the member redeems N points in their own portal session (online cart, or the member card ahead of or during a visit), or staff redeem on the member's behalf at the till after identification — either way the result is one single-use, fixed-amount Shopify discount code the POS or checkout validates natively. Scoping is a per-surface mint input: POS codes are customer-scoped; online codes are decided by the dev-shop gate (checkout-email eligibility matching is community-attested only), with the unscoped contingency pre-designed — `usageLimit: 1`, minimum subtotal = face value, short `endsAt`, code text only in the member's own session |
| Shopify native store credit | Evaluated and rejected (2026-08). Native tender at POS and `expiresAt` support — but online redemption requires Shopify customer-accounts sign-in, and our checkout keeps the buyer anonymous on Shopify's side by design; application is all-or-nothing, incompatible with pick-an-amount / use-max spending; and it moves the value liability into Shopify's balance, while minted codes keep liability, per-reward expiry, and breakage in our own ledger, one row per outstanding artifact. Re-evaluate if online checkout ever adopts logged-in Shopify customer accounts |
| Attribution vs redemption | Two acts, two bars: attributing a sale is low-stakes and rides Shopify's native customer attach; spending points takes an identified session. A QR session carries proven presence; an email session carries claimed presence, contained after the fact by the instant notification (a receipt, never a gate), the session-scoped cancel, caps, and an emergency flag on email-provenance spending — abuse switches one path off without killing the till |
| Who owns what | Auth owns identity. `packages/grade10-store/backend` owns pairing and external-order ingestion for any brand (zzz's checkout needs the same customer write). A grade10-only `packages/loyalty/backend/src/shopify` owns the terminal gateway, the discount mint, and the member panel — assembled into grade10's store worker, no new worker yet. Loyalty stays vendor-blind behind `RewardFulfiller` |
| The one binding cycle | Loyalty's `shopify_discount` fulfiller binds `MembershipEntrypoint` on the grade10 store worker — a declared, additive-only cycle (fresh environments bootstrap in two passes). Customer scoping makes the loyalty→store edge unavoidable either way: a loyalty-held discount token would still need the member's customer GID and the code registry, so a second credential keeps the cycle and adds a second app per shop and a second rotation surface. The trigger to split membership into its own worker: a second brand assembles it, or its deploys outrun the store's; the split is an extraction of `loyalty/backend/src/shopify` into its own package and a wrangler edit, plus — eyes open — a second Hyperdrive onto the store's database |

The program structure the draft asks for is already the engine:
`pointsInWindow` qualification with `retentionPoints` (the softer
re-qualification option is a config number, not a build), `multiplierX100`,
`tierValidity` pinned to the qualifying window, activity-based expiry reset
by every spend and redeem (bonuses deliberately don't reset it), and the
upgrade evaluated after the credit — so
the higher rate applies from the next purchase, exactly as drafted.
Rounding is deployed config (`earn.rounding`) and starts on the owner's
rule: whole base points first, then the tier multiplier, floored again —
HKD 139 at 1.2× earns 15. Swapping to a single floor at the end is one
config line. Each credit records its base points and multiplier, so the
granted total is derivable from the entry itself.

## Registration and the door

Google sign-in is built (needs `GOOGLE_CLIENT_SECRET` set). Email OTP and
magic link are also built and wired — `/join` offers "or use your email",
with the 6-digit code preferred at a counter and the magic link for
desktops.

- `/join` is a fast path: One Tap or email OTP → enrol → member card, no
  marketing page. A printed counter card carries its static QR and the
  welcome bonus, so joining happens on the customer's phone while staff
  ring the basket — enrolment never blocks the queue. Ships with phase 2.
- The member card is designed as a card: brand, tier colour, big balance,
  the live QR with its short code beneath (the fast in-store ID), the
  member's email (the fallback staff ask for), tier progress, and the
  redemption menu one tap away. An add-to-home-screen prompt makes visit
  two one tap.
- Enrolment posts a welcome bonus (`recordBonus`, idempotency key = the
  user id; the amount is the owner's number) and sends the welcome email.
- The door flow: point at the counter card; the customer joins during the
  ring-up and staff attach the new customer to the sale by email. A sale
  finalised before registration completes is not lost — it attributes
  later through the guest-claim path. Staff-first — creating the customer
  natively in POS — is the fallback for a customer who won't stop; their
  history attaches later through pairing adoption only if staff captured
  the email, so the till script says: email is the field that links them.
- Phone is in the program, dark by default. Phase 1 ships data only:
  `account_profile.phone` — nullable, E.164, a DB CHECK pinned to the
  codec's output grammar, a partial unique index. The shared codec
  auto-prefixes the brand's dial code only when the digits match the
  brand's national plan (HK: exactly 8 digits leading 2–9; the plan is
  per-brand data beside `defaultDialCode` in `storeConfig`), and
  answers `needsCountryCode` otherwise — a foreign national number is
  never silently mangled into valid-looking garbage. `profile.setPhone`
  answers `set | removed | phoneTaken` (23505, never naming the
  holder), is rate-limited per user, notifies the account's email
  instantly, and records `phone_set_at` — the substrate for the
  deferred set-age rule. "Required at registration" is a per-brand
  `storeConfig` value enforced inside `membership.join`, forward-only.
  The vendor write and the POS lookup arm ship in phase 3 with their
  only consumers; SMS verification is a later change and
  `phone_verified_at` lands with it, not before.

## Pairing

Store-owned (`packages/grade10-store/backend`), one table, one drain, no
nightly sweeps.

### The key

Each pairing row mints an opaque member key (ULID) before any vendor call.
It is written to the customer as the `membership.member_id` metafield —
`id` type, unique values, looked up in one call via `customerByIdentifier`.
Opaque on purpose: the better-auth user id would be a live cross-system
join key sitting in a vendor system, outliving deletion; a minted token is
meaningless outside our own pairing table, which stays the authority. This
metafield definition is one-way on a production shop — sign-off before it
is created anywhere.

### The row

`payment_customers`: `(payment_provider, user_id)` primary key,
`customer_ref` unique per provider, `member_key`, `state`
(`pending|orphaned → paired`, `paired → orphaned`,
`pending|orphaned → conflict`, `conflict → pending`, any → `deleted`),
`conflict_reason`, `conflict_customer_ref`, and the drain's `attempts` /
`next_attempt_at` / `last_error`.

### Writers and protocol

Every write goes through one owned pairing module with six call sites —
`ensurePairing`, the drain (which also converges `orphaned → paired`), the
`customers/delete` handler, the deletion path, consumer-side
orphan-marking (any consumer whose own Shopify call reports the customer
missing), and the admin unpark (`conflict → pending`); the merge handler
joins in phase 3. One protocol: every move is a guarded single-row UPDATE
naming the state its writer saw; the claim is the lock, on the store's
existing backoff curve; zero rows updated is an outcome, not an error. `ensurePairing` is
`INSERT … ON CONFLICT DO NOTHING` and never calls Shopify inline, so no
consumer waits on a vendor — and it answers a typed outcome, including
`deletedRow`, which the mint path turns into a permanent refusal instead
of a retry loop. A `paired` row answers from the table with no
vendor call on any hot path.

Enrolment is the store's mutation. `membership.join` runs the loyalty
`enroll` RPC over the existing `LOYALTY_SERVICE` binding (the elevated
`LoyaltyService` entrypoint gains `enroll` beside `recordBonus`), then
`ensurePairing` locally — in that order, so a crash between the two is
exactly what the reconcile lap repairs. The SPA binds a composite
transport whose `enroll()` targets the store worker; the loyalty
frontend package is untouched. Better-auth signup is never a pairing
hook: it would pair guest-checkout unverified accounts and dev logins.

The drain reads each member's email and `emailVerified` through a
batched auth RPC (`accountsByUserIds` — the store database holds no
email by design; a named auth build item) and gates every vendor call
on the verified flag: an unverified row waits on a long re-check,
counted as `store.pairing.awaiting_verification` and excluded from
backlog age — the first verified login makes it drainable, and adoption
then attaches the member's guest history. A THROTTLED answer is
pass-level: the drain aborts the pass and re-arms
claimed-but-unattempted rows in one UPDATE; it never advances a row's
own curve or counts toward a park.

The mint treats a missing pairing row as create-it-now:
`MembershipEntrypoint`'s mint calls `ensurePairing` (idempotent, no
vendor call), re-arms the drain, and answers retryable while the row is
pending — the redemption rides its existing backoff until pairing
converges, so a guest-checkout earner who never enrolled still spends
correctly the day they try.

### Create and adopt

The drain never bare-creates: every create is one `customerSet` upsert
keyed on the member metafield, so a lost response is adopted by the retry
and two overlapping drains produce one customer — Shopify's uniqueness is
the guard, not our claim. The `customId` identifier writes the member-key
metafield itself; `CustomerSetInput` carries no general `metafields`
field, so any further metafield is a follow-up `metafieldsSet`
(release-gated, none needed today). Adoption happens only when the vendor refuses on
an email collision, and only on an identifier we verified (`emailVerified`
today): look the customer up by exact email, and if it carries no member
key, stamp ours. That attaches an online buyer's or a till-created
customer's history to their membership without ever trusting an unverified
identifier — the squatting hole closes in one rule. `commerce.md`'s "a
provider is never asked to match by email" gains this one stated carve-out:
matching an email *we* verified, never a buyer-typed one.

### Repair

Repair-on-use is primary: any consumer whose own Shopify call reports the
customer missing moves the row to `orphaned`, which waits one backoff
interval — so a merge webhook can repoint first — then re-creates.
`customers/delete` accelerates the same move. Merge repair ships in
phase 1 — admin dedupes of online-checkout duplicates exist before any
till does, and repair-on-use has no eyes until per-member vendor calls
exist: a guarded `UPDATE … WHERE customer_ref =
<deleted>`; `merged-into-taken` derives from the unique violation, and the
metafield is re-asserted only from the row that UPDATE returned — metafield
survival through a merge is undocumented and never assumed, and whether a
merge also emits `customers/delete` for the absorbed customer is a
release-gate question, so both handlers are idempotent under either
answer.
`customers/update` is deliberately not subscribed: nothing functional
reads the synced fields, so an email change in auth does not push to
Shopify in v1 — revisited on the first receipt-to-a-stale-address ticket.

### Conflict

One class exists: `email-taken` — the colliding customer already carries
another member's key. Parked with the candidate ref, shown read-only in
the store admin with one "re-run pairing" button (conflict → pending, an
explicit operator action; a `customers/delete` naming the colliding
customer unparks it automatically). A parked member is one whose in-store
lookup and discounts silently don't work, so `store.pairing.conflicts` is
watched, and it stays out of the backlog metric so one parked row cannot
mute the alert.

### Deletion

The row is never DELETEd — and the terminal move comes first: deletion
claims `any → deleted` before touching the vendor, so from that moment the
drain, repair-on-use, and our own `customers/delete` echo all skip the row
by the same every-writer-skips-deleted rule. The vendor work then runs
idempotently on the row's own backoff curve: first every outstanding code
is deactivated, then the metafield cleared (after vendor erasure we can
no longer write), then `customerDelete` — or, when orders exist,
`customerRequestDataErasure` — then the ref nulled. The two arms have two
terminal conditions, and conflating them is an unbounded loop:
`customerDelete` is confirmed by absence, but erasure is asynchronous and
deferred (the customer stays findable for days), so the erasure arm's
terminal is the **recorded acknowledgment** — `erasure_requested_at` and
the request id on the row — never a lookup coming back empty.

Two compensations close the in-flight windows, and they are not
redundant — they close opposite ends of the race: a drain whose
write-back matches zero rows deletes the customer it just created (the
slow drain, landing after the lookup already ran clean), and one backoff
interval after the terminal move a final `customerByIdentifier` lookup by
member key catches anything still at the vendor (the crashed drain, which
never ran the first). The lookup's predicate is "found AND no
acknowledged erasure": a found customer with orders gets an erasure
request and its acknowledgment recorded, never a `customerDelete` retry.
And a compensation firing on an **adopted** customer clears the stamped
metafield instead of deleting — adoption stamps real customers with real
order history. `store.pairing.deletion_stuck` counts rows whose retries are
exhausted; `store.pairing.erasure_stuck` counts acknowledged erasures whose
customer the vendor still finds past the window, and reports a pass that
could not ask as `unchecked` rather than as nothing wrong.

`deleted` is a sink for every writer, but membership is not: a misfired
admin deletion would otherwise park an active member unpairable and
uncounted. An audited admin resurrection moves `deleted → pending`,
minting a **fresh** member key (the old one may sit on a customer an
erasure is consuming), only after the vendor work is confirmed done;
deleted rows whose member is still active are counted. Phase 1 ships all
of this as a function plus an admin action; the store's `erasure` router
reuses auction's existing `ErasureStatus`/`ErasureResult` shape, and an
admin runs it from the console once auth says the request's window has
passed.

### The guarantee, honestly

Requirement 2 is three facts, not a word: the pairing row is written in
`membership.join` — the store's own request, beside the loyalty enroll
call — so no member is missed at the source; the drain converges every
row to `paired` or visibly parks it, never silently giving up; and a
recurring bounded reconcile lap on the store's existing 5-minute cron —
a watermarked `listMemberIds` RPC on the loyalty entrypoint, anti-joined
locally, `ON CONFLICT DO NOTHING` — is the population check, forever,
over **all** `accountMember` rows (guest-checkout earners included, who
hold points without ever enrolling), not just enrolments. The first lap
is the backfill; a lost join hook self-heals instead of waiting on an
operator remembering a script. `store.pairing.backlog` (depth and age,
over `pending` + `orphaned` only) is the observation.

### The phone arm (phase 3)

The pairing write is what makes Shopify POS native customer search by
phone work — the attribution payoff — and it ships in phase 3 with that
consumer, not before. No stored sync state: the drain records the fact —
`synced_phone`, the last value the vendor confirmed — and dueness is
derived: `paired AND account_profile.phone IS DISTINCT FROM synced_phone
AND backoff elapsed`, so a mid-flight `setPhone` leaves the row due by
construction (the tri-state due/synced design has a lost update this
shape makes impossible), `setPhone` never touches `payment_customers`,
and no mark-due backfill script exists at all — the day the arm turns
on, every phone-holder is due by definition. The arm has its own columns
(`phone_error`, `phone_attempts`, `phone_next_attempt_at`) so its
backoff never corrupts the pairing arm's. The payload rule: include
`phone` iff the profile holds one; send explicit `null` only when
completing a removal (`synced_phone` non-null — frees the number at the
vendor); omit otherwise — the phoneless majority must never clobber a
phone Shopify collected itself. A phone userError (taken, invalid)
degrades: retry the same upsert without the field — phone is an
enhancement, and it never parks a pairing — then a slow bounded retry
curve with no lifetime park; `store.pairing.phone_drift` watches
derived-due depth and error rows, surfaced on the weekly ops slot.

## Points → discount

The loyalty redemption lifecycle is built; what lands around it:

- **Quantity redeem.** Redeem gains `quantity` (default 1) for per-point
  rewards: one debit of `pointCost × quantity`, the stock guard folded
  into the existing claim UPDATE as `(quantity = 1 OR stock IS NULL)`,
  a `quantity` column persisted on the redemption (the deferred drain and
  the liability number both read it), one additive field on
  `FulfillInput`, a cap in `limits.ts`. The
  fulfilment config is `{kind: "shopify_discount", amountMinorPerUnit}`;
  the fulfiller mints `amountMinorPerUnit × quantity`.
- **The rate lives in program config.** `pointValueMinor: 100` sits
  beside `minorUnitsPerPoint`; the fulfiller is constructed with it. The
  money identity is `amountMinorPerUnit === pointCost × pointValueMinor`,
  and the seam must see all three legs: `validateTemplate` /
  `assertFulfillable` widen to receive the reward's `pointCost`,
  `updateReward` validates the effective post-patch pair (a half-patch
  reads the other half from the row), and the recurring audit joins
  `reward_items.point_cost` — a rate change cannot leave stale templates
  minting at the old rate, and a repriced reward cannot keep an old
  template. The POS spend preview's HKD figure comes from loyalty
  (`getProgram` carries `pointValueMinor`), never a store-side constant —
  no fourth copy of the rate. `admin.liability` gains
  `outstandingCodesMinor` beside points, so finance's number includes
  minted-but-unused codes.
- **The code.** Fixed amount, `usageLimit: 1`, minimum subtotal = its own
  value (a big code on a small cart is refused, never silently burned),
  `combinesWith` allowing product and shipping discounts and refusing
  other order discounts — one points code per order, enforced by the
  platform, pending the staff-discount gate below. Eligibility is minted
  through `context` (`customerSelection` is deprecated as of 2025-10) as
  a per-surface input: POS codes scoped to the member's paired customer;
  online scoping decided by the dev-shop gate, since checkout-email
  eligibility matching for an anonymous buyer is community-attested only
  and the cart-stage `applicable` flag may not evaluate it — the
  unscoped-online contingency is pre-designed and loses no other
  control. `endsAt` = mint time + `validForDays` (a template field,
  never the reward's `activeUntil` — a code minted near a menu window's
  end must not be born dying). `appliesOncePerCustomer` is inert under
  `usageLimit: 1`; kept, and nothing is tested on it.
- **The usage feed.** Order ingestion — the web path already runs — is
  the primary record of a code being used: `orders/paid.discount_codes[]`
  matched case-insensitively against membership's minted-code registry
  marks the code used, feeds loyalty's usage record, and settles the
  liability number. `asyncUsageCount` is documented eventually-consistent
  with no bound — advisory only, never a synchronous guard. Without this
  feed, `outstandingCodesMinor`, the breakage counter, and the
  cancel-after-tender mismatch check all have no data source.
- **Expiry is final.** Spent points never auto-revert: a code that
  expires unused stays spent — bought but not used is the member's
  responsibility. A program-config flag (`expiryReclaim`, default off)
  can later turn on auto-reversal of wholly-unused expired codes without
  a build. Until then points return only through an admin specially
  cancelling the redemption — the existing usage-gated reversal, tied to
  the redemption it undoes, still refusing a code that was used. Expired
  unused codes leave `outstandingCodesMinor` and are counted
  (`loyalty.codes.expired_unused`), so breakage is a visible number,
  never silence.
- **Where spending happens.** Three surfaces, one mint. Online, the cart
  page offers "spend N points"; `createCheckout` attaches the code via
  `cartDiscountCodesUpdate` and aborts before an order exists if it is
  not `applicable` — and the abort reverses the seconds-old redemption
  inline through the existing usage-gated reversal, so the member is
  never left holding a code the system itself refused. The online redeem
  key derives from a server-issued quote intent (as the till's already
  does), and a checkout-recovery replay re-reads the code from the
  registry — the stored redeem answer deliberately carries none. The
  redemption menu on the member card covers self-service ahead of or
  during a visit. At the till, staff redeem on the member's behalf
  through the terminal — inside an identified session, the numbers read
  back to the member on screen, the code applied to the cart by the
  extension.
  An unused code stays valid and single-use, listed on the card and in
  the terminal's open-codes list for next visit — and at 1 pt = HKD 1 a
  wallet item is money, so `me.reverseRedemption` (fresh-auth, the same
  usage-gated reversal) is the member's own undo for an unused code;
  expiry stays final per the program's policy.
- **Physical rewards.** A lifecycle extension, not reuse: `pending` is
  the drain's due-state (claimed every cron, parked `failed` after its
  attempts, aged into the backlog alarm), so collect-in-store gets its
  own `awaiting_collection` fulfilment state — a migration extends the
  CHECK and the legal transitions, the drain and the backlog-age metric
  exclude it, and `markCollected` moves it to `fulfilled` with the staff
  label in `fulfilledBy` — the member is notified. A collection window
  that passes moves it to expired — terminal, no refund, under the same
  `expiryReclaim` flag as codes — and whether the decremented stock
  restocks then is decided with the window. Cancelled stays an admin act:
  the existing reversal refunding points. The window length and whether
  stock decrements via a zero-value sale or an auto 100%-off code are the
  owner's items below.
- **Eligible goods only — both channels.** The draft excludes shipping,
  grading service fees, and gift cards from earning on every order, so
  the eligible-goods basis is computed from line items after discounts —
  exclusions named by a product rule (type or tag) in store config, not
  hardcoded — and it lands on the web earn path and external ingestion in
  the same phase, the program's basis label changed once for both: the
  web drain prices from the order's stored line items instead of the
  order subtotal. The loyalty sink pins the basis label per drain, so a
  half-migrated pair of paths fails loudly instead of earning on two
  different bases under one name.
- **Caps at the right seam.** Per-redemption and per-member-per-day caps
  live inside loyalty's `redeem`, under the member lock where they cannot
  be raced — every transport inherits them. The per-shop-per-day cap
  lives in the POS gateway, where the shop dimension exists. A generous
  per-member daily
  earn cap refuses the excess loudly (`loyalty.earn.capped`) — the bound
  on a staffer ringing their own account all month, made visible by a
  weekly top-earners-by-location report.
- **Refund policy.** An order that consumed a points code refunds as cash
  only — conversion is one-way, and a used code is never reversed. The
  scripted goodwill remedy is the existing admin adjust; nobody invents
  one at the till.
- **Mint path.** The store records each minted code's node id, amount, and
  the customer it was scoped to; whatever repairs a pairing repoint
  re-scopes that member's outstanding codes in the same pass. The
  `shopify_discount` fulfiller in the grade10 loyalty assembly is a thin
  client of `MembershipEntrypoint` — loyalty holds no Shopify credential.

## POS — the loyalty terminal

The full extension and gateway design is `shopify-pos-extension.md`. The
shape, and what the rest of the system guarantees it:

- **Identification opens a session.** Scanning the member's QR — dynamic,
  short-lived, one-time, so a replayed screenshot is dead by
  construction — or typing its 8-character short code consumes a one-time
  presentation; typing an email — or, flag permitting, a phone number —
  looks the member up directly; a customer already attached to the
  cart, however that happened, identifies too, behind
  `pos_cart_identify`. Any identification the member did not present for
  notifies them instantly. The session binds server-side to the shop, the
  member, and its TTL — never to the claimed staff label, which is
  attacker-chosen and changes mid-transaction when staff switch by PIN;
  the per-call label lands on every audit row instead. Each session
  carries a **capability set** computed at identify (provenance ×
  flags), one enforcement path for every arm: it authorizes the terminal
  to read and act — panel, spend, cancel, codes, collection — for a
  short TTL, no confirmation on the member's device, no re-scan between
  actions; a spend-off arm is refused `redeem`/`redeemCancel`
  server-side and its panel omits open-code *text* (code text is
  spendable value; applying an open code is a gateway procedure —
  session-taking, audited, member-notified — never a client-local act a
  flag cannot reach). `redeem` takes the session, and no surface takes a
  user id.
- **Cart attachment is attribution, and identification when paired.**
  Attaching a customer to the sale — Shopify's own customer search or
  the till's own identify — identifies the member with no re-scan and no
  staff confirmation, behind `pos_cart_identify`. It buys lookup,
  attribution, and reward handover; spending takes a second switch,
  `pos_cart_spend`, because the arm proves neither presence nor a claim
  and the till puts members on the cart itself. An unpaired or no
  customer still shows only the customer-details block's read-only badge
  — enough to attribute, never enough to spend. Earning lands through
  the order webhook either way, matched by customer id through pairing —
  stronger than match-by-email, because it survives an email change.
- **`redeemFor`** is a new loyalty RPC: bounded input, its own
  `written_by`, refusing to run without an audit sink, deliberately
  trading the member's fresh-session step-up for terminal-session
  identification. It arranges its own deferred fulfilment drain and
  awaits a redemption-scoped pass, so the gateway answers the code itself
  in the normal case; the till never polls.
- **Idempotency is the gateway's.** The redeem key derives from a
  gateway-issued intent (`pos:<intentId>`) minted with the server-side
  spend preview, which pins the amount — never minted by the till. A
  double-tap replays, and a replay reads the code fresh so the retry is
  also the recovery.
- **The member is the monitor.** The confirm screen is a read-back facing
  the member — spend N, pay HKD X, balance after Y, earn preview computed
  server-side — and staff tap it; nothing asks the member to touch their
  own device. Every staff-assisted redemption notifies the member
  instantly (push, email fallback) with points, amount, location — never
  the code text — a receipt, never a gate; on an email session it is also
  the member's only proof of presence, which is why it is not optional.
  A same-visit mistake is undone by `redeemCancel` in the same session —
  last redemption only, audited, refused once the order carrying the code
  is seen — and the cart comes first: the extension removes the applied
  discount (`removeCartDiscount()`; the Cart API has no per-code
  removal, deterministic here because our codes refuse other order
  discounts), confirms absence against the cart signal, and only then
  does the gateway deactivate and credit — refused while the cart still
  shows the code. Shopify offers no synchronous tender read, so a cancel
  inside that propagation window is caught by reconciliation: the usage
  feed reads webhook-fed order data, and a reversed redemption whose
  code later lands on an order raises a loud mismatch for the admin
  claw-back — whether a deactivated, already-applied code is revalidated
  at tender is a release-gate question, and the ordering above assumes
  nothing about it.
- **Reads are guarded like writes.** Every identification, lookup, and
  collect runs through `posProcedure` — the same audit-by-construction
  middleware as `elevatedProcedure`, refusing to run without an audit
  sink — as actor `pos:<shop-domain>`, a service principal outside the
  role vocabulary that no human can hold, with staff and location as
  claimed labels. One Cloudflare rate-limit binding keyed on the
  authenticated shop ships in the first build, because email lookup is
  enumerable in a way one-time tokens never were.
- **Collection completes a paid redemption.** Mark-as-collected drives
  loyalty's fulfilment completion for the pending redemption — audited in
  loyalty's chain with the staff label, confirmation step on the
  terminal, and a notification to the member (someone else collecting
  their reward should never be silent).
- **Kill switches and versioning.** One DB-backed flag a store manager
  flips from admin, enforced in the gateway on every request — plus the
  narrower email-spend flag. Every extension build stamps `x-pos-client`,
  and the gateway refuses below a configured minimum with an "update the
  POS app" code — shipped in the first build, because it cannot be
  retrofitted onto tills already running old ones.

## External orders and attribution

POS orders originate in Shopify, so they join the one order machine rather
than growing a second one. The guest-checkout work already made the order
machine owner-optional — nullable `orders.user_id` with `checkout_email`,
nullable `order_events.user_id` narrowed by `OwnedOrderEvent`,
`settleOrderOwner` settling ownership on the order's own event — and this
design builds on that shape rather than beside it:

- **One `orders` table.** A new immutable `origin` (`web` | `pos`,
  default `'web'` so still-deployed checkout code survives the rollout)
  plus `source_name` stored verbatim. `user_id` and `subtotal_minor`
  become nullable; `ck_orders_owner_or_email` is **replaced** by
  `origin <> 'web' OR user_id IS NOT NULL OR checkout_email IS NOT NULL`
  — owner-or-email is a *web* invariant (guest checkout is live), and an
  anonymous POS row legitimately carries neither — with the subtotal
  CHECK keyed on `'web'` the same way.
- **Both arms filter the channel and the money.** `orders/paid` arrives
  for every channel, so the webhook arm and the sweep both allowlist
  `source_name = 'pos'` — draft orders, admin invoices, and third-party
  orders are counted and skipped, never ingested as claimable earns —
  and both refuse an order whose currency is not the store's configured
  one, before any row exists (the existing currency guard compares
  against a row that does not exist yet at ingestion).
- **The dedupe spine already exists — guarded against our own orders.**
  `payment_ref` holds the Shopify order gid under the existing unique
  constraint; ingestion upserts on `(payment_provider, payment_ref)`
  with **DO UPDATE**, refreshing attached-customer data and re-arming
  `attribution_due_at` only where `user_id IS NULL` — the sweep
  re-seeing an order after staff attach a customer post-payment is the
  late-attachment repair, and a DO NOTHING arm would silently kill it.
  Ingestion refuses any Shopify order whose cart token matches a
  recorded `payment_checkout_ref` (the token in its own indexed column;
  a blank token matches nothing); a unique violation on recording the
  refs is a merge signal, never a retry. `payment_events` stays what it
  is — a delivery fast path, never the safety mechanism. The sweep's
  `updated_at` watermark (held 15 minutes behind, three pages per pass)
  is explicitly seeded at deploy — shop clock minus the hold — and never
  advances past what was ingested; a backfill is an operator command.
- **The owner-stamping transaction is the only earn writer.** An
  external order ingests directly at `paid` and never passes through
  `applyOrderTransition`'s event mint — no owner, no paid event, ever.
  The transaction that stamps the owner mints the earn event and the
  refund-replay event together: inline at ingestion when the payload
  carries a paired customer and the eligible basis; at the attribution
  pass when either arrived late; at an operator claim in phase 4 only.
  At most one paid-kind event per order exists at any time, held by
  `uq_order_events_order_id_kind_source_ref` and the guarded
  `UPDATE … WHERE user_id IS NULL`. The event drain's claim query and
  both backlog gauges exclude ownerless events of non-web orders — a
  typed sink outcome is defense-in-depth, but without the query
  exclusion every anonymous sale would burn its attempts against
  `settleOrderOwner` and permanently pin the stuck alarm.
- **Eligible-goods basis is required to earn — and it is the provider's
  number.** `eligible_goods_minor` (nullable) is computed at settlement
  from the provider's settled line items with their discount
  allocations, minus the product-rule exclusions (gift cards, shipping,
  grading fees) — never from our `order_items`, which are the
  pre-discount checkout quote and would earn on money a points code
  already removed. Both earn paths read the column; the
  `goodsMinor ?? subtotalMinor` fallback leaves the earn path, and the
  claw-back ceiling in `refundedGoods` moves to the same column so
  refunds cap against the basis earns were priced on. A null basis
  defers earning and attribution, counted loudly.
- **Money before identity — on the rows the branch already writes.** A
  refund on an unattributed order is recorded by the existing
  `recordRefund`: an ownerless `order_events` refund row under the
  existing unique constraint, plus the `refunded_minor` /
  `refunded_goods_minor` totals under the order row lock. Those rows are
  the durable record and the dedupe — there is no separate
  `order_refunds` table — and ownerless external refund events never
  enter the due queue: the owner-stamping transaction's replay event,
  priced cumulatively from `refunded_goods_minor` under the same lock
  with `source_ref` = the attribution or claim id, is their delivery
  (loyalty's cumulative pricing makes revoke → re-attribute → replay
  exact). Refunds arriving after attribution flow through the queue
  normally. A refund naming an order we never ingested fetches it from
  the Admin API and ingests on the spot, falling back to the existing
  503 only when the fetch fails.
- **The numbers do not ride the queue.** An unattributed external order
  mints no event, so external revenue analytics and the attributed-share
  denominator are reported from the ingestion transaction itself,
  idempotent on the order id. Member-facing history renders an
  attributed POS order as an in-store purchase priced from
  `total_paid_minor` / `eligible_goods_minor` with no line items — never
  "0 items, HKD 0".
- **No new crons.** The existing 5-minute store cron gains the
  external-order sweep and the attribution pass, driven by one
  `attribution_due_at` column that also drains the online orders still
  owed `orderCustomerSet`. The hardcoded "of 2 passes" in the cron's
  failure message becomes the array length.
- **`order_claims` is phase 4, whole and origin-agnostic.** The claims
  table (`UNIQUE (order_id) WHERE revoked_at IS NULL`) exists for what
  only it provides — operator-judgement attribution with revocation —
  and its behavior keys on whether a queued paid event already exists,
  not on the channel: a claim on a web order whose event sits withheld
  stamps the owner and lets that event deliver (the web guest-claim —
  guest checkout already creates this population), while a claim on an
  external order mints under the claim's id; revocation clears the
  member, emits the claw-back, and a re-attribution earns under the new
  claim. Until phase 4, automatic attribution happens once and is undone
  only by the audited admin adjust — stated, not implied. The
  member-facing flow, with receipt-QR proof, is triggered by roughly
  five operator claims a week.

## Environments, apps, credentials

- **Shops**: a second grade10 dev store for staging before phase 1 — two
  environments sharing one shop would fight over unique metafields and
  earn off each other's test sales. Staging today rides the dev shop's
  Admin app, so the split is a full recipe, sequenced before the app-env
  domain flip: a new custom Admin app on the new shop with the same
  scopes, its `SHOPIFY_APP_SECRET` and `SHOPIFY_PRIVATE_STOREFRONT_TOKEN`
  on the staging worker, the committed `SHOPIFY_APP_CLIENT_ID` var edit,
  the metafield definition, webhook registration, and a seeded catalog to
  sell.
- **Apps**: three extension-only Partner apps
  (`grade10-pos-{development,staging,production}`), custom distribution,
  no review. The public client id joins `packages/app-env` as
  `posAppClientId` beside the shop domain (null where no POS app — a
  compile error when missing), and `posGatewayOrigin(brand, deployEnv)`
  joins it: the origin each app's bundle bakes at build time, with
  `development` mapped explicitly to the staging gateway —
  `api.grade10.dev` is local nginx behind a self-signed cert, and a
  till can never reach a laptop — pinned by the baked-origin total-map
  test. The secrets are `SHOPIFY_POS_APP_SECRET`
  and `_PREVIOUS` (rotation without an outage) in a `MEMBERSHIP_SECRETS`
  list only grade10's store app spreads.
- **Scopes** on each shop's Admin app (three, once staging splits):
  `read_customers`,
  `write_customers`, `write_discounts`, `read_orders`, `write_orders`,
  plus the `membership.member_id` metafield definition.
- **Webhooks**: `pnpm run shopify:webhooks` already reconciles
  subscriptions; its topic list becomes derived from the store package's
  exported handled-topics const (two hand-synced lists is the real
  defect), gains `customers/delete` (phase 1) and `customers/merge`
  (phase 3), and its environments gain the dev and new staging shops.
- **The extension** ships from `integrations/shopify-pos/grade10` via
  `shopify app deploy` — outside `apps/` so "everything under `apps/`
  ships through Deploy" stays true; its logic lives in
  `packages/loyalty/backend/src/shopify/pos-frontend` (details in the extension doc).
  Dev-shop iteration stays manual, but before the first production
  activation the publish becomes a `workflow_dispatch` lane — a pushed
  ref, `SHOPIFY_APP_AUTOMATION_TOKEN` in the GitHub environment, per-env
  TOML, a refusal when the baked origin mismatches app-env's map, and
  `x-pos-client` stamped from the sha — so the version contract means a
  commit, not a laptop's working tree.

## Release gates

Recorded with date and tester on a dev shop before the phase that depends
on them ships. Gates 1, 2, 3, 6, and 7 run in **week zero**, before any
fulfiller or ingestion code is written: gate 1 is the single riskiest
assumption in the whole design, and its only fallback is the rejected
store-credit path — watch it before building on it.

1. A customer-scoped `usageLimit: 1` code typed at POS applies at tender
   after the customer is attached and is refused with no customer
   attached (the whole spend mechanism rests on it).
   **Answered 2026-09-13, Echo Chan, staging shop.** Both halves hold.
   A HK$60 code on a HK$780 basket priced at its full value with the
   member on the sale, and at nothing with the member taken off — the
   order falling back to the shop's own 5%, HK$39. Paid POS orders
   #1033 to #1039 name their codes at tender. The evaluation is the
   shop's own, against this basket and this customer; the typing was on
   the admin till bench rather than the POS app.
2. The same code at online checkout on an anonymous cart with
   `buyerIdentity.email` prefilled: does checkout-email matching enforce
   customer eligibility (applies for the scoped customer's address,
   refused for another) — community-attested, never officially
   documented — and does the cart-stage `applicable` flag evaluate
   eligibility at all, or only cart contents (the online abort check
   depends on the answer)? This gate decides online scoping; the
   unscoped contingency is pre-designed either way.
3. A points code cannot buy a gift card; otherwise minted codes are
   restricted to an eligible collection first — this test decides whether
   points are a discount or cash.
4. `combinesWith` refusing other order discounts is tested against a staff
   manual discount at POS; if they cannot coexist, `combinesWith` loosens
   and one-code-per-order moves into the till script.
5. Two terminals cannot both complete one single-use code.
   **Half answered on the POS app (2026-09-13, Echo Chan, staging
   shop).** A code that paid order #1041 was typed on the next sale at
   the same till and refused outright — 無效的折扣代碼, the cart falling
   back to the shop's own 5%. So the shop will not price a completed
   single-use code onto a second sale. What one terminal cannot show is
   the race: two carts holding the code before either tenders, which
   wants a second terminal running the POS app. Gate 10 says what
   happens to the loser — the code is revalidated at tender.
6. POS `orders/paid` and `refunds/create` expose line items well enough to
   compute the eligible-goods basis after discounts — gift-card,
   shipping, and grading-fee lines separable (gates ingestion — without
   it every POS order parks unearning).
7. `customerSet` keyed on the metafield truly upserts — a retry after a
   lost response returns the same customer — and the definition refuses a
   duplicate value.
8. Whether online checkout already creates a customer per buyer (sizes the
   backfill's collision rate and day-one operator load), what a merge does
   to the metafield, and what `customerRequestDataErasure` leaves on a
   customer with orders.
9. `orderCustomerSet` against a completed POS order; customer attach
   landing on `orders/paid`; the extension session-token round-trip.
10. A code deactivated after `addCartCodeDiscount` — is it revalidated
    at tender? The cancel flow's remove-before-deactivate ordering
    assumes nothing; this gate says whether the backstop is platform or
    reconciliation alone.
    **Answered 2026-09-13, Echo Chan, staging shop: revalidated.** Order
    #1039 carried a deactivated HK$60 code and read HK$720 at the tender
    screen; it paid HK$741, naming only the shop's HK$39 automatic. The
    code was larger than what beat it, so nothing but revalidation
    explains the loss. The backstop is the platform. The sale was rung on
    the admin till bench, which creates the order on the shop the way a
    terminal does; the revalidation is the shop's either way.
11. `customerSet` phone-field userErrors: the exact taken and
    invalid-format shapes, and whether the mutation fails whole or
    applies partially — the retry-without-phone degrade must hold under
    either.
12. `customerSet` with the `customId` identifier: confirm the identifier
    writes the member-key metafield itself, and whether any further
    metafield needs a follow-up `metafieldsSet` (the input appears to
    carry no `metafields` field).
13. A merge: does the absorbed customer also emit `customers/delete`, or
    only `customers/merge`? Both handlers stay idempotent under either.
14. `asyncUsageCount` lag in practice, and whether a code applied via
    `addCartCodeDiscount` echoes in `orders/paid.discount_codes[]` with
    the minted casing — the usage feed matches case-insensitively
    regardless.
15. How long an erased customer stays findable after
    `customerRequestDataErasure` acknowledges — sizes the compensation
    interval and the `deletion_stuck` threshold.
16. A customer stored with `+85291234567`: does POS native search match
    staff typing `91234567` and `9123 4567`? And PCD: can the Admin app
    read and write `customer.phone` under the shop's protected-data
    settings? (Phase 3, before the phone arm lights.)

## Delivery order

The headline metric — the attributed share of physical transactions —
needs pairing, ingestion, and Shopify's native customer attach, nothing
from the extension. So the earn loop ships first and the extension is
additive staff UX, not foundation.

0. **Week zero** — the dev-shop gate battery (gates 1, 2, 3, 6, 7), the
   app lineage check, Protected Customer Data selection, the one-way
   `membership.member_id` metafield sign-off, the second staging shop
   recipe, and the store-credit decision recorded. Before any fulfiller
   or ingestion code.
1. **Identity + the earn loop** — pairing (row, upsert-create,
   verified-email adoption gated on the new batched auth RPC,
   `customers/delete` **and** `customers/merge`, admin retry, deletion
   mechanism with the erasure acknowledgment), `membership.join` with
   the loyalty `enroll` RPC exposure, the reconcile lap on the existing
   cron, webhook topic-list unification, the Google secret, the phone
   column + codec + `setPhone`; then — after the reconcile lap has run —
   the `origin` migration, both ingestion arms, inline and pass-driven
   attribution, attached-customer earning, and the attribution-share
   metric, gated on release gate 6 and on the revised programme's
   `channel` recording field.
2. **Points online + join** — `packages/loyalty/backend/src/shopify` appears with the
   code registry and the mint behind `MembershipEntrypoint` (the
   declared cycle starts here), the `shopify_discount` fulfiller minting
   through `context` with per-surface scoping, the usage feed, quantity
   redeem, `pointValueMinor: 100` with the widened rate seam, liability
   in money, caps, the redemption menu on the member card, cart-page
   spend with the inline abort-reversal and `me.reverseRedemption`;
   `/join` + counter card + welcome bonus + welcome email +
   add-to-home-screen (needs the grade10-spec `@grade10/ui` exports and
   the submodule bump; `/join` itself is phase-1-independent — the
   reconcile lap covers early joiners), and the web-push opt-in UX +
   SPA service worker (no frontend requests permission today; email is
   the day-one notification guarantee).
3. **POS** — the extension and its lane: `pos_handles`, the gateway
   (`config` / `identify` / `spendPreview` / `redeem` / `redeemCancel` /
   `applyCode` / `memberBadge` / `markCollected`) with session
   capability sets, the path-scoped CORS change in `createWorkerApp`,
   its rate limiter, the `pos_flags` registry **and its admin surface**,
   the version header, and the server-side `preparing` deadline from the
   first build; `redeemFor` and notifications; the terminal surfaces
   (panel, spend via remove-then-deactivate cancel, open codes, pending
   collections); the collect-in-store fulfilment variant with its
   collection-window expiry pass; the phone vendor-write arm and the
   `{phone}` identify arm, dark behind their pinned-off flags; the
   rollout rehearsal. Recommended: a membership demo over the fake
   `PosHost` — the only runnable rendering of the till flow.
4. **Guest claim** — `order_claims`, origin-agnostic, with revocation
   and the operator surface; the `workflow_dispatch` extension publish
   lane before the first production activation.

Each phase ships value alone; none blocks the previous.

## Doc edits owed at implementation

`commerce.md`: the stale `payment_customers`/`ensureCustomer` section
rewritten to this design, the verified-email adoption carve-out stated,
and a sentence that external ingestion makes unknown `orders/paid`
additive (it already answers 200 and counts a metric). `loyalty.md`: the
liability "points only" row replaced by the two-part number; the decision
record gains the exchange rate (1 point = HKD 1), the collect-in-store
fulfilment variant, and the eligible-goods basis. The `grade10-spec`
store owes the decision rows `loyalty.md` already lists, plus the phone
delta (phone moves from the change's non-goals to a flagged feature) and
the two business metrics with their feeds: attributed share of physical
transactions (`origin` + ingestion-transaction reporting), staff-assisted
redemptions per week (session provenance + the programme's `channel`
dimension).

## Open decisions — the owner's list

- **Phone spending** — when `pos_phone_spend` turns on (recommended
  trigger: SMS verification exists, `phone_verified_at` landing with
  it); the optional set-age rule (a phone works at the POS only N hours
  after it was set — `phone_set_at` is already recorded); and whether
  email sessions keep `markCollected` while phone sessions refuse it
  (today: email yes, phone no — a per-arm capability value).
- **Physical rewards** — the draft marks trigger/conversion/rate TBD;
  also: the collection window length, and stock decrement via zero-value
  sale vs auto 100%-off code.
- **Retention threshold** — already a config field (`retentionPoints`);
  only the number is needed.
- **The one-way switches** — whether a full refund takes back a tier it
  reached, whether an expired unused redemption reclaims its points, and
  whether re-attribution is blocked when its claw-back cannot reach the
  points. Engineering builds both sides of each and gathers them as one
  deployed policy block of the programme config, defaulting to "what
  happened stands"; the owner confirms them later in one pass.
- **External naming** of the two ledgers (status vs redeemable points) —
  display copy only.
- Cap sizes: per-redemption, per-member-day redeem, per-shop-day,
  per-member-day earn; welcome bonus size (direct HKD liability per
  signup); whether an email-identified redemption gets a lower
  per-transaction cap than a QR one.
- Code validity length per reward; session and QR TTLs (engineering
  default: 10-minute one-time QR, 10-minute terminal session); the
  open-codes-per-member cap.
- Whether staff may earn as members (decides exclusion vs the weekly
  report alone).
- Whether till staff are asked to capture email when creating a customer
  (~10 seconds; the only field that links history to a later
  registration).
- Whether the customer-details block joins the first POS activation or
  follows a week later; the post-purchase receipt-screen earn preview is
  after launch.
- A named person for the weekly 30-minute ops slot (conflicts, parked
  fulfilments and collections, operator claims); nobody named means parked
  members nobody notices.
- The `membership.member_id` metafield definition is one-way on a
  production shop — sign-off before it is created anywhere.
- The deliberate binding cycle is an ops trade (fresh environments deploy
  loyalty twice) versus a second Admin credential or a premature worker —
  sign-off with eyes open.
- Erasure is admin-driven by design: nothing schedules the store's erase,
  so an operator working the console checklist is the whole deletion story.
