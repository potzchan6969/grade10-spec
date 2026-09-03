# Design: store home blocks

## Figma sources

| Block | Figma | Node |
| --- | --- | --- |
| Page frame | Store | `4171:9023` |
| Hero | Hero Section | `4171:9051` |
| Section header | Collections Header | `4195:1048` |
| Collection bento | Collection Cards | `4195:1050` |
| Product row | Product grid | `4171:11916` (reuses `ProductCard`) |

Store Nav collection cards (`4396:2889` / set `4396:5759`) are a different
pattern — image nav cards — and are out of scope.

## File layout

```
packages/ui/src/blocks/store-home/
  store-home-hero.tsx
  store-home-hero.stories.tsx
  store-home-hero.figma.ts
  store-section-header.tsx
  store-section-header.stories.tsx
  store-section-header.figma.ts
  store-collection-tile.tsx
  store-collection-tile.stories.tsx
  store-collection-tile.figma.ts
  store-collection-grid.tsx
  store-collection-grid.stories.tsx
  types.ts
  fixtures.ts
  audit.json
  store-home-hero.fixture.png
```

## Component decisions

### `StoreHomeHero`

- Fixed height `470px`, `rounded-4xl`, background image + left-to-right gradient
  overlay matching the frame.
- Content in a `VStack` positioned at vertical centre, inset from the left —
  absolute positioning is intentional for the overlay (documented in figma.ts
  note).
- Two `Button` `secondary` controls with `ArrowRight` trailing icon from
  Phosphor. Each renders only when its `onShopClick` / `onAuctionClick`
  callback is supplied (mirrors Nav control gating).
- Copy: `eyebrow`, `shopLabel`, `auctionLabel`. Title and description are
  plain props (page-specific content, not reusable words).

### `StoreSectionHeader`

- `HStack` with `space-between`: `h2` title + optional `Link` `secondary` with
  trailing arrow.
- Link omitted when `browseAllHref` is undefined.

### `StoreCollectionTile`

- Bento cell: `rounded-xl`, `border`, `bg-secondary`, centred icon slot +
  label.
- `featured` boolean switches grid span classes (`col-span-2 row-span-2 h-[244px]`
  vs standard `h-[114px]`).
- Icon is a `ReactNode` prop (emoji in fixtures; image optional later).
- Activation via `href` (`Link` render `<a>`) or `onClick` (`Link` render
  `<button>`).

### `StoreCollectionGrid`

- Five-column bento grid, `gap-4`, maps `collections` to `StoreCollectionTile`.
- No internal state.

## Preview assembly

`apps/preview/src/pages/store-home-page.stories.tsx` composes:

`Nav` → `StoreHomeHero` → collections section (`StoreSectionHeader` +
`StoreCollectionGrid`) → products section (`StoreSectionHeader` + five
`ProductCard`) → `Footer`.

Fixture content extends `store-content.ts`.

## Verification

- Stories per block + page story in preview.
- `audit.json` for hero, section header, collection tile.
- `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories`.
