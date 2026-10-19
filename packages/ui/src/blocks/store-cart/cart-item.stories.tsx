import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
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
 * Price treatments sit under Price, stock statuses under Status, stepper
 * bounds under Quantity and pictures under Picture. List composition lives on
 * [`CartDrawerBody`](?path=/docs/store-cart-blocks-cartdrawerbody--docs).
 */
const meta = {
  title: "Store/Cart/Blocks/CartItem",
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

/** Boneyard skeleton loading state while fetching item details */
export const Loading: Story = {
  args: {
    loading: true,
  },
};

/** Shared interaction guard: item actions stay visible but cannot dispatch. */
export const InteractionPending: Story = {
  args: {
    interactionPending: true,
    item: {
      ...SAMPLE_CART_ITEMS[0],
      quantity: 1,
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("button", {
        name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
      }),
    ).toBeDisabled();
    expect(canvas.getByRole("spinbutton")).toBeDisabled();
    expect(
      canvas.getByRole("button", { name: "Increase quantity" }),
    ).toBeDisabled();
    expect(canvas.getByRole("button", { name: "Remove item" })).toBeDisabled();

    canvas
      .getByRole("button", {
        name: "1999 Pokémon Base Set #4 Charizard Holo PSA 10",
      })
      .click();
    canvas.getByRole("button", { name: "Increase quantity" }).click();
    expect(args.onClickProduct).not.toHaveBeenCalled();
    expect(args.onQuantityChange).not.toHaveBeenCalled();
    expect(args.onRemove).not.toHaveBeenCalled();
  },
};
