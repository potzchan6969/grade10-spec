import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PRODUCTS } from "./fixtures";
import { ProductList } from "./product-list";

const meta = {
  title: "Store Product Listing/ProductList",
  component: ProductList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { products: PRODUCTS },
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No products, no tiles. The empty and no-match messages are the browse
 * root's job, not the list's. */
export const NoProducts: Story = { args: { products: [] } };

/** One column when the viewport cannot fit a 250px tile beside padding. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};

/** Appending the next page shows Boneyard skeleton tiles below the grid. */
export const LoadingMore: Story = {
  args: {
    loading: false,
    loadingMore: true,
    products: PRODUCTS,
  },
};

/** The cart action is reported, not performed: the tile does not change until
 * the consumer supplies a new `inCart`. */
export const ActionIsReported: Story = {
  args: {
    products: [{ ...PRODUCTS[1], id: "reported", inCart: false }],
    onProductAction: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    await userEvent.keyboard("{Enter}");

    expect(args.onProductAction).toHaveBeenCalledTimes(1);
    expect(args.onProductAction).toHaveBeenCalledWith("reported");
    expect(
      canvas.getByRole("button", { name: "Add to cart" }),
    ).toBeInTheDocument();
  },
};
