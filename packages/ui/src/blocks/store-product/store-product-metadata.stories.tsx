import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import {
  METADATA_COPY,
  PRODUCT_DETAIL_STORY,
  SOLD_OUT_PRODUCT_STORY,
} from "./fixtures";
import { StoreProductMetadata } from "./store-product-metadata";

const meta = {
  title: "Store/Product Page/Blocks/StoreProductMetadata",
  component: StoreProductMetadata,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: METADATA_COPY,
    pickupHref: "#pickup",
    shippingFeeHref: "#shipping",
  },
} satisfies Meta<typeof StoreProductMetadata>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_080a9d38-5f53-431b-82ac-c7c71af15d60" },
  },
  args: {
    badges: PRODUCT_DETAIL_STORY.badges,
    copy: METADATA_COPY,
    sku: PRODUCT_DETAIL_STORY.saleItem.sku,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About This Item")).toBeVisible();
    expect(canvas.getByText("Booster Box")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-STD")).toBeVisible();
    expect(canvas.getByText("Shipping & Pickup")).toBeVisible();
  },
};

export const WithoutSku: Story = {
  parameters: {
    verification: { caseId: "vc_599ad3ee-bb97-4c8c-8960-8bd6f0235d5d" },
  },
  args: {
    badges: SOLD_OUT_PRODUCT_STORY.badges,
    copy: METADATA_COPY,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("About This Item")).toBeVisible();
    expect(canvas.queryByText(/^SKU:/)).toBeNull();
    expect(canvas.getByText("Shipping calculated at checkout")).toBeVisible();
  },
};

/** A label with no page is the line's own text: neither the store name nor
 * the shipping fee is a link, and neither is underlined (Q22). */
export const NoPages: Story = {
  parameters: {
    verification: { caseId: "vc_7081923d-c4b6-4e0b-84b1-04594cf7ebae" },
  },
  args: {
    badges: PRODUCT_DETAIL_STORY.badges,
    copy: METADATA_COPY,
    pickupHref: undefined,
    shippingFeeHref: undefined,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryAllByRole("link")).toHaveLength(0);
    for (const label of [
      args.copy.hongKongGrade10Store,
      args.copy.shippingFee,
    ]) {
      const text = canvas.getByText(label);
      expect(getComputedStyle(text).textDecorationLine).toBe("none");
    }
  },
};
