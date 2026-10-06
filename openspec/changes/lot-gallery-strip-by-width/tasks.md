## 1. Cover the responsive gallery contract (grade10) (owner: @htonyl)

- [ ] 1.1 Add focused component or Storybook interaction coverage for a wide several-image rail and a stacked several-image gallery that retains chevrons and progress `shared-ui-auction-listing-SC-47`, `shared-ui-auction-listing-SC-48`
- [ ] 1.2 Cover the one-image and empty `ListingLotGallery` boundaries `shared-ui-auction-listing-SC-49`, `shared-ui-auction-listing-SC-56`
- [ ] 1.3 Update the existing automated details-gallery cases for one and empty images with the no-navigation assertions `grade10-site-auction-listing-media-SC-27`, `grade10-site-auction-listing-media-SC-28`

## 2. Build the local-width gallery presentation (grade10) (owner: @htonyl)

- [ ] 2.1 Keep `ListingLotGallery`'s rail decision in its local gallery container and preserve the active image and controls across presentations `shared-ui-auction-listing-SC-47`, `shared-ui-auction-listing-SC-48`, `shared-ui-auction-listing-SC-49`, `shared-ui-auction-listing-SC-56`
- [ ] 2.2 Update the shared-gallery stories and Grade10 site details-page evidence for wide and stacked containers `grade10-site-auction-listing-media-SC-29`, `grade10-site-auction-listing-media-SC-30`

## 3. Verify the collector details gallery (grade10) (owner: @htonyl)

- [ ] 3.1 Run focused package and Storybook checks for rail selection, stacked chevrons and progress, one image, and empty gallery states `shared-ui-auction-listing-SC-47`, `shared-ui-auction-listing-SC-48`, `shared-ui-auction-listing-SC-49`, `shared-ui-auction-listing-SC-56`
- [ ] 3.2 Verify the details page still requests thumbnail size only with a visible rail, keeps main and zoom image behavior, and updates automated one-image and empty-gallery coverage for no navigation `grade10-site-auction-listing-media-SC-22`, `grade10-site-auction-listing-media-SC-27`, `grade10-site-auction-listing-media-SC-28`, `grade10-site-auction-listing-media-SC-29`, `grade10-site-auction-listing-media-SC-30`

## 4. The walk (grade10)

- [ ] 4.1 Run `/tcs-review lot-gallery-strip-by-width` after deployment and walk a collector through a wide and stacked multi-image details gallery, then the one-image and empty states
