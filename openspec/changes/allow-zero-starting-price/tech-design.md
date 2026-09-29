## Context

Four checks in `grade10` refuse a starting price of 0 today, and none of them
is a database constraint: `auction_listings.starting_price` is a nullable
`bigint` with no check.

| Where | What refuses 0 |
| --- | --- |
| `packages/grade10-auction/admin-frontend/.../ListingEditor.tsx` | `priceError` - `amountMinor > 0`, "must be an amount above zero" |
| `packages/grade10-auction/backend/src/trpc/routers/listings.ts` | `startingPrice: positiveInt` on the draft, update and create inputs |
| `packages/grade10-auction/backend/src/services/listings/draft.ts` and `schedule.ts` | `isMinorAmount` from `@grade10/utils/money` - `> 0` |
| `packages/grade10-auction/contracts/src/admin.ts` | the test-bid listing's `startingPrice: positiveMinorUnits`, and `testBids.ts`'s `startingPrice > 0` eligibility |

The read-back already copes: `displayed()` formats any non-null amount
through `formatMinor`, so 0 reads as a zero amount (Q6).

Two bidding paths read the starting price as a price, and both break at 0:

- **`bidFloor`** returns `startingPrice` before any bid. That follows the
  old wording of `grade10-site/auction/auction`, which this change rewrites
  (Q12): the first bid is the starting price plus its tier increment on
  every start. At 0 the old floor takes a first maximum of 1 minor unit -
  the one-minor-unit first bid the decisions rule out.
- **`resolveStandingMaxima`** stands a lone maximum at `startingPrice`, so a
  0 start writes a bid of amount 0, which `bids`' own check
  (`maximum > 0 AND amount > 0`) refuses; bidding on the lot fails. `topAmount
  = 0` is also the "no bid yet" sentinel read by `bidFloor`, `history.ts`,
  `ListingsPanel` and the catalogue card, so a standing price of 0 would read
  as no bid.

## Goals / Non-Goals

**Goals:**

- A 0 start through the form, the API, the draft and schedule services, and
  the sandbox test-bid tool.
- A first-bid floor of the starting price plus its tier increment on every
  start (Q12), so a 0 start opens at the currency's lowest increment (Q1).
- A lone maximum on a 0 start standing at that increment, never 0 (Q4).

**Non-Goals:**

- Moving the lone-maximum price on a positive start: it stays the starting
  price, as `grade10-site/auction/auto-bidding` states.
- A migration: no column, check or backfill changes.

## Decisions

1. **The first-bid floor is `nextBidAmount` of the starting price**
   - The specs govern the amount: the first-bid minimum in
     `grade10-site/auction/bid-increments`, which the rewritten
     `grade10-site/auction/auction` requirement now names (Q12).
   - `bidFloor`'s no-bid branch returns `nextBidAmount(currency,
     startingPrice)` - 21000 on an `HKD` start of 20000, 100 on a `USD` start
     of 0. Every reader of the published minimum (`publicState`, the
     listings repository, `accountRecord`, `testBids`) already goes through
     `bidFloor`, so they move together.
   - Alternatives rejected: a 0-start special case in `bidFloor` that leaves
     positive starts at the starting price (keeps the app contradicting the
     spec and the Bidding page).

2. **One lone-maximum price helper in the contracts package**
   - The spec governs it: `grade10-site/auction/auto-bidding`, on Q4.
   - Add `openingPrice(currency, startingPriceMinor)` beside `nextBidAmount`
     in `packages/grade10-auction/contracts/src/bidIncrements.ts`: the
     starting price when it is above 0, else `nextBidAmount(currency, 0)` -
     100 `USD`, 1000 `HKD`, 100 `JPY`. `resolveStandingMaxima`'s lone-leader
     branch (`resolvedAmountMinor` and its public record) and the demo's
     `FakeAuctionService` call it, so the demo and the service cannot drift.
   - Alternatives rejected: a special case inline in the resolver and the
     demo (two places to forget the third); storing the opening price on the
     listing (a derived value in a second column).

3. **A non-negative whole amount for the starting price only**
   - The specs govern the rule: 0 or more, whole minor units, empty only
     while draft.
   - One local check in `services/listings/`, shared by `draft.ts` and
     `schedule.ts`: a safe integer, 0 or more. The tRPC inputs reuse the
     router's existing `nonNegativeInt` for `startingPrice` only. The refusal
     text becomes "starting price must be whole minor units, 0 or more", code
     `INVALID_PRICING` unchanged.
   - Alternatives rejected: relaxing `isMinorAmount` (every bid, hold and
     payment amount relies on it staying above 0); a new public helper in
     `@grade10/utils/money` for two auction callers; relaxing `positiveInt`
     wholesale in the router.

4. **Empty stays null end to end**
   - The spec governs it: an empty price is refused at create and never
     stored as 0 (Q8).
   - The form keeps `null` for an empty field and `0` for an entered 0;
     `priceError` refuses `null` when required and accepts `>= 0`. The
     create input stays non-nullable, so an absent or null price fails the
     schema, and a string fails `Schema.Int`. Nothing in the path coerces
     with `||` or `Number("")`; the tests assert both sides.
   - Alternatives rejected: an empty string decoded to 0 at the edge.

5. **Sandbox test bids take a 0 start**
   - `testBids.ts` drops its `startingPrice > 0` eligibility and the contract
     reuses its existing `nonNegativeMinorUnits`; `minimumNextAmount` stays
     positive, because `bidFloor` now adds the tier increment.

## API Contracts

| Procedure | Field | Before | After |
| --- | --- | --- | --- |
| Listing draft save and update | `startingPrice` | `nullish(positiveInt)` | `nullish(nonNegativeInt)` |
| Listing create | `startingPrice` | `positiveInt` | `nonNegativeInt` |
| Admin test-bid listing read | `startingPrice` | `positiveMinorUnits` | `nonNegativeMinorUnits` |

Additive widening: every client that sent a valid value still does.
`packages/api-docs/generated/auction.json` is regenerated.

## Risks / Trade-offs

- [Risk] A reader still treats `startingPrice` as truthy and hides a 0 →
  Mitigation: a sweep found no truthy reads in `packages` or `apps`; the
  admin and site tests render a 0 start and assert a zero amount, not "—".
- [Risk] A lone leader at 0 writes a zero-amount bid and the insert fails →
  Mitigation: `openingPrice` is never 0, and `bids`' `amount > 0` check
  stays as the backstop.
- [Risk] `topAmount = 0` keeps meaning "no bid" → Mitigation: the lone
  leader stands at the opening price, above 0, so the sentinel still holds.
- [Risk] A published lot with no bid yet has its floor rise by one tier
  increment at deploy, so a collector who read the old minimum is refused →
  Mitigation: the refusal already names the new minimum (`AMOUNT_TOO_LOW`
  with `minimumNextAmount`), and the page reads the same `bidFloor`. The
  `placeBid` and `autoBidding` specs that bid at the starting price are
  rewritten to the new floor in the same group.
- [Risk] Q4 is answered the other way → Mitigation: the helper is the only
  place the lone-leader amount is decided, so the change is one line and its
  tests; standing at 0 would also need the `bids` check and the sentinel
  reworked, which the answer would have to carry.

## Migration Plan

Deploy the backend before the admin frontend, so a form that sends 0 never
meets a service that refuses it. The floor change takes effect for every
unbid lot on the backend deploy; no data moves. Rollback is the reverse; a listing already
created at 0 stays valid under the old read path, and bidding on it needs the
new `bidFloor`, so the backend rolls back only while no 0-start listing is
published.
