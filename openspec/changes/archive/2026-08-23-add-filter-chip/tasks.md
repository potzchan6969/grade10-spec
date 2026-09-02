# Tasks: FilterChip

One group. The header groups this change once carried are dropped — see the
disposition below.

## 1. FilterChip primitive

- [x] 1.1 Add `FilterChip` under `packages/design-system/src/components/forms/`
      with size `md` / `sm`, `selected` and `disabled` as boolean gates, and a
      `trailing` slot.
- [x] 1.2 Cover both sizes against selected, disabled, and trailing in stories.
- [x] 1.3 Add the Code Connect template against `4313:28` mapping every option
      of every VARIANT property, including the `state` axis that maps to
      nothing.
- [x] 1.4 Export `FilterChip` from the design-system package entry.

Verify: `pnpm run typecheck`, `pnpm run lint`,
`pnpm run test:stories:design-system`. Landed in `d7c534f` and `db9ea42`, and
carried in the submodule pin `730b7be` that grade10 deploys.

## Dropped: the product list header redesign

`sync-product-list-page` replaced this header layout and shipped it, so the
two groups below were never started and are not deferred:

- **Header contract** — a required `title`, sort options as chips with a
  paired second activation, `chipFilters`, and `selectFilters`. The shipped
  header has no title prop, one sort dropdown, and dismissible applied-filter
  chips, all covered by the durable `shared/ui/store-product-listing`
  requirement.
- **Preview assembly** — supplying `title` and wiring header filter groups.
  Nothing to wire.
