import { cn } from "@grade10/design-system/lib/utils";
import type { ComponentProps, ReactNode } from "react";

type CollectionBannerProps = ComponentProps<"section"> & {
  /** Trail above the title. Assemble with `Breadcrumbs`. */
  breadcrumbs: ReactNode;
  /** Collection name. Figma's `collection` text property. */
  collection: ReactNode;
  description: ReactNode;
  /** Hero image on the trailing edge. Omit it and only copy remains. */
  imageSrc?: string;
  imageAlt?: string;
};

/**
 * Category hero. Figma set `Product / Collection Banner` (`4248:5104`) has no
 * variant axes — breadcrumbs, title, description, and image are store-owned.
 *
 * Every content prop that displays a store's catalog is required rather than
 * defaulted, except the image: some collections have no pack shot, and a
 * default would leak another store's art.
 */
function CollectionBanner({
  className,
  breadcrumbs,
  collection,
  description,
  imageSrc,
  imageAlt = "",
  ...props
}: CollectionBannerProps) {
  return (
    <section
      data-slot="collection-banner"
      className={cn(
        "relative flex w-full flex-col items-start gap-4 overflow-hidden border-b border-border bg-card px-10 py-12",
        className,
      )}
      {...props}
    >
      {imageSrc ? (
        <div
          aria-hidden
          className="pointer-events-none absolute top-[calc(50%+61px)] right-6 size-[365px] -translate-y-1/2"
          data-slot="collection-banner-image"
        >
          <img
            alt={imageAlt}
            className="size-[333px] rotate-[5.67deg] object-cover opacity-90"
            height={333}
            src={imageSrc}
            width={333}
          />
        </div>
      ) : null}
      <div className="relative">{breadcrumbs}</div>
      <div className="relative flex w-full min-w-0 flex-col gap-2 overflow-hidden">
        <h1 className="max-w-[546px] font-bold text-5xl text-foreground">
          {collection}
        </h1>
        <p className="max-w-[640px] text-sm text-secondary-foreground">
          {description}
        </p>
      </div>
    </section>
  );
}

export type { CollectionBannerProps };
export { CollectionBanner };
