## Screens

### Order History (filled)

[Figma frame `4835:1534`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534&m=dev)

### Order History (empty)

[Figma frame `4923:3424`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424&m=dev)

The order-detail frame is a linked destination of View Details, not an
order-history state; its separate visual contract is outside this UI map:
[Figma frame `4835:1654`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1654&m=dev)

## Components

### Existing `@grade10/design-system` exports

- `Nav`, `Footer` — application chrome, composed by the page assembly.
- `Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbSeparator` — account location.
- `Badge` — composed by `OrderHistoryStatus` for order fulfillment status.
- `Button` — Track Order, View Details, and Shop Now actions.
- `EmptyState` — zero-order page body.
- `VStack`, `HStack` — page, card, and item composition.

### Existing `@grade10/ui` exports

| Export | Figma source |
| --- | --- |
| `OrderHistoryStatus` | Product / Order / Order Status (`4872:8537`) |
| `OrderHistoryLineItem` | Product / Order / Order Item line (`4901:3026`), including Product / Image (`4872:8386`) |
| `OrderHistoryCardHeader` | Product / Order / Order Item Header (`4863:8260`) |
| `OrderHistoryCard` | Product / Order / Order Item card (`4872:8325`) |
| `OrderHistory` | Main content of the filled and empty order-history frames |

All listed exports, variants, and tokens already exist in `grade10-spec`; this
change adds no shared UI implementation work. The existing durable contract is
[`shared-ui/store-order-history`](../../../specs/shared-ui/store-order-history/spec.md).

## States

| State | Spec scenario |
| --- | --- |
| Filled, Active and Past both present | `grade10-site-store-shopify-commerce-SC-22`; `shared-ui-store-order-history-SC-01` |
| One section omitted when its list is empty | `shared-ui-store-order-history-SC-02` |
| Empty account with zero orders and Shop Now | `shared-ui-store-order-history-SC-05` |
| Track Order visible for a trackable shipment | `grade10-site-store-shopify-commerce-SC-14`; `shared-ui-store-order-history-SC-03` |
| Track Order hidden for a non-trackable or past order | `grade10-site-store-shopify-commerce-SC-13`; `shared-ui-store-order-history-SC-10` |
| Payment and shipping remain distinct in order status | `grade10-site-store-shopify-commerce-SC-13`, `grade10-site-store-shopify-commerce-SC-14`, `grade10-site-store-shopify-commerce-SC-15` |
| Another customer's order is refused and a permanent URL requires sign-in | `grade10-site-store-shopify-commerce-SC-20`, `grade10-site-store-shopify-commerce-SC-21` |

The shared `OrderHistory` compound has no loading or error branch; those states
remain application-owned and are not drawn by the supplied Figma frames.

Figma samples that use `paid` / `delivered` / `cancelled`, show two empty-state
buttons, or use unrelated breadcrumb content do not change the contract. Use
the six status values and the single Shop Now action defined by the durable
shared UI spec.
