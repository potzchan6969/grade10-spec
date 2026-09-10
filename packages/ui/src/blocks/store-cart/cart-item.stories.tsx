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

/**
 * Cart line item (`4761:1494`, `4765:2301`, `4761:1486`).
 *
 * Owns per-row visuals: default/stepper, catalogue sale, product coupon, sold
 * out, quantity adjusted, and row bones. Product coupons show the code on the
 * line with the discounted unit price — not as a footer discount row.
 * List composition lives on [`CartDrawerBody`](?path=/docs/store-cart-cartdrawerbody--docs).
 */
const meta = {
  title: "Store Cart/CartItem",
  component: CartItem,
  tags: ["autodocs"],
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

/** Default active item with stepper — catalogue price only, no sale or coupon */
export const Default: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      quantity: 2,
      maxQuantity: 5,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(canvas.queryByText("HK$26,000.00")).not.toBeInTheDocument();

    const increaseBtn = canvas.getByRole("button", {
      name: "Increase quantity",
    });
    await userEvent.click(increaseBtn);
    expect(args.onQuantityChange).toHaveBeenCalledWith(3);
  },
};

/** Catalogue sale — compare-at struck through; no promo code on the line */
export const SalePrice: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      price: "HK$24,500.00",
      originalPrice: "HK$26,000.00",
      quantity: 1,
      maxQuantity: 5,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$26,000.00")).toBeInTheDocument();
    expect(canvas.queryByText("POKEMON")).not.toBeInTheDocument();
  },
};

/**
 * Product promo/coupon — code under the price line with the discounted unit price.
 * That cut must not also appear as a footer `PromoState` discount row.
 */
export const ProductCoupon: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      couponCode: "POKEMON",
      price: "HK$22,050.00",
      originalPrice: "HK$24,500.00",
      quantity: 1,
      maxQuantity: 5,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("POKEMON")).toBeInTheDocument();
    expect(canvas.getByText("HK$22,050.00")).toBeInTheDocument();
    expect(canvas.getByText("HK$24,500.00")).toBeInTheDocument();
  },
};

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

/** Boneyard skeleton loading state while fetching item details */
export const Loading: Story = {
  args: {
    loading: true,
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

/**
 * Scenario: shared-ui-store-cart-SC-17 - The stepper stops at the maximum, and
 * shared-ui-store-cart-SC-19 - decrement still works there. Cover over the
 * `StepperInput` bound the line has always relied on.
 */
export const AtLineMaximum: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      quantity: 2,
      maxQuantity: 2,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const increment = canvas.getByRole("button", {
      name: DEFAULT_CART_COPY.item.increaseQtyLabel,
    });
    expect(increment).toBeDisabled();

    await userEvent.click(increment, { pointerEventsCheck: 0 });
    expect(args.onQuantityChange).not.toHaveBeenCalled();

    await userEvent.click(
      canvas.getByRole("button", {
        name: DEFAULT_CART_COPY.item.decreaseQtyLabel,
      }),
    );
    expect(args.onQuantityChange).toHaveBeenCalledWith(1);
  },
};

/**
 * Scenario: shared-ui-store-cart-SC-18 - A line supplied no maximum keeps a
 * stepper that counts on.
 */
export const NoLineMaximum: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      quantity: 2,
      maxQuantity: undefined,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const increment = canvas.getByRole("button", {
      name: DEFAULT_CART_COPY.item.increaseQtyLabel,
    });
    expect(increment).toBeEnabled();

    await userEvent.click(increment);
    expect(args.onQuantityChange).toHaveBeenCalledWith(3);
  },
};
