---
title: Media Gallery
spec: grade10-site/auction/listing-media
order: 3
---

A lot has one gallery, not a front slot and a back slot. It holds one to eight
items in the order collectors see them, images and video alike, and the first
item is the card the catalogue shows. There is no empty placeholder for a side
nobody photographed.

Attaching an image is a two-step move on purpose. The operator picks a file,
sees a preview, and confirms — only then do the bytes leave for the auction
service. Files are stored exactly as uploaded; nothing is re-encoded behind the
operator's back.

Each image can carry alt text, which is optional, trimmed, and capped at 200
characters. When there is none, the listing title is the accessible name, so an
image is never nameless. Images and their alt stay editable while the listing
is a draft, created, or published, and stop the moment it closes.

Every published image answers at exactly four named sizes — `card`, `detail`,
`thumb` and `zoom`. An image already smaller than the size asked for is
answered as it is, and a size name the service does not know reads as a missing
image rather than a guess. The catalogue asks for card size; the lot page walks
the gallery in order.

::story{id="auction-listing-listinggallery--default" title="The lot gallery with its thumbnail strip"}

::story{id="auction-listing-listinggallery--mixed-media" title="A gallery holding both images and video"}
