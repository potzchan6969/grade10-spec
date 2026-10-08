## 1. Cover the gallery contract and its image sources (grade10) (owner: @htonyl)

- [x] 1.1 Add Storybook interaction coverage for distinct thumbnail, stage, and zoom sources, including opening and closing zoom on the selected image `shared-ui-auction-listing-SC-47`, `shared-ui-auction-listing-SC-48`
- [x] 1.2 Cover the one-image and empty `ListingLotGallery` boundaries, including zoom for the single image and no navigation for either boundary `shared-ui-auction-listing-SC-49`, `shared-ui-auction-listing-SC-56`
- [x] 1.3 Test the Grade10 mapper's `thumb`, `detail`, and `zoom` paths while preserving image order, alt text, and video filtering `grade10-site-auction-listing-media-SC-22`, `grade10-site-auction-listing-media-SC-26`
- [x] 1.4 Update the automated details-gallery cases for one and empty images with the no-navigation assertions `grade10-site-auction-listing-media-SC-27`, `grade10-site-auction-listing-media-SC-28`

## 2. Build the local-width gallery presentation (grade10) (owner: @htonyl)

- [x] 2.1 Keep `ListingLotGallery`'s rail decision in its local gallery container and preserve the active image and controls across presentations `shared-ui-auction-listing-SC-47`, `shared-ui-auction-listing-SC-48`, `shared-ui-auction-listing-SC-49`, `shared-ui-auction-listing-SC-56`
- [x] 2.2 Extend `ListingLotGallery` and its Grade10 composition with the accessible zoom dialog and named source mapping; the rail requests `thumb` only while visible `grade10-site-auction-listing-media-SC-22`, `shared-ui-auction-listing-SC-47`
- [x] 2.3 Update the shared-gallery stories and Grade10 site details-page evidence for wide and stacked containers `grade10-site-auction-listing-media-SC-29`, `grade10-site-auction-listing-media-SC-30`

## 3. Verify the collector details gallery (grade10) (owner: @htonyl)

- [x] 3.1 Run focused package and Storybook checks for source selection, zoom open and close, rail selection, stacked chevrons and progress, one image, and empty gallery states `shared-ui-auction-listing-SC-47`, `shared-ui-auction-listing-SC-48`, `shared-ui-auction-listing-SC-49`, `shared-ui-auction-listing-SC-56`
- [x] 3.2 Verify SC-22's `thumb`, `detail`, and selected-image `zoom` requests in the details-page E2E case, then verify wide and stacked layouts and one-image and empty-gallery no-navigation coverage `grade10-site-auction-listing-media-SC-22`, `grade10-site-auction-listing-media-SC-27`, `grade10-site-auction-listing-media-SC-28`, `grade10-site-auction-listing-media-SC-29`, `grade10-site-auction-listing-media-SC-30`

## 4. The walk (grade10) (owner: @htonyl)

- [x] 4.1 Walk a collector through a wide and stacked multi-image details gallery, then the one-image and empty states
