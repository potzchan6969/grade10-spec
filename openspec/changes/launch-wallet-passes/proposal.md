**Author:** @ecchochan - 2026-09-10

## Why

The wallet passes are built and deployed to staging. Nobody can save one yet
— neither wallet's issuer account exists, so the save action stays configured
off in every environment. And a member who loses their phone has no way to
end the pass that was on it: ending is a member action today, with no console
surface for an operator to do it on their behalf.

Metric: passes saved per week, once a wallet is enrolled.

## What Changes

- **Operator ending** — an operator can end a member's pass from the console,
  under the permission an elevated act requires, recorded like any other.
- **Google issuer enrolment** — the issuer account, its publishing access, and
  the class a pass issues from.
- **Apple enrolment** — the Developer Program enrolment, the pass type
  identifiers, the signing certificate, the save badge, and the pass artwork.
- **One real-device push test** — settling which credential a pass push takes
  and which push header is right, against one enrolled iPhone.
- **The deployed secrets check** — `pnpm run secrets --check` runs against the
  real deployment's credentials, not a fixture's.

## Non-Goals

- **NFC** — neither wallet's certified-reader path is in scope.
- **Spending or collecting from an Apple pass** — durable code, identifies
  only; unchanged from what shipped.
- **A save offer on the welcome message** — the page decided against it.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/wallet-member-card` — adds operator ending from the
  console.

## Impact

- **Members who lose a phone** gain a way to have their pass ended without
  waiting for it to lapse on its own.
- **Operators** gain an elevated console action, recorded like any other.
- **Google** needs an issuer account, publishing access, and an approved
  class before any member can save a pass.
- **Apple** needs a Developer Program enrolment, pass type identifiers, a
  signing certificate, and artwork before any member can save a pass; the
  enrolment is the slow step.
- Delivery detail carries over from the archived change's tech design:
  `openspec/changes/archive/2026-09-10-add-google-wallet-member-card/tech-design.md`.

## References

- [Member Card in a Wallet · Wallets](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#wallets)
- [Member Card in a Wallet · Adding and Ending](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#adding-and-ending)
