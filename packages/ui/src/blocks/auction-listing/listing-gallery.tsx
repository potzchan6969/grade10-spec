import { Text } from "@grade10/design-system/components/display/text";
import { IconButton } from "@grade10/design-system/components/forms/icon-button";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@grade10/design-system/components/overlays/dialog";
import { cn } from "@grade10/design-system/lib/utils";
import { CaretLeft, CaretRight, MagnifyingGlass } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useState } from "react";

type ListingGalleryImage = {
  src: string;
  alt: string;
  /** Accessible name for the thumbnail. Defaults to `alt`. */
  thumbLabel?: string;
};

type ListingGalleryProps = {
  images: readonly ListingGalleryImage[];
  zoomLabel: ReactNode;
  previousLabel: string;
  nextLabel: string;
  className?: string;
};

/**
 * Left column of a product page: the main photo, a thumbnail strip, and zoom.
 * Selected index and the zoom dialog are presentation state.
 */
function ListingGallery({
  images,
  zoomLabel,
  previousLabel,
  nextLabel,
  className,
}: ListingGalleryProps) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const image = images[index];
  const many = images.length > 1;
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
        {image ? (
          <button
            className="absolute inset-0 cursor-pointer border-0 bg-transparent p-0"
            onClick={() => setZoomOpen(true)}
            type="button"
          >
            <img
              alt={image.alt}
              className="size-full object-contain"
              src={image.src}
            />
          </button>
        ) : null}
        <HStack
          className="pointer-events-none absolute top-3 left-3"
          gap="xs"
          vAlign="center"
        >
          <MagnifyingGlass aria-hidden size={14} weight="bold" />
          <Text size="sm" tone="secondary">
            {zoomLabel}
          </Text>
        </HStack>
        <HStack
          align="center"
          className="pointer-events-none absolute inset-y-0 w-full px-2"
          justify="space-between"
        >
          <IconButton
            aria-label={previousLabel}
            className="pointer-events-auto"
            disabled={!many}
            onClick={() => step(-1)}
            variant="secondary"
          >
            <CaretLeft aria-hidden size={16} weight="bold" />
          </IconButton>
          <IconButton
            aria-label={nextLabel}
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
          {images.map((thumb, thumbIndex) => (
            <button
              aria-label={thumb.thumbLabel ?? thumb.alt}
              aria-pressed={thumbIndex === index}
              className={cn(
                "h-16 w-12 overflow-hidden rounded-sm border bg-muted",
                thumbIndex === index
                  ? "border-foreground"
                  : "border-transparent",
              )}
              key={`${thumb.src}:${thumb.thumbLabel ?? thumb.alt}`}
              onClick={() => setIndex(thumbIndex)}
              type="button"
            >
              <img alt="" className="size-full object-cover" src={thumb.src} />
            </button>
          ))}
        </HStack>
      ) : null}
      {image ? (
        <Dialog onOpenChange={setZoomOpen} open={zoomOpen}>
          <DialogContent className="sm:max-w-2xl" showCloseButton>
            <DialogTitle>{zoomLabel}</DialogTitle>
            <img alt={image.alt} className="w-full" src={image.src} />
          </DialogContent>
        </Dialog>
      ) : null}
    </VStack>
  );
}

export type { ListingGalleryImage, ListingGalleryProps };
export { ListingGallery };
