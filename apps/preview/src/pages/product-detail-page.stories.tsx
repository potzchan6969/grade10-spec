import { Footer } from "@grade10/design-system/components/layout/footer";
import { SiteHeader } from "@grade10/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { StoreProductDetail } from "../store-product/store-product-detail";
import {
  PRODUCT_DETAIL_PRODUCT,
  type ProductDetailProduct,
  SOLD_OUT_PRODUCT,
} from "./product-detail-content";
import { STORE_FOOTER, STORE_SITE_HEADER } from "./store-content";

/**
 * The Store product detail page as a store assembles it: storefront chrome,
 * the product-detail composition, and the footer. The page story owns the
 * chrome while StoreProductDetail owns the preview state and surface.
 */
function ProductDetailPage({ product }: { product: ProductDetailProduct }) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader {...STORE_SITE_HEADER} promo={null} />
      <StoreProductDetail product={product} />
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
        level: 1,
        name: PRODUCT_DETAIL_PRODUCT.title,
      }),
    ).toBeVisible();
    expect(canvas.getByRole("img", { name: /front view/ })).toBeVisible();
    expect(canvas.queryByText("Only 3 left")).toBeNull();
    expect(canvas.getByRole("radiogroup", { name: "Variant" })).toBeVisible();
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    expect(canvas.getByRole("contentinfo")).toBeInTheDocument();

    await canvas.getByRole("button", { name: "Show more" }).click();
    expect(canvas.getByRole("button", { name: "Show less" })).toBeVisible();
  },
};

export const SelectUnavailableVariant: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("radio", { name: /Collector case/ }),
    );
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.getByText("HK$1,050.00")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-CASE")).toBeVisible();
  },
};

export const SelectAnotherAvailableVariant: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  play: async ({ canvasElement }) => {
    // Product-page SC-07: the selected and added variant keeps its identity.
    const canvas = within(canvasElement);
    const giftBundle = canvas.getByRole("radio", { name: /Gift bundle/ });
    await userEvent.click(giftBundle);
    expect(giftBundle).toBeChecked();
    expect(canvas.getByText("HK$210.00")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-GIFT")).toBeVisible();
    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(canvas.getByRole("status")).toHaveTextContent(
      "Gift bundle added to cart.",
    );
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
