import { Badge } from "@grade10/design-system/components/display/badge";
import {
  BreadcrumbItem,
  BreadcrumbSeparator,
  Breadcrumbs,
} from "@grade10/design-system/components/display/breadcrumbs";
import { Text } from "@grade10/design-system/components/display/text";
import { Button } from "@grade10/design-system/components/forms/button";
import { RadioList } from "@grade10/design-system/components/forms/radio-list";
import { RadioListItem } from "@grade10/design-system/components/forms/radio-list-item";
import { StepperInput } from "@grade10/design-system/components/forms/stepper-input";
import { Link } from "@grade10/design-system/components/forms/link";
import { Footer } from "@grade10/design-system/components/layout/footer";
import { HStack } from "@grade10/design-system/components/layout/hstack";
import { VStack } from "@grade10/design-system/components/layout/vstack";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { useId, useState } from "react";
import {
  PRODUCT_DETAIL_PRODUCT,
  SOLD_OUT_PRODUCT,
  type ProductDetailProduct,
} from "./product-detail-content";
import { STORE_FOOTER, STORE_NAV } from "./store-content";
import { WorkbenchAccountNav } from "./workbench-account-nav";

/**
 * The Store product detail page as a store assembles it: storefront chrome,
 * the media-led product surface, and the footer. The fixture and all state
 * live here so the page story exercises the same composition a real store
 * would own without importing the production app.
 */
function ProductDetailPage({
  product,
}: {
  product: ProductDetailProduct;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [added, setAdded] = useState(false);
  const descriptionId = useId();
  const selectedVariant = product.variants.find(
    (variant) => variant.id === selectedVariantId,
  );
  const hasLongDescription = product.description.length > 160;
  const forSale = selectedVariant?.availableForSale === true;
  const quantityAvailable = selectedVariant?.quantityAvailable;

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <WorkbenchAccountNav {...STORE_NAV} promo={null} />
      <main className="flex-1">
        <VStack
          gap="lg"
          className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 lg:py-12"
        >
          <Breadcrumbs>
            <BreadcrumbItem href="#home">Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem href="#shop">Shop</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem current>{product.title}</BreadcrumbItem>
          </Breadcrumbs>

          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-12">
            <div className="grid gap-4 sm:grid-cols-2">
              {product.images.length > 0 ? (
                product.images.map((image, index) => (
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
                  aria-label={product.title}
                  className="aspect-square w-full rounded-(--radius-4xl) bg-linear-to-br from-muted via-background-subtle to-muted sm:col-span-2"
                  role="img"
                />
              )}
            </div>

            <VStack gap="lg" className="lg:sticky lg:top-24">
              <Text as="h2" size="xl" weight="bold" className="text-3xl">
                {product.title}
              </Text>

              {selectedVariant ? (
                <VStack gap="sm">
                  <HStack gap="sm" vAlign="center" className="flex-wrap">
                    <Text size="xl" weight="bold">
                      {selectedVariant.price}
                    </Text>
                    {selectedVariant.compareAtPrice ? (
                      <Text
                        size="base"
                        tone="secondary"
                        className="line-through"
                      >
                        {selectedVariant.compareAtPrice}
                      </Text>
                    ) : null}
                  </HStack>
                  {forSale ? (
                    <Text size="sm" tone="success">
                      For sale
                    </Text>
                  ) : null}
                  {quantityAvailable != null &&
                  quantityAvailable > 0 &&
                  quantityAvailable <= 3 ? (
                    <Text size="sm" tone="error">
                      Only {quantityAvailable} left
                    </Text>
                  ) : null}
                </VStack>
              ) : null}

              <VStack gap="sm">
                <Text
                  id={descriptionId}
                  tone="secondary"
                  className={
                    hasLongDescription && !descriptionExpanded
                      ? "line-clamp-3"
                      : undefined
                  }
                >
                  {product.description}
                </Text>
                {hasLongDescription ? (
                  <Button
                    aria-controls={descriptionId}
                    aria-expanded={descriptionExpanded}
                    className="self-start"
                    onClick={() => setDescriptionExpanded((value) => !value)}
                    size="sm"
                    variant="ghost"
                  >
                    {descriptionExpanded ? "Show less" : "Show more"}
                  </Button>
                ) : null}
              </VStack>

              {product.variants.length > 1 ? (
                <RadioList
                  label="Grade"
                  onValueChange={(value) => {
                    const next = product.variants.find(
                      (variant) => variant.id === String(value),
                    );
                    if (!next?.availableForSale) return;
                    setSelectedVariantId(next.id);
                    setQuantity(1);
                    setAdded(false);
                  }}
                  value={selectedVariantId}
                >
                  {product.variants.map((variant) => (
                    <RadioListItem
                      disabled={!variant.availableForSale}
                      key={variant.id}
                      value={variant.id}
                    >
                      <HStack gap="sm">
                        <Text className="w-32 shrink-0" size="sm" weight="bold">
                          {variant.title}
                        </Text>
                        <Text size="sm" tone="secondary">
                          {variant.price}
                          {variant.availableForSale ? "" : " — sold out"}
                        </Text>
                      </HStack>
                    </RadioListItem>
                  ))}
                </RadioList>
              ) : selectedVariant ? (
                <HStack
                  className="items-center justify-between rounded-(--radius-md) bg-muted px-4 py-3"
                  gap="sm"
                >
                  <Text size="sm" weight="bold">
                    {selectedVariant.title}
                  </Text>
                  <Text size="sm" tone="secondary">
                    {selectedVariant.price}
                    {forSale ? "" : " — sold out"}
                  </Text>
                </HStack>
              ) : null}

              <StepperInput
                aria-label="Quantity"
                decrementLabel="Decrease quantity"
                disabled={!forSale}
                incrementLabel="Increase quantity"
                label="Quantity"
                max={quantityAvailable}
                min={1}
                onValueChange={setQuantity}
                size="lg"
                value={quantity}
              />

              <Button
                className="w-full"
                disabled={!forSale}
                onClick={() => setAdded(true)}
              >
                {forSale ? (added ? "Added to cart" : "Add to cart") : "Sold out"}
              </Button>
              {!forSale ? (
                <Text size="sm" tone="secondary">
                  This product is not for sale.
                </Text>
              ) : null}

              <VStack gap="sm" className="border-t border-border pt-6">
                <Text size="sm" weight="bold">
                  About this item
                </Text>
                <HStack gap="sm" className="flex-wrap">
                  {product.badges.map((badge) => (
                    <Badge key={badge} size="sm">
                      {badge}
                    </Badge>
                  ))}
                </HStack>
                {selectedVariant?.sku ? (
                  <Text size="sm" tone="secondary">
                    SKU: {selectedVariant.sku}
                  </Text>
                ) : null}
              </VStack>

              <VStack gap="sm" className="border-t border-border pt-6">
                <Text size="sm" weight="bold">
                  Shipping & pickup
                </Text>
                <Text size="sm" tone="secondary">
                  Shipping calculated at checkout
                </Text>
              </VStack>

              <Link href="#shop" size="sm">
                Back to the store
              </Link>
            </VStack>
          </div>
        </VStack>
      </main>
      <Footer {...STORE_FOOTER} />
    </div>
  );
}

const meta = {
  title: "Pages/Product Detail Page",
  component: ProductDetailPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ProductDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: PRODUCT_DETAIL_PRODUCT.title,
      }),
    ).toBeVisible();
    expect(
      canvas.getByRole("img", { name: /front view/ }),
    ).toBeVisible();
    expect(canvas.getByText("Only 3 left")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeInTheDocument();

    await canvas.getByRole("button", { name: "Show more" }).click();
    expect(canvas.getByRole("button", { name: "Show less" })).toBeVisible();
  },
};

export const Narrow: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  globals: { viewport: { value: "mobile1" } },
};

export const NoMedia: Story = {
  args: { product: { ...PRODUCT_DETAIL_PRODUCT, images: [] } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("img", { name: PRODUCT_DETAIL_PRODUCT.title }),
    ).toBeVisible();
  },
};

export const SoldOut: Story = {
  args: { product: SOLD_OUT_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.getByText("This product is not for sale.")).toBeVisible();
  },
};
