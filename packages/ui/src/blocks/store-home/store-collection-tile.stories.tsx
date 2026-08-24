import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { StoreCollectionTile } from "./store-collection-tile";

const meta = {
  title: "Store Home/StoreCollectionTile",
  component: StoreCollectionTile,
  tags: ["autodocs"],
  args: {
    label: "Pokémon",
    icon: "🐭",
    href: "#pokemon",
  },
  decorators: [
    (Story) => (
      <div className="grid w-[540px] grid-cols-5 gap-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StoreCollectionTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {};

export const Featured: Story = {
  args: { featured: true },
  play: async ({ canvasElement }) => {
    const tile = canvasElement.querySelector(
      '[data-slot="store-collection-tile"]',
    );
    expect(tile).toHaveAttribute("data-featured");
  },
};

export const Activatable: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: /Pokémon/ })).toHaveAttribute(
      "href",
      "#pokemon",
    );
  },
};
