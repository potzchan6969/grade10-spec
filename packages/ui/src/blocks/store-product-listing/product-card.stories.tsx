import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { ProductCard } from "./product-card";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

const defaults = {
  imageSrc: IMAGE,
  imageAlt: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  tags: ["Pokémon", "M4", "JP"],
  name: "Pokémon TCG Sealed Booster Box – Abyss Eye (M5)",
  price: "HK$105",
  originalPrice: "HK$123",
  saleLabel: "SALE",
  cartLabel: "Add to cart",
  onClick: () => {},
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

/** Figma `soldOut=false` — available product with a discount. */
export const Default: Story = {
  decorators: well,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: /wishlist/i })).toBeNull();
    expect(canvas.getByText("SALE")).toBeInTheDocument();
    expect(canvas.queryByText("Pokémon")).toBeNull();
    expect(canvas.queryByText("M4")).toBeNull();
    expect(canvas.queryByText("JP")).toBeNull();
  },
};

/** Figma `soldOut=true` — SOLD OUT badge, no cart action, tile inert. */
export const SoldOut: Story = {
  args: { soldOut: true, soldOutLabel: "SOLD OUT", saleLabel: undefined },
  decorators: well,
};

/** Figma `inCart=true` — cart control with the supplied count. */
export const InCart: Story = {
  args: { inCart: true, cartCount: "1" },
  decorators: well,
};

/** `hasDiscount=false` — current price only, no strikethrough. */
export const WithoutOriginalPrice: Story = {
  args: { originalPrice: undefined, saleLabel: undefined },
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
        <ProductCard
          {...args}
          saleLabel={undefined}
          soldOut
          soldOutLabel="SOLD OUT"
        />
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
    expect(canvas.getByText("3")).toBeInTheDocument();
  },
};

/** `hasDiscount=false` — no badge and no strikethrough price. */
export const WithoutDiscount: Story = {
  args: { originalPrice: undefined, saleLabel: undefined },
  decorators: well,
};

/** Boneyard capture target — keep `loading` at Figma's 260px card width. */
export const BoneyardCapture: Story = {
  args: { loading: true, name: "", price: "" },
  decorators: well,
};
