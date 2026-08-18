## 1. Listing contract

- [x] 1.1 Make "An application imports the surface" pass — drop `CollectionBanner` and `CollectionBannerProps` from the public entry; delete the block, stories, Code Connect template, and fixture
- [x] 1.2 Make "A part is reused alone" pass — the remaining listing parts still render without the browse root

Verify: `pnpm run test:stories:ui`, `pnpm run typecheck`.

## 2. Preview assembly

Depends on group 1.

- [x] 2.1 Drop `CollectionBanner` from the product list page assembly

Verify: `pnpm run lint`, `pnpm run typecheck`, `pnpm run test:stories:app`.
