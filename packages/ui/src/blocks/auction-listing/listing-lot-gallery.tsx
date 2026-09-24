import { Badge } from "@grade10/design-system/components/display/badge";
import {
  CarouselProgress,
  CarouselProgressItem,
} from "@grade10/design-system/components/display/carousel-progress";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useState } from "react";
import { LISTING_LOT_GALLERY_CLASS } from "./listing-lot-layout";
import type { ListingLotGalleryImage } from "./types";

type ListingLotGalleryCopy = {
  previous: string;
  next: string;
  /** Accessible name for the slide progress control. */
  images: string;
};

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
  const safeIndex = many
    ? ((index % images.length) + images.length) % images.length
    : 0;
  const item = images[safeIndex];

  function goTo(next: number) {
    if (images.length === 0) return;
    setIndex(((next % images.length) + images.length) % images.length);
  }

  function step(delta: number) {
    goTo(safeIndex + delta);
  }

  return (
    <div
      className={cn(LISTING_LOT_GALLERY_CLASS, className)}
      data-slot="listing-lot-gallery"
    >
      <div
        className={cn(
          "flex w-full flex-col gap-4",
          many && "md:flex-row md:items-start md:gap-4",
        )}
      >
        {many ? (
          <div
            className="flex shrink-0 gap-2 overflow-x-auto overscroll-x-contain md:flex-col md:overflow-visible"
            role="group"
          >
            {images.map((thumb, thumbIndex) => {
              const selected = thumbIndex === safeIndex;
              return (
                <button
                  aria-current={selected ? "true" : undefined}
                  aria-label={`Thumbnail: ${thumb.alt}`}
                  className={cn(
                    "relative size-16 shrink-0 overflow-hidden rounded-xl border-2 bg-background-subtle outline-none transition-[border-color] focus-visible:ring-3 focus-visible:ring-ring/50 md:size-20",
                    selected ? "border-foreground" : "border-transparent",
                  )}
                  key={`${thumb.src}:${thumb.alt}`}
                  onClick={() => goTo(thumbIndex)}
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
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="relative aspect-square w-full overflow-hidden rounded-4xl bg-background-subtle">
            {item ? (
              <img
                alt={item.alt}
                className="size-full object-contain"
                src={item.src}
              />
            ) : null}

            {many ? (
              <>
                <div className="pointer-events-none absolute inset-y-0 flex w-full items-center justify-between px-2">
                  <IconButton
                    aria-label={copy.previous}
                    className="pointer-events-auto"
                    onClick={() => step(-1)}
                    type="button"
                    variant="secondary"
                  >
                    <CaretLeft aria-hidden size={16} weight="bold" />
                  </IconButton>
                  <IconButton
                    aria-label={copy.next}
                    className="pointer-events-auto"
                    onClick={() => step(1)}
                    type="button"
                    variant="secondary"
                  >
                    <CaretRight aria-hidden size={16} weight="bold" />
                  </IconButton>
                </div>
                <Badge
                  className="pointer-events-none absolute bottom-3 left-3 bg-background/90 text-foreground backdrop-blur-sm"
                  size="sm"
                  variant="outline"
                >
                  {safeIndex + 1} / {images.length}
                </Badge>
              </>
            ) : null}
          </div>

          {many ? (
            <CarouselProgress
              aria-label={copy.images}
              className="w-full justify-center"
            >
              {images.map((slide, slideIndex) => (
                <CarouselProgressItem
                  active={slideIndex === safeIndex}
                  className="after:absolute after:-inset-3 after:content-['']"
                  key={`${slide.src}:${slide.alt}`}
                  label={`Show image ${slideIndex + 1}: ${slide.alt}`}
                  onClick={() => goTo(slideIndex)}
                />
              ))}
            </CarouselProgress>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export type { ListingLotGalleryCopy, ListingLotGalleryProps };
export { ListingLotGallery };
