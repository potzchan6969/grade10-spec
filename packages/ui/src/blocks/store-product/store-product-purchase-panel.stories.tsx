import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import {
  PRODUCT_DETAIL_STORY,
  PURCHASE_COPY,
  SOLD_OUT_PRODUCT_STORY,
} from "./fixtures";
import { StoreProductPurchasePanel } from "./store-product-purchase-panel";

const meta = {
  title: "Store Product/Purchase Panel",
  component: StoreProductPurchasePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    added: false,
    copy: PURCHASE_COPY,
    onAddToCart: fn(),
    onQuantityChange: fn(),
    quantity: 1,
    saleItem: PRODUCT_DETAIL_STORY.saleItem,
  },
} satisfies Meta<typeof StoreProductPurchasePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

function InteractivePurchasePanel({
  product,
}: {
  product: typeof PRODUCT_DETAIL_STORY;
}) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  return (
    <StoreProductPurchasePanel
      added={added}
      copy={PURCHASE_COPY}
      onAddToCart={() => setAdded(true)}
      onQuantityChange={setQuantity}
      quantity={quantity}
      saleItem={product.saleItem}
    />
  );
}

export const Default: Story = {
  render: () => <InteractivePurchasePanel product={PRODUCT_DETAIL_STORY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("radiogroup", { name: "Grade" })).toBeNull();
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

export const SoldOut: Story = {
  render: () => <InteractivePurchasePanel product={SOLD_OUT_PRODUCT_STORY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.getByText("This product is not for sale.")).toBeVisible();
    expect(canvas.queryByRole("radiogroup", { name: "Grade" })).toBeNull();
  },
};
