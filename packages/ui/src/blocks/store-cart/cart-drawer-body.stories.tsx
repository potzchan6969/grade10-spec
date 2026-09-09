import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, within } from "storybook/test";
import { CartDrawerBody } from "./cart-drawer";
import {
  DEFAULT_CART_COPY,
  OVERFLOW_CART_ITEMS,
  SAMPLE_CART_ITEMS,
} from "./fixtures";
import type { CartItemSummary } from "./types";

const container: Decorator[] = [
  (Story) => (
    <div className="flex h-[540px] w-(--container-md) flex-col overflow-hidden rounded-2xl border border-border bg-sidebar">
      <Story />
    </div>
  ),
];

/**
 * Scrollable item container of the cart drawer (`4735:6493`).
 *
 * Owns list composition: overflow, empty, and mixed item states.
 * Per-row visuals live on [`CartItem`](?path=/docs/store-cart-cartitem--docs);
 * fetch-on-open loading lives on [`CartDrawer`](?path=/docs/store-cart-cartdrawer--docs).
 */
const meta = {
  title: "Store Cart/CartDrawerBody",
  component: CartDrawerBody,
  tags: ["autodocs"],
  decorators: container,
  args: {
    items: SAMPLE_CART_ITEMS,
    copy: DEFAULT_CART_COPY.item,
    emptyTitle: DEFAULT_CART_COPY.emptyTitle,
    emptyDescription: DEFAULT_CART_COPY.emptyDescription,
    onQuantityChange: fn(),
    onRemoveItem: fn(),
    onItemClick: fn(),
  },
} satisfies Meta<typeof CartDrawerBody>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default list: cart items only */
export const Default: Story = {
  render: (args) => {
    const [items, setItems] =
      useState<readonly CartItemSummary[]>(SAMPLE_CART_ITEMS);

    return (
      <CartDrawerBody
        {...args}
        items={items}
        onRemoveItem={(id) =>
          setItems((prev) => prev.filter((i) => i.id !== id))
        }
        onQuantityChange={(id, qty) =>
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
          )
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();
    expect(
      canvas.getByText("2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Your cart is empty")).not.toBeInTheDocument();
  },
};

/** Overflow list: 6 items rendered */
export const OverflowItems: Story = {
  args: {
    items: OVERFLOW_CART_ITEMS,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByText("2016 Pokémon 20th Anniversary Mario Pikachu PSA 10"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Your cart is empty")).not.toBeInTheDocument();
  },
};

/** Empty body: design-system empty state with no action button */
export const Empty: Story = {
  args: {
    items: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Your cart is empty")).toBeInTheDocument();
    expect(canvas.getByText("Items you add will appear here")).toBeInTheDocument();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

/** Mixed states: active items, sold out item, and quantity adjusted item */
export const MixedItemStates: Story = {
  render: (args) => {
    const [items, setItems] = useState<readonly CartItemSummary[]>([
      SAMPLE_CART_ITEMS[0],
      {
        id: "item-sold",
        name: "2000 Neo Genesis 1st Edition Lugia Holo #9 BGS 9.5",
        price: "HK$18,200.00",
        quantity: 1,
        status: "soldOut",
      },
      {
        id: "item-adj",
        name: "2002 Yu-Gi-Oh! LOB Blue-Eyes White Dragon 1st Edition PSA 9",
        price: "HK$8,900.00",
        quantity: 1,
        maxQuantity: 1,
        status: "adjusted",
      },
    ]);

    return (
      <CartDrawerBody
        {...args}
        items={items}
        onRemoveItem={(id) =>
          setItems((prev) => prev.filter((i) => i.id !== id))
        }
        onQuantityChange={(id, qty) =>
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
          )
        }
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Sold Out")).toBeInTheDocument();
    expect(
      canvas.getByText("Low stock. Quantity adjusted"),
    ).toBeInTheDocument();
    expect(canvas.queryByText("Your cart is empty")).not.toBeInTheDocument();
  },
};
