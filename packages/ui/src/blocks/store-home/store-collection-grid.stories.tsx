import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, within } from "storybook/test";
import { COLLECTIONS } from "./fixtures";
import { StoreCollectionGrid } from "./store-collection-grid";

const meta = {
  title: "Store/Home/Blocks/StoreCollectionGrid",
  component: StoreCollectionGrid,
  tags: ["autodocs"],
  args: { collections: COLLECTIONS },
} satisfies Meta<typeof StoreCollectionGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    verification: { caseId: "vc_3e27d4a9-3b2e-4116-bafc-ac007fd5e3cc" },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("link", { name: /Pokémon/ })).toBeInTheDocument();
    expect(canvas.getByRole("link", { name: /Formula 1/ })).toBeInTheDocument();
  },
};
