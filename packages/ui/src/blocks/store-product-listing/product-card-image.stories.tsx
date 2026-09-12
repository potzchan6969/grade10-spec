import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { PRODUCT_CARD_CART_COPY } from "./fixtures";
import { ProductCardImage } from "./product-card-image";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

const defaults = {
  copy: PRODUCT_CARD_CART_COPY,
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  onCartQuantityChange: fn(),
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
  args: { discounted: true },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const photo = canvasElement.querySelector("img");
    expect(canvas.getByText("SALE")).toBeInTheDocument();
    expect(photo).not.toBeNull();
    expect(getComputedStyle(photo as HTMLElement).opacity).toBe("1");
  },
};

export const SoldOut: Story = {
  args: { soldOut: true },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const photo = canvasElement.querySelector("img");
    expect(canvas.getByText("SOLD OUT")).toBeInTheDocument();
    expect(canvas.queryByText("SALE")).not.toBeInTheDocument();
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();
    expect(photo).not.toBeNull();
    expect(getComputedStyle(photo as HTMLElement).opacity).toBe("0.5");
  },
};

export const InCart: Story = {
  args: { inCart: true, cartCount: "1" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: /1\./i })).toBeVisible();
    expect(canvas.getByText("×1")).toBeInTheDocument();
  },
};

export const NoImage: Story = {
  args: { imageSrc: undefined },
  decorators: well,
  play: async ({ canvasElement }) => {
    expect(canvasElement.querySelector("img")).toBeNull();
  },
};

/** Keyboard focus reveals the cart control and activating it reports quantity 1. */
export const KeyboardRevealsCart: Story = {
  args: { onCartQuantityChange: fn() },
  decorators: well,
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });

    cart.focus();
    expect(cart).toHaveFocus();

    await userEvent.keyboard("{Enter}");

    expect(args.onCartQuantityChange).toHaveBeenCalledTimes(1);
    expect(args.onCartQuantityChange).toHaveBeenCalledWith(1);
  },
};

/**
 * `SC-66` — below the wide listing breakpoint the cart stays visible without
 * hover (Storybook mobile viewport).
 */
export const NarrowViewportCartVisible: Story = {
  args: { onCartQuantityChange: fn(), name: "Ninja Spinner booster box" },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
  },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cart = canvas.getByRole("button", { name: "Add to cart" });
    expect(cart).toBeVisible();
    const control = cart.closest(".cart-control");
    expect(control).not.toBeNull();
    expect(getComputedStyle(control as HTMLElement).opacity).toBe("1");
  },
};

/**
 * `SC-55` — a surface that merchandises rather than sells supplies no
 * quantity-change handler, so no cart control is drawn at rest, on hover, or
 * on focus. The tile itself still activates.
 */
export const DoesNotSell: Story = {
  args: {
    copy: { soldOut: "SOLD OUT", sale: "SALE" },
    name: "Ninja Spinner booster box",
    onClick: fn(),
  },
  decorators: well,
  render: (args) => (
    <ProductCardImage {...args} onCartQuantityChange={undefined} />
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const tile = canvas.getByRole("button", {
      name: "Ninja Spinner booster box",
    });

    await userEvent.hover(tile);
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();

    tile.focus();
    expect(
      canvas.queryByRole("button", { name: "Add to cart" }),
    ).not.toBeInTheDocument();

    await userEvent.click(tile);
    expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};
