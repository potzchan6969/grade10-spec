**Author:** @constance - 2026-09-02

## Why

A collector who reaches a live lot's bid panel cannot tell what they must do
before they can choose a maximum — sign in, or link a card — and when they have
no card on file they can still pick amounts they cannot commit. That shows up
as abandoned setup after sign-in and support questions about whether a saved
card from another auction already counts. The success measure is the share of
signed-in collectors who link a card once and reach a bid-ready panel on later
lots without repeating setup.

## What Changes

- Record the bid panel's enrollment postures: signed out; signed in with no
  linked card (amount controls visible but disabled; primary CTA opens
  link-card setup); signed in with a card on file (amount controls enabled;
  prior card carries over to new lots).
  - Reposition the setup modal as link-card plus age attestation only — no hold
    is taken in setup. English title **Link a card to bid**, body **Link a card
    for bidding. When you set a maximum, we authorize a hold for that amount.
    You are only charged if you win.**, continue **Link Card**.
- Allow change of the linked card until the first bid on that lot; lock the
  card after the first bid on that lot.
- Authorize and hold only when the collector commits a maximum, in the
  background with no confirmation modal; surface provider decline, unusable
  method, network failure, raise-hold failure, and expired-hold-on-raise as
  errors on or near the bid CTA.
- Reuse a linked method across listings by default; do not force a new
  selection on every lot.
- Record shared UI exports for the setup modal, linked-card row, empty slot,
  and a `needs-card` enrollment signal on the bid card.
- Cross-reference `grade10-site/auction/bid-payment-method` for hold lifecycle
  and `grade10-site/auction/auto-bidding` for maximum mechanism disclosure.

## Non-Goals

- Payment hold amounts, provider persistence, or capture — detailed under
  `grade10-site/auction/bid-payment-method` (this change only aligns first-bid
  selection and silent authorize-on-commit).
- Sign-in mechanics, session cookies, or email delivery — `shared-auth`.
- Auto-bidding rules, maximum raises, or overtaken standing —
  `grade10-site/auction/auto-bidding`.
- Replacing the card after the collector's first bid on a listing.
- A general account payment-method manager outside the bid panel.

## Capabilities

### New Capabilities

- `grade10-site/auction/bid-panel-enrollment`: Collector-facing enrollment
  postures and trigger moments on the listing bid panel.

### Modified Capabilities

- `shared/ui/auction-listing`: Export contracts for enrollment presentation
  blocks and the bid card's enrollment signal (`signed-out`, `needs-card`,
  `ready`).

## Impact

- `openspec/specs/grade10-site/auction/bid-panel-enrollment/spec.md` (new).
- `openspec/specs/shared/ui/auction-listing/spec.md` (enrollment exports).
- Manual page
  `docs/prds/products/grade10-site/auction/bid-panel-enrollment.md`.
- `add-auction-bid-card-authorization`: its
  `grade10-site/auction/bid-payment-method` delta is aligned in the same
  product decision — silent authorize on commit, reuse linked method across
  lots, bid-CTA error outcomes. That change owns the payment-method
  requirement ids.
- `@grade10/ui`: enrollment blocks under
  `packages/ui/src/blocks/auction-listing/`; this change records the contract
  they must satisfy.
- `apps/preview` and Storybook: Need Card and setup stories become the review
  surface once an engineer promotes this change and writes `ui-design.md`.
- `@grade10/auction-frontend` (consumer): owns session, linked-card state, and
  when each posture is passed into the shared blocks.
