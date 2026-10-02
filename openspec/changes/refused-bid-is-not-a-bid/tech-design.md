## Context

See [proposal.md](proposal.md#why) for the motivation and
[decisions.md](decisions.md) for what the interview settled. Every path below
is the application repository's unless it says `grade10-spec`.

- **Placement** - `packages/grade10-auction/backend/src/services/bidding/placeBid.ts`
  judges a bid in one transaction under the listing row lock and answers
  accepted or refused before it returns. A refusal writes no bid, no
  `bid_action_logs` row, no `bidder_listing_status` row and no listing
  version. No Stripe call is made at bid time
- **The refusal log** - `placeBid()` logs `auction bid refused` once per
  refusal. Today it names only `listingId` and `errorCode`
- **The bid form** - `bidRefusalCopy` maps each code to the bid form's own
  words, under the bid action. `usePlaceBid` reads the bidder's standing
  after a transport failure and resolves as placed when it holds the
  maximum sent
- **Erasure** - `restandAfterWithdrawal` withdraws an erased bidder's
  standing bids under each running lot's lock and moves the lead to the
  highest maximum left, never raising the price
- **History paging** - `repositories/bidHistory.ts` ends a combined-history
  page on a whole action group (grade10#789)

## Decisions

- **The log names the bidder, the amount and the limit** - `placeBid()` adds
  `storefront`, `userId` and `maximumMinor` to the line, and the refusal's
  own `minimumNextAmount` or `ceilingMinor` when it carries one. Fields are
  picked one by one, never spread from the request, which also carries the
  bidder's email and name. The line stays `console.info`: it is an
  operational record, not an alarm
- **The database refuses refusal rows** - an auction migration deletes the
  `manual_bid_requested`, `manual_bid_refused` and `automatic_max_refused`
  rows and the `pending` and `lost` standings staging wrote, and tightens the
  `type` and `standing` checks to the five types bidding-history names. The
  `failure_code` column is held null and dropped in a later release, once no
  running writer names it (Q5)
- **No new store** - the log is the operators' record (Q7). Nothing counts
  refusals, so no table or metric is added
- **Tests carry the ids** - the tests that already prove each new or changed
  scenario take its id in their title, following `<scenario-id>: <title>`
  for unit and db tests and `[<case-id>] <title> · <scenario-id>` for e2e. A
  test citing a retired id moves to the id that replaced it
- **The missing proofs are written** - the scenarios no test proves today
  get one: a lone maximum left after an erasure stands at the opening price,
  a losing bidder is never charged, and a refused maximum records no Bid
  Placed

## Risks

- **Personal data in logs** - the line names a user id, never an email or a
  name; erasure does not reach logs, which age out under the log retention
- **Changes in flight** - `complete-auction-post-sale`,
  `define-public-auction-identifiers`, `close-overdue-address-confirmation`,
  `clarify-auction-shipping-progress-copy`,
  `add-winner-partial-payment`, `carousel-auction-list-featured`,
  `add-winner-order-tax-line` and `refine-auction-order-cancellation` touch
  capabilities this change folds. Each reconciles at its own acceptance,
  which refuses a requirement that moved since it began
- **The lost-answer race** - the standing read can run before the bid's
  commit and call a placed bid unplaced. The follow-on "Retrying a bid
  safely" closes it; this change states what runs
