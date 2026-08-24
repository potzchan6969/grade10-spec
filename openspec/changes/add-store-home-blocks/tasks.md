# Tasks: add store home blocks

## 1. OpenSpec and exports

- [x] 1.1 Validate change: `openspec validate add-store-home-blocks --strict`

## 2. Store home blocks (`@grade10/ui`)

- [x] 2.1 Add `store-home` capability directory with types and fixtures
- [x] 2.2 Implement `StoreSectionHeader` with stories and figma template
- [x] 2.3 Implement `StoreHomeHero` with stories, fixture image, and figma template
- [x] 2.4 Implement `StoreCollectionTile` and `StoreCollectionGrid` with stories and figma template
- [x] 2.5 Add `audit.json` entries for hero, section header, and collection tile
- [x] 2.6 Export all store-home components from `packages/ui/src/index.ts`

## 3. Preview page assembly

- [x] 3.1 Extend `apps/preview/src/pages/store-content.ts` with home fixtures
- [x] 3.2 Add `store-home-page.stories.tsx` composing Nav, blocks, ProductCard, Footer

## 4. Verification

- [x] 4.1 `pnpm run lint`
- [x] 4.2 `pnpm run typecheck`
- [ ] 4.3 `pnpm run test:stories`
