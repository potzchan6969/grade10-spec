import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./product-card";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

const defaults = {
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  category: "POKÉMON",
  name: "Ninja Spinner",
  description: "M4, Japanese",
  price: "HKD 105",
  originalPrice: "HKD 123",
  discountLabel: "−15%",
  onClick: () => {},
};

const meta = {
  title: "Components/ProductCard",
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
};

/** Figma `isSoldOut=true` — dimmed photo, SOLD OUT badge, disabled action. */
export const SoldOut: Story = {
  args: { soldOut: true },
  decorators: [
    (Story) => (
      <div className="w-[260px]">
        <Story />
      </div>
    ),
  ],
};

/** Both rungs Figma draws, side by side, at the designed 260px width. */
export const States: Story = {
  render: (args) => (
    <div className="flex items-start gap-10">
      <div className="w-[260px]">
        <ProductCard {...args} />
      </div>
      <div className="w-[260px]">
        <ProductCard {...args} soldOut />
      </div>
    </div>
  ),
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
