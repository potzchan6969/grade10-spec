import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { STORE_LOCATOR_HREF } from "../../workbench-story-nav";
import {
  PRODUCT_DETAIL_PRODUCT,
  SOLD_OUT_PRODUCT,
} from "./product-detail-content";
import { StoreProductDetail } from "./store-product-detail";

const meta = {
  title: "Store/Product Page/Parts/StoreProductDetail",
  component: StoreProductDetail,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof StoreProductDetail>;

export default meta;
type Story = StoryObj<typeof meta>;

const content: Decorator = (Story) => (
  <div className="w-full">
    <Story />
  </div>
);

export const Default: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  decorators: [content],
  play: async ({ canvasElement }) => {
    // Product-status SC-10 and SC-11: no stock cue or count reaches browse UI.
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: PRODUCT_DETAIL_PRODUCT.title,
      }),
    ).toBeVisible();
    expect(canvas.getByRole("img", { name: /front view/ })).toBeVisible();
    expect(canvas.queryByText("Only 3 left")).toBeNull();
    expect(canvas.queryByRole("radiogroup")).toBeNull();
    expect(canvas.queryByText("Standard box")).toBeNull();
    expect(canvas.queryByText("Collector case")).toBeNull();
    expect(canvas.queryByText("Gift bundle")).toBeNull();
    expect(canvas.getByText("HK$105.00")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-STD")).toBeVisible();
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    /* grade10-site-store-product-page-SC-25 and SC-38: the store name opens
       Store Locator, and Shipping fee, with no page, is text. */
    const metadata = canvasElement.querySelector(
      '[data-slot="store-product-metadata"]',
    ) as HTMLElement;
    const links = within(metadata).getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", STORE_LOCATOR_HREF);
    expect(
      within(metadata).queryByRole("link", { name: /shipping fee/i }),
    ).toBeNull();
  },
};

export const NoMedia: Story = {
  args: { product: { ...PRODUCT_DETAIL_PRODUCT, images: [] } },
  decorators: [content],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("img", { name: PRODUCT_DETAIL_PRODUCT.title }),
    ).toBeVisible();
    expect(canvas.queryByRole("img", { name: /front view/ })).toBeNull();
  },
};

export const SoldOut: Story = {
  args: { product: SOLD_OUT_PRODUCT },
  decorators: [content],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.queryByText("This product is not for sale.")).toBeNull();
    expect(canvas.queryByRole("radiogroup", { name: "Variant" })).toBeNull();
    expect(canvas.getByText("HK$105.00")).toBeVisible();
  },
};

export const Narrow: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  decorators: [content],
  globals: { viewport: { value: "mobile1" } },
};
