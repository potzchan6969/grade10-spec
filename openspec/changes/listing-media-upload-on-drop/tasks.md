## 1. Upload behavior (grade10) (owner: @htonyl)

- [ ] 1.1 Add tests first for immediate add, multi-file ordering, per-file
      refusal, and immediate replacement, covering
      `grade10-site-auction-listing-media-SC-31`,
      `grade10-site-auction-listing-media-SC-32`,
      `grade10-site-auction-listing-media-SC-33`, and
      `grade10-site-auction-listing-media-SC-34`.
- [x] 1.2 Implement the shared drop and file-chooser path so supported files
      store immediately and multi-file selections append sequentially after
      the last gallery item, covering
      `grade10-site-auction-listing-media-SC-31` and
      `grade10-site-auction-listing-media-SC-32`.
- [ ] 1.3 Apply the same immediate path to replacement files and preserve the
      existing stored item when replacement validation refuses the new file,
      covering `grade10-site-auction-listing-media-SC-33`.
- [x] 1.4 Keep each refused file unstored and surface its type, size or cap
      reason without rolling back accepted files from the same selection,
      covering `grade10-site-auction-listing-media-SC-34`.

## 2. Gallery ordering (grade10) (owner: @htonyl)

- [ ] 2.1 Add tests for direct-upload reorder persistence and staged inventory
      reorder behavior, covering
      `grade10-site-auction-listing-media-SC-35` and
      `grade10-site-auction-listing-media-SC-36`.
- [x] 2.2 Persist direct-upload order on drop while leaving inventory-backed
      order pending until listing Save, covering
      `grade10-site-auction-listing-media-SC-33` and
      `grade10-site-auction-listing-media-SC-34`.
- [x] 2.3 Verify removal confirmation, last-item protection, alt text, image
      preview sizing and writable-state rules remain unchanged.
- [x] 2.4 Verify the auction listing gallery and inventory product media
      surface use the shared gallery behavior without adding a service call.

## 3. The walk (grade10)

Uses draft `feature-tcs.md` as its planning input.

- [ ] 3.1 Walk the changed listing-media cases for single upload, multi-file
      upload, replacement, refusal reasons and order persistence:
      `grade10-site-auction-listing-media-US1-TC3-2`,
      `grade10-site-auction-listing-media-US1-TC11-1`,
      `grade10-site-auction-listing-media-US1-TC12-1`,
      `grade10-site-auction-listing-media-US1-TC13-1`,
      `grade10-site-auction-listing-media-US1-TC14-1`, and
      `grade10-site-auction-listing-media-US1-TC15-1`.
- [ ] 3.2 Verify with focused tests, typecheck, lint and the listing-media
      end-to-end lane before implementation handoff.
