import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  HEADER_COPY,
  PRODUCT_DETAIL_STORY,
  SOLD_OUT_PRODUCT_STORY,
} from "./fixtures";
import { StoreProductHeader } from "./store-product-header";

const meta = {
  title: "Store/Product Page/Blocks/StoreProductHeader",
  component: StoreProductHeader,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: HEADER_COPY,
  },
} satisfies Meta<typeof StoreProductHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_33eafc5a-d27d-4fc9-9a3a-ce6a69e6373e" },
  },
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
    expect(canvas.queryByText(/Only .* left/)).toBeNull();
  },
};

/**
 * Scenario: grade10-site-commerce-product-status-SC-15 - A sold-out product
 * keeps its item's price while the purchase block disables adding it.
 */
export const SoldOut: Story = {
  parameters: {
    verification: { caseId: "vc_affbab50-03ea-42f5-8f70-133672dd3283" },
  },
  args: {
    title: SOLD_OUT_PRODUCT_STORY.title,
    saleItem: SOLD_OUT_PRODUCT_STORY.saleItem,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$105.00")).toBeVisible();
    expect(canvas.queryByText(/Only \d+ left/i)).not.toBeInTheDocument();
  },
};
