import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { ProductCard } from "./product-card";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

const defaults = {
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  tags: ["Pokémon", "M4", "JP"],
  name: "Ninja Spinner",
  price: "HKD 105",
  originalPrice: "HKD 123",
  discountLabel: "SALE",
  actionLabel: "Add to cart",
  onClick: () => {},
  onAction: fn(),
};

const meta = {
  title: "Store Product Listing/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
  args: defaults,
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma `isSoldOut=false` — available product with a discount. */
export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.queryByRole("button", { name: /wishlist/i })).toBeNull();
    expect(canvas.getByText("SALE")).toBeInTheDocument();
    expect(canvas.queryByText("Pokémon")).toBeNull();
    expect(canvas.queryByText("M4")).toBeNull();
    expect(canvas.queryByText("JP")).toBeNull();
  },
};

/** Figma `isSoldOut=true` — dimmed photo, SOLD OUT badge, no cart action. */
export const SoldOut: Story = {
  args: { soldOut: true, onAction: undefined },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("SOLD OUT")).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Add to cart" })).toBeNull();
  },
};

/** The three rungs Figma draws, at the designed 260px width. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-start gap-10">
      <div className="w-[260px]">
        <ProductCard {...args} />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} addedToCart quantity={3} />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} onAction={undefined} soldOut />
      </div>
    </div>
  ),
};

/** Figma `isAddedToCart=true` — quantity badge on the cart button. */
export const AddedToCart: Story = {
  args: { addedToCart: true, quantity: 3 },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText("3")).toBeInTheDocument();
  },
};

/** `hasDiscount=false` — no badge and no strikethrough price. */
export const WithoutDiscount: Story = {
  args: { originalPrice: undefined, discountLabel: undefined },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
};

/** Boneyard capture target — keep `loading` at Figma's 260px card width. */
export const BoneyardCapture: Story = {
  args: { loading: true, name: "", price: "" },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
};
