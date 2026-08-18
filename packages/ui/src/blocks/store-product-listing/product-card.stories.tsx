import { Badge } from "@grade10/design-system/components/display/badge";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { ProductCard } from "./product-card";

const IMAGE = new URL("./product-card.fixture.png", import.meta.url).href;

const badges = (
  <>
    <Badge size="sm">Pokémon</Badge>
    <Badge size="sm">M4</Badge>
    <Badge size="sm">JP</Badge>
  </>
);

const defaults = {
  imageSrc: IMAGE,
  imageAlt: "Ninja Spinner booster box",
  badges,
  name: "Ninja Spinner",
  price: "HKD 105",
  originalPrice: "HKD 123",
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

/** Figma `soldOut=false` — image, badge slot, name, prices. */
export const Default: Story = { decorators: well };

/** Figma `soldOut=true` — dimmed photo, SOLD OUT badge, no cart. */
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

/** Boneyard capture target — keep `loading` at Figma's 260px card width. */
export const BoneyardCapture: Story = {
  args: { loading: true, name: "", price: "" },
  decorators: well,
};
