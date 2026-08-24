import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { COLLECTIONS } from "./fixtures";
import { StoreCollectionGrid } from "./store-collection-grid";

const meta = {
  title: "Store Home/StoreCollectionGrid",
  component: StoreCollectionGrid,
  tags: ["autodocs"],
  args: { collections: COLLECTIONS },
} satisfies Meta<typeof StoreCollectionGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: /Pokémon/ })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /Formula 1/ })).toBeInTheDocument();
  },
};
