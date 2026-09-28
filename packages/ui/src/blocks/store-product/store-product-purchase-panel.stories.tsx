import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  PRODUCT_DETAIL_STORY,
  PURCHASE_COPY,
  SOLD_OUT_PRODUCT_STORY,
} from "./fixtures";
import { StoreProductPurchasePanel } from "./store-product-purchase-panel";

const ADD_MS = 400;

const meta = {
  title: "Store Product/Purchase Panel",
  component: StoreProductPurchasePanel,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
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
  const [loading, setLoading] = useState(false);

  return (
    <StoreProductPurchasePanel
      copy={PURCHASE_COPY}
      loading={loading}
      onAddToCart={() => {
        if (loading) return;
        setLoading(true);
        window.setTimeout(() => {
          setLoading(false);
          setQuantity(1);
        }, ADD_MS);
      }}
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
    expect(canvas.getByRole("button", { name: "Adding…" })).toBeDisabled();
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Add to cart" })).toBeEnabled();
    });
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "1",
    );
    expect(canvas.queryByText("Added to cart")).toBeNull();
  },
};

/**
 * Product-status SC-11: a browse count does not cap the requested quantity.
 * The product-detail fixture intentionally leaves the browse-only count out
 * of the purchase item, so the request reaches cart review unbounded.
 */
export const QuantityBeyondBrowseCount: Story = {
  render: () => <InteractivePurchasePanel product={PRODUCT_DETAIL_STORY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const increase = canvas.getByRole("button", {
      name: "Increase quantity",
    });

    await userEvent.click(increase);
    await userEvent.click(increase);
    await userEvent.click(increase);

    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "4",
    );
  },
};

export const SoldOut: Story = {
  render: () => <InteractivePurchasePanel product={SOLD_OUT_PRODUCT_STORY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.queryByText("This product is not for sale.")).toBeNull();
    expect(canvas.queryByRole("radiogroup", { name: "Grade" })).toBeNull();
  },
};

export const Loading: Story = {
  args: {
    loading: true,
    quantity: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Adding…" })).toBeDisabled();
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
  },
};
