import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  PRODUCT_DETAIL_PRODUCT,
  SOLD_OUT_PRODUCT,
} from "../pages/product-detail-content";
import { StoreProductHeader } from "./store-product-header";

const meta = {
  title: "Store Product/Product Header",
  component: StoreProductHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof StoreProductHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: PRODUCT_DETAIL_PRODUCT.title,
    variant: PRODUCT_DETAIL_PRODUCT.variants[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: PRODUCT_DETAIL_PRODUCT.title,
      }),
    ).toBeVisible();
    expect(canvas.getByText("HK$105.00")).toBeVisible();
    expect(canvas.getByText("For sale")).toBeVisible();
    expect(canvas.getByText("Only 3 left")).toBeVisible();
  },
};

export const SoldOut: Story = {
  args: {
    title: SOLD_OUT_PRODUCT.title,
    variant: SOLD_OUT_PRODUCT.variants[0],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
    expect(canvas.queryByText("For sale")).toBeNull();
    expect(canvas.queryByText(/Only .* left/)).toBeNull();
  },
};
