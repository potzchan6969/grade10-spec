import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { LISTING_COPY, PRODUCTS } from "./fixtures";
import { ProductList } from "./product-list";

const meta = {
  title: "Store Product Listing/ProductList",
  component: ProductList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    copy: LISTING_COPY,
    products: PRODUCTS,
    onProductClick: fn(),
  },
} satisfies Meta<typeof ProductList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No products, no tiles. The empty and no-match messages are the browse
 * root's job, not the list's. */
export const NoProducts: Story = { args: { products: [] } };

/** One column when the viewport cannot fit a 240px tile beside padding. */
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
    onProductCartQuantityChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    await userEvent.keyboard("{Enter}");

    expect(args.onProductCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onProductCartQuantityChange).toHaveBeenCalledWith(
      "reported",
      1,
    );
    expect(
      canvas.getByRole("button", { name: "Add to cart" }),
    ).toBeInTheDocument();
  },
};

/**
 * A tile's ceiling and remaining count travel on its `ProductSummary`, so the
 * listing supplies both per product rather than once for the grid.
 */
export const TileCeilingAndRemainingCount: Story = {
  args: {
    products: [
      {
        ...PRODUCTS[1],
        id: "bounded",
        inCart: true,
        cartCount: "2",
        maxCartQuantity: 2,
        remainingLabel: "Only 2 left",
      },
    ],
    onProductCartQuantityChange: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("Only 2 left")).toBeInTheDocument();

    await userEvent.click(
      canvas.getByRole("button", { name: "2. Adjust cart quantity" }),
    );
    const increment = canvas.getByRole("button", {
      name: "Increase quantity",
    });
    expect(increment).toBeDisabled();

    await userEvent.click(increment, { pointerEventsCheck: 0 });
    expect(args.onProductCartQuantityChange).not.toHaveBeenCalled();
  },
};
