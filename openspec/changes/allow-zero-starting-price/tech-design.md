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

- **`bidFloor`** returns `startingPrice` before any bid. That is the opening
  price (Q4, Q12) on every non-zero start, and `grade10-site/auction/bid-increments`
  is rewritten to say so; at 0 it takes a first maximum of 1 minor unit - the
  one-minor-unit first bid the decisions rule out.
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
- One opening price - the starting price, or the lowest increment on a 0
  start - read by the first-bid floor and the lone maximum (Q4, Q12).

**Non-Goals:**

- Moving the first-bid floor or the lone-maximum price on a non-zero start:
  both stay the starting price.
- A migration: no column, check or backfill changes.

## Decisions

1. **One opening-price helper in the contracts package**
   - The specs govern the amount: the first-bid minimum in
     `grade10-site/auction/bid-increments` and `grade10-site/auction/auction`,
     the lone-maximum price in `grade10-site/auction/auto-bidding` - all the
     opening price (Q4).
   - Add `openingPrice(currency, startingPriceMinor)` beside `nextBidAmount`
     in `packages/grade10-auction/contracts/src/bidIncrements.ts`: the
     starting price when it is above 0, else `nextBidAmount(currency, 0)` -
     100 `USD`, 1000 `HKD`, 100 `JPY`. `bidFloor`'s no-bid branch,
     `resolveStandingMaxima`'s lone-leader branch (`resolvedAmountMinor` and
     its public record) and the demo's `FakeAuctionService` all call it, so
     the floor, the standing price and the demo cannot drift. Every reader of
     the published minimum (`publicState`, the listings repository,
     `accountRecord`, `testBids`) already goes through `bidFloor`.
   - Alternatives rejected: a 0-start special case inline in each path
     (three places to forget one); storing the opening price on the listing
     (a derived value in a second column); `nextBidAmount` of the starting
     price for every first bid (the round's first call, reversed by Q4).

2. **A non-negative whole amount for the starting price only**
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

3. **Empty stays null end to end**
   - The spec governs it: an empty price is refused at create and never
     stored as 0 (Q8).
   - The form keeps `null` for an empty field and `0` for an entered 0;
     `priceError` refuses `null` when required and accepts `>= 0`. The
     create input stays non-nullable, so an absent or null price fails the
     schema, and a string fails `Schema.Int`. Nothing in the path coerces
     with `||` or `Number("")`; the tests assert both sides.
   - Alternatives rejected: an empty string decoded to 0 at the edge.

4. **Sandbox test bids take a 0 start**
   - `testBids.ts` drops its `startingPrice > 0` eligibility and the contract
     reuses its existing `nonNegativeMinorUnits`; `minimumNextAmount` stays
     positive, because `bidFloor` now returns the opening price.

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
- [Risk] A test pins the first bid at the starting price plus its increment
  → Mitigation: none in `grade10` does today; the floor tests assert the
  opening price on a 0 and a non-zero start.

## Migration Plan

Deploy the backend before the admin frontend, so a form that sends 0 never
meets a service that refuses it. Only 0-start lots see a new floor; no data
moves. Rollback is the reverse; a listing already
created at 0 stays valid under the old read path, and bidding on it needs the
new `bidFloor`, so the backend rolls back only while no 0-start listing is
published.
