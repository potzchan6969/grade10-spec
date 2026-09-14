import type { StoreProductImage } from "./types";

type StoreProductGalleryProps = {
  images: readonly StoreProductImage[];
  title: string;
};

function StoreProductGallery({ images, title }: StoreProductGalleryProps) {
  const singleImage = images.length === 1;

  return (
    <div
      className="grid gap-4 sm:grid-cols-2 lg:pt-6"
      data-slot="store-product-gallery"
    >
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            alt={image.alt}
            className={`aspect-square w-full rounded-(--radius-4xl) bg-muted object-cover ${
              singleImage ? "sm:col-span-2" : ""
            }`}
            fetchPriority={image.fetchPriority}
            key={`${image.src}-${image.alt}`}
            loading={index === 0 ? "eager" : "lazy"}
            sizes={image.sizes}
            src={image.src}
            srcSet={image.srcSet}
          />
        ))
      ) : (
        <div
          aria-label={title}
          className="aspect-square w-full rounded-(--radius-4xl) bg-linear-to-br from-muted via-background-subtle to-muted sm:col-span-2"
          role="img"
        />
      )}
    </div>
  );
}

export type { StoreProductGalleryProps };
export { StoreProductGallery };
