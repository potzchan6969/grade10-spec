import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PRODUCT_DETAIL_STORY, SOLD_OUT_PRODUCT_STORY } from "./fixtures";
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
    title: PRODUCT_DETAIL_STORY.title,
    saleItem: PRODUCT_DETAIL_STORY.saleItem,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 1,
        name: PRODUCT_DETAIL_STORY.title,
      }),
    ).toBeVisible();
    expect(canvas.getByText("HK$105.00")).toBeVisible();
    expect(canvas.queryByText("For sale")).toBeNull();
    expect(canvas.getByText("Only 3 left")).toBeVisible();
  },
};

export const SoldOut: Story = {
  args: {
    title: SOLD_OUT_PRODUCT_STORY.title,
    saleItem: SOLD_OUT_PRODUCT_STORY.saleItem,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
    expect(canvas.queryByText("For sale")).toBeNull();
    expect(canvas.queryByText(/Only .* left/)).toBeNull();
  },
};
