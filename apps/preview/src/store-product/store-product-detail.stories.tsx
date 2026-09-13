import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  PRODUCT_DETAIL_PRODUCT,
  SINGLE_VARIANT_PRODUCT,
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
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", {
        level: 2,
        name: PRODUCT_DETAIL_PRODUCT.title,
      }),
    ).toBeVisible();
    expect(canvas.getByRole("img", { name: /front view/ })).toBeVisible();
    expect(canvas.getByText("Only 3 left")).toBeVisible();
    expect(canvas.getByRole("radio", { name: /Standard/ })).toBeChecked();
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
  },
};

export const SingleVariant: Story = {
  args: { product: SINGLE_VARIANT_PRODUCT },
  decorators: [content],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("radiogroup", { name: "Grade" })).toBeNull();
    expect(canvas.getByText("Standard")).toBeVisible();
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
    expect(
      canvas
        .getAllByRole("radio")
        .every((radio) => radio.hasAttribute("aria-disabled")),
    ).toBe(true);
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
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Increase quantity" }),
    );
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "2",
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(canvas.getByRole("button", { name: "Added to cart" })).toBeVisible();
  },
};

export const Narrow: Story = {
  args: { product: PRODUCT_DETAIL_PRODUCT },
  decorators: [content],
  globals: { viewport: { value: "mobile1" } },
};
