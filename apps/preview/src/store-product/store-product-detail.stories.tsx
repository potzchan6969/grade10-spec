import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  PRODUCT_DETAIL_PRODUCT,
  SOLD_OUT_PRODUCT,
} from "../pages/product-detail-content";
import { StoreProductDetail } from "./store-product-detail";

const meta = {
  title: "Store Product/Product Detail",
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
    expect(canvas.getByText("This product is not for sale.")).toBeVisible();
    expect(canvas.queryByRole("radiogroup", { name: "Variant" })).toBeNull();
    expect(canvas.getByText("HK$105.00")).toBeVisible();
  },
};

export const DescriptionDisclosure: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  decorators: [content],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const showMore = canvas.getByRole("button", { name: "Show more" });
    expect(showMore).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(showMore);
    expect(canvas.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Show less" }));
    expect(canvas.getByRole("button", { name: "Show more" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  },
};

export const QuantityAndCart: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  decorators: [content],
  play: async ({ canvasElement }) => {
    // Product-status SC-11: the requested quantity can exceed the browse count.
    const canvas = within(canvasElement);
    const increase = canvas.getByRole("button", { name: "Increase quantity" });
    await userEvent.click(increase);
    await userEvent.click(increase);
    await userEvent.click(increase);
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "4",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(canvas.getByRole("button", { name: "Added to cart" })).toBeVisible();
  },
};

export const UsesFirstAvailableSaleItem: Story = {
  args: {
    product: {
      ...PRODUCT_DETAIL_PRODUCT,
      variants: [
        {
          id: "retired-box",
          title: "Retired box",
          price: "HK$95.00",
          availableForSale: false,
          sku: "G10-M5-ABYSS-RETIRED",
        },
        {
          id: "available-box",
          title: "Available box",
          price: "HK$105.00",
          availableForSale: true,
          sku: "G10-M5-ABYSS-STD",
        },
      ],
    },
  },
  decorators: [content],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$105.00")).toBeVisible();
    expect(canvas.getByText("SKU: G10-M5-ABYSS-STD")).toBeVisible();
    expect(canvas.queryByText("HK$95.00")).toBeNull();
    expect(canvas.queryByText("Retired box")).toBeNull();
    expect(canvas.queryByText("Available box")).toBeNull();
    expect(canvas.queryByRole("radiogroup")).toBeNull();

    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(canvas.getByRole("button", { name: "Added to cart" })).toBeVisible();
  },
};

export const Narrow: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  decorators: [content],
  globals: { viewport: { value: "mobile1" } },
};
