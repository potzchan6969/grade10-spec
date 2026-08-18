import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { ProductCardImage } from "./product-card-image";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

const defaults = {
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  cartLabel: "Add to cart",
  onCartClick: fn(),
};

const meta = {
  title: "Store Product Listing/ProductCardImage",
  component: ProductCardImage,
  tags: ["autodocs"],
  args: defaults,
} satisfies Meta<typeof ProductCardImage>;

export default meta;
type Story = StoryObj<typeof meta>;

const well: Decorator[] = [
  (Story) => (
    <div className="w-[260px]">
      <Story />
    </div>
  ),
];

export const Default: Story = { decorators: well };

export const Sale: Story = {
  args: { saleLabel: "SALE" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SALE")).toBeInTheDocument();
  },
};

export const SoldOut: Story = {
  args: { saleLabel: "SALE", soldOut: true, soldOutLabel: "SOLD OUT" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SOLD OUT")).toBeInTheDocument();
    expect(canvas.queryByText("SALE")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();
  },
};

export const InCart: Story = {
  args: { inCart: true, cartCount: "1" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Add to cart" })).toBeVisible();
    expect(canvas.getByText("1")).toBeInTheDocument();
  },
};

export const NoImage: Story = {
  args: { imageSrc: undefined },
  decorators: well,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("img")).toBeNull();
  },
};

/** Keyboard focus reveals the cart control and activating it reports once. */
export const KeyboardRevealsCart: Story = {
  args: { onCartClick: fn() },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    expect(cart).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    expect(args.onCartClick).toHaveBeenCalledTimes(1);
  },
};
