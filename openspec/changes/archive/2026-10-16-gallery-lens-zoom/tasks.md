## 1. Build the Lens primitive (grade10-spec) (owner: @constance)

- [x] 1.1 Port the Ballmac lens into `packages/design-system/src/components/display/lens.tsx` — pointer tracking, keyboard arrows and Escape, inert magnified copy, label and instructions through props — and add the `motion` dependency
- [x] 1.2 Add lens stories covering pointer, keyboard, custom magnification, and reduced motion `shared-ui-auction-listing-SC-67`, `shared-ui-auction-listing-SC-68`, `shared-ui-auction-listing-SC-69`

## 2. Magnify the galleries in place (grade10-spec) (owner: @constance)

- [x] 2.1 Rework `ListingLotGallery` — remove the magnifier button, zoom dialog and `zoomOpen`, wrap image slides in `Lens` reading `zoomSrc ?? src`, keep video and rail behavior, and focus only the selected slide's lens `shared-ui-auction-listing-SC-67`, `shared-ui-auction-listing-SC-71`
- [x] 2.2 Rework `ListingGallery` — remove the dialog, wrap the non-video main image in `Lens` reading `zoomSrc ?? src`, and keep strip and controls `shared-ui-auction-listing-SC-03`, `shared-ui-auction-listing-SC-72`
- [x] 2.3 Update `zoomSrc` type docs, the `auctionListing` catalogs in all four locales (`clickToZoom`, `zoomInstructions`), and the preview call sites `shared-ui-auction-listing-SC-08`

## 3. Cover the magnifier contract (grade10-spec) (owner: @constance)

- [x] 3.1 Rewrite the lot-gallery Storybook plays — lens group, magnified source, pointer and keyboard — dropping the dialog assertions `shared-ui-auction-listing-SC-03`, `shared-ui-auction-listing-SC-67`, `shared-ui-auction-listing-SC-68`, `shared-ui-auction-listing-SC-69`

## 4. Verify (grade10-spec) (owner: @constance)

- [x] 4.1 Typecheck the design-system and ui packages and the workspace
- [x] 4.2 Run the focused Storybook interaction tests for the lot gallery and the lens, plus the i18n and contract audits

## 5. The walk (grade10-spec) (owner: @constance)

- [x] 5.1 Walk a collector through the multi-image gallery — pointer lens, focused arrows and Escape — then the single-image, video, and touch cases `shared-ui-auction-listing-SC-67`, `shared-ui-auction-listing-SC-68`, `shared-ui-auction-listing-SC-69`, `shared-ui-auction-listing-SC-70`, `shared-ui-auction-listing-SC-72`
