import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
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

/** Price treatments: catalogue sale and product coupon. */
const meta = {
  title: "Store/Cart/Blocks/CartItem/Price",
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

const struck = (el: HTMLElement) =>
  getComputedStyle(el).textDecorationLine.includes("line-through");

/** A line on the site sale: the sale price beside the struck list price,
 * each the price of one, with hidden words saying which is charged. */
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
    // shared-ui-store-cart-SC-26
    const canvas = within(canvasElement);
    const price = canvas.getByText("HK$24,500.00");
    const listPrice = canvas.getByText("HK$26,000.00");
    expect(struck(price)).toBe(false);
    expect(struck(listPrice)).toBe(true);
    expect(price).toHaveTextContent("Sale price HK$24,500.00");
    expect(listPrice).toHaveTextContent("Was HK$26,000.00");
    expect(canvas.getByText("Sale price")).toHaveClass("sr-only");
    expect(canvas.getByText("Was")).toHaveClass("sr-only");
    expect(canvas.queryByText("POKEMON")).not.toBeInTheDocument();
  },
};

/** A list price equal to the price is still struck through. */
export const EqualListPrice: Story = {
  args: {
    item: {
      ...SAMPLE_CART_ITEMS[0],
      price: "HK$24,500.00",
      originalPrice: "HK$24,500.00",
      quantity: 1,
      maxQuantity: 5,
    },
  },
  play: async ({ canvasElement }) => {
    // shared-ui-store-cart-SC-52
    const prices = within(canvasElement).getAllByText("HK$24,500.00");
    expect(prices).toHaveLength(2);
    expect(prices.map(struck)).toEqual([false, true]);
  },
};

/** A line off the sale reads its price alone, with no hidden words. */
export const RegularPrice: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(struck(canvas.getByText(String(SAMPLE_CART_ITEMS[0].price)))).toBe(
      false,
    );
    expect(canvas.queryByText("Sale price")).not.toBeInTheDocument();
    expect(canvas.queryByText("Was")).not.toBeInTheDocument();
  },
};

/**
 * A code on the line, under the price with the discounted unit price. A code
 * shown on a line is outside the site sale and promo outcomes: a code that
 * meets a site sale reaches the drawer only as `PromoState`.
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
