## Context

`CartItem` already renders `copy.lowStockWarning` whenever
`item.status === "adjusted"`. Status is consumer-owned; the shared row must not
mutate cart product state. See `proposal.md` for motivation; behavior lives in
[`shared-ui/store-cart`](../../specs/shared-ui/store-cart/spec.md) (delta).

## Goals / Non-Goals

**Goals:**

- Hide the low-stock warning as ephemeral acknowledgment UI after the shopper
  changes quantity on that row.
- Re-show when status re-enters `adjusted`.
- Keep `onQuantityChange` / `onRemove` contracts unchanged.

**Non-Goals:**

- Timeout dismiss, sold-out / unavailable changes, new props for dismiss.

## Decisions

### Local dismiss flag on `CartItem`

**Choice:** Track whether the shopper has dismissed the current `adjusted`
acknowledgment with React state inside `CartItem`. Set it when the stepper
fires `onValueChange`. Reset it when `item.status` transitions into
`adjusted` (including after leaving `adjusted`).

**Alternatives rejected:**

- Consumer-only clear of `status` — correct for remount, but leaves the warning
  up until the parent re-renders; the row can hide immediately as presentation
  state without owning product status.
- Timeout — fails the acknowledgment job and a11y.
- New `onDismissAdjustedWarning` callback — overkill; quantity edit is the
  dismiss signal.

### Consumer clears `adjusted` for remount

**Choice:** Document in the delta that apps clear `adjusted` → `default` on
quantity edit (and may on drawer close after the warning was shown). The shared
component does not call a status setter.

**Alternatives rejected:**

- Inventing a status-write callback on `CartItem` — product state stays in the
  app.

## Risks / Trade-offs

- **[Risk] App leaves `adjusted` forever** → Remount / reopen re-shows the
  warning. Mitigation: delta + Impact call out clearing status; stories cover
  in-row dismiss.
- **[Risk] System cuts qty again without flipping status** → Warning stays
  hidden until status re-enters `adjusted`. Mitigation: consumers re-assert
  `adjusted` (or toggle off then on) when a new reduction is applied.

## Migration Plan

1. Land `CartItem` dismiss behavior + stories in grade10-spec.
2. Consuming apps: on `onQuantityChange` / remove for an `adjusted` line, set
   status to `default`; optionally clear on drawer close after the warning was
   shown.
3. Rollback: revert the submodule bump; old rows keep showing the warning while
   `adjusted`.
