import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PRODUCTS } from "./fixtures";
import { ProductGrid } from "./product-grid";

const meta = {
  title: "Store Product Listing/ProductGrid",
  component: ProductGrid,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: { products: PRODUCTS },
} satisfies Meta<typeof ProductGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** No products, no tiles. The empty and no-match messages are the listing
 * root's job, not the grid's. */
export const NoProducts: Story = { args: { products: [] } };

/** One column. The progression is four at desktop, two at tablet, one here. */
export const Narrow: Story = {
  globals: { viewport: { value: "mobile1" } },
};

/** The cart action is reported, not performed: the tile does not change until
 * the consumer supplies a new `addedToCart`. */
export const ActionIsReported: Story = {
  args: {
    products: [{ ...PRODUCTS[1], id: "reported" }],
    onProductAction: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const add = canvas.getByRole("button", { name: "Add" });

    await userEvent.click(add);

    expect(args.onProductAction).toHaveBeenCalledTimes(1);
    expect(args.onProductAction).toHaveBeenCalledWith("reported");
    // Still the add action — the tile did not move on its own.
    expect(canvas.getByRole("button", { name: "Add" })).toBeInTheDocument();
  },
};
