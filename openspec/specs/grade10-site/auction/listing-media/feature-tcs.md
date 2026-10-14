# grade10-site/auction/listing-media Test Cases

**Status:** pending-review · 21/32
**Reviewed:** 2026-09-07, lapsed 2026-10-05
**Drafts styled:** 2026-10-12, tcs-rules r5

## Walk 1: Operator attaches an image to a listing gallery

**Starting state:**

- An admin holds the catalogue grant.
- `<listing_1>` is a draft with only JPEG `<existing_image>` in the gallery.
- `<listing_2>` is a draft with fewer than eight media items.
- `<listing_3>` is a draft with fewer than eight media items.
- `<listing_6>` is a draft with eight media items.
- `<listing_7>` is a draft open in the admin media manager.
- `<listing_8>` is a draft open in the admin media manager.
- `<listing_9>` is published with one gallery image and room under the eight-item cap.
- `<listing_10>` is closed with one gallery image.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC1 | listing_1 | A draft auction listing whose gallery holds exactly one JPEG; bind its identity only |
| g10.auction-listing-media.US1-TC1 | existing_image | The sole JPEG seeded in `<listing_1>`; bind its image identity only |
| g10.auction-listing-media.US1-TC1 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |
| g10.auction-listing-media.US1-TC1 | listing_1 public url | The public URL of `<listing_1>`; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-listing-media.US1-TC2 | listing_2 | A draft auction listing with fewer than eight media items; bind its identity only | · |
| g10.auction-listing-media.US1-TC2 | jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC2 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-listing-media.US1-TC3 | listing_3 | A draft auction listing with fewer than eight media items; bind its identity only | · |
| g10.auction-listing-media.US1-TC3 | jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC3 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-listing-media.US1-TC6 | listing_6 | A draft auction listing with eight media items; bind its identity only | · |
| g10.auction-listing-media.US1-TC6 | jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC6 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-listing-media.US1-TC7 | listing_7 | A draft auction listing open in the media manager; bind its identity only | · |
| g10.auction-listing-media.US1-TC7 | pdf_file | grading-report.pdf | PDF, unsupported gallery type |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC8 | listing_8 | A draft auction listing open in the media manager; bind its identity only |
| g10.auction-listing-media.US1-TC8 | oversized_image | An image larger than 100 mebibytes; bind its file path only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC9 | listing_9 | A published auction listing with one gallery image and room under the cap; bind its identity only |
| g10.auction-listing-media.US1-TC9 | jpeg_second | A second JPEG under the media size bound; bind its file path only |
| g10.auction-listing-media.US1-TC9 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |
| g10.auction-listing-media.US1-TC9 | listing_9 public url | The public URL of `<listing_9>`; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-listing-media.US1-TC10 | listing_10 | A closed auction listing with one gallery image; bind its identity only | · |
| g10.auction-listing-media.US1-TC10 | jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC10 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

### Route

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_1>`.
3. Create `<listing_1>`, then publish it.
4. Navigate to `<listing_1 public url>`.
   - `<listing_1>` is published. g10.auction-listing-media.US1-TC1
   - The details page shows `<existing_image>`. g10.auction-listing-media.US1-TC1
   - No empty gallery slots are invented. g10.auction-listing-media.US1-TC1
5. Navigate to `<grade10 auction admin listings url>`.
6. Open `<listing_2>`.
7. Upload `<jpeg_ok>` into the gallery and confirm.
8. Check `<listing_2>` on the admin listings surface.
   - `<jpeg_ok>` is stored in gallery order. g10.auction-listing-media.US1-TC2
   - The admin listings surface can show it on `<listing_2>`. g10.auction-listing-media.US1-TC2
9. Navigate to `<grade10 auction admin listings url>`.
10. Open the media manager for `<listing_3>`.
11. Choose `<jpeg_ok>`.
12. Check the gallery.
   - `<jpeg_ok>` is stored in the gallery immediately. g10.auction-listing-media.US1-TC3
   - No preview, confirm or discard step is required. g10.auction-listing-media.US1-TC3
13. Navigate to `<grade10 auction admin listings url>`.
14. Open `<listing_6>`.
15. Upload `<jpeg_ok>` as a ninth image.
   - The upload is refused. g10.auction-listing-media.US1-TC6
   - The gallery still has eight items. g10.auction-listing-media.US1-TC6
16. Upload `<pdf_file>` as gallery media.
   - The upload is refused. g10.auction-listing-media.US1-TC7
   - The gallery is unchanged. g10.auction-listing-media.US1-TC7
17. Upload `<oversized_image>`.
   - The upload is refused. g10.auction-listing-media.US1-TC8
   - The gallery is unchanged. g10.auction-listing-media.US1-TC8
18. Navigate to `<grade10 auction admin listings url>`.
19. Open `<listing_9>`.
20. Upload `<jpeg_second>` and confirm.
21. Navigate to `<listing_9 public url>`.
   - The details page shows both images in gallery order. g10.auction-listing-media.US1-TC9
   - The first image is unchanged. g10.auction-listing-media.US1-TC9
22. Navigate to `<grade10 auction admin listings url>`.
23. Open `<listing_10>`.
24. Upload `<jpeg_ok>`.
   - The upload is refused. g10.auction-listing-media.US1-TC10
   - The gallery is unchanged. g10.auction-listing-media.US1-TC10

## Walk 2: Operator attaches an image to a listing gallery

**Starting state:**

- An admin holds the catalogue grant.
- `<listing_11>` is a draft whose gallery already contains `<existing_image>`.
- `<listing_12>` is a draft with room for two more media items.
- `<listing_13>` is a draft with a stored image at `<gallery_position>`.
- `<listing_14>` is a draft with direct-upload images in order `<image_a>`, `<image_b>`, `<image_c>`.
- `<listing_15>` has inventory assets staged in the media manager but not saved.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC11 | listing_11 | A draft auction listing with one existing gallery image; bind its identity only |
| g10.auction-listing-media.US1-TC11 | batch_images | `<batch_image_a>`, `<batch_image_b>`, `<batch_image_c>` |
| g10.auction-listing-media.US1-TC11 | existing_image | The existing gallery image on `<listing_11>`; bind its image identity only |
| g10.auction-listing-media.US1-TC11 | batch_image_a | The first supported image in the three-file selection; bind its file path only |
| g10.auction-listing-media.US1-TC11 | batch_image_b | The second supported image in the three-file selection; bind its file path only |
| g10.auction-listing-media.US1-TC11 | batch_image_c | The third supported image in the three-file selection; bind its file path only |
| g10.auction-listing-media.US1-TC11 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value | Fixture notes |
| --- | --- | --- | --- |
| g10.auction-listing-media.US1-TC12 | listing_12 | A draft auction listing with room for two more media items; bind its identity only | · |
| g10.auction-listing-media.US1-TC12 | mixed_files | `<supported_image_a>`, `<supported_image_b>`, `<pdf_file>`, `<oversized_image>`, `<over_cap_file>` | · |
| g10.auction-listing-media.US1-TC12 | supported_image_a | The first supported image in the mixed selection; bind its file path only | · |
| g10.auction-listing-media.US1-TC12 | supported_image_b | The second supported image in the mixed selection; bind its file path only | · |
| g10.auction-listing-media.US1-TC12 | pdf_file | grading-report.pdf | PDF, unsupported gallery type |
| g10.auction-listing-media.US1-TC12 | oversized_image | An image over the shared size bound; bind its file path only | · |
| g10.auction-listing-media.US1-TC12 | over_cap_file | A supported image beyond the eight-item cap in the mixed selection; bind its file path only | · |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC13 | listing_13 | A draft auction listing with at least two gallery images; bind its identity only |
| g10.auction-listing-media.US1-TC13 | replacement_image | A supported image different from the image being replaced; bind its file path only |
| g10.auction-listing-media.US1-TC13 | gallery_position | The seeded position selected for replacement, within the gallery; bind its position only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC14 | listing_14 | A draft auction listing with three direct-upload images in order `<image_a>`, `<image_b>`, `<image_c>`; bind its identity only |
| g10.auction-listing-media.US1-TC14 | image_a | The seeded direct-upload image originally named A; bind its image identity only |
| g10.auction-listing-media.US1-TC14 | image_b | The seeded direct-upload image originally named B; bind its image identity only |
| g10.auction-listing-media.US1-TC14 | image_c | The seeded direct-upload image originally named C; bind its image identity only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US1-TC15 | listing_15 | A draft listing with two staged inventory assets; bind its identity only |
| g10.auction-listing-media.US1-TC15 | stored_order | The stored inventory asset order before staging; bind its ordered asset identities only |
| g10.auction-listing-media.US1-TC15 | staged_order | A different order of the two staged inventory assets; bind its ordered asset identities only |

### Route

1. Navigate to `<grade10 auction admin listings url>`.
2. Open the media manager for `<listing_11>`.
3. Drop `<batch_images>` together.
4. Check the gallery order.
   - Each image stores without a confirm step. g10.auction-listing-media.US1-TC11
   - The gallery appends `<batch_image_a>`, `<batch_image_b>`, `<batch_image_c>` after `<existing_image>`, in selection order. g10.auction-listing-media.US1-TC11
5. Open the media manager for `<listing_12>`.
6. Choose `<mixed_files>` together.
7. Read the gallery and each refusal result.
   - The supported images `<supported_image_a>` and `<supported_image_b>` are stored. g10.auction-listing-media.US1-TC12
   - The files `<pdf_file>`, `<oversized_image>` and `<over_cap_file>` remain unstored. g10.auction-listing-media.US1-TC12
   - Each refused file is named with its refusal reason. g10.auction-listing-media.US1-TC12
8. Open the media manager for `<listing_13>`.
9. Choose `<replacement_image>` for the stored image at `<gallery_position>`.
10. Check `<gallery_position>` and the other gallery items.
   - `<replacement_image>` is stored immediately at `<gallery_position>`. g10.auction-listing-media.US1-TC13
   - No confirm step appears. g10.auction-listing-media.US1-TC13
   - Other gallery items retain their positions. g10.auction-listing-media.US1-TC13
11. Open the media manager for `<listing_14>`.
12. Drag `<image_c>` before `<image_a>` and drop it.
13. Leave and reopen the media manager.
   - The gallery order is `<image_c>`, `<image_a>`, `<image_b>` after the drop. g10.auction-listing-media.US1-TC14
   - The order remains `<image_c>`, `<image_a>`, `<image_b>` after reopening without a separate Save action. g10.auction-listing-media.US1-TC14
14. Reorder the staged inventory assets to `<staged_order>`.
15. Leave the listing without saving.
16. Reopen the listing.
   - The stored listing retains `<stored_order>`, its prior inventory order. g10.auction-listing-media.US1-TC15
   - The staged order `<staged_order>` applies only after the listing is saved. g10.auction-listing-media.US1-TC15

## Walk 3: Operator inspects a stored image at zoom size

**Starting state:**

- An admin holds the catalogue grant.
- `<listing_16>` is a draft with stored gallery image `<stored_image>`.
- `<listing_17>` is open in the media manager with stored gallery image `<stored_image>`.
- The zoom-size preview of `<stored_image>` on `<listing_18>` is visible from hovering the magnify control.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US2-TC1 | listing_16 | A draft auction listing with one stored gallery image; bind its identity only |
| g10.auction-listing-media.US2-TC1 | stored_image | The sole stored gallery image on `<listing_16>`; bind its image identity only |
| g10.auction-listing-media.US2-TC1 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US2-TC2 | listing_17 | A draft auction listing with one stored gallery image, open in the media manager; bind its identity only |
| g10.auction-listing-media.US2-TC2 | stored_image | The sole stored gallery image on `<listing_17>`; bind its image identity only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US2-TC3 | listing_18 | A draft auction listing with one stored gallery image; zoom preview is visible; bind its identity only |
| g10.auction-listing-media.US2-TC3 | stored_image | The sole stored gallery image on `<listing_18>`; bind its image identity only |

### Route

1. Navigate to `<grade10 auction admin listings url>`.
2. Open the media manager for `<listing_16>`.
3. Check `<stored_image>`.
   - The image `<stored_image>` shows at card size. g10.auction-listing-media.US2-TC1
4. Hover the magnify control on `<stored_image>`.
5. Check the zoom preview.
   - A zoom-size preview of `<stored_image>` is shown. g10.auction-listing-media.US2-TC2
   - That preview is at least three-quarters of the viewport height. g10.auction-listing-media.US2-TC2
6. Move the pointer off the magnify control.
   - The zoom-size preview is hidden. g10.auction-listing-media.US2-TC3

## Walk 4: Operator corrects a listing's gallery images

**Starting state:**

- An admin holds the catalogue grant.
- `<listing_19>` is published with a gallery image at `<gallery_position>`.
- `<listing_20>` is published with only JPEG `<existing_image>`.
- `<listing_21>` is a draft with one gallery image.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US3-TC1 | listing_19 | A published auction listing with at least one gallery image; bind its identity only |
| g10.auction-listing-media.US3-TC1 | jpeg_replacement | A replacement JPEG under the media size bound; bind its file path only |
| g10.auction-listing-media.US3-TC1 | gallery_position | The seeded gallery position selected for replacement; bind its position only |
| g10.auction-listing-media.US3-TC1 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US3-TC2 | listing_20 | A published auction listing with exactly one JPEG; bind its identity only |
| g10.auction-listing-media.US3-TC2 | existing_image | The sole JPEG seeded in `<listing_20>`; bind its image identity only |
| g10.auction-listing-media.US3-TC2 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US3-TC3 | listing_21 | A draft auction listing with one gallery image; bind its identity only |
| g10.auction-listing-media.US3-TC3 | jpeg_replacement | A replacement JPEG under the media size bound; bind its file path only |
| g10.auction-listing-media.US3-TC3 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

### Route

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_19>`.
3. Replace the image at `<gallery_position>` with `<jpeg_replacement>` and confirm.
4. Check `<gallery_position>` and the other gallery items.
   - The position `<gallery_position>` holds `<jpeg_replacement>`. g10.auction-listing-media.US3-TC1
   - Other gallery items are unchanged. g10.auction-listing-media.US3-TC1
5. Navigate to `<grade10 auction admin listings url>`.
6. Open `<listing_20>`.
7. Remove `<existing_image>`.
   - The removal is refused. g10.auction-listing-media.US3-TC2
   - The gallery still has `<existing_image>`. g10.auction-listing-media.US3-TC2
8. Navigate to `<grade10 auction admin listings url>`.
9. Open `<listing_21>`.
10. Replace the gallery image with `<jpeg_replacement>` and confirm.
11. Remove it.
   - `<listing_21>` has no gallery images. g10.auction-listing-media.US3-TC3

## Walk 5: Operator describes a gallery image with alt text

**Starting state:**

- `<listing_22>` is published titled `<listing title>`.
- Its first gallery image has no alt text.
- `<listing_23>` is published.
- Its first gallery image has alt text `<alt text>`.
- An admin holds the catalogue grant.
- `<listing_24>` is published with a gallery image.
- `<listing_25>` is a draft open with a gallery image that already has alt text.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US4-TC1 | listing_22 | A published auction listing titled `<listing title>`; first gallery image has no alt; bind its identity only |
| g10.auction-listing-media.US4-TC1 | listing title | 1999 Charizard, PSA 10 |
| g10.auction-listing-media.US4-TC1 | listing_22 public url | The public URL of `<listing_22>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US4-TC2 | listing_23 | A published auction listing whose first gallery image has alt text; bind its identity only |
| g10.auction-listing-media.US4-TC2 | alt text | Holo Charizard, front of slab |
| g10.auction-listing-media.US4-TC2 | listing_23 public url | The public URL of `<listing_23>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US4-TC3 | listing_24 | A published auction listing with a gallery image; bind its identity only |
| g10.auction-listing-media.US4-TC3 | alt text | Updated accessible name for the image |
| g10.auction-listing-media.US4-TC3 | grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |
| g10.auction-listing-media.US4-TC3 | listing_24 public url | The public URL of `<listing_24>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US4-TC4 | listing_25 | A draft auction listing open; gallery image already has alt text; bind its identity only |
| g10.auction-listing-media.US4-TC4 | previous alt | The alt text already stored on that image; bind its string value only |
| g10.auction-listing-media.US4-TC4 | alt text | A string longer than 200 characters; bind its string value only |

### Route

1. Navigate to `<listing_22 public url>`.
2. Check the first gallery image's accessible name.
   - That image's accessible name is `<listing title>`. g10.auction-listing-media.US4-TC1
3. Navigate to `<listing_23 public url>`.
4. Check the first gallery image's accessible name.
   - That image's accessible name is `<alt text>`. g10.auction-listing-media.US4-TC2
5. Navigate to `<grade10 auction admin listings url>`.
6. Open `<listing_24>`.
7. Change only that image's alt text to `<alt text>`.
8. Check the image bytes and `<listing_24 public url>`.
   - The image bytes are unchanged. g10.auction-listing-media.US4-TC3
   - The details page uses `<alt text>`. g10.auction-listing-media.US4-TC3
9. Set alt text to `<alt text>`.
   - The edit is refused. g10.auction-listing-media.US4-TC4
   - The stored alt remains `<previous alt>`. g10.auction-listing-media.US4-TC4

## Walk 6: Collector views a listing's gallery images and adjacent checks

**Starting state:**

- `<listing_26>` is published.
- Its gallery is `<image_a>` then `<image_b>`.
- `<listing_27>` is published with two gallery images.
- The details gallery is wide enough for a left rail beside the main frame.
- A published gallery image on `<listing_28>` is available at `card`, `detail`, `thumb`, and `zoom`.
- `<listing_29>` is published with no gallery images.
- `<listing_30>` is published with three gallery images uploaded in order `<image_a>`, `<image_b>`, `<image_c>`.
- `<listing_31>` is published with one gallery image.
- `<listing_32>` is published without gallery images.
- `<listing_33>` is published with two or more gallery images.
- `<listing_34>` is published with two or more gallery images.
- The details gallery is stacked and not wide enough for a left rail beside the main frame.

**Shared test data:**

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC1 | listing_26 | A published auction listing whose gallery is `<image_a>` then `<image_b>`; bind its identity only |
| g10.auction-listing-media.US5-TC1 | image_a | The seeded gallery image originally named A; bind its image identity only |
| g10.auction-listing-media.US5-TC1 | image_b | The seeded gallery image originally named B; bind its image identity only |
| g10.auction-listing-media.US5-TC1 | grade10 auction url | The Grade10 auction catalogue URL; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC2 | listing_27 | A published auction listing with two gallery images; bind its identity only |
| g10.auction-listing-media.US5-TC2 | listing_27 public url | The public URL of `<listing_27>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC3 | listing_28 | A published auction listing with a gallery image; bind its identity only |
| g10.auction-listing-media.US5-TC3 | unknown size | A size name other than `card`, `detail`, `thumb`, or `zoom`; bind its size name only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC4 | listing_29 | A published auction listing with no gallery images; bind its identity only |
| g10.auction-listing-media.US5-TC4 | grade10 auction url | The Grade10 auction catalogue URL; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC5 | listing_30 | A published auction listing with gallery images `<image_a>`, `<image_b>`, `<image_c>` in that order; bind its identity only |
| g10.auction-listing-media.US5-TC5 | image_a | The seeded gallery image originally named A; bind its image identity only |
| g10.auction-listing-media.US5-TC5 | image_b | The seeded gallery image originally named B; bind its image identity only |
| g10.auction-listing-media.US5-TC5 | image_c | The seeded gallery image originally named C; bind its image identity only |
| g10.auction-listing-media.US5-TC5 | listing_30 public url | The public URL of `<listing_30>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC6 | listing_31 | A published listing with one gallery image; bind its identity only |
| g10.auction-listing-media.US5-TC6 | listing_31 public url | The public URL of `<listing_31>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC7 | listing_32 | A published listing with no gallery images; bind its identity only |
| g10.auction-listing-media.US5-TC7 | listing_32 public url | The public URL of `<listing_32>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC8 | listing_33 | A published auction listing with two or more gallery images; bind its identity only |
| g10.auction-listing-media.US5-TC8 | listing_33 public url | The public URL of `<listing_33>`; bind its URL only |

| Case | Field | Value |
| --- | --- | --- |
| g10.auction-listing-media.US5-TC9 | listing_34 | A published auction listing with two or more gallery images; bind its identity only |
| g10.auction-listing-media.US5-TC9 | listing_34 public url | The public URL of `<listing_34>`; bind its URL only |

### Route

1. Navigate to `<grade10 auction url>`.
2. Find `<listing_26>`'s row.
3. Check which image is requested and shown.
   - The listing row shows `<image_a>` at card size. g10.auction-listing-media.US5-TC1
   - It does not show `<image_b>` on the card. g10.auction-listing-media.US5-TC1
   - That listing's card image is requested at size `card`. g10.auction-listing-media.US5-TC1
4. Navigate to `<listing_27 public url>`.
5. Check the thumbnail rail, the main frame, and zoom.
   - The thumbnail rail requests size `thumb`. g10.auction-listing-media.US5-TC2
   - The main frame requests size `detail`. g10.auction-listing-media.US5-TC2
   - Zoom requests size `zoom`. g10.auction-listing-media.US5-TC2
6. Request that image at `<unknown size>`.
7. Request an image that does not exist.
   - The unknown-size response matches a missing image. g10.auction-listing-media.US5-TC3
8. Navigate to `<grade10 auction url>`.
9. Find `<listing_29>`'s row.
   - The listing appears with its title and price. g10.auction-listing-media.US5-TC4
   - No image is shown for it by this capability. g10.auction-listing-media.US5-TC4
10. Navigate to `<listing_30 public url>`.
11. Check the gallery.
   - The gallery shows three images in the order `<image_a>`, `<image_b>`, `<image_c>`. g10.auction-listing-media.US5-TC5
12. Navigate to `<listing_31 public url>`.
13. Check the gallery controls.
   - The image is shown. g10.auction-listing-media.US5-TC6
   - No thumbnail rail, previous control, or next control is shown. g10.auction-listing-media.US5-TC6
14. Navigate to `<listing_32 public url>`.
15. Check the gallery and the listing page.
   - The gallery has no image and no previous or next control. g10.auction-listing-media.US5-TC7
   - The listing title and bid panel remain visible. g10.auction-listing-media.US5-TC7
16. Navigate to `<listing_33 public url>`.
17. Check the gallery for a thumbnail rail beside the main frame.
   - A thumbnail rail is shown beside the main frame. g10.auction-listing-media.US5-TC8
18. Navigate to `<listing_34 public url>` at a stacked gallery width.
19. Check for a thumbnail rail, previous/next.
   - No thumbnail rail is shown. g10.auction-listing-media.US5-TC9
   - Previous and next remain available. g10.auction-listing-media.US5-TC9
   - Carousel progress remains available. g10.auction-listing-media.US5-TC9

## g10.auction-listing-media.US1: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to drop one or several supported images into a listing's gallery
and see each one stored as it lands,
**so that** photographing a card costs one move rather than a confirm per
file, and the gallery stays within the cap admin-listing sets.

### g10.auction-listing-media.US1-TC1: One-image listing publishes with no empty slots

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_1>` is a draft with only JPEG `<existing_image>` in the gallery.

**Test data:**

| Field | Value |
| --- | --- |
| listing_1 | A draft auction listing whose gallery holds exactly one JPEG; bind its identity only |
| existing_image | The sole JPEG seeded in `<listing_1>`; bind its image identity only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |
| listing_1 public url | The public URL of `<listing_1>`; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_1>`.
3. Create `<listing_1>`, then publish it.
4. Navigate to `<listing_1 public url>`.

**Expected Results:**

* `<listing_1>` is published.
* The details page shows `<existing_image>`.
* No empty gallery slots are invented.

<!-- trace:case id=g10.auction-listing-media.TC-sga rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC2: Accepted JPEG becomes a gallery image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_2>` is a draft with fewer than eight media items.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_2 | A draft auction listing with fewer than eight media items; bind its identity only | · |
| jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Field | Value |
| --- | --- |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_2>`.
3. Upload `<jpeg_ok>` into the gallery and confirm.
4. Check `<listing_2>` on the admin listings surface.

**Expected Results:**

* `<jpeg_ok>` is stored in gallery order.
* The admin listings surface can show it on `<listing_2>`.

<!-- trace:case id=g10.auction-listing-media.TC-oyk rev=2 covers=g10.auction-listing-media.SC-31 -->
### g10.auction-listing-media.US1-TC3: Choosing a file stores it without a preview

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_3>` is a draft with fewer than eight media items.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_3 | A draft auction listing with fewer than eight media items; bind its identity only | · |
| jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Field | Value |
| --- | --- |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open the media manager for `<listing_3>`.
3. Choose `<jpeg_ok>`.
4. Check the gallery.

**Expected Results:**

* `<jpeg_ok>` is stored in the gallery immediately.
* No preview, confirm or discard step is required.

<!-- trace:case id=g10.auction-listing-media.TC-eq0 rev=1 covers=g10.auction-listing-media.SC-07 -->
### g10.auction-listing-media.US1-TC4: Confirming a preview stores the image

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** deprecated
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin has selected `<jpeg_ok>` for a `<listing_4>` gallery slot and sees its preview.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_4>` | A draft auction listing with a selected JPEG preview in one gallery slot |
| `<jpeg_ok>` | charizard-front.jpg, JPEG, under the media size bound |

**Steps:**

1. Confirm the upload.
2. Check the gallery slot and the preview.

**Expected Results:**

* That slot holds `<jpeg_ok>`.
* The preview is cleared.

**Deprecated:** Superseded by immediate upload on drop or choose; the confirm step no longer exists.

<!-- trace:case id=g10.auction-listing-media.TC-h3k rev=1 covers=g10.auction-listing-media.SC-08 -->
### g10.auction-listing-media.US1-TC5: Discarding the preview leaves the gallery unchanged

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** deprecated
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* The admin has selected an image for a `<listing_5>` gallery slot and sees its preview.

**Test data:**

| Field | Value |
| --- | --- |
| `<listing_5>` | A draft auction listing with a selected image preview in one gallery slot |

**Steps:**

1. Discard the preview without confirming.
2. Check the gallery and the preview.

**Expected Results:**

* The gallery is unchanged.
* The preview is cleared.
* No upload was sent.

**Deprecated:** Superseded by immediate upload on drop or choose; the discard step no longer exists.

<!-- trace:case id=g10.auction-listing-media.TC-c94 rev=1 covers=g10.auction-listing-media.SC-c93 -->
### g10.auction-listing-media.US1-TC6: Ninth media item is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_6>` is a draft with eight media items.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_6 | A draft auction listing with eight media items; bind its identity only | · |
| jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Field | Value |
| --- | --- |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_6>`.
3. Upload `<jpeg_ok>` as a ninth image.

**Expected Results:**

* The upload is refused.
* The gallery still has eight items.

<!-- trace:case id=g10.auction-listing-media.TC-ark rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC7: Unsupported type is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_7>` is a draft open in the admin media manager.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_7 | A draft auction listing open in the media manager; bind its identity only | · |
| pdf_file | grading-report.pdf | PDF, unsupported gallery type |

**Steps:**

1. Upload `<pdf_file>` as gallery media.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-brl rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC8: Oversized image is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** manual
* **Testability:** manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_8>` is a draft open in the admin media manager.

**Test data:**

| Field | Value |
| --- | --- |
| listing_8 | A draft auction listing open in the media manager; bind its identity only |
| oversized_image | An image larger than 100 mebibytes; bind its file path only |

**Steps:**

1. Upload `<oversized_image>`.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-5c5 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC9: Published listing can gain another image

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_9>` is published with one gallery image and room under the eight-item cap.

**Test data:**

| Field | Value |
| --- | --- |
| listing_9 | A published auction listing with one gallery image and room under the cap; bind its identity only |
| jpeg_second | A second JPEG under the media size bound; bind its file path only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |
| listing_9 public url | The public URL of `<listing_9>`; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_9>`.
3. Upload `<jpeg_second>` and confirm.
4. Navigate to `<listing_9 public url>`.

**Expected Results:**

* The details page shows both images in gallery order.
* The first image is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-qd3 rev=1 covers=g10.auction-listing-media.SC-1uo,g10.auction-listing-media.SC-c93,g10.auction-listing-media.SC-dqz,g10.auction-listing-media.SC-99z,g10.auction-listing-media.SC-zlc,g10.auction-listing-media.SC-6ya,g10.auction-listing-media.SC-giq,g10.auction-listing-media.SC-gop,g10.auction-listing-media.SC-cnb,g10.auction-listing-media.SC-r6j -->
### g10.auction-listing-media.US1-TC10: Adding after close is refused

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_10>` is closed with one gallery image.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_10 | A closed auction listing with one gallery image; bind its identity only | · |
| jpeg_ok | charizard-front.jpg | JPEG, under the media size bound |

| Field | Value |
| --- | --- |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_10>`.
3. Upload `<jpeg_ok>`.

**Expected Results:**

* The upload is refused.
* The gallery is unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-bat rev=1 covers=g10.auction-listing-media.SC-32 -->
### g10.auction-listing-media.US1-TC11: Several files append after the last gallery item

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_11>` is a draft whose gallery already contains `<existing_image>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_11 | A draft auction listing with one existing gallery image; bind its identity only |
| batch_images | `<batch_image_a>`, `<batch_image_b>`, `<batch_image_c>` |
| existing_image | The existing gallery image on `<listing_11>`; bind its image identity only |
| batch_image_a | The first supported image in the three-file selection; bind its file path only |
| batch_image_b | The second supported image in the three-file selection; bind its file path only |
| batch_image_c | The third supported image in the three-file selection; bind its file path only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open the media manager for `<listing_11>`.
3. Drop `<batch_images>` together.
4. Check the gallery order.

**Expected Results:**

* Each image stores without a confirm step.
* The gallery appends `<batch_image_a>`, `<batch_image_b>`, `<batch_image_c>` after `<existing_image>`, in selection order.

<!-- trace:case id=g10.auction-listing-media.TC-ref rev=1 covers=g10.auction-listing-media.SC-34 -->
### g10.auction-listing-media.US1-TC12: Refused files keep their reasons in a mixed selection

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_12>` is a draft with room for two more media items.

**Test data:**

| Field | Value | Fixture notes |
| --- | --- | --- |
| listing_12 | A draft auction listing with room for two more media items; bind its identity only | · |
| mixed_files | `<supported_image_a>`, `<supported_image_b>`, `<pdf_file>`, `<oversized_image>`, `<over_cap_file>` | · |
| supported_image_a | The first supported image in the mixed selection; bind its file path only | · |
| supported_image_b | The second supported image in the mixed selection; bind its file path only | · |
| pdf_file | grading-report.pdf | PDF, unsupported gallery type |
| oversized_image | An image over the shared size bound; bind its file path only | · |
| over_cap_file | A supported image beyond the eight-item cap in the mixed selection; bind its file path only | · |

**Steps:**

1. Open the media manager for `<listing_12>`.
2. Choose `<mixed_files>` together.
3. Read the gallery and each refusal result.

**Expected Results:**

* The supported images `<supported_image_a>` and `<supported_image_b>` are stored.
* The files `<pdf_file>`, `<oversized_image>` and `<over_cap_file>` remain unstored.
* Each refused file is named with its refusal reason.

<!-- trace:case id=g10.auction-listing-media.TC-rep rev=1 covers=g10.auction-listing-media.SC-33 -->
### g10.auction-listing-media.US1-TC13: Replacement stores without confirmation

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_13>` is a draft with a stored image at `<gallery_position>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_13 | A draft auction listing with at least two gallery images; bind its identity only |
| replacement_image | A supported image different from the image being replaced; bind its file path only |
| gallery_position | The seeded position selected for replacement, within the gallery; bind its position only |

**Steps:**

1. Open the media manager for `<listing_13>`.
2. Choose `<replacement_image>` for the stored image at `<gallery_position>`.
3. Check `<gallery_position>` and the other gallery items.

**Expected Results:**

* `<replacement_image>` is stored immediately at `<gallery_position>`.
* No confirm step appears.
* Other gallery items retain their positions.

<!-- trace:case id=g10.auction-listing-media.TC-ord rev=1 covers=g10.auction-listing-media.SC-35 -->
### g10.auction-listing-media.US1-TC14: Direct-upload reorder holds on drop

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_14>` is a draft with direct-upload images in order `<image_a>`, `<image_b>`, `<image_c>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_14 | A draft auction listing with three direct-upload images in order `<image_a>`, `<image_b>`, `<image_c>`; bind its identity only |
| image_a | The seeded direct-upload image originally named A; bind its image identity only |
| image_b | The seeded direct-upload image originally named B; bind its image identity only |
| image_c | The seeded direct-upload image originally named C; bind its image identity only |

**Steps:**

1. Open the media manager for `<listing_14>`.
2. Drag `<image_c>` before `<image_a>` and drop it.
3. Leave and reopen the media manager.

**Expected Results:**

* The gallery order is `<image_c>`, `<image_a>`, `<image_b>` after the drop.
* The order remains `<image_c>`, `<image_a>`, `<image_b>` after reopening without a separate Save action.

<!-- trace:case id=g10.auction-listing-media.TC-stg rev=1 covers=g10.auction-listing-media.SC-36 -->
### g10.auction-listing-media.US1-TC15: Staged inventory reorder waits for Save

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-01

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_15>` has inventory assets staged in the media manager but not saved.

**Test data:**

| Field | Value |
| --- | --- |
| listing_15 | A draft listing with two staged inventory assets; bind its identity only |
| stored_order | The stored inventory asset order before staging; bind its ordered asset identities only |
| staged_order | A different order of the two staged inventory assets; bind its ordered asset identities only |

**Steps:**

1. Reorder the staged inventory assets to `<staged_order>`.
2. Leave the listing without saving.
3. Reopen the listing.

**Expected Results:**

* The stored listing retains `<stored_order>`, its prior inventory order.
* The staged order `<staged_order>` applies only after the listing is saved.

---

## g10.auction-listing-media.US2: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

<!-- trace:case id=g10.auction-listing-media.TC-92w rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC1: Media manager shows stored image at card size

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_16>` is a draft with stored gallery image `<stored_image>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_16 | A draft auction listing with one stored gallery image; bind its identity only |
| stored_image | The sole stored gallery image on `<listing_16>`; bind its image identity only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open the media manager for `<listing_16>`.
3. Check `<stored_image>`.

**Expected Results:**

* The image `<stored_image>` shows at card size.

<!-- trace:case id=g10.auction-listing-media.TC-sss rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC2: Hovering the magnify control shows zoom size

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_17>` is open in the media manager with stored gallery image `<stored_image>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_17 | A draft auction listing with one stored gallery image, open in the media manager; bind its identity only |
| stored_image | The sole stored gallery image on `<listing_17>`; bind its image identity only |

**Steps:**

1. Hover the magnify control on `<stored_image>`.
2. Check the zoom preview.

**Expected Results:**

* A zoom-size preview of `<stored_image>` is shown.
* That preview is at least three-quarters of the viewport height.

<!-- trace:case id=g10.auction-listing-media.TC-mkq rev=1 covers=g10.auction-listing-media.SC-ez7,g10.auction-listing-media.SC-wuz,g10.auction-listing-media.SC-qgb -->
### g10.auction-listing-media.US2-TC3: Leaving the magnify control hides zoom

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-02

**Pre-conditions:**

* An admin holds the catalogue grant.
* The zoom-size preview of `<stored_image>` on `<listing_18>` is visible from hovering the magnify control.

**Test data:**

| Field | Value |
| --- | --- |
| listing_18 | A draft auction listing with one stored gallery image; zoom preview is visible; bind its identity only |
| stored_image | The sole stored gallery image on `<listing_18>`; bind its image identity only |

**Steps:**

1. Move the pointer off the magnify control.

**Expected Results:**

* The zoom-size preview is hidden.

---

## g10.auction-listing-media.US3: Operator corrects a listing's gallery images

**As an** operator with catalogue grant,
**I want** to replace and remove gallery images while the listing is still
writable,
**so that** I can fix a bad photograph without ever leaving a published
listing with no image at all.

<!-- trace:case id=g10.auction-listing-media.TC-8sq rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC1: Replacing a gallery image on a published listing

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_19>` is published with a gallery image at `<gallery_position>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_19 | A published auction listing with at least one gallery image; bind its identity only |
| jpeg_replacement | A replacement JPEG under the media size bound; bind its file path only |
| gallery_position | The seeded gallery position selected for replacement; bind its position only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_19>`.
3. Replace the image at `<gallery_position>` with `<jpeg_replacement>` and confirm.
4. Check `<gallery_position>` and the other gallery items.

**Expected Results:**

* The position `<gallery_position>` holds `<jpeg_replacement>`.
* Other gallery items are unchanged.

<!-- trace:case id=g10.auction-listing-media.TC-2we rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC2: Removing the last image after create is refused

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_20>` is published with only JPEG `<existing_image>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_20 | A published auction listing with exactly one JPEG; bind its identity only |
| existing_image | The sole JPEG seeded in `<listing_20>`; bind its image identity only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_20>`.
3. Remove `<existing_image>`.

**Expected Results:**

* The removal is refused.
* The gallery still has `<existing_image>`.

<!-- trace:case id=g10.auction-listing-media.TC-c4i rev=1 covers=g10.auction-listing-media.SC-dgy,g10.auction-listing-media.SC-gj8,g10.auction-listing-media.SC-82s -->
### g10.auction-listing-media.US3-TC3: Draft gallery image can be replaced and removed

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** destructive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-03

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_21>` is a draft with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| listing_21 | A draft auction listing with one gallery image; bind its identity only |
| jpeg_replacement | A replacement JPEG under the media size bound; bind its file path only |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_21>`.
3. Replace the gallery image with `<jpeg_replacement>` and confirm.
4. Remove it.

**Expected Results:**

* `<listing_21>` has no gallery images.

---

## g10.auction-listing-media.US4: Operator describes a gallery image with alt text

**As an** operator with catalogue grant,
**I want** to supply and later change optional alt text on a gallery image,
**so that** each image has an accessible name, falling back to the listing
title when I have written none.

<!-- trace:case id=g10.auction-listing-media.TC-ygm rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC1: Missing alt uses the listing title

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* `<listing_22>` is published titled `<listing title>`.
* Its first gallery image has no alt text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_22 | A published auction listing titled `<listing title>`; first gallery image has no alt; bind its identity only |
| listing title | 1999 Charizard, PSA 10 |
| listing_22 public url | The public URL of `<listing_22>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_22 public url>`.
2. Check the first gallery image's accessible name.

**Expected Results:**

* That image's accessible name is `<listing title>`.

<!-- trace:case id=g10.auction-listing-media.TC-m2x rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC2: Supplied alt is shown

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* `<listing_23>` is published.
* Its first gallery image has alt text `<alt text>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_23 | A published auction listing whose first gallery image has alt text; bind its identity only |
| alt text | Holo Charizard, front of slab |
| listing_23 public url | The public URL of `<listing_23>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_23 public url>`.
2. Check the first gallery image's accessible name.

**Expected Results:**

* That image's accessible name is `<alt text>`.

<!-- trace:case id=g10.auction-listing-media.TC-eeh rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC3: Alt can be edited on a published listing

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_24>` is published with a gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| listing_24 | A published auction listing with a gallery image; bind its identity only |
| alt text | Updated accessible name for the image |
| grade10 auction admin listings url | The Grade10 auction admin listings URL; bind its URL only |
| listing_24 public url | The public URL of `<listing_24>`; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction admin listings url>`.
2. Open `<listing_24>`.
3. Change only that image's alt text to `<alt text>`.
4. Check the image bytes and `<listing_24 public url>`.

**Expected Results:**

* The image bytes are unchanged.
* The details page uses `<alt text>`.

<!-- trace:case id=g10.auction-listing-media.TC-rn2 rev=1 covers=g10.auction-listing-media.SC-mo0,g10.auction-listing-media.SC-k31,g10.auction-listing-media.SC-46l,g10.auction-listing-media.SC-0b1 -->
### g10.auction-listing-media.US4-TC4: Over-length alt is refused

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-04

**Pre-conditions:**

* An admin holds the catalogue grant.
* `<listing_25>` is a draft open with a gallery image that already has alt text.

**Test data:**

| Field | Value |
| --- | --- |
| listing_25 | A draft auction listing open; gallery image already has alt text; bind its identity only |
| previous alt | The alt text already stored on that image; bind its string value only |
| alt text | A string longer than 200 characters; bind its string value only |

**Steps:**

1. Set alt text to `<alt text>`.

**Expected Results:**

* The edit is refused.
* The stored alt remains `<previous alt>`.

---

## g10.auction-listing-media.US5: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

<!-- trace:case id=g10.auction-listing-media.TC-v1b rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC1: Catalogue shows the first gallery image at card size

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* `<listing_26>` is published.
* Its gallery is `<image_a>` then `<image_b>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_26 | A published auction listing whose gallery is `<image_a>` then `<image_b>`; bind its identity only |
| image_a | The seeded gallery image originally named A; bind its image identity only |
| image_b | The seeded gallery image originally named B; bind its image identity only |
| grade10 auction url | The Grade10 auction catalogue URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction url>`.
2. Find `<listing_26>`'s row.
3. Check which image is requested and shown.

**Expected Results:**

* The listing row shows `<image_a>` at card size.
* It does not show `<image_b>` on the card.
* That listing's card image is requested at size `card`.

<!-- trace:case id=g10.auction-listing-media.TC-3vh rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC2: Details gallery uses thumb, detail, and zoom

Runs once per row of **Test data**.

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_27>` is published with two gallery images.
* The details gallery is wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| listing_27 | A published auction listing with two gallery images; bind its identity only |
| listing_27 public url | The public URL of `<listing_27>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_27 public url>`.
2. Check the thumbnail rail, the main frame, and zoom.

**Expected Results:**

* The thumbnail rail requests size `thumb`.
* The main frame requests size `detail`.
* Zoom requests size `zoom`.

<!-- trace:case id=g10.auction-listing-media.TC-77a rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC3: Unknown size is not found

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** api
* **Automation status:** automated
* **Testability:** automation
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/backend/grade10/auction/test/worker/routes.spec.ts`

**Pre-conditions:**

* A published gallery image on `<listing_28>` is available at `card`, `detail`, `thumb`, and `zoom`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_28 | A published auction listing with a gallery image; bind its identity only |
| unknown size | A size name other than `card`, `detail`, `thumb`, or `zoom`; bind its size name only |

**Steps:**

1. Request that image at `<unknown size>`.
2. Request an image that does not exist.

**Expected Results:**

* The unknown-size response matches a missing image.

<!-- trace:case id=g10.auction-listing-media.TC-mu3 rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC4: Listing without a catalogue image still lists

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** actual
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* `<listing_29>` is published with no gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| listing_29 | A published auction listing with no gallery images; bind its identity only |
| grade10 auction url | The Grade10 auction catalogue URL; bind its URL only |

**Steps:**

1. Navigate to `<grade10 auction url>`.
2. Find `<listing_29>`'s row.

**Expected Results:**

* The listing appears with its title and price.
* No image is shown for it by this capability.

<!-- trace:case id=g10.auction-listing-media.TC-del rev=1 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC5: Several images appear in gallery order

**Classification:**

* **Severity:** critical
* **Priority:** high
* **Status:** actual
* **Behaviour:** positive
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Pre-conditions:**

* `<listing_30>` is published with three gallery images uploaded in order `<image_a>`, `<image_b>`, `<image_c>`.

**Test data:**

| Field | Value |
| --- | --- |
| listing_30 | A published auction listing with gallery images `<image_a>`, `<image_b>`, `<image_c>` in that order; bind its identity only |
| image_a | The seeded gallery image originally named A; bind its image identity only |
| image_b | The seeded gallery image originally named B; bind its image identity only |
| image_c | The seeded gallery image originally named C; bind its image identity only |
| listing_30 public url | The public URL of `<listing_30>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_30 public url>`.
2. Check the gallery.

**Expected Results:**

* The gallery shows three images in the order `<image_a>`, `<image_b>`, `<image_c>`.

<!-- trace:case id=g10.auction-listing-media.TC-ic0 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC6: One image has no thumbnail strip or navigation

Runs once per row of **Test data**.

**Classification:**

* **Severity:** normal
* **Priority:** medium
* **Status:** draft
* **Behaviour:** positive
* **Type:** usability
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_31>` is published with one gallery image.

**Test data:**

| Field | Value |
| --- | --- |
| listing_31 | A published listing with one gallery image; bind its identity only |
| listing_31 public url | The public URL of `<listing_31>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_31 public url>`.
2. Check the gallery controls.

**Expected Results:**

* The image is shown.
* No thumbnail rail, previous control, or next control is shown.

<!-- trace:case id=g10.auction-listing-media.TC-l76 rev=2 covers=g10.auction-listing-media.SC-wbd,g10.auction-listing-media.SC-ds2,g10.auction-listing-media.SC-7si,g10.auction-listing-media.SC-78a,g10.auction-listing-media.SC-0nc,g10.auction-listing-media.SC-yei,g10.auction-listing-media.SC-iki,g10.auction-listing-media.SC-70a -->
### g10.auction-listing-media.US5-TC7: No images still shows the listing without navigation

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** medium
* **Status:** draft
* **Behaviour:** negative
* **Type:** functional
* **Suites:** regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_32>` is published without gallery images.

**Test data:**

| Field | Value |
| --- | --- |
| listing_32 | A published listing with no gallery images; bind its identity only |
| listing_32 public url | The public URL of `<listing_32>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_32 public url>`.
2. Check the gallery and the listing page.

**Expected Results:**

* The gallery has no image and no previous or next control.
* The listing title and bid panel remain visible.

<!-- trace:case id=g10.auction-listing-media.TC-pls rev=1 covers=g10.auction-listing-media.SC-5tk -->
### g10.auction-listing-media.US5-TC8: Wide details gallery shows a left rail

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_33>` is published with two or more gallery images.
* The details gallery is wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| listing_33 | A published auction listing with two or more gallery images; bind its identity only |
| listing_33 public url | The public URL of `<listing_33>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_33 public url>`.
2. Check the gallery for a thumbnail rail beside the main frame.

**Expected Results:**

* A thumbnail rail is shown beside the main frame.

<!-- trace:case id=g10.auction-listing-media.TC-pbt rev=1 covers=g10.auction-listing-media.SC-cd3 -->
### g10.auction-listing-media.US5-TC9: Stacked details gallery hides the rail

Runs once per row of **Test data**.

**Classification:**

* **Severity:** major
* **Priority:** high
* **Status:** draft
* **Behaviour:** positive
* **Type:** functional
* **Suites:** smoke, regression
* **Layer:** e2e
* **Automation status:** automated
* **Testability:** automation, manual
* **Trace:** grade10-site-auction-listing-media-US-05

**Decided by:** `grade10:apps/frontend/grade10/e2e/tests/auction/listing-media.spec.ts`

**Pre-conditions:**

* `<listing_34>` is published with two or more gallery images.
* The details gallery is stacked and not wide enough for a left rail beside the main frame.

**Test data:**

| Field | Value |
| --- | --- |
| listing_34 | A published auction listing with two or more gallery images; bind its identity only |
| listing_34 public url | The public URL of `<listing_34>`; bind its URL only |

**Steps:**

1. Navigate to `<listing_34 public url>` at a stacked gallery width.
2. Check for a thumbnail rail, previous/next.

**Expected Results:**

* No thumbnail rail is shown.
* Previous and next remain available.
* Carousel progress remains available.

## Settled

- Wide enough means the gallery can place a left rail beside the main frame;
  the implementation threshold stays in code.
- Stacked several-image galleries hide the rail; previous/next and progress
  remain.
- Named size `thumb` applies when the rail is shown; `detail` and `zoom`
  still apply to the main frame.
- A one-image details gallery has no rail or previous/next. An empty details
  gallery has no image or previous/next while the listing page remains.

## Reconciliation

Two independent readings of the same anchors: QA1 wrote the blind cases
without sight of the scenarios, and Dev wrote the scenarios without sight of
the blind suite. QA2 reconciled both against the modified US-01 journey and
the upload feature-set root.

| Finding | Disposition |
| --- | --- |
| The preview, confirm and discard flow no longer matches the journey | **Deprecated:** `US1-TC4-1` and `US1-TC5-1`; `US1-TC3-2` carries the revised case and `SC-31` |
| A single supported file stores as soon as it is chosen | **Folded in:** `SC-31` and `US1-TC3-2` |
| Several files need deterministic append order | **Folded in:** `SC-32` and `US1-TC11-1` |
| Replacement follows the same immediate path | **Folded in:** `SC-33` and `US1-TC13-1` |
| Mixed selections need per-file refusal reasons without rolling back accepted files | **Folded in:** `SC-34` and `US1-TC12-1` |
| Direct-upload reorder and staged inventory reorder have different persistence timing | **Folded in:** `SC-35` and `SC-36`, walked by `US1-TC14-1` and `US1-TC15-1` |
| Existing accepted types, size bound, cap, remove confirmation, alt text, zoom and writable-state behavior | **Kept:** these remain covered by the durable suite and unchanged requirements |
| QA1 or Dev raised an unresolved product question | **None:** decisions Q1 to Q6 settle the changed behavior |

**Run:** Blind pass read Purpose (durable), Feature set (delta),
user-journeys.md (US-05), proposal.md, decisions.md (goals, non-goals,
Q1–Q4, empty Raised), PRD Media Gallery strip lines, and durable
feature-tcs.md for id continuity with Reconciliation stripped. Denied:
every Requirements section, openspec/specs/ beyond those excerpts,
openspec/changes/archive/.

| Finding | Disposition |
| --- | --- |
| Details gallery uses thumb, detail, and zoom when a rail is shown | Folded as covered by `grade10-site-auction-listing-media-SC-22` / `g10.auction-listing-media.US5-TC2` |
| Wide details gallery shows a left rail | Folded as covered by `grade10-site-auction-listing-media-SC-29` / `g10.auction-listing-media.US5-TC8` |
| Stacked details gallery hides the rail, keeps previous/next and progress | Folded as covered by `grade10-site-auction-listing-media-SC-30` / `g10.auction-listing-media.US5-TC9` |
| One details image has no rail or previous/next | Revised durable `g10.auction-listing-media.US5-TC6` as `TC6-2`, keeping trace id `g10.auction-listing-media.TC-ic0` at rev 2, for `grade10-site-auction-listing-media-SC-27` |
| Empty details gallery leaves the listing visible without previous/next | Revised durable `g10.auction-listing-media.US5-TC7` as `TC7-2`, keeping trace id `g10.auction-listing-media.TC-l76` at rev 2, for `grade10-site-auction-listing-media-SC-28` |
| Details order | Covered by durable `grade10-site-auction-listing-media-SC-26` / `US5-TC5-1` — unchanged by this change |
| Raised questions from the blind pass | None — Q1–Q4 already settled width rule, stacked replacement, ListingGallery carve-out, and unnamed threshold |

**Uncovered anchors:** none after the stated scenario and case patches.
