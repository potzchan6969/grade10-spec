# Shopify POS UI extension

The staff-facing loyalty terminal at the till. The umbrella plan
(`shopify-membership-pos.md`) owns the decisions this implements — notably
the session model: identification by QR, short code, email, phone, or a
customer already on the cart opens a short authorized terminal session,
and spending only ever takes a session. Portal-minted
discount codes validate inside the POS natively; the terminal can also
apply a member's open codes and complete physical-reward collections.

## App topology

- Three **extension-only apps** (Shopify CLI, Partners org, custom
  distribution — single store each, no review):
  `grade10-pos-{development,staging,production}`. Each carries the POS UI
  extension and nothing else — no server, no scopes, no Direct API access;
  till devices stay dumb on purpose.
- The existing Admin app keeps what it has (Admin API, webhooks,
  storefront token). Admin-created apps cannot carry extensions.
- Public client ids live in `packages/app-env` as `posAppClientId` beside
  the shop domain; the verification secrets are `SHOPIFY_POS_APP_SECRET`
  and `_PREVIOUS` in `MEMBERSHIP_SECRETS`, spread only by grade10's store
  app. Each app's bundle bakes its gateway origin from
  `posGatewayOrigin(brand, deployEnv)` at build time — `development`
  maps explicitly to the staging gateway, because `api.grade10.dev` is
  local nginx behind a self-signed cert and a till can never reach a
  laptop; the baked-origin total-map test pins every value.
- `shopify app deploy` publishes a version; a manager activates it per
  location in POS settings and pins the tile. Dev-shop iteration is
  manual, and the lane is named in the deploy picker's preview — it is
  not a Cloudflare deploy. Before the first production activation the
  publish becomes a `workflow_dispatch` lane: a pushed ref,
  `SHOPIFY_APP_AUTOMATION_TOKEN` in the GitHub environment, per-env TOML,
  a refusal when the baked origin mismatches app-env's map, and
  `x-pos-client` stamped from the sha — the version contract means a
  commit, not a working tree.

## Where the code lives

`integrations/shopify-pos/grade10` is the whole project — the CLI shell and
everything testable in it. It was going to be split, with the logic in a
`packages/` sibling, and it is not: the wire contract landed in
`store-contracts/pos` rather than in membership, and nothing outside this
extension ever imports the flow. A package with one consumer belongs to that
consumer, and the split would have bought a second `package.json` and a lane
argument in exchange for nothing.

- `src/` holds what is asserted: the flow state machine (`till/`), the five
  acts and their screens (`acts/`, built on `till.actContext()`), the gateway
  client and the hand-rolled decoders (`gateway/`), the `PosHost` port and its
  fake (`host/`), and the bundler, size gate and baked-origin check (`build/`).
  Tests are colocated and run against the fake host with no `shopify` global.
  The port is `sessionToken`, `staff`, `cart`, `onCart`, `setCustomer`,
  `addCartCodeDiscount`, `removeCartDiscount` — the Cart API has no per-code
  removal, so the port names the non-targeted call the platform offers,
  deterministic here because our codes refuse other order discounts — plus
  `onScan`, `scannerSources` and `toast`.
- `extensions/till/` is the thin CLI half: the TOML, three target entry files,
  Polaris web-component rendering (API 2026-07 — the React
  `retail-ui-extensions` model is deprecated; copy no sample using `useApi()`).
  The entries read the vendor global and call `mountTill`; everything else is
  behind the port.
- The contracts are imported **type-only** and no `effect`/wire-codec graph is
  bundled. The build carries a byte-budget assertion, named in the
  `integrations/*/*` check rules, so the manual lane cannot ship a blown bundle
  silently.
- It sits outside `apps/` so everything under `apps/` still ships through
  Deploy. The workspace globs, root typecheck, `check-lib-wiring`, the shared
  source walks (`scripts/lib/sources.mjs`) and the lane resolver
  (`scripts/test/lanes.mjs`) all gain `integrations/*/*`, and the check rules
  are in the application repository's `docs/conventions/packages.md`: no
  `deploy:*` script, a lane-reachable
  test script or a named exemption, a build the publish workflow runs, the size
  gate inside that build, and no browser dialog anywhere.

## Surfaces

| Target | Job | Spends? |
| --- | --- | --- |
| `pos.home.tile.render` | static tile; badge only for "membership unavailable" | no |
| `pos.home.modal.render` | the whole staff flow: identify, panel, spend, open codes, collections | yes — via session |
| `pos.customer-details.block.render` | read-only badge (name, tier, balance) for any paired customer staff find in Shopify's own search | never |

The customer-details block is the attribution and no-signal fallback: it
reverse-maps a customer id through the gateway, shows enough to attach a
sale, and never returns codes or opens a session.

## Identification — presentations and sessions

One `pos_handles` table backs both token kinds, rows consumed by a guarded
`UPDATE … WHERE consumed_at IS NULL RETURNING` — replay is dead by
construction, no KV, no second token format.

- **Presentation**: minted for the signed-in member by the member card —
  rendered as the QR and as an 8-character short code beneath it. TTL 10
  minutes: the card auto-refreshes every ~2 minutes while online, so the
  TTL is really the offline grace for a card opened at the door. Scanning
  or typing it consumes it; the consuming location and time are recorded,
  a second till gets a distinct `presentation_already_used` refusal naming
  them, and the member's own card shows "used at [location] [time]".
- **Reading the QR**: whatever the counter has. POS reports its sources —
  `camera`, `external`, `embedded` — and all three arrive on one stream, so a
  scanner beside the terminal or built into it reads a card with nobody
  touching the screen, from any screen of the modal. The camera is an overlay
  a button opens: the fallback where the device also has a scanner, the way in
  where it is the only reader, and absent where there is no camera at all. A
  POS too old to report its sources offers both.
- **Short code**: the 22 digit-free Crockford base32 letters, 8
  characters (~2^35.7 — an all-numeric code at 10^8 would be
  brute-forceable, and confusable digits are folded out of staff
  typing). Ten failed attempts in five
  minutes pauses code entry for that shop (keyed on the authenticated
  shop, never the staff label), counted and alerted — against that cap,
  attempts-to-first-hit is unreachable. It exists to defeat
  the most likely daily failure — a scanner that won't read a dim screen.
- **Email**: an exact address typed by staff — no prefix search, no
  browsing; a miss says only "no member found", never distinguishing
  unpaired from nonexistent. It proves nothing about who is standing at
  the till, so the session it opens is stamped `email` and leans on the
  containment below.
- **Phone**: an exact number typed by staff, normalized through the same
  shared codec the profile uses — behind `pos_phone_identify`, **off by
  default** in the typed flag registry, with `pos_phone_spend` pinned
  off beside it. Same containment as email (claimed identity, uniform
  miss, rate-limited, audited) — and more enumerable than email, which
  is why the arm ships dark and its provenance tags every metric.
- **Cart**: a customer already on the sale, by provider reference —
  Shopify's own customer search, or the till's own `setCustomer` after an
  earlier identify. No staff action: the till reads the cart when the
  modal opens and watches it after, behind `pos_cart_identify`, dark by
  default. Two switches, like phone: the arm identifies, and
  `pos_cart_spend` — also dark — is what lets it spend. Without it a cart
  session sees a balance and hands over rewards, and nothing more. The
  second switch is the point: the till attaches the member to the sale on
  every successful identify, so a one-switch cart arm would re-open a
  phone or email member at full capability on the next cart edit, around
  a spend switch the owner deliberately left off. It proves neither
  presence (unlike a scan) nor a typed claim (unlike email or phone) —
  the trust argument is that staff already found and tapped this exact
  person in Shopify's own search. It never runs over a live session, and
  it never writes to the cart: the customer is already there, so it
  confirms rather than attaches. It is not throttled, because the
  identifier is one the provider resolved rather than anyone guessing,
  and because a cart miss is an ordinary non-member customer — pausing
  the arm on that would stop a shop attributing its sales.
- **Session**: opened by `identify` whichever way it was fed. One
  identification instantly authorizes the terminal to act for that member
  — panel, spend, cancel, applying codes, collection — for a short TTL
  (default 10 minutes, config), bound server-side to the shop, the
  member, and its lifetime — never to the claimed staff label, which is
  client-supplied and changes mid-transaction when staff switch by PIN;
  the per-call label lands on every audit row instead. It ends early on
  a new identify or closing the modal; spend, then cancel, then spend
  again needs no second scan. It is identification,
  not a per-action token: mutations inside it are idempotent on
  gateway-issued intents. No step ever asks the member to confirm on
  their own device — but an identification the member did not present
  for (email, phone, or cart) notifies them instantly, a receipt one
  step earlier than the spend receipt. Every session carries its provenance
  (`qr` / `code` / `email` / `phone` / `cart`) onto audit rows and every
  `store.pos.*` metric, and a **capability set** computed at identify
  (provenance × flags) is the one enforcement path for every arm: a
  spend-off session is refused `redeem`/`redeemCancel` server-side and
  its panel omits open-code *text* — code text is spendable value, so
  applying an open code is the gateway's `applyCode` procedure
  (session-taking, audited, member-notified), never a client-local act a
  flag cannot reach. Email-provenance spending keeps its emergency ops
  flag — on by default; phone-provenance spending is off until the owner
  turns it on (its sessions still serve lookup and attribution), and
  phone spend-off also refuses `markCollected` while email keeps it — a
  per-arm capability value, owner-confirmable. Cart-provenance carries
  its own spend flag too, dark like phone's and for the same reason: the
  arm proves nothing the shop chose.
  `redeem`, `redeemCancel`, `applyCode`, and `markCollected` take the
  session; nothing takes a user id.

## The modal flow

```
idle ──scan QR / type code / type email──► panel
        (tier, balances, window progress, renewal + active-until dates,
         recent activity, affordable items, open codes, collections)
          │  setCustomer → cart signal confirms
          ├─ spend: one tap "use max" or an amount
          │    confirm screen → redeem → code applies
          ├─ open codes: one tap — `applyCode` answers the text, applies
          └─ collections: verify → confirm → collected
```

- **Or auto-attached.** A customer already on the sale — Shopify's own
  search, not a scan — drops the modal straight into `panel`, whether
  they were there when it opened or arrived after. Lookup only until
  `pos_cart_spend` is on as well.
- **Attach first.** Spend and apply stay disabled until `cart.customer`
  matches the paired ref; the spend action attaches on the way if needed.
  The modal reads `cart.cartDiscounts` before offering spend, so a staff
  manual discount is surfaced as "can't stack" up front, not at tender.
  Third precondition: cart total ≥ the amount (the code's minimum subtotal
  is its own value). Each unmet precondition shows its reason.
- **Spend.** "Use max" pre-fills `min(balance, cart total)`; a field takes
  another amount. The confirm screen faces the member as a read-back —
  *Spend N · you pay HKD X · balance after Y · earns ~Z* — and staff tap
  it; nothing asks the member to touch their own device. The preview is
  computed server-side and returns the intent the redeem submits, pinning
  the amount, so a double-tap replays instead of double-spending. The
  button locks on submit.
- **The code arrives synchronously in the normal case**: the gateway waits
  on a redemption-scoped fulfilment pass and answers the code; the
  extension applies it and confirms against `cart.cartDiscounts`, never
  the promise (the Cart API documents no rejection semantics). The wait
  is bounded server-side — a config deadline in the wire contract, after
  which the gateway answers `preparing` itself, so the client's timeout
  is never the arbiter of "points spent and safe". A
  `preparing` answer shows "points spent and safe — code in under a
  minute"; re-tapping is the same idempotent call and returns the code
  once minted. There is no poller and no status endpoint.
- **Abandoned sale**: the code stays valid, customer-scoped and
  single-use, listed under open codes next visit; expiry is final per the
  program's policy — points return only through an admin cancellation.
- **Mistake**: `redeemCancel` in the same session — last redemption only,
  audited, refused once the order carrying the code is seen. The cart
  comes first: the extension removes the applied discount
  (`removeCartDiscount()`), confirms absence against the cart signal,
  and only then does the gateway deactivate and credit — refused while
  the cart still shows the code (whether a deactivated applied code is
  revalidated at tender is a release-gate question; the ordering assumes
  nothing). Shopify has
  no synchronous tender read, so a cancel inside the propagation window
  is caught by the usage feed reading webhook-fed order data — a
  reversed redemption whose code later lands on an order raises a loud
  mismatch for the admin claw-back;
  redeeming again after a cancel needs no new scan.
- **Collection**: a pending physical reward shows reward name, points
  paid, and redeemed date; staff verify it matches the request and
  confirm; `fulfilledAt` and the staff label land in loyalty's record. A
  second till gets a distinct already-collected refusal naming when and
  where. A redemption past its collection window shows as expired, not
  collectable.
- **The member's phone buzzes** on every staff-assisted redemption and
  every collection (points, amount, location — never the code text) — a
  receipt, never a gate; on an email session it is also the member's only
  proof of presence, which is why it is not optional.

## Gateway — tRPC on the store worker

Served by a router `packages/loyalty/backend/src/shopify` exports; grade10's store
app mounts it, zzz mounts nothing. Procedures: `config`, `identify`
(`{qrToken} | {shortCode} | {email} | {phone} | {customerId}` → session +
panel, shaped by the session's capability set), `spendPreview`
(`{session, points}` → the read-back numbers + the intent), `redeem`
(`{session, intent}` — answers the code, or `preparing` after a
config-bounded server-side deadline, so the client's timeout is never
the arbiter of "points spent and safe"), `redeemCancel`
(`{session, redemptionId}`), `applyCode` (`{session, redemptionId}` →
the code text, audited and member-notified — open-code application is a
gateway act, not a client-local one),
`memberBadge` (`{customerId}`), `markCollected`
(`{session, redemptionId}`).

- **Auth**: the extension's session token per request (fresh each call —
  they expire in one minute): HS256 against the POS app secret (and
  `_PREVIOUS`), `aud` = this environment's `posAppClientId`, `dest` = its
  own shop domain. What that authenticates is the shop, so the principal
  is `pos` — `SERVICE_PRINCIPALS` in the auth contracts, outside `ROLES`,
  holding exactly `membership:identify`, `loyalty:redeem-for`, and
  `loyalty:collect`; no human role can ever carry it. `staffMemberId` and
  `locationId` are claimed labels for the audit trail, never
  authorization.
- **`posProcedure`** stands on the same audit-by-construction middleware
  as `elevatedProcedure`: a POS call without an audit sink refuses to
  run — reads included, because a typed identifier is disclosure.
  Identify lands in the store's chain, the redemption and collection in
  loyalty's, joined on the session id (a redemption also carries its
  intent id); actor is `pos:<shop-domain>` in both; provenance is on
  every row.
- **Rate limiting ships in the first build**: one Cloudflare rate-limit
  binding keyed on the authenticated shop — email lookup is enumerable in
  a way one-time tokens never were — plus the short-code attempt cap
  above. A burst of lookup misses is counted and alerted
  (`store.pos.lookup_miss`).
- **Kill switches**: a `pos_flags` table (key, enabled, updated_at,
  updated_by) behind a typed in-code registry declaring every key and
  its default — an absent row reads as the code default, so a fresh
  environment needs no seeding and "off by default" is a reviewable code
  fact; a row records only an operator's deviation, flipped from the
  admin panel in seconds (the flags admin surface is a named phase-3
  build item — the 30-second rehearsal flip needs a surface to flip).
  Registry: `pos_enabled: true`, `pos_email_spend: true`,
  `pos_phone_identify: false`, `pos_phone_spend: false`,
  `pos_cart_identify: false`, `pos_cart_spend: false`. Enforced here
  on every request through the session capability set; the modal reads
  the same flags only to render the unavailable states nicely; a row
  for a key the registry no longer declares surfaces loudly in admin.
- **Version contract**: every build stamps `x-pos-client`; below the
  configured minimum the gateway answers a distinct refusal the extension
  renders as "update the POS app". The contract is additive-only, and the
  client version tags every `store.pos.*` metric so a stale fleet is
  visible. All of this is in the first build — it cannot be retrofitted.
- **CORS** for Shopify's extension CDNs on this router alone — which
  requires a named change in the shared worker package:
  `createWorkerApp` grows a path-scoped exemption so the POS router
  mounts its own credential-less policy and the worker-wide credentialed
  policy skips that path (widening `corsOrigins` for the CDNs would
  grant credentialed cross-site reads to every cookie-authenticated
  store route). Latency
  budget: identify p95 ≤ 800 ms, membership fanning out to pairing, auth,
  and loyalty in parallel — measured from the first dev-shop test; never
  fixed by a cached balance in the gateway, and the gateway's own serial
  writes are fair game — flag read, handle claim, and session insert may
  batch into one transaction, with the audit append surviving the
  handle-claim rollback (a failed identify still records what was
  attempted).

## Degradation

- **Shop offline**: nothing helps — the sale is a guest sale, repaired by
  operator attribution; the failure card says so.
- **Member's phone offline or dead**: email identifies them for lookup,
  earning, collection, and — flag permitting — spending; the short code
  covers a card loaded at the door (good for 10 minutes). Shop wifi with
  the member card as the captive-portal landing page is an ops checklist
  line.
- **Backend down / flag off**: tile badge flips, modal renders
  unavailable, the sale proceeds as guest — attach is native and earning
  rides the webhook, so points still arrive for an attached customer even
  with the gateway dark.

## Launch

- **Paper**: a laminated card per till — card won't scan → type the
  8-character code; no phone at all → ask for the email on their account,
  and confirm the panel's name matches the person before reading anything
  aloud; "already used at …" → ask them to refresh their card; code slow →
  "points are spent and safe, we can wait or it applies next visit";
  membership unavailable → "system's offline, not your points — normal
  sale, keep the receipt, we'll add them after"; manual discount → "they
  can't stack, I'll take it off first". Standing rules: never redeem
  before the cart is final; attach the member before the first scan;
  email is the field that links a till-created customer. The on-call
  phone number is printed on it.
- **Rehearsal on real hardware** before first activation: scanning a dim
  screen behind a screen protector, the email path end to end, the
  manual-discount case through to tender, the short-code path with the
  scanner blocked, a collection with confirmation, and the kill switch
  flipped from admin in under 30 seconds.
- **Rollout**: dev shop → staging shop → one production location, watching
  server-derived apply-confirmations (from the order webhook carrying the
  code — truth at tender) against redeems, split by session provenance;
  the
  manager stopwatches ten transactions in week one, the only instrument
  that sees member fumble time.

## Open decisions

The umbrella's open-decisions list carries everything, including this
doc's items: the customer-details block's activation timing, the
email-vs-QR cap question, and the post-launch receipt-screen earn
preview.
