**Author:** @constance - 2026-09-02

## Why

A collector who reaches a live lot's bid panel cannot tell what they must do
before their first bid is accepted — sign in, link a card, or attest their
age — or when those steps are finished. That ambiguity shows up as abandoned
setup after sign-in and support questions about whether a saved card from
another auction already counts on this lot. The success measure is the share
of signed-in collectors who complete lot enrollment and reach a bid-ready
panel without abandoning setup.

## What Changes

- Record the bid panel's enrollment states, what triggers each transition,
  and how the linked-card slot behaves before and after the first bid on a
  lot.
- Require age attestation once per account inside the setup modal, with the
  attestation pre-checked when a collector changes a card they already
  attested on a prior lot.
- Allow a collector to change the linked card only before their first bid on
  that lot; after the first bid the linked card is shown without a change
  control.
- Record shared UI exports for the setup modal, linked-card row, and empty
  linked-card slot, and how the bid card signals signed-out versus
  bid-ready enrollment.
- Cross-reference `grade10-auction/bid-payment-method` for authorization and
  `grade10-auction/auto-bidding` for maximum mechanism disclosure on the bid
  panel.

## Non-Goals

- Payment authorization, hold amounts, provider outcomes, or card data
  persistence — `grade10-auction/bid-payment-method`.
- Sign-in mechanics, session cookies, or email delivery — `shared-auth`.
- Auto-bidding rules, maximum raises, or overtaken standing —
  `grade10-auction/auto-bidding`.
- Replacing the card after the collector's first bid on a listing.
- A general account payment-method manager outside the bid panel.

## Capabilities

### New Capabilities

- `grade10-site/auction/bid-panel-enrollment`: Collector-facing enrollment
  states and trigger moments on the listing bid panel.

### Modified Capabilities

- `shared/ui/auction-listing`: Export contracts for enrollment presentation
  blocks and the bid card's enrollment signal.

## Impact

- `openspec/specs/grade10-site/auction/bid-panel-enrollment/spec.md` (new).
- `openspec/specs/shared/ui/auction-listing/spec.md` (enrollment exports).
- `@grade10/ui`: enrollment blocks already prototyped under
  `packages/ui/src/blocks/auction-listing/`; this change records the
  contract they must satisfy.
- `apps/preview` and Storybook: static stories under
  `Auction Listing/Bid Panel` become the review surface once an engineer
  promotes this change and writes `ui-design.md`.
- `@grade10/auction-frontend` (consumer): owns session, enrollment
  completion, and when each state is passed into the shared blocks.
- `add-auction-bid-card-authorization`: its non-goal on card replacement
  should be narrowed at promotion so it does not forbid change before the
  first bid on a listing.
