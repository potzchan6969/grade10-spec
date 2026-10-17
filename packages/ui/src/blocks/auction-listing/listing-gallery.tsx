import { Lens } from "@grade10/design-system/components/display/lens";
import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import {
  CaretLeft,
  CaretRight,
  MagnifyingGlass,
  Play,
} from "@phosphor-icons/react";
import { useState } from "react";

type ListingGalleryImage = {
  /** Defaults to `image`. Video items play in the main frame; zoom is omitted. */
  kind?: "image" | "video";
  /** Main frame. Also the fallback when `thumbSrc` or `zoomSrc` is omitted. */
  src: string;
  /** Thumbnail strip. Falls back to `src`. */
  thumbSrc?: string;
  /** Magnified lens view. Falls back to `src`. Ignored for video. */
  zoomSrc?: string;
  alt: string;
  /** Accessible name for the thumbnail. Defaults to `alt`. */
  thumbLabel?: string;
};

/** The words the gallery says, whichever lot it is showing. */
type ListingGalleryCopy = {
  /** Names the magnifier hint over the photo and the lens group. */
  zoom: string;
  /**
   * Appended to `zoom` in the lens's accessible name — how the magnifier is
   * driven (pointer, arrow keys, Escape).
   */
  zoomInstructions?: string;
  /** Accessible names for the two step controls. */
  previous: string;
  next: string;
};

type ListingGalleryProps = {
  copy: ListingGalleryCopy;
  images: readonly ListingGalleryImage[];
  className?: string;
};

function isVideo(item: ListingGalleryImage | undefined): boolean {
  return item?.kind === "video";
}

/**
 * Left column of a product page: the main photo or video, a thumbnail strip,
 * and a magnifying lens for images. Selected index is presentation state.
 * Source addresses are consumer-owned — the gallery never rewrites them.
 */
function ListingGallery({ images, copy, className }: ListingGalleryProps) {
  const [index, setIndex] = useState(0);
  const item = images[index];
  const many = images.length > 1;
  const video = isVideo(item);
  const step = (delta: number) => {
    setIndex((current) => (current + delta + images.length) % images.length);
  };

  return (
    <VStack
      className={cn("w-full", className)}
      data-slot="listing-gallery"
      gap="sm"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
        {item ? (
          video ? (
            <video
              aria-label={item.alt}
              className="size-full object-contain"
              controls
              src={item.src}
            >
              <track kind="captions" label="English" srcLang="en" />
            </video>
          ) : (
            <Lens
              className="block size-full rounded-none focus-visible:ring-inset"
              instructions={copy.zoomInstructions}
              key={`${item.src}:${item.alt}`}
              label={copy.zoom}
              magnified={
                <img
                  alt=""
                  className="size-full object-contain"
                  src={item.zoomSrc ?? item.src}
                />
              }
            >
              <img
                alt={item.alt}
                className="pointer-events-none size-full object-contain"
                draggable={false}
                src={item.src}
              />
            </Lens>
          )
        ) : null}
        {!video && item ? (
          <HStack
            className="pointer-events-none absolute top-3 left-3"
            gap="xs"
            vAlign="center"
          >
            <MagnifyingGlass aria-hidden size={14} weight="bold" />
            <Text size="sm" tone="secondary">
              {copy.zoom}
            </Text>
          </HStack>
        ) : null}
        <HStack
          align="center"
          className="pointer-events-none absolute inset-y-0 w-full px-2"
          justify="space-between"
        >
          <IconButton
            aria-label={copy.previous}
            className="pointer-events-auto"
            disabled={!many}
            onClick={() => step(-1)}
            variant="secondary"
          >
            <CaretLeft aria-hidden size={16} weight="bold" />
          </IconButton>
          <IconButton
            aria-label={copy.next}
            className="pointer-events-auto"
            disabled={!many}
            onClick={() => step(1)}
            variant="secondary"
          >
            <CaretRight aria-hidden size={16} weight="bold" />
          </IconButton>
        </HStack>
      </div>
      {many ? (
        <HStack gap="sm">
          {images.map((thumb, thumbIndex) => {
            const thumbVideo = isVideo(thumb);
            const thumbSrc = thumb.thumbSrc ?? thumb.src;
            return (
              <button
                aria-label={thumb.thumbLabel ?? thumb.alt}
                aria-pressed={thumbIndex === index}
                className={cn(
                  "relative h-16 w-12 overflow-hidden rounded-sm border bg-muted",
                  thumbIndex === index
                    ? "border-primary-border"
                    : "border-transparent",
                )}
                key={`${thumbSrc}:${thumb.thumbLabel ?? thumb.alt}`}
                onClick={() => {
                  setIndex(thumbIndex);
                }}
                type="button"
              >
                {thumbVideo ? (
                  <video
                    aria-hidden
                    className="size-full object-cover"
                    muted
                    playsInline
                    preload="metadata"
                    src={thumbSrc}
                  />
                ) : (
                  <img
                    alt=""
                    className="size-full object-cover"
                    src={thumbSrc}
                  />
                )}
                {thumbVideo ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/35"
                  >
                    <Play color="white" size={18} weight="fill" />
                  </span>
                ) : null}
              </button>
            );
          })}
        </HStack>
      ) : null}
    </VStack>
  );
}

export type { ListingGalleryCopy, ListingGalleryImage, ListingGalleryProps };
export { ListingGallery };
