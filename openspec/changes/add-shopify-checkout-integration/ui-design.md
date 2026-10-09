## Screens

### Grade10 Cart Drawer

- **Design reference** - Existing `@grade10/ui` CartDrawer, its item rows, tender controls, loading button and feedback; no block replacement, new badge, export or token.
- **Current facts** - Opening refreshes member cart and tender; Pay waits for cart and tender writes and the current review and quote.
- **No points** - Existing tender controls show no points spent as a valid choice, with or without an accepted store code; Pay sends no points field.
- **Submission** - One pending Pay per drawer, with the submitted lines and tender fixed. Edits use existing controls; an answer for an older basket, tender or member opens nothing.
- **Lost answer** - Existing failure feedback; no automatic retry. The drawer claims neither that no invoice exists nor that one was canceled.
- **Settling** - A settling answer opens Your Orders, which polls the open purchase.

### Grade10 Orders

- **Status** - Keep existing shared badges and labels. Pending settlement stays visible and polling; add no Awaiting payment badge.
- **Cart refresh** - Paid observation invalidates member cart/tender; authoritative reads may return empty or a later cart with choices intact.
- **Shop review** - Price or stock review alone still returns an empty bought cart and default tender after payment; later member edits or a rebuilt cart keep their choices.
- **Cancellation** - Show canceled only when an order read reports it, never from an edit response alone.

### Shopify Confirmation

- **Return** - Existing Thank You/Order status extensions and static Grade10 Your Orders link.

## Components

| Export | Owner | Role |
| --- | --- | --- | --- |
| Existing CartDrawer and copy | `@grade10/ui` | Cart, tender and checkout feedback |
| Existing OrderHistory and OrderDetails | `@grade10/ui` | Supplied order facts and status |
| Existing feedback and account action | Grade10 drawer host | Verification, refusal and failure |
| Shopify extension Link | Existing Shopify extension package | Static orders return |
| Existing feedback/status labels | `@grade10/i18n` | Localized copy; no new badge |

## States

| State | Shows | Anchor | Scenario / Disposition |
| --- | --- | --- |
| Opening drawer | Existing loaders until current cart, tender and live facts answer | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-01`, `grade10-site-store-checkout-SC-33`; current read before ready and reload preserves purchase identity, `grade10-site-store-checkout-SC-49` |
| Ready basket | Current lines, accepted tender including no points, estimate; shipping/tax left to Shopify | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-02`; accepted tender and subtotal estimate, `grade10-site-store-checkout-SC-50`, ordinary no-points handoff `grade10-site-store-checkout-SC-61` |
| Pending cart or tender write | Unavailable Pay and current-value treatment | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-39`, `grade10-site-store-checkout-SC-41`; writes acknowledged and server decision current, `grade10-site-store-checkout-SC-53`, `grade10-site-store-checkout-SC-58` |
| Pending Pay response | Loading Pay; no duplicate submission | grade10-site-store-checkout-US-05 | `grade10-site-store-checkout-SC-34`; synchronous and rendered request guard |
| Changed line or failed read | Named refusal or unchecked facts and Retry | grade10-site-store-checkout-US-02 | `grade10-site-store-checkout-SC-03`, `grade10-site-store-checkout-SC-04`, `grade10-site-store-checkout-SC-39`; named refusal, unchecked held facts and Retry, `grade10-site-store-checkout-SC-51`, `grade10-site-store-checkout-SC-52`, `grade10-site-store-checkout-SC-53` |
| Verification required | Existing threshold feedback and profile action | grade10-site-store-checkout-US-01 | `grade10-site-store-checkout-SC-37`; existing gross-goods threshold/account action, `grade10-site-store-checkout-SC-57` |
| Hosted invoice ready | Open the supplied hosted URL only for the current request | grade10-site-store-checkout-US-05 | `grade10-site-store-checkout-SC-05`, `grade10-site-store-checkout-SC-33`, `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-40`; new/reused handoff only for matching current context; no canceled or superseded URL |
| Settling | Existing order surface; poll open orders only | grade10-site-store-checkout-US-05 | `grade10-site-store-checkout-SC-12`, `grade10-site-store-checkout-SC-19`, `grade10-site-store-checkout-SC-48`; existing order facts, terminal replay without creation |
| Changed cart during Pay | Keep the current drawer; no stale redirect or automatic new Pay | grade10-site-store-checkout-US-06 | `grade10-site-store-checkout-SC-35`, `grade10-site-store-checkout-SC-41`; ignore stale effects and refresh without automatic Pay |
| Paid cart without later member edits | Empty drawer and default tender after authoritative reads, including a shop price or stock review | grade10-site-store-checkout-US-03 | `grade10-site-store-checkout-SC-13`, `grade10-site-store-checkout-SC-47`, `grade10-site-store-checkout-SC-62`; shop review alone allows conversion |
| Paid older cart version | Later lines and tender preserved after authoritative reads | grade10-site-store-checkout-US-06 | `grade10-site-store-checkout-SC-36`, `grade10-site-store-checkout-SC-45`; later lines/tender remain |
| Canceled older invoice | Canceled state from backend order read | grade10-site-store-checkout-US-06 | `grade10-site-store-checkout-SC-42`, `grade10-site-store-checkout-SC-43`; canceled only from authoritative order read |
| Signed-out collector | Existing sign-in action; no checkout creation | grade10-site-store-checkout-US-04 | `grade10-site-store-checkout-SC-06`; existing sign-in action, no order creation, `grade10-site-store-checkout-SC-54`, `grade10-site-store-checkout-SC-55` |
| Shopify confirmation | Static orders link | grade10-site-store-checkout-US-03 | `grade10-site-store-checkout-SC-15`; both static orders links |
| Loading, failed or empty orders | Existing loading, error/Retry, empty/Shop now | **Out of suite:** existing order-page contract and Grade10 OrderHistoryPage tests | **Out of suite:** existing customer order-page contract and Grade10 OrderHistoryPage tests; no order is invented by recovery |
