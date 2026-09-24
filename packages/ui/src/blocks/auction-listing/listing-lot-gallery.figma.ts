// url=https://www.figma.com/design/GW2WL6JcWok5ypUrUFi9bU/Grade10-DS-2026?node-id=6965-5323
// source=packages/ui/src/blocks/auction-listing/listing-lot-gallery.tsx
// component=ListingLotGallery
//
// Figma draws two content shapes as `images=several|single`. Code has no
// matching prop — the UI branches on `images.length`. Map every option so the
// axis is accounted for; none emit a prop.
import figma from "figma";

const instance = figma.selectedInstance;

instance.getEnum("images", {
  several: false,
  single: false,
});

export default {
  example: figma.code`<ListingLotGallery copy={copy} images={images} />`,
  imports: ['import { ListingLotGallery } from "@grade10/ui"'],
  id: "listing-lot-gallery",
  metadata: { nestable: true },
};
