# UI: remove collection banner

## Screens

- [Product / Collection Banner `4248:5104`](https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=4248-5104)
  — the published set still draws the hero; code no longer exports or
  renders it.
- Preview product list page (`apps/preview` **Pages / Product List Page**) —
  assembly is `Nav`, `ProductBrowse`, `Footer`. No Figma page frame is the
  source of that stack.

## Components

| Export | Package | Notes |
| --- | --- | --- |
| `CollectionBanner` | `@grade10/ui` | **BREAKING:** export, stories, Code Connect template, and fixture removed. |
| `ProductBrowse` | `@grade10/ui` | Unchanged. Still receives `title`. |
| `ProductListHeader` | `@grade10/ui` | Unchanged. Collection name is `title`. |
| `Nav` | `@grade10/design-system` | Unchanged. |
| `Footer` | `@grade10/design-system` | Unchanged. |

No new component, variant, or token.

## States

| State | Spec scenario |
| --- | --- |
| Public entry has no `CollectionBanner` | An application imports the surface |
| List, filter panel, header, and card still render alone | A part is reused alone |
