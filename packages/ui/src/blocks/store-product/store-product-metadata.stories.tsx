import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PRODUCT_DETAIL_STORY, SOLD_OUT_PRODUCT_STORY } from "./fixtures";
import { StoreProductMetadata } from "./store-product-metadata";

const meta = {
  title: "Store Product/Product Metadata",
  component: StoreProductMetadata,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof StoreProductMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    badges: PRODUCT_DETAIL_STORY.badges,
    sku: PRODUCT_DETAIL_STORY.saleItem.sku,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About this item")).toBeVisible();
    expect(canvas.getByText("Booster Box")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-STD")).toBeVisible();
    expect(canvas.getByText("Shipping & pickup")).toBeVisible();
  },
};

export const WithoutSku: Story = {
  args: { badges: SOLD_OUT_PRODUCT_STORY.badges },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About this item")).toBeVisible();
    expect(canvas.queryByText(/^SKU:/)).toBeNull();
    expect(canvas.getByText("Shipping calculated at checkout")).toBeVisible();
  },
};
