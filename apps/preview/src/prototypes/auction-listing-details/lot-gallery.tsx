import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { LotFixture } from "./types";
import { GALLERY_COLUMN_CLASS } from "./page-shell";

type LotGalleryProps = {
  lot: LotFixture;
};

function LotGallery({ lot }: LotGalleryProps) {
  return (
    <VStack
      className={GALLERY_COLUMN_CLASS}
      data-slot="lot-gallery"
      gap="lg"
    >
      {lot.images.map((image) => (
        <div
          className="relative aspect-square w-full overflow-hidden rounded-4xl bg-linear-to-b from-stone-50 to-stone-100"
          key={image.alt}
        >
          <img
            alt={image.alt}
            className="size-full object-cover"
            src={image.src}
          />
        </div>
      ))}
    </VStack>
  );
}

export { LotGallery };
