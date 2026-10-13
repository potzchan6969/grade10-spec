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
