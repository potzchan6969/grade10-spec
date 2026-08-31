## Context

`CartDrawer` already fetches status and price on open (`onFetchStatusAndPrice`
or controlled `loading`), shows Boneyard skeletons while loading, and treats
`soldOut` / `adjusted` as visible rows. Consumers own cart line state and
respond to `onRemoveItem`. The design-system ships `Toaster` (Sonner wrapper);
stories today import `toast` from `sonner` directly. See `proposal.md` for
motivation; behavior lives in
[`shared-ui/store-cart`](../../specs/shared-ui/store-cart/spec.md) (delta).

## Goals / Non-Goals

**Goals:**

- After loading ends, clear `unavailable` lines through the existing remove
  callback and show one toaster message from consumer copy.
- Keep sold-out and adjusted rows unchanged.
- Let the drawer import `toast` from `@grade10/design-system` next to `Toaster`.

**Non-Goals:**

- Mounting `Toaster` inside `CartDrawer` (apps and stories mount it once).
- Detecting Shopify 下架 inside the shared component.
- New Figma frames for an unavailable row (none is shown).

## Decisions

### `unavailable` on `CartItemStatus`

**Choice:** Extend status with `"unavailable"`; consumer sets it when refresh
finds the product gone from the catalogue.

**Alternatives rejected:**

- Consumer filters `items` and only signals a toast — splits cleanup from the
  drawer that owns post-loading UX.
- Separate `removedItemIds` prop — duplicates what status already expresses
  for `soldOut` / `adjusted`.

### Silent remove after loading, never paint the row

**Choice:** When loading becomes false, for each `unavailable` id call
`onRemoveItem` once; exclude `unavailable` from the rendered list so skeletons
never resolve into a sold-out-style row. Toast once if any id was cleared.

**Alternatives rejected:**

- Show the row then animate out — contradicts “silently” and confuses with
  sold-out.
- Remove during loading — totals and badge would change under skeletons.

### Toast via design-system `toast` + app-level `Toaster`

**Choice:** Re-export `toast` from the Sonner overlay module; `CartDrawer`
calls `toast(copy.unavailableItemsRemoved)`. Position `bottom-right` is set on
the mounted `Toaster` (story and consuming app).

**Alternatives rejected:**

- Import `toast` from `sonner` inside `@grade10/ui` — bypasses the primitive
  and adds a direct dependency.
- Callback-only toast — forces every consumer to reimplement the same string
  and timing.

## Risks / Trade-offs

- **[Risk] App forgets to mount `Toaster`** → Mitigation: story documents
  `Toaster position="bottom-right"`; without it, remove still runs, toast is
  a no-op.
- **[Risk] Exhaustive status switches break** → Mitigation: called out as
  **BREAKING** in the proposal; add `unavailable` beside existing cases.
- **[Risk] Double toast if `items` keep returning `unavailable`** → Mitigation:
  toast only on the loading `true → false` transition for ids present at that
  moment; after `onRemoveItem` the consumer must drop those lines.

## Migration Plan

1. Land design-system `toast` re-export and cart drawer behavior + story in
   grade10-spec.
2. Consuming app: add `unavailableItemsRemoved` to copy, mount `Toaster` at
   `bottom-right`, map delisted products to `status: "unavailable"` on cart
   refresh, handle `onRemoveItem` as today.
3. Rollback: revert the submodule bump; old drawer ignores unknown status if
   a partial deploy leaves mixed versions — prefer shipping copy + status
   mapping with the bump.
