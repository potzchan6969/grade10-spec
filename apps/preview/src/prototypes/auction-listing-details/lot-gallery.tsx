import { VStack } from "@grade10/design-system/components/layout/vstack";
import { cn } from "@grade10/design-system/lib/utils";
import type { LotFixture } from "./types";
import { GALLERY_COLUMN_CLASS } from "./page-shell";

type LotGalleryProps = {
  lot: LotFixture;
};

function LotGallery({ lot }: LotGalleryProps) {
  return (
    <div
      className={cn(
        GALLERY_COLUMN_CLASS,
        "scroll-fade max-h-[calc(100svh-11rem)] min-h-0 overflow-y-auto overscroll-y-contain lg:sticky lg:top-6 lg:self-start",
      )}
      data-slot="lot-gallery"
    >
      <VStack className="w-full" gap="lg">
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
    </div>
  );
}

export { LotGallery };
