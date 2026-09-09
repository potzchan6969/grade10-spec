import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { PRODUCT_CARD_CART_COPY } from "./fixtures";
import { ProductCard } from "./product-card";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

/** The words every tile renders the same, supplied once. */
const copy = PRODUCT_CARD_CART_COPY;

const defaults = {
  copy,
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  tags: ["Pokémon", "M4", "JP"],
  name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$105",
  onClick: () => {},
  /** The listing's tile sells, so its stories wire the handler that draws the cart. */
  onCartQuantityChange: () => {},
};

const meta = {
  title: "Store Product Listing/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  args: defaults,
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const well: Decorator[] = [
  (Story) => (
    <div className="w-[260px]">
      <Story />
    </div>
  ),
];

/** Figma `soldOut=false` — available product at list price. */
export const Default: Story = {
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: /wishlist/i })).toBeNull();
    expect(canvas.queryByText("SALE")).not.toBeInTheDocument();
    expect(canvas.queryByText("Pokémon")).toBeNull();
    expect(canvas.queryByText("M4")).toBeNull();
    expect(canvas.queryByText("JP")).toBeNull();
  },
};

/** Strikethrough original price and SALE badge when a discount is supplied. */
export const OnSale: Story = {
  args: { originalPrice: "HK$123" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SALE")).toBeInTheDocument();
    expect(canvas.getByText("HK$123")).toBeInTheDocument();
    expect(canvas.getByText("HK$105").className).toContain("text-success");
    expect(canvas.getByText("HK$105").className).toContain("font-medium");
  },
};

/** Figma `soldOut=true` — SOLD OUT badge, no cart action, tile inert. */
export const SoldOut: Story = {
  args: { soldOut: true },
  decorators: well,
};

/** Figma `inCart=true` — cart control with the supplied count. */
export const InCart: Story = {
  args: { inCart: true, cartCount: "1" },
  decorators: well,
};

/** The rungs Figma draws, at the designed 260px width. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-start gap-10">
      <div className="w-[260px]">
        <ProductCard {...args} />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} cartCount="1" inCart />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} originalPrice={undefined} soldOut />
      </div>
    </div>
  ),
};

/** Set annotation: quantity on the cart button when already in the cart. */
export const AddedToCart: Story = {
  args: { inCart: true, cartCount: "3" },
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("×3")).toBeInTheDocument();
  },
};

/** Boneyard capture target — keep `loading` at Figma's 260px card width. */
export const BoneyardCapture: Story = {
  args: { loading: true, name: "", price: "" },
  decorators: well,
};

/**
 * Scenario: A tile is named once. What the card is called is the product's
 * own name, and what the cart control is called is the list's word for it —
 * neither repeated in a prop of its own.
 */
export const NamedOnce: Story = {
  decorators: well,
  args: { onCartQuantityChange: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getAllByRole("button", { name: defaults.name }).length,
    ).toBeGreaterThan(0);
    expect(canvas.getByRole("button", { name: copy.cart })).toBeInTheDocument();
  },
};
