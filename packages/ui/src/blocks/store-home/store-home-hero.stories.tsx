import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, within } from "storybook/test";
import { StoreHomeHero } from "./store-home-hero";
import heroImage from "./store-home-hero.fixture.png";

const meta = {
  title: "Store Home/StoreHomeHero",
  component: StoreHomeHero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    copy: {
      eyebrow: "GRADE10",
      shopLabel: "Shop",
      auctionLabel: "Auction",
    },
    title: "Marketplace",
    description:
      "Et convallis massa risus habitant amet vitae commodo. Est etiam nunc ornare hendrerit felis nulla pulvinar non pellentesque.",
    imageSrc: heroImage,
    onShopClick: fn(),
    onAuctionClick: fn(),
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StoreHomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(
      canvas.getByRole("heading", { name: "Marketplace" }),
    ).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Shop" })).toBeInTheDocument();
    expect(canvas.getByRole("button", { name: "Auction" })).toBeInTheDocument();
  },
};

export const ShopOnly: Story = {
  args: { onAuctionClick: undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("button", { name: "Shop" })).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Auction" })).toBeNull();
  },
};
