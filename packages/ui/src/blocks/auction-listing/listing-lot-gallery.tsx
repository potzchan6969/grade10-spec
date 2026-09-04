import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import { LISTING_LOT_GALLERY_CLASS } from "./listing-lot-layout";
import type { ListingLotGalleryImage } from "./types";

type ListingLotGalleryProps = {
  images: readonly ListingLotGalleryImage[];
  className?: string;
};

function ListingLotGallery({ images, className }: ListingLotGalleryProps) {
  return (
    <div
      className={cn(LISTING_LOT_GALLERY_CLASS, className)}
      data-slot="listing-lot-gallery"
    >
      <VStack className="w-full" gap="lg">
        {images.map((image) => (
          <div
            className="relative aspect-square w-full overflow-hidden rounded-4xl"
            key={image.alt}
          >
            <img
              alt={image.alt}
              className="size-full object-contain"
              src={image.src}
            />
          </div>
        ))}
      </VStack>
    </div>
  );
}

export type { ListingLotGalleryProps };
export { ListingLotGallery };
