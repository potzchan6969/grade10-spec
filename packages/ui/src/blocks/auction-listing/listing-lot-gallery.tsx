import { cn } from "@grade10/design-system/lib/utils";
import { useState } from "react";
import {
  GalleryCarousel,
  type GalleryCarouselCopy,
} from "../shared/gallery-carousel";
import { LISTING_LOT_GALLERY_CLASS } from "./listing-lot-layout";
import type { ListingLotGalleryImage } from "./types";

type ListingLotGalleryCopy = GalleryCarouselCopy;

type ListingLotGalleryProps = {
  copy: ListingLotGalleryCopy;
  images: readonly ListingLotGalleryImage[];
  className?: string;
};

function ListingLotGallery({
  copy,
  images,
  className,
}: ListingLotGalleryProps) {
  const [index, setIndex] = useState(0);
  const many = images.length > 1;
  const count = images.length;
  const safeIndex =
    count === 0 ? 0 : Math.min(Math.max(index, 0), count - 1);

  return (
    <div
      className={cn(LISTING_LOT_GALLERY_CLASS, className)}
      data-slot="listing-lot-gallery"
    >
      <GalleryCarousel
        copy={copy}
        images={images}
        index={safeIndex}
        onIndexChange={setIndex}
        thumbs={
          many ? (
            <div className="flex shrink-0 gap-2 overflow-x-auto overscroll-x-contain md:flex-col md:overflow-visible">
              {images.map((thumb, thumbIndex) => {
                const selected = thumbIndex === safeIndex;
                return (
                  <button
                    aria-current={selected ? "true" : undefined}
                    aria-label={`Thumbnail: ${thumb.alt}`}
                    className={cn(
                      "relative size-16 shrink-0 overflow-hidden rounded-(--radius-xl) bg-background-subtle outline-none transition-[border-color] focus-visible:ring-3 focus-visible:ring-ring/50 md:size-20",
                      selected
                        ? "border-2 border-primary-border"
                        : "border border-border",
                    )}
                    key={`${thumb.src}:${thumb.alt}`}
                    onClick={() => setIndex(thumbIndex)}
                    type="button"
                  >
                    <img
                      alt=""
                      className="size-full object-contain"
                      src={thumb.src}
                    />
                  </button>
                );
              })}
            </div>
          ) : null
        }
      />
    </div>
  );
}

export type { ListingLotGalleryCopy, ListingLotGalleryProps };
export { ListingLotGallery };
