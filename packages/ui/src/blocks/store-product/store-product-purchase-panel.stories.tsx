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
  title: "Store/Product Page/Blocks/StoreProductPurchasePanel",
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

const ADD_REFUSAL = "The cart could not be changed. Try again.";

function InteractivePurchasePanel({
  product,
  refuses = false,
}: {
  product: typeof PRODUCT_DETAIL_STORY;
  refuses?: boolean;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addFailed, setAddFailed] = useState<string>();

  return (
    <StoreProductPurchasePanel
      addFailed={addFailed}
      copy={PURCHASE_COPY}
      loading={loading}
      onAddToCart={() => {
        if (loading) return;
        setLoading(true);
        setAddFailed(undefined);
        window.setTimeout(() => {
          setLoading(false);
          if (refuses) {
            setAddFailed(ADD_REFUSAL);
            return;
          }
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
  parameters: {
    verification: { caseId: "vc_b5849ef5-bd85-4e03-8e27-f774a2706048" },
  },
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
    expect(canvas.getByRole("button", { name: "Adding…" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
    // The stepper takes its reset value in an effect, a render after the
    // button's label returns, so both are waited for.
    await waitFor(() => {
      expect(canvas.getByRole("button", { name: "Add to cart" })).toBeEnabled();
      expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
        "1",
      );
    });
    expect(canvas.queryByText("Added to cart")).toBeNull();
  },
};

/**
 * Scenario: grade10-site-store-product-page-SC-33 - The page exposes no
 * shopper-facing variant choice and adds the one supplied sale item.
 */
export const AddsOneItemWithoutVariantChoice: Story = {
  parameters: {
    verification: { caseId: "vc_eb125a06-843c-4da8-a9b4-731def7005df" },
  },
  args: {
    onAddToCart: fn(),
    saleItem: PRODUCT_DETAIL_STORY.saleItem,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("radiogroup")).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(args.onAddToCart).toHaveBeenCalledTimes(1);
  },
};

/**
 * Scenarios: grade10-site-commerce-product-status-SC-11 and SC-17 - a browse
 * count does not cap the requested quantity.
 * The product-detail fixture intentionally leaves the browse-only count out
 * of the purchase item, so the request reaches cart review unbounded.
 */
export const QuantityBeyondBrowseCount: Story = {
  parameters: {
    verification: { caseId: "vc_3d2700ac-2a84-41f6-983d-d43551fe2a14" },
  },
  render: () => <InteractivePurchasePanel product={PRODUCT_DETAIL_STORY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const increase = canvas.getByRole("button", {
      name: "Increase quantity",
    });

    await userEvent.click(increase);
    await userEvent.click(increase);
    await userEvent.click(increase);
    await userEvent.click(increase);

    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "5",
    );
    expect(canvas.queryByText(/Only \d+ left/i)).not.toBeInTheDocument();
  },
};

export const SoldOut: Story = {
  parameters: {
    verification: { caseId: "vc_fc9b5111-d727-4c56-895a-e6450c57bbd0" },
  },
  render: () => <InteractivePurchasePanel product={SOLD_OUT_PRODUCT_STORY} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("radiogroup")).not.toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Sold out" })).toBeDisabled();
    expect(canvas.queryByText("This product is not for sale.")).toBeNull();
    expect(canvas.queryByRole("radiogroup", { name: "Grade" })).toBeNull();
  },
};

export const Loading: Story = {
  parameters: {
    verification: { caseId: "vc_a210bb42-fa22-4c63-899f-cc382fcd0a4f" },
  },
  args: {
    loading: true,
    quantity: 2,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Adding…" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toBeDisabled();
  },
};

/** A refused add says why under the button, which is pressable again for a
 * retry; the chosen quantity stays. */
export const AddRefused: Story = {
  parameters: {
    verification: { caseId: "vc_fdccc214-813a-4cd5-a71f-8af22802924f" },
  },
  render: () => (
    <InteractivePurchasePanel product={PRODUCT_DETAIL_STORY} refuses />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Increase quantity" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Add to cart" }));
    expect(canvas.queryByRole("alert")).toBeNull();
    await waitFor(() =>
      expect(canvas.getByRole("alert")).toHaveTextContent(ADD_REFUSAL),
    );
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeEnabled();
    expect(canvas.getByRole("spinbutton", { name: "Quantity" })).toHaveValue(
      "2",
    );
  },
};
