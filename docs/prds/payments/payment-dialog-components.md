# Portable payment dialogs

## Summary

Bull Bear needs a reusable, app-neutral set of payment dialogs that preserves its crypto and fiat checkout, confirmation, and result experiences without coupling consumers to wallet, checkout-provider, or application state.

## Goals

- Let a consumer render checkout, confirmation, processing, success, and failure dialogs from display-ready props alone.
- Preserve accessible modal, form, tab, timeline, link, and action behavior at narrow widths.
- Keep payment policy, network selection, API calls, redirects, timers, analytics, and notifications outside the package.

## Non-goals

- Fiat identity collection, phone/country validation, and email OTP verification.
- Wallet connectivity, balances, price quotes, hosted checkout, or transaction submission.

## Experience and requirements

### Primary flow

1. The consumer opens a crypto or fiat checkout dialog with normalized pricing, details, promotion, and CTA state.
2. A crypto consumer may render transaction confirmation steps; a fiat consumer may render a non-dismissible processing state.
3. The consumer replaces checkout with a generic outcome or a plan-activation result after its own payment flow resolves.

### Acceptance criteria

- [ ] Every consumer-observable state is represented by props and callbacks.
- [ ] Checkout tabs, promotion actions, close behavior, links, and result actions are keyboard accessible.
- [ ] The package contains no app stores, APIs, wallet clients, routing, analytics, browser storage, or countdown-derived product state.
- [ ] Bull Bear can map all in-scope source dialogs to portable exports without copying presentation markup.

## UI component contract

| Component | Required states | Consumers |
| --- | --- | --- |
| PaymentDialog | controlled open/close and dismissibility | Bull Bear and future apps |
| CryptoPaymentCheckoutDialog | loading/ready pricing, controlled token selection, promo/action states | Bull Bear |
| FiatPaymentCheckoutDialog | ready pricing, promo/action states | Bull Bear |
| Confirmation, processing, outcome, activation dialogs | consumer-provided progress/outcome/action data | Bull Bear |

## Accessibility and content

- Dialogs use `role="dialog"`, labelled titles, Escape/backdrop close only when dismissible, initial focus, and focus containment.
- Consumers provide all product copy, URLs, labels, formatted amounts, icon nodes, and localized descriptions.
- Dialog panels remain usable at narrow viewport widths and allow internal scrolling.

## Decisions and open questions

| Item | Status | Decision |
| --- | --- | --- |
| Fiat OTP and identity form | Decided | Excluded because validation and verification policy are app-owned. |
| Claim-window retries | Decided | Consumers resolve eligibility into explicit outcome actions. |

## Rollout and risks

Bull Bear should adopt the exports through a thin adapter and retain its existing flow integration tests. New public exports are backward compatible; consumers must import the package stylesheet.
