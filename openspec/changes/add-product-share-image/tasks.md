## 1. Product share image (grade10) (owner: @brianchacha6969)

- [x] 1.1 Make `product-page-SC-19` pass: add `sizedImageUrl` and `shareImage` to `@grade10/store-frontend/product` — the first image at 1200×630, `pad_color=ffffff`, `format=jpg`, alt from the image or the card's name — with unit tests
- [x] 1.2 Make `product-page-SC-19` and `product-page-SC-20` pass: `addressHead` takes an optional image and writes `og:image`, `og:image:width`, `og:image:height` and `og:image:alt` from it, none for null; the product route hands its share image over
- [x] 1.3 Read `og:image` back in `documentFacts` and show it in the serving lab
- [x] 1.4 Verify with `pnpm run typecheck`, `pnpm run lint` and the store frontend and grade10 SPA tests
