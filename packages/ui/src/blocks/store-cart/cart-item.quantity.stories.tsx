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

/** Stepper bounds: at the supplied maximum, and counting on with none. */
const meta = {
  title: "Store/Cart/Blocks/CartItem/Quantity",
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
