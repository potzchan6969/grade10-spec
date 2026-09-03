## Screens

### Order History (filled)

https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4835-1534

### Order History (empty)

https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4923-3424

## Components

### Existing design-system (compose only)

- `Nav`, `Footer` — page chrome in `apps/preview`
- `Breadcrumbs`, `BreadcrumbItem`, `BreadcrumbSeparator`
- `Badge` — under `OrderHistoryStatus` (`outline` / `info` / `warning`; completed, canceled, and refunded share outline; shipped and pickup share info)
- `Button` — Track (default + trailing `ArrowUpRight`), View Details (outline), Shop Now (secondary)
- `EmptyState` — empty page body
- Layout: `VStack` / `HStack`

### New `@grade10/ui` exports (work in grade10-spec)

| Export | Figma |
| --- | --- |
| `OrderHistoryStatus` | Product / Order / Order Status (`4872:8537`) |
| `OrderHistoryLineItem` | Product / Order / Order Item line (`4901:3026`); embeds Product / Image (`4872:8386`) |
| `OrderHistoryCardHeader` | Product / Order / Order Item Header (`4863:8260`) |
| `OrderHistoryCard` | Product / Order / Order Item card (`4872:8325`) |
| `OrderHistory` | Main content of both page frames (not Nav/Footer) |

## States

| State | Spec scenario | Notes |
| --- | --- | --- |
| Filled, both sections | shared-ui-store-order-history-SC-01 | Active + Past |
| One section omitted | shared-ui-store-order-history-SC-02 | Empty list → hide section |
| Empty (zero orders) | shared-ui-store-order-history-SC-05 | `EmptyState` + Shop Now |
| Track visible | shared-ui-store-order-history-SC-03 | `trackOrder` true (shipped) |
| Track hidden | shared-ui-store-order-history-SC-10 | Past / non-shipped cards |

**Documented Figma drift (do not implement):** Header description lists
`paid` / `delivered` / `cancelled`; Status set is
`completed` · `shipped` · `processing` · `pickup` · `canceled` · `refunded`.
Empty-state Code Connect sample shows two buttons; the empty frame shows one Shop Now.
Breadcrumb Code Connect sample is unrelated; annotations say Account / Your Orders.
