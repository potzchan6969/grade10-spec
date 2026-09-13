import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PRODUCT_DETAIL_PRODUCT } from "../pages/product-detail-content";
import { StoreProductGallery } from "./store-product-gallery";

const meta = {
  title: "Store Product/Product Gallery",
  component: StoreProductGallery,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof StoreProductGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    images: PRODUCT_DETAIL_PRODUCT.images,
    title: PRODUCT_DETAIL_PRODUCT.title,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("img", { name: /front view/ })).toBeVisible();
    expect(canvas.getByRole("img", { name: /detail view/ })).toBeVisible();
  },
};

export const NoMedia: Story = {
  args: { images: [], title: PRODUCT_DETAIL_PRODUCT.title },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("img", { name: PRODUCT_DETAIL_PRODUCT.title }),
    ).toBeVisible();
  },
};
