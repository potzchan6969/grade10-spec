import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, userEvent, within } from "storybook/test";
import {
  PRODUCT_DETAIL_PRODUCT,
  SINGLE_VARIANT_PRODUCT,
  SOLD_OUT_PRODUCT,
} from "../pages/product-detail-content";
import { StoreProductPurchasePanel } from "./store-product-purchase-panel";

const meta = {
  title: "Store Product/Purchase Panel",
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePurchasePanel({
  product,
}: {
  product: typeof PRODUCT_DETAIL_PRODUCT;
}) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id ?? "",
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <StoreProductPurchasePanel
      added={added}
      onAddToCart={() => setAdded(true)}
      onQuantityChange={setQuantity}
      onSelectedVariantIdChange={(value) => {
        setSelectedVariantId(value);
        setQuantity(1);
        setAdded(false);
      }}
      quantity={quantity}
      selectedVariantId={selectedVariantId}
      variants={product.variants}
    />
  );
}

export const Default: Story = {
  render: () => <InteractivePurchasePanel product={PRODUCT_DETAIL_PRODUCT} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("radio", { name: /Standard/ })).toBeChecked();
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

export const SingleVariant: Story = {
  render: () => <InteractivePurchasePanel product={SINGLE_VARIANT_PRODUCT} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("radiogroup", { name: "Grade" })).toBeNull();
    expect(canvas.getByText("Standard")).toBeVisible();
  },
};

export const SoldOut: Story = {
  render: () => <InteractivePurchasePanel product={SOLD_OUT_PRODUCT} />,
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
