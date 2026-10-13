**Author:** @ecchochan - 2026-09-10

## Why

The wallet passes are built and deployed to staging. Nobody can save one yet:
neither wallet's issuer account exists, so the save action stays configured
off in every environment. And a member whose phone is gone cannot end the
pass that was on it: ending is a member action, from a page they can no longer
reach.

Metric: passes saved per week, per wallet, once that wallet is enrolled.

## What Changes

- **Operator ending** - an operator holding `store:write` ends one wallet's
  pass from the member's record, which names the wallets the member holds; the
  audit trail records who ended which wallet and when.
- **Google issuer enrolment** - the issuer account, its publishing access, and
  the class a pass issues from.
- **Apple enrolment** - the Developer Program enrolment, the pass type
  identifiers, the signing certificate, and the pass artwork. The save
  action's own artwork is carried by draw-wallet-save-artwork
  (`decisions.md` Q12).
- **One real-device push test** - settling which credential a pass push takes
  and which push header is right, against one enrolled iPhone.
- **The deployed secrets check** - each wallet secret is expected where
  `packages/app-env` records that wallet's issuer for the brand and
  environment, and the APNs key and its key id wherever the Apple issuer is
  recorded and no `WALLET_APPLE_APNS` client certificate is bound, so
  `pnpm run secrets --check` fails, naming each missing secret, on a
  deployment that cannot issue a pass; it then runs against the real
  deployment.

## Non-Goals

In `decisions.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `grade10-site/store/wallet-member-card` - adds operator ending from the
  member's record in the console, and holds the launch check to each wallet
  whose issuer is recorded.

## Impact

- **Members whose phone is gone** have the pass on it ended by an operator,
  rather than left identifying them.
- **Operators holding `store:write`** - staff and admins - gain an ending on
  the member's record, recorded in the audit trail.
- **Google** needs an issuer account, publishing access, and an approved
  class before any member can save a pass.
- **Apple** needs a Developer Program enrolment, pass type identifiers, a
  signing certificate, and artwork before any member can save a pass; the
  enrolment is the slow step.
- **Offering a pass** - the durable requirements 'A member carries their card
  in Google Wallet' and 'A member carries their card in Apple Wallet' already
  offer a wallet only where its issuer is recorded; enrolment meets them, so
  the page's two 🚧 Offered lines need no delta.
- **Component exports** - no `@grade10/ui` export changes; the
  `WalletPassLinks` change that draws each wallet's artwork is
  draw-wallet-save-artwork's (`decisions.md` Q12).
- **Consumers** - the Grade10 admin console, the Grade10 and ZZZ store
  workers (`apps/backend/zzz/store/src/secrets.ts` spreads the wallet
  secrets), and the secrets tooling (`scripts/secrets`,
  `packages/utils/src/config.ts`).
- Delivery detail is in this change's `tech-design.md`.

No domain impact: the store domain suite walks US-06 and US-08 to a spend at
the till, and this change moves no requirement on either path; the operator
ending is this capability's own journey, its audit row stated by its own
requirement.
No platform impact: no path crosses a product.

## References

- [Member Card in a Wallet · Wallets](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#wallets)
- [Member Card in a Wallet · Adding and Ending](../../../docs/prds/products/grade10-site/loyalty/wallet-member-card.md#adding-and-ending)
- [Audit Trail](../../../docs/prds/products/grade10-admin/audit/index.md)
