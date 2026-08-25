import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
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
  /** Zoom dialog. Falls back to `src`. Ignored for video. */
  zoomSrc?: string;
  alt: string;
  /** Accessible name for the thumbnail. Defaults to `alt`. */
  thumbLabel?: string;
};

/** The words the gallery says, whichever lot it is showing. */
type ListingGalleryCopy = {
  /** Names the zoom affordance over the photo. */
  zoom: string;
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
 * and zoom for images. Selected index and the zoom dialog are presentation
 * state. Source addresses are consumer-owned — the gallery never rewrites them.
 */
function ListingGallery({ images, copy, className }: ListingGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const item = images[index];
  const many = images.length > 1;
  const video = isVideo(item);
  const step = (delta: number) => {
    setZoomOpen(false);
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
            <button
              className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0"
              onClick={() => setZoomOpen(true)}
              type="button"
            >
              <img
                alt={item.alt}
                className="size-full object-contain"
                src={item.src}
              />
            </button>
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
                    ? "border-foreground"
                    : "border-transparent",
                )}
                key={`${thumbSrc}:${thumb.thumbLabel ?? thumb.alt}`}
                onClick={() => {
                  setZoomOpen(false);
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
                    <Play
                      className="text-white"
                      size={18}
                      weight="fill"
                    />
                  </span>
                ) : null}
              </button>
            );
          })}
        </HStack>
      ) : null}
      {item && !video ? (
        <Dialog onOpenChange={setZoomOpen} open={zoomOpen}>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>{copy.zoom}</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <img
                alt={item.alt}
                className="w-full"
                src={item.zoomSrc ?? item.src}
              />
            </DialogBody>
          </DialogContent>
        </Dialog>
      ) : null}
    </VStack>
  );
}

export type { ListingGalleryCopy, ListingGalleryImage, ListingGalleryProps };
export { ListingGallery };
