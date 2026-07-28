# Add payment dialog components

PRD: [`docs/prds/payments/payment-dialog-components.md`](../../../docs/prds/payments/payment-dialog-components.md)

## Why

Bull Bear's payment UI is currently coupled to stores, wallet state, routes, and analytics. Portable controlled dialogs let it retain that orchestration while sharing the experience.

## Scope

- Add controlled checkout, confirmation, processing, outcome, and plan-activation dialogs plus reusable payment primitives.
- Export prop types, document consumer mapping, add Storybook coverage, and publish generated package output.

## Consumer impact

`@acetrader/pred-spec-ui` gains backward-compatible exports. Bull Bear supplies formatted pricing, eligibility, copy, callbacks, and links through an adapter.

## Non-goals

No wallet/API/store/routing/analytics integration or fiat identity and OTP verification.
