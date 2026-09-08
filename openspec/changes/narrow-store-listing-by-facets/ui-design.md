# UI design

Behaviour is
[`specs/grade10-site/store/product-listing/spec.md`](specs/grade10-site/store/product-listing/spec.md);
technical decisions are [`tech-design.md`](tech-design.md). This file holds the
frames, the exports each composes, and the states each carries.

## Screens

### Filter panel

[Figma `Filter Panel` — `4288:13952`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4288-13952)

The listing's sidebar: a heading, a search field, one checkbox list per facet
group the catalogue names, and the utility row beneath them.

### The listing around it

[Figma `ProductBrowse` — `4098:1952`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1952),
inside [`Product List` — `4098:1868`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4098-1868)

Unchanged by this change. The grid, the result header, the applied-filter chips
and the sort dropdown are already what the site draws; only what fills the
sidebar and what the header's chips carry change.

## Components

Every export this change composes already ships, and every node in the frame is
Code Connected to it. **No component, variant or token is missing** — nothing
here is work in `grade10-spec`'s `packages/`.

| Export | Package | Draws |
| --- | --- | --- |
| `ProductBrowse` | `@grade10/ui` | The surface, sidebar and results together |
| `FilterPanel` | `@grade10/ui` | The sidebar, and the utility row under it |
| `ProductFilter` | `@grade10/ui` | The heading, the search field, the groups |
| `ProductListHeader` | `@grade10/ui` | The count, the applied chips, the sort trigger |
| `CheckboxListInput` | `@grade10/design-system` | One choice and its count, at `size="sm"` |
| `Link` | `@grade10/design-system` | `size="sm"` for the group expander; `variant="secondary" size="xs"` for a utility link |

Types the page supplies rather than draws: `FilterGroup`, `FilterOption`,
`FilterSelection`, `AppliedFilter`, `SortOption`, `UtilityLink`, `AsyncState`.

Two things the panel does **not** decide, and the page therefore must:

- **How many choices a group shows.** `ProductFilter` renders every option it
  is handed and caps nothing; `expandLabel` and `onGroupExpand` are the
  affordance, and which group is capped and at what number is the site's —
  `SC-16`.
- **Which utility links appear.** `FilterPanel` renders the ones it is given
  and drops the row when the list is empty.

## States

| State | What renders | Scenario |
| --- | --- | --- |
| Groups loading | Five skeleton rows in place of the groups; search already usable | — the panel's own, no site behaviour |
| Groups ready | One checkbox list per group, in the catalogue's order, each choice with its count | `SC-10` |
| Worlds beyond five | Five choices and `See all worlds`; taking it offers every world | `SC-16` |
| Types, any length | Every choice, no expander | `SC-16` |
| No group to draw | No checkbox list and no message; search and sort still offered | `SC-12` |
| A collection in force | The collection as a dismissible chip in the result header, no collection control in the sidebar | `SC-03`, `SC-08` |
| A facet in force | The choice ticked, the chip in the header, the address naming it | `SC-11` |
| No order in force | The sort trigger says nothing is chosen | `SC-15` |

`ProductFilter` renders a message for its `empty` state, so `SC-12` is served
by handing it a **settled, empty** list rather than the empty state — see
`tech-design.md`, "An empty taxonomy is `ready`, never `empty`".

## The utility row

The frame draws `Help`, `Shipping` and `Orders & Returns` under the panel — the
short names of three links the footer's HELP column already names in full
(`contact`, `shippingDelivery`, `orderStatus`), the way the footer's legal bar
already shortens `privacyPolicy` and `termsOfService` to `privacy` and `terms`.

[Figma `Store Utility Links` — `4343:15624`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4343-15624)

The site answers none of the three addresses yet, so each is drawn against
`UNWRITTEN` — the one value the site already gives a link it owes, so a sweep
for what is still owed has one thing to look for. The footer's own help column
is drawn the same way. Each becomes a real address as its page lands, with no
further change to this surface.

❓ `grade10-site/site/page-shell` states that a link appears only where the site
answers its destination (`grade10-site-site-page-shell-SC-10`, `-SC-11`,
`-SC-12`). The footer already departs from it under the `UNWRITTEN` convention
and this row now does too, so the requirement and what ships have parted
company. Settling that — a carve-out for a link the site openly owes, or
removing the convention — is the page-shell capability's, not this listing's.
