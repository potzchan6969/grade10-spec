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
      className={cn(
        LISTING_LOT_GALLERY_CLASS,
        "scroll-fade max-h-[calc(100svh-11rem)] min-h-0 overflow-y-auto overscroll-y-contain lg:sticky lg:top-6 lg:self-start",
        className,
      )}
      data-slot="listing-lot-gallery"
    >
      <VStack className="w-full" gap="lg">
        {images.map((image) => (
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
    </div>
  );
}

export type { ListingLotGalleryProps };
export { ListingLotGallery };
