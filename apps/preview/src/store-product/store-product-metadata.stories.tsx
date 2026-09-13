import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  PRODUCT_DETAIL_PRODUCT,
  SOLD_OUT_PRODUCT,
} from "../pages/product-detail-content";
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
    badges: PRODUCT_DETAIL_PRODUCT.badges,
    sku: PRODUCT_DETAIL_PRODUCT.variants[0].sku,
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
  args: { badges: SOLD_OUT_PRODUCT.badges },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About this item")).toBeVisible();
    expect(canvas.queryByText(/^SKU:/)).toBeNull();
    expect(canvas.getByText("Shipping calculated at checkout")).toBeVisible();
  },
};
