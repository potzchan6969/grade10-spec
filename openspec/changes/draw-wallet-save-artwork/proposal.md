**Author:** @ecchochan - 2026-10-07

## Why

The save action on `/membership` is the card's own text button. Apple's and
Google's brand guidelines expect each wallet's own artwork, and Google's
publishing review may refuse a pass without it.

The durable requirement 'A member carries their card in Apple Wallet' offers
the pass wherever the pass type identifier and certificate are set. The page
and the worker also need the push credential and `WALLET_PASS_AUTH_KEY`, so
one fact is stated two ways.

Acceptance signal: Google's publishing review accepts the save action, and the
Apple requirement names the configuration the page and the worker name.

## What Changes

- **The save action's artwork** - `WalletPassLinks` draws Apple's "Add to
  Apple Wallet" badge and Google's "Add to Google Wallet" button in place of
  the text button, as the Designer confirms or redraws them (R1).
- **The Apple offer's condition** - 'A member carries their card in Apple
  Wallet' withholds the pass wherever the pass type identifier, the
  certificate, the push credential or `WALLET_PASS_AUTH_KEY` is missing, as
  the page and the worker already do.

## Non-Goals

In `decisions.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/wallet-member-card` - the save action draws each
  wallet's own artwork, and the Apple offer needs the push credential and
  `WALLET_PASS_AUTH_KEY`.

## Impact

- **Members on `/membership`** see each wallet's own artwork as the save
  action.
- **Component exports** - `WalletPassLinks` and its wallet type in
  `@grade10/ui` change.
- **Artwork source** - ❓ the component draws the artwork for a wallet the
  consumer names, or takes it from the consumer. Dev settles it in the tech
  design, after R1.
- **Consumers** - the Grade10 site's membership page
  (`apps/frontend/grade10/src/pages/membership/sections/MemberCardSection.tsx`
  in grade10). ZZZ issues no pass.
- **Order** - accepted after launch-wallet-passes, whose tasks 5.9 and 6.10
  wait on this change and whose group 7 needs both; and after
  add-account-profile, which also modifies 'A member carries their card in
  Apple Wallet', so this change builds on that text. It lands before
  launch-wallet-passes' group 7.

## References

- [Member Card in a Wallet · Adding and Ending](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#adding-and-ending)
- [Member Card in a Wallet · Wallets](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#wallets)
