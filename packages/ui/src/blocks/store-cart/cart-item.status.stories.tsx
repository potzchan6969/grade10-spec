import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, within } from "storybook/test";
import { CartItem } from "./cart-drawer";
import { DEFAULT_CART_COPY, SAMPLE_CART_ITEMS } from "./fixtures";

const container: Decorator[] = [
  (Story) => (
    // Match drawer body inset (`px-6`) so the item fills the content column.
    <div className="w-(--container-md) overflow-hidden rounded-2xl border border-border bg-sidebar px-6 py-4">
      <Story />
    </div>
  ),
];

/** Stock statuses: sold out, quantity adjusted, and the remaining count. */
const meta = {
  title: "Store/Cart/Blocks/CartItem/Status",
  component: CartItem,
  decorators: container,
  args: {
    item: SAMPLE_CART_ITEMS[0],
    copy: DEFAULT_CART_COPY.item,
    onQuantityChange: fn(),
    onRemove: fn(),
    onClickProduct: fn(),
  },
} satisfies Meta<typeof CartItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Sold out item: dimmed appearance, "Sold Out" badge, and trash can removal icon */
export const SoldOut: Story = {
  args: {
    item: {
      id: "item-sold",
      name: "2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5",
      price: "HK$18,200.00",
      quantity: 1,
      status: "soldOut",
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sold Out")).toBeInTheDocument();
    const removeBtn = canvas.getByRole("button", { name: "Remove item" });
    await userEvent.click(removeBtn);
    expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};

/** Low stock warning when item quantity was automatically adjusted */
export const QuantityAdjusted: Story = {
  args: {
    item: {
      id: "item-adj",
      name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
      price: "HK$24,500.00",
      quantity: 2,
      maxQuantity: 2,
      status: "adjusted",
    },
  },
  parameters: {
    docs: {
      story: {
        // Keep the docs canvas on the opening state (qty 2 + low-stock warning).
        autoplay: false,
      },
    },
  },
  render: function QuantityAdjustedStory(args) {
    const initialQuantity = args.item.quantity;
    const [quantity, setQuantity] = useState(initialQuantity);
    const [instanceKey, setInstanceKey] = useState(0);

    return (
      <div>
        <CartItem
          key={instanceKey}
          {...args}
          item={{ ...args.item, quantity }}
          onQuantityChange={(next) => {
            setQuantity(next);
            args.onQuantityChange?.(next);
          }}
        />
        {/* Restores the opening visual after play so the canvas ends on qty 2 + warning */}
        <button
          type="button"
          className="sr-only"
          onClick={() => {
            setQuantity(initialQuantity);
            setInstanceKey((key) => key + 1);
          }}
        >
          Reset quantity adjusted story
        </button>
      </div>
    );
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("Low stock. Quantity adjusted"),
    ).toBeInTheDocument();
    expect(canvas.getByDisplayValue("2")).toBeInTheDocument();

    const increaseBtn = canvas.getByRole("button", {
      name: "Increase quantity",
    });
    expect(increaseBtn).toBeDisabled();

    const decreaseBtn = canvas.getByRole("button", {
      name: "Decrease quantity",
    });
    expect(decreaseBtn).toBeEnabled();

    await userEvent.click(decreaseBtn);
    expect(args.onQuantityChange).toHaveBeenCalledWith(1);
    expect(
      canvas.queryByText("Low stock. Quantity adjusted"),
    ).not.toBeInTheDocument();
    expect(
      canvas.getByRole("button", { name: "Remove item" }),
    ).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "Reset quantity adjusted story" }),
    );
    expect(
      canvas.getByText("Low stock. Quantity adjusted"),
    ).toBeInTheDocument();
    expect(canvas.getByDisplayValue("2")).toBeInTheDocument();
  },
};

/**
 * Scenario: shared-ui-store-cart-SC-20 - A remaining count is displayed as
 * supplied. A line already showing the low-stock warning shows both: one says
 * what was already changed, the other says what is left.
 */
export const RemainingCount: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      quantity: 2,
      maxQuantity: 2,
      status: "adjusted",
      remainingLabel: "Only 2 left",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByText("Only 2 left")).toHaveLength(1);
    expect(
      canvas.getByText(DEFAULT_CART_COPY.item.lowStockWarning),
    ).toBeInTheDocument();
  },
};

/**
 * Scenario: shared-ui-store-cart-SC-21 - No remaining count supplied, so the
 * line says nothing about what is left.
 */
export const NoRemainingCount: Story = {
  args: {
    item: { ...SAMPLE_CART_ITEMS[0], quantity: 1, maxQuantity: 5 },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByText(/left/i)).not.toBeInTheDocument();
  },
};
