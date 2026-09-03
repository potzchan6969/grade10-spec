## User journeys

### listing-media-US-01: Operator attaches an image to a listing gallery

**As an** operator with catalogue grant,
**I want** to upload a supported image into a listing's gallery and confirm it
from a preview,
**so that** only the file I meant to store is sent, and the gallery stays
within the cap admin-listing sets.

**Accepted by:**

- `listing-media-SC-01` — A listing may hold fewer than eight items
- `listing-media-SC-02` — A ninth media item is refused by the gallery cap
- `listing-media-SC-03` — An accepted upload becomes a gallery image
- `listing-media-SC-04` — An unsupported type is refused
- `listing-media-SC-05` — An oversized image is refused
- `listing-media-SC-06` — Choosing a file shows a preview without uploading
- `listing-media-SC-07` — Confirming the preview stores the image
- `listing-media-SC-08` — Discarding the preview leaves the gallery unchanged
- `listing-media-SC-15` — A published listing can gain another image
- `listing-media-SC-16` — Adding after close is refused

### listing-media-US-02: Operator inspects a stored image at zoom size

**As an** operator with catalogue grant,
**I want** the admin media manager to show each stored image at card size and
reveal it at zoom size on hover,
**so that** I can judge a card's condition without clicking through to it.

**Accepted by:**

- `listing-media-SC-09` — The admin media manager shows card size
- `listing-media-SC-10` — Hovering the magnify control shows zoom size
- `listing-media-SC-11` — Leaving the magnify control hides zoom

### listing-media-US-03: Operator corrects a listing's gallery images

**As an** operator with catalogue grant,
**I want** to replace and remove gallery images while the listing is still
writable,
**so that** I can fix a bad photograph without ever leaving a published
listing with no image at all.

**Accepted by:**

- `listing-media-SC-12` — Replacing a gallery image on a published listing
- `listing-media-SC-13` — Removing the last image after create is refused
- `listing-media-SC-14` — A draft gallery image can be replaced and removed

### listing-media-US-04: Operator describes a gallery image with alt text

**As an** operator with catalogue grant,
**I want** to supply and later change optional alt text on a gallery image,
**so that** each image has an accessible name, falling back to the listing
title when I have written none.

**Accepted by:**

- `listing-media-SC-17` — Missing alt uses the listing title
- `listing-media-SC-18` — Supplied alt is shown
- `listing-media-SC-19` — Alt can be edited on a published listing
- `listing-media-SC-20` — Over-length alt is refused

### listing-media-US-05: Collector views a listing's gallery images

**As a** collector,
**I want** a listing's images at the size the surface needs, in gallery order,
**so that** I can pick a listing off the catalogue and study its images on the
details page.

**Accepted by:**

- `listing-media-SC-21` — The catalogue uses card size for an image card
- `listing-media-SC-22` — The details gallery uses thumb, detail, and zoom
- `listing-media-SC-23` — An unknown size is not found
- `listing-media-SC-24` — A listing with a first gallery image shows it on the
  catalogue
- `listing-media-SC-25` — A listing without a catalogue image still lists
- `listing-media-SC-26` — Several images appear in gallery order
- `listing-media-SC-27` — One image has no strip
- `listing-media-SC-28` — No images still shows the listing
