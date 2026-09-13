import type { ProductDetailProduct } from "../pages/product-detail-content";

type StoreProductGalleryProps = {
  images: ProductDetailProduct["images"];
  title: string;
};

function StoreProductGallery({ images, title }: StoreProductGalleryProps) {
  return (
    <div
      className="grid gap-4 sm:grid-cols-2"
      data-slot="store-product-gallery"
    >
      {images.length > 0 ? (
        images.map((image, index) => (
          <img
            alt={image.alt}
            className="aspect-square w-full rounded-(--radius-4xl) bg-muted object-cover"
            key={image.alt}
            loading={index === 0 ? "eager" : "lazy"}
            src={image.src}
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
