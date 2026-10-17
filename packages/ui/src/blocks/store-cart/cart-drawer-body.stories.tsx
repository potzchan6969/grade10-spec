import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { CartDrawerBody } from "./cart-drawer";
import {
  DEFAULT_CART_COPY,
  OVERFLOW_CART_ITEMS,
  PICTURE_CART_ITEM,
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
 * Per-row visuals live on [`CartItem`](?path=/docs/store-cart-blocks-cartitem--docs);
 * fetch-on-open loading lives on [`CartDrawer`](?path=/docs/store-cart-blocks-cartdrawer--docs).
 */
const meta = {
  title: "Store/Cart/Blocks/CartDrawerBody",
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

export const Pictures: Story = {
  args: {
    items: [{ ...PICTURE_CART_ITEM, imageAlt: "  " }, SAMPLE_CART_ITEMS[1]],
  },
};

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
    // shared-ui-store-cart-SC-44
    const canvas = within(canvasElement);
    const empty = canvasElement.querySelector('[data-slot="empty-state"]');
    expect(
      empty?.querySelector('[data-slot="empty-state-icon"]'),
    ).toBeInTheDocument();
    expect(
      empty?.querySelector('[data-slot="empty-state-title"]'),
    ).toHaveTextContent("Your cart is empty");
    expect(
      empty?.querySelector('[data-slot="empty-state-description"]'),
    ).toHaveTextContent("Items you add will appear here");
    expect(
      empty?.querySelector('[data-slot="empty-state-actions"]'),
    ).toBeNull();
    expect(canvas.queryByRole("button")).not.toBeInTheDocument();
  },
};

/** Shared interaction guard: rows remain visible and the list remains scrollable. */
export const InteractionPending: Story = {
  args: {
    interactionPending: true,
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const body = canvasElement.querySelector('[data-slot="cart-drawer-body"]');
    expect(body).toHaveClass("overflow-y-auto");
    const remove = canvas.getAllByRole("button", { name: "Remove item" })[0];
    expect(remove).toBeDisabled();
    remove.click();
    expect(args.onRemoveItem).not.toHaveBeenCalled();
    expect(
      canvas.getByText("1999 Pokémon Base Set #4 Charizard Holo PSA 10"),
    ).toBeInTheDocument();
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

const OWNED_ITEMS: readonly CartItemSummary[] = SAMPLE_CART_ITEMS.map(
  (item) => ({ ...item, pending: false }),
);
const REMOVED_NAME = SAMPLE_CART_ITEMS[0].name;

function rowOf(canvasElement: HTMLElement, name: string) {
  const row = within(canvasElement)
    .getByText(name)
    .closest<HTMLElement>('[data-slot="cart-item"]');
  if (!row) throw new Error(`no cart row for ${name}`);
  return row;
}

/** A line that owns its removal stays, busy, until the consumer drops it, then leaves */
export const LineRemovalPending: Story = {
  render: (args) => {
    const [items, setItems] = useState(OWNED_ITEMS);
    return (
      <CartDrawerBody
        {...args}
        items={items}
        onRemoveItem={(id) => {
          args.onRemoveItem?.(id);
          setItems((prev) =>
            prev.map((i) => (i.id === id ? { ...i, pending: true } : i)),
          );
          window.setTimeout(
            () => setItems((prev) => prev.filter((i) => i.id !== id)),
            600,
          );
        }}
      />
    );
  },
  play: async ({ canvasElement, args }) => {
    const row = rowOf(canvasElement, REMOVED_NAME);
    const remove = within(row).getByRole("button", { name: "Remove item" });
    await userEvent.click(remove);
    expect(args.onRemoveItem).toHaveBeenCalledWith(SAMPLE_CART_ITEMS[0].id);
    expect(row).toHaveAttribute("aria-busy", "true");
    expect(row).toBeVisible();
    await userEvent.click(remove);
    expect(args.onRemoveItem).toHaveBeenCalledTimes(1);
    await waitFor(
      () =>
        expect(
          within(canvasElement).queryByText(REMOVED_NAME),
        ).not.toBeInTheDocument(),
      { timeout: 2000 },
    );
  },
};

/** A refused removal keeps the row, says why on it, and the row is usable again */
export const LineRemovalRefused: Story = {
  args: {
    items: [
      { ...OWNED_ITEMS[0], failed: "Couldn’t remove this item. Try again." },
      ...OWNED_ITEMS.slice(1),
    ],
  },
  play: async ({ canvasElement, args }) => {
    const row = rowOf(canvasElement, REMOVED_NAME);
    expect(within(row).getByRole("alert")).toHaveTextContent(
      "Couldn’t remove this item. Try again.",
    );
    expect(row).not.toHaveAttribute("aria-busy");
    await userEvent.click(
      within(row).getByRole("button", { name: "Remove item" }),
    );
    expect(args.onRemoveItem).toHaveBeenCalledWith(SAMPLE_CART_ITEMS[0].id);
  },
};
